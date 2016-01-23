var _lines = _s_load.library('lines');


module.exports = {
	'get' : function*(){	
		var data = _s_req.validate(_lines.helpers.filters());
		if(data.failure) return data;
	
		data.entity = _s_entity.engine.profile.id();
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