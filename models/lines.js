
// Catalog Models

var _location = _s_load.library('location');

module.exports = {
	new : function*(obj, meta){
		return yield _s_db.es.add({
			index : 'lines',
			body : obj
			}, meta);
		},	
	update : function*(obj){
		// if we are just submitting the id, we are simply updating the information here
		if(obj.doc){
			obj.index = 'lines';
			return yield _s_db.es.update(doc);
			}
		
		var doc = {
			id : obj.id,
			doc : obj,
			index : 'lines',
			}

		var id = obj.id;
		delete obj.id;

		try{
			
			yield _s_db.es.update(doc);


			// after we update this information, we need to update the products as well with the new product information
			obj.id = id;

			yield _s_db.es.update({
				index : 'products',
				body : {
					query :{
						match : {
							'line.id' : id
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
		if(obj.id || typeof obj == 'string') return yield _s_db.es.get('lines', obj);

		var search = {
			index : 'lines',
			body : {
				query : {
					bool : {
						must : [
							
							]
						}
					}
				}
			};

		obj.custom ? search.body.query.bool.must.push({match:{ 'custom' : obj.custom }}) : null;
		obj.category ? search.body.query.bool.must.push({ match : { category : obj.category } }) : null;
		
		if(obj.q){
			search.body.query.bool.must.push({ 
				multi_match : { 
					query : obj.q , 
					fields : [ 'name^3', 'description', 'manufacturer.name' ],
					fuzziness : 2.0
				}})
			}

		obj.seller ? search.body.query.bool.must.push({match:{'setup.seller':obj.seller}}) : null;
		// obj.approvals ? search.body.query.bool.must.push({ match : { 'setup.active' : 1 } }) : null;
		obj.active ? search.body.query.bool.must.push({ match : { 'setup.active' : 1 } }) : null;
		
		if(obj.count) return yield _s_db.es.count(search,obj);
		return yield _s_db.es.search(search, obj)
		}
	}
