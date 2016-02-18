


module.exports = {

	get : function*(obj){

		if(obj.id || typeof obj == 'string') return yield _s_db.es.get(obj.indices?obj.indices:'t1', obj);
		
		var search = {
			index : (obj.indices?obj.indices:'t1,t2'),
			body : {
				query : {
					bool : {
						must : []
						}
					}
				}
			}	

		if(obj.q){
			search.body.query.bool.must.push({ 
				multi_match : { 
					query : obj.q , 
					fields : [ 'name', 'name.display' ],
					fuzziness : 2.0
				}})			

			return yield _s_db.es.search(search,obj);
			}

		// if(obj.active) search.body.query.filtered.query.bool.must.push({ match : { 'setup.active' : 1 } })
		if(obj.entities) search.body.query.bool.must.push({ ids : { values : obj.entities } }) 

		if(obj.count) return yield _s_db.es.count(search,obj);
		return yield _s_db.es.search(search, obj)
		}
	}
