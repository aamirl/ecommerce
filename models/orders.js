// orders models


module.exports = {
	new : function*(obj, meta){
		return yield _s_db.es.add({
			index : 'orders',
			body : obj
			}, meta);
		},
	update : function*(obj){
		var doc = {
			id : obj.id,
			doc : (obj.doc?obj.doc:obj),
			index : 'orders',
			merge : true
			}
		delete obj.id;
		return yield _s_db.es.update(doc);
		},
	get : function*(obj){
		if(obj.id || typeof obj == 'string') return yield _s_db.es.get('orders', obj);

		var search = {
			index : 'orders',
			body : {
				query : {
					bool : {
						must : [
							
							],
						filter : []
						}
					}
				}
			};

		obj.listing ? search.body.query.bool.must.push({match:{'listing':obj.listing}}) : null;
		obj.quantity ? search.body.query.bool.must.push({ range: { 'quantity' : { gt : obj.quantity } } }) : null;
		obj.status ? search.body.query.bool.must.push({match:{'setup.status':obj.status}}) : null;
		obj.buying ? search.body.query.bool.filter.push({term:{'buying.id':obj.buying}}) : null;
		obj.selling ? search.body.query.bool.filter.push({term:{'selling.id':obj.selling}}) : null;
		obj.type ? search.body.query.bool.filter.push({term:{'type':obj.type}}) : null;
		
		

		console.log(JSON.stringify(search))
		return yield _s_db.es.search(search, obj);
		}
	}
