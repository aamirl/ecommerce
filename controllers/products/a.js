var _products = _s_load.library('products');

module.exports = {
	'get' : function*(){
		var data = _s_req.validate(_products.helpers.filters());
		if(data.failure) return data;

		data.entity = _s_entity.object.profile.id();
		data.endpoint = true;

		return yield _products.get(data);
		},
	'get/summary' : function*(){
		return yield _products.actions.summary({
			entity : _s_entity.object.profile.id(),
			combined : true, 
			type : _s_req.post('type')
			});
		},
	new : function*(){
		
		
		},
	update : function*(){
		return yield _products.update.product();
		},
	'images/update' : function*(){
		if(!_s_seller) return _s_l.error(101);
		var data = _s_req.validate({
			product : { v:['isProduct'] },
			images : { v:['isArray'] },
			segmentor : { 
				json : true,
				b: true,
				data : {
					id : { v:['isAlphaOrNumeric'] },
					label : { v:['isAlphaOrNumeric']},
					hex : { v:['isAlphaOrNumeric'] , b:true } 
					}
				}
			})

		if(data.failure) return data;
		if(data.images.length == 0) return { failure : { msg : 'We need images for this product.' , code : 300 } };

		var result = yield _products.get({id:data.product,convert:false});
		if(!result) return { failure : { msg : 'The product could not be found.' , code : 300 } };

		// check to see if seller is the same
		if(result.setup.seller != _s_seller.profile.id() || (result.locked && result.locked == 2) ) return { failure : { msg : 'This product cannot be modified.' , code : 300 } };

		// get template for product
		var template = yield _s_load.template(result.line.category);
		if(!template) return { failure : { msg : 'The product template could not be loaded.' , code :300 } };

		if(template.setup.images && !data.segmentor) return { failure : { msg : 'This product variation requires segmentors.' , code : 300 } };

		if(data.segmentor){

			var images = [];
			_s_u.each(data.images, function(i,ind){
				images.push({
					image : i,
					segmented : data.segmentor.id
					})
				})

			// load all the segmentors and look for this one
			if(result.segmented[data.segmentor.id]){
				// now remove all the images from before
				result.images = _s_util.array.splicem({ array :result.images , remove :  _s_util.array.find.objects(result.images, 'segmented', data.segmentor.id, false, true)})
				}

			result.segmented[data.segmentor.id] = {
				data : data.segmentor.label,
				hex : data.segmentor.hex||undefined
				}

			result.images = (result.images).concat(images);
			}
		else{
			result.images = data.images;
			}

		var r =  yield _s_common.update(result, 'products');
		if(r.failure) return r;
		return { success : true }
		},
	'segmentor/delete' : function*(){
		if(!_s_seller) return _s_l.error(101);
		var data = _s_req.validate({
			product : { v:['isProduct'] },
			segmentor : { v:['isAlphaOrNumeric'] }
			})

		if(data.failure) return data;

		var result = yield _products.get({id:data.product,convert:false});
		if(!result) return { failure : { msg : 'The product could not be found.' , code : 300 } };

		// check to see if seller is the same
		if(result.setup.seller != _s_seller.profile.id() || (result.locked && result.locked == 2) ) return { failure : { msg : 'This product cannot be modified.' , code : 300 } };
		if(!result.segmented) return { failure : { msg : 'There are no segmentors for this product variation.' , code :300 } };
		if(!result.segmented[data.segmentor]) return { failure : { msg : 'The segmentor was not found for this product variation.' , code :300 } };

		// get template for product
		var template = yield _s_load.template(result.line.category);
		if(!template) return { failure : { msg : 'The product template could not be loaded.' , code :300 } };
		if(!template.setup.images) return { failure : { msg : 'This product does not have segmentors.' , code : 300 } };

		// now look and make sure that no combination is being sold that uses this segmentor
		var combo = _s_util.array.find.object(result.combos, template.setup.images, data.segmentor);
		if(combo) return { failure : { msg : 'You cannot delete this '+template.setup.images+' because the combination labeled ' + (combo.label||combo.id) + ' uses this '+template.setup.images+'. Please delete that combination first before deleting this.' , code : 300} }

		result.images = _s_util.array.splicem({ array :result.images , remove :  _s_util.array.find.objects(result.images, 'segmented', data.segmentor, false, true)})
		delete result.segmented[data.segmentor];

		var r =  yield _s_common.update(result, 'products');
		if(r.failure) return r;
		return { success : true }
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
		

		var error = false;
		var to_delete = [];

		_s_u.each(objects, function(object,i){
			if(object.object.seller.id != _s_seller.profile.id()){
				error = object.object.seller.id;
				return false;
				}
			else{
				to_delete.push(object.index)
				}
			})

		if(error) return { failure : { msg : 'This combination cannot be deleted because other sellers are selling this combination.' , code : 300 } };

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

		var template = _s_load.template(result.line.category);
		if(!template) return { failure : {msg:'This template could not be found.', code:300 }}

		if(combo && (!objects || (combo && objects && !found))){
			//passed all checks so let's just update
			var w = yield _products.helpers.validators.combinations(result.line.category, result.line.custom);
			if(w.failure) return w;
			var info = _s_req.validate(w);
			if(info.failure) return info;


			// let's check to see if there are segmentors needed for this product
			if(result.segmented){
				if(!result.segmented[combo[template.setup.images]]) return { failure : { msg : 'There were no associated images for this combination. You need to first create new images by clicking the \'Add New Images\' button.' , code :300 } };
				}


			info.id = data.combo;
			result.combos[combo.index] = info;
			}
		else{
			var u = yield _products.new.combination({
				category : result.line.category,
				custom : result.line.custom
				});
			if(u.failure) return u;

			// let's check to see if there are segmentors needed for this product
			if(result.segmented){
				if(!result.segmented[u[template.setup.images]]) return { failure : { msg : 'There were no associated images for this combination. You need to first create new images by clicking the \'Add New Images\' button.' , code :300 } };
				}

			result.combos.push(u);
			}

		var r = yield _s_common.update(result, 'products');
		if(r.failure) return r;
		return { success : true }
		},
	'listing/new' : function*(){
		return yield _products.new.listing();
		},
	'listing/update' : function*(){
		return yield _products.update.listing();
		},
	'listing/status' : function*(){
		return yield _products.actions.status.listing();
		}
	}