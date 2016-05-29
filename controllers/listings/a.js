module.exports = function(){  return new Controller(); }

function Controller(){}
Controller.prototype = {
	get : function*(){
		var _listings = this._s.library('listings');

		console.log(this._s.entity.object.profile.id())
		
		var data = this._s.req.validate(_listings.helpers.filters());
		if(data.failure) return data;

		data.entity = this._s.entity.object.profile.id();
		delete data.distance;
		delete data.type;

		data.endpoint = true;

		return yield _listings.get(data);
		},
	'get/favorites' : function*(){
		var _listings = this._s.library('listings');

		var data = this._s.req.validate(_listings.helpers.filters());
		if(data.failure) return data;

		data.favorites = this._s.entity.object.profile.id();
		delete data.distance;
		delete data.type;

		data.endpoint = true;

		return yield _listings.get(data);
		},
	new : function*(){
		var _listings = this._s.library('listings');

		var t = yield _listings.new();
		console.log(JSON.stringify(t))
		return t
		},
	status : function*(){
		var _listings = this._s.library('listings');

		return yield _listings.actions.status();
		},
	update : function*(){
		var _listings = this._s.library('listings');

		return yield _listings.update();
		},
	'orders/get/selling' : function*(){
		var _orders = this._s.library('orders');
		var c = _orders.helpers.filters();
		var data = this._s.req.validate(c);
		if(data.failure) return data;

		data.selling = this._s.entity.object.profile.id();
		data.exclude = 'transactions,key';
		data.endpoint = true;
		data.type = 1

		if(data.full && data.full == 'true') data.full = [{ key : 'listing', index : 'listings' , get : 'common' , obj : { include : 'title,price,price_shown,images,type,location,setup.status,setup.active,followers' , convert : 'true' } }];

		return yield _orders.get(data);
		},
	'orders/get/selling/order' : function*(){
		var _orders = this._s.library('orders');
		var c = _orders.helpers.filters();
		c.id.b = false

		var data = this._s.req.validate(c);
		if(data.failure) return data;

		data.exclude = 'transactions,key';
		data.endpoint = true;
		data.type = 1

		if(data.full && data.full == 'true') data.full = [{ key : 'listing', index : 'listings' , get : 'common' , obj : { include : 'title,price,price_shown,images,type,location,setup.status,setup.active,followers' , convert : 'true' } }];

		var t = yield _orders.get(data);
		if(t.failure) return t.failure

		if(t.success.data.selling.id != this._s.entity.object.profile.id()) return { failure : { msg : 'We are sorry but you are not authorized to pull up these order details.' } }
		return t;
		},
	'orders/get/selling/count' : function*(){
		var _orders = this._s.library('orders');
		var c = _orders.helpers.filters();
		var data = this._s.req.validate(c);
		if(data.failure) return data;

		data.selling = this._s.entity.object.profile.id();
		data.exclude = 'transactions,key';
		data.count = true;
		data.endpoint = true;
		data.s_status = [51,58,60]
		data.type = 1

		return yield _orders.get(data);
		},
	'orders/get/buying' : function*(){
		var _orders = this._s.library('orders');
		var c = _orders.helpers.filters();
		var data = this._s.req.validate(c);
		if(data.failure) return data;

		data.buying = this._s.entity.object.profile.id();
		data.exclude = 'transactions';
		data.endpoint = true;
		data.type = 1;
	
		if(data.full && data.full == 'true') data.full = [{ key : 'listing', index : 'listings' , get : 'common' , obj : { include : 'title,price,price_shown,images,type,location,setup.status,setup.active' , convert : 'true' } }];

		return yield _orders.get(data);
		},
	'orders/get/buying/order' : function*(){
		var _orders = this._s.library('orders');
		var c = _orders.helpers.filters();
		c.id.b = false

		var data = this._s.req.validate(c);
		if(data.failure) return data;

		data.endpoint = true;
		data.type = 1

		if(data.full && data.full == 'true') data.full = [{ key : 'listing', index : 'listings' , get : 'common' , obj : { include : 'title,price,price_shown,images,type,location,setup.status,setup.active' , convert : 'true' } }];

		var t = yield _orders.get(data);
		if(t.failure) return t.failure

		if(t.success.data.buying.id != this._s.entity.object.profile.id()) return { failure : { msg : 'We are sorry but you are not authorized to pull up these order details.' } }
		return t;
		},
	'orders/get/buying/count' : function*(){
		var _orders = this._s.library('orders');
		var c = _orders.helpers.filters();
		var data = this._s.req.validate(c);
		if(data.failure) return data;

		data.buying = this._s.entity.object.profile.id();
		data.exclude = 'transactions';
		data.count = true;
		data.endpoint = true;
		data.s_status = [51,58,60]
		data.type = 1

		return yield _orders.get(data);
		},
	
	'order/authorize' : function*(l){

		var _listings = this._s.library('listings');
		var _orders = this._s.library('orders');
		var data = this._s.req.validate({
			id : { v:['isListing'] },
			amount : { v:['isPrice'] },
			quantity : { v:['isInt'] , default : 1, b:true},
			transactions : { v:['isArrayOfObjects'] }
			})
		if(data.failure) return data;
		if(data.transactions.length > 1) return { failure : { msg : 'At this time, Sellyx only supports payment with one method.' , code : 300 } }

		var listing = yield _listings.get(data.id);

		if(!listing) return { failure : { msg : 'The listing was not found.' , code :300 } }
		if(listing.setup.active == 0) return  { failure : { msg : 'This is not a valid or active listing.' , code : 300 } }

		// now let's check the listing payment
		if(listing.payment_type == 2) return { failure : { msg : 'This listing cannot be purchased through Sellyx.' , code : 300 } }
		if(listing.quantity < data.quantity) return { failure : { msg : 'This listing does not have enough quantity available for purchase at this time.' , code : 300 } }
		if(listing.quantity_mpo < data.quantity) return { failure : { msg : 'This seller does not allow for the purchase of more than ' + listing.quantity_mpo + ' item(s) in one order.' , code : 300 } }

		// now let's see what the price needs to be
		if(!data.transactions[0].type || !data.transactions[0].amount) return { failure :  { msg : 'The transaction data was not submitting correctly.' , code : 300 } }

		var fee = (data.transactions[0].type == "stripe" ? 1.03 : 1)
		var expected = (this._s.util.roundup(listing.price * fee * parseInt(data.quantity), 2))/1

		if(listing.p_type == 1 ){
			if(data.transactions[0].amount != expected) return { failure : { failure : { msg : 'The transaction data is not accurate.' ,code : 300 } } }
			else var charge_now = true
			}
		else{
			if(data.transactions[0].amount < expected) var charge_now = false
			else var charge_now = true
			}

		var func = (charge_now?'charge':'authorize')
		var charge = yield this._s.engine('financials')[func].new({
			amount : data.amount,
			transactions : data.transactions
			})

		if(charge.failure) return charge
		else charge = charge.success.data
		if(charge.setup.status != 1) return { failure : { msg : 'The transaction failed. ( Error: '+ JSON.stringify(charge.transactions[0].failure) + ' )' , code : 300 } }

		var order = {
			buying : this._s.entity.object.helpers.data.document(),
			selling : listing.entity,
			location : this._s.loc.active.get(),
			type : 1,
			listing : data.id,
			price : data.amount,
			price_shown :  (this._s.util.roundup(data.amount/fee, 2)/1),
			quantity : data.quantity,
			transactions : [charge.id],
			setup : {
				active : 1,
				status : (charge_now?51:58),
				added : this._s.dt.now.datetime()
				}
			}

		if(charge_now){
			var crpyto = require('crypto');
			var start =  Math.random().toString(36).slice(2) + this._s.entity.object.profile.id();
			var key = crpyto.createHash('md5').update(start).digest('hex');

			order.key = key
			}

		var r = yield this._s.common.new(order,'orders',false)
		if(r.failure) return r;

		// now we add the order to the listing
		listing.orders.push(r.success.id);
		
		// if the order is a fixed priced listing or its a obo and the offer is the same as the fixed price
		if(charge_now){
			listing.quantity -= data.quantity;
			
			// show the listing as being sold if quantity is at 0
			if(listing.quantity == 0){
				listing.setup.active = 0;
				listing.setup.status = 3;
				}
			}

		yield this._s.common.update(listing, 'listings', false);

		if(this._s.entity.object.notifications.push){

			if(charge_now){
				yield this._s.engine('notifications').new.push({
					entity : listing.entity.id,
					type : "200",
					title : "New Reservation!",
					body : this._s.entity.object.profile.name()  + " reserved " + listing.title,
					data : {
						order : r.success.id,
						listing : listing.id,
						image : {
							data : listing.images[0],
							type : 'listing'
							}
						},
					add : true
					})
				}
			else{
				yield this._s.engine('notifications').new.push({
					entity : listing.entity.id,
					type : "202",
					title : "New Offer!",
					body : this._s.entity.object.profile.name()  + " made an offer for " + listing.title,
					data : {
						order : r.success.id,
						listing : listing.id,
						image : {
							data : listing.images[0],
							type : 'listing'
							}
						},
					add : true
					})


				}
			}

		return r;
		},
	'order/obo': function*(){
		var _listings = this._s.library('listings');
		var _orders = this._s.library('orders');
		var data = this._s.req.validate({
			id : { v:['isListingOrder'] },
			approve : { in:[true,false] }
			})
		if(data.failure) return data;

		var order = yield _orders.get(data);
		if(!order) return { failure : { msg : 'This is not a valid listing order.' , code : 300 } }

		if(order.type != 1) return { failure : { msg : 'This is not an order that can be picked up in person.' , code : 300 } }

		console.log(order.setup.status)

		if(order.setup.status != 58 && order.setup.status != 60) return { failure : { msg : 'This is not an OBO order that can be accepted or denied.' , code : 300 } }

		// now let's make sure that the person trying to confirm the obo order is the same as the one who started the listing
		var listing = yield this._s.library('listings').get(order.listing);
		if(!listing) return { failure : { msg: 'This listing is not a valid listing anymore.' , code : 300 } }
		
		if(listing.entity.id != this._s.entity.object.profile.id()) return { failure : { msg : 'This listing is not being confirmed by the same entity that listed it - therefore the payment cannot be completed.' , code : 300 } }


		if(data.approve){

			if(listing.setup.active != 1) return { failure : { msg : 'This listing is not an active listing. It may have already been completed.' , code : 300 } }
			if(listing.quantity < order.quantity) return { failure : { msg : 'This listing cannot be confirmed because the total quantity available is not enough.' , code : 300 } }
			
			// we create the charge
			var charge = yield this._s.engine('financials').charge.capture.authorized({
				id : order.buying.id,
				transaction : order.transactions[0]
				})

			if(charge.failure) return charge
			else charge = charge.success.data			
			if(charge.setup.status != 1) return { failure : { msg : 'At this time, this payment could not be authorized for later capture. Do you want to cancel this offer request or send a message to the customer and keep this offer active?' , code : 400 } }

			// update the order
			var crpyto = require('crypto');
			var start =  Math.random().toString(36).slice(2) + this._s.entity.object.profile.id();
			var key = crpyto.createHash('md5').update(start).digest('hex');

			order.key = key

			order.setup.status = 51
			order.transactions.push(charge.id)

			
			var r = yield this._s.common.update(order, 'orders', false)
			if(r.failure) return r;

			// update the listing quantity
			listing.quantity -= order.quantity
			if(listing.quantity == 0){
				listing.setup.active = 0
				listing.setup.status = 3
				}

			yield this._s.common.update(listing,'listings',false)


			if(this._s.entity.object.notifications.push){

				yield this._s.engine('notifications').new.push({
					entity : order.buying.id,
					type : "304",
					title : "Offer Accepted!",
					body : this._s.entity.object.profile.name()  + " accepted your offer for " + listing.title,
					data : {
						order : data.id,
						image : {
							data : listing.images[0],
							type : 'listing'
							}
						},
					add : true
					})
				}

			return { success : { data : true } }
			}

		// simple cancel
		var t = yield _orders.actions.listing.cancel.single({order : order , authorized : true });
		if(t.failure) return t


		var y = yield this._s.common.update(listing,'listings',false)
		if(y.failure) return y;

		if(this._s.entity.object.notifications.push){

			yield this._s.engine('notifications').new.push({
				entity : order.buying.id,
				type : "303",
				title : "Offer Denied",
				body : this._s.entity.object.profile.name()  + " rejected your offer for " + listing.title,
				data : {
					order : data.id,
					image : {
						data : listing.images[0],
						type : 'listing'
						}
					},
				add :true
				})
			}

		return { success : { data : true } }
		}, 
	'order/obo/cancel': function*(){
		var _listings = this._s.library('listings');
		var _orders = this._s.library('orders');
		var data = this._s.req.validate({
			id : { v:['isListingOrder'] }
			})
		if(data.failure) return data;

		var order = yield _orders.get(data);
		if(!order) return { failure : { msg : 'This is not a valid listing order.' , code : 300 } }

		if(order.type != 1) return { failure : { msg : 'This is not an order that can be picked up in person.' , code : 300 } }
		if(order.setup.status != 58 && order.setup.status != 60) return { failure : { msg : 'This is not an OBO order that can be accepted or denied.' , code : 300 } }
		if(order.buying.id != this._s.entity.object.profile.id()) return { failure : { msg : 'This is not the entity that created this obo request.' , code : 300 } }

		// now let's make sure that the person trying to confirm the obo order is the same as the one who started the listing
		var listing = yield this._s.library('listings').get(order.listing);
		if(!listing) return { failure : { msg: 'This listing is not a valid listing anymore.' , code : 300 } }
		
		// simple cancel
		var t = yield _orders.actions.listing.cancel.single({order : order , authorized : true });
		if(t.failure) return t


		var y = yield this._s.common.update(listing,'listings',false)
		if(y.failure) return y

		if(this._s.entity.object.notifications.push){


			yield this._s.engine('notifications').new.push({
				entity : order.buying.id,
				type : "203",
				title : "Offer Cancelled",
				body : this._s.entity.object.profile.name()  + " cancelled their offer to you for " + listing.title,
				data : {
					order : data.id,
					image : {
						data : listing.images[0],
						type : 'listing'
						}
					},
				add : true
				})
			}

		return { success : { data : { setup :order.setup , cancelled : order.cancelled } } }
		}, 
	'order/obo/retry' : function*(){
		var _listings = this._s.library('listings');
		var _orders = this._s.library('orders');
		var data = this._s.req.validate({
			id : { v:['isListingOrder'] }
			})
		if(data.failure) return data;

		var order = yield _orders.get(data);
		if(!order) return { failure : { msg : 'This is not a valid listing order.' , code : 300 } }

		if(order.type != 1) return { failure : { msg : 'This is not an order that can be picked up in person.' , code : 300 } }
		if(order.setup.status != 58 && order.setup.status != 60) return { failure : { msg : 'This is not a valid OBO order.' , code : 300 } }

		// now let's make sure that the person trying to confirm the obo order is the same as the one who started the listing
		var listing = yield this._s.library('listings').get(order.listing);
		if(!listing) return { failure : { msg: 'This listing is not a valid listing anymore.' , code : 300 } }
		if(listing.setup.active != 1) return { failure : { msg : 'This listing is not an active listing.' , code : 300 } }
		if(listing.quantity < order.quantity) return { failure : { msg : 'This listing cannot be confirmed because the total quantity available is not enough.' , code : 300 } }
		if(listing.entity.id != this._s.entity.object.profile.id()) return { failure : { msg : 'This listing is not being confirmed by the same entity that listed it - therefore the payment cannot be completed.' , code : 300 } }

		// update the order status to 60
		order.setup.status = 60
		var r = yield this._s.common.update(order, 'orders', false)
		
		// send push notifications
		if(this._s.entity.object.notifications.push){


			yield this._s.engine('notifications').new.push({
				entity : order.buying.id,
				type : "203",
				title : "Offer Accepted - Insufficient Funds",
				body : order.selling.name  + " accepted your offer and has been trying to authorize your funds for  " + listing.title + ". Please check to make sure that funds are available and message the seller to confirm.",
				data : {
					order : data.id,
					image : {
						data : listing.images[0],
						type : 'listing'
						}
					},
				add : true
				})
			}

		if(r.failure) return r;
		return { success : { data : { setup :order.setup } } }

		},
	'order/process' : function*(){
		var _listings = this._s.library('listings');
		var _orders = this._s.library('orders');
		var data = this._s.req.validate({
			id : { v:['isListingOrder'] }
			})

		if(data.failure) return data;

		var order = yield _orders.get(data);
		if(!order) return { failure : { msg : 'This is not a valid listing order.' , code : 300 } }

		if(order.type != 1) return { failure : { msg : 'This is not an order that can be picked up in person.' , code : 300 } }
		if(order.setup.status != 51) return { failure : { msg : 'This is not an order that can be processed.' , code : 300 } }
		// if(order.key != data.key && data.key != 'test') return { failure : { msg : 'Incorrect key.' , code : 300 } }
		if(order.buying.id != this._s.entity.object.profile.id()) return { failure : { msg : 'This order is not being confirmed by the same entity that authorized it - therefore the payment cannot be completed.' , code : 300 } }

		var listing = yield this._s.library('listings').get(order.listing);
		if(!listing) return { failure : { msg: 'This listing is not a valid listing anymore.' , code : 300 } }

		if(listing.setup.active == 0){
			if(listing.setup.status != 3) return { failure : { msg : 'This listing is not an active listing.' , code : 300 } }
			}

		// now let's capture the transaction
		// it has to be the first transaction in the order

		// let's capture the payment information
		var _financials = this._s.engine('financials');
		var charge = yield _financials.charge.capture.processed({
			transaction : order.transactions[order.transactions.length -1]
			})

		if(charge.failure) return charge;
		else charge = charge.success.data
		if(charge.setup.status != 1) return { failure : { msg : 'The transaction failed. ( Error: '+ charge.transactions[0].failure + ' )' , code : 300 } }

		order.transactions.push(charge.id);

		var transfer = yield _financials.transfer.new({
			to : order.selling.id,
			amount: charge.amounts.processed / 1.03		//  this amount because of the fee
			})

		if(transfer.failure){
			order.setup.status = 54;
			}
		else{
			transfer = transfer.success.data;

			if(transfer.setup.status!=1){
				order.setup.status = 54;
				order.transactions.push(transfer.id)
				}
			else{
				order.setup.status = 53;
				order.transactions.push(transfer.id)
				}
			}

		// now we check and see whether we have any other quantity left for this listing
		if(listing.quantity == 0){
			listing.setup.active = 0;
			listing.setup.status = 3;
			}

		order.process_history = {
			location : this._s.loc.active.get(),
			added : this._s.dt.now.datetime()
			}


		yield this._s.engine('notifications').new.push({
			entity : order.selling.id,
			type : "205",
			title : order.buying.name + " just paid you for " + listing.title,
			body : order.buying.name + " just completed the transaction for their purchase of " + listing.title + "!",
			data : {
				order : data.id,
				image : {
					type : 'entity',
					data : order.buying.id
					}
				},
			add : true
			})
			


		yield this._s.common.update(listing,'listings',false);
		var t = yield this._s.common.update(order,'orders',false);
		if(t.failure) return t;
		return { success : { data : { setup :order.setup } } }
		},
	'order/receipt/history' : function*(){
		var _listings = this._s.library('listings');
		var _orders = this._s.library('orders');
		var data = this._s.req.validate({
			id : { v:['isListingOrder'] }
			})
		if(data.failure) return data;

		var order = yield _orders.get({
			id : data.id,
			include : 'buying,type,listing,price,quantity,setup,location,receipt,process_history'
			});
		if(!order) return { failure : { msg : 'There is not a valid order matching that key.' , code : 300 } }

		// now that we have an order with a valid key, we check the order and listing
		if(order.type != 1) return { failure : { msg : 'This is not an order that can be picked up in person.' , code : 300 } }
		if(order.setup.status != 53 && order.setup.status != 54) return { failure : { msg : 'This is not an order that has been processed successfully.' , code : 300 } }

		// now let's make sure that the person trying to check the receipt information is the same as the one who started the listing
		var listing = yield this._s.library('listings').get(order.listing);
		if(!listing) return { failure : { msg: 'This listing is not a valid listing anymore.' , code : 300 } }

		if(listing.setup.active == 0){
			if(listing.setup.status != 3) return { failure : { msg : 'This listing is not an active listing.' , code : 300 } }
			}

		if(listing.entity.id != this._s.entity.object.profile.id()) return { failure : { msg : 'This listing is not being checked by the same entity that listed it - therefore the payment cannot be completed.' , code : 300 } }

		// now we also pull back the user and show their full info
		order.receipt.history = yield this._s.util.convert.multiple({data:order.receipt.history, label:true });
		order.process_history = yield this._s.util.convert.single({data:order.process_history, label:true });

		var full_entity = yield this._s.library(order.buying.type).get(order.buying.id)
		if(!full_entity || full_entity.setup.active != 1) return { failure : { msg : 'This user is invalid.' , code : 300 } }

		return {  
			success : { 
				data : { 
					entity : {
						id : full_entity.id,
						name : full_entity.name
						},
					order : yield this._s.util.convert.single({data:order, label:true , library : 'orders'}),
					listing : yield this._s.library('listings').helpers.convert(listing)
					}
				}
			}

		},
	'order/receipt/scan' : function*(){
		var _listings = this._s.library('listings');
		var _orders = this._s.library('orders');
		var data = this._s.req.validate({
			key : { v:['isListingKey'] }
			})
		if(data.failure) return data;

		var order = yield _orders.get({
			key : data.key,
			include : 'buying,type,listing,price,price_shown,quantity,setup,location,receipt,process_history'
			});
		if(!order || order.counter != 1) return { failure : { msg : 'There is not a valid order matching that key.' , code : 300 } }
		else {
			order.data[0].data.id = order.data[0].id,
			order = order.data[0].data
			}

		// now that we have an order with a valid key, we check the order and listing
		if(order.type != 1) return { failure : { msg : 'This is not an order that can be picked up in person.' , code : 300 } }

		if(order.setup.status != 53 && order.setup.status != 54) return { failure : { msg : 'This is not an order that has been processed successfully.' , code : 300 } }

		// now let's make sure that the person trying to check the receipt information is the same as the one who started the listing
		var listing = yield this._s.library('listings').get(order.listing);
		if(!listing) return { failure : { msg: 'This listing is not a valid listing anymore.' , code : 300 } }

		if(listing.setup.active == 0){
			if(listing.setup.status != 3) return { failure : { msg : 'This listing is not an active listing.' , code : 300 } }
			}

		if(listing.entity.id != this._s.entity.object.profile.id()) return { failure : { msg : 'This listing is not being checked by the same entity that listed it - therefore the payment cannot be completed.' , code : 300 } }

		// now we add this check to the order
		if(!order.receipt){
			order.receipt = {
				history : [{
					user : this._s.t1.helpers.data.document(),
					entity : this._s.entity.object.helpers.data.document(),
					added : this._s.dt.now.datetime()
					}]
				}
			}
		else{
			order.receipt.history.push({
				user : this._s.t1.helpers.data.document(),
				entity : this._s.entity.object.helpers.data.document(),
				added : this._s.dt.now.datetime()
				})
			}

		var t = yield this._s.common.update(order,'orders',false);
		if(t.failure) return t;
		else t = t.success.data

		// now we also pull back the user and show their full info
		order.receipt.history = yield this._s.util.convert.multiple({data:t.receipt.history, label:true });
		order.process_history = yield this._s.util.convert.single({data:order.process_history, label:true });

		var full_entity = yield this._s.library(order.buying.type).get(order.buying.id)
		if(!full_entity || full_entity.setup.active != 1) return { failure : { msg : 'This user is invalid.' , code : 300 } }


		return {  
			success : { 
				data : { 
					entity : {
						id : full_entity.id,
						name : full_entity.name
						},
					order : t,
					listing : yield this._s.library('listings').helpers.convert(listing)
					}
				}
			}

		},
	'order/cancel' : function*(){
		var _listings = this._s.library('listings');
		var _orders = this._s.library('orders');
		var data = this._s.req.validate({
			id : { v:['isListingOrder'] }
			})
		if(data.failure) return data;
		var order = yield _orders.get(data)
		
		if(!order) return { failure : { msg : 'This is not a valid listing order.' , code : 300 } }
		if(order.type != 1) return { failure : { msg : 'This is not an order that can be picked up in person.' , code : 300 } }
		if(order.setup.status != 51) return { failure : { msg : 'This is not an order that can be cancelled.' , code : 300 } }

		// make sure that it's either the buyer or the seller
		if(order.buying.id!=this._s.entity.object.profile.id() && order.selling.id != this._s.entity.object.profile.id() ) return { failure : { msg : 'This order is not being cancelled by an authorized user.' , code : 300 } }
		
		var t = yield _orders.actions.listing.cancel.single({order : order});
		if(t.failure) return t

		// just add the listing quantity back
		var listing = yield this._s.library('listings').get(order.listing);
		listing.quantity += order.quantity

		if(listing.setup.active == 0 && listing.setup.status == 3){
			// reactivate listing
			listing.setup.active = 1
			listing.setup.status = 1

			}

		var y = yield this._s.common.update(listing,'listings',false)
		if(y.failure) return y

		if(this._s.entity.object.notifications.push){

			yield this._s.engine('notifications').new.push({
				entity : (order.buying.id==this._s.entity.object.profile.id()?order.selling.id:order.buying.id),
				type : (order.buying.id==this._s.entity.object.profile.id()?"201":"301"),
				title : "Reservation Cancelled",
				body : this._s.entity.object.profile.name()  + " cancelled a reservation for " + listing.title,
				data : {
					order : data.id,
					listing: listing.id,
					image : {
						type : 'listing',
						data : listing.images[0]
						}
					},
				add : true
				})
			}

		return { success : { data : { setup :order.setup , cancelled : order.cancelled } } }
		},
	'video/started' : function*(){
		var _listings = this._s.library('listings');
		var data = this._s.req.validate({
			id : { v:['isListing'] },
			key : { v:['isAlphaOrNumeric'] }
			})
		if(data.failure) return data;
		var listing = yield this._s.library('listings').get(data);
		if(!listing) return { failure : { msg: 'This listing is not a valid listing anymore.' , code : 300 } }

		var pushes_sent = []
		var self = this;
		var _notifications = self._s.engine('notifications')

		data.image = {
			data : listing.images[0],
			type : 'listing'
			}

		if(listing.favorites){

			yield self._s.util.each(listing.favorites, function*(d,i){

				pushes_sent.push(d.id)

				yield _notifications.new.push({
					entity : d.id,
					type : "500",
					title : "Listing video is now live!",
					body : listing.entity.name + " is now showing a live demo for " + listing.title + ". Tap here to watch it now!",
					data : data,
					add : true
					})
					
				})
			}

		// now we also want to get the seller info and send pushes to all their followers
		var result = yield this._s.library((listing.entity.type?listing.entity.type:'t1')).get(listing.entity.id);
		if(!result) return { failure : { msg : 'This is not a valid entity.' , code : 300 } }
		if(!result.follows) return { success : true }
 		
		yield self._s.util.each(result.follows, function*(d,i){

			// only send the push if we didn't just send the push for the listing

			if(self._s.util.indexOf(pushes_sent, d.id) == -1){

				yield _notifications.new.push({
					entity : d.id,
					type : "501",
					title : "Listing video is now live!",
					body : listing.entity.name + " is now showing a live demo for " + listing.title + ". Tap here to watch it now!",
					data : data,
					add : true
					})

				}
				
			})

		return {  success : { data : true } }
		},
	favorite : function*(){
		var _listings = this._s.library('listings');
		var data = this._s.req.validate({
			id : {v:['isListing']},
			add : { in:[true,false] , b:true },
			push : { in : [true,false] , b:true }
			});
		if(data.failure) return data;

		var listing = yield this._s.library('listings').get(data.id);
		if(!listing) return { failure : { msg: 'This listing is not a valid listing anymore.' , code : 300 } }
		if(listing.setup.active != 1) return { failure : { msg : 'This listing is not an active listing.' , code : 300 } }
		
		if(!listing.favorites) listing.favorites = []

		var self = this
		var _notifications = self._s.engine('notifications')


		var t = this._s.util.array.find.object(listing.favorites, "id", this._s.entity.object.profile.id(), true)

		if(!t && data.add){
			listing.favorites.push(this._s.entity.object.helpers.data.document())

			if(data.push){
				yield _notifications.new.push({
					entity : listing.entity.id,
					type : "602",
					title : self._s.entity.object.profile.name()  + " favorited your item!",
					body : self._s.entity.object.profile.name() + " favorited your listing for "+ listing.title+ ". Go live to show them a demo of the product!",
					data : {
						id : data.id,
						title : listing.title,
						quantity : listing.quantity,
						price : listing.price,
						image : {
							data : listing.images[0],
							type : 'listing'
							},
						lat : listing.location.coordinates.lat,
						lon : listing.location.coordinates.lon
						},
					add : true
					})
				}
			}
		else if(t && !data.add){
			listing.favorites.splice(t.index, 1)
			}
		var u = yield this._s.common.update(listing,'listings',false);
		if(u.failure) return u
		return { success : { data : true } }
		},
	flag : function*(){
		var _listings = this._s.library('listings');
		var data = this._s.req.validate({
			id : {v:['isListing']},
			push : { in : [true,false] , b:true }
			});
		if(data.failure) return data;

		var listing = yield this._s.library('listings').get(data.id);
		if(!listing) return { failure : { msg: 'This listing is not a valid listing anymore.' , code : 300 } }
		if(listing.setup.active != 1) return { failure : { msg : 'This listing is not an active listing.' , code : 300 } }
		
		if(!listing.flags) listing.flags = { entities:[] , counter:0 }
		var t = this._s.util.array.find.object(listing.flags.entities, "id", this._s.entity.object.profile.id(), true)

		if(!t){
			listing.flags.entities.push(this._s.entity.object.helpers.data.document())
			}

		listing.flags.counter++

		var u = yield this._s.common.update(listing,'listings',false);
		if(u.failure) return u

		var self = this
		var _notifications = self._s.engine('notifications')

		if(data.push){
			yield _notifications.new.push({
				entity : listing.entity.id,
				type : "220",
				title : "Your listing was flagged!",
				body : "Your listing titled " + listing.title + " was flagged. It seems someone found the content inappropriate or not conducive to our policies. Please make any changes that you feel are relevant - we will be reviewing this listing soon. If the listing is found to be inappropriate, it may be disabled.",
				data : {
					id : data.id,
					title : listing.title,
					image : {
						data : listing.images[0],
						type : 'listing'
						}
					},
				add : true
				})
			}

		return { success : { data : true } }

		}
 	}