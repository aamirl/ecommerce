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
				start : { v:['isDate'] , b:true },
				end : { v:['isDate'] , b:true },
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
		return yield _s_common.get(obj, 'Promotions');
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
		return yield _s_common.new(data,'Promotions', true);
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

		var results = yield this.model.update(data);
		if(results){
			if(obj.raw) return { success : data }
			return { success : yield _s_common.helpers.convert(data, 'Promotions') }
			}
		return { failure : { msg : 'The manufacturer could not be updated at this time.' , code:300 } } 
		}
	
	}

module.exports = function(){
  	if(!(this instanceof Promotions)) { return new Promotions(); }
	}


















