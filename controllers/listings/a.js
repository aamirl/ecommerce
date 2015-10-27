var _listings = _s_load.library('listings');


module.exports = {
	get : function*(){
		var data = _s_req.validate(_listings.helpers.filters());

		if(data.failure) return data;
		
		if(_s_seller) data.seller = _s_seller.profile.id();
		data.user = _s_user.profile.id();

		var results = yield _listings.get(data);
		if(results && results.data.length > 0) {
			results.filters = data;
			return { success : results };
			}
		return { failure : {msg: 'No listings matched your query.', code:300 }};
		},
	new : function*(){
		// this is the api endpoint for adding a new listing
		var as = _s_req.post('as');
		var r = { user : _s_user.profile.id() };
		if(as && as == 2 && _s_seller) r = { seller : _s_seller.profile.id() };

		return yield _listings.new(r);
		},
	status : function*(){
		
		return yield _listings.actions.status({
			seller : {target : true },
			user : {target : true }
			});
		
		},
	update : function*(){
		var r = { user : true }
		if(_s_seller) r.seller = _s_seller.profile.id()
		return yield _listings.update(r);
		},
	decision : function*(){
		
		var data = _s_req.validate({
			id : {v:['isListing']},
			interest : { v:['isInterests'] },
			status : { in:['3','4',3,4] }
			});
		if(data.failure) return data;
		
		var r = yield _s_common.check({
			id : data.id,
			library : 'listings',
			user : 'interests',
			label : 'listing', 
			status : [3,4]
			});

		if(r.failure) return r;
		var p = r.object.object;

		p.setup.status = parseInt(data.status);
		r.result.interests[r.object.index] = p;
		
		return yield _s_common.update(r.result , 'listings');
		},
	message : function*(){
		return yield _listings.actions.message({ type : 2 , user : _s_user.profile.id() , seller : _s_seller?_s_seller.profile.id():null });
		}
	}