
// Listings Model


function Model(){}
module.exports = function(){ return new Model(); }

Model.prototype = {

	update : function*(obj){
		var doc = {
			id : obj.id,
			doc : (obj.doc?obj.doc:obj),
			index : 'listings',
			merge : true
			}
		delete obj.id;
		return yield this._s.db.es.update(doc);
		},
	new : function*(obj, meta){
		return yield this._s.db.es.add({
			index : 'listings',
			body : obj
			}, meta);
		},
	get : function*(obj){

		if(obj.id || typeof obj == 'string') return yield this._s.db.es.get('listings', obj);
		

		var location = this._s.loc.active.get();
		var search = {
			total : true,
			index : 'listings',
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

		if(obj.ids) {
			search.body.query.bool.must.push({ ids : { values : obj.ids } }) 
			return yield this._s.db.es.search(search,obj);
			}

		_s_u.each(obj, function(dets, index){
			var filter = false;
			var query = false;

			switch(index){
				case 'q':
					query = { 
						multi_match : { 
							query : dets , 
							fields: [ 'title^3', 'description','entity.name' ],
							fuzziness : "AUTO",
							prefix_length : 2
							}
						}
					break;
				case 'favorites':
					query = {
						nested : {
							path : 'favorites', 
							query : {
								bool : {
									must : [
										{match : {'favorites.id' : obj.favorites } } 
										],
									filter : []
									} 
								} 
							} 
						}
					break;
				case 'categories':
					if(dets==["0"]) return;
					query = { terms : { 'category' : dets } };
					break;
				case 'entity' :
					filter = { term : { 'entity.id' : dets } }
					break;
				case 'entity_type':
					filter = { terms : { 'entity.type' : dets } }
					break;
				case 'conditions':
					filter = { terms : { 'condition' : dets } }
					break;
				case 'price':
					filter = { range : { 'price' : {  gte: dets[0], lte:dets[1] } } }
					break;
				case 'type':
					query = { terms : { 'type' : dets } }
					break;
				case 'distance':
					filter = {geo_distance  : {distance : dets + 'km', "location.coordinates" : location.coordinates } };
					break;
				case 'p_type':
					filter = { term : { 'p_type' : dets } }
					break;
				case 'htype':
					filter = { terms : { 'htype' : dets } }
					break;
				case 'rooms':
					filter = { terms : { 'rooms' : dets } }
					break;
				case 'bathrooms_f':
					filter = { terms : { 'bathrooms_f' : dets } }
					break;
				case 'bathrooms_h':
					filter = { terms : { 'bathrooms_h' : dets } }
					break;
				case 's_status':
					filter = { terms : { 'setup.status' : dets } }
					break;
				case 's_active':
					filter = { terms : { 'setup.active' : dets } }
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
			if(obj.sort == 'distance'){
				search.body.sort.push({
		            _geo_distance : {
		                "location.coordinates" : location.coordinates,
		                order : obj.rank,
		                unit : "km",
		                mode : "min",
		                distance_type : "sloppy_arc"
	            		}
        			})
				}
			else if(obj.sort == 'date'){
				search.body.sort.push({
					"setup.added" : { 
						order : obj.rank
						}
					})
				}
			else if(obj.sort == 'price'){
				search.body.sort.push({
					price : {
						order : obj.rank
						}
					})
				}
			}

		console.log(JSON.stringify(search))
		
		if(obj.count) return yield this._s.db.es.count(search,obj);
		return yield this._s.db.es.search(search, obj);
		}
	}
