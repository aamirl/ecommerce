
// Products Models

module.exports = {
	new : function*(obj, meta){
		return yield _s_db.es.add({
			index : 'products',
			body : obj
			}, meta);
		},	
	update : function*(obj){
		// if we are just submitting the id, we are simply updating the information here
		
		var doc = {
			id : obj.id,
			data : obj,
			index : 'products',
			}

		// var id = obj.id;
		delete doc.data.id;

		try{
			
			yield _s_db.es.update(doc);

			// // after we update this information, we need to update other information as well
			// obj.id = id;

			// yield _s_db.es.update({
			// 	index : 'sellyx',
			// 	index : 'products',
			// 	body : {
			// 		query :{
			// 			match : {
			// 				'line.id' : id
			// 				}
			// 			},
			// 		script : 'ctx._source.line = merge',
			// 		params : {
			// 			merge : obj
			// 			}
			// 		}
			// 	});
			return true;
			}
		catch(err){
			return false;
			}
		},
	get : function*(obj){
		
		// if we have just an id we just submit that;
		if(obj.id || typeof obj == 'string') return yield _s_db.es.get('products', obj);

		var search = {
			total : true,
			index : 'products',
			body : {
				from : obj.x,
				size : obj.y,
				query : {
					filtered : {
						query : {
							bool : {
								must : [
									// {
									// 	term : { 'setup.active' : 1 }
									// 	}
									]
								}
							},
						filter : {
							nested : {
								path : 'sellers',
								filter : {
									bool : {
										must : [
											// {
											// 	term : { 'sellers.setup.active' : 1 }
											// 	}
											
											],
										should : [
											// { 
											// 	bool : {
											// 		must : [
											// 			{ term : { 'sellers.seller.country' : _s_countries.active.get() } },
											// 			{ term : { reach : 1 } }
											// 			]
											// 		}
											
											// 	},
											// { 
											// 	term : { reach : 3 }
											// 	}

											],
										must_not : [
											// { 
											// 	bool : {
											// 		must : [
											// 			{ term : { 'sellers.seller.country' : _s_countries.active.get() } },
											// 			{ term : { reach : 2 } }
											// 			]
											// 		}
											
											// 	}
											]
										}
									}
								}
							}
						}
					},
				sort : [
					// {
					// 	'_script' : {
					// 		'script' : "if(ctx._source.sellers.reach == 1)"
					// 		},
					// 	'order' : 'asc'

					// 	}
					{
						'sellers.pricing.sale1' : { 
							order : (obj.rank=='desc'?'desc':'asc'),
							mode : 'min',
							nested_path : 'sellers',
							}
					},
					{
						'sellers.pricing.sale1' : { 
							order : (obj.rank=='desc'?'asc':'desc'),
							mode : 'max',
							nested_path : 'sellers'
							}
					},
					// {
					// 	'setup.rating' : { 
					// 		order : obj.rating,
					// 		}
					// 	}
					]
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
				case 'seller' :
					// search.body.query.bool.must.push({ match : { 'sellers.seller.id' : dets } });
					search.body.query.filtered.query.bool.must.push({nested : {path : 'sellers', query : {bool : {must : [{match : {'sellers.seller.id' : dets } } ] } } } });
					return;
					break;
				case 'added':
					query = { term : { 'setup.seller' : dets } }
					break;
				case 'sellers' :
					// search.body.query.bool = { must : [] };
					// search.body.query.filtered.query.bool.must.push({nested : {path : 'sellers', query : {bool : {must : [{terms : {'sellers.seller.id' : dets } } ] } } } });
					// return;
					// filter = { terms : { 'sellers.seller.id' : dets } }
					break;
				case 'conditions':
					filter = { terms : { 'sellers.condition' : dets } }
					break;
				case 'sellyxship':
					filter = { term : { 'sellers.sellyxship' : dets } }
					break;
				case 'negotiable':
					filter = { term : { 'sellers.negotiations' : dets } }
					break;
				default : 
					return;
					break;
				}

			if(query){
				search.body.query.filtered.query.bool.must.push(query);
				}
			else if(filter){
				search.body.query.filtered.filter.nested.filter.bool.must.push(filter);
				}
			})

		return yield _s_db.es.search(search, obj);
		}
	}
