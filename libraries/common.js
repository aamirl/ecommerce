// common.js is the file for the most commonly used functions

// Common Library

function Common(){

	}

Common.prototype = {
	helpers : {
		convert : function*(obj , library){
			return yield _s_util.convert.single({ data:obj, label:true, library:library });
			},
		},
	get : function*(obj , library){

		var _controller = _s_load.library(library);

		var results = yield _controller.model.get(obj);
		var self = this;

		if(results){

			if(obj.convert && obj.convert != 'false'){

				if(results.counter){
					var send = [];
					// means we are returning total too
					yield _s_util.each(results.data, function*(o,i){
						o.data.id = o.id;

						if(typeof _controller.helpers.convert == 'function') send.push(yield _controller.helpers.convert(o.data))
						else send.push(yield self.helpers.convert(o.data , library));
						})
					return { counter : results.counter , data : send };
					}

				if(typeof _controller.helpers.convert == 'function') return yield _controller.helpers.convert(results.data)
				else return yield self.helpers.convert(results.data , library);
				}	
			return results;
			}
		return false;
		},
	new : function*(data, library, convert){
		var self = this;
		var _controller = _s_load.library(library);

		var results = yield _controller.model.new(data);
		if(results) {
			data.id = results.id;

			if(!convert) return { success : { id : results.id  } }
			if(typeof _controller.helpers.convert == 'function') return { success : { data : yield _controller.helpers.convert(data) } }
			else return { success : {  data : yield self.helpers.convert(data , library) } }
			}
		return { failure : { msg : 'The '+library.substring(0,library.length-1)+' was not added at this time.' , code : 300 } }
		},
	update : function*(data, library, type){
		var self = this;
		var _controller = _s_load.library(library);

		var results = yield _controller.model.update(data);
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

			if(typeof _controller.helpers.convert == 'function') return { success : { data : yield _controller.helpers.convert(data , type) } }
			else return { success : {  data : yield self.helpers.convert(data , library) } }
			}
		return { failure : { msg : 'The '+library.substring(0,library.length-1)+' was not updated at this time.' , code : 300 } }
		},
	check : function*(obj){

		var lib = _s_load.library(obj.library);
		if(obj.type) var result = yield lib.model.get[obj.type](obj);
		else var result = yield lib.model.get(obj);


		if(!result) return { failure : { msg:'There was no data found with that information.' , code:300 }};
		if(!obj.corporate){

			if(obj.user && obj.seller){
				// means that it could be either or so we need to check and see what is going on in the document
				if(result.user) var iterator = 'user';
				else var iterator = 'seller'
				}
			else{
				var iterator = (obj.user?'user':'seller');
				}
			
			var id = (obj[iterator].id?obj[iterator].id: global['_s_'+iterator].profile.id() );

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
					var object = _s_util.array.find.object(result[obj[iterator]] , 'id' , id , true, iterator );
					if(!object) return { failure : 'The '+iterator+' could not be found.' };
					else var t = object.object[iterator].id;
					break;
				}
		
			if(t != id) return { failure : { msg: 'Oops! It looks like you do not have control over this particular '+obj.label+'.' , code : 300}};
			if(result.setup.active == 0 && result.setup.status == 0 ) return { failure : { msg: 'This '+obj.label+' is no longer active. Please contact Sellyx if you feel this message is in error.' , code:300 } };
			if(result.setup.locked == 1 ) return { failure : { msg : 'This '+obj.label+' has been locked by Sellyx. In order to make changes to this item, please contact Sellyx directly.' , code : 300} };
			if(_s_util.indexOf(obj.status , result.setup.status) == -1 ) return { failure : {msg: "The action you are trying to perform is not allowed on this "+obj.label+"." , code : 300 } };
			}

		if((!obj.activate && obj.activate != 0) && (!obj.locked && obj.locked != 0)){
			if(object) return { result : result, object : object }
			else return result;
			}

		obj.activate || obj.activate == 0 ? result.setup.status = parseInt(obj.activate) : null;
		(obj.locked || obj.locked == 0) && (result.setup.locked || result.setup.locked == 0)? result.setup.locked = obj.locked : null;

		if(!obj.active){
			if(result.setup.status == 2 || result.setup.status == 0) result.setup.active = 0;
			else if(result.setup.status == 1) result.setup.active = 1;
			}
		else{
			if(_s_util.indexOf(obj.active, result.setup.status) == -1 ) result.setup.active = 0
			else result.setup.active = 1
			}

		if(obj.type) var update = yield lib.model.update[obj.type](result);
		else var update = yield lib.model.update(result);


		if(update){
			if(obj.type) return { success : { data : yield lib.helpers.convert[obj.type](result,obj[iterator]) } }
			else return { success : { data : yield lib.helpers.convert(result,obj[iterator]) } }
			}
		
		return { failure : { msg :'The request could not be completed at this time and the '+obj.label+' could not be modified.' , code : 300 }  };
		}
	}

module.exports = function(){
  	if(!(this instanceof Common)) { return new Common(); }
	}