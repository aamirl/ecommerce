
var _cart = _s_load.library('cart');

module.exports = {
	all : function*(){
		return { success : _cart.get.all() } ;
		},
	count : function*(){
		return { success : _cart.get.count() } ;
		},
	add : function*(){

		var data = _s_req.validate({
			listing : { v:['isListing'] },
			product : { v:['isProduct'] },
			quantity : { v:['isInt'] , b:true }
			})

		if(data.failure) return data;
		return yield _cart.items.add(data);
		},
	delete : function*(){

		var data = _s_req.validate({
			listing : { v:['isListing'] },
			product : { v:['isProduct'] },
			seller : { v:['isAlphaOrNumeric'] }
			})

		if(data.failure) return data;
		return _cart.items.delete(data);
		},
	quantity : function*(){

		var data = _s_req.validate({
			listing : {v:['isListing']},
			product : {v:['isProduct']},
			quantity : {v:['isInt']},
			seller : { v:['isAlphaOrNumeric'] }
			});

		if(data.failure) return data;
		return yield _cart.items.update.quantity(data);
		},
	waive : function*(){
		var data = _s_req.validate({
			listing : {v:['isListing']},
			product : {v:['isProduct']},
			seller : { v:['isAlphaOrNumeric'] },
			type : { in:[1,2,'1','2'] }
			})

		if(data.failure) return data;
		return yield _cart.items.update.waive(data);
		},
	notes : function*(){

		var data = _s_req.validate({
			listing : {v:['isListing']},
			product : {v:['isProduct']},
			notes : {v:['isTextarea']},
			seller : { v:['isAlphaOrNumeric'] }
			});

		if(data.failure) return data;
		return yield _cart.items.update.notes(data);
		},
	shipping : function*(){

		var data = _s_req.validate({
			seller : { v: ['isAlphaOrNumeric'] }
			})
		if(data.failure) return data;
		
		var options = yield _s_load.library('shipping').calculate.order({
			id : data.seller
			})

		if(options.failure) {
			 return {failure:'Rates could not be retrieved for this shipment. Please try calculating rates again by closing this dialogue box and clicking the shipping button. In the event that this error message keeps appearing, contact Sellyx.'}
			}
		else {
			_cart.items.update.shipping.options({ seller : data.seller, options : options });
			return {success : options};
			}
		},
	save : function*(){
		var data = _s_req.validate({
			send : { v:['isJSON'] },
			seller : { v:['isAlphaOrNumeric'] }
			})

		if(data.failure) return data;
		return _cart.items.update.shipping.save(data);
		},
	promotion : function*(){
		var data = _s_req.validate({
			code : { v:['isAlphaOrNumeric'] }
			})

		if(data.failure) return data;
		return yield _s_load.library('promotions').get.coded(data);
		},
	empty : function*(){
		_cart.empty();
		return { success : 'Cart emptied' };
		},


	}