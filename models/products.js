
// Products Models

module.exports = {
	new : function*(obj, meta){
		return yield this._s.db.es.add({
			index : 'products',
			body : obj
			}, meta);
		},	
	update : function*(obj){
		var doc = {
			id : obj.id,
			data : obj,
			index : 'products',
			}

		delete doc.data.id;
		return yield this._s.db.es.update(doc);
		},
	get : function*(obj){


		if(obj.id || typeof obj == 'string') return yield this._s.db.es.get('products', obj);
		
		var search = {
			total : true,
			index : 'products',
			body : {
				from : obj.x,
				size : obj.y,
				query : {
					bool : {
						must : [],
						filter : []
						}
					}
				}
			}

		_s_u.each(obj, function(dets, index){
			var filter = false;
			var query = false;

			switch(index){
				case 'q':
					query = { 
						multi_match : { 
							query : dets , 
							fields: [ 'name^3', 'description', 'line.manufacturer.name' , 'line.name' , 'line.description' ],
							fuzziness : 2.0
							}
						}
					break;
				case 'lines':
					query = { terms : { 'line.id' : dets } };
					break;
				case 'manufacturers':
					query = { terms : { 'line.manufacturer.id' : dets } };
					break;
				case 'categories':
					query = { terms : { 'line.category' : dets } };
					break;
				case 'custom':
					query = { term : { 'line.custom' : dets } };
					break;
				case 'entity' :
					filter = { nested : {path : 'sellers', query : {bool : {must : [{match : {'sellers.seller.id' : dets } } ] } } } }
					break;
				case 'conditions':
					filter = { terms : { 'condition' : dets } }
					break;
				case 'price':
					// filter = { range : { 'price' : {  gte: dets[0], lte:dets[1] } } }
					break;
				case 'sellyxship':
					filter = { nested : {path : 'sellers', query : {bool : {must : [{match : {'sellers.seller.sellyship' : dets } } ] } } } }
					break;
				case 'negotiable':
					filter = { nested : {path : 'sellers', query : {bool : {must : [{match : {'sellers.seller.negotiations' : dets } } ] } } } }
					break;
				default : 
					return;
					break;
				}

			if(query){
				search.body.query.bool.must.push(query);
				}
			else if(filter){
				search.body.query.bool.filter.push(filter);
				}
			})

		if(obj.sort){
			search.body.sort = [];
			if(obj.sort == 'date'){
				search.body.sort.push({
					"setup.added" : { 
						order : obj.rank
						}
					})
				}
			// else if(obj.sort == 'price'){
			// 	search.body.sort.push({
			// 		price : {
			// 			order : obj.rank
			// 			}
			// 		})
			// 	}
			}

		console.log(JSON.stringify(search));

		if(obj.count) return yield this._s.db.es.count(search,obj);
		return yield this._s.db.es.search(search, obj)
		}
	}
