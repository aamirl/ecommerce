
var _cart = _s_load.engine('cart');

module.exports = {
	get : function*(){
		var data = _s_req.validate({cart:{v:['isJSON']}})
		if(data.failure) return data;

		var r = yield _cart.get.all(data);
		if(!r || r.failure) return { failure : r.failure||{ msg : 'There was an error getting details for your cart.' , code :300 } }
		return {success : { data : r } };
		},
	empty : function*(){
		return {success: {data:yield _cart.empty(true) }};
		},
	count : function*(){
		var r = yield _cart.get.count();
		if(r) return { success : { data : r } }
		return { failure : { msg : 'The cart could not be set.' , code : 300 } }
		},
	'item/add' : function*(){

		var data = _s_req.validate({
			cart : _cart.helpers.validators.cart(),
			listing : { v:['isListing'] },
			product : { v:['isProduct'] },
			quantity : { v:['isInt'] , b:true }
			})

		if(data.failure) return data;
		var r = yield _cart.items.add(data);
		
		if(!r || r.failure) return { failure : r.failure|| { msg : 'There was an error in adding the item to the cart.' , code: 300 } }
		return { success : { data : r} };
		},
	'item/quantity' : function*(){
		var data = _s_req.validate({
			cart : _cart.helpers.validators.cart(),
			listing : {v:['isListing']},
			product : {v:['isProduct']},
			quantity : {v:['isInt'] , b:true}
			});

		if(data.failure) return data;
		var r = yield _cart.items.update.quantity(data);
		
		if(!r || r.failure) return { failure : r.failure||{ msg : 'There was an error in updating the quantity of the cart.' , code: 300 } }
		return { success : { data : r } };
		},
	'item/notes' : function*(){
		var data = _s_req.validate({
			cart : _cart.helpers.validators.cart(),
			listing : {v:['isListing']},
			product : {v:['isProduct']},
			notes : {v:['isTextarea'] , b:true}
			});

		if(data.failure) return data;
		var r = yield _cart.items.update.notes(data);

		if(!r || r.failure) return { failure : r.failure|| { msg : 'There was an error in updating the cart.' , code: 300 } }
		return { success : {data:r} };
		},
	'item/waive' : function*(){
		var data = _s_req.validate({
			cart : _cart.helpers.validators.cart(),
			listing : {v:['isListing']},
			product : {v:['isProduct']},
			waive : { in:[true,'true'] , b:true }
			})

		if(data.failure) return data;
		var r = yield _cart.items.update.waive(data);

		if(!r || r.failure) return { failure : r.failure|| { msg : 'There was an error in updating the cart.' , code: 300 } }
		return { success : {data:r} };
		},
	}