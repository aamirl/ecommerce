
var validator = require('validator'),
	url = require('url'),
	parser = require('querystring');
	// parser = require('qs');

validator.extend('isAlphaOrNumeric', function(str){
	return true;
	if(typeof str != 'string') return false;


	try{
		var e = JSON.parse(str)
		return false;
		}
	catch(e){
		}

	return true;

	// var pattern = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
	// return pattern.test(str);
	// return true;
	})
validator.extend('isInt', function(str, filter){
    if(/^(?:-?(?:0|[1-9][0-9]*))$/.test(str)){
    	return parseInt(str);
    	}
	return false
	})
validator.extend('isFloat', function(str, filter){
    if(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/.test(str)){
    	return parseFloat(str);
    	}
	return false
	})

validator.extend('isTextarea', function(str, filter){

	// return str.nl2br();
	return str;

	// var pattern = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
	// return pattern.test(str);
	return true;
	})
// email verification code
validator.extend('isEVC',function(){
	return true;
	})
validator.extend('isSCard',function(str){
	try{
		var e = JSON.parse(str)
		return false;
		}
	catch(e){
		}
	return true;
	})
validator.extend('isOfferCode', function(){
	return true
	})
validator.extend('isWebsite',function(){
	return true;
	})
validator.extend('isProduct',function(){
	return true;
	})
validator.extend('isTransferRequest',function(){
	return true;
	})
validator.extend('isThread',function(){
	return true;
	})
validator.extend('isOrder',function(){
	return true;
	})
validator.extend('isOffer',function(){
	return true;
	})
validator.extend('isPostal',function(){
	return true;
	})
validator.extend('isSeller',function(){
	return true;
	})
validator.extend('isReturn',function(){
	return true;
	})
validator.extend('isUser',function(){
	return true;
	})
validator.extend('isNegotiation',function(){
	return true;
	})
validator.extend('isSearch',function(){
	// make sure it's not in search words
	return true;
	})
validator.extend('isListing',function(){
	return true;
	})
validator.extend('isInterest',function(){
	return true;
	})
validator.extend('isLocalListing',function(){
	return true;
	})
validator.extend('isPaL',function(){
	return true;
	})
validator.extend('isPromotion',function(){
	return true;
	})
// multiples
validator.extend('isArrayOfObjects', function(inp, filter){
	return true;
	})
validator.extend('isArray', function(inp, filter){
	if(inp.constructor == Array){
		if(inp.length == 0) return false
		if(filter) return inp;
		return true;
		}

	var all = inp.split(',');
	if(all.length == 0) return false;
	if(filter) return all;
	return true;
	})
validator.extend('isListings',function(){
	return true;
	})
validator.extend('isCategories',function(inp, filter){
	var categories = inp.split(',');
	if(categories.length > 0){
		// TODO : MAKE SURE EACH CATEGORY IS LEGITIMATE

		if(filter) return categories;
		else return true;
		}
	return false;
	})
validator.extend('isCountries',function(inp, filter){
	// var all = _s_load.library('countries')().get();
	var i = 0;
	var len = 0;
	var countries = inp.split(',');
	// var len = countries.length;
	// _s_u.each(countries, function(country, ind){
	// 	if(_s_util.indexOf(all, country ) !== -1) i++;
	// 	})
	if(len==i){
		if(filter) return countries;
		else return true;
		}
	else{
		return false;
		}
	})
validator.extend('isPaLs',function(inp, filter){
	var items = inp.split(',');
	if(items.length > 0){
		var send = [];
		var i=0;

		_s_u.each(items, function(item, ind){
			var pieces = item.split('-');
			// TODO : INSERT CHECK HERE TO MAKE SURE THAT PRODUCT AND LISTING PIECES ARE RIGHT
			var p = pieces.shift();
			if(filter) send.push({ product : p , listing : pieces.join('-') });
			i++; 
			})

		if(i == items.length){
			if(filter) return send;
			else return true;
			}
		return false
		}
	return false;
	})
validator.extend('isLine',function(inp, filter){
	inp = parseInt(inp);

	if(filter){
		return inp;
		}
	else{
		return true;
		}
	})
