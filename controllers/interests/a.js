

module.exports = function(){  return new Controller(); }

function Controller(){}
Controller.prototype = {
	get : function*(){
		var _interests = this._s.library('interests');
		
		// for this get we only want to return the information for the currently logged in user
		var data = this._s.req.validate(_interests.helpers.filters());
		if(data.failure) return data;

		data.entity = this._s.entity.object.profile.id();
		data.endpoint = true;

		return  yield _interests.get(data);
		},
	new : function*(){
		var _interests = this._s.library('interests');
		return yield _interests.new();
		},
	status : function*(){
		
		var data = this._s.req.validate({
			id : {v:['isListing']},
			status : { in:['1','2',1,2] },
			extra : { v:['isAlphaOrNumeric'] },
			});
		if(data.failure) return data;
		
		var x = {
			id : data.id,
			library : 'listings',
			label : 'listing',
			send : 'object',
			status : {
				allowed : [1,'1']
				},
			deep : {
				entity : {
					id : this._s.entity.object.profile.id(),
					target : true
					},
				library : 'interests',
				array : 'interests',
				property : 'interest',
				value : data.extra,
				status : {
					allowed : [1,'1'],
					change : data.status
					}
				}
			}

		return yield this._s.common.check(x);
		},
	message : function*(){
		return yield this._s.library('listings').actions.message({type:1});
		}
	}