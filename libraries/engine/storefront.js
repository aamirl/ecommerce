
function Storefront(){
	this.root = _s_load.datafile('categories/root');
	this.detailed = _s_load.datafile('categories/detailed');
	}



Storefront.prototype = {
	model : _s_load.model('storefront'),
	condition : function(cid){
		return _s_l.info('condition', cid);
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



module.exports = function(){
  	if(!(this instanceof Storefront)) { return new Storefront(); }
	}

