var _countries = _s_load.library('countries');

// Search Model

module.exports = {
	local : function*(obj){
		if(!obj.lat){
			var loc = _s_load.library('location').active.get();
			var lat = loc.coordinates.lat;
			var lon = loc.coordinates.lon;
			}
		else{
			var lat = obj.lat;
			var lon = obj.lon;
			}

		var search = {
			total : true,
			index : 'sellyx',
			type : 'listings',
			body : {
				from : obj.filters.x,
				size : obj.filters.y,
				sort : [
					{
						_geo_distance : {
							order : 'asc',
							unit : 'km',
							'coordinates' : {
								lat : lat,
								lon : lon,
								},
							mode : 'min'
							}
						},
					{
						price : {
							order : 'asc'
							}
						}
					],
				query : {
					filtered : {
						query : {
							bool : {
								must : [
									
									]
								}
							},
						filter : {
							bool : {
								must : [
									{
										term : { 'setup.active' : 1 }
										}
									],
								should : [
									{
										geo_distance : {
											distance : obj.filters.distance + 'km',
											'location.coordinates' : {
												lat : lat,
												lon : lon
												}
											}
										}
									]
								}
							}
						}
					}
				}
			}

		var template = _s_util.clone.shallow(search);
		if(obj.user) template.body.query.filtered.query.bool.must.push( { match : { 'user.id' : obj.user  } } );
		if(obj.seller) template.body.query.filtered.query.bool.must.push( { match : { 'seller.id' : obj.seller  } } );

		if(!obj.filters.q){
			if(template.body.query.filtered.query.bool.must.length == 0) delete template.body.query.filtered.query
			}
		else { 
			template.body.query.filtered.query.bool.must.push({
				fuzzy_like_this : {
					fields: [ 'name', 'description' ],
					like_text : obj.filters.q,
					fuzziness : 0.3
					}
				})
			}

		
		_s_u.each(obj.filters, function(dets, filter){

			switch(filter){
				case 'category':
					var list = { term : { 'category' : dets } }
					break;
				case 'condition':
					var list = { terms : { 'condition' : dets } }
					break;
				case 'type':
					var list = { term : { 'type' : dets } }
					break;
				case 'by':
					if(dets == 1) var list = { exists : { field : 'user' } }
					else var list = { exists : { field : 'seller'} }
					break;
				case 'price':
					var list = { range : { 'price' : { gte : parseInt(dets[0]) , lte : parseInt(dets[1]) }} };
					break;
				default : 
					return;
					break;
				}
			template.body.query.filtered.filter.bool.must.push(list);
			})

		return {results : yield _s_db.es.search(template, obj) , filters : obj.filters };
		},
	world : function*(obj){
		var search = {
			total : true,
			index : 'sellyx',
			type : 'products',
			body : {
				from : obj.filters.x,
				size : obj.filters.y,
				query : {
					filtered : {
						query : {
							bool : {
								must : [
									{
										term : { 'setup.active' : 1 }
										}
									]
								}
							},
						filter : {
							nested : {
								path : 'sellers',
								filter : {
									bool : {
										must : [
											{
												term : { 'sellers.setup.active' : 1 }
												}
											
											],
										should : [
											{ 
												bool : {
													must : [
														{ term : { 'sellers.seller.country' : _countries.active.get() } },
														{ term : { reach : 1 } }
														]
													}
											
												},
											{ 
												term : { reach : 3 }
												}

											],
										must_not : [
											{ 
												bool : {
													must : [
														{ term : { 'sellers.seller.country' : _countries.active.get() } },
														{ term : { reach : 2 } }
														]
													}
											
												},

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
							order : (obj.filters.rank=='desc'?'desc':'asc'),
							mode : 'min',
							nested_path : 'sellers',
							}
					},
					{
						'sellers.pricing.sale1' : { 
							order : (obj.filters.rank=='desc'?'asc':'desc'),
							mode : 'max',
							nested_path : 'sellers'
							}
					},
					{
						'setup.rating' : { 
							order : obj.filters.rating,
							}
						}
					]
				}
			}

		if(obj.line) search.body.query.filtered.query.bool.must.push({ match : { 'line.id' : obj.line } });
		if(obj.manufacturer) search.body.query.filtered.query.bool.must.push({ match : { 'line.manufacturer.id' : obj.manufacturer } });
		if(obj.seller) search.body.query.filtered.query.bool.must.push({nested : {path : 'sellers', query : {bool : {must : [{match : { 'sellers.seller.id' : obj.seller } } ] } } } });
		if(obj.filters.q){
			search.body.query.filtered.query.bool.must.push({
				fuzzy_like_this : {
					fields: [ 'name', 'description', 'line.manufacturer.name' , 'line.name' , 'line.description' ],
					like_text : obj.filters.q,
					fuzziness : 0.3
					}
				})
			}
		
		_s_u.each(obj.filters, function(dets, filter){

			switch(filter){
				case 'condition':
					var ins = { terms : { 'sellers.condition' : dets } }
					break;
				case 'category':
					search.body.query.filtered.query.bool.must.push({ term : { 'line.category' : dets } });
					return;
					break;
				case 'sellyxship':
					var ins = { term : { 'sellers.sellyxship' : dets } }
					break;
				case 'custom':
					search.body.query.filtered.query.bool.must.push({ term : { 'line.custom' : dets } });
					return;
					break;
				case 'negotiable':
					var ins = { term : { 'sellers.negotiations' : dets } }
					break;
				default : 
					return;
					break;
				}
			search.body.query.filtered.filter.nested.filter.bool.must.push(ins);
			})

		return {results : yield _s_db.es.search(search, obj) , filters : obj.filters };
		}
	}
