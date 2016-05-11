// orders models


module.exports = {
	new : function*(obj, meta){
		return yield this._s.db.es.add({
			index : 'returns',
			body : obj
			}, meta);
		},
	update : function*(obj){
		var doc = {
			id : obj.id,
			doc : (obj.doc?obj.doc:obj),
			index : 'returns',
			merge : true
			}
		delete obj.id;
		return yield this._s.db.es.update(doc);
		},
	get : function*(obj){
		// if we have just an id we just submit that;
		if(obj.id || typeof obj == 'string') return yield this._s.db.es.get('returns', obj);

		var search = {
			index : 'returns',
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
		
		if(obj.count) return yield this._s.db.es.count(search,obj);
		return yield this._s.db.es.search(search, obj)
		}
	}
