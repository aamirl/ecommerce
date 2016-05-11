// var shippo = require('shippo')('377093da54c3a82c5bfea937cda0b23616a29762');
var request = require('request');

function Shippo(){ }


Shippo.prototype = {
	
	calculate : function*(obj){


		
		var deferred = _s_q.defer();
		var v = {
			object_purpose : (obj.purchase?'PURCHASE':'QUOTE'),
			address_from : {
				object_purpose : (obj.purchase?'PURCHASE':'QUOTE'),
				name : (obj.origin.name||'SELLYX, INC.'),
				company : (obj.origin.name||'SELLYX, INC.'),
				street1 : (obj.origin.address.street1||'street'),
				street2 : (obj.origin.address.street2||''),
				city: (obj.origin.address.city||''),
				state : (obj.origin.address.country=='US'?'':(obj.origin.address.state||'')),
				zip : (obj.origin.address.postal||''),
				country : obj.origin.address.country,
				phone : (obj.origin.phone||'')
				},
			address_to : {
				object_purpose : (obj.purchase?'PURCHASE':'QUOTE'),
				name : (obj.recipient.name||'Sellyx Customer'),
				company : (obj.recipient.name||'Sellyx Customer'),
				street1 : (obj.recipient.address.street1||'street'),
				street2 : (obj.recipient.address.street2||''),
				city : (obj.recipient.address.city||''),
				state : (obj.recipient.address.country=='US'?'':obj.recipient.address.state),
				zip : (obj.recipient.address.postal||''),
				country : obj.recipient.address.country,
				phone : (obj.recipient.phone||'')
				},
			parcel : {
				length : obj.dimensions.s_length,
				width : obj.dimensions.s_width,
				height : obj.dimensions.s_height,
				weight : obj.dimensions.s_weight,
				distance_unit : 'cm',
				mass_unit : 'kg'
				},
			currency : 'USD',
			async : false

			}

		console.log(v);

		var options = {
			url : 'https://api.goshippo.com/v1/shipments',
			headers : {
				'Authorization' : 'ShippoToken 377093da54c3a82c5bfea937cda0b23616a29762'
				},
			json : true,
			body : v
			}

		request.post(options, deferred.makeNodeResolver());
	
		var data = yield deferred.promise.then(function(data){
			console.log(data[0].body)
			return data[0].body;
			} , function(error){
				console.log(error);
				return error;
				})
		
		if(data.object_created && data.object_status == 'SUCCESS' && data.rates_list.length > 0){
			var _currency = this._s.engine('currency');
			var send = {};
			_s_u.each(data.rates_list, function(rate,i){
				
				if(rate.object_state == 'VALID'){

					send[rate.object_id] = {
						service :{
							id : rate.object_id,
							provider : rate.provider,
							label : rate.servicelevel_name
							},
						// rate : (this._s.currency.convert.fromto(rate.amount,rate.currency,'USD')).toFixed(2),
						rate : (rate.currency == 'USD'?rate.amount:(rate.currency_local == 'USD'?rate.amount_local:(_s_currencies.convert.fromto(rate.amount,rate.currency,'USD')).toFixed(2))),
						transit : rate.days,
						image : rate.provider_image_75,
						terms : rate.duration_terms,
						trackable : rate.trackable,
						};

					}


				})
			return {
				id : data.object_id,
				source : 'shippo',
				shipment : data.rates_list[0].shipment,
				rates : send
				}
			}

		return false;
		}
	}



module.exports = function(){
  	if(!(this instanceof Shippo)) { return new Shippo(); }
	}

