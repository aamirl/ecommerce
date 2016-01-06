

module.exports = {
	'images' : function*(){
		return { success : true }
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
		}
	}