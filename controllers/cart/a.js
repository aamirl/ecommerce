
var _cart = this._s.library('cart');

module.exports = {
	get : function*(){
		var r = yield _cart.get.all();
		if(!r || r.failure) return { failure : r.failure||{ msg : 'You have no items in your cart.' , code :300 } }
		return {success : { data : r } };
		},
	empty : function*(){
		var r = yield _cart.empty();
		if(r) return { success : { msg : 'The cart was correctly emptied.' , code : 300 } }
		return { failure : { msg : 'The cart could not be set.' , code : 300 } }	 
		},
	count : function*(){
		var r = yield _cart.get.count();
		if(r) return { success : { data : r } }
		return { failure : { msg : 'The cart could not be set.' , code : 300 } }
		},
	'item/add' : function*(){

		var data = this._s.req.validate({
			listing : { v:['isListing'] },
			product : { v:['isProduct'] },
			quantity : { v:['isInt'] , b:true }
			})

		if(data.failure) return data;
		var r = yield _cart.items.add(data);
		
		if(!r || r.failure) return { failure : r.failure|| { msg : 'There was an error in adding the item to the cart.' , code: 300 } }
		return { success : {count : yield _cart.get.count() } };
		},
	'item/quantity' : function*(){

		var data = this._s.req.validate({
			listing : {v:['isListing']},
			product : {v:['isProduct']},
			quantity : {v:['isInt'] , b:true}
			});

		if(data.failure) return data;
		var r = yield _cart.items.update.quantity(data);
		
		if(!r || r.failure) return { failure : r.failure||{ msg : 'There was an error in updating the quantity of the cart.' , code: 300 } }
		return { success : { msg : 'Quantity Updated!' , code : 300 } };
		},
	'item/notes' : function*(){
		var data = this._s.req.validate({
			listing : {v:['isListing']},
			product : {v:['isProduct']},
			notes : {v:['isTextarea'] , b:true}
			});

		if(data.failure) return data;
		var r = yield _cart.items.update.notes(data);

		if(!r || r.failure) return { failure : r.failure|| { msg : 'There was an error in updating the cart.' , code: 300 } }
		return { success : { msg : 'Notes Updated!' , code : 300 } };
		},
	'item/waive' : function*(){
		var data = this._s.req.validate({
			listing : {v:['isListing']},
			product : {v:['isProduct']},
			waive : { in:[true,'true'] , b:true }
			})

		if(data.failure) return data;
		var r = yield _cart.items.update.waive(data);

		if(!r || r.failure) return { failure : r.failure|| { msg : 'There was an error in updating the cart.' , code: 300 } }
		return { success : { msg : 'Return Settings Applied!' , code : 300 } };
		},
	'order/get' : function*(){
		var data = this._s.req.post('seller');
		if(!data) return { failure : { msg : 'No seller information was submitted.' , code : 300 } }
		var r = yield _cart.get.order(data);
		if(r) return {success : { data : r } };
		return { failure : { msg : 'You have no items in your cart by this seller.' , code : 300 } }
		},
	'order/shipping/get' : function*(){
		var data = this._s.req.validate({
			seller : { v: ['isAlphaOrNumeric'] },
			recipient : {
				json : true,
				data : {
					name : { v:['isAlphaOrNumeric'], b:true, default : 'Sellyx Customer' },
					address : this._s.common.helpers.validators.address()
					}
				}
			})

		if(data.failure) return data;

		data.order = yield _cart.get.order(data);
		if(!data.order) return { failure : { msg : 'There was no order that corresponded to this seller in this cart.' , code: 300 } }
		
		var options = yield this._s.library('shipping').calculate(data)
		if(options.failure||!options) return {failure:options.failure||{msg:'Rates could not be retrieved for this shipment.' , code:300} }
		
		yield _cart.items.update.shipping.options({ seller : data.seller, options : options })
		return {success : { data : options} };
		},
	'order/shipping/set' : function*(){
		var data = this._s.req.validate({
			selected : { v:['isJSON'] },
			seller : { v:['isAlphaOrNumeric'] }
			})

		if(data.failure) return data;
		var r = yield _cart.items.update.shipping.save(data);

		if(!r || r.failure) return { failure : r.failure|| { msg : 'There was an error in updating the cart.' , code: 300 } }
		return { success : { msg : 'Shipping Saved!' , code : 300 } };
		return
		},
	'transition' : function*(){
		var data = this._s.req.validate({
			cart : _cart.helpers.validators.cart()
			});

		if(data.failure) return data;
		try{
			yield this._s.cache.key.set('cart',data.cart);
			return { success : true }
			} 
		catch(err){ return { failure : {msg:'The cart was not saved.' , code : 300 } } }
		},
	calculate : function*(){
		// now we calculate
		var r = yield _cart.calculate(r);
		if(!r||r.failure) return  { failure : r.failure || { msg : 'There were no calculations made.' , code : 300 } }
		return { success : { data : r } }
		},
	total : function*(){
		var r = yield _cart.totals.total();
		if(!r) return { failure : { msg : 'There is no cart total set.' , code : 300 } }
		return { success : { data : this._s.currency.convert.objectify(r) } }
		},
	complete : function*(){
		// this is a special function only for the cart
		// we need the charge information only

		var data = this._s.req.validate({
			transaction : { v:['isJSON'] , b:true },
			name : { v:['isAlphaOrNumeric'], b:true, default : 'Sellyx Customer' },
			gift : { v:['true',true] , b:true },
			address : this._s.common.helpers.validators.address({countryless:true})
			});
		if(data.failure) return data;

		var r = yield _cart.separate(data);

		if(!r || r.failure) return { failure : r.failure|| { msg : 'There was an error in updating the cart.' , code: 300 } }
		
		// then we create orders here for each one



		return { success : r }
		}
	}