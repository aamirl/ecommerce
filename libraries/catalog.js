// Catalog Library

function Catalog(){

	}

Catalog.prototype = {

	model : _s_load.model('catalog'),
	get get() {
		var self = this;
		return {
			lines : {
				convert : function*(s){
					return yield _s_util.convert.single({ data:s, label:true, library:'products' , type : 'line' });
					},
				single : function*(obj){
					// input the data for a single product line as an object or as a 
					var s = obj.data?obj.data:obj;
					return yield self.lines.convert(s);
					},
				multiple : function*(obj){
					var s = obj.data?obj.data:obj;
					var send = [];
					yield _s_u.each(s, function*(o,i){
						s.push(yield self.lines.single(o));
						})
					}
				}
			}
		}
	
	}

module.exports = function(){
  	if(!(this instanceof Catalog)) { return new Catalog(); }
	}


















