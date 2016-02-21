// financials library will be a special adapter library for calling the financial server

function Financials(){ }

Financials.prototype = {
	get helpers() {
		var self = this;
		return {
			validators : {
				
				}
			}
		},
	authorize : {
		new : function*(obj){
			var total = 0

			if(obj.transactions){
				_s_u.each(obj.transactions, function(transaction, i){
					obj.transactions[i].capture = (obj.capture?obj.capture:"false")
					obj.transactions[i].amount = _s_currency.convert.back(obj.transactions[i].amount)
					total += obj.transactions[i].amount
					})
				}
			else{ 
				obj.transactions = [
					{

						type : 'sellyx',
						amount : obj.amount
					}
					]
				total += obj.amount
				}

			if(obj.amount != total) return {  failure : { msg : 'The total of the transactions was not valid for the total amount.' } }

			// let's charge the payment information
			return yield _s_req.http({
				url : _s_config.financials + 'authorize/a/new',
				method : 'POST',
				headers : {
					key : _s_auth_key
					},
				data : {
					id : (obj.id?obj.id:_s_t1.profile.id()),
					amount : obj.amount,
					transactions : obj.transactions,
					service : 'ecommerce'
					}
				})
			}
		},
	transfer: {
		new : function*(obj){
			return yield _s_req.http({
				url : _s_config.financials + 'transfers/a/new',
				method : 'POST',
				headers : {
					key : _s_auth_key
					},
				data : {
					type : 'sellyx',
					from : (obj.from?obj.from:'sellyx'),
					to : obj.to,
					amount : obj.amount,
					service : 'ecommerce'
					}
				})
			}
		},
	charge : {
		new : function*(obj){
			var total = 0;

			if(obj.transactions){
				_s_u.each(obj.transactions, function(transaction, i){
					obj.transactions[i].capture = (obj.capture?obj.capture:"false")
					obj.transactions[i].amount = _s_currency.convert.back(obj.transactions[i].amount)
					total += obj.transactions[i].amount
					})
				}
			else{ 
				obj.transactions = [
					{

						type : 'sellyx',
						amount : obj.amount
					}
					]
				total += obj.amount
				}

			if(obj.amount != total) return {  failure : { msg : 'The total of the transactions was not valid for the total amount.' } }


			// let's charge the payment information
			return yield _s_req.http({
				url : _s_config.financials + 'charges/a/new',
				method : 'POST',
				headers : {
					key : _s_auth_key
					},
				data : {
					id : (obj.id?obj.id:_s_t1.profile.id()),
					amount : obj.amount,
					transactions : obj.transactions,
					service : 'ecommerce'
					}
				})
			},
		capture : {
			authorized : function*(obj){
				// this is to capture an item that hasn't yet been preauthorized
				return yield _s_req.http({
					url : _s_config.financials + 'charges/a/capture/authorized',
					method : 'POST',
					headers : {
						key : _s_auth_key
						},
					data : {
						id : (obj.id?obj.id:_s_t1.profile.id()),
						transaction : obj.transaction,
						}
					})

				},
			processed : function*(obj){
				// this is to process a charge that has already been preauthorized
				return yield _s_req.http({
					url : _s_config.financials + 'charges/a/capture',
					headers : {
						key : _s_auth_key
						},
					method : 'POST',
					data : {
						transaction : obj.transaction,
						service : 'ecommerce'
						}
					})
				}
			},
		reversal : function*(obj){
			return yield _s_req.http({
				url : _s_config.financials + 'reversals/a/charge',
				method : 'POST',
				headers : {
					key : _s_auth_key
					},
				data : {
					transaction : order.transaction,
					service : 'ecommerce'
					}
				})
			}
		},
	source : {

		new : function*(obj){

			// return yield _s_req.http({
			// 	url : _s_config.financials + 'sources/a/new',
			// 	method : 'POST',
			// 	headers : {
			// 		key : _s_auth_key
			// 		},
			// 	data : {
			// 		id : (obj.id?obj.id:_s_t1.profile.id()),
			// 		transactions : obj.transactions,
			// 		}
			// 	})

			}

		}
	}

module.exports = function(){
  	if(!(this instanceof Financials)) { return new Financials(); }
	}