 

var client = require('co-redis')(require('redis').createClient());
// var client = require('co-redis')(require('redis').createClient('6379' , 'sellyxmain.7dt6se.ng.0001.usw1.cache.amazonaws.com',{}));

function Cache(){
	
	}

Cache.prototype = {
	get key() {
		var self = this;
		return {
			set : function*(obj , value){
				var es_key = (obj && obj.cache_key ? {cache_key:obj.cache_key} :  undefined);
				var get = yield self.key.get(es_key);
				if(!get) get = {};
				
				try { 
					var schema = get;
					var path = (obj.key?obj.key:obj).split('.');
					var len = path.length;

					for(var i = 0; i < len-1; i++) {
						var elem = path[i];
						if( !schema[elem] ) schema[elem] = {}
						schema = schema[elem];
						}

					schema[path[len-1]] = (value?value:obj.value);
					self.set({ key : (!es_key?'ec-'+_s_cache_id:(typeof es_key == 'object'?'ec-'+es_key.cache_key:es_key)) , value : get });
					return true;
					}
				catch(err){
					return false;
					}
				},
			get : function*(obj, truthy, setter){
				var get = yield self.get('ec-' + (obj && obj.cache_key?obj.cache_key:(_s_cache_id?_s_cache_id:undefined)));
				if(typeof obj !== 'string'){
					return get;
					}

				try {
					var path = (obj.path?obj.path:obj);
					var o = get;
					path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
				    path = path.replace(/^\./, '');           // strip a leading dot
				    var a = path.split('.');
				    while (a.length) {
				        var n = a.shift();
				        if (n in o) {
				            o = o[n];
				        	} 
				        else {
				            return;
				        	}
				    	}

				    if(truthy) return _s_util.tf(o)
				    else return o;
					}
				catch (err){
					return false;
					}

				},
			delete : function*(obj){
				var es_key = (obj && obj.cache_key?obj.cache_key:(_s_cache_id?_s_cache_id:undefined))
				var get = yield self.key.get({cache_key:es_key});
				if(!get) return false;

				try {
					var schema = get;
					var path = (obj.path||obj).split('.');
					var len = path.length;
					for(var i = 0; i < len-1; i++) {
						var elem = path[i];
						if( !schema[elem] ) return false;
						schema = schema[elem];
						}
					
					delete schema[path[len-1]];
					self.set({ key : 'ec-'+es_key , value : get });
					return true;
					}
				catch(err){
					console.log(err);
					return false;
					}
				}
			}
		},
	get : function*(obj){
		var input = (typeof obj ==  'object' ? obj.key : obj);

		var r = yield client.get(input);

		if(r && r != undefined) {
			try{
				r = JSON.parse(r);
				return r;
				}
			catch(err){ return r }
			}
		return false;
		},
	set : function(obj, value){
		if(value){
			client.set(obj, JSON.stringify(value));
			return;
			}
		client.set(obj.key, JSON.stringify(obj.value));
		},
	delete : function(obj){
		if(!obj) {
			client.flushall();
			return;
			}
		var input = (typeof obj ==  'object' ? obj.key : obj);
		client.del(input);
		}
	}



module.exports = function(){
  	if(!(this instanceof Cache)) { return new Cache(); }
	}

