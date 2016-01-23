// Returns Library

var _currency = _s_load.library('currency');

function Returns(){}

Returns.prototype = {

	model : _s_load.model('returns'),
	helpers : {
		// check to see whether item is eligible for a return
		check : function(obj , policy){
			var message = (obj.message?obj.message:false);
			var item = (obj.targ?obj.targ:obj);
			// var item = obj;

			// run item checks here
			if(item.waived){
				if(message) return { failure : 'The return policy on this item was waived. This item is no longer covered by any return policy or warranty.' };
				else return false;
				}
			if(item.no_returns){
				if(message) return { failure : 'There are no returns allowed on this item.' };
				else return false;
				}
			if(item.status == 19){
				if(message) return { failure : 'This item has already been returned or is pending a return. Please check the return table for more details' }
				else return false;
				}
			if(_s_util.indexOf([7,16], item.status) == -1){
				if(message) return { failure : "This item is not eligible for a return." }
				else return false;
				}
			if(item.status == 7) {
				var date = _s_dt.add( (item.shipping.service ? item.shipping.service.tracking.added : item.shipping.services.l3.tracking.added ) , '30' , 'days' )
				}
			else {
				if(policy){
					var date = _s_dt.add(item.shipping.service.tracking.added , policy.duration, 'days');
					}
				else{
					if(message) return { failure : 'At the time of purchase, the seller did not have an active return policy that allowed for returns. For more information, please contact the seller directly.' }
					else return false
					}
				}


			if(_s_dt.compare.after(date,'now')){
				if(message) return true
				else return _s_dt.convert.datetime.output(date)
				}
			return false;
			},
		filters : function(){
			return {
				q : { v:['isSearch'] , b : true},
				id : { v:['isReturn'] , b:true },
				user : { v:['isUser'] , b:true },
				seller : { v:['isSeller'] , b:true },
				convert : { in:['true','false'] , default : 'true' },
				include : { v:['isAlphaOrNumeric'], b:true },
				exclude : { v:['isAlphaOrNumeric'], b:true },
				active : { v:['isAlphaOrNumeric'], b:true },
				x : { v:['isInt'] , b:true , default : 0 },
				y : { v:['isInt'] , b:true , default : 10 }
				};
			},
		validators : function(){
			return {
				id : {v:['isOrder']},
				listing : {v:['isListing']},
				reason : { in:[1,2,3,4,5,6,7,'1','2','3','4','5','6','7'] },
				quantity : { v:['isInt'] },
				details : { v:['isAlphaOrNumeric'] , b:true }
				}
			},
		convert : {
			return : function*(s,type){
				s.policy = _s_l.convert({ array : s.policy, library : 'returns' });
				s.item.totals = _currency.convert.array.front(s.item.totals);

				if(s.processed) s.processed = yield _s_util.convert.single({ data:s.processed , library : 'returns' })
				if(s.shipped) s.shipped.added = _s_dt.convert.datetime.output(s.shipped.added);
				if(s.received) s.received.added = _s_dt.convert.datetime.output(s.received.added);

				return yield _s_util.convert.single({ data : s , library : 'returns' , type : type , label:'setup|reason' });
				}
			}
		},
	get : function*(obj){
		return yield _s_common.get(obj, 'returns');
		},
	new : function*(obj){
		if(obj && obj.data){var data = obj.data; } 
		else{
			var data = _s_req.validate(this.helpers.validators());
			}

		if(data.failure) return data;

		var order = _s_load.library('orders').model.get(data.id);
		if(!order) return { failure : { msg : 'There was no order found with that id.' , code : 300 } };
		if(obj.user && obj.user != order.user.id) return { failure : { msg : 'This return cannot be completed because this order is not under your control.' , code : 300} };

		


		return yield _s_common.new(data,'returns', true);
		}
	
	}

module.exports = function(){
  	if(!(this instanceof Returns)) { return new Returns(); }
	}


















