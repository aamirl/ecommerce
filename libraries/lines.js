// Lines Library

function Lines(){}

Lines.prototype = {

	helpers : {
		filters : function(){
			return {
				id : { v:['isLine'] , b:true },
				q : { v:['isSearch'] , b : true},
				custom : { in:[1,2,'1','2']  , b:true },
				categories : { v:['isArray'] , b:true },
				entity : { v:['isEntity'] , b:true },
				convert : { in:['true','false'] , default:'true' },
				include : { v:['isAlphaOrNumeric'], b:true },
				exclude : { v:['isAlphaOrNumeric'], b:true },
				active : { in:[1,2,'1','2'], b:true },
				x : { v:['isInt'] , b:true , default : 0 },
				y : { v:['isInt'] , b:true , default : 10 },
				count : { in:['true','false',true,false], b:true, default:false }
				}
			},
		validators : {
			base : function(obj){
				!obj?obj={}:null;
				var t = {
					name : { v : ['isAlphaOrNumeric'] },
					custom : { in:[1,2,'1','2'] },
					description : { v : ['isTextarea'] },
					category : { v:['isCategory'] },
					manufacturer : { v:['isManufacturer'] }
					}
				if(obj.update) t.id = { v:['isLine'] }
				return t;
				}
			}
		},
	get : function*(obj){
		return yield this._s.common.get(obj, 'lines');
		},
	new : function*(obj){
		!obj?obj={}:null;
		var data = ( obj.data ? this._s.req.validate({ validators : this.helpers.validators.base(), data : obj.data }) : this._s.req.validate(this.helpers.validators.base()) );
		if(data.failure) return data;

		// now we want to load the manufacturer data 
		var manufacturer_result = yield this._s.library('manufacturers').get(data.manufacturer);
		if(!manufacturer_result) return { failure : { msg : 'The manufacturer was not found.' } , code : 300 }
		
		// now we want to add the information from the manufacturer_result to the new document.

		delete manufacturer_result.setup;
		data.manufacturer = manufacturer_result;

		return yield this._s.common.new(data,'lines', true);
		},
	update : function*(obj){
		!obj?obj={}:null;
		var data = ( obj.data ? this._s.req.validate({ validators : this.helpers.validators.base({update:true}), data : obj.data }) : this._s.req.validate(this.helpers.validators.base({update:true})) );
		if(data.failure) return data;

		// first we want to load the line information
		var result = yield this.get(data.id);
		if(!result) return { failure : {msg:'This product line was not found.' } , code:300 }

		if(Object.keys(data).length == 1) return { failure : { msg : 'No details were changed for this product line.' , code : 300 } }
		
		// first lets see if the manufacturer is the same

		if(data.manufacturer){
			if(result.manufacturer.id != data.manufacturer){
				// this means the manufacturer isn't the same 

				// we want to load the manufacturer data 
				var manufacturer_result = yield this._s.library('manufacturers').get(data.manufacturer);
				if(!manufacturer_result) return { failure : { msg : 'The manufacturer was not found.' , code : 300} }
				
				// now we want to add the information from the manufacturer_result to the new document.
				delete manufacturer_result.setup;
				delete result.manufacturer;
				data.manufacturer = manufacturer_result;
				}
			else{
				delete data.manufacturer;
				}
			}

		result = this._s.util.merge(result,data);
		return yield this._s.common.update(results,'lines');
		}
	
	}

module.exports = function(){ return new Lines(); }