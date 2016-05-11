var fs = require('fs');

function Loader(){}

Loader.prototype = {
	get update(){
		var self = this
		return {
			base : function(set_to, set_type, lib, meta){
				self[set_to] = self[set_type](lib, meta)
				},
			yieldable : function*(set_to, set_type, lib, meta){
				var t = yield self.yieldable(lib, set_type, meta)
				if(!t || t.failure) return { failure : t.failure||{ msg : 'Loading this item failed.' , code : 300 } }

				self[set_to] = t
				return { success : true }
				}
			}
		},
	get : function(type){
		return this[type]
		},
	datafile: function(input, meta){
		var file = _s_config.paths.datafiles + input + '.js';
		return require(file);
		},
	helper: function(input, meta){
		var file = _s_config.paths.helpers + input + '.js';
		var r = require(file)
		if(typeof r == 'function'){
			r = r(meta)
			r._s = this
			if(typeof r.init == 'function') {
				r.init()
				}
			}
		else{
			r._s = this
			}
		
		return r;
		},
	engine: function(input , meta){
		var file = _s_config.paths.engine + input + '.js';
		var r = require(file)
		if(typeof r == 'function'){
			r = r(meta)
			r._s = this
			if(typeof r.init == 'function') {
				r.init()
				}
			}
		else{
			r._s = this				
			}
		if(fs.existsSync(_s_config.paths.models + input + '.js')){
			r.model = this.model(input)
			}
		
		return r;
		},
	library: function(input , meta){
		var file = _s_config.paths.libraries + input + '.js';
		var r = require(file)
		if(typeof r == 'function'){
			r = r(meta)
			r._s = this
			if(typeof r.init == 'function') {
				r.init()
				}
			}
		else{
			r._s = this
			}

		if(fs.existsSync(_s_config.paths.models + input + '.js')){
			r.model = this.model(input)
			}
		
		return r
		},
	yieldable: function*(input , type,  meta){
		switch(type){
			case 'engine':
				var file = _s_config.paths.engine + input + '.js';
				break;
			case 'library':
				var file = _s_config.paths.libraries + input + '.js';
				break;
			case 'object':
				var file = _s_config.paths.objects + input + '.js';
				break;
			}
		
		var r = require(file)
		if(typeof r == 'function'){
			r = r(meta)
			r._s = this
			if(typeof r.init == 'function') {
				if(type == 'object'){
					var t = yield r.init(meta)
					if(t.failure)
					return { failure : t.failure }
					}
				else{
					yield r.init()
					}
				}
			}
		else{
			r._s = this
			}

		return r
		},
	controller : function(input , meta){
		var file =_s_config.paths.controllers + input + '.js';
		if(fs.existsSync(file)){
			var r = require(file)
			if(typeof r == 'function'){
				r = r(meta)
				r._s = this
				if(typeof r.init == 'function') {
					r.init()
					}
				}
			else{
				r._s = this
				}

			if(fs.existsSync(_s_config.paths.models + input + '.js')){
				r.model = this.model(input)
				}
			
			return r
			}
		return false
		},
	model : function(input , meta){
		var file =_s_config.paths.models + input + '.js';
		var r = require(file)
		if(typeof r == 'function'){
			r = r(meta)
			r._s = this
			if(typeof r.init == 'function') {
				r.init()
				}
			}
		else{
			r._s = this				
			}
			
		return r;
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
			
			file = this._s.util.clone.deep(require(file));
			
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
  	return new Loader();
	}