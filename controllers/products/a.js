// authorized calls for product management
var _products = _s_load.library('products');
var c = _products.helpers.filters();

module.exports = {
	'get/inventory' : function*(){
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
	'new/listing' : function*(){
		return yield _products.new.listing();
		},
	'update/listing' : function*(){
		return yield _products.update.listing();
		},


	}