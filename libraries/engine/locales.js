
// var i18n = new (require('i18n-2'))({
// 	locales : ['en', 'de'],
// 	directory : 'assets/locales/be',
// 	defaultLocale : 'en',
// 	objectNotation : true
// 	});


function Locales(){}

Locales.prototype = {
	init : function(){
		this.data = {};
		var set = this._s.req.headers('language');
		if( set && set == 'en' ){ this.active.set(set); }
		else{ this.active.set('en'); }

		!this.active.get() ? this.active.set('en') : null;
		},
	error: function(code){
		switch(code){
			case 101 :
				return { failure : { msg : 'You must be a seller to use this feature.' , code : 101 } }
				break;
			default :
				return { failure : { msg : 'There was an error.' , code : 300 } }
				break;
			}
		},
	get active() {
		var self = this;
		return {
			get : function(truthy){
				return self.data.active;
				},
			set : function(locale){
				self.data.active = locale;
				}
			}
		},
	// l : function(str, arr){
	// 	if(arr == undefined)
	// 		return i18n.__(str);
	// 	else
	// 		return i18n.__(str, arr);
	// 	},
	info : function(parameter, value, context, type){
		
		if(context && context.indexOf('.') != -1) {
			var r = context.split('.');
			context = r[0];
			type = r[1];
			}

		var locale = (context == undefined || context == false ? this._s.locale() : this._s.locale(context));
	
		if(type && locale[type][parameter] &&  locale[type][parameter][value]){
			return locale[type][parameter][value]
			}
		else if(locale[parameter] &&  !isNaN(Object.keys(locale[parameter])[0])){
			if(value == undefined) return locale[parameter];
			else return locale[parameter][value];
			}
		
		return value;
		},
	// convert an entire array's labels only, this is so that we don't always have to go through sutil for just labels
	convert : function(obj){
		var arr = obj.array ? obj.array : obj;
		var library = obj.library ? obj.library : false;
		var locale = this._s.locale(library);

		_s_u.each(arr, function(v,k){

			if(locale[k] && locale[k][v]){
				arr[k] = locale[k][v];
				}

			})


		return arr;
		}
	}

module.exports = function(){
  	return new Locales();
	}