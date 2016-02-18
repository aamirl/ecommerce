function Currency(){
	this.data = {};
	}

Currency.prototype = {
	init : function*(){
		// get the cached currencies
		var currencies = yield _s_cache.get('currencies');
		if(!currencies){
			var c = _s_load.datafile('currencies');
			var get = yield _s_req.http({
				url : 'https://openexchangerates.org/api/latest.json?app_id=611363b371cc4a34833286b6cfb961c1'
				})
			if(get.rates){
				_s_u.each(c, function(v,k){
					c[k].rate = get.rates[k]
					})

				_s_cache.set('currencies', c);
				this.data.currencies = c;
				}
			}
		else{
			this.data.currencies = currencies;
			}

		var set = _s_req.headers('currency');
		if( set && this.data.currencies[set] ){ this.active.set(set); }
		else{ this.active.set('USD'); }
		},
	get helpers(){
		var self = this;
		return {
			valid : function(){
				return Object.keys(self.data.currencies);
				},
			}
		},
	get active() {
		var self = this;
		return {
			get : function(truthy){
				return self.data.active;
				},
			set : function(currencyId){
				self.data.active = currencyId
				}
			}
		},
	format : function(i,n,x){
		var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    	return i.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
		},
	get convert() {
		var self = this;
		return {
			fromto : function(price, from, to){
				from = self.data.currencies[from];
				to = self.data.currencies[to];

				if(!from || !to) return 0.00;
	            var stand = parseFloat(price / from.rate);
	            return stand * to.rate;
				},
			front : function(price, no_name){
				var c = self.data.currencies[self.active.get()];
				
	            if(no_name == undefined || no_name == false) return (c.sign?c.sign:c.abbr+' ') + self.format(price * c.rate, 2,3);
	            else return self.format(price * c.rate, 2,3);
				},
			back : function(amt){
	            var c = self.data.currencies[self.active.get()];
	            return parseFloat((parseFloat(amt) / c.rate).toFixed(2));
				},
			array : {
				front : function(obj){
					var data = (obj.data ? obj.data : obj);
					_s_u.each(data, function(v,k){

						if(obj.objectify){
							data[k] = self.convert.objectify(v);
							}
						else{
							data[k] = self.convert.front(v)
							}


						})

					return data;
					}
				},
			objectify : function(price){
				return {
					data : price,
					converted : self.convert.front(price)
					}
				}
			}
		}
	}



module.exports = function*(){
  	if(!(this instanceof Currency)) { 
  		var c = new Currency(); 
  		yield c.init()
  		return c; 
  		}
	}

