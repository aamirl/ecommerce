// messages models


function Model(){}
module.exports = function(){ return new Model(); }

Model.prototype = {

	new : function*(obj, meta){
		return yield this._s.db.es.add({
			index : 'reviews',
			body : obj
			}, meta);
		},
	update : function*(obj){
		var doc = {
			id : obj.id,
			doc : (obj.doc?obj.doc:obj),
			index : 'reviews',
			merge : true
			}
		delete obj.id;
		return yield this._s.db.es.update(doc);
		},
	get : function*(obj){
		// if we have just an id we just submit that;
		if(obj.id || typeof obj == 'string') return yield this._s.db.es.get('reviews', obj);

		var search = {
			index : 'reviews',
			body : {
				query : {
					bool : {
						must : [
							
							],
						must_not : []
						}
					}
				}
			};

		if(obj.ids) {
			search.body.query.bool.must.push({ ids : { values : obj.ids } }) 
			return yield this._s.db.es.search(search,obj);
			}

		if(obj.by) search.body.query.bool.must.push({ match : { 'by.id' : obj.by } })
		if(obj.for) search.body.query.bool.must.push({ match : { 'for.id' : obj.for } })
		if(obj.target) search.body.query.bool.must.push({ match : { 'target' : obj.target } })

		if(obj.count) return yield this._s.db.es.count(search,obj);
		
		return yield this._s.db.es.search(search, obj)
		}
	
	}
