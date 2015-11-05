// authorized calls for product management
var _products = _s_load.library('products');
var c = _products.helpers.filters();

module.exports = {
	'get/inventory' : function*(){
		if(!_s_seller) return _s_l.error(101);
		// we want to call the auth controller with the seller information
		// we add the filters we need for this particular inventory call

		var data = _s_req.validate(c);
		if(data.failure) return data;
		
		data.seller = _s_seller.profile.id();
		data.admin = true;

		var results = yield _products.get(data);
		if(results.data && results.data.length > 0){
			results.filters = data;
			return { success : results };
			}
		return { failure : {msg: 'No products matched your query.' } , code : 300 };
		},
	'get/seller' : function*(){
		if(!_s_seller) return _s_l.error(101);
		// we want to call the auth controller with the seller information
		// we add the filters we need for this particular inventory call

		var data = _s_req.validate(c);

		if(data.failure) return data;
		
		// next we want to add the seller information
		data.exclude = 'sellers';
		data.added = _s_seller.profile.id();
		data.admin = true;

		var results = yield _products.get(data);
		if(results.data && results.data.length > 0){
			results.filters = data;
			return { success : results };
			}
		return { failure : {msg: 'No products matched your query.' } , code : 300 };
		},
	'new' : function*(){
		
		},
	update : function*(){

		return yield _products.update.product();

		},
	'listing/new' : function*(){
		return yield _products.new.listing();
		},
	'listing/update' : function*(){
		return yield _products.update.listing();
		},
	'listing/status' : function*(){
		if(!_s_seller) return { failure : { msg:'this is not a seller' , code : 300 } };

		return yield _products.actions.status.listing({
			seller : true
			});

		}

	}