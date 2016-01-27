// t2 Library

function T2(){}

T2.prototype = {
	model : _s_load.model('t2'),
	get helpers(){
		var self = this;
		return {
			cached : function*(result, key, oAuth_entity , return_both){
				if(typeof result != 'object'){
					result = yield self.get({id:result, convert:false});
					if(!result) return { failure :  { msg : 'This entity was not found' , code : 300 } }
					}

				if(result.addresses.length > 0) result.country = result.addresses[0].country
				else result.country = _s_countries.active.get(); 

				if(!oAuth_entity){
					oAuth_entity = yield _s_req.sellyx({
						path : 'auth/validate',
						params : {
							key : _s_auth_key
							}
					 	})
					
					if(oAuth_entity.failure){ return { failure : {msg:'Authorization failure.',code:300} }; }
					else { oAuth_entity = oAuth_entity.success.data.user; }

					// oAuth_entity = {
					// 	email : 'testseller@entities.sellyx.com',
					// 	reputation : {
					// 		"score": 0,
					//         "data": [],
					//         "createdAt": "2016-01-08T06:12:46.790Z",
					//         "updatedAt": "2016-01-09T00:32:01.725Z",
					//         "id": "568f535e923cf07534cac8a0"
					// 		},
					// 	telephone : '+1TESTENTITYPHONE',
					// 	status : 1,
					// 	active : 1,
					// 	added : "2016-01-08T06:12:46.797Z"
					// 	}
					}

				result.email = {
					id : oAuth_entity.email,
					verified : true
					}
				result.reputation = oAuth_entity.reputation;
				result.numbers = [ { id : oAuth_entity.telephone } ]

				result.oAuth_setup = {
					status : oAuth_entity.status,
					active : oAuth_entity.active,
					added : oAuth_entity.createdAt
					}

				converted = yield _s_util.convert.single({data:_s_util.clone.deep(result),label:true,library:'t2',dates:{r:true}});

				if(key) {
					if(typeof key !==  'string') key = _s_cache_id;
					yield _s_cache.key.set({ cache_key: key, key : 'entity' , value : converted });
					}

				if(return_both) return { converted : converted, raw : result }
				return converted;
				
				},
			validators : {
				base : function(obj){
					!obj?obj={}:null;
					var t = {
						id : { v:['isAlphaOrNumeric'] , b:true },
						name : { v:['isAlphaOrNumeric'] },
						website : { v:['isWebsite'] , b:true},
						roles : { v:['isJSON'] , b : true, default : [] },
						follows : { 
							aoo:true, 
							data : {
								id : { v:['isUser'] },
								name : { 
									display : { v:['isAlphaOrNumeric'] },
									},
								},
							default : [],
							b:true
							},
						social : _s_common.helpers.validators.social(),
						faq : { 
							aoo : true,
							data : {
								q : { v:['isAlphaOrNumeric'] },
								a : { v:['isTextarea'] }
								}, 
							default : [] 
							},
						addresses : _s_common.helpers.validators.address({aoo:true}),
						enrollment : {
							json : true,
							default : { pending : [] , blocked : [] , denied : [] },
							b:true,
							data : {
								pending : {
									aoo : true,
									b: true,
									default : [],
									data : {
										id : { v:['isAlphaOrNumeric'] },
										name : { v:['isAlphaOrNumeric'] },
										added : { v:['isDateTime'] , default : _s_dt.now.datetime() }
										}
									},
								blocked : {
									aoo : true,
									b: true,
									default : [],
									data : {
										id : { v:['isAlphaOrNumeric'] },
										name : { v:['isAlphaOrNumeric'] },
										added : { v:['isDateTime'] , default : _s_dt.now.datetime() }
										}
									},
								denied : {
									aoo : true,
									b: true,
									default : [],
									data : {
										id : { v:['isAlphaOrNumeric'] },
										name : { v:['isAlphaOrNumeric'] },
										added : { v:['isDateTime'] , default : _s_dt.now.datetime() }
										}
									}
								}
							},
						reputation : {
							json : true,
							b: true,
							default : {
								score : 0,
								data : []
								},
							data : {
								score : { v:['isFloat'] , b:true, default : 0 },
								data : { v:['isArray'] , b:true, default: [] }
								}

							},
						numbers : {
							aoo : true,
							data : {
								id : { v:['isPhone'] }
								}
							},
						verifications : {
							json : true,
							b : true,
							default : {
								verified : false
								},
							data : {
								verified : { in:[true,false] , b:true, default:true }
								}
							},
						description : { v:['isAlphaOrNumeric'] , b:true, default : 'I am a new seller on Sellyx!' },
						type : {
							in :["t2"],
							b : true,
							default : "t2"
							},
						detailed_type : {in:[1] , b:true, default: 1},
						policy : _s_load.library('entities').helpers.validators.policy(),
						master : { v:['isUser'] , default : _s_t1.profile.id(), b:true },
						setup : {
							json : true,
							b:true,
							default:{ active : 1, status : 1, added : _s_dt.now.datetime() },
							data : {
								active : { in:[0,1] , b:true, default : 1 },
								status : { in:[0,1,2,3,4,5,6,7] , b:true, default : 1 },
								added : { v:['isDateTime'] , default : _s_dt.now.datetime() }
								}
							}
						}

					if(obj.update) {
						t = _s_util.object.delete({ data:t, keep:['id','website','description','social'] })
						t.contact = { v:['isPhone'] }
						}
					return t;
					}
				}
			}
		},
	get : function*(obj){
		return yield _s_common.get(obj, 't2');
		},
	new : function*(obj){
		!obj?obj={}:null;

		if(!obj.validate && obj.validate != false){
		
			var data = ( obj.data ? _s_req.validate({ validators : this.helpers.validators.base(), data : obj.data }) : _s_req.validate(this.helpers.validators.base()) );
			if(data.failure) return data; 
			}
		else{
			var data = obj.data;
			}

		if(obj.validate_only) return data;

		// var striped = ['AU','CA','DK','FI','IE','NO','SE','GB','US','AT','BE','FR','DE','IT','JP','LU','NL','SP','MX','SG','CH'];
		// if(data.financials.accounts){
		// 	//means stripe
		// 	if(_s_util.indexOf(striped, data.financials.accounts[0].country)){
		// 		// let's connect to managed accounts on stripe on payment server and create a managed account
		// 		}

		// 	}


		return yield _s_common.new(data,'t2', (obj.raw?obj.raw:false) , (obj.id?false:true));
		},
	update : function*(obj){
		// this is the update function for the t2 library for basic information
		// we are going to supply the information being updated here 
		var data = ( obj.data ? _s_req.validate({ validators : this.helpers.validators.base({update:true}), data : obj.data }) : _s_req.validate(this.helpers.validators.base({update:true})) );
		var result = _s_entity.object.data;
		
		if(data.contact){
			result.numbers[0].id = data.contact;
			delete data.contact;
			}

		return yield _s_common.update(_s_util.merge(result,data) , 't2');
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
  	if(!(this instanceof T2)) { return new T2(); }
	}