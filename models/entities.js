

function Model(){}
module.exports = function(){ return new Model(); }

Model.prototype = {

	get : function*(obj){

		if(obj.id || typeof obj == 'string') return yield this._s.db.es.get(obj.indices?obj.indices:'t1', obj);
		
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

			return yield this._s.db.es.search(search,obj);
			}

		// if(obj.active) search.body.query.filtered.query.bool.must.push({ match : { 'setup.active' : 1 } })
		if(obj.entities) search.body.query.bool.must.push({ ids : { values : obj.entities } }) 

		if(obj.count) return yield this._s.db.es.count(search,obj);
		return yield this._s.db.es.search(search, obj)
		}
	}
