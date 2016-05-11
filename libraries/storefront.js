
function Storefront(){}

Storefront.prototype = {
	init : function(){
		this.root = this._s.datafile('categories/root');
		this.detailed = this._s.datafile('categories/detailed');
		},
	condition : function(cid){
		return this._s.l.info('condition', cid);
		},
	get categories() {
		var self = this;
		return {
			decode : function(cid){
				var parts = cid.match(/[\s\S]{1,2}/g) || [];

				if(cid.length == 2) return {name:self.root[cid]};

				var obj = self.detailed;

				_s_u.each(parts, function(o,i){
					obj = obj[o].children ? obj[o].children : obj[o]
					})
		
				return obj;
				},
			name : function(cid){
				return self.categories.decode(cid).name || 'Unknown';
				},
			list : function(cid){
				return self.categories.decode(cid) || self.list
				},
			table : function(cid){
				return self.categories.decode(cid).table || false;
				}
			}
		}
	}



module.exports = function(){return new Storefront(); }

