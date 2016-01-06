// Sellers Library

function Sellers(){}

Sellers.prototype = {
	model : _s_load.model('sellers'),
	get helpers(){
		var self = this;
		return {
			cached : function*(id, key){
				var result = yield self.get({id:id, exclude:'faq,reviews,financials,totals,policy,fans'});
				if(!result) return {failure:true};

				if(result.addresses.length > 0) result.country = result.addresses[0].country;
				result = yield _s_util.convert.single({data:result,label:true,library:'sellers',dates:{r:true}});
				yield _s_cache.key.set({ cache_key: key, key : 'seller' , value : result });
				return result;
				},
			validators : {
				faq : function(){
					return {
						eon : {
							1 : {
								q : { v:['isAlphaOrNumeric'] },
								a : { v:['isTextarea'] }
								},
							2 : {
								id : { v:['isAlphaOrNumeric'] },
								a : { v:['isTextarea'] }
								},
							3 : {
								id : { v:['isAlphaOrNumeric'] }
								}
							}
						}
					},
				policy : function(){
					return {
						json : true,
						b:true,
						data : {
							1 : {
								json : true,
								data : {
									allowed : {
										dependency : {
											1 : 'none',
											2 : {
												duration : { v : ['isInt']},
												shipping : { in : [1,2,'1','2'] },
												type : { in : [1,'1'] },
												// type : { in : [1,2,'1','2'] },
												details : { v : ['isAlphaOrNumeric'] , b:true },
												}
											}
										}
									}
								},
							2 : {
								json : true,
								data : {
									allowed : {
										dependency : {
											1 : 'none',
											2 : {
												duration : { v : ['isInt']},
												shipping : { in : [1,2,'1','2'] },
												type : { in : [1,'1'] },
												// type : { in : [1,2,'1','2'] },
												details : { v : ['isAlphaOrNumeric'] , b:true },
												restricted : { v:['isCountries'], b: true }
												}
											}
										}
									}
								}
							}
						}
					}
				}		
			}
		},
	get : function*(obj){
		return yield _s_common.get(obj, 'sellers');
		},
	new : function*(obj){
		!obj?obj={}:null;
		// this is to add a new seller

		var c = {
			name : { v:['isAlphaOrNumeric'] },
			website : { v:['isWebsite'] , b:true},
			fans : { 
				aoo:true, 
				data : {
					id : { v:['isUser'] },
					name : { 
						first : { v:['isAlphaOrNumeric'] },
						middle : { v:['isAlphaOrNumeric'] , b: true},
						last : { v:['isAlphaOrNumeric'] },
						display : { v:['isAlphaOrNumeric'] },
						},
					},
				default : [],
				b:true
				},
			social : {
				json : true,
				b : true,
				default : {
					twitter : {},
					facebook : {},
					google : {},
					pinterest : {},
					instagram : {}
					},
				data : {
					twitter : {
						json : true,
						data : {
							id : { v:['isAlphaOrNumeric'] , b:true , default : 'add' }
							}
						},
					facebook : {
						json : true,
						data : {
							id : { v:['isAlphaOrNumeric'] , b:true , default : 'add' }
							}
						},
					google : {
						json : true,
						data : {
							id : { v:['isAlphaOrNumeric'] , b:true , default : 'add' }
							}
						},
					pinterest : {
						json : true,
						data : {
							id : { v:['isAlphaOrNumeric'] , b:true , default : 'add' }
							}
						},
					instagram : {
						json : true,
						data : {
							id : { v:['isAlphaOrNumeric'] , b:true , default : 'add' }
							}
						},
					}
				},
			faq : { 
				aoo : true,
				data : {
					q : { v:['isAlphaOrNumeric'] },
					a : { v:['isTextarea'] }
					}, 
				default : [] 
				},
			addresses : { 
				aoo : true,
				data : {
					label : { v:['isAlphaOrNumeric'] , b:true, default : 'No Label' },
					street1 : { v:['isStreet'] },
					street2 : { v:['isStreet'] , default : "" , b:true },
					city : { v:['isCity'] },
					state : { v:['isAlphaOrNumeric'] , b:true },
					postal : { v:['isPostal'] , b:true },
					country : { v:['isCountry'] }
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
				in : [1,2,3,4,5,6],
				b : true,
				default : 1
				},
			policy : this.helpers.validators.policy(),
			master : { v:['isUser'] , default : _s_user.profile.id(), b:true }
			}

		var data = ( obj.data ? _s_req.validate({ validators : c, data : obj.data }) : _s_req.validate(c) );
		if(data.failure) return data; 

		data.setup = {
			added : _s_dt.now.datetime(),
			status : 1,
			active : 1
			}

		return yield _s_common.new(data,'sellers', false, true);
		},
	update : function*(obj){
		// this is the update function for the sellers library for basic information
		// we are going to supply the information being updated here 

		if(!obj && !obj.data){
			return { failure : { msg : 'No information was submitted for update.'} , code : 300 }
			}

		var data = (obj.data?obj.data:obj);

		if(Object.keys(data).length == 1){
			// means only id was submitted so nothing needs to be changed
			return { failure : { msg : 'No details were changed for this seller.' , code : 300 } }
			}

		// first we want to load the seller information
		var result = yield this.get(data.id);
		if(!result) return { failure : {  msg : 'This seller\'s information was not found.' , code : 300 } }

		if(data.contact){
			// primary number
			result.numbers[0].id = data.contact;
			}


		result = _s_util.merge(result,data);

		var update = yield this.model.update(result);
		if(update){
			if(!obj.convert) return { success : yield _s_common.helpers.convert(result, 'Sellers') }
			return { success : true }
			}
		return { failure : { msg : 'The user could not be updated at this time.' , code : 300 } }
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
  	if(!(this instanceof Sellers)) { return new Sellers(); }
	}