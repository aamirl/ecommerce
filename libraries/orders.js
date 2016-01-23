// Orders Library

function Orders(){}

Orders.prototype = {
	model : _s_load.model('orders'),
	helpers : {
		filters : function(){
			return {
				q : { v:['isSearch'] , b : true},
				id : { v:['isOrder'] , b:true },
				listing : { v:['isListing'] , b:true },
				product : { v:['isProduct'] , b:true },
				user : { v:['isUser'] , b:true },
				seller : { v:['isSeller'] , b:true },
				convert : { in:['true','false'] , default : 'true' },
				include : { v:['isAlphaOrNumeric'], b:true },
				exclude : { v:['isAlphaOrNumeric'], b:true },
				active : { v:['isAlphaOrNumeric'], b:true },
				x : { v:['isInt'] , b:true , default : 0 },
				y : { v:['isInt'] , b:true , default : 10 }
				};
			}
		},
	get : function*(obj){
		return yield _s_common.get(obj, 'orders');
		},
	get new() {
		var self  = this;
		return {
			order : function*(obj , create){
				!obj?obj={}:null;
				
				// this is the new function for the order library
				// we can validate informtion here and then based on the flag add other things if needed

				var c = {
					items : { v:['isArrayOfObjects'] , default : []},
					gift : { in : ['1','2',1,2] , default : 1 },
					type : { in : ['1','2',1,2] , default : 2 },
					address : _s_common.helpers.validators.address(),
					promotions : { v:['isArray'] , b:true },
					user : { v:['isUser'] , b:true },
					offers : { v:['isJSON'] , b:true },
					transactions : {  
						json : true,
						data : {
							history : { v:['isArray'] },
							setup : {
								json : true,
								data : {
									active : { in : [1,2,'1','2'] , default : 1 },
									status : { in : [1,2,'1','2'] , default : 1 }
									}
								}
							},
						b:true
						}
					}


				var data = ( obj.data ? _s_req.validate({ validators : c, data : obj.data }) : _s_req.validate(c) );
				if(data.failure) return data; 

				// first we add a user to the document
				var _o_user = (data.user?yield _s_load.object('users',data.user):_s_user);
				if(_o_user.failure) return _o_user;

				data.user = _o_user.helpers.data.document();

				if(!data.address) data.address = _o_user.profile.addresses.primary();


				// now we iterate through the items and verify them
				var items = [];
				var totals = {
					seller : 0,
					sellyx : 0,
					customer : 0
					};
				var errors = null;	
				var seller = false;

				yield _s_util.each(data.items, function*(o,i){
					o.country = data.address.country;
					var r = yield self.new.item({data : o });

					if(r.failure){
						errors = r;
						return false;
						}
					else {
						if(!seller) seller = r.seller;
						else if(seller != r.seller){
							errors = { failure : { msg : 'The seller is not the same for all the items being added to this order.' , code : 300 } }
							return false;
							}

						totals.customer += parseFloat(r.totals.customer);
						if(r.totals.seller) totals.seller += parseFloat(r.totals.seller);
						if(r.totals.sellyx) totals.sellyx += parseFloat(r.totals.sellyx);
						items.push(r.item);
						}
					})
				if(errors) return errors 

				// then we add the seller info
				// any of the items in the listing has the seller id at the end of it
				var _o_seller = yield _s_load.object('sellers',seller);
				if(_o_seller.failure) return _o_seller;
				data.seller = _o_seller.helpers.data.document();			

				data.items = items;
				data.totals = totals;
				data.setup = {
					active : 1,
					status : 1,
					added : _s_dt.now.datetime()
					}
				data.policy = _o_seller.profile.policy((data.address.country==_o_seller.profile.country()?1:2));
				
				if(create) return yield _s_common.new(data,'orders', true);
				return data;
				},
			item : function*(obj){
				var c = {
					user : { v:['isUser'] , b:true },
					country : { v : ['isCountry'] , b:true },
					item : { v:['isProduct'] },
					listing : { v:['isListing'] },
					order : { v:['isOrder'] , b:true },
					quantity : { v:['isInt'] },
					totals : {
						json : true,
						data : {
							items : { v:['isPrice'] },
							taxes : { v:['isPrice'] },
							discount : { v:['isPrice'] },
							subtotal : { v:['isPrice'] },
							},
						b:true
						},
					promotions : { v:['isArray'] , b:true},
					gifts : { v:['isArray'] , b:true  },
					shipping : {
						json: true,
						data : {
							service : { 
								json : true,
								data : {
									service : {
										json : true,
										data : {
											id : { v:['isAlphaOrNumeric'] },
											label : { v:['isAlphaOrNumeric'] }
											}
										},
									packaging : {
										json : true,
										data : {
											id : { v:['isAlphaOrNumeric'] },
											label : { v:['isAlphaOrNumeric'] }
											}
										},
									rate : { v:['isPrice'] }
									}
								},
							responsibility : { v: ['isAlphaOrNumeric'] }
							}
						}
					}

				var data = ( obj.data ? _s_req.validate({ validators : c, data : obj.data }) : _s_req.validate(c) );
				if(data.failure) return data; 

				// we want to verify this listing exists for this product first
				var _o_product = yield _s_load.object('products', data.item);
				if(_o_product.failure) return _o_product;

				data.item = {
					id : data.item,
					name : _o_product.name()
					}

				var listing = _o_product.find.listing({id : data.listing});
				if(!listing) return { failure : { msg : 'The listing could not be found for this item.' , code : 300 } };
				else listing = listing.object;

				// make sure the quantity is fine for it
				if(listing.quantity < data.quantity) return { failure : { msg : 'The item could not be added to the order because there are not enough available items.' , code : 300 } }

				// add the process time
				data.process_time = listing.process_time ;

				// let's figure out the di on this
				var di = (listing.seller.country != data.country ? 2 : 1);

				// let's check and make sure the reach is okay for this
				if(listing.reach != 3 && listing.reach != di) return { failure : { msg : 'This listing cannot be shipped to the currently chosen country.' , code : 300 } }

				// check the totals, if there aren't any we have to add
				if(!data.totals){
					var totals = {
						items : 0,
						taxes : 0,
						discount : 0,
						subtotal : 0,
						}


					totals.items = parseFloat((listing.pricing['sale'+di]?listing.pricing['sale' + di]:listing.pricing['standard' + di]) * data.quantity)

					// see if there are any promotions
					if(data.promotions){
						_s_u.each(data.promotions , function(o,i){
							// get promotion

							})
						}

					totals.taxes = (parseFloat(totals.items - totals.discount) * 0.09);
					totals.subtotal = (parseFloat(totals.items) - parseFloat(totals.discount) + parseFloat(totals.taxes));

					data.totals = totals;
					}

				// TODO - SET THE SHIPPING INFORMATION HERE ASAP
				// THIS INCLUDES STATUS AND STUFF

				var total = parseFloat(data.totals.subtotal);
				var totals = {
					customer : total + data.shipping.service.rate,
					seller : total,
					sellyx : 0
					}

				switch(data.shipping.responsibility){
					case 'sellyx-1':
						totals.sellyx += data.shipping.service.rate;
						data.status = 1;
						break;
					case 'sellyx-2':
						totals.sellyx += data.shipping.service.rate;
						data.status = (	listing.shipping_rates == 2 ? 2 : 3 );
						break;
					default:
						totals.seller += data.shipping.service.rate;
						data.status = (	listing.shipping_rates == 2 ? 4 : 5 );
						break;
					}

				// if there is no order to add this to, return the data
				if(!data.order) return { item : data , totals : totals , seller : listing.seller.id } ; 

				var order = data.order;
				delete data.order;

				// otherwise let's update the order
				var get = yield self.get({id : order , convert : false});
				if(!get) return { failure : { msg : 'The order does not exist in the system.' , code : 300 } };


				// let's check to make sure that the order belongs to the current user				
				var _o_user = (data.user?yield _s_load.object('users',data.user):_s_user);
				if(_o_user.profile.id() != get.user.id) return { failure : { msg : 'User not authorized to add items to the current order.' , code : 300 } }

				get.items.push(data);

				var update = self.model.update({id:order, doc : get});
				if(!update) return { failure : { msg : 'The order could not be updated successfully.' , code : 300 } };
				else return { success : { data : yield _s_common.helpers.convert(get, 'orders' ) } };
				}
			}	
		},
	update : function*(obj){
		},
	get actions(){
		var self = this;
		return {
			listing : {
				cancel : function*(order, success_status, failure_status, raw){
					var cancel = yield _s_req.http({
						url : _s_config.financials + 'reversals/p/new',
						method : 'POST',
						data : {
							id : order.transactions[0]
							}
						})

					if(cancel.failure){order.setup.status = (failure_status?failure_status:55); }
					else{
						cancel = cancel.success.data;

						if(cancel.setup.status!=1){
							order.setup.status = (failure_status?failure_status:55);
							order.transactions.push(cancel.id)
							}
						else{
							order.setup.status = (success_status?success_status:52);
							order.transactions.push(cancel.id)
							}
						}

					order.cancelled = _s_dt.now.datetime();
					order.cancelled_by = _s_entity.object.profile.id();

					if(raw) return order;
					return yield _s_common.update(order,'orders',false);
					}
				},
			}
		}
	}

module.exports = function(){
  	if(!(this instanceof Orders)) { return new Orders(); }
	}