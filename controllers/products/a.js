// authorized calls for product management
var _products = _s_load.library('products');
var c = _products.helpers.filters();

module.exports = {
	'get/inventory' : function*(){
		if(!_s_seller) return _s_l.error(101);
		// we want to call the auth controller with the seller information
		// we add the filters we need for this particular inventory call

		var data = _s_req.validate(c);
		if(data.failure) return data;
		
		data.seller = _s_seller.profile.id();
		data.admin = true;

		var results = yield _products.get(data);
		if(results.data && results.data.length > 0){
			results.filters = data;
			return { success : results };
			}
		return { failure : {msg: 'No products matched your query.' } , code : 300 };
		},
	'get/seller' : function*(){
		if(!_s_seller) return _s_l.error(101);
		// we want to call the auth controller with the seller information
		// we add the filters we need for this particular inventory call

		var data = _s_req.validate(c);

		if(data.failure) return data;
		
		// next we want to add the seller information
		data.exclude = 'sellers';
		// data.added = _s_seller.profile.id();
		data.admin = true;

		var results = yield _products.get(data);
		if(results.data && results.data.length > 0){
			results.filters = data;
			return { success : results };
			}
		return { failure : {msg: 'No products matched your query.' } , code : 300 };
		},
	'get/seller/summary' : function*(){
		if(!_s_seller) return _s_l.error(101);
		return yield _products.actions.summary({seller:_s_seller.profile.id() , combined : true});
		},
	new : function*(){
		if(!_s_seller) return _s_l.error(101);
		
		},
	update : function*(){
		if(!_s_seller) return _s_l.error(101);
		return yield _products.update.product({
			seller : _s_seller.profile.id()
			});
		},
	'combination/delete' : function*(){
		if(!_s_seller) return _s_l.error(101);
		var data = _s_req.validate({
			combo : { v:['isCombination'] },
			product : { v:['isProduct'] }
			})
		if(data.failure) return data;

		var result = yield _products.get({id:data.product,convert:false});
		if(!result) return { failure : { msg : 'The product could not be found.' , code : 300 } }

		// check to see if seller is the same
		if(result.setup.seller != _s_seller.profile.id() || (result.locked && result.locked == 2) ) return { failure : { msg : 'This product cannot be modified, and this combination cannot be deleted.' , code : 300 } };

		// first check to see if there is actually a combination in the product
		var combo = _s_util.array.find.object(result.combos, 'id', data.combo, true);
		if(!combo) return { failure : { msg : 'This combination does not exist for this product.' , code : 300 } };

		if(data.combo == 1) return { failure : { msg : 'A product cannot exist without a combination. Please modify the current combination to a new combination instead of deleting it.' , code : 300 } }

		// check to see if this combination is being used by any other seller
		var objects = _s_util.array.find.objects(result.sellers, 'combo' , data.combo, true);
		

		var errors = [];
		var to_delete = [];

		_s_u.each(objects, function(object,i){
			if(object.object.seller.id != _s_seller.profile.id()){
				errors.push(object.object.seller.id);
				return false;
				}
			else{
				to_delete.push(object.index)
				}
			})

		if(errors.length > 0) return { failure : { msg : 'This combination cannot be deleted because other sellers are selling this combination.' , code : 300 } };

		result.sellers = _s_util.array.splicem({
			array : result.sellers,
			remove : to_delete
			})

		// if we are good, then delete the combination
		result.combos.splice(combo.index,1);

		// next get rid of all the listings that the seller had for that combination
		
		var r = yield _s_common.update(result, 'products');
		if(r.failure) return r;
		return { success : true }
		},
	'combination/upsert' : function*(){
		if(!_s_seller) return _s_l.error(101);
		var data = _s_req.validate({
			combo : { v:['isCombination'] , b:true },
			product : { v:['isProduct'] }
			})
		if(data.failure) return data;

		var result = yield _products.get({id:data.product,convert:false});
		if(!result) return { failure : { msg : 'The product could not be found.' , code : 300 } };

		// check to see if seller is the same
		if(result.setup.seller != _s_seller.profile.id() || (result.locked && result.locked == 2) ) return { failure : { msg : 'This product cannot be modified, and this combination cannot be deleted.' , code : 300 } };

		if(data.combo){
			// means we are updating an existing combination
			var combo = _s_util.array.find.object(result.combos, 'id', data.combo, true);
			if(combo){
				// means we found the combination and it's supposed to be an update
				var objects = _s_util.array.find.objects(result.sellers, 'combo' , data.combo, true);
				if(objects){
					var found = false;
					_s_u.each(objects, function(object,i){
						if(object.object.seller.id != _s_seller.profile.id()){
							found = true;
							return false;
							}
						})
					}
				}
			}

		if(combo && (!objects || (combo && objects && !found))){
			//passed all checks so let's just update
			var w = yield _products.helpers.validators.combinations(result.line.category, result.line.custom);
			if(w.failure) return w;
			var info = _s_req.validate(w);
			if(info.failure) return info;
			info.id = data.combo;
			result.combos[combo.index] = info;
			}
		else{
			var u = yield _products.new.combination({
				category : result.line.category,
				custom : result.line.custom
				});
			if(u.failure) return u;
			result.combos.push(u);
			}

		var r = yield _s_common.update(result, 'products');
		if(r.failure) return r;
		return { success : true }
		},
	'listing/new' : function*(){
		if(!_s_seller) return _s_l.error(101);
		return yield _products.new.listing();
		},
	'listing/update' : function*(){
		if(!_s_seller) return _s_l.error(101);
		return yield _products.update.listing();
		},
	'listing/status' : function*(){
		if(!_s_seller) return { failure : { msg:'this is not a seller' , code : 300 } };
		return yield _products.actions.status.listing({
			seller : true
			});
		}
	}