// manufacturer models


module.exports = {
	new : function*(obj, meta){
		return yield _s_db.es.add({
			index : 'manufacturers',
			body : obj
			}, meta);
		},
	update : function*(obj){
		var doc = {
			id : obj.id,
			doc : (obj.doc?obj.doc:obj),
			index : 'manufacturers',
			merge : true
			}
		delete obj.id;
		return yield _s_db.es.update(doc);
		},
	get : function*(obj){
		// if we have just an id we just submit that;

		if(obj.id || typeof obj == 'string') return yield _s_db.es.get('manufacturers', obj);


		
		var search = {
			index : 'manufacturers',
			body : {
				query : {
					bool : {
						must : [
							
							]
						}
					}
				}
			};

		obj.category ? search.body.query.bool.must.push({ match : { category : obj.category } }) : null;

		if(obj.q){
			search.body.query.bool.must.push({ 
				multi_match : { 
					query : obj.q , 
					fields : [ 'name' ],
					fuzziness : 2.0
				}})
			}
			
		obj.seller ? search.body.query.bool.must.push({match:{'setup.by':obj.seller}}) : null;
		obj.active ? search.body.query.bool.must.push({ match : { 'setup.active' : obj.active } }) : null;
		return yield _s_db.es.search(search, obj);
		}
	}
