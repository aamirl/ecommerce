

module.exports = {
	'images' : function*(){
		return { success : true }
		},
	'cache/delete' : function*(){
		yield this._s.cache.delete();
		},
	'address/validate' : function*(){
		var data = this._s.req.validate({
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

		var r = yield this._s.loc.helpers.address.validate(this._s.util.clone.deep(data));
		if(r.failure) return r;

		var converted = yield this._s.loc.helpers.address.extract({data:r[0], latlon:true});
		data = this._s.util.merge(data , converted , true);
		return { success : { formatted : r[0].formatted_address, raw : data } }
		},
	'test' : function*(){

		var s = this._s.engine('notifications');
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
		

		// return get_arm = yield this._s.req.sellyx({
		// 	path : 'notification/fetch',
		// 	method : 'GET',
		// 	params : {
		// 		user_id : 'hi'
		// 		}
		// 	})



		// return yield this._s.req.sellyx({
		// 	new_key : 'Yp^$p8*jK.d8&QF79%3vcD!4KrP$m49tY/s',
		// 	method : 'POST',
		// 	type : 'urlquery',
		// 	url : 'https://mq.sellyx.com',
		// 	form : this._s.req.post(),
		// 	headers : {
		// 		'Content-Type' : 'application/json'
		// 		}
		// 	})

		},
	'flag/listing' : function*(){

		var data = this._s.req.validate({
			id : { v:['isListing'] },
			entity : { v:['isEntity'] },
			reason : { v:['1','2','3','4','5'] },
			message : { v:['isTextarea'] }
			})
		if(data.failure) return data;

		yield this._s.common.new(data,'flags');
		
		}
	}