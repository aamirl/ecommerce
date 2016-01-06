
function Countries(){
	this.list = _s_load.datafile('countries');
	this.data = {active:{}};
	
	var set = _s_req.headers('country');
	if( set && (this.list[set]) ){ this.active.set(set); }
	else{ this.active.set('240'); }
	
	var set2 = _s_req.headers('postal');
	if( set2 ){ this.active.postal.set(set2); }
	else{ this.active.postal.set('90401'); }

	}



Countries.prototype = {
	model :  _s_load.model('countries'),
	get active() {
		var self = this;
		return {
			set : function(countryId){
				self.data.active.country = countryId;
				},
			get : function(){
				return self.data.active.country;
				},
			postal : {
				set : function(postal){
					self.data.active.postal = postal;
					},
				get : function(){
					return self.data.active.postal;
					}
				}
			}
		},
	get : function(countryId){
		if(countryId == undefined ) return this.list;
		else return this.list[countryId];
			
		},
	reverse : function*(name){
		var send = 'Unknown';
		var all = yield this.list;
		_s_u.each(all, function(dets,id){
			if(dets.country_name == name){
				send = id;
				return false;
				}
			})
		return send;
		},
	name : function(countryId){
		return this.get(countryId).country_name;
		},
	code : function*(countryId){
		var c = yield this.get(countryId);
		return c.country_code;
		},
	fulfillment : {
		fulfilled : function(countryId){
			var allowed = ['240','102',240,102];

			if(_s_util.indexOf(allowed, countryId) !== -1) return true;
			return false;
			},
		address : function(countryId){
			var addresses = {
				240 : {
					name : 'Sellyx USA Fulfillment Center',
					primary : '8054037831',
					street1 : '2629 Townsgate Road',
					street2 : 'Suite 235',
					city : 'Westlake Village',
					state : 'California',
					country : '240',
					postal : '91362'
					},
				102 : {
					name : 'Sellyx India Fulfillment Center',
					primary : '123123123123',
					street1 : 'No. 3, RMZ Infinity - Tower E',
					street2 : 'Old Madras Road, 3/4/5 Floors',
					city : 'Bangalore',
					state : '',
					country : '102',
					postal : '560016'
					}
				}

			return addresses[countryId];
			}
		}
	}



module.exports = function(){
  	if(!(this instanceof Countries)) { return new Countries(); }
	}

