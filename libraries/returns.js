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
	get get() {
		var self = this;
		return {
			returns : function*(obj){

				if (obj.seller) {
					var type = 'seller';
					}
				else if(obj.user){
					var type = 'customer';
					}
				else {
					var type = false;
					}
					
				var results = yield self.model.get.returns(obj);
				var send = [];

				if(results){

					yield _s_util.each(results, function*(result, ind){
						
						var s = result.data;
						s.id = result.id;
						
						send.push(yield self.helpers.convert.return(s,type));

						})

					}

				return send;



				}
			}
		}
	
	}

module.exports = function(){
  	if(!(this instanceof Returns)) { return new Returns(); }
	}


















