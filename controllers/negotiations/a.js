var _negotiations = _s_load.library('negotiations');

module.exports = {
	'seller/get' : function*(){
		if(!_s_seller) return _s_l.error(101);
		
		var c = _negotiations.helpers.filters();
		var data = _s_req.validate(c);
		if(data.failure) return data;

		data.seller = _s_seller.profile.id();
		data.endpoint = true;

		return yield _negotiations.get(data);
		},
	'user/get' : function*(){
		var c = _negotiations.helpers.filters();
		var data = _s_req.validate(c);
		if(data.failure) return data;

		data.user = _s_user.profile.id();
		data.endpoint = true;

		return yield _negotiations.get(data);
		},
	'seller/status' : function*(){
		if(!_s_seller) return _s_l.error(101);
		
		return yield _negotiations.actions.status.negotiation({
			seller : {target : true },
			status : { in:[1,2,100,'100','2',1] },
			allowed : [1,2],
			// allowed : [1],
			additional : {
				ended : _s_dt.now.datetime()
				}
			});
		
		},
	'seller/accept' : function*(){
		if(!_s_seller) return _s_l.error(101);

		return yield _negotiations.actions.status.offer({
			seller : {target : true },
			allowed : [1],
			status : 100,
			deep : {
				change : 5,
				additional_checks : {
					by : 1
					}
				},
			additional : {
				approved : _s_dt.now.datetime()
				}
			});

		},
	'seller/deny' : function*(){
		if(!_s_seller) return _s_l.error(101);

		var r = yield _negotiations.actions.status.offer({
			seller : {target : true }
			});
		if(r.failure) return r;

		// validate additional data
		var data = _s_req.validate({
			quantity : { v:['isInt'] },
			price : { v:['isPrice'] },
			expiration : { v:['isDateTime'] },
			prompt : { v:['isTextarea'] , b:true }
			})
		if(data.failure) return data;
		data.by = 2;

		if(r.object.object.by == 1){
			r.object.object.status = 2;
			r.object.object.rejected = _s_dt.now.datetime();
			}
		else{
			r.object.object.status = 3;
			r.object.object.cancelled = _s_dt.now.datetime();
			}

		r.result.offers[r.object.index] = r.object.object;
		r.result.offers.push(_negotiations.new.offer(data));

		return yield _s_common.update(r.result,'negotiations');
		},
	'user/status' : function*(){
		
		return yield _negotiations.actions.status.negotiation({
			user : {target : true },
			status : { in:[3,100,'100','3'] },
			allowed : [1],
			additional : {
				ended : _s_dt.now.datetime()
				}
			});

		},
	'user/accept' : function*(){

		return yield _negotiations.actions.status.offer({
			user : {target : true },
			allowed : [1],
			status : 100,
			deep : {
				change : 5,
				additional_checks : {
					by : 2
					}
				},
			additional : {
				approved : _s_dt.now.datetime()
				}
			});

		},
	'user/deny' : function*(){

		var r = yield _negotiations.actions.status.offer({
			user : {target : true }
			});
		if(r.failure) return r;

		// validate additional data
		var data = _s_req.validate({
			quantity : { v:['isInt'] },
			price : { v:['isPrice'] },
			expiration : { v:['isDateTime'] },
			prompt : { v:['isTextarea'] , b:true }
			})
		if(data.failure) return data;
		data.by = 1;

		if(r.object.object.by == 2){
			r.object.object.status = 2;
			r.object.object.rejected = _s_dt.now.datetime();
			}
		else{
			r.object.object.status = 3;
			r.object.object.cancelled = _s_dt.now.datetime();
			}

		r.result.offers[r.object.index] = r.object.object;
		r.result.offers.push(_negotiations.new.offer(data));

		return yield _s_common.update(r.result,'negotiations');
		},
	}