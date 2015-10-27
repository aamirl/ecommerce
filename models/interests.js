
// Interests Model

module.exports = {
	
	get : function*(obj){
		var get = {
			index : 'sellyx',
			type : 'listings',
			body : {
				query : {
					bool : {
						must : [
							{ term : { 'setup.active' : 1 } }
							]
						}
					}
				}
			};

		obj.user ? get.body.query.bool.must.push({nested : {path : 'interests', query : {bool : {must : [{match : {'interests.user.id' : obj.user } } ] } } } }) : null; 
		return yield _s_db.es.search(get, obj);
		}
	}
