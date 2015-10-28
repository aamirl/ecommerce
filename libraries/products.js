// Products Library

function Products(){

	}

Products.prototype = {

	model : _s_load.model('products'),
	get helpers() {
		var self = this;
		return { 
			convert : {
				listing : function*(o){
					return yield _s_util.convert.single({data:o,library:'inventory',label:true });
					},
				single : function*(product, template, filters){
					var send = [];
					var active = _s_countries.active.get();

					if(product.sellers){
						yield _s_util.each(product.sellers, function*(listing,i){

							// this is basically to check if filters.admin is there or not, which means do we actually filter the items
							if(!filters.admin){

								if(listing.setup.active == 0) return;
								if(listing.quantity == 0) return;
								if(listing.seller.country == active){
									if(listing.reach == 2) return;
									var di = '1';
									}
								else{
									if(listing.reach == 1) return;
									var di = '2';
									if(listing.restricted.length > 0 && _s_util.indexOf(listing.restricted , active) != -1 ) return; 
									}

								if(filters.negotiable && filters.negotiable != listing.negotiations ) return;
								else if(listing.negotiations == 1) delete listing.negotiations;
								listing.price = (listing.pricing['sale'+di] ? listing.pricing['sale'+di] : listing.pricing['standard'+di]);
		
								
								var add = true;
								_s_u.each(filters, function(dets,filter){
									switch(filter){
										case 'conditions':
											if(_s_util.indexOf(dets,listing.condition)==-1){ add = false ; return; }
											break;
										case 'sellyxship':
											if(listing.sellyxship != dets){ add = false ; return; }
											break;
										}
									})
								if(!add) return;
						

								if(listing.custom_shipping){
									var free = {single:false,with:false};
									var arr = (di==1?['1','2','3','4','5','6']:['7','8','9','10','11','12']);
									_s_u.each(listing.custom_shipping, function(dets,rate){
										if(_s_util.indexOf(arr,rate) !== -1){
											if(dets.single == '') free.single = true;
											if(dets.with == '') free.with = true;
											if(free.single && free.with) return false;
											}
										})
									listing.free = free;
									}
								}
							else{
								if(filters.seller != listing.seller.id) return;
								}

							if(filters.raw){
								send.push(listing);
								}
							else{
								send.push(yield self.helpers.convert.listing(listing));
								}
							})
						
						product.sellers = send;
						}
					
					// now if we don't want the raw object we need to convert it

					if(!filters.raw){
						if(product.line){
							product.line.label = template.setup.line.name.label;
							if(product.line.manufacturer) product.line.manufacturer.label = template.setup.manufacturer.label;
							product.line.category = {
								data : product.line.category,
								converted : _s_sf.categories.name(product.line.category)
								}
							}
						if(product.origin){
							product.origin = {
								data : product.origin,
								converted : _s_countries.name(product.origin),
								label : 'Made In'
								}
							}
						if(product.name){
							product.name = {
								data : product.name,
								label : template.setup.variation.name.label
								}
							}

						if(product.setup) product.setup = yield _s_util.convert.single({data:product.setup,library:'products',label:true});

						
						// parse combo information here

						if(product.combos){
							// we are going to automatically set the combo information to format of comboid : object
							
							var combos = {};

							yield _s_util.each(product.combos , function*(combo,i){

								yield _s_util.each(combo, function*(val,attr){

									if(template.setup.combo[attr]){
										if(attr == 'color') var ins = 'Color'
										else var ins = template.setup.combo[attr].label
										}
									else{
										switch(attr){
											case 'msrp':
												var ins = 'MSRP';
												break;
											case 's_length':
												var ins = 'Length';
												break;
											case 's_width':
												var ins = 'Width';
												break;
											case 's_height':
												var ins = 'Height';
												break;
											case 's_weight':
												var ins = 'Weight';
												break;
											case 'isbn':
												var ins = 'ISBN';
												break;
											case 'upc':
												var ins = 'UPC';
												break;
											case 'jan':
												var ins = 'JAN';
												break;
											case 'ean':
												var ins = 'EAN';
												break;
											case 'issn':
												var ins = 'ISSN';
												break;
											case 'mpn':
												var ins = 'MPN';
												break;
											case 'sku':
												var ins = 'SKU';
												break;
											case 'model':
												var ins = 'Model';
												break;
											case 'style':
												var ins = 'Style';
												break;
											case 'other':
												var ins = 'Other';
												break;
											case 'id':
												return;
												break;
											}
										}

									product.combos[i][attr] = {
										data : val,
										label : ins
										}
									template.setup.combo[attr] && template.setup.combo[attr].defaults && template.setup.combo[attr].defaults[val] ? product.combos[i][attr].converted = template.setup.combo[attr].defaults[val] : null;
									})
								
								// product.combos = yield _s_util.convert.multiple({data:product.combos ,label:true, objectify:true, library : false});
								combos[combo.id] = yield _s_util.convert.single({data:combo,label:true,objectify:true,library:false})
								})

							product.combos = combos;
							}

						if(product.images){
							var _images = _s_load.engine('images');
							var images = product.images;

							if(template.setup.images) {
								
								product.images = {
									label : template.setup.images,
									data : product.images
									}
								
								// lets make the images data friendly towards the combinations
								_s_u.each(images, function(dets, ind){
									var img = dets.image;
									!product.images.data[dets[product.images.label]] ? product.images.data[dets[product.images.label]] = [] : null;

									product.images.data[dets[product.images.label]].push(_images.single.product.main({ data : img, set : true }))
									})
								}
							else{
								product.images = { data : _images.sets.products.main(images) };
								}
							}

						if(product.attributes){

							var attributes = product.attributes;

							product.attributes = {
								properties : {},
								booleans : {}
								}


							_s_u.each(attributes, function(v,k){
								if(template.properties[k]){

									product.attributes.properties[k] = {
										data : v,
										label : template.properties[k].label
										}

									if(k.indexOf('_ddm_') !== -1){
										var converted = '';
										var len = v.length;
										_s_u.each(v, function(val2, ind2){
											if(template.properties[k].defaults[val2]) converted += template.properties[k].defaults[val2]
											else if(val2 == 'other') converted += 'Other'
											if(ind2 != (len-1)) converted += ', ';
											})
										}
									else{ 
										var converted = ( template.properties[k].defaults && template.properties[k].defaults[v] ? template.properties[k].defaults[v] : v )
										}

									if(converted != v) product.attributes.properties[k].converted = converted;

									}
								else if(template.booleans && template.booleans[k]){
									if(v == 2){
										product.attributes.booleans[k] = {
											label : template.booleans[k].label
											}
										}
									}
								else{
									switch(k){
										case 'msrp':
											var ins = 'MSRP';
											break;
										case 's_length':
											var ins = 'Length';
											break;
										case 's_width':
											var ins = 'Width';
											break;
										case 's_height':
											var ins = 'Height';
											break;
										case 's_weight':
											var ins = 'Weight';
											break;
										default:
											var ins = k;
											break;
										}

									product.attributes.properties[k] = {
										data : v,
										converted : ins
										};
									}
								});
							
							product.attributes.properties = yield _s_util.convert.multiple({data:product.attributes.properties ,label:true, objectify:true, library : false});
							}
						}

					return product;
					}
				},
			filters : function(){
				return {
					q : { v:['isSearch'] , b : true},
					id : { v:['isProduct'] , b:true },
					listing : { v:['isListing'] , b:true },
					conditions : { c_in:['1','2','3','4','5','6','7'] , b: true , array:true },
					custom : { in:[1,2,'1','2']  , b:true },
					categories : { v:['isArray'] , b:true },
					lines : { v:['isArray'] , b:true },
					manufacturers : { v:['isArray'] , b:true },
					sellers : { v:['isArray'] , b:true },
					seller : { v:['isSeller'] , b:true },
					sellyxship : { in:[1,2,'1','2']  , b:true },
					negotiable : { in:[1,2,'1','2'] , b:true , array:true },
					rank : { in:['asc','desc'] , default : 'asc', b:true },
					rating : { in:['asc','desc'] , default : 'desc' , b:true},
					convert : { in:['true','false'] , default:'true' },
					include : { v:['isAlphaOrNumeric'], b:true },
					exclude : { v:['isAlphaOrNumeric'], b:true },
					x : { v:['isInt'] , b:true , default : 0 },
					y : { v:['isInt'] , b:true , default : 10 }
					}
				},
			validation : {
				listing : function(){
					return {
						condition : { in:[1,2,3,4,5,6,7,'1','2','3','4','5','6','7'] },
						no_returns : { in:[1,2,'1','2'] , default : 1, b:true  },
						show_in : { in:[1,2,3,'1','2','3'] , default : 1, b:true  },
						combo : { v:['isAlphaOrNumeric']  },
						quantity : { v:['isInt'] },
						negotiations : { in:[1,2,'1','2'] },
						details : { v:['isTextarea'] , b:true },
						images : { v:['isArray'] , b : true },
						product : { v:['isProduct'] , b:true },
						reach : { 
							dependency : {
								1 : {
									pricing : {
										json : true,
										data : {
											standard1 : { v:['isPrice'] },
											sale1 : { v:['isPrice'] , b : true },
											return1 : { v:['isPrice'] , b : true },
											sreturn1 : { v:['isPrice'] , b : true }
											}
										}
									},
								2 : {
									pricing : {
										json : true,
										data : {
											standard2 : { v:['isPrice'] },
											sale2 : { v:['isPrice'] , b : true },
											return2 : { v:['isPrice'] , b:true },
											sreturn2 : { v:['isPrice'] , b : true }
											}
										}
									},
								3 : {
									pricing : {
										json : true,
										data : {
											standard1 : { v:['isPrice'] },
											sale1 : { v:['isPrice'] , b : true },
											return1 : { v:['isPrice'] , b : true },
											sreturn1 : { v:['isPrice'] , b : true },
											standard2 : { v:['isPrice'] },
											sale2 : { v:['isPrice'] , b : true },
											return2 : { v:['isPrice'] , b:true },
											sreturn2 : { v:['isPrice'] , b : true }
											}
										}
									}
								}
							},
						restricted : {v:['isCountries'], filter : 'isCountries' , b:'array'},
						}

					// let's check to see if fulfillment and sellyxship is a thing for this country
					if(_s_countries.fulfillment.fulfilled(obj&&obj.seller?obj.seller:_s_seller.profile.country())){
						c.fulfillment = {
							dependency : {
								1 : {
									process_time : {in:['1','2','3','4','5']},
									shipping_rates : {
										dependency : {
											1 : 'none',
											2 : {
												custom_shipping : {v:['isJSON']}
												}
											}
										},
									sellyxship : {in:['1','2']}
									},
								2 : {
									process_time : {in:['1']},
									shipping_rates : {in:['1']},
									sellyxship : {in:['2']}
									}
								}
							}
						}
					else{
						c.fulfillment = {
							dependency : {
								b : {
									default : "1",
									data : {
										process_time : {in:['1','2','3','4','5']},
										shipping_rates : {
											dependency : {
												1 : 'none',
												2 : {
													custom_shipping : {v:['isJSON']}
													}
												}
											},
										sellyxship : {b:true, default : "1"}
										}
									},
								1 : {
									process_time : {in:['1','2','3','4','5']},
									shipping_rates : {
										dependency : {
											1 : 'none',
											2 : {
												custom_shipping : {v:['isJSON']}
												}
											}
										},
									sellyxship : {in:['1']}
									}
								}
							}
						}
					}
				}
			}
		},
	get : function*(obj){
		// obj will have the filters for the products listing

		// if we want to convert we definitely need to pull back the line information
		if(obj.include) obj.include += ',line.category';

		var results = yield this.model.get(obj);
		var self = this;

		console.log(results);

		if( results.data && results.data.length > 0){
			
			if(!obj.convert || obj.convert == 'false') return results;
			
			var templates = {};

			yield _s_util.each(results.data , function*(product,index){


				if(!templates[product.data.line.category]){
					var template = _s_load.template(product.data.line.category);
					templates[product.data.line.category] = template;

					if(!template) return false;
					} 
				else{
					var template = templates[product.data.line.category];
					}

				results.data[index].data = yield self.helpers.convert.single(product.data, template, obj);
				
				})
			return results;
			}
		else if( obj.id || typeof obj == 'string' ){
			if(!obj.convert || obj.convert == 'false') return results;
			return yield self.helpers.convert.single(results, _s_load.template(results.line.category), obj);
			}

		return false;
		},
	get new() {
		var self = this; 
		return {
			listing : function*(obj){
				var c = self.helpers.validation.listing();

				if(obj && obj.data) var data = _s_req.validate({validators:c, data:obj.data })
				else var data = _s_req.validate(c);
				if(data.failure) return data;

				if(!data.seller) data.seller = _s_seller.helpers.data.document();
				var user = (!data.user?_s_user.profile.id():data.user);

				data.setup = {
					added : _s_dt.now.datetime(),
					by : user,
					active : 1,
					status : 1
					}
				data.id = Math.floor(Math.random() * 1000000000) +'-'+ data.seller.id;

				if(data.product){
					var product = data.product;
					delete data.product;
					// adding this to an existing product 
					var get = yield self.get({id:product,convert:false});
					if(!get) return { failure : 'Listing could not be added because the product could not be found.' };
					
					// check to make sure that the existing product does not have this condition

					// if(_s_util.array.check.object({ array : get.sellers, tester : { condition : data.condition, seller : { id : _s_seller.profile.id() } } })){
					// 	return { failure : { msg : 'Listing could not be added because the seller already has a listing for this product with the same condition. Please update the quantities for that product listing and make final changes there.' } , code : 300 }
					// 	}

					get.sellers.push(data);
					var update = yield self.model.update(get);
					if(update) return { success : true }
					return { failure : {msg : 'The listing was not added to the product.' } , code:300 }
					}	

				return data;
				},
			product : function*(obj){
				// this is the new product function for the products library

				if(obj && obj.data){ var data = obj.data; }
				else{
					// we want a line id so that we can pull up the line information

					var data = _s_req.validate({
						images : { v:['isArray'] },
						line : { v:['isLine'] },
						origin : { v:['isCountry'] },
						additional : { v:['isJSON'] , b:true },
						description : { v:['isTextarea'] },
						name : { v:['isAlphaOrNumeric'] },
						combos : { v:['isArray'] },
						attributes : { v:['isJSON'] },
						sellers : { v:['isJSON'] }
						});
					}

				if(data.failure) return data;

				// submit a seller document to create a local object or use _s_seller as the logged in seller
				var _o_seller = (data.seller?_s_load.object(data.seller):_s_seller);
				var _o_user = (data.user?_s_load.object(data.user):_s_user);

				var doc = {
					performance : {
						logged : [],
						ratings : {},
						counter : 0
						},
					reviews : [],
					setup : {
						seller : _o_seller.profile.id(),
						added : _s_dt.now.datetime(),
						by : _o_user.profile.id(),
						active : 1,
						status : 1,
						locked : 0
						}
					};

				// lets merge documents
				doc = _s_util.merge(doc, data);


				// let's verify the listings



				// now we want to load the line data 
				var line_result = yield _s_load.library('lines').get({id:doc.line, convert:false});
				if(!line_result) return { failure : 'The product line was not found.' };
				
				// now we want to add the information from the line_result to the new document.
				doc.line = line_result;




				return doc;

				var results = yield this.model.new(data);

				if(results) return { success : results.id }
				return { failure : 'The product line could not be added at this time.' }
				},
			}
		},
	get update() {
		var self = this; 
		return {
			listing : function*(obj){
				!obj?obj={}:null;

				if(!_s_seller&&!obj.seller) return { failure : { msg : 'This is a change that is allowed for sellers only.' , code:300 } } ;

				var c = self.helpers.validation.listing();
				c.id = { v:['isListing'] };

				if(obj && obj.data) var data = _s_req.validate({validators:c, data:obj.data })
				else var data = _s_req.validate(c);
				if(data.failure) return data;

				var get = yield self.get({id:data.product,convert:false});
				if(!get) return { failure : { msg : 'Listing could not be added because the product could not be found.' , code:300 } } ;				

				// now find the listing
				var listing = _s_util.array.find.object(get.sellers, 'id', data.id, true);
				if(!listing) return { failure : {msg : 'The listing could not be edited because the listing could not be found.' , code :300 } };

				// now we make sure the listing belongs to the seller
				var seller = (!obj.seller?_s_seller.profile.id():obj.seller);
				if(listing.object.seller.id != seller) return { failure : { msg : 'This listing does not belong to your company.' , code : 300 } }

				// if everything checks out, we go ahead and update
				data = _s_util.merge(listing.object, data)
				get.sellers[listing.index] = data;

				var update = self.model.update(get);

				if(get) return { success : { data : yield self.helpers.convert.listing(data) } }
				return {  failure : { msg : 'The listing was not updated at this time.', code : 300 }}
				}
			}
		}

	}

module.exports = function(){
  	if(!(this instanceof Products)) { return new Products(); }
	}