

module.exports = {

	new : function*(obj, meta){
		return yield _s_db.es.add({
			index : 't2',
			body : obj
			}, meta);
		},
	update : function*(obj){
		// if we are just submitting the id, we are simply updating the information here
		if(obj.doc){
			obj.index = 't2';
			return yield _s_db.es.update(doc);
			}
		
		var doc = {
			id : obj.id,
			doc : obj,
			index : 't2',
			}

		var id = obj.id;
		delete obj.id;

		try{
			
			yield _s_db.es.update(doc);


			// after we update this information, we need to update the products with the new product information
			obj.id = id;

			yield _s_db.es.update({
				index : 'products,lines,users',
				body : {
					query :{
						match : {
							't2.id' : id
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
		if(obj.id || typeof obj == 'string') return yield _s_db.es.get('t2', obj);

		var search = {
			index : 't2',
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
