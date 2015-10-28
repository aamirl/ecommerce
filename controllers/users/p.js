var _users = _s_load.engine('users');

module.exports = {
	'get' : function*(){
		// this is the api endpoint for getting a user by id

		var data = _s_req.validate({
			id : { v:['isUser'] },
			convert : { in:['true','false'] , default:'true' }
			});

		if(data.failure) return data;

		var exclusions = [ 'verifications','password','financials' ];
		if(data.exclude) data.exclude = exclusions.concat(data.exclude);
		else data.exclude = exclusions;

		var results = yield _users.get(data);

		if(results) return { success : results };
		return { failure : {msg:'The user information was not found.' },code:300};
		}
	}