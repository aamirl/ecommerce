// Orders Library

function Orders(){}

Orders.prototype = {
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
				y : { v:['isInt'] , b:true , default : 10 },
				count : { in:['true','false',true,false], b:true, default:false },
				s_status : {csv_in:["50","51","52","53","54","55","56","57","58","59","60",50,51,52,53,54,55,56,57,58,59,60] , b:true },
				s_active : { csv_in:[1,0,"0","1"], b:true, default :[1] },
				full : { in:['true','false',true,false], b:true, default:false }
				};
			}
		},
	get : function*(obj){
		return yield this._s.common.get(obj, 'orders');
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
					address : this._s.common.helpers.validators.address(),
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


				var data = ( obj.data ? this._s.req.validate({ validators : c, data : obj.data }) : this._s.req.validate(c) );
				if(data.failure) return data; 

				// first we add a user to the document
				var _o_user = (data.user?yield this._s.object('users',data.user):_s_user);
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

				yield this._s.util.each(data.items, function*(o,i){
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
				var _o_seller = yield this._s.object('sellers',seller);
				if(_o_seller.failure) return _o_seller;
				data.seller = _o_seller.helpers.data.document();			

				data.items = items;
				data.totals = totals;
				data.setup = {
					active : 1,
					status : 1,
					added : this._s.dt.now.datetime()
					}
				data.policy = _o_seller.profile.policy((data.address.country==_o_seller.profile.country()?1:2));
				
				if(create) return yield this._s.common.new(data,'orders', true);
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

				var data = ( obj.data ? this._s.req.validate({ validators : c, data : obj.data }) : this._s.req.validate(c) );
				if(data.failure) return data; 

				// we want to verify this listing exists for this product first
				var _o_product = yield this._s.object('products', data.item);
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
				var _o_user = (data.user?yield this._s.object('users',data.user):_s_user);
				if(_o_user.profile.id() != get.user.id) return { failure : { msg : 'User not authorized to add items to the current order.' , code : 300 } }

				get.items.push(data);

				var update = self.model.update({id:order, doc : get});
				if(!update) return { failure : { msg : 'The order could not be updated successfully.' , code : 300 } };
				else return { success : { data : yield this._s.common.helpers.convert(get, 'orders' ) } };
				}
			}	
		},
	update : function*(obj){
		},
	get actions(){
		var self = this;
		return {
			listing : {
				cancel : {
					single : function*(obj){
						if(!obj.authorized){		// means that there was actually a charge created for this item

							var cancel =  yield self._s.engine('financials').charge.reversal({
								transaction : (obj.transaction?obj.transaction:obj.order.transactions[obj.order.transactions.length-1])
								})

							if(cancel.failure){
								return cancel;
								obj.order.setup.status = (obj.failure?obj.failure:55)
								}
							else{
								cancel = cancel.success.data;

								if(cancel.setup.status!=1){
									obj.order.setup.status = (obj.failure?obj.failure:55);
									obj.order.transactions.push(cancel.id)
									}
								else{
									obj.order.setup.status = (obj.success?obj.success:52);
									obj.order.transactions.push(cancel.id)
									}

								}
							}
						else{
							obj.order.setup.status = 59
							}

						obj.order.cancelled = {
						 	added : self._s.dt.now.datetime(),
						 	entity : self._s.entity.object.helpers.data.document()
						 	}

						if(obj.raw) return obj.order;
						return yield self._s.common.update(obj.order,'orders',false);
						},
					all : function*(){


						}
					}
				},
			}
		}
	}

module.exports = function(){ return new Orders(); }