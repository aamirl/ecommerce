


var obj = {
	seller : {
		status : {
			0 : 'Return Inactive (Sellyx Hold)',
			1 : 'You need to process this return',
			2 : 'Sellyx will be processing this return',
			3 : 'Customer is preparing to ship the item',
			4 : 'Item(s) In Transit (To Sellyx)',
			5 : 'Item(s) In Transit (To You)',
			6 : 'You processed and denied the return',
			7 : 'Sellyx denied the return',
			100 : 'Item(s) Return Complete',
			}
		},
	customer : {
		status : {
			0 : 'Return Inactive (Sellyx Hold)',
			1 : 'Seller is processing this return',
			2 : 'Sellyx is processing this return',
			3 : 'Seller has processed the return, awaiting shipment of item from you',
			4 : 'Item(s) In Transit (To Sellyx)',
			5 : 'Item(s) In Transit (To Seller)',
			6 : 'Seller denied the return. Please contact him/her for more information.',
			7 : 'Sellyx denied the return. Please see details below for reason why.',
			100 : 'Item(s) Return Complete',
			}
		},
	reason : {
		1 : 'Ordered the wrong item',
		2 : 'Ordered the wrong size',
		3 : 'Item different from what was ordered',
		4 : 'Item was defective or damaged',
		5 : 'Did not like the item',
		6 : 'Do not want the item any longer'
		},
	shipping : {
		1 : 'Customer Pays Shipping Cost',
		2 : 'Seller Pays Shipping Cost',
		},
	type : {
		1 : 'Complete Money Refund',
		2 : 'Item Exchange'
		},
	accepted : {
		1 : 'Return Denied',
		2 : 'Return Accepted',
		}
	}

module.exports = exports = obj;
