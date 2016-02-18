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
		},
	new : function*(){
		
		var data = _s_req.validate({
			id : { v:['isAlphaOrNumeric'] },
			price : { v:['isPrice'] },
			contact : {
				dependency : true,
				data : {
					1 : 'none',		// contact through sellyx
					2 : 'none',		// contact through sellyx email
					3 : 'none',		// contact through sellyx phone
					4 : 'none',		// contact through sellyx email and/or phone
					5 : {
						custom : { v:['isAlphaOrNumeric'] }
						}
					}
				},
			message : { v:['isAlphaOrNumeric'] , b:true }
			})

		if(data.failure) return data;

		// first get the listing
		var result = yield _s_load.library('listings').get(data.id);
		if(!result) return {failure:{msg:'The listing was not found.' , code : 300}}
		if(result.setup.active == 0) return { failure : { msg : 'This listing is not active.' , code : 300 } }
		if(result.payment_type == 1) return { failure : { msg : 'Unfortunately, you cannot submit an interest for this listing.', code : 300 } }

		// find and see if the user has submitted an interest for the item before
		var r = _s_util.array.find.object(result.interests, 'id', _s_t1.profile.id(), 'entity');
		if(r) return { failure : { msg : 'You have already submitted an interest for this item. Please wait for the seller to get back to you or go to your interests and send them a message about the listing.', code : 300  } }

		switch(data.contact){
			case 1:
			case "1":
				data.contact = [];
				break;
			case 2:
			case "2":
				data.contact = [_s_t1.profile.email.id()]
				break;
			case 3:
			case "3":
				data.contact = [_s_t1.profile.contact.primary()]
				break;
			case 4:
			case "4":
				data.contact = [_s_t1.profile.email.id() , _s_t1.profile.contact.primary()]
				break;
			case 5:
			case "5":
				data.contact = [data.custom]
				break;
			}

		var t = {
			interest : _s_common.helpers.generate.id(),
		 	entity : _s_t1.helpers.data.document(),
		 	price : data.price,
		 	contact : data.contact,
		 	location : _s_loc.active.get(),
		 	messages : [
		 		],
		 	setup : {
		 		active : 1,
		 		status : 1,
		 		added : _s_dt.now.datetime()
		 		}
			}
		if(data.message) t.messages.push({ message : data.message, by : 1, on: _s_dt.now.datetime() })

		result.interests.push(t);
		var t = yield _s_common.update(result, 'listings', true);
		if(!t||t.failure)  return { failure : { msg : 'Your interest was not added.', code : 300 } }
		return { success : { msg : 'Your interest was successfully added.' , code : 300 } }
		}
	}



module.exports = function(){
  	if(!(this instanceof Interests)) { return new Interests(); }
	}