


module.exports = function(){  return new Controller(); }

function Controller(){}
Controller.prototype = {
	'new' : function*(){
		var _manufacturer = this._s.library('manufacturers');
		return yield _manufacturer.new();
		},
	'update' : function*(){
		var _manufacturer = this._s.library('manufacturers');
		return yield _manufacturer.update();
		}
	}