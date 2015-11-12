// messages models


module.exports = {
	new : function*(obj, meta){
		return yield _s_db.es.add({
			type : 'messages',
			body : obj
			}, meta);
		},
	update : function*(obj){
		var doc = {
			id : obj.id,
			doc : (obj.doc?obj.doc:obj),
			type : 'messages',
			merge : true
			}
		delete obj.id;
		return yield _s_db.es.update(doc);
		},
	get : function*(obj){
		// if we have just an id we just submit that;
		if(obj.id || typeof obj == 'string') return yield _s_db.es.get('messages', obj);

		var search = {
			index : 'sellyx',
			type : 'messages',
			body : {
				query : {
					bool : {
						must : [
							
							]
						}
					}
				}
			};

		if(obj.recipients){

			_s_u.each(obj.recipients , function(id,ind){
				search.body.query.bool.must.push({
					nested : {
						path : 'users',
						query : {
							bool : {
								must : [
									{
										match : {
											'users.id' : id
											}
										},
									{
										match : {
											'users.active' : 1
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
					path : 'users',
					query : {
						bool : {
							must : [
								{
									match : {
										'users.active' : 1
										}
									},
								{
									match : {
										'users.id' : obj.user + (obj.seller?' '+obj.seller:'')
										}
									}
								]
							}
						}
					}
				})
			}


		return yield _s_db.es.search(search, obj);
		}
	
	}
