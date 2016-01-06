// Sellers Object

module.exports = function*(data){
	if(!(this instanceof Sellers)) { var r = new Sellers(data); yield r.init(data); return r; }
	}

function Sellers(){}
Sellers.prototype = {
	init : function*(data){
		if(typeof data != 'object'){
			// let's load the seller from the database
			var result = yield _s_load.engine('sellers').get({ id : data , convert : false, objectify : false });
			if(!result) { this.failure = { msg : 'The seller could not be found.' , code : 300 }; }
			else {
				result.id = data;
				this.data = result;
				}
			}
		else{ this.data = data; }
		},
	library : _s_load.engine('sellers'),
	get privileges() {
		var self = this;
		return {
			verification : {
				verified : function(){
					return self.data.verifications.verified;
					}
				}
			}
		},
	get is(){
		var self = this;
		return {
			seller : function(){
				return self.data.id;
				},
			master : function(){
				if(self.master == _s_user.profile.id()) return true;
				return false;
				}
			}
		},
	get profile(){
		var self = this;
		return {
			all : function*(convert){
				if(convert) return yield _s_util.convert.single({ library:'sellers',data:self.data,label:true })
				return self.data;
				},
			id : function(){
				return self.data.id;
				},
			name : function(){
				return self.data.name;
				},
			country : function(){
				return self.data.country;
				},
			role : function(){
				return self.data.role;
				},
			policy : function(type){
				if(type) return self.data.policy[type];
				return self.data.policy;
				},
			contact : {
				all : function(){
					return self.data.numbers;
					},
				primary : function(){
					var numbers = self.profile.contact.all();
					return _s_util.array.find.object(numbers, 'primary' , true);
					}
				},
			addresses : {
				all : function(){
					return self.data.addresses;
					},
				primary : function(){
					var addresses = self.profile.addresses.all();
					return addresses[0];
					// return _s_util.array.find.object(addresses, 'primary' , true);
					}
				}
			}
		},
	get financials(){
		var self = this;
		return {
			tax : function(){
				try{ return self.data.financials.profile.customer.tax; }
				catch(err){ return false; }
				},
			set : function(){
				if(self.data.financials.profile) return true;
				return false;
				},
			profile : function(){
				return self.data.financials.profile;
				},
			account : function(){
				return 
				},
			cards : {
				get : { 
					single : function(obj){
						var all = self.financials.cards.get.all();
						if(!all) return false;
						return _s_util.array.find.object(all, 'id' , (obj.card?obj.card:obj));
						},
					all : function(){
						var cards = self.data.financials.cards;
						if(!cards) return false;
						return data.financials.cards;
						}
					}
				}
			}
		},
	get helpers(){
		var self = this;
		return {
			convert : {
				sellers : function*(obj){
					!obj.id?obj.id = self.profile.id():null;
					obj.country = _s_util.array.find.object(obj.addresses,'type',1,false).country;
					return yield _s_util.convert.single({data:obj,label:true,library:'Sellers',dates:{r:true}});
					}
				},
			data : {
				document : function(obj){
					var address = self.profile.addresses.primary();

					return {
						id : self.profile.id(),
						name : self.profile.name(),
						verified : self.privileges.verification.verified(),
						country : address.country,
						postal : address.postal,
						coordinates : {
							lat : address.lat,
							lon : address.lon
							}
						}
					}
				}
			}
		}
	}