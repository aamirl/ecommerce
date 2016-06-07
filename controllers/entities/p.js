

module.exports = function(){  return new Controller(); }

function Controller(){}
Controller.prototype = {
	'get' : function*(){
		var _entities = this._s.library('entities');
		// this is the api endpoint for getting a user by id
		var data = this._s.req.validate(_entities.helpers.filters());
		if(data.failure) return data;

		var exclusions = [ 'verifications','financials','faq' ];
		if(data.exclude) data.exclude = exclusions.concat(data.exclude);
		else data.exclude = exclusions;

		data.endpoint = true;
		return yield _entities.get(data);
		},
	'get/followers' : function*(){
		var _entities = this._s.library('entities');
		// this is the api endpoint for getting a user by id
		var data = this._s.req.validate(_entities.helpers.filters());
		if(data.failure) return data;

		data.include = "follows"
		delete data.exclude

		data.endpoint = true;
		return yield _entities.get(data);
		},
	'get/addable' : function*(){
		var _entities = this._s.library('entities');
		// this is the api endpoint for getting a user by id
		var data = this._s.req.validate(_entities.helpers.filters());
		if(data.failure) return data;

		var exclusions = [ 'verifications','financials','faq','follows' ];
		if(data.exclude) data.exclude = exclusions.concat(data.exclude);
		else data.exclude = exclusions;

		data.indices = 't2';

		data.endpoint = true;
		return yield _entities.get(data);
		}
	}