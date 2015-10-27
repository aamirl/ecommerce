// Products Object

module.exports = function*(data){
  	if(!(this instanceof Products)) { var r = new Products(data); yield r.init(data); return r; }
	}

function Products(){}
Products.prototype = {
	init : function*(data){

		if(typeof data != 'object'){
			// let's load the product from the database
			var _product = _s_load.library('products');
			var result = yield _product.get({ id : data , convert : false, objectify : false });
			if(!result) { this.failure = { msg : 'The product could not be found.' , code : 300 }; }
			else {
				result.id = data;
				this.data = result;
				}

			}
		else{ this.data = data; }

		},
	library :  yield _s_load.library('products'),
	document : function(){
		return data;
		},
	name : function(){
		return data.line.manufacturer.name + ' ' + data.line.name + ' ' + data.name 
		},
	find : {
		listing : function(obj){
			// returns an object and an index for data.sellers

			if(obj.seller) return _s_util.array.find.object(data.sellers, 'id' , obj.seller , true , 'seller' );
			else if(obj.id) return _s_util.array.find.object(data.sellers, 'id' , obj.id , true );
			}
		},
	actions : {
		update : function*(obj){
			// var c = (obj.merge?_s_util.merge(data,doc):data);

			// var update = yield self.library.update(c);
			// if(update){
			// 	data = c;
			//  	return { success : { data: data } }
			// 	}
			// return { failure : { msg : 'The product could not be updated at this time.' , code : 300 } }
			// }

			}
		}
	}