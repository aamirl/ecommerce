var _listings = _s_load.library('listings');


module.exports = {
	get : function*(){
		var data = _s_req.validate(_listings.helpers.filters());

		if(data.failure) return data;
		if(_s_seller) data.seller = _s_seller.profile.id();
		data.user = _s_user.profile.id();
		data.endpoint = true;

		return yield _listings.get(data);
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
	'decision/status' : function*(){
		
		var data = _s_req.validate({
			id : {v:['isListing']},
			extra : { v:['isAlphaOrNumeric'] },
			status : { in:['3','4',3,4] }
			});
		if(data.failure) return data;
		
		var x = {
			id : data.id,
			library : 'listings',
			user : {
				id : _s_user.profile.id(),
				target : true
				},
			label : 'listing', 
			status : {
				allowed : [1,'1']
				},
			deep : {
				array : 'interests',
				property : 'interest',
				value : data.extra,
				status : {
					allowed : [1,'1'],
					change : data.status
					}
				}
			}

		if(_s_seller) x.seller = { id : _s_seller.profile.id(), target : true }
		return yield _s_common.check(x);
		},
	message : function*(){
		return yield _listings.actions.message({ type : 2 , user : _s_user.profile.id() , seller : _s_seller?_s_seller.profile.id():null });
		}
	}