validator.extend('isManufacturer',function(inp, filter){
	
	if(typeof inp != 'string') return false;

	if(filter){
		return inp;
		}
	else{
		return true;
		}
	})
validator.extend('isDimension',function(inp, filter){
	if(isNaN(inp)){
		return false;
		}
	else{
		if(filter){
			return _s_load.library('dimensions').convert.back('length',inp);
			}
		else{
			return true;
			}
		}
	})
validator.extend('isWeight',function(inp, filter){
	if(isNaN(inp)){
		return false;
		}
	else{
		if(filter){
			return _s_load.library('dimensions').convert.back('weight',inp);
			}
		else{
			return true;
			}
		}

	})
validator.extend('isPrice', function(inp, filter){
	if(isNaN(inp)){
		return false;
		}
	else{
		if(filter){
			return _s_load.library('currency').convert.back(inp);
			}
		else{
			return true;
			}
		}
	})

validator.extend('isMonth',function(){
	return true;
	})
validator.extend('isDay',function(){
	return true;
	})
validator.extend('isYear',function(){
	return true;
	})
validator.extend('isDecimal', function(str,filter){
	var pattern = /([0-9]+\.)?[0-9]+/;
	if(pattern.test(str)){
		if(filter) return str;
		else return true;
		}
	return false;
	})

// datetime validation
validator.extend('isDate',function(inp, filter){
	if(_s_dt.valid.date(inp)){
		if(filter){
			return _s_dt.convert.date.input(inp);
			}
		else{
			return true;
			}
		}
	return false;
	})
validator.extend('isDateTime',function(inp, filter){
	if(_s_dt.valid.datetime(inp)){
		if(filter){
			return _s_dt.convert.datetime.input(inp);
			}
		else{
			return true;
			}
		}
	return false;
	})

validator.extend('isCurrency',function(){
	return true;
	})
validator.extend('isCategory',function(){
	return true;
	})
validator.extend('isCondition',function(inp){
	if([1,2,3,4,5,6,7,'1','2','3','4','5','6','7'].indexOf(inp) == -1) return false; 
	return true;
	})
validator.extend('isCountry',function(){
	return true;
	})
validator.extend('isImages',function(){
	return true;
	})
validator.extend('isUPC',function(){
	return true;
	})
validator.extend('isEAN',function(){
	return true;
	})
validator.extend('isISBN',function(){
	return true;
	})
validator.extend('isMPN',function(){
	return true;
	})
validator.extend('isISSN',function(){
	return true;
	})

// Address Validators
validator.extend('isPhone', function(){
	return true;
	})
validator.extend('isCarrier', function(){
	return true;
	})
validator.extend('isStreet', function(){
	return true
	})
validator.extend('isCity', function(){
	return true
	})

// payment validators
validator.extend('isCC', function(inp, filter){
	return true;
	})
validator.extend('isCVC', function(inp, filter){
	return true;
	})

function Request(req){
	this.request = req;
	// this.ip = this.request.ip;
	this.current_ip = '72.21.92.59';
	this.GET_PARAMS = this.POST_PARAMS = [];

	var method = this.request.req.method;

	if (method == 'GET') var params = parser.parse(this.request.req._parsedUrl.query)
	else if(method == 'POST') var params = this.request.body;
	
	// console.log(params);

	// for(var key in params){

	// 	if(key == ''){ delete params[key] }
	// 	else if(typeof params[key] == 'object'){ return; }
	// 	else{ params[key] = validator.trim(params[key]); }
	// 	}

	this[method + '_PARAMS'] = params;
	}

