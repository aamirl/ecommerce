// interests

function Interests(){}

Interests.prototype = {
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
					count : { in:['true','false',true,false], b:true, default:false },
					s_status : { csv_in:['0','1','2','3','4',0,1,2,3,4] , b:true },
					s_active : { csv_in:[1,0,"0","1"], b:true, default :[0,1] }
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

				if(s instanceof Array) return yield self._s.util.convert.multiple({data:s,label:true , library : 'interests'})
				else return yield self._s.util.convert.single({data:s,label:true , library : 'interests'});
				}
			}
		},
	get : function*(obj){
		var self = this;
		var results = yield this.model.get(obj);
		var _listings = this._s.library('listings');

		if(results){
			if(results.count) return { success : { data:results.count } }
			if(obj.convert && obj.convert != 'false'){
				if(results.counter){
					var send = [];
					// means we are returning total too
					yield this._s.util.each(results.data, function*(o,i){
						o.data.id = o.id;
						if(obj.entity){
							var interests = self._s.util.array.find.objects(o.data.interests , 'id' , obj.entity , false, false, 'entity');

							console.log(interests)
							if(!interests) return;
							
							yield self._s.util.each(interests, function*(interest,ind){

								if(obj.s_status){
									if(obj.s_status.constructor == Array){
										if(self._s.util.indexOf(obj.s_status, interest.setup.status) == -1) return
										}
									else{
										if(obj.s_status != interest.setup.status) return
										}
									}

								o.data.interest = interest;
								delete o.data.interests;

								send.push(yield _listings.helpers.convert(o.data))
								})

							}
						else{
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
		
		var data = this._s.req.validate({
			id : { v:['isAlphaOrNumeric'] },
			price : { v:['isPrice'] , b:true },
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
			message : { v:['isAlphaOrNumeric'] }
			})

		if(data.failure) return data;

		// first get the listing
		var result = yield this._s.library('listings').get(data.id);
		if(!result) return {failure:{msg:'The listing was not found.' , code : 300}}
		if(result.setup.active == 0) return { failure : { msg : 'This listing is not active.' , code : 300 } }
		if(result.payment_type == 1) return { failure : { msg : 'Unfortunately, you cannot submit an interest for this listing.', code : 300 } }

		// find and see if the user has submitted an interest for the item before
		var r = this._s.util.array.find.object(result.interests, 'id', this._s.t1.profile.id(), 'entity');
		if(r) return { failure : { msg : 'You have already submitted an interest for this item. Please wait for the seller to get back to you or go to your interests and send them a message about the listing.', code : 300  } }

		switch(data.contact){
			case 1:
			case "1":
				data.contact = [];
				break;
			case 2:
			case "2":
				data.contact = [this._s.t1.profile.email.id()]
				break;
			case 3:
			case "3":
				data.contact = [this._s.t1.profile.contact.primary().number]
				break;
			case 4:
			case "4":
				data.contact = [this._s.t1.profile.email.id() , this._s.t1.profile.contact.primary().number]
				break;
			case 5:
			case "5":
				data.contact = [data.custom]
				break;
			}

		console.log(data)

		var t = {
			interest : this._s.common.helpers.generate.id(),
		 	entity : this._s.t1.helpers.data.document(),
		 	price : data.price,
		 	contact : data.contact,
		 	location : this._s.loc.active.get(),
		 	messages : [
		 		],
		 	setup : {
		 		active : 1,
		 		status : 1,
		 		added : this._s.dt.now.datetime()
		 		}
			}
		if(data.message) t.messages.push({ message : data.message, by : 1, on: this._s.dt.now.datetime() })

		result.interests.push(t);
		var t = yield this._s.common.update(result, 'listings', true);
		if(!t||t.failure)  return { failure : { msg : 'Your interest was not added.', code : 300 } }
		return { success : { msg : 'Your interest was successfully added.' , code : 300 } }
		}
	}



module.exports = function(){ return new Interests(); }