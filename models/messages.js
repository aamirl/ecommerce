// messages models


module.exports = {
	new : function*(obj, meta){
		return yield _s_db.es.add({
			index : 'messages',
			body : obj
			}, meta);
		},
	update : function*(obj){
		var doc = {
			id : obj.id,
			doc : (obj.doc?obj.doc:obj),
			index : 'messages',
			merge : true
			}
		delete obj.id;
		return yield _s_db.es.update(doc);
		},
	get : function*(obj){
		// if we have just an id we just submit that;
		if(obj.id || typeof obj == 'string') return yield _s_db.es.get('messages', obj);

		var search = {
			index : 'messages',
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
			return yield _s_db.es.search(search,obj);
			}


		if(obj.recipients){

			_s_u.each(obj.recipients , function(id,ind){
				search.body.query.bool.must.push({
					nested : {
						path : 'entities',
						query : {
							bool : {
								must : [
									{
										match : {
											'entities.id' : id
											}
										},
									{
										match : {
											'entities.active' : 1
											}
										}
									]
								}
							}
						}
					})
				})
			}
		else{
			search.body.query.bool.must.push({
				nested : {
					path : 'entities',
					query : {
						bool : {
							must : [
								{
									match : {
										'entities.active' : 1
										}
									},
								{
									match : {
										'entities.id' : obj.entity
										}
									},
								{
									match : {
										'entities.deleted_forever' : false
										}
									},
								{
									match : {
										'entities.deleted' : (obj.deleted?obj.deleted:false)
										}
									}
								]
							}
						}
					}
				})
			}


		if(obj.unread) search.body.query.bool.must_not.push({ term : { read : obj.entity } })



		if(obj.count) return yield _s_db.es.count(search,obj);
		return yield _s_db.es.search(search, obj)
		}
	
	}
