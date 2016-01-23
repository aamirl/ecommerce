var _manufacturer = _s_load.library('manufacturers');


module.exports = {
	'new' : function*(){
		return yield _manufacturer.new();
		},
	'update' : function*(){
		return yield _manufacturer.update();
		}
	}