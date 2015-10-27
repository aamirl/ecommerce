
var currencies = {
	1 : {name:'US Dollars', abbr : 'USD', sign : '$', rate : 1.00},
	2 : {name:'Pounds', abbr : 'GBP', sign : '£', rate : 0.67},
	3 : {name:'Rupees', abbr : 'Rs', sign : '₹', rate : 62.17},
	};


function Currency(){
	!this.active.get() ? this.active.set(1) : null;
	}

Currency.prototype = {
	active : {
		get : function(truthy){
			return  _s_session.get('active.currency', truthy);
			},
		set : function(currencyId){
			_s_session.set('active.currency', currencyId);
			}
		},
	format : function(i,n,x){
	// format : function(n, c, d, t){
		// var c = isNaN(c = Math.abs(c)) ? 2 : c, 
		// d = d == undefined ? "." : d, 
		// t = t == undefined ? "," : t, 
		// s = n < 0 ? "-" : "", 
		// i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
		// j = (j = i.length) > 3 ? j % 3 : 0;
		// return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");


		/**
		 * Number.prototype.format(n, x)
		 * 
		 * @param integer n: length of decimal
		 * @param integer x: length of sections
		 */

		 var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    	return i.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
		},
	get convert() {
		var self = this;
		return {
			front : function(price, no_name){
				var c = currencies[self.active.get()];
				
	            if(no_name == undefined || no_name == false) return c.sign + self.format(price * c.rate, 2,3);
	            else return self.format(price * c.rate, 2,3);
				},
			back : function(amt){
	            var c = currencies[self.active.get()];
	            return parseFloat((parseFloat(amt) * c.rate).toFixed(2));
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
					id : price,
					label : self.convert.front(price)
					}
				}
			}
		}
	}



module.exports = function(){
  	if(!(this instanceof Currency)) { return new Currency(); }
	}

