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
			}
		},
	get : function*(obj){
		return yield _s_common.get(obj, 'manufacturers');
		},
	new : function*(obj){
		// this is the new function for the manufacturer library
		// we can validate informtion here and then based on the flag add other things if needed

		if(obj && obj.data){
			var data = obj.data;
			}
		else{
			var data = _s_req.validate({
				name : { v : ['isAlphaOrNumeric'] },
				country : { v:['isCountry'] },
				category : { v:['isCategory'] }
				});
			}

		if(data.failure) return data;
		return yield _s_common.new(data,'manufacturers', true);
		},
	update : function*(obj){
		// this is the update function for the manufacturer library
		// we can validate informtion here and then based on the flag add other things if needed
		!obj?obj={}:null;


		if(obj.data){
			var data = obj.data;
			}
		else{
			var data = _s_req.validate({
				id : { v:['isManufacturer'] },
				name : { v : ['isAlphaOrNumeric'] },
				country : { v:['isCountry'] },
				category : { v:['isCategory'] }
				});
			}

		if(data.failure) return data;

		return yield _s_common.update(data, 'manufacturers');

		// var results = yield this.model.update(data);
		// if(results){
		// 	if(obj.raw) return { success : data }
		// 	return { success : yield _s_common.helpers.convert(data, 'manufacturers') }
		// 	}
		// return { failure : { msg : 'The manufacturer could not be updated at this time.' , code:300 } } 
		}
	
	}

module.exports = function(){
  	if(!(this instanceof Manufacturers)) { return new Manufacturers(); }
	}


















