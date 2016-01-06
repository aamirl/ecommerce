
function Storefront(){
	this.list = _s_load.datafile('categories');
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

				var obj = self.list;

				_s_u.each(parts, function(o,i){
					obj = obj[o].children ? obj[o].children : obj[o]
					})
				return obj || undefined;
				},
			name : function(cid){
				return self.categories.decode(cid).name || 'Unknown';
				},
			list : function(cid){
				return self.categories.decode(cid) || self.list
				},
			table : function(cid){
				return self.categories.decode(cid).table || false;
				},
			tree : function*(category){
				var all = yield this.list();
				var parts = category.match(/.{1,2}/g);
				var matched = [];
				var tester = '';
				var zeroes = '000000000000';

				_s_u.each(parts, function(piece, index){

					if(piece !== '00'){
						tester += piece;
						matched.push(all[tester + (zeroes.substr(0, 12-tester.length))].category_name);
						}
					else{
						return false;
						}

					})
				return matched;
				}
			}
		}
	}



module.exports = function(){
  	if(!(this instanceof Storefront)) { return new Storefront(); }
	}

