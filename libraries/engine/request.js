
var validator = require('validator'),
	url = require('url'),
	parser = require('querystring');

require(_s_config.paths.helpers+'extenders.js')(validator);

function Request(req){
	this.request = req;
	// this.ip = this.request.ip;
	this.current_ip = '72.21.92.59';
	this.GET_PARAMS = this.POST_PARAMS = [];

	var method = this.request.req.method;

	if (method == 'GET') var params = this.request.query;
	else if(method == 'POST') var params = this.request.body;
	this[method + '_PARAMS'] = params;
	console.log(params);
	}

Request.prototype = {
	
	http : function*(obj, raw){
		var r = require('koa-request');

		!obj.headers?obj.headers={}:null;
		!obj.method?obj.method='GET':null;
		!obj.form?obj.form={}:null;
		!obj.url?obj.url=_s_config.oAuth+obj.path:null;
		if(obj.data) obj.form = obj.data;

		if(obj.params){
			obj.url += '?';
			_s_u.each(obj.params, function(v,k){
				obj.url+="&" + k+'='+v;
				})
			}

		var j = yield r(obj);
		if(raw) return JSON.parse(j);
		try{
			j= JSON.parse(j).body;
			}
		catch(e){
			return JSON.parse(j.body);
			}
		try{
			return JSON.parse(j);
			}
		catch(e){}

		},	 
	sellyx : function*(obj,raw){

		var r = require('koa-request');

		!obj.headers?obj.headers={}:null;
		!obj.method?obj.method='GET':null;
		!obj.form?obj.form={}:null;
		!obj.url?obj.url=_s_config.oAuth+obj.path:null;
		if(obj.data) obj.form = obj.data;

		if(obj.params){
			obj.url += '?';
			_s_u.each(obj.params, function(v,k){
				obj.url+="&" + k+'='+v;
				})
			}

		obj.time = _s_dt.epoch();

		obj.headers.authorization = 'SYX ' + _s_req.hash(obj);
		obj.headers['sellyx-time'] = obj.time;

		obj.rejectUnauthorized = false;

		var j = yield r(obj);
		if(raw) return JSON.parse(j);
		try{
			j= JSON.parse(j).body;
			}
		catch(e){
			return JSON.parse(j.body);
			}
		try{
			return JSON.parse(j);
			}
		catch(e){}
		},
	hash : function(obj){
		var crypto = require('crypto');

		var str = obj.method + "\n" + obj.time  + "\n" + "/" + obj.path;
		var token = crypto.createHmac('sha256','Ys$pZzq69I#p4JKC8%3hvo01fKrP$m49tY/s').update(str).digest('hex');
		return new Buffer(token).toString('base64');
		},
	ip : function(){
		return this.current_ip;
		},
	url : function(){
		return 
		},
	get : function(param){
		if(param == undefined) return this.GET_PARAMS;
		return (this.GET_PARAMS[param] || false);
		},
	post : function(param){
		if(param == undefined) return this.POST_PARAMS;
		else return (this.POST_PARAMS[param] || false)
		},
	headers : function(param){
		if(param == undefined) return this.request.headers;
		return (this.request.headers[param]||false);
		},
	validate : function(obj , tang){
		var data = (obj.validators?obj.validators:obj);
	
		if(obj.get) { var all_data = this.get(); }
		else if(obj.data){
			try{ var all_data = JSON.parse(obj.data); } 
			catch(err){ var all_data = obj.data; }
			}
		else { var all_data = this.post(); }

		var i = 0, data_total = data.length, errors = {}, send = {}, abnorms = ['',0,undefined,'undefined',null,'null','0.00',0.00,'0'] , autoFilters = ['isPrice','isTextarea','isDecimal','isDimension','isArray','isWeight','isDate','isDateTime','isInt','isFloat','isDistance'], send_tangent=(obj.tangent?obj.tangent:false);

		_s_u.each(data, function(i_data,i){
			
			if(i == 'eon'){
				var eon_counter = 0;
				var done = false;
				do{
					eon_counter++;
					if(i_data[eon_counter]){
						var tangent = _s_req.validate({ validators : i_data[eon_counter] , data: all_data , tangent : true });
						if(!tangent.failure) {
							send = _s_util.merge(send,tangent);
							done = true;
							} 
						}
					else errors['eon'] = tangent.failure;
					}
				while(!done && !errors['eon']);
				}
			else if(all_data[i] && _s_util.indexOf(abnorms, all_data[i]) === -1){

				if(i_data.v){
					var total  = i_data.v.length , count = 0 , json = false , filter = false, sub_errors = []
					_s_u.each(i_data.v, function(flag){
						if(flag == 'isJSON'){
							json = true;
							if(typeof all_data[i] == 'object'){ count++; }
							else{
								try{ JSON.parse(all_data[i]); count++; }
								catch(err){ errors[i] = { msg : 'This was not properly formatted JSON.' , data : all_data[i] } }
								}
							}
						else{
							_s_util.indexOf(autoFilters, flag) !== -1 ? filter = flag : null;
							validator[flag](all_data[i]) ? count++ : sub_errors.push(flag)
							}						
						});

					if(count == total){
						if(json){
							try{ var s = JSON.parse(all_data[i]); }
							catch(err){ var s = all_data[i] }
							}
						else{
							if(i_data.filter){
								var s = validator[i_data.filter](all_data[i], true);
								}
							else if(filter){
								var s = validator[filter](all_data[i], true);
								}
							else{
								var s = all_data[i];
								}
							}
						send[i] = s;
						}
					else errors[i] = {msg: 'There were errors with your submission; it did not meet the requirements necessary.' , data : all_data[i] , failed : sub_errors }
					}
				else if(i_data.extra){
					// this means that the expected value is supposed to be a json object and the json object will have an extra field and a value
					try {all_data[i] = JSON.parse(all_data[i]); }
					catch(err){errors[i] = { msg : 'This was not a valid JSON object.', data : all_data[i] }; return; }

					if(all_data[i].value && i_data.extra.values[all_data[i].value]){
						if(i_data.extra.values[all_data[i].value] == 'none'){ send[i] = { value : all_data[i].value } }
						else {
							var tangent = _s_req.validate({ validators : { extra : i_data.extra.values[all_data[i].value] } , data : all_data[i] , tangent:true })
							tangent.failure ? errors[i] = { msg : 'The accompanying value submitted did not meet the requirements.' , accepted : Object.keys(i_data.extra.values) } : send[i] = { value : all_data[i].value , extra : tangent.extra }
							}
						}
					else{
						errors[i] = { msg : 'The accompanying value submitted was not an accepted value.' , accepted : Object.keys(i_data.extra.values) , data : all_data[i] }
						errors.push(i);
						}

					}
				else if(i_data.aoo){
					// means array of objects

					if(all_data[i].constructor != Array){ errors[i] = { msg:'This must be submitted as an array.',  data : all_data[i] } }
					else{
						var m_send = [];
						if(all_data[i].length == 0){
							if(!i_data.b) errors[i] = { msg : 'This cannot be an empty array.' , data: all_data[i] }
							if(i_data.default) send[i] = i_data.default;
							}
						else{
							_s_u.each(all_data[i], function(obj,ind){
								if(typeof obj != 'object'){
									!errors[i] ? errors[i] = {} : null;
									errors[i][ind] = { msg : 'The item in this array at the index ' + ind + ' was not a valid JSON object.' , data : obj }
									return;
									}

								// we validate each object separately with the data
								var tangent = _s_req.validate({ validators : i_data.data , data: obj , tangent : true });
								
								if(tangent.failure){
									!errors[i] ? errors[i] = {} : null;
									errors[i][ind] = { msg : 'The object at index '+ind+' was not submitted with the proper key/value pairs.' , data : tangent.failure }
									}
								else{
									m_send.push(tangent);
									}
								})
							
							if(!errors[i]) send[i] = m_send;
							}
						}
					}
				else if(i_data.in){
					if((i_data.in).indexOf(all_data[i]) !== -1){
						send[i] = all_data[i]
						}
					else{
						if(i_data.default || i_data.default == 0) send[i] = i_data.default
						else errors[i] = { msg : 'The submitted data was not in the range of accepted values for this property.' , data : all_data[i] , accepted : i_data.in } ;
						}
					}
				else if(i_data.csv_in){
					var parts = (all_data[i].constructor == Array ? all_data[i] : all_data[i].split(',') );
					var tester = new RegExp((i_data.csv_in).join('|'));

					_s_u.each(parts, function(part, ind){
						if(!tester.test(part)) parts.splice(ind,1);
						})


					if(parts.length > 0) send[i] = (i_data.csv?parts.join(','):parts);
					else{
						if(i_data.default || i_data.default == 0) send[i] = i_data.default
						else errors[i] = { msg : 'The submitted data was not in the range of accepted values for this property.' , data : all_data[i] , accepted : i_data.csv_in } ;
						}

					}
				else if(i_data.json){
					try{ var s = JSON.parse(all_data[i]); }
					catch(err){ var s = all_data[i] }

					if(typeof s != 'object') errors[i] = { msg : 'This was not properly formatted JSON.' , data : all_data[i] }

					if(Object.keys(s).length == 0){
						if(i_data.default || i_data.default == 0){send[i] = i_data.default; }
						else errors[i] = { msg : 'This was not submitted at all.' }
						}
					else{
						var tangent = _s_req.validate({
							validators : i_data.data,
							data : s, 
							tangent : true 
							})

						tangent.failure ? errors[i] = tangent.failure : send[i] = tangent;
						}
					}
				else if(i_data.range){
					var parts = all_data[i].split(',');

					if(parts.length == 2 && parts[0] >= i_data.range[0] && parts[1] <= i_data.range[1] ) send[i] = (i_data.csv?parts.join(','):parts);
					else{
						if(i_data.default || i_data.default == 0) send[i] = i_data.default
						else errors[i] = { msg : 'The submitted data was not in the range of accepted values for this property.' , data : all_data[i] , accepted : i_data.range } ;
						}

					}
				else if(i_data.dependency){
					if(i_data.data[all_data[i]]  || i_data.default ){
						var tester = ( i_data.data[all_data[i]] || i_data.default )
						if(tester != 'none'){
							var tangent = _s_req.validate({validators : tester, data : all_data , tangent : true });
							if(tangent.failure){  errors[i] = tangent.failure }
							else {
								send = _s_util.merge(send, tangent);
								send[i] = all_data[i];
								}
							}
						else send[i] = all_data[i];
						}
					else errors[i] = { msg : 'The submitted data is not an allowed value for this property.' , data : all_data[i] , accepted : Object.keys(i_data.dependency) } ;
					}
				}
			else{
				if(i_data.dependency){
					if(i_data.b){
						var tangent = _s_req.validate({validators : i_data.b.data, data : all_data, tangent : true });
						if(tangent.failure) errors[i] = tangent.failure;
						else{
							send = _s_util.merge(send, tangent);
							send[i] = i_data.b.default;
							}
						}
					else errors[i] = { msg : 'This was not submitted at all.' }
					}
				// we are putting this here just in case we have an array and it has a 0 field in it
				else if(i_data.in){
					if((i_data.in).indexOf(all_data[i]) !== -1){send[i] = all_data[i] }
					else if(i_data.default || i_data.default == 0){send[i] = i_data.default }
					else if(i_data.b){ return; }
					else errors[i] = { msg : 'This was not submitted at all.' }
					}
				else{
					if(i_data.b){
						if(i_data.default || i_data.default == 0){send[i] = i_data.default; }
						else if(all_data[i] === 0){send[i] = 0; }
						else if(i_data.b == 'array'){send[i] = []; }
						}
					else if(i_data.default || i_data.default == 0){send[i] = i_data.default; }
					else errors[i] = { msg : 'This was not submitted at all.' }
					}
				}
			})

		if(Object.keys(errors).length == 0) return send;
		else  {
			if(send_tangent) return {failure:errors};
			else return {failure : {msg : 'There were validation errors in the data you submitted', data :errors, code : 400} }
			}
		}
	}


module.exports = function(req){
	if(!(this instanceof Request)) { return new Request(req); }
	}
