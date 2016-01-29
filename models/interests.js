
// Interests Model

module.exports = {
	
	get : function*(obj){
		var get = {
			index : 'listings',
			body : {
				query : {
					bool : {
						must : [
							// { term : { 'setup.active' : 1 } }
							]
						}
					}
				}
			};

		obj.entity ? get.body.query.bool.must.push({nested : {path : 'interests', query : {bool : {must : [{match : {'interests.entity.id' : obj.entity } } ] } } } }) : null; 
		
		if(obj.count) return yield _s_db.es.count(get,obj);
		return yield _s_db.es.search(get, obj)
		}
	}
