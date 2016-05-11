// t1 Object

module.exports = function(){  return new T1(); }

function T1(){}
T1.prototype = {
	init : function*(){

		var oAuth_user = yield this._s.req.sellyx({
			path : 'auth/validate',
			params : {
				key : this._s.auth_key
				}
		 	})
			
		if(oAuth_user.failure){ return { failure : {msg:'Authorization failure.',code:300} }; }
		else { oAuth_user = oAuth_user.success.data.user; }

		var _t1 = this._s.library('t1')
		
		var result = yield _t1.get({ id : oAuth_user.id , convert : false, objectify : false  });
		if(!result) { 
			var create_user = yield _t1.new({data:oAuth_user, raw:true});
			if(create_user.failure || !create_user) return { failure : { msg : 'The entity could not be found or created.' , code : 300 } } 
			result = create_user.success.data;
			}

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
			verification : {
				verified : function(){
					return self.data.verifications.verified;
					}
				}
			}
		},
	get oAuth(){
		var self = this;
		return {
			active : function(raw){
				if(raw) return self.data.oAuth_setup.active;
				if(self.data.oAuth_setup.active == 0) return false
				return true;
				},
			status : function(raw){
				if(raw) return self.data.oAuth_setup.status;
				if(self.data.oAuth_setup.status != 1) return false;
				return true;
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
	get entities(){
		var self = this;
		return {
			all : function(){
				return self.data.entities;
				},
			check : function(inp){
				if (inp == self._s.auth_id) return true;
				if(self.data.entities.length > 0){
					console.log(self.data.entities)
					var r = self._s.util.array.find.object(self.data.entities, 'id', inp, true);
					if(!r) return false;
					if(r.object.setup.active != 0) return r;
					}
				return false
				},
			summary : function(){
				var all = self.data.entities;
				var send = [{
					id : self.profile.id(),
					name : self.profile.name()
					}]

				_s_u.each(all, function(o,i){
					if(o.setup.active == 0) return;
					send.push({
						id : o.id,
						name : o.name,
						role : o.role
						})
					})

				return send;
				},
			activate : function(inp){

				},
			id : function(inp){
				if(self)

				if(self.data.seller) return self.data.seller.id;
				return false;
				}
			}
		},
	get is(){
		var self = this;
		return {
			valid : function(obj){
				if(self.data.setup.active == 0 || self.data.oAuth_setup.active == 0) return false;
				return true;
				}
			}
		},
	get profile(){
		var self = this;
		return {
			all : function*(convert){
				if(convert) return yield self._s.util.convert.single({ library:'t1',data:self._s.util.clone.deep(self.data),label:true })
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
					case 3:
						return self.data.name.first+' ' + (self.data.name.middle?self.data.name.middle+' ':'') + self.data.name.last;
						break;
					default:
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
					return numbers[0];
					return self._s.util.array.find.object(numbers, 'primary' , true);
					}
				},
			addresses : {
				primary : function(){
					var addresses = self.profile.addresses.all();
					return addresses[0];
					// return this._s.util.array.find.object(addresses, 'primary' , true);
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
					if(fs.existsSync(_s_config.paths.images.t1 + self.profile.id() + '.jpg')) return self.profile.id() + '.jpg';
					else return false;
					},
				all : function(obj){

					}
				},
			followers : {
				all :function(){
					if(self.data.follows) return self.data.follows
					else return false
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
				t1 : function*(obj){
					!obj.id?obj.id = self.profile.id():null;
					obj.country = self._s.util.array.find.object(obj.addresses,'type',1,false).country;
					return yield self._s.util.convert.single({data:obj,label:true,library:'t1',dates:{r:true}});
					}
				},
			data : {
				document : function(obj){
					// var address = self.profile.addresses.primary();

					// return {
					// 	id : self.profile.id(),
					// 	type : 't2',
					// 	name : self.profile.name(),
					// 	country : address.country,
					// 	postal : address.postal,
					// 	lat : address.lat,
					// 	lon : address.lon
					// 	}

					return {
						id : self.profile.id(),
						name : self.profile.name(4),
						type : 't1',
						}
					}
				}
			}
		}
	}
