var _interests = _s_load.library('interests');


module.exports = {
	get : function*(){
		// for this get we only want to return the information for the currently logged in user
		var data = _s_req.validate(_interests.helpers.filters());
		if(data.failure) return data;

		data.entity = _s_entity.object.profile.id();
		data.endpoint = true;

		return yield _interests.get(data);
		},
	new : function*(){
		return yield _interests.new();
		},
	status : function*(){
		
		var data = _s_req.validate({
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
					id : _s_entity.object.profile.id(),
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

		return yield _s_common.check(x);
		},
	message : function*(){
		return yield _s_load.library('listings').actions.message({type:1});
		}
	}