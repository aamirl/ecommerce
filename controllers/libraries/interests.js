// interests

function Interests(){}

Interests.prototype = {
	model : _s_load.model('interests'),
	get helpers() {
		var self = this;
		return {
			filters : function(){
				return {
					convert : { in:['true','false'] , default:'true' },
					include : { v:['isAlphaOrNumeric'], b:true },
					exclude : { v:['isAlphaOrNumeric'], b:true },
					x : { v:['isInt'] , b:true , default : 0 },
					y : { v:['isInt'] , b:true , default : 10 },
					count : { in:['true','false',true,false], b:true, default:false }
					}
				},
			validators : function(){
				return {
					id : {v:['isListing']},
					price : { v:['isPrice'] },
					message : { v:['isTextarea'] , b:true },
					contact : { in:['1','2','3','4','other'] },
					location : { in:['1','2'] }
					}
				},
			convert : function*(s){
				if(s instanceof Array) return yield _s_util.convert.multiple({data:s,label:true , library : 'interests'})
				else return yield _s_util.convert.single({data:s,label:true , library : 'interests'});
				}
			}
		},
	get : function*(obj){
		var self = this;
		var results = yield this.model.get(obj);
		var _listings = _s_load.library('listings');

		if(results){
			if(results.count) return { success : { data:results.count } }
			if(obj.convert && obj.convert != 'false'){
				if(results.counter){
					var send = [];
					// means we are returning total too
					yield _s_util.each(results.data, function*(o,i){
						o.data.id = o.id;
						if(obj.entity){
							var interest = _s_util.array.find.object(o.data.interests , 'id' , obj.entity , false, 'entity');
							if(!interest) return;
							else {
								o.data.interest = interest;
								delete o.data.interests;
								}
							send.push(yield _listings.helpers.convert(o.data));
							}
						})

					if(obj.endpoint){
						delete obj.endpoint;
						delete obj.deep_convert;
						return {success:{ counter : results.counter, data : send, filters : obj }};
						}

					return { counter : results.counter , data : send };
					}

				if(obj.endpoint){
					if(typeof _controller.helpers.convert == 'function') return { success : { data : yield _controller.helpers.convert(results) }}
					else return { success : { data : yield self.helpers.convert(results , library) } };
					}

				return yield _listings.helpers.convert(results);
				}	
			if(obj.endpoint) return { success : { data : results } }
			return results;
			}
			
		if(obj.endpoint){
			return { failure : { msg : 'No objects matched your query.' , code : 300 } };
			}
		return false;
		}

	}



module.exports = function(){
  	if(!(this instanceof Interests)) { return new Interests(); }
	}