// orders models


module.exports = {
	new : function*(obj, meta){
		return yield _s_db.es.add({
			type : 'returns',
			body : obj
			}, meta);
		},
	update : function*(obj){
		var doc = {
			id : obj.id,
			doc : (obj.doc?obj.doc:obj),
			type : 'returns',
			merge : true
			}
		delete obj.id;
		return yield _s_db.es.update(doc);
		},
	get : function*(obj){
		// if we have just an id we just submit that;
		if(obj.id || typeof obj == 'string') return yield _s_db.es.get('returns', obj);

		var search = {
			index : 'sellyx',
			type : 'returns',
			body : {
				query : {
					bool : {
						must : [
							
							]
						}
					}
				}
			};

		obj.seller ? search.body.query.bool.must.push({match:{'seller.id':obj.seller}}) : null;
		obj.user ? search.body.query.bool.must.push({match:{'user.id':obj.user}}) : null;
		obj.active ? search.body.query.bool.must.push({ match : { 'setup.active' : obj.active } }) : null;
		return yield _s_db.es.search(search, obj);
		}
	}
