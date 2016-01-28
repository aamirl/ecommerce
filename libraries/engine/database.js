
// var mysql_driver = require('mysql2');

// var mysql = mysql_driver.createConnection({
// 	host : 'sellyx.cc0u3pgdgukn.us-west-1.rds.amazonaws.com',
//  	database : 'sellyx_node',
//  	user : 'root',
//  	password : 'sellyxWin_23'
//  	});

var esearch = require('elasticsearch').Client({
	// host : 'http://localhost:9200/',
	host : 'http://authdb.sellyx.com:9980',
	log : 'trace'
	})

function Database(){ }

Database.prototype = {
	get sql() {
		var self = this;
		return {
			escape : function(input){
				return mysql.escape(input);
				},
			query : function(sql){
				var deferred = _s_q.defer();
				mysql.query(sql, deferred.makeNodeResolver());
				return deferred.promise.then(function(row){
					return row[0];
					})
				},

			execute : function(sql, params){
				
				},
			add : function(obj){
				
				obj.data.added = _s_dt.now.datetime();
				
				var deferred = _s_q.defer();
				mysql.query("INSERT INTO `" + obj.table + "` SET ?" , obj.data , deferred.makeNodeResolver());

				return deferred.promise.then(function(data){
					return data[0];
					})
				},
			update : function(obj){
				var deferred = _s_q.defer();
				var sql = "UPDATE " + obj.table + " SET ? WHERE ";
				var len = Object.keys(obj.conditions).length;
				var counter = 0;
				_s_u.each(obj.conditions, function(value, key){
					sql += key + ' = "' + value + '"';
					counter++;
					counter != len ? sql += ' AND ' : null;
					})

				mysql.query(sql, obj.data, deferred.makeNodeResolver());
				return deferred.promise.then(function(data){
					return data[0];
					})
				}
			}
		},
	get es() {
		var self = this;
		return {
			helpers : {
				process : function(obj){
					
					var send = [];
					var data = (obj.data ?  obj.data : obj);

					_s_u.each(data, function(doc,ind){
						var r = {
							id : doc._id,
							data : doc._source,
							version : doc._version,
							type : doc._type,
							index : doc._index
							}
						doc.sort?r.sort=doc.sort:null;
						send.push(r)
						})
					return send;
					}
				},
			add : function(obj, meta){
				if(!obj.body.setup){
					obj.body.setup = {
						active : 1,
						status : 1,
						added : _s_dt.now.datetime(),
						by : _s_t1.profile.id(),
						}
					}
				
				if(!obj.type) obj.type = 'base';
				if(obj.body.id){
					obj.id = obj.body.id;
					delete obj.body.id;
					}

				if(meta){
					if(meta.seller){
						obj.body.seller = {
							id : _s_seller.profile.id(),
							name : _s_seller.profile.name()
							}
						}
					if(meta.user){
						obj.body.user = _s_t1.helpers.data.document()
						}
					}

				// console.log(obj);

				var deferred = _s_q.defer();
				
				esearch.create(obj, deferred.makeNodeResolver());
				return deferred.promise.then(function(data){
					if(data[0].created){
						return { id : data[0]._id }
						}

					return false;
					} , function(err){
						console.log(err);
						})
				},
			update : function*(obj, meta){
				// first we see if there is a query, and if there is, we run a update by query

				if(obj.body && obj.body.query){

					return obj;

					var deferred = _s_q.defer();
					esearch.update_by_query(obj, deferred.makeNodeResolver());
					var data = yield deferred.promise.then(function(data){
						return data[0];
						})
					if(data.ok){
						return data.updated;
						}
					else{
						return false;
						}

					}

				if(obj.id && obj.data){
					var update = {
						index : obj.index,
						type : (obj.type?obj.type:'base'),
						id : obj.id,
						body : {
							script : 'ctx._source = merge',
							params : {
								merge : obj.data
								}
							}
						}
					}
				// if there are no params here, we expect a standardized version
				else if(!obj.body){
					var script = '';
					var update = {
						index : obj.index,
						type : (obj.type?obj.type:'base'),
						id : obj.id,
						body : {
							params : {

								}
							}
						}

					if(obj.seller){
						script += 'if(ctx._source.seller';
						if(obj.seller instanceof Object) {
							update.body.params.seller = obj.seller.id;
							script += '.id';
							}
						else{
							update.body.params.seller = obj.seller;
							script += '';
							}
						script += ' == seller){';
						}
					else if(obj.user){
						script += 'if(ctx._source.user';
						if(obj.user instanceof Object) {
							update.body.params.user = obj.user.id;
							script += '.id';
							}
						else{
							update.body.params.user = obj.user;
							script += '';
							}
						script += ' == user){';
						}

					// either we ae updating multiple parts of the document
					if(obj.targets){
						_s_u.each(obj.targets, function(dets, type){
							script += ' ctx._source.' + type;
							if(dets.merge) script += ' += ';
							else script += ' = ';
							script += type + '; ';
							update.body.params[type] = dets.doc;
							})
						}
					// or we are updating one part of the document
					else if(obj.target){
						script += ' ctx._source.' + obj.target;
						if(obj.merge) script += ' += ';
						else script += ' = ';
						script += ' merge; '
						update.body.params.merge = obj.doc;
						}
					// or we are updating the entire document with an object
					else{
						script += ' ctx._source ';
						if(obj.merge) script += ' += ';
						else script += ' = ';
						script += ' merge ';
						update.body.params.merge = obj.doc;
						}

					obj.seller || obj.user ? script += ' } ' : null;
					update.body.script = script;
					}
				
				var deferred = _s_q.defer();
				esearch.update(update, deferred.makeNodeResolver());
				var data = yield deferred.promise.then(function(data){
					return data[0];
					}, function(error){
						console.log(error);
						return error;
						})
				if(data._version){
					return data._version
					}
				return false;
				},
			bulk : function*(obj, meta){

				var deferred = _s_q.defer();
			
				esearch.bulk({body : obj}, deferred.makeNodeResolver());
				var data = yield deferred.promise.then(function(data){
					return data[0];
					})

				if(data.errors){
					return { failure : true }
					}
				else{
					return { success : true }
					}
				
				},
			get : function*(obj, meta){
				if(!(obj instanceof Object)){
					// if it is not an instance of an object it means we are simply passing in the type of object we wanna retrieve with the id, and we can get the id from meta
					
					obj = {
						index : obj,
						type : (obj.type?obj.type:'base'),
						id : (meta instanceof Object ? meta.id : meta)
						}
					}
				else if(!obj.type) obj.itype = 'base';


				if(meta && meta instanceof Object){
					if(meta.exclude){
						if(typeof meta.exclude != 'string') obj._source_exclude = meta.exclude.join(',');
						else obj._source_exclude = meta.exclude;
						}
					if(meta.include){
						if(typeof meta.include != 'string') obj._source_include = meta.include.join(',');
						else obj._source_include = meta.include;
						}
					}

				var deferred = _s_q.defer();
				esearch.get(obj, deferred.makeNodeResolver());
				var data = yield deferred.promise.then(function(data){
					return data[0];
					} , function(error){
						console.log(error);
						return error;
						})

				if(data.found){
					if(meta.objectify){
						return {
							id : data._id,
							data : data._source,
							version : data._version
							}
						}
					data._source.id = data._id;
					return data._source;
					}
				else{
					return false;
					}
				},
			count : function*(obj, meta){
				if(!obj.type) obj.type = 'base';

				var deferred = _s_q.defer();
				esearch.count(obj, deferred.makeNodeResolver());
				var data = yield deferred.promise.then(function(data){
					return data[0];
					} , function(error){
						console.log(error);
						return error;
						})

				if(data.count){
					return { count : data.count }
					}
				return false;
				},
			search : function*(obj, meta){
				if(meta){
					if(meta.exclude){
						!obj.body._source ? obj.body._source = {} : null;
						if(typeof meta.exclude != 'string') obj._source_exclude = meta.exclude.join(',');
						else obj._source_exclude = meta.exclude;
						}
					if(meta.include){
						!obj.body._source ? obj.body._source = {} : null;
						if(typeof meta.include != 'string') obj._source_include = meta.include.join(',');
						else obj._source_include = meta.include;
						}
					if(meta.x || meta.x == 0){
						obj.body.from = meta.x;
						}
					if(meta.y){
						obj.body.size = meta.y;
						}
					if(meta.active || meta.active == 0){
						if(!obj.body.query.bool){
							obj.body.query.bool = {must:[]};
							if(obj.body.query.match_all) delete obj.body.query.match_all;
							}
						obj.body.query.bool.must.push({ match : { 'setup.active' : meta.active } })
						}
					if(meta.status || meta.status == 0){
						if(!obj.body.query.bool){
							obj.body.query.bool = {must:[]};
							if(obj.body.query.match_all) delete obj.body.query.match_all;
							}
						obj.body.query.bool.must.push({ match : { 'setup.status' : meta.status } })
						}
					}
				else{
					obj.body.size = 100;
					obj.body.from = 0;
					}

				if(!obj.type) obj.type = 'base';
					
				var deferred = _s_q.defer();
				
				esearch.search(obj, deferred.makeNodeResolver());
				var data = yield deferred.promise.then(function(data){
					return data;
					})

				if(data[0].hits.total > 0){

					if (!meta.counter) return {  counter : data[0].hits.total , data : self.es.helpers.process(data[0].hits.hits)  }
					else return self.es.helpers.process(data[0].hits.hits);
					}
				else{
					return false;
					}

				}
			}
		}

	}

module.exports = function(){
  	if(!(this instanceof Database)) { return new Database(); }
	}