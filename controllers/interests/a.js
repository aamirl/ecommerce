var _listings = _s_load.library('listings');
var _interests = _s_load.library('interests');


module.exports = {
	get : function*(){
		// for this get we only want to return the information for the currently logged in user
		var data = _s_req.validate(_interests.helpers.filters());
		if(data.failure) return data;

		data.user = _s_user.profile.id();
		data.endpoint = true;

		return yield _interests.get(data);
		},
	new : function*(){
		// this is the api endpoint for adding a new interest to an existing listing
		var r = { user : _s_user.profile.id() };
		if(as && as == 2 && _s_seller) r = { seller : _s_seller.profile.id() };

		return yield _interests.new(r);
		},
	status : function*(){
		
		return yield _interests.actions.status({
			user : true
			});

		var data = _s_req.validate({
			id : {v:['isListing']},
			status : { in:['2','1',1,2] }
			});
		if(data.failure) return data;
		
		var r = yield _s_common.check({
			id : data.id,
			library : 'listings',
			user : 'interests',
			label : 'listing', 
			status : [1,2]
			});

		if(r.failure) return r;
		var p = r.object.object;

		p.setup.status = parseInt(data.status);
		r.result.interests[r.object.index] = p;

		return yield _s_common.update(r.result , 'listings' , [{ insert : 'interest' , target : {id:'id' , data : _s_user.profile.id(), depth : 'user'} , replace : 'interests' }]);
		},
	message : function*(){
		return yield _listings.actions.message({type:1,user:_s_user.profile.id()});
		}
	}