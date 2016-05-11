// Manufacturers Library

function Manufacturers(){}

Manufacturers.prototype = {
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
				y : { v:['isInt'] , b:true , default : 10 },
				count : { in:['true','false',true,false], b:true, default:false }
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
		return yield this._s.common.get(obj, 'manufacturers');
		},
	new : function*(obj){
		!obj?obj={}:null;
		var data = ( obj.data ? this._s.req.validate({ validators : this.helpers.validators.base(), data : obj.data }) : this._s.req.validate(this.helpers.validators.base()) );
		if(data.failure) return data;
		return yield this._s.common.new(data,'manufacturers', true);
		},
	update : function*(obj){
		!obj?obj={}:null;
		var data = ( obj.data ? this._s.req.validate({ validators : this.helpers.validators.base({update:true}), data : obj.data }) : this._s.req.validate(this.helpers.validators.base({update:true})) );
		if(data.failure) return data;
		return yield this._s.common.update(data, 'manufacturers');
		}
	
	}

module.exports = function(){eturn new Manufacturers(); }


















