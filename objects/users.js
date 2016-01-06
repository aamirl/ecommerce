// Users Object

module.exports = function*(data){
  	if(!(this instanceof Users)) { var r = new Users(data); yield r.init(data); return r; }
	}

function Users(){}
Users.prototype = {
	init : function*(data){
		if(typeof data != 'object'){
			// let's load the user from the database
			var _users = _s_load.engine('users');
			var result = yield _users.get({ id : data , convert : false, objectify : false });
			if(!result) { this.failure = { msg : 'The user could not be found.' , code : 300 }; }
			else {
				result.id = data;
				this.data = result;
				}
			}
		else{ this.data = data; }
		},
	library : _s_load.engine('users'),
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
	get seller(){
		var self = this;
		return { 
			id : function(){
				if(self.data.seller) return self.data.seller.id;
				return false;
				}
			}
		},
	get profile(){
		var self = this;
		return {
			all : function(){
				return self.data;
				},
			id : function(){
				return self.data.id;
				},
			name : function(obj){
				var type = (obj instanceof Object ? obj.type : obj);
				switch(type){
					case 1:
						return self.data.name.first;
						break;
					case 2:
						return self.data.name.last;
						break;
					default:
					case 3:
						return self.data.name.first+' ' + (self.data.name.middle?self.data.name.middle+' ':'') + self.data.name.last;
						break;
					case 4:
						return self.data.name.display;
						break;
					}
				},
			email : {
				id : function(){
					return self.data.email.id;
					},
				code : function(){
					return self.data.email.code;
					},
				verified : function(){
					return self.data.email.verified;
					}
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
				primary : function(){
					var addresses = self.profile.addresses.all();
					return addresses[0];
					// return _s_util.array.find.object(addresses, 'primary' , true);
					},
				all : function(){
					return self.data.addresses;
					}
				},
			social : {
				level : function(){
					return 1;
					}
				},
			images : {
				primary : function(obj){
					var fs = require('fs');
					if(fs.existsSync(_s_config.paths.images.users + self.profile.id() + '.jpg')) return self.profile.id() + '.jpg';
					else return false;
					},
				all : function(obj){

					}
				}
			}
		},
	get financials() {
		var self = this;
		return {
			profile : function(){

				},
			cards : {
				get : { 
					single : function(obj){
						var all = self.financials.cards.get.all();
						if(!all) return false;
						return _s_util.array.find.object(all, 'id' , (obj.card?obj.card:obj));
						},
					all : function(){
						var cards = self.financials.cards;
						if(!cards) return false;
						return self.financials.cards;
						}
					}
				}
			}
		},
	get actions() {
		var self = this;
		return {
			update : function(attribute , inp){
				self.data[attribute] = inp;
				}
			}
		},
	get helpers(){
		var self = this;
		return {
			convert : {
				users : function*(obj){
					!obj.id?obj.id = self.profile.id():null;
					obj.country = _s_util.array.find.object(obj.addresses,'type',1,false).country;
					return yield _s_util.convert.single({data:obj,label:true,library:'users',dates:{r:true}});
					}
				},
			data : {
				document : function(obj){
					return {
						id : self.profile.id(),
						name : self.profile.name(4),
						verified : self.privileges.verification.verified(),
						}
					}
				}
			}
		}
	}
