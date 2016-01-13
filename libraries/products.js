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

								if(!product.combos[i].name) product.combos[i].name = 'Combo ' + combo.id;
								
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
										label : ins,
										filter : (attr == 'color' || (template.setup.combo[attr] && (template.setup.combo[attr].defaults || template.setup.combo[attr].range))) ? true : false
										}
									template.setup.combo[attr] && template.setup.combo[attr].defaults && template.setup.combo[attr].defaults[val] ? product.combos[i][attr].converted = template.setup.combo[attr].defaults[val] : null;
									})
								
								// product.combos = yield _s_util.convert.multiple({data:product.combos ,label:true, objectify:true, library : false});
								combos[combo.id] = yield _s_util.convert.single({data:combo,label:true,objectify:true,library:false})
								})
							// console.log(combos);

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
								if(template.booleans && template.booleans[k]){
									if(v==2){
										product.attributes.booleans[k] = {
											label : template.booleans[k].label
											}
										}
									}
								else if(template.properties[k]){

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
										label : ins
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
					conditions : { csv_in:['1','2','3','4','5','6','7'] , b: true },
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
					convert : { in:['true','false',true,false] , b:true, default:'true' },
					include : { v:['isAlphaOrNumeric'], b:true },
					exclude : { v:['isAlphaOrNumeric'], b:true },
					x : { v:['isInt'] , b:true , default : 0 },
					y : { v:['isInt'] , b:true , default : 10 }
					}
				},
			validators : {
				listing : function(obj){
					var c = {
						condition : { in:[1,2,3,4,5,6,7,'1','2','3','4','5','6','7'] },
						no_returns : { in:[1,2,'1','2'] , default : 1, b:true  },
						show_in : { in:[1,2,3,'1','2','3'] , default : 1, b:true  },
						combo : { v:['isAlphaOrNumeric']  },
						quantity : { v:['isInt'] },
						negotiations : { in:[1,2,'1','2'] },
						details : { v:['isTextarea'] , b:true },
						images : { v:['isArray'] , b : true },
						product : { v:['isProduct']  },
						reach : { 
							dependency : true,
							data : {
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
						restricted : {v:['isCountries'], b:'array'},
						}

					// let's check to see if fulfillment and sellyxship is a thing for this country
					if(_s_countries.fulfillment.fulfilled(obj&&obj.seller?obj.seller:_s_seller.profile.country())){
						c.fulfillment = {
							dependency : true,
							data : {
								1 : {
									process_time : {in:['1','2','3','4','5']},
									shipping_rates : {
										dependency : true,
										data : {
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
							dependency : true,
							b : {
								default : "1",
								data : {
									process_time : {in:['1','2','3','4','5']},
									shipping_rates : {
										dependency : true,
										data : {
											1 : 'none',
											2 : {
												custom_shipping : {v:['isJSON']}
												}
											}
										},
									sellyxship : {b:true, default : "1"}
									}
								},
							data : {
								1 : {
									process_time : {in:['1','2','3','4','5']},
									shipping_rates : {
										dependency : true,
										data : {
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

					return c;
					},
				product : function(obj , blank){
					// this would be the validators for a product variation
					return _s_util.merge({
						name : { v:['isAlphaOrNumeric'] , b:blank },
						description : { v:['isTextarea'], b:blank },
						origin : { v:['isCountry'], b:blank },
						// line : { v:['isLine'], b:blank },
						attributes : { v:['isJSON'] , b:blank},
						images : { v:['isArray'] , b:blank},
						additional : { v:['isJSON'] , b:true },
						},obj);
					},
				dimensions : function(obj){
					return {
						s_length : {v:['isDimension']},
						s_width : {v:['isDimension']},
						s_height : {v:['isDimension']},
						s_weight : {v:['isWeight']},
						};
					},
				identifiers : function(){
					return {
						upc : {v:['isUPC'], b:true},
						jan : {v:['isJAN'], b:true},
						ean : {v:['isEAN'], b:true},
						isbn : {v:['isISBN'], b:true},
						issn : {v:['isISSN'], b:true},
						mpn : {v:['isMPN'], b:true},
						sku : {v:['isAlphaOrNumeric'], b:true},
						style : {v:['isAlphaOrNumeric'], b:true},
						model : {v:['isAlphaOrNumeric'], b:true},
						other : {v:['isAlphaOrNumeric'], b:true}
						}
					},
				attributes : function(obj){
					// data will be the template properties
					var template = obj;
					// now let's set up attribute data validators
					var validator = (template.setup.dimensions ? self.helpers.validators.dimensions() : {} );
					// merge the booleans with the properties to give us all the attributes
					if(template.booleans) template.properties = _s_util.merge(template.properties, template.booleans);
		
					// now iterate over all the properties and add them to validator
					_s_u.each(template.properties, function(dets,val){
						// means its an array of items, so lets explode them via filter
						if(val.indexOf('_ddm_') !== -1){
							validator[val] = { v:['isArray']  }
							}
						else if(dets.validate){
							switch(dets.validate){
								case 'year':
									validator[val] = { v:['isYear'] };
									break;
								case 'number':
									validator[val] = { v:['isInt'] };
									break;
								case 'decimal':
									validator[val] = { v:['isDecimal'] };
									break;
								case 'dimension':
									validator[val] = { v:['isDimension'] };
									break;
								}
							}
						else{
							if(val.indexOf('_attr_') !== -1) validator[val] = { in : ['1','2' , 1 , 2] };
							else validator[val] = { v:['isAlphaOrNumeric'] };
							}
						})

					return validator;
					},
				combinations : function*(category , custom){
					// data will be the template properties
					var template = yield _s_load.template(category);
					if(!template) return {  failure : { msg : 'There was no template found.' , code : 300 }}
					custom = (custom && custom == 2 ? true : false);
					// now let's set up attribute data validators
					var validator = (!template.setup.dimensions ? _s_util.merge(self.helpers.validators.dimensions(), self.helpers.validators.identifiers()) : self.helpers.validators.identifiers() );

					if(!custom) validator.msrp = {v:['isPrice'] };
					if(template.setup.identifiers.required){
						_s_u.each(template.setup.identifiers.required, function(val,ind){
							validator[val].b = custom;
							})
						}

					_s_u.each(template.setup.combo, function(dets,key){
						// TODO : see if we want to validate the combo information any further
						if(dets.validate){
							switch(dets.validate){
								case 'year':
									validator[key] = { v:['isYear'] };
									break;
								case 'number':
									validator[key] = { v:['isInt'] };
									break;
								case 'decimal':
									validator[key] = { v:['isDecimal'] };
									break;
								case 'dimension':
									validator[key] = { v:['isDimension'] };
									break;
								}
							}
						else if(key == 'length' || key == 'waist'){
							validator[key] = { v:['isStringInt'] }
							}
						else{
							validator[key] = { v:['isAlphaOrNumeric'] }
							}
						})

					validator.name = { v:['isAlphaOrNumeric'] };

					return validator;
					}
				}
			}
		},
	get : function*(obj){
		// obj will have the filters for the products listing

		// if we want to convert we definitely need to pull back the line information
		if(typeof obj == 'object' && obj.include) obj.include += ',line.category';

		var results = yield this.model.get(obj);
		if(!results) return false;
		var self = this;

		if( results.data && results.data.length > 0){
			if(!obj.convert || obj.convert == 'false'){
				if(obj.endpoint){
					delete obj.endpoint;
					}
				return results;
				}
			
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

		if(obj.endpoint) return { failure : {msg: 'No products matched your query.' } , code : 300 }
		return false;
		},
	get new() {
		var self = this; 
		return {
			listing : function*(obj){
				var c = self.helpers.validators.listing();

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
				!obj?obj={}:null;
				// this is the new product function for the products library

				var validators = {
					images : { v:['isArray'] , b:'array' },
					line : { v:['isLine'] },
					origin : { v:['isCountry'] },
					additional : { v:['isJSON'] , b:true },
					description : { v:['isTextarea'] },
					name : { v:['isAlphaOrNumeric'] },
					combos : { v:['isArray'] },
					attributes : { v:['isJSON'] },
					sellers : { v:['isJSON'] }
					};

				if(obj.data) var data = _s_req.validate({ data : obj.data, validators : validators })
				else var data = _s_req.validate(validators);
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
			combination : function*(obj){
				// feed in the category for the template
				// also let us know if it's custom or not
				var template = _s_load.template(obj.category);
				if(!template) return { failure : { msg : 'There was an issue loading the template for the combination.' , code : 300 } } ;
				
				var t = yield self.helpers.validators.combinations(obj.category,obj.custom);
				if(t.failure) return t;
				var data = _s_req.validate(t);
				if(data.failure) return data;

				data.id = _s_common.helpers.generate.id();
				return data;
				}
			}
		},
	get update() {
		var self = this; 
		return {
			listing : function*(obj){
				!obj?obj={}:null;

				if(!_s_seller&&!obj.seller) return { failure : { msg : 'This is a change that is allowed for sellers only.' , code:300 } } ;
				// if(!obj.category) return { failure : { msg: 'There was no category specified.' , code :300 } }


				var c = self.helpers.validators.listing();
				c.id = { v:['isListing'] };
				delete c.combo;

				if(obj && obj.data) var data = _s_req.validate({validators:c, data:obj.data })
				else var data = _s_req.validate(c);
				if(data.failure) return data;

				// console.log(data)

				var get = yield self.get(data.product);
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

				// console.log(data);

				var update = yield self.model.update(get);
				// console.log(update);
				delete data.product;

				if(get) return { success : { data : yield self.helpers.convert.listing(data) } }
				return {  failure : { msg : 'The listing was not updated at this time.', code : 300 }}
				},
			product : function*(obj){
				!obj?obj={}:null;

				var c = self.helpers.validators.product({id:{ v:['isProduct'] } }, true);
				if(obj && obj.data) var data = _s_req.validate({validators:c, data:obj.data })
				else var data = _s_req.validate(c);
				if(data.failure) return data;
				// if(Object.keys(data).length == 1) return { failure : { msg : 'There was no data submitted to update.' , code : 300 } }

				var original_product = yield self.get(data.id);
				if(!original_product) return { failure : { msg : 'There was no product found to update.' , code : 300 } }

				// let's make sure that the product belongs to the seller trying to edit it
				if(!obj.corporate && (original_product.setup.seller != obj.seller || original_product.setup.locked == 2)) return { failure : { msg : 'You are unauthorized to make this change.' , code : 300 } }

				// if(data.line && data.line != original_product.line.id){
				// 	// let's make sure that the line exists
				// 	var line = yield _s_load.library('lines').get(data.line);
				// 	if(!line) return { failure : { msg : 'The line for this product was not found.' , code : 300 } }
				// 	data.line = line;
				// 	var template = _s_load.template(data.line.category);
				// 	}
				// else{
				// 	delete data.line;
					var template = _s_load.template(original_product.line.category);
					// }

				// lets get the category and the template from the line
				if(!template) return { failure : { msg : 'The category for the product was incorrect.' , code : 300 } };

				if(data.attributes){
					data.attributes = _s_req.validate({
						validators : self.helpers.validators.attributes(template),
						data : data.attributes
						})

					if(data.attributes.failure) return data.attributes;
					}

				// let's merge the new data with the original product
				data = _s_util.merge(original_product, data);
				var update = yield self.model.update(data);
				if(!update) return { failure : { msg : 'The product was not updated at this time.' , code : 300 } }
				

				delete data.sellers;

				return { success : { data : yield self.helpers.convert.single(data, template, {admin:true}) } }
				}
			}
		},
	get actions(){
		var self = this;
		return {
			status : {
				listing : function*(obj){
					!obj?obj={}:null;

					var r = {
						id : {v:['isListing']},
						extra : {v:['isProduct']},
						status : { in:[1,2,'1','2'] }
						}

					obj.corporate ? r.status = { in:[0,1,2,'0','1','2'] } : null;

					var data = _s_req.validate(r);
					if(data.failure) return data;

					var v = {
						id : data.extra,
						library : 'products',
						type : 'listing',
						label : 'listing',
						seller : obj.seller,
						deep : {
							array : 'sellers',
							property : 'id',
							value : data.id,
							status : {
								allowed : [9],
								change : data.status
								}
							},
						corporate : (obj.corporate?_s_corporate.profile.master():null),
						status : {
							allowed : [1,2]
							},
						send : 'object'
						}

					obj.corporate ? v.status = [0,1,2] : null;
					return yield _s_common.check(v);
					}
				},
			summary : function*(obj){
				var data = {
					include : 'sellers.id,sellers.seller.id,name,line.id,line.name,line.category,line.manufacturer.name,sellers.condition,sellers.combo,combos',
					endpoint : true,
					seller : obj.seller,
					type : (obj.type?obj.type:null),
					convert : true,
					admin : true
					}

				var results = yield self.model.get(data);
				// iterate over

				if(results.data && results.data.length > 0){

					if(data.type){
						var send = [];
						
						_s_u.each(results.data, function(product,index){
							switch(data.type){
								case '2':
								case 2 : 
									send.push({
										line : product.data.line.id,
										name : product.data.line.manufacturer.name + ' ' + product.data.line.name,
										category : product.data.line.category
										})
									break;
								case '3':
								case 3 : 
									send.push({
										line : product.data.line.id,
										variation : product.id,
										name : product.data.line.manufacturer.name + ' ' + product.data.line.name + ' ' + product.data.name,
										category : product.data.line.category
										})
									break;
								case '4':
								case 4 :
									_s_u.each(product.data.combos, function(combo,i){
										send.push({
											line : product.data.line.id,
											variation : product.id,
											combination : combo.id,
											name : product.data.line.manufacturer.name + ' ' + product.data.line.name + ' ' + product.data.name + ' - ' + (combo.label || combo.id),
											category : product.data.line.category
											})
										})
									break;
								}
							})
						}
					else{
						var send = {
							categories : {},
							listings : []
							}
						
						_s_u.each(results.data, function(product,index){
							if(!send.categories[product.data.line.category]) send.categories[product.data.line.category] = _s_sf.categories.name(product.data.line.category);
							
							_s_u.each(product.data.sellers, function(listing,ind){
								if(listing.seller.id != obj.seller) return false;
								
								var combo = _s_util.array.find.object(product.data.combos, 'id' , listing.combo);

								if(!combo) return false;
								var name = product.data.line.manufacturer.name + ' ' + product.data.line.name + ' ' + product.data.name + ' - ' + (combo.label||'Unknown Combination') + ' (' + _s_sf.condition(listing.condition) + ')';

								if(obj.combined){
									send.listings.push({
										pal : product.id + '-' + listing.id,
										name : name
										})
									}
								else{
									send.listings.push({
										product : product.id,
										listing : listing.id,
										name : name
										})
									}
								})
							})
						}

					return { success : { data : send } }
					}

				return { failure : {msg: 'There was no summary found for this seller.' } , code : 300 };
				}
			}
		} 
	}

module.exports = function(){
  	if(!(this instanceof Products)) { return new Products(); }
	}