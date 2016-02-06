// t2 Object

module.exports = function*(data){
	if(!(this instanceof T2)) { var r = new T2(data); yield r.init(data); return r; }
	}

function T2(){}
T2.prototype = {
	init : function*(data){
		if(typeof data != 'object'){
			// let's load the seller from the database
			var result = yield _s_load.library('t2').get({ id : data , convert : false, objectify : false });
			if(!result) { this.failure = { msg : 'The entity could not be found.' , code : 300 }; }
			else {
				result.id = data;
				this.data = result;
				}
			}
		else{ this.data = data; }
		},
	library : _s_load.library('t2'),
	key : function(obj){
		inp = obj.data?obj.data:obj;
		return _s_util.object.stringed(this.data, inp, false);
		},
	get privileges() {
		var self = this;
		return {
			master : {
				id : function(){
					return self.data.master;
					},
				compare : function(inp){
					if(inp == self.privileges.master.id()) return true;
					return false;
					},
				},
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
			valid : function(obj){
				if(self.data.setup.active == 0 || self.data.oAuth_setup.active == 0) return false;
				return true;
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
				if(convert) return yield _s_util.convert.single({ library:'t2',data:_s_util.clone.deep(self.data),label:true })
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
					return numbers[0];
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
	get helpers(){
		var self = this;
		return {
			convert : {
				t2 : function*(obj){
					!obj.id?obj.id = self.profile.id():null;
					obj.country = _s_util.array.find.object(obj.addresses,'type',1,false).country;
					return yield _s_util.convert.single({data:obj,label:true,library:'t2',dates:{r:true}});
					}
				},
			data : {
				document : function(obj){
					var address = self.profile.addresses.primary();

					return {
						id : self.profile.id(),
						type : 't2',
						name : self.profile.name(),
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