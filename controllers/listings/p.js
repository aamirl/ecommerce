var _listings = _s_load.library('listings');

module.exports = {
	'search' : function*(){

		var data = _s_req.validate(_listings.helpers.filters());

		if(data.failure) return data;
		data.endpoint = true;

		return yield _listings.get(data);
		}
	}