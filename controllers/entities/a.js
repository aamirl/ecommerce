

module.exports = function(){  return new Controller(); }

function Controller(){}
Controller.prototype = {
	get : function*(){
		var t = this._s.util.clone.deep(yield this._s.entity.object.profile.all(true));

		delete t.faq;
		delete t.enrollment;
		delete t.follows;
		delete t.financials;

		return { success : { data : t } };
		},
	'notifications/get' : function*(){
		var _notifications = this._s.engine('notifications')

		return yield _notifications.get({ entity :  this._s.entity.object.profile.id() })
		},
	'notifications/get/count' : function*(){
		var _notifications = this._s.engine('notifications')

		return yield _notifications.get({ entity :  this._s.entity.object.profile.id() }, true)
		},
	'notifications/clear' : function*(){
		var _notifications = this._s.engine('notifications')
		var get = yield this._s.model('notifications').get(this._s.entity.object.profile.id())

		if(!get) return { failure : { msg : 'This is not a valid notification status.' , code : 300 } }

		get.notifications = []
		return yield this._s.model('notifications').update(get)

		},
	'get/faq' : function*(){
		var key = this._s.entity.object.key('faq');
		if(!key) return { failure : { msg : 'There was no FAQ information for this entity.' , code : 300 } }
		return { success : { data : key } };
		},
	existing : function*(){
		if(this._s.entity.type != 't1') return { failure : { msg : 'This option is only valid for individuals users at this time.' , code : 300 } }

		var data = this._s.req.validate({
			id : { v:['isAlphaOrNumeric'] }
			})
		if(data.failure) return data;

		var get = yield this._s.library('entities').get({entities:[data.id]});
		if(!get||get.counter > 1) return { failure : { msg : 'The entity you are trying to join does not exist.' , code : 300 } }
		else get = get.data[0].data;

		if(get.setup.active == 0) return { failure : { msg : 'The entity you are trying to join is not an active entity at this time.' , code : 300 }}
		if(get.type == 1) return { failure : { msg : 'You cannot join this entity because it is not valid.' , code : 300 } }
		
		if(!get.enrollment) get.enrollment = [];

		// check if this entity tried to enroll
		var r = this._s.util.array.find.object(get.enrollment, 'id', this._s.t1.profile.id(), true);
		if(r) return { failure : { msg : 'You have already submitted an active request to enroll in this entity. Please wait for the entity administration to respond.' , code :300} }
			

		var t = this._s.entity.object.helpers.data.document();
		t.setup = {
			status : 1,
			active : 1,
			added : this._s.dt.now.datetime()
			}


		get.enrollment.push(t)

		get.id = data.id;
		var update = yield this._s.common.update(get, get.type, false, true);
		if(update.failure) return update;
		return { success : true }
		},
	new : function*(){
		var type = 't2';

		var _t = this._s.library(type);
		var data = yield _t.new({ validate_only:true });
		if(data.failure) return data;

		var converted_data = {
			name : {
				first : data.name,
				display : data.name,
				last : ' ' + type
				},
			email : (data.name).replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '-').replace(/^(-)+|(-)+$/g,'') +'@entities.sellyx.com',
			telephone : data.numbers[0].id
			}

	
		var time = this._s.dt.epoch();
		var send = {
			"data" : {
				"id":"MA$N8l80:/GW793e6o{l",
				"Service":"entity_new",
				"Issuer":_s_config.certs.issuer,
				"IssueTime":time,
				"NotOnOrAfter":time+10000000,
				"NotBefore":time,
				"Destination":_s_config.oAuth + "ev",
				"Data":converted_data,
				"OAuthKey":this._s.auth_key,
				"OriginalData":data
				}	
			}

		var crypto = require('crypto');
		var fs = require('fs');


		send.data.Signature = {
			"Algorithm":"http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
			"Reference":"#MA$N8l80:/GW793e6o{l",
			"Certificate":fs.readFileSync(_s_config.certs.cert).toString(),
			"Signature":new Buffer(crypto.createSign('RSA-SHA256').update(JSON.stringify(send.data)).sign(fs.readFileSync(_s_config.certs.key).toString(),'hex')).toString('base64')
			}

		return { success : { data : new Buffer(JSON.stringify(send)).toString('base64') , relayURI : _s_config.root + "entities/a/confirm" } }

		},
	confirm : function*(){
		
		var token = this._s.req.get('token');
		var request = yield this._s.req.sellyx({
			path : 'evalidate/verify',
			params : {
				token:token,
				}
			})

		if(request.failure) return { failure : request.failure.msg||'This process failed.' , code :300 };
		else request = request.success.data;

		var decrypted = JSON.parse(new Buffer(request.relay_data, 'base64'));

		decrypted.data.OriginalData.id = request.id;

		var type = 't2';
		var _t = this._s.library(type);

		var result = yield _t.new({ data : decrypted.data.OriginalData , raw:true, validate:false});
		if(result.failure) return result;
		else result = result.success.data;


		var t = yield this._s.update.yieldable('temp', 'object', 't2', request.id)
		if(t.failure) return { failure : t.failure }

		var g = this._s.t1.entities.all();
		var u = this._s.temp.helpers.data.document();
		u.role = 'superadmin';
		u.setup = {
			active : 1,
			status : 1,
			added : this._s.dt.now.datetime()
			}
		g.push(u);

		var result = yield this._s.library('t1').update({
			data : {
				entities : g
				},
			id : this._s.t1.profile.id(),			
			})

		if(!result) return { failure : { msg : 'Updating the entity data failed.' , code : 300 } }
		return { status: 302, headers :{ 'Location' : this._s.req.get('redirect') ||'www.google.com?&q=Grandmas+Are+The+Best' } }
		},
	'update/basic' : function*(){
		var data = this._s.req.validate(this._s.library(this._s.entity.type).helpers.validators.base({update:true}));
		if(data.failure) return data;

		return  yield this._s.library(this._s.entity.type).update({data:data , result : this._s.entity.object.data});
		},
	'update/faq' : function*(){
		var data = this._s.req.validate(this._s.library('entities').helpers.validators.faq());
		if(data.failure) return data;

		var result = this._s.entity.object.data;

		if(data.id){
			var object = this._s.util.array.find.object(result.faq, 'id', data.id, true);
			if(!object) return { failure : { msg : 'We could not find the question you are trying to modify.' , code : 300 } }

			if(data.a) result.faq[object.index].a = data.a; 
			else result.faq.splice(object.index , 1);
			}
		else result.faq.push(this._s.library(this._s.entity.type).actions.new.faq(data));

		return  yield this._s.library(this._s.entity.type).update({data:{} , result : result , return_target : 'faq'});
		},
	'update/address' : function*(){
		var s = this._s.common.helpers.validators.address({required:true,json:false});
		s.index = { v:['isInt'] , b:true };
		var data = this._s.req.validate(s)
		if(data.failure) return data;

		// next we are going to see whether the inputted address exists in the address book
		var addresses = this._s.entity.object.profile.addresses.all();
		if(this._s.util.array.compare.objects(addresses , data)) return {  failure : { msg : 'You already have this address on file.' , code : 300 } };
		
		var result = this._s.entity.object.data;

		// let's see if we are adding this or updating something
		if(data.index || data.index == 0){
			var index = data.index;
			delete data.index;
			result.addresses[index] = data;
			}
		else result.addresses.push(data);			
		
		return  yield this._s.library(this._s.entity.type).update({data:data , result : result , return_target : 'addresses'});
		},
	'update/address/delete' : function*(){
		var data = this._s.req.validate({
			index : { v:['isInt'] , b:true }
			})
		if(data.failure) return data;

		var result = this._s.entity.object.data;
		result.addresses.splice(data.index,1);

		return  yield this._s.library(this._s.entity.type).update({data:data , result : result , return_target : 'addresses'});
		},
	follow : function*(){
		var _listings = this._s.library('listings');
		var data = this._s.req.validate({
			id : { v:['isAlphaOrNumeric'] },
			type : { in:['t1','t2'] , b:true, default:'t1'},
			add : { in:[true,false], b:true },
			push : { in : [true,false] , b:true , default:true }
			})
		if(data.failure) return data;

		if(data.id == this._s.entity.object.profile.id()) return { failure : { msg : 'You cannot follow yourself on Sellyx!' , code : 300 } }
		var result = yield this._s.library(data.type).get(data.id);
		if(!result) return { failure : { msg : 'This is not a valid entity.' , code : 300 } }
		if(!result.follows) result.follows = []

		var t = this._s.util.array.find.object(result.follows, "id", this._s.entity.object.profile.id(), true)
		var self = this
		var _notifications = self._s.engine('notifications')

		if(!t && data.add){
			result.follows.push(this._s.entity.object.helpers.data.document())

			if(data.push){
				yield _notifications.new.push({
					entity : data.id,
					type : "603",
					title : self._s.entity.object.profile.name()  + " just followed you!",
					body : self._s.entity.object.profile.name() + " has followed you. Anytime you go live with a listing, they will be able to watch. So go live now!",
					data : {
						id : this._s.entity.object.profile.id(),
						image : {
							data : this._s.entity.object.profile.id(),
							type : 'entity'
							}
						},
					add : true
					})
				}
			var msg = "You were added to the follow list for this entity."
			}
		else if(t && !data.add){
			result.follows.splice(t.index, 1)
			var msg = "You were removed from the follow list for this entity."
			}

		var update = yield this._s.common.update(result, data.type, false, true);
		if(update.failure) return update;
		return { success : { msg : msg, code : 300 } }
		},
	'get/active' : function*(){
		var _entities = this._s.library('entities');
		var check = _entities.privileges.check();
		if(check.failure) return check;
		
		var get = yield this._s.library('t1').get({entity:this._s.entity.object.profile.id() });
		if(!get || get.counter == 1) return { failure : { msg : 'No objects matched your query.' , code : 300 } }

		var send = [];

		_s_u.each(get.data, function(o,i){

			var r = this._s.util.array.find.object(o.data.entities, 'id', this._s.entity.object.profile.id());

			if(o.id == this._s.t1.profile.id()) return;

			send.push({
				id : o.id,
				name : o.data.name,
				role : r.role,
				setup : {
					active : r.setup.active,
					status : {
						data : r.setup.status,
						converted : this._s.l.info('status',r.setup.status,this._s.entity.type, 'entity')
						},
					added : {
						data : r.setup.added,
						converted : this._s.dt.convert.datetime.output(r.setup.added)
						}
					}
				})

			})

		return { success : { data : send } }
		},
	'privileges/status' : function*(){
		var _entities = this._s.library('entities');
		var check = _entities.privileges.check();
		if(check.failure) return check;
		
		var data = this._s.req.validate({
			id : {v:['isAlphaOrNumeric']},
			status : { in:['1','2','3',1,2,3] }
			});
		if(data.failure) return data;

		var r  = yield this._s.common.check({
			id : data.id,
			library : 't1',
			label : 'user',
			send : 'object',
			raw : true,
			status : {
				allowed : [1,'1']
				},
			corporate : true,
			deep : {
				array : 'entities',
				property : 'id',
				value : this._s.entity.object.profile.id(),
				status : {
					allowed : [1,'1'],
					change : data.status
					},
				active : [1,'1']
				}
			});

		if(r.failure) return r;

		return { success : {data: {setup: {
			active : r.setup.active,
			status : {
				data : r.setup.status,
				converted : this._s.l.info('status',r.setup.status,this._s.entity.type, 'entity')
				},
			added : {
				data : r.setup.added,
				converted : this._s.dt.convert.datetime.output(r.setup.added)
				}
			} } }};

		},

	'privileges/check' : function*(){
		var data = this._s.req.validate({
			id : { v:['isAlphaOrNumeric'] }
			})
		if(data.failure) return data;

		// check to see if the supplied company credentials are okay for access by the user
		var r = this._s.t1.entities.check(data.id);
		if(!r) return { failure : { msg : 'This user is not authorized.' , code : 300 } }
		return { success : { msg : 'This user is valid.' , code : 300 } }
		},
	'get/enrollment' : function*(){
		var _entities = this._s.library('entities');
		var check = _entities.privileges.check();
		if(check.failure) return check;


		var self = this
		
		var get = yield this._s.library(this._s.entity.type).get(this._s.entity.object.profile.id());
		if(!get || get.enrollment.length == 0) return { failure : { msg : 'No objects matched your query.' , code : 300 } }
		
		var send = [];

		_s_u.each(get.enrollment, function(o,i){

			send.push({
				id : o.id,
				name : o.name,
				setup : {
					active : o.setup.active,
					status : {
						data : o.setup.status,
						converted : self._s.l.info('status', o.setup.status,self._s.entity.type, 'enrollment')
						},
					added : {
						data : o.setup.added,
						converted : self._s.dt.convert.datetime.output(o.setup.added)
						}
					}
				})

			})

		return { success : { data : send } }
		},
	'enrollment/status' : function*(){
		var _entities = this._s.library('entities');
		var check = _entities.privileges.check();
		if(check.failure) return check;
		
		var data = this._s.req.validate({
			id : {v:['isAlphaOrNumeric']},
			status : { in:['2','3',2,3] }
			});
		if(data.failure) return data;

		var _s_o_t1 = yield this._s.yieldable('t1', 'object', data.id)

		console.log(_s_o_t1)

		if(_s_o_t1.failure) { this.body = { failure : t.failure } ; return; }

		// check and make sure the entity doesnt already exist
		if(_s_o_t1.entities.check(this._s.entity.object.profile.id())) return { failure : { msg : 'This user was already added to this entity.' , code : 300 } };

		var r  = yield this._s.common.check({
			id : this._s.entity.object.profile.id(),
			library : this._s.entity.type,
			label : 'user',
			send : 'object',
			raw : true,
			status : {
				allowed : [1,'1']
				},
			corporate : true,
			deep : {
				array : 'enrollment',
				property : 'id',
				value : data.id,
				status : {
					allowed : [1,'1', 2,'2'],
					change : data.status
					},
				active : [1,'1',3,'3']
				}
			});

		if(r.failure) return r;

		 r = { success : {data: {setup: {
			active : r.setup.active,
			status : {
				data : r.setup.status,
				converted : this._s.l.info('status',r.setup.status,this._s.entity.type, 'enrollment')
				},
			added : {
				data : r.setup.added,
				converted : this._s.dt.convert.datetime.output(r.setup.added)
				}
			} } }};

		// now if status is 4, we go ahead and add the user document
		if(data.status != 3) return r;

		

		var i = _s_o_t1.data;
		var s = this._s.entity.object.helpers.data.document();
		s.role = 'superadmin';
		s.setup = {
			status : 1,
			active : 1,
			added : this._s.dt.now.datetime()
			};

		i.entities.push(s);
		i.id = data.id;

		var update = yield this._s.common.update(i,'t1');
		if(update.failure) return update;

		return r

		},
	}