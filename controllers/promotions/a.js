var _promotions = this._s.library('promotions');

module.exports = {
	get : function*(){
		if(!_s_seller) return this._s.l.error(101);
		
		var c = _promotions.helpers.filters();
		var data = this._s.req.validate(c);
		if(data.failure) return data;

		// data.seller = _s_seller.profile.id();
		data.endpoint = true;

		return yield _promotions.get(data);
		},
	new : function*(){
		if(!_s_seller) return this._s.l.error(101);
		return yield _promotions.new();
		},
	update : function*(){
		if(!_s_seller) return this._s.l.error(101);
		return yield _promotions.update({seller:_s_seller.profile.id()});
		},
	status : function*(){
		if(!_s_seller) return this._s.l.error(101);
		
		return yield _promotions.actions.status({
			seller : {target : 'flat' },
			});
		
		},
	}