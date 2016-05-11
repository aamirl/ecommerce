module.exports = function(validator, _s){
  	
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
	validator.extend('isStringInt', function(str, filter){
	    if(/^(?:-?(?:0|[1-9][0-9]*))$/.test(str)){
	    	return str.toString();
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
	validator.extend('isCombination',function(){
		return true;
		})
	validator.extend('isTransferRequest',function(){
		return true;
		})
	validator.extend('isMessageThread',function(){
		return true;
		})
	validator.extend('isOrder',function(){
		return true;
		})
	validator.extend('isListingOrder',function(){
		return true;
		})
	validator.extend('isListingKey',function(){
		return true;
		})
	validator.extend('isOffer',function(){
		return true;
		})
	validator.extend('isPostal',function(){
		return true;
		})
	validator.extend('isEntity',function(){
		return true;
		})
	validator.extend('isReturn',function(){
		return true;
		})
	validator.extend('isReview',function(){
		return true;
		})
	validator.extend('isUser',function(){
		return true;
		})
	validator.extend('isNegotiation',function(){
		return true;
		})
	validator.extend('isNegotiationOffer',function(){
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
		// var all = _s.library('countries')().get();
		var i = 0;
		var len = 0;
		var countries = inp.split(',');
		// var len = countries.length;
		// _s_u.each(countries, function(country, ind){
		// 	if(_s.util.indexOf(all, country ) !== -1) i++;
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

			_s_u.each(items, function(item,ind){
				if(filter) send.push(item);
				i++;
				})

			// _s_u.each(items, function(item, ind){
			// 	var pieces = item.split('-');
			// 	// TODO : INSERT CHECK HERE TO MAKE SURE THAT PRODUCT AND LISTING PIECES ARE RIGHT
			// 	var p = pieces.shift();
			// 	if(filter) send.push({ product : p , listing : pieces.join('-') });
			// 	i++; 
			// 	})

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
				return _s.dimensions.convert.back('length',inp);
				}
			else{
				return true;
				}
			}
		})
	validator.extend('isDistance',function(inp, filter){
		if(isNaN(inp)){
			return false;
			}
		else{
			if(filter){
				if(_s.dimensions.active.get() == 'US'){
					return (inp * 1.60934).toFixed(2)
					}
				return inp;
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
				return _s.dimensions.convert.back('weight',inp);
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
				return _s.currency.convert.back(inp);
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
		if(_s.dt.valid.date(inp)){
			if(filter){
				return _s.dt.convert.date.input(inp);
				}
			else{
				return true;
				}
			}
		return false;
		})
	validator.extend('isDateTime',function(inp, filter){
		return true;
		if(_s.dt.valid.datetime(inp)){
			if(filter){
				return _s.dt.convert.datetime.input(inp);
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
	validator.extend('isCategory',function(inp){
		if(["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19"].indexOf(inp) == -1) return false; 
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

	}