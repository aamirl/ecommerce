var _orders = _s_load.library('orders');

module.exports = {
	'get/seller' : function*(){
		var c = _orders.helpers.filters();
		var data = _s_req.validate(c);
		if(data.failure) return data;

		data.seller = _s_seller.profile.id();
		data.exclude = 'transactions';

		var results = yield _orders.get(data);
		if(results && results.data.length > 0) {
			results.filters = data;
			return { success : results };
			}
		return { failure : { msg : 'No orders matched your query.' , code : 300 } };
		},
	'get/user' : function*(){
		var c = _orders.helpers.filters();
		var data = _s_req.validate(c);
		if(data.failure) return data;

		data.user = _s_user.profile.id();
		data.exclude = 'transactions';

		var results = yield _orders.get(data);
		if(results && results.data.length > 0) {
			results.filters = data;
			return { success : results };
			}
		return { failure : { msg : 'No orders matched your query.' , code : 300 } };
		}
	}