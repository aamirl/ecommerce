// financials library will be a special adapter library for calling the financial server

module.exports = {
	get helpers() {
		var self = this;
		return {
			validators : {
				
				}
			}
		},
	get authorize() {
		var self = this;
		return {
			new : function*(obj){
				console.log('here')
				var total = 0

				if(obj.transactions){
					_s_u.each(obj.transactions, function(transaction, i){
						obj.transactions[i].capture = (obj.capture?obj.capture:"false")
						obj.transactions[i].amount = self._s.currency.convert.back(obj.transactions[i].amount)
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

				console.log(total)
				console.log(obj.amount)

				if(obj.amount != total) return {  failure : { msg : 'The total of the transactions was not valid for the total amount.' } }

				// let's charge the payment information
				return yield self._s.req.http({
					url : _s_config.financials + 'authorize/a/new',
					method : 'POST',
					headers : {
						key : self._s.auth_key
						},
					data : {
						id : (obj.id?obj.id:self._s.t1.profile.id()),
						amount : obj.amount,
						transactions : obj.transactions,
						service : 'ecommerce'
						}
					})
				}
			}
		},
	get transfer() {
		var self = this;
		return {
			new : function*(obj){
				return yield self._s.req.http({
					url : _s_config.financials + 'transfers/a/new',
					method : 'POST',
					headers : {
						key : self._s.auth_key
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
			}
		},
	get charge() {
		var self = this;
		return {
			new : function*(obj){
				var total = 0;




				if(obj.transactions){
					_s_u.each(obj.transactions, function(transaction, i){
						obj.transactions[i].capture = (obj.capture?obj.capture:"false")
						obj.transactions[i].amount = self._s.currency.convert.back(obj.transactions[i].amount)
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

				console.log(total)
				console.log(obj.amount)

				if(obj.amount != total) return {  failure : { msg : 'The total of the transactions was not valid for the total amount.' } }


				// let's charge the payment information
				return yield self._s.req.http({
					url : _s_config.financials + 'charges/a/new',
					method : 'POST',
					headers : {
						key : self._s.auth_key
						},
					data : {
						id : (obj.id?obj.id:self._s.t1.profile.id()),
						amount : obj.amount,
						transactions : obj.transactions,
						service : 'ecommerce'
						}
					})
				},
			capture : {
				authorized : function*(obj){
					// this is to capture an item that hasn't yet been preauthorized
					return yield self._s.req.http({
						url : _s_config.financials + 'charges/a/capture/authorized',
						method : 'POST',
						headers : {
							key : self._s.auth_key
							},
						data : {
							id : (obj.id?obj.id:self._s.t1.profile.id()),
							transaction : obj.transaction,
							}
						})

					},
				processed : function*(obj){
					// this is to process a charge that has already been preauthorized
					return yield self._s.req.http({
						url : _s_config.financials + 'charges/a/capture',
						headers : {
							key : self._s.auth_key
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
				return yield self._s.req.http({
					url : _s_config.financials + 'reversals/a/charge',
					method : 'POST',
					headers : {
						key : self._s.auth_key
						},
					data : {
						transaction : obj.transaction,
						service : 'ecommerce'
						}
					})
				}
			}
		}
	}