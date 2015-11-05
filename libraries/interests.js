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
					y : { v:['isInt'] , b:true , default : 10 }
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
			if(obj.convert && obj.convert != 'false'){
				if(results.counter){
					var send = [];
					// means we are returning total too
					yield _s_util.each(results.data, function*(o,i){
						o.data.id = o.id;
						if(obj.user){
							var interest = _s_util.array.find.object(o.data.interests , 'id' , obj.user , false, 'user');
							if(!interest) return;
							else {
								o.data.interest = interest;
								delete o.data.interests;
								}
							send.push(yield _listings.helpers.convert(o.data));
							}
						})
					return { counter : results.counter , data : send };
					}
				return yield _listings.helpers.convert(results);
				}	
			return results;
			}
		return false;
		},
	get actions(){
		var self = this;
		return {
			status : function*(obj){
				!obj?obj={}:null;

				var r = {
					id : {v:['isLocalListing']},
					status : { in:[1,2,'1','2'] }
					}

				obj.corporate ? r.status = { in:[0,1,2,'0','1','2'] } : null;

				var data = _s_req.validate(r);
				if(data.failure) return data;

				var v = {
					id : data.id,
					library : 'products',
					type : 'listing',
					label : 'listing',
					seller : obj.seller,
					deep : {
						array : 'sellers',
						property : 'id',
						value : data.id,
						status : {
							allowed : [9],
							change : data.status
							}
						},
					corporate : (obj.corporate?_s_corporate.profile.master():null),
					status : {
						allowed : [1,2]
						},
					send : 'object'
					}

				obj.corporate ? v.status = [0,1,2] : null;
				return yield _s_common.check(v);
				}

			}

		}

	}



module.exports = function(){
  	if(!(this instanceof Interests)) { return new Interests(); }
	}