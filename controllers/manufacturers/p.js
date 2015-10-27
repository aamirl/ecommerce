var _manufacturers = _s_load.library('manufacturers');


module.exports = {
	'search' : function*(){
		var data = _s_req.validate(_manufacturers.helpers.filters());

		if(data.failure) return data;
		var results = yield _manufacturers.get(data);

		if(results){
			if(results.data && results.data.length > 0){
				results.filters = data;
				return { success : results };
				}
			else if(data.id) return { success : { data : results } }
			}
		
		return { failure : { msg : 'The manufacturer information was not found.' , code : 300 } };
		}
	}