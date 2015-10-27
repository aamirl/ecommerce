var _listings = _s_load.library('listings');

module.exports = {
	'search' : function*(){

		var data = _s_req.validate(_listings.helpers.filters());

		if(data.failure) return data;
		var results = yield _products.get(data);
		
		if(results){
			if(results.data && results.data.length > 0){
				results.filters = data;
				return { success : results };
				}
			else if(data.id) return { success : { data : results } }
			}
		return { failure : {msg:'No listings matched your query.' , code : 300 }};
		
		}
	}