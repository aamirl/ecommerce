// Manufacturers Library

function Manufacturers(){}

Manufacturers.prototype = {

	model : _s_load.model('manufacturers'),
	helpers : {
		filters : function(){
			return {
				id : { v:['isLine'] , b:true },
				q : { v: ['isSearch'] , b:true},
				categories : { v:['isArray'] , b:true },
				seller : { v:['isSeller'] , b:true },
				convert : { in:['true','false'] , default : 'true' },
				include : { v:['isAlphaOrNumeric'], b:true },
				exclude : { v:['isAlphaOrNumeric'], b:true },
				active : { v:['isAlphaOrNumeric'], b:true },
				x : { v:['isInt'] , b:true , default : 0 },
				y : { v:['isInt'] , b:true , default : 10 }
				}
			},
		validators : {
			base : function(obj){
				!obj?obj={}:null;
				var r = {
					name : { v : ['isAlphaOrNumeric'] },
					country : { v:['isCountry'] },
					category : { v:['isCategory'] }
					}
				if(obj.update) r.id = { v:['isManufacturer'] }
				return r;
				}
			}
		},
	get : function*(obj){
		return yield _s_common.get(obj, 'manufacturers');
		},
	new : function*(obj){
		!obj?obj={}:null;
		var data = ( obj.data ? _s_req.validate({ validators : this.helpers.validators.base(), data : obj.data }) : _s_req.validate(this.helpers.validators.base()) );
		if(data.failure) return data;
		return yield _s_common.new(data,'manufacturers', true);
		},
	update : function*(obj){
		!obj?obj={}:null;
		var data = ( obj.data ? _s_req.validate({ validators : this.helpers.validators.base({update:true}), data : obj.data }) : _s_req.validate(this.helpers.validators.base({update:true})) );
		if(data.failure) return data;
		return yield _s_common.update(data, 'manufacturers');
		}
	
	}

module.exports = function(){
  	if(!(this instanceof Manufacturers)) { return new Manufacturers(); }
	}


















