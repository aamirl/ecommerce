module.exports = function(){  return new Controller(); }

function Controller(){}
Controller.prototype = {
	get : function*(){
		var _listings = this._s.library('listings');

		var data = this._s.req.validate(_listings.helpers.filters());
		if(data.failure) return data;
		data.endpoint = true;

		return yield _listings.get(data);
		},
	test : function*(){

		return { success : true }
		

		}
	}