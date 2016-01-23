
function Taxes(){}



Taxes.prototype = {
	calculate : function(obj){
		var price = (obj.price?obj.price:obj);
		return price * 0.09;
		}
	}



module.exports = function(){
  	if(!(this instanceof Taxes)) { return new Taxes(); }
	}

