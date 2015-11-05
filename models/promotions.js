// orders models


module.exports = {
	new : function*(obj, meta){
		return yield _s_db.es.add({
			type : 'promotions',
			body : obj
			}, meta);
		},
	update : function*(obj){
		var doc = {
			id : obj.id,
			doc : (obj.doc?obj.doc:obj),
			type : 'promotions',
			merge : true
			}
		delete obj.id;
		return yield _s_db.es.update(doc);
		},
	get : function*(obj){
		// if we have just an id we just submit that;
		if(obj.id || typeof obj == 'string') return yield _s_db.es.get('promotions', obj);

		var get = {
			index : 'sellyx',
			type : 'promotions',
			body : {
				query : {
					filtered : {
						filter : {
							bool : {
								must : [
									{
										range : {
											start : {
												lt : 'now'
												}
											}
										},
									{
										range : {
											end : {
												gt : 'now'
												}
											}
										},
									{
										terms : {
											seller : obj.sellers
											}
										}
									],
								must_not : [
									{
										term : {
											restricted : (obj.country ? obj.country : _countries.active.get())
											}
										}
									],
								should : [
									{
										nested : {
											path : 'items',
											query : {
												bool : {
													must : [
														// {
														// 	terms : {
														// 		'items.listing' : obj.listings,
														// 		minimum_should_match : 1
														// 		}
														// 	},
														{
															terms : {
																'items.product' : obj.products
																}
															}
														]
													}
												}
											}
										},
									{
										term : {
											categories : obj.categories
											}
										},
									{
										term : {
											apply : 2
											}
										}
									]
								}
							}
						}
					}
				}
			}

		obj.active ? get.body.query.filtered.filter.bool.must.push({term : { 'setup.active' : obj.active } }) : null;
		obj.redemption ? get.body.query.filtered.filter.bool.must.push({term : { redemption : obj.redemption } }) : null;

		obj.seller ? search.body.query.bool.must.push({match:{'seller.id':obj.seller}}) : null;
		obj.user ? search.body.query.bool.must.push({match:{'user.id':obj.user}}) : null;
		obj.active ? search.body.query.bool.must.push({ match : { 'setup.active' : obj.active } }) : null;
		return yield _s_db.es.search(search, obj);
		}
	}
