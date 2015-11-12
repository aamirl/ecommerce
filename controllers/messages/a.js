var _messages = _s_load.library('messages');


module.exports = {
	get : function*(){
		var data = _s_req.validate(_messages.helpers.filters());

		if(data.failure) return data;
		if(_s_seller) data.seller = _s_seller.profile.id()

		data.user = _s_user.profile.id();
		data.endpoint = true;

		return yield _messages.get(data);
		},
	upsert : function*(){
		
		return yield _messages.upsert({
			user : _s_user.profile.id(),
			seller : (_s_seller?_s_seller.profile.id():false)
			});

		},
	read : function*(){
		var data = _s_req.validate({
			id : { v:['isMessageThread'] }
			})
		if(data.failure) return data;

		// lets pull up the message
		var result = yield _messages.get(data);
		if(!result) return { failure : { msg : 'Your message was not found.', code : 300 } };

		// now lets confirm that the user is in the thread
		var r = _s_util.array.find.object(result.users, 'id', _s_user.profile.id(), true);
		if(!r) {
			if(!_s_seller) return { failure : true }
			else{
				var r = _s_util.array.find.object(result.users, 'id', _s_seller.profile.id(), true);
				if(!r) return { failure : true }
				

				result.users[r.index].read_users.push(_s_user.profile.id())

				}
			}


		else if(!r && _s_seller){
			
			}

		if(r.object.type == 1) result.users[r.index].read = true;
		else 


		},
	status : function*(){
		
		return yield _listings.actions.status({
			seller : {target : true },
			user : {target : true }
			});
		
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
			status : [1,2]
			}

		if(_s_seller) x.seller = { id : _s_seller.profile.id(), target : true }
		var r = yield _s_common.check(x);


		var interest = _s_util.array.find.object(r.interests , 'interest' , data.extra , true );
		if(!interest) return { failure : 'The interest could not be found.' };
		
		interest.object.setup.status = parseInt(data.status);
		r.interests[interest.index] = interest.object;
	
		return yield _s_common.update(r , 'listings');
		},
	message : function*(){
		return yield _listings.actions.message({ type : 2 , user : _s_user.profile.id() , seller : _s_seller?_s_seller.profile.id():null });
		}
	}