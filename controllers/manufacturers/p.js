


module.exports = function(){  return new Controller(); }

function Controller(){}
Controller.prototype = {
	'get' : function*(){
		var _manufacturer = this._s.library('manufacturers');
		
		var data = this._s.req.validate(_manufacturers.helpers.filters());
		if(data.failure) return data;
		
		data.endpoint = true;
		return yield _manufacturers.get(data);
		}
	}