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
										dependency : true, 
										data : {
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
										dependency : true,
										data : {
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
			financials : {
				json : true,
				b:true,
				default:{},
				data : {
					accounts : {
						aoo : true,
						data : {
							name : { v:['isAlphaOrNumeric'] },
							bank : {
								json : true,
								data : {
									name : { v:['isAlphaOrNumeric'] }
									}
								},
							address : _s_common.helpers.validators.address({required:true}),
							country : {
								dependency : true,
								default : {
									'account_number' : { v:['isAlphaOrNumeric'] },
									'other' : { v:['isTextarea'] }
									},
								data : {
									'AU' : {
										'bsb' : { v:['isAlphaOrNumeric'] },
										'account_number' : { v:['isAlphaOrNumeric'] }
										},
									'CA' : {
										'transit' : { v:['isAlphaOrNumeric'] },
										'institution_number' : { v:['isAlphaOrNumeric'] },
										'account_number' : { v:['isAlphaOrNumeric'] }
										},
									'DK' : {
										'iban' : { v:['isIBAN'] }
										},
									'FI' : {
										'iban' : { v:['isIBAN'] }
										},
									'IE' : {
										'iban' : { v:['isIBAN'] }
										},
									'NO' : {
										'iban' : { v:['isIBAN'] }
										},
									'SE' : {
										'iban' : { v:['isIBAN'] }
										},
									'GB' : {
										'iban' : { v:['isIBAN'] }
										},
									'US' : {
										'account_number' : { v:['isAlphaOrNumeric'] },
										'routing_number' : { v:['isAlphaOrNumeric'] }
										},
									'AT' : {
										'iban' : { v:['isIBAN'] }
										},
									'BE' : {
										'iban' : { v:['isIBAN'] }
										},
									'FR' : {
										'iban' : { v:['isIBAN'] }
										},
									'DE' : {
										'iban' : { v:['isIBAN'] }
										},
									'IT' : {
										'iban' : { v:['isIBAN'] }
										},
									'JP' : {
										'bank_name' : { v:['isAlphaOrNumeric'] },
										'branch_name' : { v:['isAlphaOrNumeric'] },
										'account_number' : { v:['isAlphaOrNumeric'] },
										'account_owner' : { v:['isAlphaOrNumeric'] }

										},
									'LU' : {
										'iban' : { v:['isIBAN']}
										},
									'NL' : {
										'iban' : { v:['isIBAN']}
										},
									'SP' : {
										'iban' : { v:['isIBAN']}
										},
									'MX' : {
										'clabe' : { v:['isAlphaOrNumeric']}
										},
									'SG' : {
										'bank_code' : { v:['isAlphaOrNumeric']},
										'branch_code' : { v:['isAlphaOrNumeric']},
										'account_number' : { v:['isAlphaOrNumeric'] },
										},
									'CH' : {
										'iban' : { v:['isIBAN']}
										},
									}
								}
							}
						}
					}
				},
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
			addresses : _s_common.helpers.validators.address({aoo:true}),
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

		var striped = ['AU','CA','DK','FI','IE','NO','SE','GB','US','AT','BE','FR','DE','IT','JP','LU','NL','SP','MX','SG','CH'];
		if(data.financials.accounts){
			//means stripe
			if(_s_util.indexOf(striped, data.financials.accounts[0].country)){
				// let's connect to managed accounts on stripe on payment server and create a managed account
				}

			}



		data.setup = {
			added : _s_dt.now.datetime(),
			status : 0,
			active : 0
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
			return yield this.helpers.cached(result.id, _s_cache_key)
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