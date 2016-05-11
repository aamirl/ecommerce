// t2 Library

function T2(){}

T2.prototype = {
	get helpers(){
		var self = this;
		return {
			validators : {
				base : function(obj){
					!obj?obj={}:null;
					var t = {
						id : { v:['isAlphaOrNumeric'] , b:true },
						name : { v:['isAlphaOrNumeric'] },
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
						website : { v:['isWebsite'] , b:true},
						description : { v:['isAlphaOrNumeric'] , b:true, default : 'I am a new seller on Sellyx!' },
						social : self._s.common.helpers.validators.social(),
						faq : { 
							aoo : true,
							data : {
								q : { v:['isAlphaOrNumeric'] },
								a : { v:['isTextarea'] }
								}, 
							default : [] 
							},
						addresses : self._s.common.helpers.validators.address({aoo:true}),
						enrollment : {
							v :['isArray'],
							default : [],
							b:true,
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
						type : {
							in :["t2"],
							b : true,
							default : "t2"
							},
						detailed_type : {in:[1] , b:true, default: 1},
						policy : self._s.library('entities').helpers.validators.policy(),
						master : { v:['isUser'] , default : self._s.t1.profile.id(), b:true },
						setup : {
							json : true,
							b:true,
							default:{ active : 1, status : 1, added : self._s.dt.now.datetime() },
							data : {
								active : { in:[0,1] , b:true, default : 1 },
								status : { in:[0,1,2,3,4,5,6,7] , b:true, default : 1 },
								added : { v:['isDateTime'] , default : self._s.dt.now.datetime() }
								}
							}
						}

					if(obj.update) {
						t = {
							contact : { v:['isPhone'] },
							website : { v:['isWebsite'] , b:true},
							description : { v:['isAlphaOrNumeric'] , b:true, default : 'I am a seller on Sellyx!' },
							social : self._s.common.helpers.validators.social(),
							}
						}

					return t;
					}
				}
			}
		},
	get : function*(obj){
		return yield this._s.common.get(obj, 't2');
		},
	new : function*(obj){
		!obj?obj={}:null;

		if(!obj.validate && obj.validate != false){
		
			var data = ( obj.data ? this._s.req.validate({ validators : this.helpers.validators.base(), data : obj.data }) : this._s.req.validate(this.helpers.validators.base()) );
			if(data.failure) return data; 
			}
		else{
			var data = obj.data;
			}

		if(obj.validate_only) return data;
		return yield this._s.common.new(data,'t2', (obj.raw?obj.raw:false) , (obj.id?false:true));
		},
	update : function*(obj , result){
		!obj?obj={}:null;
		// this is the update function for the t2 library for basic information
		// we are going to supply the information being updated here 
		var data = ( obj.data ? obj.data : this._s.req.validate(this.helpers.validators.base({update:true})) );
		if(data.failure) return data;

		if(obj.id){
			obj.result = yield this._s.library('t2').get(obj.id);
			if(obj.result.failure) return obj.result.failure
			}
		
		if(data.contact){
			obj.result.numbers[0].id = data.contact;
			delete data.contact;
			}

		delete obj.result.oAuth_setup;

		var r = yield this._s.common.update(this._s.util.merge(obj.result,data) , 't2');

		if(r.failure) return r;
		if(obj.return_target) return { success : { data : r.success.data[obj.return_target] } }
		return r;
		},
	actions : {
		new : {
			faq : function(obj){
				var r = this._s.dt.now.datetime();
				var t = {
					q : obj.q||"Blank Question!",
					id :  this._s.common.helpers.generate.id(),
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


module.exports = function(){ return new T2(); }