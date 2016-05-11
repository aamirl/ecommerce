var _products = this._s.library('products');

module.exports = {
	get : function*(){

		var data = this._s.req.validate(_products.helpers.filters());
		if(data.failure) return data;
		var results = yield _products.get(data);

		if(results){
			if(results.data && results.data.length > 0){
				results.filters = data;
				return { success : results };
				}
			else if(data.id) return { success : { data : results } }
			}
		return { failure : {msg:'No products matched your query.' , code : 300 }};
		
		},
	template : function*(){
		var data = this._s.req.validate({
			category : { v:['isCategory'] }
			})
		if(data.failure) return data;

		var template = this._s.template(data.category);

		if(template) return { success : { data : template } };
		return { failure : { msg : 'The template was not found.' , code : 300 } };

		},
	}