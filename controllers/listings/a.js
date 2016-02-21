var _listings = _s_load.library('listings');
var _orders = _s_load.library('orders');


module.exports = {
	get : function*(){
		var data = _s_req.validate(_listings.helpers.filters());
		if(data.failure) return data;

		data.entity = _s_entity.object.profile.id();
		delete data.distance;
		delete data.type;
		delete data.active;
		data.endpoint = true;

		return yield _listings.get(data);
		},
	new : function*(){
		return yield _listings.new();
		},
	status : function*(){
		return yield _listings.actions.status();
		},
	update : function*(){
		return yield _listings.update();
		},
	'interest/status' : function*(){
		
		var data = _s_req.validate({
			id : {v:['isListing']},
			extra : { v:['isAlphaOrNumeric'] },
			status : { in:['3','4',3,4] }
			});
		if(data.failure) return data;
			
		return yield _s_common.check({
			id : data.id,
			library : 'listings',
			entity : {
				id : _s_entity.object.profile.id(),
				target : true
				},
			label : 'listing', 
			status : {
				allowed : [1,'1']
				},
			deep : {
				array : 'interests',
				property : 'interest',
				value : data.extra,
				status : {
					allowed : [1,'1'],
					change : data.status
					}
				}
			});
		},
	'interest/message' : function*(){
		return yield _listings.actions.message({ type : 2 });
		},
	'orders/get/selling' : function*(){
		var c = _orders.helpers.filters();
		var data = _s_req.validate(c);
		if(data.failure) return data;

		data.selling = _s_entity.object.profile.id();
		data.exclude = 'transactions,key';
		data.endpoint = true;
		data.type = 1

		if(data.full && data.full == 'true') data.full = [{ key : 'listing', index : 'listings' , get : 'common' , obj : { include : 'title,price,images,type,location,setup.status,setup.active' , convert : 'true' } }];


		return yield _orders.get(data);
		},
	'orders/get/selling/count' : function*(){
		var c = _orders.helpers.filters();
		var data = _s_req.validate(c);
		if(data.failure) return data;

		data.selling = _s_entity.object.profile.id();
		data.exclude = 'transactions,key';
		data.count = true;
		data.endpoint = true;
		data.status = 51;
		data.type = 1

		return yield _orders.get(data);
		},
	'orders/get/buying' : function*(){
		var c = _orders.helpers.filters();
		var data = _s_req.validate(c);
		if(data.failure) return data;

		data.buying = _s_entity.object.profile.id();
		data.exclude = 'transactions';
		data.endpoint = true;
		data.type = 1;
	
		if(data.full && data.full == 'true') data.full = [{ key : 'listing', index : 'listings' , get : 'common' , obj : { include : 'title,price,images,type,location,setup.status,setup.active' , convert : 'true' } }];

		return yield _orders.get(data);
		},
	'orders/get/buying/count' : function*(){
		var c = _orders.helpers.filters();
		var data = _s_req.validate(c);
		if(data.failure) return data;

		data.buying = _s_entity.object.profile.id();
		data.exclude = 'transactions';
		data.count = true;
		data.endpoint = true;
		data.status = 51;
		data.type = 1

		return yield _orders.get(data);
		},
	
	'order/authorize' : function*(){
		var data = _s_req.validate({
			id : { v:['isListing'] },
			price : { v:['isPrice'] , b:true },						// this is the offer, only accepted if its negotiable
			quantity : { v:['isInt'] , default : 1, b:true},
			transactions : { v:['isArrayOfObjects'] }
			})
		if(data.failure) return data;
		if(data.transactions.length > 1) return { failure : { msg : 'At this time, Sellyx only supports payment with one method.' , code : 300 } }

		// let's first pull up the listing
		var _listings = _s_load.library('listings');

		var listing = yield _listings.get(data.id);

		if(!listing) return { failure : { msg : 'The listing was not found.' , code :300 } }
		if(listing.setup.active == 0) return  { failure : { msg : 'This is not a valid or active listing.' , code : 300 } }

		// now let's check the listing payment
		if(listing.payment_type == 2) return { failure : { msg : 'This listing cannot be purchased through Sellyx.' , code : 300 } }
		if(listing.quantity < data.quantity) return { failure : { msg : 'This listing does not have enough quantity available for purchase at this time.' , code : 300 } }
		if(listing.quantity_mpo < data.quantity) return { failure : { msg : 'This seller does not allow for the purchase of more than ' + listing.quantity_mpo + ' item(s) in one order.' , code : 300 } }

		// now let's see what the price needs to be
		if(listing.p_type == 1 && data.price != listing.price) return { failure : { msg : 'This is not a negotiable item, therefore there can not be an offer amount.' , code : 300 } }
		var price = listing.p_type == 1 ? parseFloat(listing.price) * parseInt(data.quantity) : (data.price?data.price:listing.price) * parseInt(data.quantity)

		var charge_now = (listing.p_type == 1 ? true : (  data.price >= listing.price ? true : false  ) )
		var func = (charge_now?'charge':'authorize')
		var charge = yield _s_load.engine('financials')[func].new({
			amount : price,
			transactions : data.transactions
			})

		if(charge.failure) return charge;
		else charge = charge.success.data
		if(charge.setup.status != 1) return { failure : { msg : 'The transaction failed. ( Error: '+ charge.transactions[0].failure + ' )' , code : 300 } }

		var crpyto = require('crypto');
		var start =  Math.random().toString(36).slice(2) + _s_entity.object.profile.id();
		var key = crpyto.createHash('md5').update(start).digest('hex');

		var order = {
			buying : _s_entity.object.helpers.data.document(),
			selling : listing.entity,
			location : _s_loc.active.get(),
			type : 1,
			listing : data.id,
			price : price,
			quantity : data.quantity,
			transactions : [charge.id],
			key : key,
			setup : {
				active : 1,
				status : (charge_now?51:58),
				added : _s_dt.now.datetime()
				}
			}

		var r = yield _s_common.new(order,'orders',false)
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

		yield _s_common.update(listing, 'listings', false);

		// send push notification to seller
		// yield _s_load.engine('notifications').new.push({
		// 	entity : _s_entity.object.profile.id(),
			
		// 	})
		// send email notification

		return r;
		},
	'order/obo': function*(){
		var data = _s_req.validate({
			id : { v:['isListingOrder'] },
			approve : { in:[true,false] }
			})
		if(data.failure) return data;

		var order = yield _orders.get(data);
		if(!order) return { failure : { msg : 'This is not a valid listing order.' , code : 300 } }

		if(order.type != 1) return { failure : { msg : 'This is not an order that can be picked up in person.' , code : 300 } }
		if(order.setup.status != 58 && order.setup.status != 60) return { failure : { msg : 'This is not an OBO order that can be accepted or denied.' , code : 300 } }

		// now let's make sure that the person trying to confirm the obo order is the same as the one who started the listing
		var listing = yield _s_load.library('listings').get(order.listing);
		if(!listing) return { failure : { msg: 'This listing is not a valid listing anymore.' , code : 300 } }
		if(listing.setup.active != 1) return { failure : { msg : 'This listing is not an active listing.' , code : 300 } }
		if(listing.quantity < order.quantity) return { failure : { msg : 'This listing cannot be confirmed because the total quantity available is not enough.' , code : 300 } }
		if(listing.entity.id != _s_entity.object.profile.id()) return { failure : { msg : 'This listing is not being confirmed by the same entity that listed it - therefore the payment cannot be completed.' , code : 300 } }

		// now let's see what the entity wants to do
		if(data.approve){
			// we create the charge
			var charge = yield _s_load.engine('financials').charge.capture.authorized({
				transaction : order.transactions[0]
				})

			if(charge.failure) return charge
			else charge = charge.success.data			
			if(charge.setup.status != 1) return { failure : { msg : 'At this time, this payment could not be authorized for later capture. Do you want to cancel this offer request or send a message to the customer and keep this offer active?' , code : 400 } }

			// update the order
			order.setup.status = 51
			order.transactions.push(charge.id)

			
			var r = yield _s_common.update(order, 'orders', false)
			if(r.failure) return r;

			// update the listing quantity
			listing.quantity -= order.quantity
			if(listing.quantity == 0){
				listing.setup.active = 0
				listing.setup.status = 3
				}

			yield _s_common.update(listing,'listings',false)

			// SEND PUSH NOTIFICATIONS
			return { success : { data : true } }
			}

		// simple cancel
		return yield _orders.actions.listing.cancel.single({order : order , authorized : true });
		},
	'order/obo/retry' : function*(){
		var data = _s_req.validate({
			id : { v:['isListingOrder'] }
			})
		if(data.failure) return data;

		var order = yield _orders.get(data);
		if(!order) return { failure : { msg : 'This is not a valid listing order.' , code : 300 } }

		if(order.type != 1) return { failure : { msg : 'This is not an order that can be picked up in person.' , code : 300 } }
		if(order.setup.status != 58 && order.setup.status != 60) return { failure : { msg : 'This is not a valid OBO order.' , code : 300 } }

		// now let's make sure that the person trying to confirm the obo order is the same as the one who started the listing
		var listing = yield _s_load.library('listings').get(order.listing);
		if(!listing) return { failure : { msg: 'This listing is not a valid listing anymore.' , code : 300 } }
		if(listing.setup.active != 1) return { failure : { msg : 'This listing is not an active listing.' , code : 300 } }
		if(listing.quantity < order.quantity) return { failure : { msg : 'This listing cannot be confirmed because the total quantity available is not enough.' , code : 300 } }
		if(listing.entity.id != _s_entity.object.profile.id()) return { failure : { msg : 'This listing is not being confirmed by the same entity that listed it - therefore the payment cannot be completed.' , code : 300 } }

		// update the order status to 60
		order.setup.status = 60
		var r = yield _s_common.update(order, 'orders', false)
		
		// send push notifications

		if(r.failure) return r;
		return { success : { data : true } }
		},
	'order/key/check' : function*(){
		var data = _s_req.validate({
			key : { v:['isListingKey'] }
			})
		if(data.failure) return data;

		var order = yield _orders.get({
			key : data.key,
			include : 'buying,type,listing,price,quantity,setup,location'
			});
		if(!order || order.counter != 1) return { failure : { msg : 'There is not a valid order matching that key.' , code : 300 } }
		else {
			order.data[0].data.id = order.data[0].id,
			order = order.data[0].data
			}

		// now that we have an order with a valid key, we check the order and listing
		if(order.type != 1) return { failure : { msg : 'This is not an order that can be picked up in person.' , code : 300 } }
		if(order.setup.status != 51) return { failure : { msg : 'This is not an order that can be processed.' , code : 300 } }

		// now let's make sure that the person trying to complete the order (entity) is the same as the one who started the listing
		var listing = yield _s_load.library('listings').get(order.listing);
		if(!listing) return { failure : { msg: 'This listing is not a valid listing anymore.' , code : 300 } }
		if(listing.setup.active != 1) return { failure : { msg : 'This listing is not an active listing.' , code : 300 } }
		if(listing.quantity < order.quantity) return { failure : { msg : 'This listing cannot be confirmed because the total quantity available is not enough.' , code : 300 } }
		if(listing.entity.id != _s_entity.object.profile.id()) return { failure : { msg : 'This listing is not being confirmed by the same entity that listed it - therefore the payment cannot be completed.' , code : 300 } }

		return {  
			success : { 
				data : { 
					order : yield _s_util.convert.single({data:order, label:true, library:'orders'}),
					listing : yield _s_load.library('listings').helpers.convert(listing)
					}
				}
			}

		},
	'order/process' : function*(){
		var data = _s_req.validate({
			key : { v:['isListingKey'] }
			})
		if(data.failure) return data;

		var order = yield _orders.get({
			key : data.key
			});

		if(!order || order.counter != 1) return { failure : { msg : 'This is not a valid listing order.' , code : 300 } }
		else{
			order.data[0].data.id = order.data[0].id,
			order = order.data[0].data
			}

		if(order.type != 1) return { failure : { msg : 'This is not an order that can be picked up in person.' , code : 300 } }
		if(order.setup.status != 51) return { failure : { msg : 'This is not an order that can be processed.' , code : 300 } }
		if(order.key != data.key && data.key != 'test') return { failure : { msg : 'Incorrect key.' , code : 300 } }

		// now let's make sure that the person trying to complete the order (entity) is the same as the one who started the listing
		var listing = yield _s_load.library('listings').get(order.listing);
		if(!listing) return { failure : { msg: 'This listing is not a valid listing anymore.' , code : 300 } }
		if(listing.setup.active != 1) return { failure : { msg : 'This listing is not an active listing.' , code : 300 } }
		if(listing.quantity < order.quantity) return { failure : { msg : 'This listing cannot be confirmed because the total quantity available is not enough.' , code : 300 } }
		if(listing.entity.id != _s_entity.object.profile.id()) return { failure : { msg : 'This listing is not being confirmed by the same entity that listed it - therefore the payment cannot be completed.' , code : 300 } }

		// now let's capture the transaction
		// it has to be the first transaction in the order

		// let's capture the payment information
		var _financials = _s_load.engine('financials');
		var charge = yield _financials.charge.capture.processed({
			transaction : order.transactions[order.transactions.length -1]
			})

		if(charge.failure) return charge;
		else charge = charge.success.data
		if(charge.setup.status != 1) return { failure : { msg : 'The transaction failed. ( Error: '+ charge.transactions[0].failure + ' )' , code : 300 } }

		order.transactions.push(charge.id);

		var transfer = yield _financials.transfer.new({
			to : order.selling.id,
			amount: charge.amounts.processed
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

		yield _s_common.update(listing,'listings',false);
		var t = yield _s_common.update(order,'orders',false);
		if(t.failure) return t;
		return { success : { data : true } }
		},
	'order/cancel' : function*(){
		var data = _s_req.validate({
			id : { v:['isListingOrder'] }
			})
		if(data.failure) return data;
		var order = yield _orders.get(data)
		
		if(!order) return { failure : { msg : 'This is not a valid listing order.' , code : 300 } }
		if(order.type != 1) return { failure : { msg : 'This is not an order that can be picked up in person.' , code : 300 } }
		if(order.setup.status != 51) return { failure : { msg : 'This is not an order that can be cancelled.' , code : 300 } }

		return yield _orders.actions.listing.cancel.single({order : order});
		}
	}