var _lines = _s_load.library('lines');


module.exports = {
	'search' : function*(){
		var data = _s_req.validate(_lines.helpers.filters());

		if(data.failure) return data;
		var results = yield _lines.get(data);

		return yield _lines.get(data);
		}
	}