var _manufacturers = _s_load.library('manufacturers');


module.exports = {
	'get' : function*(){
		var data = _s_req.validate(_manufacturers.helpers.filters());
		if(data.failure) return data;
		
		data.endpoint = true;
		return yield _manufacturers.get(data);
		}
	}