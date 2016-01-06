var _users = _s_load.engine('users');

module.exports = {
	'get' : function*(){
		// this is the api endpoint for getting a user by id
		var data = _s_req.validate(_users.helpers.filters());
		if(data.failure) return data;

		var exclusions = [ 'verifications','financials' ];
		if(data.exclude) data.exclude = exclusions.concat(data.exclude);
		else data.exclude = exclusions;

		data.endpoint = true;
		return yield _users.get(data);
		}
	}