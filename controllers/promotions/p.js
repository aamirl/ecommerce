var _promotions = this._s.library('promotions');

module.exports = {
	'get' : function*(){

		var data = this._s.req.validate(_promotions.helpers.filters());

		if(data.failure) return data;
		data.endpoint = true;

		return yield _promotions.get(data);
		}
	}