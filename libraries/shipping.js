// Shipping

function Shipping(){}

Shipping.prototype = {
	get helpers() {
		var self = this;
		return {
			dimensions : {
				min : function(obj){
					var tester = ['s_length','s_width','s_height'];
					var quantity = obj.quantity;
					var item = obj.item;
					var dimensions = obj.dimensions;

					// figure out minimum of the dimensions
					var min = 10000000000000000000000000;
					var min_v;
					_s_u.each(tester , function(i,ind){
						if(item[i] < min){
							min_v = i;
							min = item[i].data;
							}
						})

					_s_u.each(tester , function(i,ind){

						if(min_v == i){
							dimensions[i] = (parseFloat(item[i] * quantity).toFixed(2))/1;
							}
						else if(dimensions[i] < item[i]){
							dimensions[i] = (parseFloat(item[i]).toFixed(2))/1;
							}

						})

					dimensions.s_weight += (parseFloat(parseFloat(item.s_weight)*quantity).toFixed(2))/1;
					return dimensions;
					}
				},
			sellyx : {
				domestic : function(obj){
					// now we iterate over the categories and get the pricings
					var send = {};
					var file = this._s.datafile('shipping/sellyx/domestic/' + obj.country);
					if(!file) return { failure : { msg : 'This country does not have a domestic Sellyx service.' , code :300 } }
					
					_s_u.each(obj.categories, function(id, ind){
						if(file[id]) var iteratee = file[id];
						else var iteratee = file[id.substring(0,2)];

						_s_u.each(iteratee, function(rates, service){
							var total = (parseFloat(rates.single + (rates.with * parseFloat(obj.quantity-1)))).toFixed(2)/1;
							
							if(!send[service]){
								send[service] = {
									service : {
										label : 'Sellyx ' + this._s.l.info('service', service, 'shipping'),
										id : service
										},
									packaging : {
										label : 'Sellyx Packaging',
										id : 'sellyx'
										},
									rate : parseFloat(total)
									}
								}
							else if(send[service].rate < total){
								send[service].rate = total;
								}
							})
						})
					return send;
					},
				international : function(obj){

					var send = {};
					var dimensions = obj.dimensions;
					var quantity = obj.quantity;
					var file = this._s.datafile('shipping/sellyx/international/' + obj.origin);
					if(!file) return { failure : { msg : 'This country does not have an international Sellyx service.' , code :300 } }

					// calculate based off a pallet that is 48 inches by 48 inches by 64 inches
					var total = 121 * 121 * 161;
					// get how much of total space will be occupied by objects
					var used = dimensions.s_height * dimensions.s_length * dimensions.s_width;
					// get what percent of price will be needed

					var occupied = used / total;
					console.log(dimensions);
					console.log(used);

					_s_u.each(file[_s_countries.active.get()], function(dets, service){
						send[service] = {
							service : {
								label : 'Sellyx ' + this._s.l.info('service', service, 'shipping'),
								id : service
								},
							packaging : {
								label : 'Sellyx Packaging',
								id : 'sellyx'
								},
							rate : (parseFloat(dets.rate * occupied).toFixed(2))/1
							}
						})

					return send;
					}
				},
			services : {
				country : function(countryId){
					var country = (countryId ? countryId : _s_countries.active.get());
					return this._s.datafile('shipping/country/' + country);
					// return file;
					}
				},
			api : function*(obj){
				if(obj.dimensions.s_weight > 0){
					var _shippo = this._s.engine('shippo');
					var rates = yield _shippo.calculate(obj);
					if(!rates) rates = {};
					// if(rates) return rates;
					
					// in addition, we also need to generate results for any deals we have
					var domestic = (obj.recipient.address.country == obj.origin.address.country);

					var others = self.helpers.services.country(obj.origin.address.country);
					_s_u.each(others,function(services, courier){
						
						_s_u.each(services, function(dets, service){
							
							if(domestic && dets.type >= 7) return;
							if(!domestic && dets.type <= 6) return;

							rates[service] = {
								service : {
									label : courier + ' ' + dets.label,
									id : service
									},
								packaging : {
									label : dets.packaging ? dets.packaging : 'Custom Packaging',
									id : 'custom'
									}
								}

							switch(dets.method){
								// this is based on a flat rate per 0.250 kg, per 0.500 kg, and 1 kg
								case 1:
									if(obj.dimensions.s_weight <= 0.250){
										var rate = dets.data[1];
										}
									else if(obj.dimensions.s_weight <= 0.500){
										var rate = dets.data[2];
										}
									else{
										var rate = dets.data[2] + ((Math.ceil((obj.dimensions.s_weight - 0.500) / 0.500)) * dets.data[3])
										}
									break;
								}

							rates[service].rate = parseFloat(rate);

							})
						})

					// TODO if there are no results, we need to pull up deals we have in the countries with their carriers before we send back s
					if(Object.keys(rates).length != 0) return rates;
					else return false;
					}

				return true;
				},
			autocalculate : function(obj){
				var id = obj.listing.id;
				var listing = obj.listing.listing;
				var details = obj.listing.details;

				var di = (listing.seller.country.id == obj.country ? 1 : 2);

				var order = obj.order
				var item = obj.item;
				var send = obj.send;
				var total = obj.total;
				var dimensions = obj.dimensions;

				if(listing.shipping_rates == 1){
					var t =  this._s.util.array.find.object(item.combos,'id',listing.combo);
					dimensions = self.helpers.dimensions.min({
						quantity : details.quantity,
						item : (item.attributes.s_length ? item.attributes :t),
						dimensions : dimensions
						})

					total++;
					}
				else{
					send.custom[id] = {};

					_s_u.each(listing.custom_shipping, function(ship_dets, service){

						if((di==1 && service >= 7) || (di==2 && service < 7)) return;
						send.custom[id][service] = {
							service : {
								label : this._s.l.info('service', service, 'shipping'),
								id : service
								},
							packaging : {
								label : 'Custom Packaging',
								id : 'custom'
								}
							}

						// if there is an exception or special rate for the active country, we use those values instead of the standards
						if(di==2 && ship_dets.exceptions && ship_dets.exceptions[obj.country]) ship_dets = ship_dets.exceptions[obj.country];

						if(details.quantity > 1 || total > 0){
							if(ship_dets.with != ship_dets.single){
								send.custom[id][service].rate = parseFloat(ship_dets.single) + parseFloat(ship_dets.with * (details.quantity - 1));
								}
							else{
								send.custom[id][service].rate = parseFloat(ship_dets.single * details.quantity);
								}
							}
						// else if(total > 0){
						// 	send.custom[id][service].rate = parseFloat(ship_dets.with * details.quantity);
						// 	}
						else{
							send.custom[id][service].rate = parseFloat(ship_dets.single);
							}

						if(send.custom[id][service].rate == 0) send.custom[id][service].rate = '0.00'

						total++;
						})
					}

				return { send : send, total : total, dimensions : dimensions };
				}
			}
		},
	calculate : function*(obj){
		// expect the seller in the form of sellyx-1, sellyx-2, or the seller
		// expect the order in the form of a cart seller object complete with the items and corresponding listings
		// expect the receipient address
		// if(!obj.seller || )

		var self = this;
		var p_errors = [];
		var l_errors = [];
		var dimensions = {
			s_length : 0,
			s_width : 0,
			s_height : 0,
			s_weight : 0
			};

		switch(obj.seller) {
			// here we are getting sellyx rates
			// sellyx rates are based on flat rates per category with an additional per item
			case 'sellyx-1':
				var categories = [];
				var quantity = 0;

				yield this._s.util.each(obj.order.items, function*(dets, id){

					// here we want to iterate over the items, and get the category and quantities being bought for each item. afterwards we will apply the proper pricing based on the accumulated data

					// get the item first
					var result = yield this._s.library('products').get({id:id,include:'combos,attributes,sellers'});
					if(!result) {p_errors.push(id); return false;}

					if(this._s.util.indexOf(categories, result.line.category) == -1) categories.push(result.line.category);
					
					_s_u.each(dets.listings, function(details, listing){
						quantity += parseInt(details.quantity);
						})

					})

				var grouped = self.helpers.sellyx.domestic({
					country : obj.recipient.address.country,
					categories : categories,
					quantity : quantity,
					});

				if(grouped.failure) return grouped;
				if(Object.keys(grouped).length > 0) return { grouped : grouped };			
				break;
			case 'sellyx-2':
				// three things can happen here with each item
				// they are all originating from a country that has fulfillment
				// if they are sellyxship, we need to figure out the domestic rates to get it from their location to the fulfillment center for leg 1
				// then for leg 2, we need to consolidate them
				// if the destination country is fulfilled, then we ship them to that country and then do a leg 3 to get them to the final location
				// otherwise we consolidate them and send them straight to the end customer
				var types = {
					l1 : {},
					l2d : {},
					l2c : {},
					l3 : { quantity: 0, categories:[], country :_s_countries.active.get() }
					}



				var fulfilled = _s_countries.fulfillment.fulfilled(_s_countries.active.get())

				yield this._s.util.each(obj.order.items, function*(dets, id){

					// get the item first
					var result = yield this._s.library('products').get({id:id,include:'combos,attributes,sellers'});
					if(!result) {p_errors.push(id); return false;}

					
					_s_u.each(dets.listings, function(details,listing){

						var r = this._s.util.array.find.object(result.sellers, 'id',listing);
						if(!r) { l_errors.push({ product : id, listing : listing  }); return false;  }

						// first we need to see whether it needs a leg 1
						if(r.fulfillment == 1){
							// lets figure out what it takes to get the item to the domestic fulfillment center and put that information into leg 1, since this seller is using sellyxship to get it to the end location
							if(!types.l1[r.seller.id]){
								types.l1[r.seller.id] = { 
									total : 0 , 
									send : { grouped : [] , custom : {} } , 
									dimensions : this._s.util.merge({},dimensions) , 
									origin : { 
										name : r.seller.name,
										address : {
											postal : r.seller.postal , 
											country : r.seller.country
											}
										},
									recipient : {
										name : 'Sellyx Fullfillment',
										address : _s_countries.fulfillment.address(r.seller.country)
										}
									}
								}

							var vals = self.helpers.autocalculate({
								listing : {
									id : listing,
									listing : r,
									details : details
									},
								item : result,
								order : obj.order,
								send : types.l1[r.seller.id].send,
								total : types.l1[r.seller.id].total,
								dimensions : types.l1[r.seller.id].dimensions,
								country : r.seller.country
								})

							types.l1[r.seller.id].send = vals.send;
							types.l1[r.seller.id].dimensions = vals.dimensions;
							types.l1[r.seller.id].total = vals.total;
							}

						// if the destination country is fulfilled, then that means that we will have a leg 3
						if(fulfilled){
							// get leg3 stuff setup
							if(this._s.util.indexOf(types.l3.categories, result.line.category) == -1) types.l3.categories.push(result.line.category);
							types.l3.quantity += details.quantity;

							// now add the dimensions of the fulfilled item to the country it's originating from
							// add dimensions for this seller's country
							var t = 'l2c';
							}
						else{
							// otherwise we have to figure out the cost of getting the product from our fulfillment center in the seller's country to the end location directly via a consolidated package
							var t = 'l2d';
							}

						!types[t][r.seller.country] ? types[t][r.seller.country] = { dimensions : this._s.util.merge({},dimensions) , send : {} } : null;

						types[t][r.seller.country].dimensions = self.helpers.dimensions.min({
							quantity : details.quantity,
							item : (result.attributes.s_length ? result.attributes : this._s.util.array.find.object(result.combos,'id',r.combo)),
							dimensions : types[t][r.seller.country].dimensions
							})

						})

					})
				
				if(p_errors.length > 0) return { failure : { msg: 'There were items that were not found.' , data : p_errors, code : 300 } };
				if(l_errors.length > 0) return { failure : { msg: 'There were product listings that were not found.' , data : l_errors, code : 300 } };

				var errors = {l1:[],l2:[],l3:[]};
				// so now that we have everything, dimensions, etc, we can iterate and go over things and get rates accordingly

				if(Object.keys(types.l1).length > 0){
					// for each seller that needs to get their product to origin country fulfillment center, if there are dimensions, we need to get rates

					yield this._s.util.each(types.l1, function*(seller_shipping, seller){
						types.l1[seller] = {
							custom : types.l1[seller].send.custom,
							grouped : yield self.helpers.api(seller_shipping)
							}

						if(Object.keys(types.l1[seller].custom).length == 0 && !types.l1[seller].grouped){
							errors.l1.push(seller)
							}
						else{
							if(Object.keys(types.l1[seller].custom).length == 0) delete types.l1[seller].custom
							if(!types.l1[seller].grouped instanceof Object) delete types.l1[seller].grouped
							}
						});
					}
				else{
					delete types.l1;
					}

				if(Object.keys(types.l2d).length > 0){
					// we need to calculate the rates from the seller's fulfillment center to the end destination

					_s_u.each(types.l2d, function(seller_shipping, country){
						var fulfillment = _s_countries.fulfillment.address(country);
						types.l2d[country] = self.helpers.api({
							dimensions : seller_shipping.dimensions,
							origin : {
								name : seller_shipping.name,
								address : seller_shipping.origin
								},
							recipient : fulfillment.address
							})

						if(!types.l2d[country]) errors.l2.push(country);
						})
					}
				else{
					delete types.l2d;
					}
				if(Object.keys(types.l2c).length > 0){
					// we need to calculate the rate of shipping the items on a pallet between the origin country and the destination country

					_s_u.each(types.l2c, function(fulfillment_shipping, country){
						types.l2c[country] = self.helpers.sellyx.international({
							dimensions : fulfillment_shipping.dimensions,
							quantity : fulfillment_shipping.quantity,
							origin : country
							})
						
						if(Object.keys(types.l2c[country]).length == 0) errors.l2.push(country);
						})
					}
				else{
					delete types.l2c
					}
				if(Object.keys(types.l3).length > 0){
					types.l3 = self.helpers.sellyx.domestic(types.l3);
					if(Object.keys(types.l3).length == 0) errors.l3.push('error');
					}
				else{
					delete types.l3
					}

				// for now, we will be actually pushing values into each error for debug purposes. for release, we can simply set errors to a true false

				var i = false;
				_s_u.each(errors, function(dets,ind){
					if(Object.keys(dets).length > 0){
						i = true;
						return false;
						}
					})

				console.log(errors);
				console.log(types);

				if(!i) return types;

				break;
			default:
				// we will iterate over all the products, get the product dimensions and quantities and see what we can fix into a box

				var send = {
					grouped : [],
					custom : {}
					}
				
				// this variable denotes that this customer bought at least one quantity item from this seller at this time. the idea is that if this is true, the customer can get the 'with' price for the shipping always for the shipping speed.

				var total = 0;

				yield this._s.util.each(obj.order.items, function*(dets, id){


					// get the item first
					var result = yield this._s.library('products').get({id:id,include:'combos,attributes,sellers'});
					if(!result) {p_errors.push(id); return false;}

					_s_u.each(dets.listings, function(details, listing){

						var r = this._s.util.array.find.object(result.sellers, 'id',listing);
						if(!r) { l_errors.push({ product : id, listing : listing  }); return false;  }

						var vals = self.helpers.autocalculate({
							listing : {
								id : listing,
								listing : r,
								details : details,
								},
							item : result,
							order : obj.order,
							send : send,
							total : total,
							dimensions : dimensions,
							country : obj.recipient.address.country
							})

						send = vals.send;
						total = vals.total;
						dimensions = vals.dimensions;

						})
					})

				if(p_errors.length > 0) return { failure : { msg: 'There were items that were not found.' , data : p_errors, code : 300 } };
				if(l_errors.length > 0) return { failure : { msg: 'There were product listings that were not found.' , data : l_errors, code : 300 } };
				
				// after we iterate over, we check to see if we need to generate grouped rates
				send.grouped = yield self.helpers.api({
					dimensions : dimensions,
					origin : {
						name : obj.order.name,
						address : obj.order.address
						},
					recipient : obj.recipient
					});

				// clean up both grouped and custom

				if(Object.keys(send.custom).length == 0) delete send.custom;
				if(send.grouped.length == 0 || typeof send.grouped == 'boolean') delete send.grouped;
				if((send.custom && Object.keys(send.custom).length != 0 ) || send.grouped) return send;
				break;
			}

		return false;
		}
	}



module.exports = function(){
  	if(!(this instanceof Shipping)) { return new Shipping(); }
	}