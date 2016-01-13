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
GLOBAL._s_db = _s_load.engine('database');	
GLOBAL._s_common = _s_load.engine('common');	
GLOBAL._s_sf = _s_load.engine('storefront');



app.use(require('koa-logger')());
app.use(require('koa-cors')());
app.use(require('koa-bodyparser')());
app.use(require('koa-generic-session')({
	store : require('koa-redis')(),
	ttl : 	345600000
	}));


var ssl = require('koa-ssl');
app.use(ssl());

app.use(function*(next){

	// _s_cache.delete();
	// return;

	if(this.request.method != 'POST') {
		this.body = { failure : { msg : 'This API only accepts POST requests.' , code : 300 } }
		return;
		}

	GLOBAL._s_req = _s_load.engine('request' , this.request);
	GLOBAL._s_dt = _s_load.engine('datetime');
	GLOBAL._s_session = _s_load.engine('session' , this.session);
	GLOBAL._s_countries = _s_load.engine('countries');
	GLOBAL._s_l = _s_load.engine('locales');
	GLOBAL._s_currency = yield _s_load.engine('currency');
	GLOBAL._s_loc = _s_load.engine('location' , this.request.ip);

	GLOBAL._s_seller = false;

	var cached = undefined;	

	// first we see if this path is an auth
	var parts = this.request.path.split('/');
	// first we see if this path is an auth


	if(parts[2] == 'a'){
		// means this path needs to be authorized or logged in

		// first we check to see if there was a key sent
		if(!this.request.header.key){ this.body = { failure : { msg : 'You did not submit the proper credentials.' , code : 101 } };  return; }

		var get = yield _s_req.sellyx({
			path : 'auth/validate',
			params : {
				key : this.request.header.key
				}
		 	})

		if(get.failure){ this.body = { failure : get.failure||{ msg : 'You are not authorized to make this ecommerce request.' , code : 300 } }; return; }
		else{ get = get.success.data; }

		var id = get.user.id;
	
		// so now we check cache for user info. we update the cache no matter what with an updated document.
		var cached = yield _s_cache.get('ec-' + id);
		if(!cached){

			var _users = _s_load.engine('users');

			// let's check and see if the user exists in ES
			var result = yield _users.get(id);
			if(!result){
				// if user doesn't exist let's add them
				var create_user = yield _users.new(get.user);
				if(create_user.failure || !create_user) { this.body = { failure : { msg : 'There was an error in registering your profile for ecommerce. Please try again later.' , code : 300 } }; return; }
				result = create_user.success.data;
				}

			// now we can standardize the data and then set the key in the cache to it
			result = yield _users.helpers.cached(result , id, get.user);
			cached = { user : result } ;
			}

		GLOBAL._s_cache_key = id;
		GLOBAL._s_auth_key = this.request.header.key;
		GLOBAL._s_user = yield _s_load.object('users', cached.user);
	
		if(_s_user.seller.id()){
			// if the user is a seller, let's see if we loaded their seller information in the cache
			var seller = yield _s_cache.key.get('seller');
			if(!seller) seller = yield _s_load.engine('sellers').helpers.cached(_s_user.seller.id(),id);

			var ty = yield _s_load.object('sellers', seller);
			if(ty.failure) { this.body = { failure : { msg : 'There was an issue loading your seller profile.' , code : 300 } }; return;  }
			GLOBAL._s_seller = ty;
			}
		}

	var main_route = parts.shift() + parts.shift() + '/' + parts.shift();
	var target = parts.join('/');

	// if there is a / at the end, substring
	if(target.substring(target.length-1, target.length) == '/') target = target.substring(0,target.length-1);

	var path = __dirname + '/controllers/' + main_route;
	var g = _s_fs.lstatSync(path+'.js');

	if(!g.isFile()){
	 	this.body = { failure : { msg : 'The requested path does not exist.1' , code : 300 } };
	 	return;
		}

	if(typeof require(path)[target] != 'function'){
		this.body = { failure : { msg : 'The requested path does not exist.2' , code : 300 } }
		return;
		}


	var func = yield require(path)[target](app);
	
	if(typeof func === 'object'){
		if(func.body) this.body = JSON.parse(func.body);
		else this.body = func;
		}
	else this.body = { failure : { msg : 'The requested path does not exist.3' , code : 300 } };
	return;
	})


var server = app.listen(9000);