var _search = _s_load.library('search');


module.exports = {
	// this is the api endpoint for search
	// you can specify what information you want to receive from this in an array format, we will return that information, or if there is no request element we will just return all the information that we can display publicly for a page
	'world' : function*(){
		var data = _s_req.validate(_search.helpers.filters.world());

		if(data.failure) return data;
		var results = yield _search.get.world({ filters : data });
		return { success : { data : results.data , filters : results.filters , total : results.total } };
		
		},
	'local' : function*(){

		var data = _s_req.validate(_search.helpers.filters.local());

		if(data.failure) return data;
		var results = yield _search.get.local({ filters : data });
		return { success : { data : results.data , filters : results.filters , total : results.total } };
		},
	'seller' : function*(){
		var data = _s_req.validate(_search.helpers.filters.seller())

		if(data.failure) return data;
		var results = yield _search.get.seller({ filters : data });
		return { success : { data : results.data , filters : results.filters , total : results.total } };

		}
	}