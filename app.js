'use strict'
GLOBAL._s_config = require('./config');
GLOBAL._s_q = require('q');	
GLOBAL._s_u = require('underscore');

var app = require('koa')();
app.use(require('koa-logger')());
app.use(require('koa-cors')());
app.use(require('koa-bodyparser')());

var ssl = require('koa-ssl');
app.use(ssl());

var http = require('http');
//var https = require('https');

app.use(function*(next){
	app.keys = _s_config.app.keys;
	
	var load = require('./libraries/engine/loader')();

	load.update.base('util', 'helper', 'utilities')
	load.update.base('cache', 'engine', 'cache')
	load.update.base('db', 'engine', 'database')
	load.update.base('sf', 'library', 'storefront')
	load.update.base('req', 'engine', 'request', this.request)

	var parts = this.request.path.split('/');

	console.log("this is instantaneous 1")

	
	if(this.request.method == 'GET'){
		if(this.request.path == '/entities/a/confirm'){
			this.request.header.key = load.req.get('key');
			if(!this.request.header.key){
				this.body = { failure : { msg : 'GET requests to this endpoint require a proper authorization key.' , code : 300 } };
				return;
				}
			}
		else{
			this.body = { failure : { msg : 'GET requests to this endpoint are not allowed.' , code : 300 } }
			}
		}
	else if(this.request.method != 'POST' ){
		this.body = { failure : { msg : 'This API only accepts POST requests.' , code : 300 } }
		return;
		}

	load.update.base('dt', 'engine', 'datetime')
	console.log("this is instantaneous 2")
	load.update.base('countries', 'engine', 'countries')
	console.log("this is instantaneous 3")
	load.update.base('l', 'engine', 'locales')
	console.log("this is instantaneous 4")
	yield load.update.yieldable('currency', 'engine', 'currency')
	console.log("this is instantaneous 5")
	load.update.base('dimensions', 'engine', 'dimensions')
	console.log("this is instantaneous 6")
	load.update.base('common', 'engine', 'common')
	console.log("this is instantaneous 7")
	load.update.base('loc', 'engine', 'location')
	console.log("this is instantaneous 8")

	
	console.log("this is instantaneous 9")

	if(parts[2] == 'a' || parts[2] == 'c'){
		// means this path needs to be authorized or logged in

		// first we check to see if there was a key sent
		if(!this.request.header.key){ this.body = { failure : { msg : 'You did not submit the proper credentials.' , code : 101 } };  return; }
		load.auth_key = this.request.header.key

		var t = yield load.update.yieldable('t1', 'object', 't1')
		if(t.failure) { this.body = { failure : t.failure } ; return; }

		load.auth_id = load.t1.profile.id()
		
		if(parts[2] == 'a'){
			if(this.request.header.entity && this.request.header.entity != load.auth_id){
				var checked = load.t1.entities.check(this.request.header.entity);
				if(checked){
					var t = yield load.update.yieldable(checked.object.type, 'object', checked.object.type, this.request.header.entity)
					if(t.failure) { this.body = { failure : t.failure } ; return; }

					load.entity = {
					 	id : this.request.header.entity,
					 	type : checked.object.type,
					 	object : load[checked.object.type]
						}
					}
				else{
					this.body = { failure : { msg : 'The entity information you submitted was not accurate.' , code : 300 } }
					return;
					}
				}
			else{

				load.entity = {
					id : load.auth_id,
					type : 't1',
					object : load.t1
					}
				}
			}
		else{

			load.entity = {
				id : load.auth_id,
				type : 't1',
				object : load.t1
				}
			}

		// check to make sure the entity is valid
		if(!load.entity.object.is.valid()) return { failure : { msg : 'This entity is not active at the current moment.' , code : 300 } }
		}

	var main_route = parts.shift() + parts.shift() + '/' + parts.shift();
	var target = parts.join('/');

	if(target.substring(target.length-1, target.length) == '/') target = target.substring(0,target.length-1);

	var r = load.controller(main_route);
	if(!r){  this.body = { failure : { msg : 'This is an invalid path.' , code : 300 } }; return; }	
	var func = yield r[target](load)

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

// http.createServer(app.callback()).listen(8000);
//https.createServer({
//	key : _s_fs.readFileSync('/root/sellyx/certs/ec_sellyx_com.key'),
//	cert : _s_fs.readFileSync('/root/sellyx/certs/star_sellyx_com.pem')
//	} , app.callback()).listen(443);
