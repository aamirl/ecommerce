'use strict'
GLOBAL._s_config = require('./config');

var app = require('koa')();
GLOBAL._s_fs = require('fs');	
GLOBAL._s_q = require('q');	
app.keys = _s_config.app.keys;
GLOBAL._s_load = require('./libraries/engine/loader')();
GLOBAL._s_cache = _s_load.engine('cache');
GLOBAL._s_u = require('underscore');
GLOBAL._s_util = _s_load.helper('utilities');
GLOBAL._s_dt = _s_load.engine('datetime');
GLOBAL._s_db = _s_load.engine('database');	
GLOBAL._s_common = _s_load.engine('common');	
GLOBAL._s_sf = _s_load.engine('storefront');	

// GLOBAL._s_rmq = _s_load.engine('rabbit');
var paths = require('./paths');

app.use(require('koa-logger')());
app.use(require('koa-cors')());
app.use(require('koa-bodyparser')());
app.use(require('koa-generic-session')({
	store : require('koa-redis')(),
	ttl : 	345600000
	}));


app.use(function*(next){

	if(this.request.method != 'POST') {
		this.body = { failure : { msg : 'This API only accepts POST requests.' , code : 300 } }
		return;
		}

	GLOBAL._s_req = _s_load.engine('request' , this.request);
	GLOBAL._s_session = _s_load.engine('session' , this.session);
	GLOBAL._s_countries = _s_load.engine('countries');
	GLOBAL._s_l = _s_load.engine('locales');
	GLOBAL._s_loc = _s_load.engine('location' , this.request.ip);	

	var cached = undefined;	


	// first we see if this path is an auth
	var parts = this.request.path.split('/');

	if(parts[2] == 'a'){
		// means this path needs to be authorized or logged in

		// first we check to see if there was a key sent
		if(!this.request.header.key){
			this.body = { failure : { msg : 'You did not submit the proper credentials.' , code : 101 } } 
			return;
			}

		// now we check the cache to see if we have any info
		var cached = yield _s_cache.get('ec-' + this.request.header.key);
		if(!cached){
			// check oAuth server and see if user is logged in 

			var get = yield _s_req.koa({
			 	url :_s_config.oAuth+'/auth/validate?&key=' + this.request.header.key
			 	})

			if(get.failure){
				this.body = { failure : { msg : get.failure.msg , code : 101 } }
				return;
				}

			var id = get.success.data.id;

			// now we get the user information from the oAuth server
			var get = yield _s_req.koa({
				url :_s_config.oAuth+'/user?&id=' + id
				})

			if(typeof get == 'string'){
				this.body = { failure : { msg : 'The user does not exist.' , code : 100 } };
				return;
				}


			// now we need to check if the user exists in ES
			var _users = _s_load.engine('users');

			// let's check and see if the user exists in ES
			var result = yield _users.get(id);

			if(!result){
				// if he doesn't exist let's add him
				get.id = id;
				var create_user = yield _users.new(get);
				if(create_user.failure) {
					this.body = { failure : { msg : 'There was an error in registering your profile. Please try again later.' , code : 300 } }
					return;
					}
				result = create_user.success;
				}

			// now we can standardize the data and then set the key in the cache to it
			result = yield _users.helpers.cached(result , this.request.header.key);
			cached = { user : result } ;
			}

		GLOBAL._s_cache_key = this.request.header.key;
		GLOBAL._s_user = yield _s_load.object('users', cached.user);

		// console.log(_s_user.seller.id())

		if(_s_user.seller.id()){
			// if the user is a seller, let's see if we loaded their seller information in the cache
			var seller = yield _s_cache.key.get('seller');
			if(!seller){
				var r = yield _s_load.engine('sellers').get(_s_user.seller.id());
				r.fulfillment = _s_countries.fulfillment.fulfilled('240');

				yield _s_cache.key.set({key : 'seller', value : r });
				seller = r;
				}
			
			GLOBAL._s_seller = yield _s_load.object('sellers', seller);
			}
		}

	var main_route = parts.shift() + parts.shift() + '/' + parts.shift();
	var target = parts.join('/');

	var path = __dirname + '/controllers/' + main_route;
	var g = _s_fs.lstatSync(path+'.js');

	if(!g.isFile()){
	 	this.body = { failure : { msg : 'The requested path does not exist.1' , code : 300 } };
	 	return;
		}
	// try{
		var func = yield require(path)[target](app);
	// 	}
	// catch(err){
	// 	console.log(err);
		// this.body = { failure : { msg : 'The requested path does not exist.2' , code : 300 } }
		// return;
		// }
	
	if(typeof func === 'object'){
		if(func.body) this.body = JSON.parse(func.body);
		else this.body = func;
		}
	else this.body = { failure : { msg : 'The requested path does not exist.3' , code : 300 } };
	return;
	})


var server = app.listen(9000);