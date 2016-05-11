var _returns = this._s.library('orders');

module.exports = {
	get : function*(){
		if(!_s_seller) return this._s.l.error(101);
		
		var c = _returns.helpers.filters();
		var data = this._s.req.validate(c);
		if(data.failure) return data;

		data.seller = _s_seller.profile.id();
		data.endpoint = true;

		return yield _returns.get(data);
		},
	'get/user' : function*(){
		var c = _returns.helpers.filters();
		var data = this._s.req.validate(c);
		if(data.failure) return data;

		data.user = _s_user.profile.id();
		data.endpoint = true;

		return  yield _returns.get(data);
		},
	new : function*(){
		return yield _returns.new();
		}
	}