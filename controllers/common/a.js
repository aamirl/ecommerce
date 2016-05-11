

module.exports = {
	cache : function*(){
		return yield this._s.cache.key.get();
		},
	'delete/cache' : function*(){
		yield this._s.cache.delete();
		}
	}