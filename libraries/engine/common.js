// common.js is the file for the most commonly used functions

// Common Library

function Common(){ }

Common.prototype = {
	get helpers() {
		var self = this;
		return {
			convert : function*(obj , library, deep_convert){

				if(deep_convert){

					yield _s_util.each(deep_convert , function*(o_lib, o_key){
						if(obj[o_key]) {
							obj[o_key] = yield self.helpers.convert(obj[o_key] , o_lib);
							}
						})

					}

				if(obj.constructor == Array) return yield _s_util.convert.multiple({ data:obj, label:true, library:library });
				return yield _s_util.convert.single({ data:obj, label:true, library:library });
				},
			generate : {
				id : function(obj){
					return Math.floor(Math.random() * 1000000000)
					}
				},
			validators : {
				location : function(){
					return {
						json : true,
						data : {
							name : { v:['isAlphaOrNumeric'] },
							city : { v:['isAlphaOrNumeric'] , b:true },
							postal : { v:['isAlphaOrNumeric'] , b:true },
							coordinates : {
								json : true,
								data : {
									lat : {v:['isFloat']},
									lon : {v:['isFloat']},
									}
								},
							region : {
								json : true,
								b:true,
								data : {
									name : { v:['isAlphaOrNumeric'] },
									code : {v:['isAlphaOrNumeric'] }
									}
								},
							country : {
								json : true,
								b:true,
								data : {
									name : { v:['isAlphaOrNumeric'] },
									code : {v:['isAlphaOrNumeric'] }
									}
								}
							}
						}
					},
				address : function(obj){
					if(obj && obj.countryless){
						return {
							json : true,
							data : {
								street1 : { v:['isStreet']  },
								street2 : { v:['isStreet'] , b:true },
								city : { v:['isCity']  },
								state : { v:['isAlphaOrNumeric'] , b:true }
								}
							}
						}
					if(obj && obj.aoo){
						return { 
							aoo : true,
							data : {
								label : { v:['isAlphaOrNumeric'] , b:true, default : 'No Label' },
								street1 : { v:['isStreet'] },
								street2 : { v:['isStreet'] , default : "" , b:true },
								city : { v:['isCity'] },
								state : { v:['isAlphaOrNumeric'] , b:true },
								postal : { v:['isPostal'] , b:true, default :  _s_countries.active.postal.get() },
								country : { v:['isCountry'] , b:true, default :  _s_countries.active.get()}
								}
							}
						}

					if(obj && obj.label){
						return {
							json : true,
							data : {
								label : { v:['isAlphaOrNumeric'] , b:true, default : 'No Label' },
								street1 : { v:['isStreet']  },
								street2 : { v:['isStreet'] , b:true },
								city : { v:['isCity']  },
								state : { v:['isAlphaOrNumeric'] , b:true },
								postal : { v:['isPostal'] , b:true, default :  _s_countries.active.postal.get()},
								country : { v:['isCountry'] , b:true, default :  _s_countries.active.get()}
								}
							}
						}

					if(obj && obj.required){
						return {
							json : true,
							data : {
								street1 : { v:['isStreet']  },
								street2 : { v:['isStreet'] , b:true },
								city : { v:['isCity']  },
								state : { v:['isAlphaOrNumeric'] , b:true },
								postal : { v:['isPostal'] , b:true, default :  _s_countries.active.postal.get()},
								country : { v:['isCountry'] , b:true, default :  _s_countries.active.get()}
								}
							}
						}


					return {
						json : true,
						default : {
							postal : _s_countries.active.postal.get(),
							country :  _s_countries.active.get()
							},
						data : {
							street1 : { v:['isStreet'] , b:true },
							street2 : { v:['isStreet'] , b:true },
							city : { v:['isCity'] , b:true },
							state : { v:['isAlphaOrNumeric'] , b:true },
							postal : { v:['isPostal'] , b:true, default :  _s_countries.active.postal.get()},
							country : { v:['isCountry'] , b:true, default :  _s_countries.active.get()}
							}
						}
					}	
				}
			}
		},
	get : function*(obj , library){

		var _controller = _s_load.library(library);
		if(!_controller) _controller = _s_load.engine(library);

		var results = yield _controller.model.get(obj);
		var self = this;

		if(results){


			if(obj.convert && obj.convert != 'false'){

				if(results.counter){
					var send = [];
					// means we are returning total too

					yield _s_util.each(results.data, function*(o,i){
						o.data.id = o.id;

						if(obj.deep_convert){
							yield _s_util.each(obj.deep_convert , function*(o_lib, o_key){
								if(o.data[o_key]) {
									o.data[o_key] = yield self.helpers.convert(o.data[o_key] , o_lib);
									}
								})
							}

						if(typeof _controller.helpers.convert == 'function') send.push(yield _controller.helpers.convert(o.data))
						else send.push(yield self.helpers.convert(o.data , library));

						})

					if(obj.endpoint){
						delete obj.endpoint;
						delete obj.deep_convert;
						return {success:{ counter : results.counter, data : send, filters : obj }};
						}

					return { counter : results.counter , data : send };
					}

				if(obj.deep_convert){
					yield _s_util.each(obj.deep_convert , function*(o_lib, o_key){
						if(results.data[o_key]) results.data[o_key] = yield self.helpers.convert(results.data[o_key] , o_lib);
						})
	
					delete obj.deep_convert;
					}

				if(obj.endpoint){
					if(typeof _controller.helpers.convert == 'function') return { success : { data : yield _controller.helpers.convert(results) }}
					else return { success : { data : yield self.helpers.convert(results , library) } };
					}

				if(typeof _controller.helpers.convert == 'function') return yield _controller.helpers.convert(results)
				else return yield self.helpers.convert(results , library);
				}
			
			if(obj.endpoint) return { success : { data : results } }
			return results;
			}

		if(obj.endpoint){
			return { failure : { msg : 'No objects matched your query.' , code : 300 } };
			}

		return false;
		},
	new : function*(data, library, convert, raw_not_id){
		var self = this;
		var _controller = _s_load.library(library);
		if(!_controller) _controller = _s_load.engine(library);

		var results = yield _controller.model.new(data);
		if(results) {
			data.id = results.id;

			if(!convert){
				return { success : (raw_not_id?{data:data}:{ id : results.id  }) }
				}
			if(typeof _controller.helpers.convert == 'function') return { success : { data : yield _controller.helpers.convert(data) } }
			else return { success : {  data : yield self.helpers.convert(data , library) } }
			}
		return { failure : { msg : 'The '+library.substring(0,library.length-1)+' was not added at this time.' , code : 300 } }
		},
	update : function*(data, library, type, raw){
		var id = data.id;

		var _controller = _s_load.library(library);
		if(!_controller) _controller = _s_load.engine(library);

		var results = yield _controller.model.update(data);

		data.id = id;
		if(results) {

			if(type && type.constructor == Array){

				_s_u.each(type , function(o,i){

					var r = _s_util.array.find.object(data[o.replace] , o.target.id , o.target.data , false, o.target.depth);
					if(!r) return;
					else {
						data[o.insert] = r;
						delete data[o.replace];
						}
					})
				}

			if(raw) return data;
			if(typeof _controller.helpers.convert == 'function') return { success : { data : yield _controller.helpers.convert(data , type) } }
			else return { success : {  data : yield this.helpers.convert(data , library) } }
			}
		return { failure : { msg : 'The '+library.substring(0,library.length-1)+' was not updated at this time.' , code : 300 } }
		},
	check : function*(obj){

		var lib = _s_load.library(obj.library);
		if(obj.type && typeof lib.model.get[obj.type] == 'function') var result = yield lib.model.get[obj.type](obj);
		else var result = yield lib.model.get(obj);


		if(!result) return { failure : { msg:'There was no data found with that information.' , code:300 }};
		
		if(!obj.corporate){

			if(obj.deep){
				var object = _s_util.array.find.object(result[obj.deep.array] , obj.deep.property , obj.deep.value , true, (obj.deep.obj||null) );
				if(!object) return { failure : {msg:'The initial '+obj.label+' could not be found.' , code : 300 }  };
				}

			if(obj.deep.user || obj.deep.seller){
				var iterator = (obj.deep.user?'user':'seller');
				var id = obj.deep.user?obj.deep.user.id:obj.deep.seller.id;
				}
			else{
				if(obj.user && obj.seller){
					// means that it could be either or so we need to check and see what is going on in the document
					if(result.user) var iterator = 'user';
					else var iterator = 'seller'
					}
				else{
					var iterator = (obj.user?'user':'seller');
					}

				var id = (obj[iterator].id?obj[iterator].id: global['_s_'+iterator].profile.id() );
				}

			if(obj.deep && obj.deep[iterator] && object.object[iterator]){
				var t = object.object[iterator].id;
				}
			else{

				switch(obj[iterator].target){
					case 'flat':
						var t = result[iterator];
						break;
					case 'by':
						var t = result.setup[iterator];
						break;
					case true:
						var t = result[iterator].id;
						break;
					default : 
						var object = _s_util.array.find.object(result[obj[iterator].target] , 'id' , id , true, iterator );
						if(!object) return { failure : 'The '+iterator+' could not be found.' };
						else var t = object.object[iterator].id;
						break;
					}

				}

		
			if(t != id) return { failure : { msg: 'Oops! It looks like you do not have control over this particular '+obj.label+'.' , code : 300}};
			if(result.setup.active == 0 && result.setup.status == 0 ) return { failure : { msg: 'This '+obj.label+' is no longer active. Please contact Sellyx if you feel this message is in error.' , code:300 } };
			if(result.setup.locked == 1 ) return { failure : { msg : 'This '+obj.label+' has been locked by Sellyx. In order to make changes to this item, please contact Sellyx directly.' , code : 300} };
			if(_s_util.indexOf(obj.status.allowed , result.setup.status) == -1 ) return { failure : {msg: "The action you are trying to perform is not allowed on this "+obj.label+"." , code : 300 } };
			}

		if(obj.deep && obj.deep.additional_checks){
			var error = false;
			_s_u.each(obj.deep.additional_checks , function(v,k){

				if(object.object[k] != v){
					error = k;
					return false;
					}

				})

			if(error) return { failure : { msg : 'Unauthorized change; Error resulted from ' + error , code : 300 } };
			}


		if((obj.deep && !obj.deep.status.change && !obj.deep.status.change != 0) && (!obj.deep.locked && obj.deep.locked != 0) && !obj.status.change && obj.status.change != 0 && !obj.locked && obj.locked != 0 ){

			if(object) return { result : result, object : object }
			return result;

			}

		if(obj.deep){
			if(obj.deep.status.change || obj.deep.status.change == 0) (object.object.setup ? object.object.setup.status = parseInt(obj.deep.status.change) : object.object.status = parseInt(obj.deep.status.change));
			if(obj.deep.locked || obj.deep.locked == 0) object.object.setup.locked = obj.deep.locked;

			if(!obj.deep.active){
				if(object.object.setup && (object.object.setup.status == 2 || object.object.setup.status == 0)) (object.object.setup ? object.object.setup.active = 0 : object.object.active  = 0 );
				else if(object.object.setup && object.object.setup.status == 1) (object.object.setup ? object.object.setup.active = 1 : object.object.active = 1)
				}
			else{
				if(_s_util.indexOf(obj.deep.active, (object.object.setup?object.object.setup.status:object.object.status)) == -1) (object.object.setup?object.object.setup.active = 0:object.object.active=0)
				else (object.object.setup?object.object.setup.active = 1:object.object.active = 1);
				}
			}

		obj.status.change || obj.status.change == 0 ? result.setup.status = parseInt(obj.status.change) : null;
		((obj.locked || obj.locked == 0) && (result.setup.locked || result.setup.locked == 0)) ? result.setup.locked = obj.locked : null

		if(!obj.active){
			if(result.setup.status == 2 || result.setup.status == 0) result.setup.active = 0;
			else if(result.setup.status == 1) result.setup.active = 1;
			}
		else{
			if(_s_util.indexOf(obj.active, result.setup.status) == -1 ) result.setup.active = 0
			else result.setup.active = 1
			}

		if(obj.additional){
			result = _s_util.merge(result,obj.additional);
			}


		if(obj.type && typeof lib.model.update[obj.type] == 'function' ) var update = yield lib.model.update[obj.type](result);
		else var update = yield lib.model.update(result);

		// if(obj.type && typeof lib.model.update[obj.type] == 'function' ) var update = lib.model.update[obj.type](result);
		// else var update = lib.model.update(result);

		if(update){
			if(obj.send && obj.send == 'object' && object) result = object.object;

			console.log(obj);


			if(obj.type && typeof lib.helpers.convert[obj.type] == 'function'){
				return { success : { data : yield lib.helpers.convert[obj.type](result,obj[iterator]) } }
				}
			else {
				if(lib.helpers.convert) return { success : { data : yield lib.helpers.convert(result,obj[iterator]) } }
				else return { success : { data : yield this.helpers.convert(result,obj.library) } }
				}
			}
		
		return { failure : { msg :'The request could not be completed at this time and the '+obj.label+' could not be modified.' , code : 300 }  };
		}
	}

module.exports = function(){
  	if(!(this instanceof Common)) { return new Common(); }
	}