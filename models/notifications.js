// notifications models


function Model(){}
module.exports = function(){ return new Model(); }

Model.prototype = {

	new : function*(obj, meta){
		var self = this
		return yield this._s.db.es.add({
			index : 'notifications',
			id : (obj.id?obj.id:self._s.entity.object.profile.id()),
			body : obj
			}, meta);
		},
	update : function*(obj){
		var doc = {
			id : obj.id,
			doc : (obj.doc?obj.doc:obj),
			index : 'notifications',
			merge : true
			}
		delete obj.id;
		return yield this._s.db.es.update(doc);
		},
	get : function*(obj){
		if(obj.id || typeof obj == 'string') return yield this._s.db.es.get('notifications', obj);

		var search = {
			index : 'notifications',
			body : {
				query : {
					bool : {
						must : [],
						filter : []
						}
					}
				}
			};


		if(obj.count) return yield this._s.db.es.count(search,obj);
		return yield this._s.db.es.search(search, obj)
		}
	}
