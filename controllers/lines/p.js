var _lines = this._s.library('lines');


module.exports = {
	'get' : function*(){
		var data = this._s.req.validate(_lines.helpers.filters());

		if(data.failure) return data;
		var results = yield _lines.get(data);

		return yield _lines.get(data);
		}
	}