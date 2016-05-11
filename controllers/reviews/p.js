


module.exports = {
	'get' : function*(){
		var _reviews = this._s.library('reviews');
		var data = this._s.req.validate(_reviews.helpers.filters());
		if(data.failure) return data;

		data.endpoint = true;

		return yield _reviews.get(data);
		}
	}