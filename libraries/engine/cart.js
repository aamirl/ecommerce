
function Cart(){
	if(!_s_cache.key.get('cart', true)) this.empty()
	}

Cart.prototype = {
	empty : function*(){
		try {
			yield _s_cache.key.set('cart',
				{
					orders : {},
					promotions : {
						additional : [],
						order : {}
						},
					totals : {}
					}
				);
			return true;
			}
		catch(err){
			return false;
			}
		},
	calculate : function*(cart){
		if(!cart) return false;
		var totals = {};
		var error = false;
		var _taxes = _s_load.engine('taxes');
		
		yield _s_util.each(cart.orders, function*(order_details, order_seller){
			// for each of the orders we send back item totals, item subtotals, shipping calculations, and then the grand total

			// if shipping total hasn't been set, we return errors;
			if(!order_details.shipping || !order_details.shipping.total){ error = 'Order for ' + order_details.name + ' does not have shipping calculated yet.'; return false; }

			!totals[order_seller] ? totals[order_seller] = {  items : {} , totals : { items : { data : 0, converted : 0 }, shipping : {data:order_details.shipping.total, converted : _s_currency.convert.front(order_details.shipping.total)} } } : null;

			yield _s_util.each(order_details.items, function*(product_details, product_id){

				!totals[order_seller].items[product_id] ? totals[order_seller].items[product_id] = {} : null;

				var item = yield _s_load.library('products').get({id:product_id,include:'sellers'});
				if(!item){ error =  'Product ' + product_id + 'does not exist.' ; return false ; }

				yield _s_util.each(product_details.listings, function*(listing_details, listing_id){


					var r = _s_util.array.find.object(item.sellers, 'id', listing_id);
					if(!r){ error = 'Listing ' + listing_id + ' for ' + product_id + ' does not exist.'; return false; }

					var di = (_s_countries.active.get() == r.seller.country ?1:2);

					var item_price = r.pricing['sale'+di] ? r.pricing['sale'+di] : r.pricing['standard'+di];
					var item_subtotal = parseFloat(item_price * listing_details.quantity);
					
					totals[order_seller].totals.items.data += item_subtotal;
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
					})
				})
		
			totals[order_seller].totals.items.converted = _s_currency.convert.front(totals[order_seller].totals.items.data, false);

			})
		
		if(error) return { failure : { msg : error, code : 300 } };
		if(Object.keys(totals).length == 0) return false;
		return totals;
		},
	get helpers() {
		var self = this;
		return {
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
				var orders = yield self.get.orders();
				var seller = false;
				_s_u.each(orders, function(v,k){
					if(v.items[obj.product] && v.items[obj.product].listings[obj.listing]){
						seller = k;
						return false;
						}
					})
				return seller;
				},
			separate : function*(inp){
				var cart = (inp.cart?inp.cart:_s_util.clone.deep(self.get.all()))
				if(!cart.totals.grand) return { failure : 'The cart is invalid.' };
				
				var _products = _s_load.library('products');

				// let's process the order and separate everything, figure out who is stripe and who is paypal and who is neither here
				var gift = inp.gift;
				var active = _countries.active.get();

				inp.address.country = active;
				inp.address.postal = _countries.active.postal.get();

				var fulfillment = _countries.fulfillment.fulfilled(active);
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

							var sId = l_dets.details.seller.id;
							var selected = dets.shipping.selected;
							var country = l_dets.details.seller.country.id;

							l_dets.details.seller.country = l_dets.details.seller.country.id;

							if(!separated[sId]){
								//load the seller information
								var s = yield _s_seller.model.get.seller({id:sId,active:1})
								if(!s || !s.financials.profile){ error = true; return }

								sellers[sId] = s;
								grouped[sId] = {};
								separated[sId] = {
									id : 'SO'+Math.floor(Math.random() * 1000000000)+'-'+_s_user.profile.id(),
									seller : l_dets.details.seller,
									user : _s_user.helpers.data.document(),
									offers : {},
									items : [],
									address : inp.address,
									gift : gift,
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

								if(cart.promotions.order[sId]){
									separated[sId].promotions = cart.promotions.order[sId];

									//subtract order promotion totals from the seller and customer totals from the beginning
									_s_u.each(cart.promotions.order[sId], function(disc, prom){
										separated[sId].totals.seller -= parseFloat(disc);
										separated[sId].totals.customer -= parseFloat(disc);
										})
									}
								if(cart.offers){
									if(cart.offers.affiliate&&cart.offers.affiliate[sId] && cart.offers.affiliate[sId].total){
										separated[sId].offers.affiliate = {
											id : cart.offers.affiliate[sId].offer.id,
											total : cart.offers.affiliate[sId].total
											}
										
										used_affiliate_offers[cart.offers.affiliate[sId].offer.id] = cart.offers.affiliate[sId].counter;
										separated[sId].totals.seller -= parseFloat(cart.offers.affiliate[sId].total);
										separated[sId].totals.customer -= parseFloat(cart.offers.affiliate[sId].total);									
										}
									if(cart.offers.customer&&cart.offers.customer[sId] && cart.offers.customer[sId].total){
										separated[sId].offers.customer = {
											id : cart.offers.customer[sId].offer.id,
											total : cart.offers.customer[sId].total
											}
										
										used_customer_offers[cart.offers.customer[sId].offer.id] = cart.offers.customer[sId].code;
										separated[sId].totals.seller -= parseFloat(cart.offers.customer[sId].total);
										separated[sId].totals.customer -= parseFloat(cart.offers.customer[sId].total);									
										}
									}
								}

							var obj = {
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

							l_dets.notes ? obj.notes = l_dets.notes : null;
							l_dets.waived ? obj.waived = true : null;
							l_dets.details.no_returns == 2 ? obj.no_returns = true : null;

							// add item subtotal to the order totals
							separated[sId].totals.seller += parseFloat(l_dets.totals.subtotal);
							separated[sId].totals.customer += parseFloat(l_dets.totals.subtotal);

							// based on the shipping and the s1, we figure out what the shipping costs are
							obj.shipping = {
								responsibility : s1
								}

							var g = false;

							switch(s1){
								case 'sellyx-1':
									var t = selected.grouped;
									obj.shipping.service = selected.grouped;
									g = 'sellyx';
									obj.status = 1
									break;
								case 'sellyx-2':
									// we are going to be saving this shipping as SERVICES

									!grouped[sId][s1] ? grouped[sId][s1] = {} : null;

									if(fulfillment){
										obj.status = 12;
										var t = selected['l2c.' + l_dets.details.country.id];
										obj.shipping.services = {
											l2 : {
												service : t,
												},
											l3 : {
												service : selected.l3,
												}
											}
										if(!grouped[sId][s1].l2){
											grouped[sId][s1].l2 = true;
											separated[sId].totals.sellyx += parseFloat(t.rate + selected.l3.rate);
											separated[sId].totals.customer += parseFloat(t.rate + selected.l3.rate);
											}
										}
									else{
										obj.status = 13;
										var t = selected['l2d.' + l_dets.details.country.id]
										obj.shipping.services = {
											l2 : {
												service : t
												}
											}
										if(!grouped[sId][s1].l2){
											grouped[sId][s1].l2 = true;
											separated[sId].totals.sellyx += parseFloat(t.rate);
											separated[sId].totals.customer += parseFloat(t.rate);
											}							
										}

									if(selected['l1.' + sId + '.custom.' + l_Id]){
										var t = selected['l1.' + sId + '.custom.' + l_Id];
										obj.shipping.services.l1 = {
											service : t,
											type : 'custom',
											}

										obj.status = 2;

										// add shipping cost to money for seller
										separated[sId].totals.seller += parseFloat(t.rate);
										separated[sId].totals.customer += parseFloat(t.rate);
										}
									else if(selected['l1.' + sId + '.grouped']){
										var t = selected['l1.' + sId + '.grouped'];
										obj.shipping.services.l1 = {
											service : t
											}

										obj.status = 3;

										if(!grouped[sId][s1].l1){
											grouped[sId][s1].l1 = true;
											separated[sId].totals.sellyx += parseFloat(t.rate);
											separated[sId].totals.customer += parseFloat(t.rate);
											}
										}
									break;
								default:
									// we check to see if the seller has waived their policy
									var di = (country == active ? 1 : 2);
									if(sellers[sId].policy[di].allowed == 2 && (di == 1 || (di == 2 && (!sellers[sId].policy[di].restricted || _s_util.indexOf(sellers[sId].policy[di].restricted , active) == -1 )))) separated[sId].policy = sellers[sId].policy[di];

									if(selected['custom.' + l_Id]) {
										obj.status = 4;

										var t = selected['custom.' + l_Id];
										obj.shipping.type = 'custom';
										separated[sId].totals.seller += parseFloat(t.rate);
										separated[sId].totals.customer += parseFloat(t.rate);
										}
									else {
										obj.status = 5;

										var t = selected.grouped;
										g = 'seller';
										}
									obj.shipping.service = t;
									break;
								}

							if(g){
								// add the shipping cost to money for Sellyx
								if(!grouped[sId][s1]){
									grouped[sId][s1] = true;
									separated[sId].totals[g] += parseFloat(t.rate);
									separated[sId].totals.customer += parseFloat(t.rate);
									}
								}

							separated[sId].items.push(obj);
							})
						if(error) return false;
						})
					if(error) return false;
					})
		
				if(error) return { failure : true };
				return {orders : separated , affiliate_offers : used_affiliate_offers , customer_offers : used_customer_offers , quantities : quantity_updates};
				}
			}
		},
	get paypal() {
		var self = this;
		return {
			set : function(inp){
				_s_session.set('cart.paypal',inp);
				},
			get : function(){
				if(_s_session.get('cart.paypal',true)) return _s_session.get('cart.paypal');
				return false;
				},
			delete : function(){
				_s_session.delete('cart.paypal');
				}
			}
		},
	get totals() { 
		var self = this;
		return {
			total : function*(){
				return yield _s_cache.key.get('cart.totals.grand',true);
				}
			}
		},
	get get() { 
		var self = this;
		return {
			all : function*(info){
				var r = yield _s_cache.key.get('cart');
				if(!info) return r;
				// we want to send the entire cart info back with product listings and details and whatnot

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
				},
			count : function*(){
				var orders = yield self.get.orders();
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
			orders: function*(){
				return yield _s_cache.key.get('cart.orders');
				},
			order: function*(sellerid){
				var orders = yield self.get.orders();
				if(orders[sellerid]) return orders[sellerid]
				else return false;
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
	            	var validate = yield self.helpers.validate(obj);
	            	if(validate.failure) return validate;

	            	var seller = yield self.helpers.seller(obj);
					if(!seller) return false;

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
					},
				waive : function*(obj){
	            	var validate = yield self.helpers.validate(obj);
	            	if(validate.failure) return validate;

	            	var seller = yield self.helpers.seller(obj);
					if(!seller) return false;
	            	
            		var get = yield _s_cache.key.get('cart.orders.' + seller + '.items.' + obj.product + '.listings.' +obj.listing);
            		if(!get) return { failure : {msg : 'That is not a valid cart item.' , code : 300}};
            		
            		// check to see its not negotiated
            		if(get.negotiated) return { failure : {msg: 'You cannot waive or change the price of a negotiated item.' } , code : 300 } ;
            		if(validate.listing.no_returns && validate.listing.no_returns == 2) return { failure : { msg : 'This seller does not allow returns or return pricing on this item.' , code : 300 } };

            		if(obj.type == 2){
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
					},
				notes : function*(obj){
	            	var validate = yield self.helpers.validate(obj);
	            	if(validate.failure) return validate;        

	            	var seller = yield self.helpers.seller(obj);
					if(!seller) return false;

					if(!obj.notes){
						yield _s_cache.key.delete('cart.orders.' + seller + '.items.' + obj.product + '.listings.' +obj.listing + '.notes');
						}
					else{
						yield _s_cache.key.set('cart.orders.' + seller + '.items.' + obj.product + '.listings.' +obj.listing + '.notes', obj.notes);

						}
            		return true;
					},
				shipping : {

					options : function*(obj){

	        			yield _s_cache.key.set('cart.orders.' + obj.seller + '.shipping' , {options:obj.options});
						},
					// retrieve : function*(obj){
					// 	return yield _s_cache.key.get('cart.orders.' + obj.seller + )
					// 	},
					save : function*(obj){
						var options = yield _s_cache.key.get('cart.orders.' + obj.seller + '.shipping.options');
						console.log(options);
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

						yield _s_util.each(obj.send, function*(selection, id){
							
							if(id == 'custom'){
								var b = Object.keys(selection);
								id = 'custom.' + b[0];
								selection = selection[b[0]];
								}
							
							var check = yield _s_cache.key.get('cart.orders.' + obj.seller + '.shipping.options.' + id  );
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
		}
	}

module.exports = function(){if(!(this instanceof Cart)) { return new Cart(); } }

