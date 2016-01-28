var _entities = _s_load.library('entities');

module.exports = {
	get : function*(){
		var t = _s_util.clone.deep(yield _s_entity.object.profile.all(true));

		delete t.faq;
		delete t.enrollment;
		delete t.follows;
		delete t.financials;

		return { success : { data : t } };
		},
	'get/faq' : function*(){
		var key = _s_entity.object.key('faq');
		if(!key) return { failure : { msg : 'There was no FAQ information for this entity.' , code : 300 } }
		return { success : { data : key } };
		},
	existing : function*(){
		if(_s_entity.type != 't1') return { failure : { msg : 'This option is only valid for individuals users at this time.' , code : 300 } }

		var data = _s_req.validate({
			id : { v:['isAlphaOrNumeric'] }
			})
		if(data.failure) return data;

		var get = yield _s_load.library('entities').get({entities:[data.id]});
		if(!get||get.counter > 1) return { failure : { msg : 'The entity you are trying to join does not exist.' , code : 300 } }
		else get = get.data[0].data;

		if(get.setup.active == 0) return { failure : { msg : 'The entity you are trying to join is not an active entity at this time.' , code : 300 }}
		if(get.type == 1) return { failure : { msg : 'You cannot join this entity because it is not valid.' , code : 300 } }
		
		// check if this entity tried to enroll
		var r = _s_util.array.find.object(get.enrollment, 'id', _s_t1.profile.id(), true);
		if(r) return { failure : { msg : 'You have already submitted an active request to enroll in this entity. Please wait for the entity administration to respond.' , code :300} }
			

		var t = _s_entity.object.helpers.data.document();
		t.setup = {
			status : 1,
			active : 1,
			added : _s_dt.now.datetime()
			}
		
		get.enrollment.push(t)

		get.id = data.id;
		var update = yield _s_common.update(get, get.type, false, true);
		if(update.failure) return update;
		return { success : true }
		},
	new : function*(){
		var type = 't2';

		var _t = _s_load.library(type);
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

	
		var time = _s_dt.epoch();
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
				"OAuthKey":_s_auth_key,
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
		
		var token = _s_req.get('token');
		var request = yield _s_req.sellyx({
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
		var _t = _s_load.library(type);

		var result = yield _t.new({ data : decrypted.data.OriginalData , raw:true, validate:false});
		if(result.failure) return result;
		else result = result.success.data;

		GLOBAL._s_entity = {
			id: request.id,
			library : _s_load.library(type),
			object : yield _s_load.object(type, result)
			}

		if(_s_entity.object.failure) return { failure : _s_entity.object.failure };

		var g = _s_t1.entities.all();
		var u = _s_entity.object.helpers.data.document();
		u.role = 'superadmin';
		u.setup = {
			active : 1,
			status : 1,
			added : _s_dt.now.datetime()
			}
		g.push(u);

		// update _s_t1
		var result = yield _s_t1.library.update({
			data : {
				entities : g
				},
			id : _s_t1.profile.id(),			
			})

		if(!result) return { failure : { msg : 'Updating the entity data failed.' , code : 300 } }
		
		// set in cache
		yield _s_t1.library.helpers.cached(result,_s_cache_id);
		// update object for the last step
		_s_t1 = yield _s_load.object('t1',result);

		return { status: 302, headers :{ 'Location' : _s_req.get('redirect') ||'www.google.com?&q=Grandmas+Are+The+Best' } }
		},
	'update/basic' : function*(){
		var data = _s_req.validate(_s_entity.library.helpers.validators.base({update:true}));
		if(data.failure) return data;

		return  yield _s_entity.library.update({data:data , result : _s_entity.object.data});
		},
	'update/faq' : function*(){
		var data = _s_req.validate(_s_load.library('entities').helpers.validators.faq());
		if(data.failure) return data;

		var result = _s_entity.object.data;

		if(data.id){
			var object = _s_util.array.find.object(result.faq, 'id', data.id, true);
			if(!object) return { failure : { msg : 'We could not find the question you are trying to modify.' , code : 300 } }

			if(data.a) result.faq[object.index].a = data.a; 
			else result.faq.splice(object.index , 1);
			}
		else result.faq.push(_s_entity.library.actions.new.faq(data));

		return  yield _s_entity.library.update({data:{} , result : result , return_target : 'faq'});
		},
	'update/address' : function*(){
		var s = _s_common.helpers.validators.address({required:true,json:false});
		s.index = { v:['isInt'] , b:true };
		var data = _s_req.validate(s)
		if(data.failure) return data;

		// next we are going to see whether the inputted address exists in the address book
		var addresses = _s_entity.object.profile.addresses.all();
		if(_s_util.array.compare.objects(addresses , data)) return {  failure : { msg : 'You already have this address on file.' , code : 300 } };
		
		var result = _s_entity.object.data;

		// let's see if we are adding this or updating something
		if(data.index || data.index == 0){
			var index = data.index;
			delete data.index;
			result.addresses[index] = data;
			}
		else result.addresses.push(data);			
		
		return  yield _s_entity.library.update({data:data , result : result , return_target : 'addresses'});
		},
	'update/address/delete' : function*(){
		var data = _s_req.validate({
			index : { v:['isInt'] , b:true }
			})
		if(data.failure) return data;

		var result = _s_entity.object.data;
		result.addresses.splice(data.index,1);

		return  yield _s_entity.library.update({data:data , result : result , return_target : 'addresses'});
		},
	follow : function*(){
		var data = _s_req.validate({
			id : { v:['isAlphaOrNumeric'] },
			type : { in:['t1','t2'] , b:true, default:'t1'}
			})
		if(data.failure) return data;

		if(data.id == _s_entity.object.profile.id()) return { failure : { msg : 'Unfortunately, at this time you cannot follow yourself on Sellyx!' , code : 300 } }

		var result = yield _s_load.library(data.type).get(data.id);
		if(!result) return { failure : { msg : 'This is not a valid entity.' , code : 300 } }

		// check result follows

		if(_s_util.array.find.object(result.follows, 'id', _s_entity.object.profile.id())) { return { success : { msg : 'You were already a follower of this entity!' , code : 300 } } }
		result.follows.push(_s_entity.object.helpers.data.document());

		var update = yield _s_common.update(result, data.type, false, true);
		if(update.failure) return update;
		return { success : { msg : 'You were added to the follow list for this entity.', code : 300 } }
		},
	unfollow : function*(){
		var data = _s_req.validate({
			id : { v:['isAlphaOrNumeric'] },
			type : { in:['t1','t2'] , b:true, default:'t1'}
			})
		if(data.failure) return data;

		var result = yield _s_load.library(data.type).get(data.id);
		if(!result) return { failure : { msg : 'This is not a valid entity.' , code : 300 } }

		// check result follows

		var r = _s_util.array.find.object(result.follows, 'id', _s_entity.object.profile.id(), true);
		if(!r) { return { success : { msg : 'You never were a follower of this entity!' , code : 300 } } }
		
		result.follows.splice(r.index,1);

		var update = yield _s_common.update(result, data.type, false, true);
		if(update.failure) return update;
		return { success : { msg : 'You were removed from the follow list for this entity.', code : 300 } }
		},
	'get/active' : function*(){
		var check = _entities.privileges.check();
		if(check.failure) return check;
		
		var get = yield _s_load.library('t1').get({entity:_s_entity.object.profile.id() });
		if(!get || get.counter == 1) return { failure : { msg : 'No objects matched your query.' , code : 300 } }

		var send = [];

		_s_u.each(get.data, function(o,i){

			var r = _s_util.array.find.object(o.data.entities, 'id', _s_entity.object.profile.id());

			if(o.id == _s_t1.profile.id()) return;

			send.push({
				id : o.id,
				name : o.data.name,
				role : r.role,
				setup : {
					active : r.setup.active,
					status : {
						data : r.setup.status,
						converted : _s_l.info('status',r.setup.status,_s_entity.type, 'entity')
						},
					added : {
						data : r.setup.added,
						converted : _s_dt.convert.datetime.output(r.setup.added)
						}
					}
				})

			})

		return { success : { data : send } }
		},
	'privileges/status' : function*(){
		var check = _entities.privileges.check();
		if(check.failure) return check;
		
		var data = _s_req.validate({
			id : {v:['isAlphaOrNumeric']},
			status : { in:['1','2','3',1,2,3] }
			});
		if(data.failure) return data;

		var r  = yield _s_common.check({
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
				value : _s_entity.object.profile.id(),
				status : {
					allowed : [1,'1'],
					change : data.status
					}
				}
			});

		if(r.failure) return r;

		return { success : {data: {setup: {
			active : r.setup.active,
			status : {
				data : r.setup.status,
				converted : _s_l.info('status',r.setup.status,_s_entity.type, 'entity')
				},
			added : {
				data : r.setup.added,
				converted : _s_dt.convert.datetime.output(r.setup.added)
				}
			} } }};

		},

	'get/enrollment' : function*(){
		var check = _entities.privileges.check();
		if(check.failure) return check;
		
		var get = yield _s_load.library(_s_entity.type).get(_s_entity.object.profile.id());
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
						converted : _s_l.info('status', o.setup.status,_s_entity.type, 'enrollment')
						},
					added : {
						data : o.setup.added,
						converted : _s_dt.convert.datetime.output(o.setup.added)
						}
					}
				})

			})

		return { success : { data : send } }
		},
	'enrollment/status' : function*(){
		var check = _entities.privileges.check();
		if(check.failure) return check;
		
		var data = _s_req.validate({
			id : {v:['isAlphaOrNumeric']},
			status : { in:['2','3',2,3] }
			});
		if(data.failure) return data;

		var r  = yield _s_common.check({
			id : _s_entity.object.profile.id(),
			library : _s_entity.type,
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
				converted : _s_l.info('status',r.setup.status,_s_entity.type, 'enrollment')
				},
			added : {
				data : r.setup.added,
				converted : _s_dt.convert.datetime.output(r.setup.added)
				}
			} } }};

		// now if status is 4, we go ahead and add the user document
		if(data.status != 3) return r;

		var _s_o_t1 = yield _s_load.object('t1',data.id);
		if(!_s_o_t1) return { failure : { msg : 'The user was not found.' , code : 300 } };

		// check and make sure the entity doesnt already exist
		if(_s_o_t1.entities.check(_s_entity.object.profile.id())) return { failure : { msg : 'This user was already added to this entity.' , code : 300 } };

		var i = _s_o_t1.data;
		var s = _s_entity.object.helpers.data.document();
		s.role = 'superadmin';
		s.setup = {
			status : 1,
			active : 1,
			added : _s_dt.now.datetime()
			};

		i.entities.push(s);
		i.id = data.id;

		var update = yield _s_common.update(i,'t1');
		if(update.failure) return update;

		return r

		},
	}