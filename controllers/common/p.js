

module.exports = {
	'images' : function*(){
		return { success : true }
		},
	'cache/delete' : function*(){
		yield _s_cache.delete();
		},
	'address/validate' : function*(){
		var data = _s_req.validate({
			label : { v:['isAlphaOrNumeric'] , b:true },
			street1 : { v:['isAlphaOrNumeric'] },
			street2 : { v:['isAlphaOrNumeric'] , b:true },
			city : { v:['isAlphaOrNumeric'] },
			state : { v:['isAlphaOrNumeric'] , b : true },
			postal : { v:['isAlphaOrNumeric'] },
			country : { v:['isCountry'] }
			})
		
		if(data.failure) return data;
		!data.label?data.label = data.street1 : null;

		var r = yield _s_loc.helpers.address.validate(_s_util.clone.deep(data));
		if(r.failure) return r;

		var converted = yield _s_loc.helpers.address.extract({data:r[0], latlon:true});
		data = _s_util.merge(data , converted , true);
		return { success : { formatted : r[0].formatted_address, raw : data } }
		},
	'test' : function*(){

		var s = _s_load.engine('notifications');
		yield s.new.websocket({
			user : '568f535e923cf07534cac8a1',
			key : 'f5c0ec77482fe7586473acda28740fcd00c6a900',
			message : 'hi'
			})

		yield s.new.email({
			email : 'aamir@sellyx.com',
			subject : 'test',
			message : '<style>a{ font-weight:bold; font-size:20px; }</style><a href="www.sellyx.com">hello from sellyx</a><p>this is ot test stuff</p>'
			})
		

		// return get_arm = yield _s_req.sellyx({
		// 	path : 'notification/fetch',
		// 	method : 'GET',
		// 	params : {
		// 		user_id : 'hi'
		// 		}
		// 	})



		// return yield _s_req.sellyx({
		// 	new_key : 'Yp^$p8*jK.d8&QF79%3vcD!4KrP$m49tY/s',
		// 	method : 'POST',
		// 	type : 'urlquery',
		// 	url : 'https://mq.sellyx.com',
		// 	form : _s_req.post(),
		// 	headers : {
		// 		'Content-Type' : 'application/json'
		// 		}
		// 	})

		}
	}