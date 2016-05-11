module.exports = function(){  return new Controller(); }

function Controller(){}
Controller.prototype = {
	get : function*(){
		var _listings = this._s.library('listings');
		var _orders = this._s.library('orders');

		var data = this._s.req.validate(_listings.helpers.filters());
		if(data.failure) return data;

		// todo
		// make corporate endpoints		
		data.endpoint = true;
		data.active 

		return yield _listings.get(data);
		},
	'orders/get/selling' : function*(){
		var _orders = this._s.library('orders');

		var c = _orders.helpers.filters();
		var data = this._s.req.validate(c);
		if(data.failure) return data;

		data.exclude = 'transactions,key';
		data.endpoint = true;
		data.type = 1

		if(data.full && data.full == 'true') data.full = [{ key : 'listing', index : 'listings' , get : 'common' , obj : { include : 'title,price,images,type,location,setup.status,setup.active' , convert : 'true' } }];


		return yield _orders.get(data);
		},
	status : function*(){
		var _listings = this._s.library('listings');
		
		return yield _listings.actions.status({corporate:true});
		},
	update : function*(){
		var _listings = this._s.library('listings');
		
		return yield _listings.update({corporate:true});
		},
	'orders/get' : function*(){
		var _orders = this._s.library('orders');

		var c = _orders.helpers.filters();
		var data = this._s.req.validate(c);
		if(data.failure) return data;

		if(this._s.req.post('buying')) data.buying = this._s.req.post('buying')
		if(this._s.req.post('selling')) data.selling = this._s.req.post('selling')


		data.endpoint = true;
		data.type = 1

		if(data.full && data.full == 'true') data.full = [{ key : 'listing', index : 'listings' , get : 'common' , obj : { include : 'title,price,images,type,location,setup.status,setup.active' , convert : 'true' } }];

		return yield _orders.get(data);
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
		
		// now let's make sure that the person trying to complete the order (entity) is the same as the one who started the listing
		var listing = yield this._s.library('listings').get(order.listing);
		if(!listing) return { failure : { msg: 'This listing is not a valid listing anymore.' , code : 300 } }
		if(listing.setup.active != 1) return { failure : { msg : 'This listing is not an active listing.' , code : 300 } }
		if(listing.quantity < order.quantity) return { failure : { msg : 'This listing cannot be confirmed because the total quantity available is not enough.' , code : 300 } }
		
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

		yield this._s.common.update(listing,'listings',false);
		var t = yield this._s.common.update(order,'orders',false);
		if(t.failure) return t;
		return { success : { data : true } }
		},
	'order/cancel' : function*(){
		var _orders = this._s.library('orders');

		var data = this._s.req.validate({
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