// Entity Library

function Entities(){}

Entities.prototype = {
	model : _s_load.model('entities'),
	get helpers(){
		var self = this;
		return {
			filters : function(){
				return {
					id : { v:['isEntity'] , b:true },
					q : { v: ['isSearch'] , b:true},
					entities : { v:['isArray'] , b:true },
					convert : { in:['true','false'] , default : 'true' },
					include : { v:['isAlphaOrNumeric'], b:true },
					exclude : { v:['isAlphaOrNumeric'], b:true },
					active : { v:['isAlphaOrNumeric'], b:true },
					x : { v:['isInt'] , b:true , default : 0 },
					y : { v:['isInt'] , b:true , default : 10 }
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
		return yield _s_common.get(obj, 'entities');
		},
	}


module.exports = function(){
  	if(!(this instanceof Entities)) { return new Entities(); }
	}