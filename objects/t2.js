// t2 Object
module.exports = function(){  return new T2(); }

function T2(){}
T2.prototype = {
	init : function*(inp){

		var oAuth_user = yield this._s.req.sellyx({
			path : 'user/search',
			params : {
				id : inp
				}
		 	})
			
		if(oAuth_user.failure){ return { failure : {msg:'Authorization failure.',code:300} }; }
		else { oAuth_user = oAuth_user.success.data; }

		var _t2 = this._s.library('t2')
		
		var result = yield _t2.get({ id : inp , convert : false, objectify : false , exclude:'reviews,follows' });
		if(!result) return { failure : { msg : 'The entity could not be found.' , code : 300 } } 

		if(result.addresses && result.addresses.length > 0) result.country = result.addresses[0].country
		else result.country = this._s.countries.active.get(); 

		result.email = {
			id : oAuth_user.email,
			verified : true
			}
		result.reputation = oAuth_user.reputation;
		result.numbers = [ { number : oAuth_user.telephone , primary : true } ]

		result.oAuth_setup = {
			status : oAuth_user.status,
			active : oAuth_user.active,
			added : oAuth_user.createdAt
			}


		this.data = result;

		return { success : true }
		},
	key : function(obj){
		inp = obj.data?obj.data:obj;
		return this._s.util.object.stringed(this.data, inp, false);
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
				if(convert) return yield self._s.util.convert.single({ library:'t2',data:self._s.util.clone.deep(self.data),label:true })
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
					return self._s.util.array.find.object(numbers, 'primary' , true);
					}
				},
			addresses : {
				all : function(){
					return self.data.addresses;
					},
				primary : function(){
					var addresses = self.profile.addresses.all();
					return addresses[0];
					}
				}
			}
		},
	get notifications(){
		var self = this;
		return {
			email : function(){
				return true
				},
			push : function(){
				return true
				}
			}
		},
	get helpers(){
		var self = this;
		return {
			convert : {
				t2 : function*(obj){
					!obj.id?obj.id = self.profile.id():null;
					obj.country = self._s.util.array.find.object(obj.addresses,'type',1,false).country;
					return yield self._s.util.convert.single({data:obj,label:true,library:'t2',dates:{r:true}});
					}
				},
			data : {
				document : function(obj){
					var address = self.profile.addresses.primary();

					return {
						id : self.profile.id(),
						name : self.profile.name(),
						type : 't2',
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