
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

		if(obj.id || typeof obj == 'string') return yield _s_db.es.get('listings', obj);
		
		var location = _s_loc.active.get();
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

		_s_u.each(obj, function(dets, index){
			var filter = false;
			var query = false;

			switch(index){
				case 'q':
					query = { 
						multi_match : { 
							query : dets , 
							fields: [ 'title^3', 'description' ],
							fuzziness : 2.0
							}
						}
					break;
				case 'categories':
					query = { terms : { 'category' : dets } };
					break;
				case 'entity' :
					filter = { term : { 'entity.id' : dets } }
					break;
				case 'conditions':
					filter = { terms : { 'condition' : dets } }
					break;
				case 'price':
					filter = { range : { 'price' : {  gte: dets[0], lte:dets[1] } } }
					break;
				case 'type':
					filter = { term : { 'type' : dets } }
					break;
				case 'distance':
					filter = {geo_distance  : {distance : dets + 'km', "location.coordinates" : location.coordinates } };
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

		console.log(JSON.stringify(search));

		return yield _s_db.es.search(search, obj);
		}
	}
