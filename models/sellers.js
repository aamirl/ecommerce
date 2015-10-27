
// User Models

module.exports = {

	new : function*(obj, meta){
		return yield _s_db.es.add({
			type : 'sellers',
			body : obj
			}, meta);
		},
	update : function*(obj){
		// if we are just submitting the id, we are simply updating the information here
		if(obj.doc){
			obj.type = 'sellers';
			return yield _s_db.es.update(doc);
			}
		
		var doc = {
			id : obj.id,
			doc : obj,
			type : 'sellers',
			}

		var id = obj.id;
		delete obj.id;

		try{
			
			yield _s_db.es.update(doc);


			// after we update this information, we need to update the products with the new product information
			obj.id = id;

			yield _s_db.es.update({
				index : 'sellyx',
				type : 'products,lines,users',
				body : {
					query :{
						match : {
							'sellers.id' : id
							}
						},
					script : 'ctx._source.line = merge',
					params : {
						merge : obj
						}
					}
				});
			return true;
			}
		catch(err){
			return false;
			}
		},
	get : function*(obj){
		// if we have just an id we just submit that;
		if(obj.id || typeof obj == 'string') return yield _s_db.es.get('sellers', obj);

		var search = {
			index : 'sellyx',
			type : 'sellers',
			body : {
				query : {
					bool : {
						must : [
							
							]
						}
					}
				}
			};

		obj.active ? search.body.query.bool.must.push({ match : { 'setup.active' : 1 } }) : null;
		return yield _s_db.es.search(search, obj);
		}
	}
