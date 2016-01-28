var _t1 = _s_load.library('t1');


module.exports = {
	get : function*(){
		// this is the api endpoint for getting the information for the user who is currently using the system
		return { success : { data : yield _s_t1.profile.all(true) } }
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
			standard : { in:['US','MT'], b:true, default:'MT' },
			});

		if(data.failure) return data;
		return  yield _t1.update({data:data , result : _s_t1.data});
		},
	'update/address' : function*(){
		var s = _s_common.helpers.validators.address({required:true,json:false});
		s.index = { v:['isInt'] , b:true };
		var data = _s_req.validate(s)

		if(data.failure) return data;

		// next we are going to see whether the inputted address exists in the address book
		var addresses = _s_t1.profile.addresses.all();
		if(_s_util.array.compare.objects(addresses , data)) return {  failure : { msg : 'You already have this address on file.' , code : 300 } };

		var result = _s_t1.data;

		// let's see if we are adding this or updating something
		if(data.index || data.index == 0){
			var index = data.index;
			delete data.index;
			result.addresses[index] = data;
			}
		else result.addresses.push(data);			

		return  yield _t1.update({data:data , result : result , return_target : 'addresses'});
		},
	'update/address/delete' : function*(){
		var data = _s_req.validate({
			index : { v:['isInt'] , b:true }
			})

		if(data.failure) return data;

		var result = _s_t1.data;
		result.addresses.splice(data.index,1);

		return  yield _t1.update({data:data , result : result , return_target : 'addresses'});
		}
	}