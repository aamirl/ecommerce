// Promotions Library

function Promotions(){}

Promotions.prototype = {

	model : this._s.model('promotions'),
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
				y : { v:['isInt'] , b:true , default : 10 },
				count : { in:['true','false',true,false], b:true, default:false }
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
		return yield this._s.common.get(obj, 'promotions');
		},
	new : function*(obj){
		!obj?obj={}:null;
		// this is the new function for the promotion library
		// we can validate informtion here and then based on the flag add other things if needed

		if(obj.data) var data = this._s.req.validate({ data : obj.data, validators : this.helpers.validators() })
		else var data = this._s.req.validate(this.helpers.validators());
		if(data.failure) return data;

		if(data.start){
			// first we make sure that the start date is after now
			if(!this._s.dt.compare.after(data.start, 'now')) return { failure : {msg : 'Your start date is before or at the current time and date. Please make sure that your promotion begins in the future.' , code : 300 } };
			}
		else{
			data.start = this._s.dt.now.datetime();
			}

		// then we make sure that the end date is after start
		// if(!this._s.dt.compare.before(data.start, data.end)) return { failure : 'Your end date occurs before your start date. Please make sure that your promotion ends after it begins.'};

		data.seller = _s_seller.profile.id();
		return yield this._s.common.new(data,'promotions', true);
		},
	update : function*(obj){
		if(obj.data){var data = obj.data; } 
		else{
			var r = this.helpers.validators();
			r.id = {  v:['isPromotion'] };
			var data = this._s.req.validate(r);
			}

		if(data.failure) return data;

		// let's pull up the promotion and make sure that it belongs to the seller
		var result = yield this.get({id:data.id,convert:false});
		if(!result) return { failure : { msg : 'No promotion was found.' , code: 300 } };
		if(result.seller != obj.seller) return { failure : { msg : 'You are not authorized to change this promotion.' , code : 300 } }

		return yield this._s.common.update(data, 'promotions');
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


				var data = this._s.req.validate(r);
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

				return yield this._s.common.check(r);
				}
			}
		}
	}

module.exports = function(){
  	if(!(this instanceof Promotions)) { return new Promotions(); }
	}


















