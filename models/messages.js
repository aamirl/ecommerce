// messages models


function Model(){}
module.exports = function(){ return new Model(); }

Model.prototype = {

	new : function*(obj, meta){
		return yield this._s.db.es.add({
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
		return yield this._s.db.es.update(doc);
		},
	get : function*(obj){
		// if we have just an id we just submit that;
		if(obj.id || typeof obj == 'string') return yield this._s.db.es.get('messages', obj);

		var search = {
			index : 'messages',
			body : {
				query : {
					bool : {
						must : [
							
							],
						must_not : [],
						filter : []
						},
					},
				sort:[
				{
					"setup.updated" : { 
						order : 'desc'
						}
					}
				]
				}
			};

		if(obj.listing){
			search.body.query.bool.filter.push({ term : { listing : obj.listing } })

			if(obj.entities){

				_s_u.each(obj.entities , function(id,ind){
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

			console.log(JSON.stringify(search))

			return yield this._s.db.es.search(search,obj);
			}

		if(obj.ids) {
			search.body.query.bool.must.push({ ids : { values : obj.ids } }) 
			return yield this._s.db.es.search(search,obj);
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



		if(obj.count) return yield this._s.db.es.count(search,obj);
		return yield this._s.db.es.search(search, obj)
		}
	
	}
