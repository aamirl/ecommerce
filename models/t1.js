
// User Models


module.exports = {

	new : function*(obj, meta){
		return yield _s_db.es.add({
			index : 't1',
			body : obj
			}, meta);
		},
	update : function*(obj){
		// if we are just submitting the id, we are simply updating the information here
		if(obj.doc){
			obj.index = 'base';
			return yield _s_db.es.update(doc);
			}
		
		var doc = {
			id : obj.id,
			doc : obj,
			index : 't1',
			}

		var id = obj.id;
		delete obj.id;

		try{
			
			yield _s_db.es.update(doc);


			// after we update this information, we need to update the products as well with the new product information
			obj.id = id;

			yield _s_db.es.update({
				index : 'products,lines',
				type : 'base',
				body : {
					query :{
						match : {
							't1.id' : id
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
		if(obj.id || typeof obj == 'string') return yield _s_db.es.get('t1', obj);

		var search = {
			index : 't1',
			body : {
				query : {
					bool : {
						must : [
							
							]
						}
					}
				}
			};

		if(obj.q){
			search.body.query.bool.must.push({ 
				multi_match : { 
					query : obj.q , 
					fields : [ 'name^3', 'name.display' , 'description' ],
					fuzziness : 2.0
				}})
			}


		obj.entity ? search.body.query.bool.must.push({nested : {path : 'entities', query : {bool : {must : [{match : {'entities.id' : obj.entity } } ] } } } }) : null; 
		obj.active ? search.body.query.bool.must.push({ match : { 'setup.active' : t1 } }) : null;
		return yield _s_db.es.search(search, obj);
		}
	}
