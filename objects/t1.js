// t1 Object

module.exports = function*(data){
  	if(!(this instanceof T1)) { var r = new T1(data); yield r.init(data); return r; }
	}

function T1(){}
T1.prototype = {
	init : function*(data){
		if(typeof data != 'object'){
			// let's load the user from the database
			var _t1 = _s_load.library('t1');
			var result = yield _t1.get({ id : data , convert : false, objectify : false });
			if(!result) { this.failure = { msg : 'The entity could not be found.' , code : 300 }; }
			else {
				result.id = data;
				this.data = result;
				}
			}
		else{ this.data = data; }
		},
	library : _s_load.library('t1'),
	key : function(obj){
		inp = obj.data?obj.data:obj;
		return _s_util.object.stringed(this.data, inp, false);
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
	get entities(){
		var self = this;
		return {
			all : function(){
				return self.data.entities;
				},
			check : function(inp){
				if (inp == _s_cache_id) return true;
				if(self.data.entities.length > 0){
					var r = _s_util.array.find.object(self.data.entities, 'id', inp, true);
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
				if(convert) return yield _s_util.convert.single({ library:'t1',data:_s_util.clone.deep(self.data),label:true })
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
					return numbers[0];
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
					if(fs.existsSync(_s_config.paths.images.t1 + self.profile.id() + '.jpg')) return self.profile.id() + '.jpg';
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
				t1 : function*(obj){
					!obj.id?obj.id = self.profile.id():null;
					obj.country = _s_util.array.find.object(obj.addresses,'type',1,false).country;
					return yield _s_util.convert.single({data:obj,label:true,library:'t1',dates:{r:true}});
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
						verified : self.privileges.verification.verified(),
						}
					}
				}
			}
		}
	}
