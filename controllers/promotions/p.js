var _promotions = _s_load.library('promotions');

module.exports = {
	'search' : function*(){

		var data = _s_req.validate(_promotions.helpers.filters());

		if(data.failure) return data;
		data.endpoint = true;

		return yield _promotions.get(data);
		}
	}