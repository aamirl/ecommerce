'use strict'
GLOBAL._s_config = require('./config');

var http = require('http');
//var https = require('https');

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
GLOBAL._s_sf = _s_load.library('storefront');

app.use(require('koa-logger')());
app.use(require('koa-cors')());
app.use(require('koa-bodyparser')());
app.use(require('koa-generic-session')({
	store : require('koa-redis')({db:3,host:'authdb.sellyx.com', port : '9979'}),
	// store : require('koa-redis')(),
	ttl : 	345600000
	}));

var ssl = require('koa-ssl');
app.use(ssl());

app.use(function*(next){

	GLOBAL._s_req = _s_load.engine('request' , this.request);
	var parts = this.request.path.split('/');
	
	if(this.request.method == 'GET'){
		if(this.request.path == '/entities/a/confirm'){
		// if(parts[2]=='a'){
			this.request.header.key = _s_req.get('key');
			if(!this.request.header.key){
				this.body = { failure : { msg : 'GET requests to this endpoint require a proper authorization key.' , code : 300 } };
				return;
				}
			}
		// else{
		// 	this.body = { failure : { msg : 'GET requests to this endpoint are not allowed.' , code : 300 } }
		// 	}
		}
	else if(this.request.method != 'POST' ){
		this.body = { failure : { msg : 'This API only accepts POST requests.' , code : 300 } }
		return;
		}

	GLOBAL._s_dt = _s_load.engine('datetime');
	GLOBAL._s_countries = _s_load.engine('countries');
	GLOBAL._s_l = _s_load.engine('locales');
	GLOBAL._s_currency = yield _s_load.engine('currency');
	GLOBAL._s_loc = _s_load.engine('location' , this.request.ip);
	GLOBAL._s_dimensions = _s_load.engine('dimensions');

	GLOBAL._s_entity = false;

	var cached = undefined;	

	// first we see if this path is an auth
	// first we see if this path is an auth

	if(parts[2] == 'a'){
		// means this path needs to be authorized or logged in

		// first we check to see if there was a key sent
		if(!this.request.header.key){ this.body = { failure : { msg : 'You did not submit the proper credentials.' , code : 101 } };  return; }
		
		var get = yield _s_req.sellyx({
			path : 'auth/validate',
			params : {key : this.request.header.key }
		 	})


		if(get.failure || !get.success.data.user){ this.body = { failure : get.failure||{ msg : 'You are not authorized to make this ecommerce request.' , code : 300 } }; return; }
		else{ get = get.success.data; }

		// this is the oauthid as well since we store the documents in ES using 
		GLOBAL._s_cache_id = get.user.id;
		GLOBAL._s_auth_key = this.request.header.key;
	
		// so now we check cache for user info. we update the cache no matter what with an updated document.
		// var cached = yield _s_cache.get('ec-' + id);
		// if(!cached){
			var _t1 = _s_load.library('t1');
			var result = yield _t1.get(_s_cache_id);

			if(!result){
				var create_user = yield _t1.new({data:get.user, raw:true});
				if(create_user.failure || !create_user) { this.body = { failure : create_user.failure||{ msg : 'There was an error in registering your profile for ecommerce. Please try again later.' , code : 300 } }; return; }
				result = create_user.success.data;
				}

			// now we can standardize the data and then set the key in the cache to it
			result = yield _t1.helpers.cached(result , _s_cache_id, get.user, true);
			cached = { t1 : result } ;
			// }

		GLOBAL._s_t1 = yield _s_load.object('t1', cached.t1.raw);

		if(this.request.header.entity && this.request.header.entity != _s_cache_id){
			var checked = _s_t1.entities.check(this.request.header.entity);
			if(checked){
				result = yield _s_load.library(checked.object.type).helpers.cached(this.request.header.entity, _s_cache_id, false, true);
				if(result.failure) return result;

				GLOBAL._s_entity = {
				 	id : this.request.header.entity,
				 	type : checked.object.type,
				 	library : _s_load.library(checked.object.type),
				 	object : yield _s_load.object(checked.object.type, result.raw)
					}
				}
			else{
				this.body = { failure : { msg : 'The entity information you submitted was not accurate.' , code : 300 } }
				return;
				}
			}
		else{
			yield _s_cache.key.delete('entity');
			GLOBAL._s_entity = {
				id : _s_cache_id,
				type : 't1',
				library : _s_load.library('t1'),
				object : _s_t1
				}
			}

		// check to make sure the entity is valid
		if(!_s_entity.object.is.valid()) return { failure : { msg : 'This entity is not active at the current moment.' , code : 300 } }
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

	console.log(JSON.stringify(func))
	
	if(typeof func === 'object'){
		if(func.body) this.body = JSON.parse(func.body);
		else this.body = func;

		if(func.status) this.status = func.status;
		if(func.headers && func.headers.Location){
			this.set('Location',func.headers.Location)
			}

		}
	else this.body = { failure : { msg : 'The requested path does not exist.3' , code : 300 } };
	return;
	})

var server = app.listen(8080);

//http.createServer(app.callback()).listen(8080);
//https.createServer({
//	key : _s_fs.readFileSync('/root/sellyx/certs/ec_sellyx_com.key'),
//	cert : _s_fs.readFileSync('/root/sellyx/certs/star_sellyx_com.pem')
//	} , app.callback()).listen(443);
