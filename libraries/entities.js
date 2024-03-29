// Entity Library

function Entities(){}

Entities.prototype = {
	get privileges(){
		var self = this;
		return {
			check : function*(obj){
				if(self._s.entity.type == 't1') return { failure : { msg : 'This option is only valid for business entities at this time.' , code : 300 } }
				if(! self._s.entity.object.privileges.master.compare(self._s.t1.profile.id())) return { failure : { msg: ' This option is only for the master administrator for this entity at this time.' ,code : 300  } }

				return true;
				},
			}
		},
	get helpers(){
		var self = this;
		return {
			filters : function(){
				return {
					id : { v:['isEntity'] , b:true },
					q : { v: ['isSearch'] , b:true},
					entities : { v:['isArray'] , b:true },
					indices : { in:['t1','t2'] , b:true, default : 't1' },
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
		return yield this._s.common.get(obj, 'entities');
		},
	}


module.exports = function(){
  	if(!(this instanceof Entities)) { return new Entities(); }
	}