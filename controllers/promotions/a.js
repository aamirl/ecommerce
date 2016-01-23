var _promotions = _s_load.library('promotions');

module.exports = {
	get : function*(){
		if(!_s_seller) return _s_l.error(101);
		
		var c = _promotions.helpers.filters();
		var data = _s_req.validate(c);
		if(data.failure) return data;

		// data.seller = _s_seller.profile.id();
		data.endpoint = true;

		return yield _promotions.get(data);
		},
	new : function*(){
		if(!_s_seller) return _s_l.error(101);
		return yield _promotions.new();
		},
	update : function*(){
		if(!_s_seller) return _s_l.error(101);
		return yield _promotions.update({seller:_s_seller.profile.id()});
		},
	status : function*(){
		if(!_s_seller) return _s_l.error(101);
		
		return yield _promotions.actions.status({
			seller : {target : 'flat' },
			});
		
		},
	}