
// User Models


module.exports = {

	new : function*(obj, meta){
		return yield _s_db.es.add({
			type : 'users',
			body : obj
			}, meta);
		},
	update : function*(obj){
		// if we are just submitting the id, we are simply updating the information here
		if(obj.doc){
			obj.type = 'users';
			return yield _s_db.es.update(doc);
			}
		
		var doc = {
			id : obj.id,
			doc : obj,
			type : 'users',
			}

		var id = obj.id;
		delete obj.id;

		try{
			
			yield _s_db.es.update(doc);


			// after we update this information, we need to update the products as well with the new product information
			obj.id = id;

			yield _s_db.es.update({
				index : 'sellyx',
				type : 'products,lines',
				body : {
					query :{
						match : {
							'users.id' : id
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
		if(obj.id || typeof obj == 'string') return yield _s_db.es.get('users', obj);

		if(obj.su){
			var search = {
				index : 'sellyx',
				type : 'users,sellers',
				body : {
					query : {
						filtered : {
							query : {
								bool : {
									must : [
										{
											match : {
												'setup.active' : 1
												}
											}
										]
									}
								},
							filter : {
								ids : {
									values : obj.su
									}
								}
							}
						}
					}
				}

			return yield _s_db.es.search(search, obj)
			}

		var search = {
			index : 'sellyx',
			type : 'users',
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
		obj.active ? search.body.query.bool.must.push({ match : { 'setup.active' : 1 } }) : null;
		return yield _s_db.es.search(search, obj);
		}
	}
