

module.exports = {
	cache : function*(){
		return yield _s_cache.key.get();
		},
	'delete/cache' : function*(){
		yield _s_cache.delete();
		}
	}