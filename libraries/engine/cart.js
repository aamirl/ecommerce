


function Cart(){
	if(!_s_cache.key.get('cart', true)) this.empty();

	this.default_cart = {
		orders : {},
		promotions : {
			additional : [],
			order : {}
			},
		totals : {},
		address : {}
		}

	}

Cart.prototype = {
	get helpers() {
		var self = this;
		return {
			validators : {
				cart : function(){
					return {
						json : true,
						default : _s_util.clone.deep(self.default_cart),
						data : {
							orders : {v:['isJSON'] , default : {}},
							promotions : {
								json : true,
								default : {
									additional : [],
									order : {}
									},
								data : {
									additional : {v:['isArray'] , b:true, default : []},
									order : {v:['isJSON'] , b:true, default : {}}
									}
								},
							totals : {
								v:['isJSON'],
								b:true,
								default : {}
								},
							address : _s_common.helpers.validators.address()
							}
						}
					}
				},
			validate : function*(obj){
				var item = yield _s_load.library('products').get(obj.product);
				// var _o_product = yield _s_load.object('products' , obj.product);
				if(!item) return { failure : { msg : 'This item is not a valid item and listing.' , code : 300 } };


				var listing = _s_util.array.find.object(item.sellers, 'id', obj.listing);
				if(item.setup.active == 1 && listing && listing.quantity > 0 && listing.setup.active == 1) {

					if(obj.quantity && listing.quantity < obj.quantity) return { failure : { msg : 'The seller does not have enough quantity.' , code :300 } }
					return {
						listing : listing,
						item : item,
						}

					}
				return { failure : { msg : 'This listing is not active or not available.' , code : 300 } };
				},
			seller : function*(obj){
				var orders = yield self.get.orders(obj);
				var seller = false;
				_s_u.each(orders, function(v,k){
					if(v.items[obj.product] && v.items[obj.product].listings[obj.listing]){
						seller = k;
						return false;
						}
					})
				return seller;
				},
			}
		},
	empty : function*(no_session){
		var r = _s_util.clone.deep(this.default_cart);

		if(no_session) return r;

		try {
			yield _s_cache.key.set('cart', r);
			return true
			}
		catch(err){
			return false
			}
		},
	calculate : function*(){
		var cart = yield this.get.all();
		var totals = {grand:0};
		var totals_cache = {grand:0};
		var error = false;
		var _taxes = _s_load.engine('taxes');

		if(Object.keys(cart.orders).length == 0) return { failure : { msg : 'There are no orders in the cart to be processed.' , code :300 } }
		
		yield _s_util.each(cart.orders, function*(order_details, order_seller){
			// for each of the orders we send back item totals, item subtotals, shipping calculations, and then the grand total

			// if shipping total hasn't been set, we return errors;
			if(!order_details.shipping || !order_details.shipping.total){ error = 'Order for ' + order_details.name + ' does not have shipping calculated yet.'; return false; }

			!totals[order_seller] ? totals[order_seller] = {  items : {} , totals : { items : { data : 0, converted : 0 }, shipping : {data:order_details.shipping.total, converted : _s_currency.convert.front(order_details.shipping.total)} } } : null;
			!totals_cache[order_seller] ? totals_cache[order_seller] = {  items : {} , totals : { items : 0, shipping : order_details.shipping.total } } : null;

			totals.grand += order_details.shipping.total;
			totals_cache.grand += order_details.shipping.total;

			yield _s_util.each(order_details.items, function*(product_details, product_id){

				if(!totals[order_seller].items[product_id]) {
					totals[order_seller].items[product_id] = {};
					totals_cache[order_seller].items[product_id] = {};
					}

				var item = yield _s_load.library('products').get({id:product_id,include:'sellers'});
				if(!item){ error =  'Product ' + product_id + 'does not exist.' ; return false ; }

				yield _s_util.each(product_details.listings, function*(listing_details, listing_id){


					var r = _s_util.array.find.object(item.sellers, 'id', listing_id);
					if(!r){ error = 'Listing ' + listing_id + ' for ' + product_id + ' does not exist.'; return false; }

					var di = (_s_countries.active.get() == r.seller.country ?1:2);

					var item_price = r.pricing['sale'+di] ? r.pricing['sale'+di] : r.pricing['standard'+di];
					var item_subtotal = parseFloat(item_price * listing_details.quantity);
					
					totals[order_seller].totals.items.data += item_subtotal;
					totals_cache[order_seller].totals.items += item_subtotal;
					
					totals[order_seller].items[product_id][listing_id] = { 
						item : {
							data : item_price,
							converted : _s_currency.convert.front(item_price, false)
							},
						item_subtotal : {
							data : item_subtotal,
							converted : _s_currency.convert.front(item_subtotal, false)
							}
						}

					totals_cache[order_seller].items[product_id][listing_id] = { 
						item :  item_price,
						item_subtotal : item_subtotal
						}
					})
				})
		
			totals.grand += totals[order_seller].totals.items.data;
			totals_cache.grand += totals[order_seller].totals.items.data;
			totals[order_seller].totals.items.converted = _s_currency.convert.front(totals[order_seller].totals.items.data, false);
			})
		
		if(error) return { failure : { msg : error, code : 300 } };
		if(Object.keys(totals).length == 0) return false;

		totals_cache.grand = totals.grand;
		totals.grand = {
			data : totals.grand,
			converted : _s_currency.convert.front(totals.grand,false)
			}

		// we set the grand total here
		yield _s_cache.key.set('cart.totals' , totals_cache);

		// we don't let the user change the country so we hardcode it in cache
		yield _s_cache.key.set('cart.address' , {
			country : _s_countries.active.get(),
			postal : _s_countries.active.postal.get()
			})

		return totals;
		},	
	get totals() { 
		var self = this;
		return {
			total : function*(){
				return yield _s_cache.key.get('cart.totals.grand');
				}
			}
		},
	get get() { 
		var self = this;
		return {
			all : function*(obj){
				!obj?obj={}:null;
				try{
					if(obj.cart){
						var r = obj.cart;
						}
					else {
						var r = yield _s_cache.key.get('cart');
						if(!r){
							yield self.empty();
							return false;
							}
						}

					if(obj.details && obj.details == false) return r;
					// this means we want to send the entire cart info back with product listings and details and whatnot

					var _products = _s_load.library('products');
					var error = false;

					yield _s_util.each(r.orders, function*(dets, seller){
						yield _s_util.each(dets.items, function*(product_dets, product_id){
							var item = yield _products.get({id:product_id, include : 'line,name,sellers,combos,images,performance',convert:true});
							if(!item){ error = 'The product with the product id '+ product_id + ' was not found.'; return false; }

							yield _s_util.each(product_dets.listings, function*(listing_details, listing_id){
								var b = _s_util.array.find.object(item.sellers, 'id', listing_id);
								if(!b){ error = 'The product with the product id '+product_id+' could not find listing ' + listing_id + '.'; return false;  }
								//let's associate the combos here too
								var combo = item.combos[b.combo];
								if(!combo){ error = 'The product with the product id '+product_id+' could not find a combination for listing ' + listing_id + '.'; return false;  }

								b.combo = combo;
								r.orders[seller].items[product_id].listings[listing_id].listing = b;
								})

							delete item.sellers;
							delete item.combos;
							r.orders[seller].items[product_id].item = item;

							})
						})

					if(error) return { failure : { msg : error, code : 300 } };
					return r;
					}
				catch(err){

					}
				},
			count : function*(obj){
				
				var orders = yield self.get.orders(obj);
				var total = 0;

				if(Object.keys(orders).length > 0){
					_s_u.each(orders, function(dets, seller){
						_s_u.each(dets.items , function(item_dets, item_id){
							total += Object.keys(item_dets.listings).length;	
							})
						})
					}

				if(total == 0) return false;
				else return total;
				},
			orders: function*(obj){
				if(obj && obj.cart) return obj.cart.orders;
				return yield _s_cache.key.get('cart.orders');
				},
			order: function*(obj){
				var orders = yield self.get.orders(obj);
				if(orders[obj.seller]) return orders[obj.seller]
				return false;
				},
			promotions : function*(){
				return yield _s_cache.key.get('cart.promotions');
				},
			shipping : {
				options : function*(seller){
					return yield _s_cache.key.get('cart.orders.' + seller + '.shipping.options');
					}
				}
			}
		},
	get offer(){
		var self =this;
		return {
			affiliate : {
				get : function(seller , truthy){
					if(seller) return _s_session.get('cart.offers.affiliate.' + seller , truthy);
					return _s_session.set('cart.offers.affiliate' , truthy)
					},
				set : function(obj){
					_s_session.set('cart.offers.affiliate.'+obj.seller, { offer : obj.offer , counter : obj.counter } );
					},
				delete : function(seller){
					_s_session.delete('cart.offers.affiliate.'+seller);
					if(Object.keys(_s_session.get('cart.offers.affiliate')).length == 0) _s_session.delete('cart.offers.affiliate');
					}
				},
			customer : {
				get : function(seller, truthy){
					if(seller) return _s_session.get('cart.offers.customer.' + seller , truthy);
					return _s_session.set('cart.offers.customer' , truthy);
					},
				set : function(obj){
					_s_session.set('cart.offers.customer.'+obj.seller, { offer : obj.offer , code: obj.code } );
					},
				delete : function(seller){
					_s_session.delete('cart.offers.customer.'+seller);
					if(Object.keys(_s_session.get('cart.offers.customer')).length == 0) _s_session.delete('cart.offers.customer');
					}
				}
			}
		},
	get items() {
		var self = this;
		return {
			add : function*(obj){
				try { 
		            var v = yield self.helpers.validate(obj);
		            if(v.failure) return v;

	            	if(v.listing.fulfillment == 2 && v.listing.seller.country == _s_countries.active.get()){
	        			var id = 'sellyx-1';
	        			var name = 'Sellyx Domestic';
	        			}
	        		else if((v.listing.fulfillment == 2 || v.listing.sellyxship == 2) && v.listing.seller.country != _s_countries.active.get()){
	        			var id = 'sellyx-2';
	        			var name = 'Sellyx International';
	        			}
	        		else{
	        			if((v.listing.seller.country == _s_countries.active.get() && v.listing.reach == 2) || (v.listing.seller.country != _s_countries.active.get() && v.listing.reach == 1)) return { failure : { msg : 'You are not allowed to order this product from your current country.' , code : 300 } };

	        			var id = v.listing.seller.id;
	        			var name = v.listing.seller.name;
	        			}

	        		if(obj.quantity == 0) return yield self.items.delete(obj);

	        		var r = {
	        			quantity : (obj.quantity?obj.quantity:1),
	    				category : v.item.line.category,
	        			country : _s_countries.active.get()
	        			};

	        		if(obj.negotiated) {
	        			r.negotiated = true;
	        			r.price = obj.price;
	        			}

	        		// sessionless stuff here
	        		if(obj.cart){
	        			if(!obj.cart.orders[id]){
	        				if(id == 'sellyx-1'||id=='sellyx-2'){
	        					obj.cart.orders[id].name = name
	        					}
	        				else{
	        					var _s_o_seller = yield _s_load.object('sellers', v.listing.seller.id);
	        					if(_s_o_seller.failure) return { failure : { msg : 'The seller does not exist.' , code :300 } };
	        					}

	        				obj.cart.orders[id] = {
	        					id : v.listing.seller.id,
	        					name : v.listing.seller.name,
	        					items : {},
	        					address : _s_o_seller.profile.addresses.primary()
	        					}
	        				}

	        			!obj.cart.orders[id].items[obj.product] ? obj.cart.orders[id].items[obj.product] = { listings : {} } : null;
	        			obj.cart.orders[id].items[obj.product].listings[obj.listing] = r;
	        			delete obj.cart.orders[id].shipping;

	        			return obj.cart;
	        			}

	        		var c = yield _s_cache.key.get('cart.orders.' + id + '.items' , true);
	        		if(!c){
	        			if(id == 'sellyx-1' || id == 'sellyx-2'){
	        			 	yield _s_cache.key.set('cart.orders.' + id + '.name' , name);
	        				}
	        			else{
	        				// get seller address
	        				var _s_o_seller = yield _s_load.object('sellers', v.listing.seller.id);
	        				if(_s_o_seller.failure) return { failure : { msg : 'The seller does not exist.' , code :300 } };

	        				yield _s_cache.key.set('cart.orders.' + id , {
	        					id : v.listing.seller.id,
	        					name : v.listing.seller.name,
	        					items : {},
	        					address : _s_o_seller.profile.addresses.primary(),
	        					});
	        				}
	        			}

	        		yield _s_cache.key.set('cart.orders.' + id + '.items.' + obj.product + '.listings.' + obj.listing , r);
        			
	        		// if we had calculated shipping totals for this seller previously, we now need to delete those for recalculation purposes
	    			yield _s_cache.key.delete('cart.orders.' + id + '.shipping');
	    			return true;
					}
	    		catch(err){
	    			console.log(err);
	    			return false;
	    			}

				},
			delete : function*(obj){
				try{
					var seller = yield self.helpers.seller(obj);
					if(!seller) return false;

					if(obj.cart){
						if(Object.keys(obj.cart.items).length == 1){
							delete obj.cart.orders[seller];
							}
						else if(Object.keys(obj.cart.items[obj.product].listings).length == 1){
							delete obj.cart.orders[seller].items[obj.product];
							}
						else{
							delete obj.cart.orders[seller].items[obj.product].listings[obj.listing];
							}

						return obj.cart;
						}


					var get = yield _s_cache.key.get('cart.orders.' + seller);
					if(!get) return false;

					if(Object.keys(get.items).length == 1){
						yield _s_cache.key.delete('cart.orders.'+seller);
						}
					else if(Object.keys(get.items[obj.product].listings).length == 1){
						yield _s_cache.key.delete('cart.orders.'+seller+'.items.'+obj.product);
						}
					else{
		        		yield _s_cache.key.delete('cart.orders.' + seller + '.items.' + obj.product + '.listings.' +obj.listing)
						}

	        		return true;
	        		}
	        	catch(err){
	        		console.log(err);
	        		return false;
	        		}

				},
			update : {
				quantity : function*(obj){
					try{
		            	var validate = yield self.helpers.validate(obj);
		            	if(validate.failure) return validate;

		            	var seller = yield self.helpers.seller(obj);
						if(!seller) return false;

						if(obj.cart){
							if(obj.cart.orders[seller].items[obj.product].listings[obj.listing].negotiated)
								return { failure : { msg : 'You cannot update the quantity of a negotiated item.' , code : 300 } }
							if(obj.quantity && obj.quantity >= 1){
								obj.cart.orders[seller].items[obj.product].listings[obj.listing].quantity = obj.quantity;
								delete obj.cart.orders[seller].shipping
								return obj.cart;
								}
							else{
								return yield self.items.delete(obj);
								}
							}

	            		// check to see its not negotiated
	            		var get = yield _s_cache.key.get('cart.orders.' + seller + '.items.' + obj.product + '.listings.' +obj.listing + '.negotiated');
	            		if(get) return { failure : {msg: 'You cannot update the quantity of a negotiated item.' , code :300 } };

	            		if(obj.quantity && obj.quantity >= 1){
	            			yield _s_cache.key.set('cart.orders.' + seller + '.items.' + obj.product + '.listings.' +obj.listing + '.quantity' , obj.quantity);

	            			// if shipping had been calculated, we need to recalculate, so unset the shipping for this item
	            			yield _s_cache.key.delete('cart.orders.' + seller + '.shipping');
	            			return true;
	            			}
	            		else{
	            			return yield self.items.delete(obj);
	            			}
	            		}
	            	catch(err){return false; }
					},
				notes : function*(obj){
					try{
		            	var validate = yield self.helpers.validate(obj);
		            	if(validate.failure) return validate;        

		            	var seller = yield self.helpers.seller(obj);
						if(!seller) return false;

						if(obj.cart){
							if(!obj.notes) delete obj.cart.orders[seller].items[obj.product].listings[obj.listing].notes
							else obj.cart.orders[seller].items[obj.product].listings[obj.listing].notes = obj.notes
							return obj.cart;
							}

						if(!obj.notes) yield _s_cache.key.delete('cart.orders.' + seller + '.items.' + obj.product + '.listings.' +obj.listing + '.notes');
						else yield _s_cache.key.set('cart.orders.' + seller + '.items.' + obj.product + '.listings.' +obj.listing + '.notes', obj.notes);

	            		return true;
	            		}
	            	catch(err){return false }
					},
				waive : function*(obj){
					try {
		            	var validate = yield self.helpers.validate(obj);
		            	if(validate.failure) return validate;

		            	var seller = yield self.helpers.seller(obj);
						if(!seller) return false;

	            		if(validate.listing.no_returns && validate.listing.no_returns == 2) return { failure : { msg : 'This seller does not allow returns or return pricing on this item.' , code : 300 } };
						
						if(obj.cart){
							if(obj.cart.orders[seller].items[obj.product].listings[obj.listing].negotiated) return { failure : {msg: 'You cannot waive or change the price of a negotiated item.' } , code : 300 } ;
							if(obj.waive){
								var results = yield _s_load.engine('sellers').get({convert: false, id:validate.listing.seller.id, include : 'policy'});
			            		if(!results) return { failure : {msg : 'The seller was not found!' , code : 300 } };

			            		
			            		if(results.policy && results.policy[(_s_countries.active.get() == validate.listing.seller.country)?1:2].allowed == 2){
			            			obj.cart.orders[seller].items[obj.product].listings[obj.listing].waived = true;
			            			delete obj.cart.orders[seller].shipping;
			            			}
			            		else{
			            			return { failure : {msg : 'The seller has since changed their policy to not allow returns. We apologize for this inconvenience.' , refresh : true , code : 300 } } ;
			            			}
								}
							else{
								delete obj.cart.orders[seller].items[obj.product].listings[obj.listing].waived;
								delete obj.cart.orders[seller].shipping;
								}

							return obj.cart;
							}
		            	
	            		var get = yield _s_cache.key.get('cart.orders.' + seller + '.items.' + obj.product + '.listings.' +obj.listing);
	            		if(!get) return { failure : {msg : 'That is not a valid cart item.' , code : 300}};
	            		
	            		// check to see its not negotiated
	            		if(get.negotiated) return { failure : {msg: 'You cannot waive or change the price of a negotiated item.' } , code : 300 } ;
	            		if(obj.waive){
		            		// get return policy of seller
		            		var results = yield _s_load.engine('sellers').get({convert: false, id:validate.listing.seller.id, include : 'policy'});
		            		if(!results) return { failure : {msg : 'The seller was not found!' , code : 300 } };

		            		
		            		if(results.policy && results.policy[(_s_countries.active.get() == validate.listing.seller.country)?1:2].allowed == 2){
		            			yield _s_cache.key.set('cart.orders.' + seller + '.items.' + obj.product + '.listings.' +obj.listing + '.waived' , true);
		            			yield _s_cache.key.delete('cart.orders.' + seller + '.shipping');
		            			return true;
		            			}
		            		else{
		            			return { failure : {msg : 'The seller has since changed their policy to not allow returns. We apologize for this inconvenience.' , refresh : true , code : 300 } } ;
		            			}
		            		}
		            	else{
		            		yield _s_cache.key.delete('cart.orders.' + seller + '.items.' + obj.product + '.listings.' +obj.listing + '.waived');
		            		yield _s_cache.key.delete('cart.orders.' + seller + '.shipping');
		            		return true;
		            		}
		            	}
		            catch(err){
		            	console.log(err);
		            	return false;
		            	}
					},
				
				shipping : {
					options : function*(obj){
	        			yield _s_cache.key.set('cart.orders.' + obj.seller + '.shipping' , {options:obj.options});
						},
					save : function*(obj){
						var options = yield _s_cache.key.get('cart.orders.' + obj.seller + '.shipping.options');
						if(!options) return false;
						
						switch(obj.seller){
							case 'sellyx-1':
								var total = 1;
								break;
							case 'sellyx-2':
								var total = 0;
								_s_u.each(['l1','l2c','l2d','l3'], function(i,ind){
									if(options[i]){
										switch(i){
											case 'l1':
												_s_u.each(options[i], function(serv,sel){
													if(serv.grouped) total++;
													if(serv.custom){
														total += Object.keys(serv.custom).length;
														}
													})
												break;
											case 'l2d':
											case 'l2c':
												total += Object.keys(options[i]).length;				
												break;
											case 'l3':
												total++;
												break;
											}
										}
									})

								break;
							default:
								var total = Object.keys(options).length;
								break;
							}
							
						var count = 0;
						var go = {};
						var subtotal = 0;

						yield _s_util.each(obj.selected, function*(selection, id){
							
							if(id == 'custom'){
								var b = Object.keys(selection);
								id = 'custom.' + b[0];
								selection = selection[b[0]];
								}
							
							var check = yield _s_cache.key.get('cart.orders.' + obj.seller + '.shipping.options.' + id  );
							console.log(check);
							check = (check.rates ? check.rates[selection] : check[selection]);
							if(check) {
								go[id] = check;
								subtotal += parseFloat(go[id].rate);
								count++;
								}
							
							})


						if(count != total) return false;

						yield _s_cache.key.set('cart.orders.' + obj.seller + '.shipping.selected' , go);
						yield _s_cache.key.set('cart.orders.' + obj.seller + '.shipping.total' , subtotal);
						return true;
						}
					}
				}
			}
		},
	separate : function*(obj){

		var cart = _s_util.clone.deep(yield this.get.all());

		if(!cart.totals || !cart.totals.grand){
			var t = yield this.calculate(cart);
			console.log(t);
			if(t.failure) return t;
			cart = _s_util.clone.deep(yield this.get.all());
			}
		
		var _products = _s_load.library('products');

		// let's process the order and separate everything, figure out who is stripe and who is paypal and who is neither here

		var country = _s_countries.active.get();

		obj.address.country = cart.address.country
		obj.address.postal = cart.address.postal

		var fulfillment = _s_countries.fulfillment.fulfilled(country);
		var separated = {};
		var grouped = {};
		var sellers = {};
		var used_affiliate_offers = {};
		var used_customer_offers = {};
		var quantity_updates = {};
		var error = false;

		yield _s_util.each(cart.orders, function*(dets,s1){
			yield _s_util.each(dets.items, function*(item_dets, item_id){
				yield _s_util.each(item_dets.listings, function*(l_dets, l_Id){

					var seller_id = l_dets.listing.seller.id;
					var selected_shipping = dets.shipping.selected_shipping;
					var seller_country = l_dets.details.seller.country.data;

					l_dets.details.seller.country = l_dets.details.seller.country.id;

					if(!separated[seller_id]){
						
						// load the seller information
						var _s_o_seller = yield _s_load.object('seller' , seller_id);
						if(_s_o_seller.failure){ error = { msg : 'The seller with the id '+seller_id + ' does not exist.' , code : 300 }; return; }


						sellers[seller_id] = _s_o_seller;
						grouped[seller_id] = {};
						separated[seller_id] = {
							items : [],
							gift : (obj.gift||false),
							type : 2,
							address : obj.address,
							user : _s_user.helpers.data.document(),
							seller : _s_o_seller.helpers.data.document(),
							offers : {},
							totals : {
								seller : 0,
								customer : 0,
								sellyx : 0
								},
							setup : {
								active : 1,
								status : 1,
								added : _s_dt.now.datetime()
								},
							transactions : {
								history : [],
								setup : {
									active : 1,
									status : 2,
									}
								}
							}


						if(cart.promotions.order[seller_id]){
							separated[seller_id].promotions = cart.promotions.order[seller_id];

							//subtract order promotion totals from the seller and customer totals from the beginning
							_s_u.each(cart.promotions.order[seller_id], function(disc, prom){
								separated[seller_id].totals.seller -= parseFloat(disc);
								separated[seller_id].totals.customer -= parseFloat(disc);
								})
							}
						if(cart.offers){
							if(cart.offers.affiliate&&cart.offers.affiliate[seller_id] && cart.offers.affiliate[seller_id].total){
								separated[seller_id].offers.affiliate = {
									id : cart.offers.affiliate[seller_id].offer.id,
									total : cart.offers.affiliate[seller_id].total
									}
								
								used_affiliate_offers[cart.offers.affiliate[seller_id].offer.id] = cart.offers.affiliate[seller_id].counter;
								separated[seller_id].totals.seller -= parseFloat(cart.offers.affiliate[seller_id].total);
								separated[seller_id].totals.customer -= parseFloat(cart.offers.affiliate[seller_id].total);									
								}
							if(cart.offers.customer&&cart.offers.customer[seller_id] && cart.offers.customer[seller_id].total){
								separated[seller_id].offers.customer = {
									id : cart.offers.customer[seller_id].offer.id,
									total : cart.offers.customer[seller_id].total
									}
								
								used_customer_offers[cart.offers.customer[seller_id].offer.id] = cart.offers.customer[seller_id].code;
								separated[seller_id].totals.seller -= parseFloat(cart.offers.customer[seller_id].total);
								separated[seller_id].totals.customer -= parseFloat(cart.offers.customer[seller_id].total);									
								}
							}
						}

					var item = {
						item : {
							id : item_id,
							name : _products.helpers.name({ data : item_dets.item , listing : l_Id , break: true })
							},
						listing : l_Id,
						process_time : l_dets.details.process_time.id,
						quantity : l_dets.quantity,
						totals : l_dets.totals,
						promotions : l_dets.promotions,
						gifts : l_dets.gifts
						};


					!quantity_updates[item_id]?quantity_updates[item_id]={}:null;
					quantity_updates[item_id][l_Id] = l_dets.quantity;

					l_dets.notes ? item.notes = l_dets.notes : null;
					l_dets.waived ? item.waived = true : null;
					l_dets.details.no_returns == 2 ? item.no_returns = true : null;

					// add item subtotal to the order totals
					separated[seller_id].totals.seller += parseFloat(l_dets.totals.subtotal);
					separated[seller_id].totals.customer += parseFloat(l_dets.totals.subtotal);

					// based on the shipping and the s1, we figure out what the shipping costs are
					item.shipping = {
						responsibility : s1
						}

					var g = false;

					switch(s1){
						case 'sellyx-1':
							var t = selected_shipping.grouped;
							item.shipping.service = selected_shipping.grouped;
							g = 'sellyx';
							item.status = 1
							break;
						case 'sellyx-2':
							// we are going to be saving this shipping as SERVICES

							!grouped[seller_id][s1] ? grouped[seller_id][s1] = {} : null;

							if(fulfillment){
								item.status = 12;
								var t = selected_shipping['l2c.' + l_dets.details.country.id];
								item.shipping.services = {
									l2 : {
										service : t,
										},
									l3 : {
										service : selected_shipping.l3,
										}
									}
								if(!grouped[seller_id][s1].l2){
									grouped[seller_id][s1].l2 = true;
									separated[seller_id].totals.sellyx += parseFloat(t.rate + selected_shipping.l3.rate);
									separated[seller_id].totals.customer += parseFloat(t.rate + selected_shipping.l3.rate);
									}
								}
							else{
								item.status = 13;
								var t = selected_shipping['l2d.' + l_dets.details.country.id]
								item.shipping.services = {
									l2 : {
										service : t
										}
									}
								if(!grouped[seller_id][s1].l2){
									grouped[seller_id][s1].l2 = true;
									separated[seller_id].totals.sellyx += parseFloat(t.rate);
									separated[seller_id].totals.customer += parseFloat(t.rate);
									}							
								}

							if(selected_shipping['l1.' + seller_id + '.custom.' + l_Id]){
								var t = selected_shipping['l1.' + seller_id + '.custom.' + l_Id];
								item.shipping.services.l1 = {
									service : t,
									type : 'custom',
									}

								item.status = 2;

								// add shipping cost to money for seller
								separated[seller_id].totals.seller += parseFloat(t.rate);
								separated[seller_id].totals.customer += parseFloat(t.rate);
								}
							else if(selected_shipping['l1.' + seller_id + '.grouped']){
								var t = selected_shipping['l1.' + seller_id + '.grouped'];
								item.shipping.services.l1 = {
									service : t
									}

								item.status = 3;

								if(!grouped[seller_id][s1].l1){
									grouped[seller_id][s1].l1 = true;
									separated[seller_id].totals.sellyx += parseFloat(t.rate);
									separated[seller_id].totals.customer += parseFloat(t.rate);
									}
								}
							break;
						default:
							// we check to see if the seller has waived their policy
							var di = (country == active ? 1 : 2);
							if(sellers[seller_id].policy[di].allowed == 2 && (di == 1 || (di == 2 && (!sellers[seller_id].policy[di].restricted || _s_util.indexOf(sellers[seller_id].policy[di].restricted , active) == -1 )))) separated[seller_id].policy = sellers[seller_id].policy[di];

							if(selected_shipping['custom.' + l_Id]) {
								item.status = 4;

								var t = selected_shipping['custom.' + l_Id];
								item.shipping.type = 'custom';
								separated[seller_id].totals.seller += parseFloat(t.rate);
								separated[seller_id].totals.customer += parseFloat(t.rate);
								}
							else {
								item.status = 5;

								var t = selected_shipping.grouped;
								g = 'seller';
								}
							item.shipping.service = t;
							break;
						}

					if(g){
						// add the shipping cost to money for Sellyx
						if(!grouped[seller_id][s1]){
							grouped[seller_id][s1] = true;
							separated[seller_id].totals[g] += parseFloat(t.rate);
							separated[seller_id].totals.customer += parseFloat(t.rate);
							}
						}

					separated[seller_id].items.push(item);
					})
				if(error) return false;
				})
			if(error) return false;
			})

		if(error) return { failure : true };
		return {orders : separated , affiliate_offers : used_affiliate_offers , customer_offers : used_customer_offers , quantities : quantity_updates};
		}
	}

module.exports = function(){if(!(this instanceof Cart)) { return new Cart(); } }

