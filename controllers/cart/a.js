
var _cart = _s_load.engine('cart');

module.exports = {
	get : function*(){
		var r = yield _cart.get.all(true);
		if(!r || r.failure) return { failure : r.failure||{ msg : 'You have no items in your cart.' , code :300 } }
		if(r) return {success : { data : r } };
		return { failure : { msg : 'You have no items in your cart.' , code : 300 } }
		},
	total : function*(){
		var r = yield _cart.totals.total();
		if(r) return { success : { data : r } }
		return { failure : { msg : 'There is no cart total set.' , code : 300 } }
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
	calculate : function*(){
		var r = yield _cart.get.all();
		if(!r) return { failure : { msg : 'You have no orders in your cart.' , code : 300 } };

		// now we calculate
		r = yield _cart.calculate(r);
		if(!r||r.failure) return  { failure : r.failure || { msg : 'There were no calculations made.' , code : 300 } }
		return { success : { data : r } }
		},
	'order/get' : function*(){
		var data = _s_req.post('seller');
		if(!data) return { failure : { msg : 'No seller information was submitted.' , code : 300 } }
		var r = yield _cart.get.order(data);
		if(r) return {success : { data : r } };
		return { failure : { msg : 'You have no items in your cart by this seller.' , code : 300 } }
		},
	'order/shipping/get' : function*(){
		var data = _s_req.validate({
			seller : { v: ['isAlphaOrNumeric'] },
			recipient : {
				json : true,
				data : {
					name : { v:['isAlphaOrNumeric'], b:true, default : 'Sellyx Customer' },
					address : {
						json : true,
						data : {
							street1 : { v:['isStreet'] , b:true },
							street2 : { v:['isStreet'] , b:true },
							city : { v:['isCity'] , b:true },
							state : { v:['isAlphaOrNumeric'] , b:true },
							postal : { v:['isPostal'] , b:true, default : _s_countries.active.get() },
							country : { v:['isCountry'] , b:true, default : _s_countries.active.postal.get() }
							}
						}
					}
				}
			})
		if(data.failure) return data;

		data.order = yield _cart.get.order(data.seller);
		if(!data.order) return { failure : { msg : 'There was no order that corresponded to this seller in this cart.' , code: 300 } }
		
		var options = yield _s_load.library('shipping').calculate(data)
		if(options.failure||!options) return {failure:options.failure||{msg:'Rates could not be retrieved for this shipment.' , code:300} }
		
		yield _cart.items.update.shipping.options({ seller : data.seller, options : options })
		return {success : { data : options} };
		},
	'order/shipping/save' : function*(){
		var data = _s_req.validate({
			send : { v:['isJSON'] },
			seller : { v:['isAlphaOrNumeric'] }
			})

		if(data.failure) return data;
		var r = yield _cart.items.update.shipping.save(data);

		if(!r || r.failure) return { failure : r.failure|| { msg : 'There was an error in updating the cart.' , code: 300 } }
		return { success : { msg : 'Shipping Saved!' , code : 300 } };
		return
		},
	'item/add' : function*(){

		var data = _s_req.validate({
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

		var data = _s_req.validate({
			listing : {v:['isListing']},
			product : {v:['isProduct']},
			quantity : {v:['isInt'] , b:true}
			});

		if(data.failure) return data;
		var r = yield _cart.items.update.quantity(data);
		
		if(!r || r.failure) return { failure : r.failure||{ msg : 'There was an error in updating the quantity of the cart.' , code: 300 } }
		return { success : { msg : 'Quantity Updated!' , code : 300 } };
		},
	'item/waive' : function*(){
		var data = _s_req.validate({
			listing : {v:['isListing']},
			product : {v:['isProduct']},
			type : { in:[1,2,'1','2'] }
			})

		if(data.failure) return data;
		var r = yield _cart.items.update.waive(data);

		if(!r || r.failure) return { failure : r.failure|| { msg : 'There was an error in updating the cart.' , code: 300 } }
		return { success : { msg : 'Return Settings Applied!' , code : 300 } };
		},
	'item/notes' : function*(){
		var data = _s_req.validate({
			listing : {v:['isListing']},
			product : {v:['isProduct']},
			notes : {v:['isTextarea'] , b:true}
			});

		if(data.failure) return data;
		var r = yield _cart.items.update.notes(data);

		if(!r || r.failure) return { failure : r.failure|| { msg : 'There was an error in updating the cart.' , code: 300 } }
		return { success : { msg : 'Notes Updated!' , code : 300 } };
		},

	}