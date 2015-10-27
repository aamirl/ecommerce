var _lines = _s_load.library('lines');


module.exports = {
	'search' : function*(){
		var data = _s_req.validate(_lines.helpers.filters());

		if(data.failure) return data;
		var results = yield _lines.get(data);

		if(results){
			if(results.data && results.data.length > 0){
				results.filters = data;
				return { success : results };
				}
			else if(data.id) return { success : { data : results } }
			}

		return { failure : {msg:'The line information was not found.' , code : 300}};
		}
	}