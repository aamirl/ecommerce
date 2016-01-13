var _listings = _s_load.library('listings');
var _interests = _s_load.library('interests');


module.exports = {
	get : function*(){
		// for this get we only want to return the information for the currently logged in user
		var data = _s_req.validate(_interests.helpers.filters());
		if(data.failure) return data;

		data.user = _s_user.profile.id();
		data.endpoint = true;

		var r =  yield _interests.get(data);
console.log(r)
		return r;
		},
	new : function*(){
		// this is the api endpoint for adding a new interest to an existing listing
		var r = { user : _s_user.profile.id() };
		if(as && as == 2 && _s_seller) r = { seller : _s_seller.profile.id() };

		return yield _interests.new(r);
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
				user : {
					id : _s_user.profile.id(),
					target : true
					},
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
		return yield _listings.actions.message({type:1,user:_s_user.profile.id()});
		}
	}