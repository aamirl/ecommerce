// t1 Library

function T1(){ }

T1.prototype = {
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
						social : self._s.common.helpers.validators.social(),
						currency : { in:self._s.currency.helpers.valid(), b:true, default:'USD' },
						standard : { in:['US','MT'], b:true, default:'MT' },
						addresses : self._s.common.helpers.validators.address({aoo:true}),
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
							default:{ active : 1, status : 1, added : self._s.dt.now.datetime() },
							data : {
								active : { in:[0,1] , b:true, default : 1 },
								status : { in:[0,1,2,3,4,5,6,7] , b:true, default : 1 },
								added : { v:['isDateTime'] , b:true, default : self._s.dt.now.datetime() }
								}
							}
						}
					}
				}
			}
		},
	get : function*(obj){
		return yield this._s.common.get(obj, 't1');
		},
	new : function*(obj){
		!obj?obj={}:null;

		var data = ( obj.data ? this._s.req.validate({ validators : this.helpers.validators.base(), data : obj.data }) : this._s.req.validate(this.helpers.validators.base()) );
		if(data.failure) return data; 

		return yield this._s.common.new(data,'t1', (obj.raw?false:true) , (obj.id?false:true));
		},
	update : function*(obj){
		!obj?obj={}:null;
		// this is the update function for the t1 library for basic information
		// we are going to supply the information being updated here 
		var data = ( obj.data ? obj.data : this._s.req.validate(this.helpers.validators.base({update:true})) );
		if(data.failure) return data;

		if(obj.id){
			obj.result = yield this._s.library('t1').get(obj.id);
			if(obj.result.failure) return obj.result.failure
			}
		
		if(data.contact){
			obj.result.numbers[0].id = data.contact;
			delete data.contact;
			}

		delete obj.result.oAuth_setup;

		var r = yield this._s.common.update(this._s.util.merge(obj.result,data) , 't1');
		if(r.failure) return r;

		if(obj.return_target) return { success : { data : r.success.data[obj.return_target] } }
		return r;
		},
	get actions() {
		var self = this;
		return {
			new : {
				faq : function(obj){
					var r = this._s.dt.now.datetime();
					var t = {
						q : obj.q||"Blank Question!",
						id :  self._s.common.helpers.generate.id(),
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
	}


module.exports = function(){ return new T1(); }