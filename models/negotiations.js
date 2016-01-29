
// Orders Model

module.exports = {
	update : function*(obj){
		var doc = {
			id : obj.id,
			doc : (obj.doc?obj.doc:obj),
			index : 'negotiations',
			merge : true
			}
		delete obj.id;
		return yield _s_db.es.update(doc);
		},
	get new() {
		var self = this;
		return {
			negotiation : function*(obj, meta){
				
				return yield _s_db.es.add({
					index : 'negotiations',
					body : obj
					}, meta);


				}
			}
		},
	check : {
		existing : function*(obj){
			// this is to check if there exists an existing negotiaton between the user and the seller/listing
			var get = {
				index : 'negotiations',
				body : {
					query : {
						bool : {
							must : [
								{ match : { 'user.id' : obj.user } },
								{ match : { 'seller.id' : obj.seller } },
								{ match : { 'item.id' : obj.product } },
								{ match : { 'listing' : obj.listing } },
								{ match : { 'setup.active' : 1 } }
								]
							}
						}
					}
				}

			return yield _s_db.es.search(get, obj);
			}
		},
	get : function*(obj){
		
		if(obj.id || typeof obj == 'string') return yield _s_db.es.get('negotiations', obj);
		
		var get = {
			index : 'negotiations',
			body : {
				query : {
					bool : {
						must : [
							
							]
						}
					}
				}
			};

		if(obj.user) get.body.query.bool.must.push( { match : { 'user.id' : obj.user } } )
		else if (obj.seller) get.body.query.bool.must.push( { match : { 'seller.id' : obj.seller } } )
		else body.query = { match_all : {} }

		obj.active ? get.body.query.bool.must.push({ match : { 'setup.active' : obj.active } }) : null;

		if(obj.count) return yield _s_db.es.count(get,obj);
		return yield _s_db.es.search(get, obj)
		}
	}
