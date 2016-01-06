var _manufacturer = _s_load.library('manufacturers');


module.exports = {
	'new' : function*(){
		if(!_s_seller) return _s_l.error(101);
		// this is the api endpoint for adding a new manufacturer
		return yield _manufacturer.new();
		},
	'update' : function*(){
		if(!_s_seller) return _s_l.error(101);
		// this is the api endpoint for updating the information for an existing manufacturer
		return yield _manufacturer.update();
		}
	}