var _orders = _s_load.library('orders');

module.exports = {
	new : function*(){
		
		},
	'get/seller' : function*(){
		if(!_s_seller) return _s_l.error(101);
		
		var c = _orders.helpers.filters();
		var data = _s_req.validate(c);
		if(data.failure) return data;

		data.seller = _s_seller.profile.id();
		data.exclude = 'transactions';
		data.endpoint = true;

		return yield _orders.get(data);
		},
	'get/user' : function*(){
		var c = _orders.helpers.filters();
		var data = _s_req.validate(c);
		if(data.failure) return data;

		data.user = _s_user.profile.id();
		data.exclude = 'transactions';
		data.endpoint = true;

		return yield _orders.get(data);
		}
	}