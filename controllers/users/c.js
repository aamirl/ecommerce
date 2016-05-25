module.exports = function(){  return new Controller(); }

function Controller(){}
Controller.prototype = {
	'clean' : function*(){

		var t = yield this._s.db.es.delete.index(['index':'accounts,transactions'])
		if(t){ return { success : true } }
		return { failure : true }
		}
	}