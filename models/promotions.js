// orders models


module.exports = {
	new : function*(obj, meta){
		return yield _s_db.es.add({
			index : 'promotions',
			body : obj
			}, meta);
		},
	update : function*(obj){
		var doc = {
			id : obj.id,
			doc : (obj.doc?obj.doc:obj),
			index : 'promotions',
			merge : true
			}
		delete obj.id;
		return yield _s_db.es.update(doc);
		},
	get : function*(obj){
		// if we have just an id we just submit that;
		if(obj.id || typeof obj == 'string') return yield _s_db.es.get('promotions', obj);

		var get = {
			index : 'promotions',
			body : {
				query : {
					filtered : {
						query : {
							bool : {
								must : []
								}
							},
						filter : {
							bool : {
								must : [
									],
								must_not : [
									],
								should : [
									]
								}
							}
						}
					}
				}
			}

		// obj.products ? get.body.query.filtered.filter.bool.should.push({ nested : {path : 'items', query : {bool : {must : [{terms : {'items.product' : obj.products } } ] } } } }) : null;
		obj.categories ? get.body.query.filtered.filter.bool.should.push({term : {categories : obj.categories } }) : null;
		obj.order ? get.body.query.filtered.filter.bool.should.push({term : {apply : 2 } }) : null;
		
		obj.pal ? get.body.query.filtered.filter.bool.must.push({term : { items : obj.pal }}) : null;
		
		obj.active ? get.body.query.filtered.filter.bool.must.push({term : { 'setup.active' : obj.active } }) : null;
		obj.seller ? get.body.query.filtered.filter.bool.must.push({term : { 'seller' : obj.seller } }) : null;
		obj.redemption ? get.body.query.filtered.filter.bool.must.push({term : { redemption : obj.redemption } }) : null;
		obj.start ? get.body.query.filtered.filter.bool.must.push({range : { start : {lt:obj.start} } }) : null;
		obj.sellers ? get.body.query.filtered.filter.bool.must.push({terms : { 'seller.id' : obj.sellers } }) : null;
		obj.country ? get.body.query.filtered.filter.bool.must_not.push({terms : { restricted : obj.country } }) : null;

		// obj.seller ? search.body.query.bool.must.push({match:{'seller.id':obj.seller}}) : null;
		// obj.user ? search.body.query.bool.must.push({match:{'user.id':obj.user}}) : null;
		// obj.active ? search.body.query.bool.must.push({ match : { 'setup.active' : obj.active } }) : null;
		return yield _s_db.es.search(get, obj);
		}
	}