Request.prototype = {
	koa : function*(obj , raw){
		var r = yield require('koa-request')(obj);
		if(raw) return JSON.parse(r);
		try{
			r= JSON.parse(r).body;
			}
		catch(e){
			return JSON.parse(r.body);
			}
		try{
			return JSON.parse(r);
			}
		catch(e){}
		},
	// koa : require('koa-request'),
	ip : function(){
		return this.current_ip;
		},
	get : function(param){
		if(param == undefined) return this.GET_PARAMS;
		else return (this.GET_PARAMS[param] || false);
		},
	post : function(param){
		if(param == undefined) return this.POST_PARAMS;
		else return (this.POST_PARAMS[param] || false)
		},
	validate : function(obj){
		if (obj.validators) var data = obj.validators
		else var data = obj;
		
		if(obj.get !== undefined) {
			var all_data = this.get();
			}
		else if(obj.data !== undefined){
			try{ var all_data = JSON.parse(obj.data); } 
			catch(err){ var all_data = obj.data; }
			}
		else {
			var all_data = this.post();
			}

		var abnorms = ['',0,undefined,'undefined',null,'null','0.00',0.00,'0'];
		var autoFilters = ['isPrice','isTextarea','isDecimal','isDimension','isArray','isWeight','isDate','isDateTime','isInt','isFloat'];

		var i = 0, data_total = data.length, errors = [], send = {};


		_s_u.each(data, function(i_data,i){
			// eon

			if(i == 'eon'){
				var eon_counter = 0;
				var done = false;
				do{
					eon_counter++;
					if(i_data[eon_counter]){
						var tangent = _s_req.validate({ validators : i_data[eon_counter] , data: all_data });
						if(!tangent.failure) {
							send = _s_util.merge(send,tangent);
							done = true;
							} 
						}
					else{
						errors.push('eon');
						}
					}
				while(!done && errors.length == 0);
				}
			// this is backend generated variables that can be used to regroup data
			else if(i_data.backend){
				var tangent = _s_req.validate({ validators : i_data.validators, data : i_data.data });
				tangent.failure ? errors = errors.concat(tangent.failure) : send[i] = tangent;
				}
			else if(all_data[i] && _s_util.indexOf(abnorms, all_data[i]) === -1){

				if(i_data.v){
					var total  = i_data.v.length;
					var count = 0;
					var json = false;
					var filter = false;
					_s_u.each(i_data.v, function(flag){
						flag == 'isJSON' ? json = true : null;
						_s_util.indexOf(autoFilters, flag) !== -1 ? filter = flag : null;
						validator[flag](all_data[i]) ? count++ : null;
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
					else{
						errors.push(i);
						}
					}
				else if(i_data.t){
					switch(i_data.t){
						case 'pw':
							(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,16}$/).test(all_data[i]) ? send[i] = all_data[i] : errors.push(i);
							break;
						}
					// other type validators here
					}
				else if(i_data.in){
					if((i_data.in).indexOf(all_data[i]) !== -1){
						send[i] = all_data[i]
						}
					else{
						if(i_data.default || i_data.default == 0) send[i] = i_data.default
						else errors.push(i);
						}
					}
				else if(i_data.c_in){
					var parts = (all_data[i].constructor == Array ? all_data[i] : all_data[i].split(',') );
					var tester = new RegExp((i_data.c_in).join('|'));

					_s_u.each(parts, function(part, ind){

						if(!tester.test(part)) parts.splice(ind,1);
						})


					if(parts.length > 0){
						if(i_data.array){
							send[i] = parts;
							}
						else{
							send[i] = parts.join(',');
							}
						}
					else{
						if(i_data.default || i_data.default == 0) send[i] = i_data.default
						else errors.push(i);
						}

					}
				else if (i_data.json){
					try{ var s = JSON.parse(all_data[i]); }
					catch(err){ var s = all_data[i] }

					var tangent = _s_req.validate({
						validators : i_data.data,
						data : s
						})

					tangent.failure ? errors = errors.concat(tangent.failure) : send[i] = tangent;
					}
				else if (i_data.range){
					var parts = all_data[i].split(',');

					if(parts.length == 2 && parts[0] >= i_data.range[0] && parts[1] <= i_data.range[1] ){
						if(i_data.array){
							send[i] = parts;
							}
						else{
							send[i] = parts.join(',');
							}
						}
					else{
						if(i_data.default || i_data.default == 0) send[i] = i_data.default
						else errors.push(i);
						}

					}	
				else if(i_data.eo){
					var t = {};
					t[i] = i_data.self;

					var tangent = _s_req.validate({ validators: t , data : all_data });
					tangent.failure ? errors.push(i) : send[i] = all_data[i];
					}
				else if(i_data.eo2){
					var u = {data:all_data,validators:{}};
					u.validators[i] = i_data.eo2[1]
					var tangent = _s_req.validate(u);
					
					if(tangent.failure){
						u = {data:all_data,validators:{}};
						u.validators[i] = i_data.eo2[2]
						var tangent = _s_req.validate(u);
						tangent.failure ? errors.push(i) :send[i] = tangent[i];
						}
					else{ send[i] = tangent[i] }
					}
				else if(i_data.dependency){

					if(i_data.dependency[all_data[i]]){
						if(i_data.dependency[all_data[i]] != 'none'){
							var tangent = _s_req.validate({validators : i_data.dependency[all_data[i]], data : all_data});
							if(tangent.failure){ errors = errors.concat(tangent.failure) }
							else {
								send = _s_util.merge(send, tangent);
								send[i] = all_data[i];
								}
							}
						else{
							send[i] = all_data[i];
							}
						}
					else{
						errors.push(i);
						}
					}
				else if(i_data.child){
					// this means that the data is json, and should be parsed first
					try{ var d = JSON.parse(all_data[i]) } catch(err){ errors.push(i) }

					var tangent = _s_req.validate({
						validators : i_data.child,
						data : d
						})
					tangent.failure ? errors = errors.concat(tangent.failure) : send[i] = tangent;
					}
				else if(i_data.extra){
					// this means that the expected value is supposed to be a json object and the json object will have an extra field and a value
					try {
						all_data[i] = JSON.parse(all_data[i]);
						}
					catch(err){
						errors.push(i)
						return;
						}

					if(all_data[i].value && i_data.extra.values[all_data[i].value]){
						if(i_data.extra.values[all_data[i].value] == 'none'){ send[i] = { value : all_data[i].value } }
						else {
							var tangent = _s_req.validate({ validators : { extra : i_data.extra.values[all_data[i].value] } , data : all_data[i] })
							tangent.failure ? errors.push(i) : send[i] = { value : all_data[i].value , extra : tangent.extra }
							}
						}
					else{
						errors.push(i);
						}

					}
				}
			else{
				// this is if we arent providing a value, we want to set the value to the default and then check the rest of the information for dependencies that will be basedo n the b value of the validation. a default value MUST be provided here or else the request wont work
				if(i_data.dependency){
					if(i_data.dependency.b){
						var tangent = _s_req.validate({validators : i_data.dependency.b.data, data : all_data});
						if(tangent.failure){
							errors = errors.concat(tangent.failure);
							}
						else{
							send = _s_util.merge(send, tangent);
							send[i] = i_data.dependency.b.default;
							}
						}
					else{
						errors.push(i);
						}
					}
				else if(i_data.eo){
					var tangent = _s_req.validate({validators : i_data.eo, data : all_data});
					if(tangent.failure){
						errors.push(i);
						}
					else{
						send = _s_util.merge(send, tangent);
						}
					}
				// we are putting this here just in case we have an array and it has a 0 field in it
				else if(i_data.in){
					if((i_data.in).indexOf(all_data[i]) !== -1){
						send[i] = all_data[i]
						}
					else if(i_data.default || i_data.default == 0){
						send[i] = i_data.default
						}
					else if(i_data.b){
						return;
						}
					else{
						errors.push(i);
						}
					}
				else{
					if(i_data.b){
						if(i_data.default || i_data.default == 0){
							send[i] = i_data.default;
							}
						else if(all_data[i] == 0){
							send[i] = 0;
							}
						else if(i_data.b == 'array'){
							send[i] = [];
							}
						}
					else if(i_data.default || i_data.default == 0){
						send[i] = i_data.default;
						}
					else{
						errors.push(i);
						}
					}
				}
			})

		if(errors.length == 0) return send;
		else return {failure : errors};
		}
	}


module.exports = function(req){
	if(!(this instanceof Request)) { return new Request(req); }
	}
