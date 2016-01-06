// Lines Library

function Lines(){}

Lines.prototype = {

	model : _s_load.model('lines'),
	helpers : {
		filters : function(){
			return {
				id : { v:['isLine'] , b:true },
				q : { v:['isSearch'] , b : true},
				custom : { in:[1,2,'1','2']  , b:true },
				categories : { v:['isArray'] , b:true },
				seller : { v:['isSeller'] , b:true },
				convert : { in:['true','false'] , default:'true' },
				include : { v:['isAlphaOrNumeric'], b:true },
				exclude : { v:['isAlphaOrNumeric'], b:true },
				active : { in:[1,2,'1','2'], b:true },
				x : { v:['isInt'] , b:true , default : 0 },
				y : { v:['isInt'] , b:true , default : 10 }
				}
			}
		},
	get : function*(obj){
		return yield _s_common.get(obj, 'lines');
		},
	new : function*(obj){
		!obj?obj={}:null;
		// this is the new function for the line library
		// we can validate informtion here and then based on the flag add other things if needed
		var validators = {
			name : { v : ['isAlphaOrNumeric'] },
			custom : { in:[1,2,'1','2'] },
			description : { v : ['isTextarea'] },
			category : { v:['isCategory'] },
			manufacturer : { v:['isManufacturer'] }
			}

		if(obj.data) var data = _s_req.validate({ data : obj.data, validators : validators })
		else var data = _s_req.validate(validators);
		if(data.failure) return data;

		// now we want to load the manufacturer data 
		var manufacturer_result = yield _s_load.library('manufacturers').get(data.manufacturer);
		if(!manufacturer_result) return { failure : { msg : 'The manufacturer was not found.' } , code : 300 }
		
		// now we want to add the information from the manufacturer_result to the new document.

		delete manufacturer_result.setup;
		data.manufacturer = manufacturer_result;

		return yield _s_common.new(data,'lines', true);
		},
	update : function*(obj){
		// this is the update function for the lines library
		// we can validate informtion here and then based on the flag add other things if needed
		!obj?obj={}:null;

		if(obj.data){
			var data = obj.data;
			}
		else{
			var data = _s_req.validate({
				id : { v:['isLine'] },
				name : { v : ['isAlphaOrNumeric'] , b:true },
				custom : { in:[1,2,'1','2'] , b:true },
				description : { v : ['isTextarea'] , b:true },
				category : { v:['isCategory'] , b:true },
				manufacturer : { v:['isManufacturer'] , b:true }
				});
			}

		if(data.failure) return data;

		// first we want to load the line information
		var result = yield this.get(data.id);
		if(!result) return { failure : {msg:'This product line was not found.' } , code:300 }


		if(Object.keys(data).length == 1){
			// means only id was submitted so nothing needs to be changed
			return { failure : { msg : 'No details were changed for this product line.' , code : 300 } }
			}

		// first lets see if the manufacturer is the same

		if(data.manufacturer){
			if(result.manufacturer.id != data.manufacturer){
				// this means the manufacturer isn't the same 

				// we want to load the manufacturer data 
				var manufacturer_result = yield _s_load.library('manufacturers').get(data.manufacturer);
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

		// next we want to update everything by merging the new data with the previous stuff
		result = _s_util.merge(result,data);
		var update = yield this.model.update(result);
		
		if(update){
			if(obj.raw) return { success : result }
			return { success : yield _s_common.helpers.convert(result, 'manufacturers') }
			}
		return { failure : { msg : 'The user could not be updated at this time.' } , code : 300 }
		}
	
	}

module.exports = function(){
  	if(!(this instanceof Lines)) { return new Lines(); }
	}