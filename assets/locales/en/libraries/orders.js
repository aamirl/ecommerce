


var obj = {
	type : {
		1 : 'Pickup Order',
		2 : 'Shipped Order'
		},
	status : {
		0 : 'Order Inactive (Sellyx Hold)',
		1 : 'Order Processing',
		2 : 'Order In Transit',
		3 : 'Order Cancelled',
		4 : 'Order In Transit - Needs Confirmations',
		50 : 'Listing Order Inactive (Sellyx Hold)',
		51 : 'Listing Order Confirmed - Authorized, Not Captured',
		52 : 'Listing Order Cancelled',
		53 : 'Listing Order Complete',
		54 : 'Listing Order Complete - Authorized, Not Captured',
		55 : 'Listing Order Cancelled - Reversal Failed',
		56 : 'Listing Order Cancelled (Not Enough Quantity)',
		57 : 'Listing Order Cancelled (Not Enough Quantity) - Reversal Failed',
		58 : 'Listing Order OBO Request',
		59 : 'Listing Order Cancelled (OBO Request Denied)',
		60 : 'Listing Order OBO Request - Authorization Failure',
		100 : 'Order Completed',
		},
	'item.status.seller' : {
		0 : 'There was an issue with this item order. Please contact Sellyx for more details.',
		1 : 'Sellyx Fulfilled - Processing',
		2 : 'Send to Sellyx Domestic (OC)',
		3 : 'Send to Sellyx Domestic (SC)',
		4 : 'Send Directly to Customer (OC)',
		5 : 'Send Directly to Customer (SC)',
		6 : 'Sent to Sellyx Domestic',
		7 : 'Sent to Customer via Sellyx',
		8 : 'Sent Directly to Customer - Tracking Unconfirmed',
		9 : 'Sent Directly to Sellyx International',
		10 : 'Received by Sellyx Domestic',
		11 : 'Received by Sellyx International',
		12 : 'Fulfilled by Sellyx - International Consolidated',
		13 : 'Fulfilled by Sellyx - International Direct',
		14 : 'Received by Sellyx Domestic - Item Held For Issues',
		15 : 'Received by Sellyx International - Item Held For Issues',
		16 : 'Sent Directly to Customer',
		17 : 'Sent Directly to Customer - Tracking Issue',
		18 : 'Item Cancelled',
		19 : 'Item Pending Return/Returned'
		},
	'item.status.customer' : {
		0 : 'There was an issue with this item order. Please contact Sellyx for more details.',
		1 : 'Not Shipped (Sellyx Fulfillment) - This item is currently located at a Sellyx fulfillment center and is being prepared for shipment.',
		2 : 'Not Shipped (Seller/SellyxShip) - The seller is preparing to send your item to Sellyx for efficient international transit.',
		3 : 'Not Shipped (Seller/SellyxShip) - The seller is preparing to send your item to Sellyx for efficient international transit.',
		4 : 'Not Shipped (Seller/OC) - The seller is preparing to send your item directly to you.',
		5 : 'Not Shipped (Seller/SC) - The seller is preparing to send your item directly to you.',
		6 : 'In Transit - The item was shipped to a Sellyx fulfillment center for further processing.',
		7 : "Arrived/Almost Arrived (Sellyx) - If it's not already there, it should be there very soon.",
		8 : "Arrived/Almost Arrived (Seller) - If it's not already there, it should be there very soon. [ Tracking Unconfirmed ]",
		9 : 'In Transit (Seller/SellyxShip) - The seller sent the item to Sellyx for efficient international transit.',
		10 : 'In Transit (Seller/SellyxShip) - The item was received by Sellyx and is being inspected for quality assurance.',
		11 : 'In Transit (Seller/SellyxShip) - The item was received by Sellyx and should be delivered via local courier soon.',
		12 : 'Not Shipped (Sellyx Fulfillment) - This item is currently located at a Sellyx fulfillment center and is being prepared for international shipment.',
		13 : 'Not Shipped (Sellyx Fulfillment) - This item is currently located at a Sellyx fulfillment center and is being prepared for international shipment.',
		14 : 'In Transit (Seller/SellyxShip) - The item was received by Sellyx but has been held for issues. Please keep checking back for updates.',
		15 : 'In Transit (Seller/SellyxShip) - The item was received by Sellyx but has been held for issues. Please keep checking back for updates.',
		16 : "Arrived/Almost Arrived (Seller) - If it's not already there, it should be there very soon.",
		17 : "Arrived/Almost Arrived (Seller) - If it's not already there, it should be there very soon. [ Tracking Issue ]",
		18 : 'Item Cancelled',
		19 : 'Item Pending Return/Returned'
		}
	}

module.exports = exports = obj;
