var _sellers = _s_load.engine('sellers');

module.exports = {
	get : function*(){
		if(!_s_seller) return _s_l.error(101);
		return { success : { data : yield _s_seller.profile.all(true)} };
		},
	'get/faq' : function*(){
		if(!_s_seller) return _s_l.error(101);

		// if it doesn't exist, we are going to grab the seller information from the database and then update it
		var result = yield _sellers.get(_s_seller.profile.id());
		if(!result) return { failure : { msg : 'We could not find the seller\'s faq information.' , code : 300 } };

		return { success : { data : result.faq } };
		},
	new : function*(){
		if(_s_seller) return { failure : { msg : 'This function is only allowed for users who are not already part of a company.' , code : 300 } }

		// add seller to es
		var new_seller = yield _sellers.new();
		if(new_seller.failure) return new_seller;
		else new_seller = new_seller.success.data;

		GLOBAL._s_seller = yield _s_load.object('sellers',new_seller); 
		if(_s_seller.failure) return { failure : _s_seller.failure }

		// now update user in es with seller info
		var _user = _s_load.engine('users');
		var result = yield _user.get(_s_user.profile.id());
		if(!result) return { failure : { msg : 'Could not find user.' , code : 300 } }

		result.seller = _s_seller.helpers.data.document();
		result.seller.role = 1;

		var update = yield _s_common.update(result,'users',false, true);
		if(!update) return { failure : { msg : "The seller profile was made but we were unable to add this information to your profile. Please contact Sellyx for more details" , code:300 } };

		// finally update user cache
		yield _s_load.engine('users').helpers.cached(result , _s_cache_key);
		yield _sellers.helpers.cached(_s_seller.profile.id(), _s_cache_key);
		GLOBAL._s_user = yield _s_load.object('users', result);
				
		return { success : { data : { user : _s_user.profile.all(), seller : yield _s_seller.profile.all(true) } } }
		},
	'update/basic' : function*(){
		if(!_s_seller) return _s_l.error(101);
		
		// this is the api endpoint for updating the information for an existing seller that is basic
		var data = _s_req.validate({
			website : { v:['isURL'] , b: true },
			description : { v : ['isTextarea'] , b:true },
			contact :  { v:['isPhone'] },
			social : {
				json : true,
				b : true,
				default : {
					twitter : {},
					facebook : {},
					google : {},
					pinterest : {},
					instagram : {}
					},
				data : {
					twitter : {
						json : true,
						data : {
							id : { v:['isAlphaOrNumeric'] , b:true , default : '' }
							}
						},
					facebook : {
						json : true,
						data : {
							id : { v:['isAlphaOrNumeric'] , b:true , default : '' }
							}
						},
					google : {
						json : true,
						data : {
							id : { v:['isAlphaOrNumeric'] , b:true , default : '' }
							}
						},
					pinterest : {
						json : true,
						data : {
							id : { v:['isAlphaOrNumeric'] , b:true , default : '' }
							}
						},
					instagram : {
						json : true,
						data : {
							id : { v:['isAlphaOrNumeric'] , b:true , default : '' }
							}
						},
					}
				}
			});

		if(data.failure) return data;
		data.id = _s_seller.profile.id();		

		var results = yield _sellers.update(data);
		if(results) return { success : true }
		return { failure : { msg : 'The seller could not be updated at this time.' , code : 300 } }
		},
	'update/address/validate' : function*(){
		if(!_s_seller) return _s_l.error(101);
		
		var data = _s_req.validate({
			index : { v:['isInt'] , default : 0 },
			label : { v:['isAlphaOrNumeric'] , b:true },
			street1 : { v:['isAlphaOrNumeric'] },
			street2 : { v:['isAlphaOrNumeric'] , b:true },
			city : { v:['isAlphaOrNumeric'] },
			state : { v:['isAlphaOrNumeric'] , b : true },
			postal : { v:['isAlphaOrNumeric'] },
			country : { v:['isCountry'] },
			// primary : { in : ['true','false',true,false] }
			})
		
		if(data.failure) return data;
		!data.label?data.label = data.street1 : null;

		// first we are going to bring up this seller's address book
		var addresses = _s_seller.profile.addresses.all();
		if(!addresses) return { failure : { msg : 'You seem to have been logged out.' , code : 300 } }

		// next we are going to validate the address via google and return the results for the user to confirm

		var r = yield _s_loc.helpers.address.validate(_s_util.clone.deep(data));
		if(r.failure) return r;

		var converted = yield _s_loc.helpers.address.extract({data:r[0], latlon:true});
		data = _s_util.merge(data , converted , true);

		yield _s_cache.key.set({ key : 'temporary.address' , value : data })
		return { success : { address : r[0].formatted_address } }
		},
	'update/address/confirm' : function*(){
		if(!_s_seller) return _s_l.error(101);
	
		// retrieved stored information from the cache
		var stored = yield _s_cache.key.get('temporary.address');
	
		if(!stored) return { failure : { msg : 'There was no address information to confirm.' , code : 300 } };

		// next we are going to see whether the inputted address exists in the address book
		var addresses = _s_seller.profile.addresses.all();
		if(_s_util.array.compare.objects(addresses , stored)) return {  failure : { msg : 'You already have this address on file.' , code : 300 } };

		
		// if it doesn't exist, we are going to grab the seller information from the database and then update it
		var result = yield _sellers.get(_s_seller.profile.id());
		if(!result) return { failure : { msg : 'We could not find the seller in order to update the address information.' , code : 300 } };

		// let's see if we are adding this or updating something
		if(stored.index || stored.index == 0){
			var index = stored.index;
			delete stored.index;
			result.addresses[index] = stored;
			}
		else{
			result.addresses.push(stored);			
			}

		// update the user and the cache
		var update = yield _sellers.update(result);
		if(update){
		 	yield _sellers.helpers.cached(result, true);
		 	return { success : { data: result.addresses } }
			}
		return { failure : { msg : 'The seller\'s primary address could not be updated at this time.' , code : 300 } }
		},
	'update/address/delete' : function*(){
		var data = _s_req.validate({
			index : { v:['isInt'] }
			})

		if(data.failure) return data;


		// if it doesn't exist, we are going to grab the user information from the database and then update it
		var result = yield _sellers.get( _s_seller.profile.id() );
		if(!result) return { failure : { msg : 'We could not find the seller in order to update the address information.' , code : 300 } };

		if(data.index == 0) return { failure : { msg : 'You have to have at least one address in the system.' , code : 300 } }
		result.addresses.splice(data.index,1);

		// update the user and the cache
		var update = yield _sellers.update(result);
		if(update){
		 	yield _sellers.helpers.cached(result, true);
		 	return { success : { data: result.addresses } }
			}
		return { failure : { msg : 'The seller could not be updated at this time.' , code : 300 } }
		},
	'update/faq' : function*(){
		if(!_s_seller) return _s_l.error(101);
		
		var data = _s_req.validate(_sellers.helpers.validators.faq());

		if(data.failure) return data;

		// if it doesn't exist, we are going to grab the user information from the database and then update it
		var result = yield _sellers.get( _s_seller.profile.id() );
		if(!result) return { failure : { msg : 'We could not find the seller in order to update the address information.' , code : 300 } };

		if(data.id){
			var object = _s_util.array.find.object(result.faq, 'id', data.id, true);
			if(!object) return { failure : { msg : 'We could not find the question you are trying to modify.' , code : 300 } }

			if(data.a){
				// means update the answer
				result.faq[object.index].a = data.a; 
				}
			else{
				// means delete the faq
				result.faq.splice(object.index , 1);
				}
			}
		else{
			// add a new faq
			result.faq.push(_sellers.actions.new.faq(data));
			}

		var update = yield _sellers.update(result);
		if(update){
		 	yield _sellers.helpers.cached(result, true);
		 	return { success : { data: result.faq } }
			}
		return { failure : { msg : 'The seller could not be updated at this time.' , code : 300 } }


		}
	}