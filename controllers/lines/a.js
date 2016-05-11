var _lines = this._s.library('lines');


module.exports = {
	'get' : function*(){	
		var data = this._s.req.validate(_lines.helpers.filters());
		if(data.failure) return data;
	
		data.entity = this._s.entity.engine.profile.id();
		data.endpoint = true;
		return yield _lines.get(data);
		},
	'new' : function*(){
		return yield _lines.new();
		},
	'update' : function*(){
		return yield _lines.update();
		}
	}