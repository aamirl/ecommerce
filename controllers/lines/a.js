var _lines = _s_load.library('lines');


module.exports = {
	'get/seller' : function*(){
		if(!_s_seller) return _s_l.error(101);
		// we want to call the auth controller with the seller information
		// we add the filters we need for this particular inventory call

		var data = _s_req.validate(_lines.helpers.filters());
		if(data.failure) return data;
		
		// next we want to add the seller information
		// data.seller = 'asdad';
		data.seller = _s_seller.profile.id();
		data.endpoint = true;

		return yield _lines.get(data);
		},
	'new' : function*(){
		if(!_s_seller) return _s_l.error(101);
		// this is the api endpoint for adding a new product line
		return yield _lines.new();
		},
	'update' : function*(){
		if(!_s_seller) return _s_l.error(101);
		// this is the api endpoint for updating the information for an existing manufacturer
		return yield _lines.update();

		}
	}