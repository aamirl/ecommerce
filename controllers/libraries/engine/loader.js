var fs = require('fs');

function Loader(){

	}

Loader.prototype = {

	datafile: function(input){
		var file = _s_config.paths.datafiles + input + '.js';
		if(fs.existsSync(file)){
			return require(file);
			}
		return false;
		},
	helper: function(input){
		var file = _s_config.paths.helpers + input + '.js';
		if(fs.existsSync(file)){
			return require(file);
			}
		return false;
		},
	engine: function(input , meta){
		var file = _s_config.paths.engine + input + '.js';
		if(fs.existsSync(file)){
			if(meta) return require(file)(meta)
			else return require(file)();
			}
		return false;
		},
	library: function(input , meta){
		var file = _s_config.paths.libraries + input + '.js';
		if(fs.existsSync(file)){
			if(meta) return require(file)(meta)
			else return require(file)();
			}
		return false;
		},
	object: function(input , data){
		// objects require a data component so that the document can be iterated over
		if(!data) return false;
		var file = _s_config.paths.objects + input + '.js';
		if(fs.existsSync(file)){
			return require(file)(data);
			}
		return false;
		},
	yieldable: function*(input , meta){
		var file = _s_config.paths.libraries + input + '.js';
		if(fs.existsSync(file)){
			if(meta) return yield require(file)(meta)
			else return yield require(file)();
			}
		return false;
		},
	controller : function(input , meta){
		var file =_s_config.paths.controllers + input + '.js';
		if(fs.existsSync(file)){
			return require(file);
			}
		else{
			return false;
			}
		},
	model : function(input , meta){
		var file =_s_config.paths.models + input + '.js';
		if(fs.existsSync(file)){
			return require(file);
			}
		else{
			return false;
			}
		},
	locale : function(lib , meta){
		var file = _s_config.paths.locales + 'en/libraries/';

		if(lib == undefined || !lib) file += 'general.js';
		else file += lib + '.js';

		if(fs.existsSync(file)){
			return require(file);
			}
		else{
			return false;
			}
		},
	template : function(category){
		var file = _s_config.paths.locales + 'en/products/t' + _s_sf.categories.table(category) + '.js';
		
		if(fs.existsSync(file)){	
			
			file = _s_util.clone.deep(require(file));
			
			if(file.booleans && _s_u.isArray(file.booleans)){
				var all_booleans = require(_s_config.paths.locales + 'en/products/booleans.js');
				var iterator = file.booleans;
				file.booleans = {};
				_s_u.each(iterator, function(item, ind){
					if(all_booleans[item] != undefined){
						file.booleans[item] = all_booleans[item];
						}
					})
				}
			return file;
			}
		return false;
		}
	}

module.exports = function(){
  	if(!(this instanceof Loader)) { return new Loader(); }
	}


















