var _users = _s_load.engine('users');


module.exports = {
	get : function*(){
		// this is the api endpoint for getting the information for the user who is currently using the system
		return { success : { data : _s_user.profile.all()} };
		},
	new : function*(){
		// this is the api endpoint for adding a new user to the system
		return yield _users.new();
		},
	'update/basic' : function*(){
		// this is the api endpoint for updating the information for an existing user that is basic
		var data = _s_req.validate({
			standard : { in:[1,2,'1','2'] , b: true},
			currency : { v:['isCurrency'] , b: true },
			tagline : { v:['isAlphaOrNumeric'] , b:true },
			description : { v : ['isTextarea'] , b:true }
			});

		if(data.failure) return data;

		data.id = _s_user.profile.id();

		var results = yield _users.update(data);
		if(results) return { success : true }
		return { failure : { msg : 'The user could not be updated at this time.' , code : 300 } }
		},
	'update/address/validate' : function*(){
		var data = _s_req.validate({
			index : { v:['isInt'] , b:true },
			label : { v:['isAlphaOrNumeric'] , b:true },
			street1 : { v:['isAlphaOrNumeric'] },
			street2 : { v:['isAlphaOrNumeric'] , b:true },
			city : { v:['isAlphaOrNumeric'] },
			state : { v:['isAlphaOrNumeric'] , b : true },
			postal : { v:['isAlphaOrNumeric'] },
			country : { v:['isCountry'] },
			primary : { in : ['true','false'] }
			})
		if(data.failure) return data;

		!data.label?data.label = data.street1 : null;

		// first we are going to bring up this user's address book
		var addresses = _s_user.profile.addresses.all();
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
		// retrieved stored information from the cache
		var stored = yield _s_cache.key.get('temporary.address');
	
		if(!stored) return { failure : { msg : 'There was no address information to confirm.' , code : 300 } };

		// next we are going to see whether the inputted address exists in the address book
		var addresses = _s_user.profile.addresses.all();
		if(_s_util.array.compare.objects(addresses , stored)) return {  failure : { msg : 'You already have this address on file.' , code : 300 } };

		
		// if it doesn't exist, we are going to grab the user information from the database and then update it
		var result = yield _users.get(_s_user.profile.id());
		if(!result) return { failure : { msg : 'We could not find the user in order to update the address information.' , code : 300 } };

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
		result.id = _s_user.profile.id();
		var update = yield _users.update(result);
		if(update){
		 	var converted = yield _users.helpers.cached(result, true);
		 	return { success : { data: result.addresses } }
			}
		return { failure : { msg : 'The user could not be updated at this time.' , code : 300 } }
		},
	'update/address/delete' : function*(){
		var data = _s_req.validate({
			index : { v:['isInt'] , b:true }
			})

		if(data.failure) return data;

		// if it doesn't exist, we are going to grab the user information from the database and then update it
		var result = yield _users.get( _s_user.profile.id() );
		if(!result) return { failure : { msg : 'We could not find the user in order to update the address information.' , code : 300 } };

		result.addresses.splice(data.index,1);

		// update the user and the cache
		result.id = _s_user.profile.id();
		var update = yield _users.update(result);
		if(update){
		 	var converted = yield _users.helpers.cached(result, true);
		 	return { success : { data: result.addresses } }
			}
		return { failure : { msg : 'The user could not be updated at this time.' , code : 300 } }
		}
	}