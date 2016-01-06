

module.exports = {
	cache : function*(){
		return yield _s_cache.key.get();
		}
	}