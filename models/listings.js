
// Listings Model

module.exports = {
	update : function*(obj){
		var doc = {
			id : obj.id,
			doc : (obj.doc?obj.doc:obj),
			index : 'listings',
			merge : true
			}
		delete obj.id;
		return yield _s_db.es.update(doc);
		},
	new : function*(obj, meta){
		return yield _s_db.es.add({
			index : 'listings',
			body : obj
			}, meta);
		},
	get : function*(obj){
		// if we have just an id we just submit that;
		if(obj.id || typeof obj == 'string') return yield _s_db.es.get('listings', obj);

		var get = {
			index : 'listings',
			body : {
				query : {
					bool : {
						should : [
							
							]
						}
					}
				}
			};

		if(obj.user) get.body.query.bool.should.push( { match : { 'user.id' : obj.user } } )
		if (obj.seller) get.body.query.bool.should.push( { match : { 'seller.id' : obj.seller } } )
		else get.body.query = { match_all : {} }

		return yield _s_db.es.search(get, obj);
		}
	}
