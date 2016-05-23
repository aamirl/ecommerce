function Currency(){}
module.exports = function(){ return new Currency(); }

Currency.prototype = {
	init : function*(){
		this.data = {};
		// get the cached currencies
		console.log('getting cache')
		var currencies = yield this._s.cache.get('currencies');
		console.log('seeing cache')
		if(!currencies){
			console.log("Adadasdasdasd")
			var c = this._s.datafile('currencies');
			var get = yield this._s.req.http({
				url : 'https://openexchangerates.org/api/latest.json?app_id=611363b371cc4a34833286b6cfb961c1'
				})
			if(get.rates){
				_s_u.each(c, function(v,k){
					c[k].rate = get.rates[k]
					})

				this._s.cache.set('currencies', c);
				this.data.currencies = c;
				}
			}
		else{
			this.data.currencies = currencies;
			}

		var set = this._s.req.headers('currency');
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
	            return parseFloat( this._s.util.roundup(parseFloat(amt) / c.rate, 2) );
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

