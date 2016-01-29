// t1 Library

function T1(){}

T1.prototype = {
	model : _s_load.model('t1'),
	get helpers(){
		var self = this;
		return {
			filters : function(){
				return {
					id : { v:['isUser'] , b:true },
					q : { v: ['isSearch'] , b:true},
					all : { in:['true','false'] , default : 'false' },
					convert : { in:['true','false'] , default : 'true' },
					include : { v:['isAlphaOrNumeric'], b:true },
					exclude : { v:['isAlphaOrNumeric'], b:true },
					active : { v:['isAlphaOrNumeric'], b:true },
					x : { v:['isInt'] , b:true , default : 0 },
					y : { v:['isInt'] , b:true , default : 10 },
					count : { in:['true','false',true,false], b:true, default:false }
					}
				},
			cached : function*(result , key, oAuth_user, return_both){
				if(typeof result != 'object'){
					var result = yield self.get({id:result, convert:false, exclude:'reviews,follows'});
					if(!result) return { failure :  { msg : 'This user was not found' }}
					}

				if(result.addresses && result.addresses.length > 0) result.country = result.addresses[0].country
				else result.country = _s_countries.active.get(); 

				if(!oAuth_user){
					oAuth_user = yield _s_req.sellyx({
						path : 'auth/validate',
						params : {
							key : _s_auth_key
							}
					 	})
					
					if(oAuth_user.failure){ return { failure : {msg:'Authorization failure.',code:300} }; }
					else { oAuth_user = oAuth_user.success.data.user; }
					}

				result.email = {
					id : oAuth_user.email,
					verified : true
					}
				result.reputation = oAuth_user.reputation;
				result.numbers = [ { number : oAuth_user.telephone , primary : true } ]

				if(result.entities && result.entities.length > 0){

					}

				result.oAuth_setup = {
					status : oAuth_user.status,
					active : oAuth_user.active,
					added : oAuth_user.createdAt
					}
				
				converted = yield _s_util.convert.single({data:_s_util.clone.deep(result),label:true,library:'t1',dates:{r:true}});

				if(key) {
					if(typeof key !==  'string') key = _s_cache_id;
					yield _s_cache.key.set({ cache_key: key, key : 't1' , value : converted });
					}

				if(return_both) return { converted : converted, raw : result }
				return converted;
				},
			validators : {
				base : function(){
					return {
						id : { v:['isAlphaOrNumeric'], b:true },
						name : { 
							json : true,
							data : {
								first : { v:['isAlphaOrNumeric'] },
								middle : { v:['isAlphaOrNumeric'] , b:true },
								last : { v:['isAlphaOrNumeric'] },
								display : { v:['isAlphaOrNumeric'] },
								}
							},
						description : { v:['isAlphaOrNumeric'] , b:true, default : 'Introduce yourself to the world here' },
						tagline : { v:['isAlphaOrNumeric'] , b:true, default : 'Add a quick few words as a tagline about yourself.' },
						entities : {
							aao : true,
							b:true,
							default : [],
							data : {
								id : { in:[1,2,'1','2'], default : 1 },
								type : { in:[1,2,'1','2'], default : 1 },
								}
							},
						follows : { 
							aoo:true, 
							data : {
								id : { v:['isUser'] },
								name : { 
									display : { v:['isAlphaOrNumeric'] }
									},
								},
							default : [],
							b:true
							},
						faq : { 
							aoo : true,
							data : {
								q : { v:['isAlphaOrNumeric'] },
								a : { v:['isTextarea'] }
								}, 
							default : [] 
							},
						social : _s_common.helpers.validators.social(),
						currency : { in:_s_currency.helpers.valid(), b:true, default:'US' },
						standard : { in:['US','MT'], b:true, default:'MT' },
						addresses : _s_common.helpers.validators.address({aoo:true}),
						verifications : {
							json : true,
							b : true,
							default : { types : [] , verfied : false },
							data : {
								types : { v:['isArray'] },
								verified : { in : [false,true,'false','true'] }
								}
							},
						setup : {
							json : true,
							b:true,
							default:{ active : 1, status : 1, added : _s_dt.now.datetime() },
							data : {
								active : { in:[0,1] , b:true, default : 1 },
								status : { in:[0,1,2,3,4,5,6,7] , b:true, default : 1 },
								added : { v:['isDateTime'] , b:true, default : _s_dt.now.datetime() }
								}
							}
						}
					}
				}
			}
		},
	get : function*(obj){
		return yield _s_common.get(obj, 't1');
		},
	new : function*(obj){
		!obj?obj={}:null;

		var data = ( obj.data ? _s_req.validate({ validators : this.helpers.validators.base(), data : obj.data }) : _s_req.validate(this.helpers.validators.base()) );
		if(data.failure) return data; 

		return yield _s_common.new(data,'t1', (obj.raw?false:true) , (obj.id?false:true));
		},
	update : function*(obj){
		!obj?obj={}:null;
		// this is the update function for the t1 library for basic information
		// we are going to supply the information being updated here 
		var data = ( obj.data ? obj.data : _s_req.validate(this.helpers.validators.base({update:true})) );
		if(data.failure) return data;

		if(obj.id){
			obj.result = yield _s_load.library('t1').get(obj.id);
			if(obj.result.failure) return obj.result.failure
			}
		
		if(data.contact){
			obj.result.numbers[0].id = data.contact;
			delete data.contact;
			}

		delete obj.result.oAuth_setup;

		var r = yield _s_common.update(_s_util.merge(obj.result,data) , 't1');
		if(r.failure) return r;

		if(obj.return_target) return { success : { data : r.success.data[obj.return_target] } }
		return r;
		},
	actions : {
		new : {
			faq : function(obj){
				var r = _s_dt.now.datetime();
				var t = {
					q : obj.q||"Blank Question!",
					id :  _s_common.helpers.generate.id(),
					added :  r,
					}

				if(obj.a){
					t.a = obj.a;
					t.updated = r
					}

				return t;
				}
			}
		}
	}


module.exports = function(){
  	if(!(this instanceof T1)) { return new T1(); }
	}