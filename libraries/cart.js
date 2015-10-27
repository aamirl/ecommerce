
function Cart(){!_s_session.get('cart', true) ? this.empty() : null; }

Cart.prototype = {
	empty : function(){
		_s_session.set('cart', {
			orders : {},
			promotions : {
				additional : [],
				order : {}
				},
			totals : {}
			});
		},
	get helpers() {
		var self = this;
		return {
			validate : function*(obj){

				var _o_product = yield _s_load.object('products' , obj.product);
				if(_o_product.failure) return { failure : { msg : 'This item is not a valid item and listing.' , code : 300 } };


				var listing = _s_util.array.find.object(item.sellers, 'id', obj.listing);
				if(item.setup.active == 1 && listing && listing.quantity > 0 && listing.setup.active == 1) {
					
					// now we can add this to the cart under the proper context
	        		if(listing.fulfillment == 2 && listing.seller.country == _s_countries.active.get()){
	        			var id = 'sellyx-1';
	        			var name = 'Sellyx Domestic';
	        			}
	        		else if((listing.fulfillment == 2 || listing.sellyxship == 2) && listing.seller.country != _s_countries.active.get()){
	        			var id = 'sellyx-2';
	        			var name = 'Sellyx International';
	        			}

					return { 
						listing : listing , 
						item : item ,
						seller : {
							actual : {
								id : listing.seller.id,
								name : listing.seller.name
								},
							shipping : {
								id : (id?id:listing.seller.id),
								name : (name?name:listing.seller.name)
								}
							}
						};
					}
				return { failure : { msg : 'This listing is not active or not available.' , code : 300 } };
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
	get get() { 
		var self = this;
		return {
			count : function(){
				var orders = self.get.orders();
				var total = 0;

				if(Object.keys(orders).length > 0){
					_s_u.each(orders, function(dets, seller){
						_s_u.each(dets.items , function(item_dets, item_id){
							total += Object.keys(item_dets.listings).length;	
							})
						})
					}
				if(total == 0) return ''
				else return total;
				},
			all : function(){
				return _s_session.get('cart');
				},
			total : function(){
				if(_s_session.get('cart.totals.grand',true)) return _s_session.get('cart.totals.grand')
				return false;
				},
			orders: function(){
				return _s_session.get('cart.orders');
				},
			order: function(sellerid){
				var orders = self.get.orders();
				if(orders[sellerid]) return orders[sellerid]
				else return false;
				},
			promotions : function(){
				return _s_session.get('cart.promotions');
				},
			shipping : {
				options : function(seller){
					return _s_session.get('cart.orders.' + seller + '.shipping.options' , true);
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
			delete : function(obj){

				try{
	        		_s_session.delete('cart.orders.' + obj.seller + '.items.' + obj.product + '.listings.' +obj.listing)
	        		var get = _s_session.get('cart.orders.' + obj.seller + '.items.' + obj.product + '.listings');

	        		if(Object.keys(get).length == 0){
	        			_s_session.delete('cart.orders.' + obj.seller + '.items.' + obj.product);
		        		var get = _s_session.get('cart.orders.' + obj.seller + '.items');
		        		if(Object.keys(get).length == 0){
		        			_s_session.delete('cart.orders.' + obj.seller);
		        			}

	        			}
	        		return { success : 'Item deleted.' };
	        		}
	        	catch(err){
	        		return { failure : 'Item could not be deleted at this time.' }
	        		}

				},
			add : function*(obj){
				try { 
		            var v = yield self.helpers.validate(obj);
		            if(v.failure) return validate;

	        		var r = {
	        			quantity : (obj.quantity?obj.quantity:1),
	    				category : v.item.line.category,
	        			country : _s_countries.active.get()
	        			};

	        		if(obj.negotiated) {
	        			r.negotiated = true;
	        			r.price = obj.price;
	        			}

	        		if(!_s_session.get('cart.orders.' + id + '.items' , true)){
	        			if(id == 'sellyx-1' || id == 'sellyx-2'){
	        			 	_s_session.set('cart.orders.' + id + '.name' , name);
	        				}
	        			else{
	        				_s_session.set('cart.orders.' + id , _s_util.merge({items : {}}, listing.seller));
	        				}
	        			}

	        		_s_session.set('cart.orders.' + id + '.items.' + obj.product + '.listings.' + obj.listing , r);
        			
	        		// if we had calculated shipping totals for this seller previously, we now need to delete those for recalculation purposes

	    			_s_session.delete('cart.orders.' + id + '.shipping');
	
	        		return { success : { msg : 'Added to cart!' , code : 300 } };
	    			}
	    		catch(err){
	    			return { failure : { msg : 'There was an error in adding the item to the cart.' , code: 300 } }
	    			}

				},
			update : {
				quantity : function*(obj){
	            	var validate = yield self.helpers.validate(obj);
	            	if(validate.failure) return validate

	            	
            		// check to see its not negotiated
            		if(_s_session.get('cart.orders.' + obj.seller + '.items.' + obj.product + '.listings.' +obj.listing + '.negotiated')) return { failure : 'You cannot update the quantity of a negotiated item.' };

            		if(obj.quantity >= 1){
            			_s_session.set('cart.orders.' + obj.seller + '.items.' + obj.product + '.listings.' +obj.listing + '.quantity' , obj.quantity);

            			// if shipping had been calculated, we need to recalculate, so unset the shipping for this item;

            			_s_session.delete('cart.orders.' + obj.seller + '.shipping');

	            		return { success : 'Quantity updated.' };
            			}
            		else{
            			return self.items.delete(obj);
            			}
					},
				waive : function*(obj){
	            	var validate = yield self.helpers.validate(obj);
	            	if(validate.failure) return validate
	            	
            		// check to see its not negotiated
            		if(_s_session.get('cart.orders.' + obj.seller + '.items.' + obj.product + '.listings.' +obj.listing + '.negotiated')) return { failure : 'You cannot waive or change the price of a negotiated item.' };
            		// make sure that no_returns == 1
            		if(_s_session.get('cart.orders.' + obj.seller + '.items.' + obj.product + '.listings.' +obj.listing + '.details.no_returns') == 2) return { failure : 'This seller does not allow returns or return pricing on this item.' };

            		if(obj.type == 2){
	            		// get return policy of seller
	            		var results = yield _s_seller.get.seller({id:validate.listing.seller.id, include : 'policy'});
	            		if(!results) return { failure : 'The seller was not found!' };


	            		if(results.data.policy && results.data.policy[(_countries.active.get()==validate.listing.seller.country)?1:2].allowed == 2){
	            			_s_session.set('cart.orders.' + obj.seller + '.items.' + obj.product + '.listings.' +obj.listing + '.waived' , true);
	            			_s_session.delete('cart.orders.' + obj.seller + '.shipping');
	            			return { success : true}
	            			}
	            		else{
	            			return { failure : 'The seller has since changed their policy to not allow returns. We apologize for this inconvenience.' , refresh : true };
	            			}
	            		}
	            	else{
	            		_s_session.delete('cart.orders.' + obj.seller + '.items.' + obj.product + '.listings.' +obj.listing + '.waived');
	            		_s_session.delete('cart.orders.' + obj.seller + '.shipping');
	            		return { success : true}
	            		}
					},
				notes : function*(obj){
	            	var validate = yield self.helpers.validate(obj);
	            	if(validate.failure) return validate	        

        			_s_session.set('cart.orders.' + obj.seller + '.items.' + obj.product + '.listings.' +obj.listing + '.notes' , obj.notes);
            		return { success : 'Notes updated.' };
					},
				shipping : {

					options : function(obj){

						_s_session.set('cart.orders.' + obj.seller + '.shipping.options' , obj.options);

						},
					save : function(obj){
						var options = _s_session.get('cart.orders.' + obj.seller + '.shipping.options')
						
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

						_s_u.each(obj.send, function(selection, id){
							
							if(id == 'custom'){
								var b = Object.keys(selection);
								id = 'custom.' + b[0];
								selection = selection[b[0]];
								}
							
							var check = _s_session.get('cart.orders.' + obj.seller + '.shipping.options.' + id  )[selection];
							if(check) {
								go[id] = check;
								subtotal += parseFloat(go[id].rate);
								count++;
								}
							
							})

						// if they all check out, then we can officially set the selected options for each item
						if(count == total) {
							_s_session.set('cart.orders.' + obj.seller + '.shipping.selected' , go);
							_s_session.set('cart.orders.' + obj.seller + '.shipping.total' , subtotal);
							return { success : 'Shipping Options Confirmed!' };
							}
						else {
							return { failure : 'The shipping options you selected could not be applied for some reason. Please try again.' };
							}
						// return obj.send;
						}


					}
				}
			}
		}
	}



module.exports = function(){if(!(this instanceof Cart)) { return new Cart(); } }

