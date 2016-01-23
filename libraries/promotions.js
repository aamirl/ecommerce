// Promotions Library

function Promotions(){}

Promotions.prototype = {

	model : _s_load.model('promotions'),
	helpers : {
		filters : function(){
			return {
				id : { v:['isLine'] , b:true },
				redemption : { in:[1,2,'1','2'] , b:true },
				product : { v: ['isProduct'] , b:true},
				pal : { v: ['isPaL'] , b:true},
				products : { v: ['isArray'] , b:true},
				order : { in:['true','false'] , b:true},
				start : { v:['isAlphaOrNumeric'] , b:true },
				end : { v:['isAlphaOrNumeric'] , b:true },
				categories : { v:['isArray'] , b:true },
				seller : { v:['isSeller'] , b:true },
				sellers : { v:['isArray'] , b:true },
				country : { v:['isCountry'] , b:true },
				convert : { in:['true','false'] , default : 'true' },
				include : { v:['isAlphaOrNumeric'], b:true },
				exclude : { v:['isAlphaOrNumeric'], b:true },
				active : { v:['isAlphaOrNumeric'], b:true },
				x : { v:['isInt'] , b:true , default : 0 },
				y : { v:['isInt'] , b:true , default : 10 }
				}
			},
		validators : function(){
			return {
				apply : {
					dependency : {
						1 : {
							maximum : {v:['isInt'], b:true},
							// items : {v:['isPaLs'] },
							items : {v:['isPaLs'] , filter:'isPaLs'},
							type : {
								dependency : {
									1 : {
										value : {v:['isDecimal']}
										},
									2 : {
										value : {v:['isAlphaOrNumeric']}
										},
									3 : {
										value : {v:['isAlphaOrNumeric']}
										},
									4 : {
										value : {v:['isPrice'] , filter:'isPrice'}
										},
									}
								},
							},
						2 : {
							type : {
								dependency : {
									1 : {
										value : {v:['isDecimal']}
										},
									2 : {
										value : {v:['isAlphaOrNumeric']}
										},
									4 : {
										value : {v:['isDecimal'] , filter : 'isPrice'}
										},
									}
								},
							},
						3 : {
							maximum : {v:['isInt'], b:true},
							categories : {v:['isCategories'] , filter : 'isCategories'},
							type : {
								dependency : {
									1 : {
										value : {v:['isDecimal']}
										},
									2 : {
										value : {v:['isAlphaOrNumeric']}
										},
									3 : {
										value : {v:['isAlphaOrNumeric']}
										},
									4 : {
										value : {v:['isPrice'], filter : 'isPrice'}
										},
									}
								},
							}
						}
					},
				start : { v:['isDateTime'] , filter : 'isDateTime' , b:true },
				end : { v:['isDateTime'] , filter : 'isDateTime' },
				redemption : {
					dependency : {
						1 : 'none',
						2 : {
							code : {v:['isAlphaOrNumeric']}
							}
						}
					},
				restricted : {v:['isCountries'], filter : 'isCountries' , b:'array'}
				}
			}
		},
	get : function*(obj){
		return yield _s_common.get(obj, 'promotions');
		},
	new : function*(obj){
		!obj?obj={}:null;
		// this is the new function for the promotion library
		// we can validate informtion here and then based on the flag add other things if needed

		if(obj.data) var data = _s_req.validate({ data : obj.data, validators : this.helpers.validators() })
		else var data = _s_req.validate(this.helpers.validators());
		if(data.failure) return data;

		if(data.start){
			// first we make sure that the start date is after now
			if(!_s_dt.compare.after(data.start, 'now')) return { failure : {msg : 'Your start date is before or at the current time and date. Please make sure that your promotion begins in the future.' , code : 300 } };
			}
		else{
			data.start = _s_dt.now.datetime();
			}

		// then we make sure that the end date is after start
		// if(!_s_dt.compare.before(data.start, data.end)) return { failure : 'Your end date occurs before your start date. Please make sure that your promotion ends after it begins.'};

		data.seller = _s_seller.profile.id();
		return yield _s_common.new(data,'promotions', true);
		},
	update : function*(obj){
		if(obj.data){var data = obj.data; } 
		else{
			var r = this.helpers.validators();
			r.id = {  v:['isPromotion'] };
			var data = _s_req.validate(r);
			}

		if(data.failure) return data;

		// let's pull up the promotion and make sure that it belongs to the seller
		var result = yield this.get({id:data.id,convert:false});
		if(!result) return { failure : { msg : 'No promotion was found.' , code: 300 } };
		if(result.seller != obj.seller) return { failure : { msg : 'You are not authorized to change this promotion.' , code : 300 } }

		return yield _s_common.update(data, 'promotions');
		},
	get actions() {
		var self = this;
		return {
			status : function*(obj){
				!obj?obj={}:null;

				var r = {
					id : {v:['isPromotion']},
					status : { in:(obj.status?obj.status:[2,'2']) }
					}


				var data = _s_req.validate(r);
				if(data.failure) return data;

				r = {
					id : data.id,
					library : 'promotions',
					label : 'promotion',
					seller : obj.seller,
					corporate : (obj.corporate?_s_corporate.profile.master():null),
					status : {
						allowed : [1],
						change : data.status
						},
					active : (obj.active?obj.active:[1])
					}

				return yield _s_common.check(r);
				}
			}
		}
	}

module.exports = function(){
  	if(!(this instanceof Promotions)) { return new Promotions(); }
	}


















