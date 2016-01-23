var _t1 = _s_load.library('t1');


module.exports = {
	get : function*(){
		// this is the api endpoint for getting the information for the user who is currently using the system
		return { success : { data : yield _t1.get({id:_s_t1.profile.id(),convert:true,exclude:'faq,entities,follows'})} };
		},
	'entities/summary' : function*(){
		return { success : { data: _s_t1.entities.summary() } }
		},
	'update/basic' : function*(){
		// this is the api endpoint for updating the information for an existing user that is basic
		var data = _s_req.validate({
			tagline : { v:['isAlphaOrNumeric'] , b:true },
			description : { v : ['isTextarea'] , b:true },
			social : _s_common.helpers.validators.social(),
			currency : { in:_s_currency.helpers.valid(), b:true, default:'US' },
			standard : { in:[1,2,'1','2'], b:true, default:'MT' },
			});

		if(data.failure) return data;

		data.id = _s_t1.profile.id();
		var update = yield _t1.update(data);
		if(update){
		 	var converted = yield _t1.helpers.cached(data, true);
		 	return { success : true}
			}
		return { failure : { msg : 'The user could not be updated at this time.' , code : 300 } }
		},
	'update/address' : function*(){
		var s = _s_common.helpers.validators.address({required:true,json:false});
		s.index = { v:['isInt'] , b:true };
		var data = _s_req.validate(s)

		if(data.failure) return data;

		// next we are going to see whether the inputted address exists in the address book
		var addresses = _s_t1.profile.addresses.all();
		if(_s_util.array.compare.objects(addresses , data)) return {  failure : { msg : 'You already have this address on file.' , code : 300 } };

		
		// if it doesn't exist, we are going to grab the user information from the database and then update it
		var result = yield _t1.get(_s_t1.profile.id());
		if(!result) return { failure : { msg : 'We could not find the user in order to update the address information.' , code : 300 } };

		// let's see if we are adding this or updating something
		if(data.index || data.index == 0){
			var index = data.index;
			delete data.index;
			result.addresses[index] = data;
			}
		else{
			result.addresses.push(data);			
			}

		// update the user and the cache
		result.id = _s_t1.profile.id();
		var update = yield _t1.update(result);
		if(update){
		 	var converted = yield _t1.helpers.cached(result, true);
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
		var result = yield _t1.get( _s_t1.profile.id() );
		if(!result) return { failure : { msg : 'We could not find the user in order to update the address information.' , code : 300 } };

		result.addresses.splice(data.index,1);

		// update the user and the cache
		result.id = _s_t1.profile.id();
		var update = yield _t1.update(result);
		if(update){
		 	var converted = yield _t1.helpers.cached(result, true);
		 	return { success : { data: result.addresses } }
			}
		return { failure : { msg : 'The user could not be updated at this time.' , code : 300 } }
		}
	}