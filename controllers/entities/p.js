var _entities = _s_load.library('entities');

module.exports = {
	'get' : function*(){
		// this is the api endpoint for getting a user by id
		var data = _s_req.validate(_entities.helpers.filters());
		if(data.failure) return data;

		var exclusions = [ 'verifications','financials','faq','follows' ];
		if(data.exclude) data.exclude = exclusions.concat(data.exclude);
		else data.exclude = exclusions;

		data.endpoint = true;
		return yield _entities.get(data);
		},
	'get/addable' : function*(){
		// this is the api endpoint for getting a user by id
		var data = _s_req.validate(_entities.helpers.filters());
		if(data.failure) return data;

		var exclusions = [ 'verifications','financials','faq','follows' ];
		if(data.exclude) data.exclude = exclusions.concat(data.exclude);
		else data.exclude = exclusions;

		data.indices = 't2';

		data.endpoint = true;
		return yield _entities.get(data);
		}
	}