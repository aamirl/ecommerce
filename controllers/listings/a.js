var _listings = _s_load.library('listings');
var _orders = _s_load.library('orders');


module.exports = {
	get : function*(){
		var data = _s_req.validate(_listings.helpers.filters());
		if(data.failure) return data;

		data.entity = _s_entity.object.profile.id();
		delete data.distance;
		delete data.type;
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
	'decision/status' : function*(){
		
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
	message : function*(){
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

		return yield _orders.get(data);
		},
	'orders/get/buying' : function*(){
		var c = _orders.helpers.filters();
		var data = _s_req.validate(c);
		if(data.failure) return data;

		data.buying = _s_entity.object.profile.id();
		data.exclude = 'transactions';
		data.endpoint = true;
		data.type = 1

		return yield _orders.get(data);
		},
	'order/authorize' : function*(){
		var data = _s_req.validate({
			id : { v:['isListing'] },
			quantity : { v:['isInt'] , default : 1, b:true},
			price : { v:['isPrice'] , b:true },
			transactions : { v:['isArrayOfObjects'] }
			})
		if(data.failure) return data;
		if(data.transactions.length > 1) return { failure : { msg : 'At this time, Sellyx only supports payment with one method.' , code : 300 } }


		// let's first pull up the listing
		var _listings = _s_load.library('listings');

		var result = yield _listings.get(data.id);
		if(!result) return { failure : { msg : 'The listing was not found.' , code :300 } }
		if(result.setup.active == 0) return  { failure : { msg : 'This is not a valid or active listing.' , code : 300 } }

		// now let's check the listing payment
		if(result.payment_type == 2) return { failure : { msg : 'This listing cannot be purchased through Sellyx.' , code : 300 } }
		if(result.quantity < data.quantity) return { failure : { msg : 'This listing does not have enough quantity available for purchase at this time.' , code : 300 } }
		if(result.quantity_mpo < data.quantity) return { failure : { msg : 'This seller does not allow for the purchase of more than ' + result.quantity_mpo + ' item(s) in one order.' , code : 300 } }
		if(data.price > result.price) return { failure : { msg : "At this time, you cannot denote a larger price than what the item was listed for.", code : 300 } }

		// now let's see what the price needs to be
		var price = parseFloat(data.price?data.price:result.price) * parseInt(data.quantity);

		_s_u.each(data.transactions, function(transaction, i){
			data.transactions[i].capture = "false";
			})

		// let's charge the payment information
		var charge = yield _s_req.http({
			url : _s_config.financials + 'charges/p/new',
			method : 'POST',
			data : {
				account : _s_t1.profile.id(),
				total : price,
				transactions : data.transactions
				}
			})

		if(charge.failure) return charge;
		if(charge.amounts.total != charge.amounts.authorized) return { failure : { msg : 'The transaction failed. Please look at the following transaction messages.' , code : 300, data : charge.transactions[0].error } }


		// if no problem we create the order!

		var order = {
			buying : _s_entity.object.helpers.data.document(),
			selling : result.entity,
			location : _s_loc.active.get(),
			type : 1,
			listing : data.id,
			price : price,
			quantity : data.quantity,
			transactions : [charge.id],
			key : Math.random().toString(36).slice(2),
			setup : {
				active : 1,
				status : 51,
				added : _s_dt.now.datetime()
				}
			}

		var r = yield _s_common.new(order,'orders',false)
		if(r.failure) return r;

		// now we add the order to the listing
		result.orders.push(r.success.id);
		var update = yield _s_common.update(result, 'listings', false);
		return r;
		},
	'order/process' : function*(){
		var data = _s_req.validate({
			id : { v:['isListingOrder'] },
			key : { v:['isListingKey'] }
			})
		if(data.failure) return data;

		var order = yield _orders.get(data);
		if(!order) return { failure : { msg : 'This is not a valid listing order.' , code : 300 } }

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
		var capture = yield _s_req.http({
			url : _s_config.financials + 'charges/p/capture',
			method : 'POST',
			data : {
				id : order.transactions[0]
				}
			})

		if(capture.failure) return capture;
		if(capture.amounts.total != capture.amounts.processed) return { failure : { msg : 'The transaction failed. Please look at the following transaction messages.' , code : 300, data : capture.transactions[0].error } }

		order.transactions.push(capture.id);

		// next we then transfer money to the seller account which is the same thing as loading their account
		var transfer = yield _s_req.http({
			url : _s_config.financials + 'load/p/new',
			method : 'POST',
			data : {
				account : order.selling.id,
				amount : capture.amounts.total
				}
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

		// now we negate the order quantity first from the listing
		listing.quantity -= order.quantity;

		var run = function*(){
			var get = yield _orders.get({ listing : listing.id , status : 51 , quantity : listing.quantity });
			
			if(get){
				// update the quantity
				if(get.counter){
					yield _s_util.each(get.data, function*(o,i){
						if(o.id == order.id) return;
						o.data.id = o.id;
						yield _orders.actions.listing.cancel(o.data,56,57);
						})
					}
				else{
					if(get.id != order.id){
						yield _orders.actions.listing.cancel(get,56,57);
						}
					}
				}
			}

		// now we check and see whether we have any other quantity left for this listing
		if(listing.quantity == 0){
			listing.setup.active = 0;
			listing.setup.status = 3;
			}

		yield run();
		yield _s_common.update(listing,'listings',false);
		return yield _s_common.update(order,'orders',false);
		},
	'order/cancel' : function*(){
		var data = _s_req.validate({
			id : { v:['isListingOrder'] }
			})
		if(data.failure) return data;
		var order = yield _orders.get(data)
		
		if(!order) return { failure : { msg : 'This is not a valid listing order.' , code : 300 } }
		if(order.type != 1) return { failure : { msg : 'This is not an order that can be picked up in person.' , code : 300 } }
		if(order.setup.status != 51 && order.setup.status != 55) return { failure : { msg : 'This is not an order that can be processed.' , code : 300 } }

		return yield _orders.actions.listing.cancel(order);
		}
	}