
module.exports = {
	get : function*(){
		return { success : { data : yield _s_entity.object.profile.all(true) } };
		},
	'get/faq' : function*(){
		var key = _s_entity.object.key('faq');
		if(!key) return { failure : { msg : 'There was no FAQ information for this entity.' , code : 300 } }
		return { success : { data : key } };
		},
	existing : function*(){
		if(_s_entity.type != 1) return { failure : { msg : 'This option is only valid for individuals users at this time.' , code : 300 } }

		var data = _s_req.validate({
			id : { v:['isAlphaOrNumeric'] }
			})
		if(data.failure) return data;

		var get = yield _s_load.library('entities').get({entities:[data.id]});
		if(!get||get.counter > 1) return { failure : { msg : 'The entity you are trying to join does not exist.' , code : 300 } }
		else get = get.data[0].data;

		if(get.setup.active == 0) return { failure : { msg : 'The enrtity you are trying to join is not an active entity at this time.' , code : 300 }}
		if(get.type == 1) return { failure : { msg : 'You cannot join this entity because it is not valid.' , code : 300 } }
		if(get.type == 1) return { failure : { msg : 'You cannot join this entity because it is not valid.' , code : 300 } }
		
		// check if this entity tried to enroll
		var r = _s_util.array.find.object(get.enrollment.pending, 'id', _s_t1.profile.id(), true);
		if(r)  return { failure : { msg : 'You have already submitted an active request to enroll in this entity. Please wait for the entity administration to respond.' , code :300} }
		r = _s_util.array.find.object(get.enrollment.blocked, 'id', _s_t1.profile.id(), true);
		if(r)  return { failure : { msg : 'You have been blocked from joining this entity.' , code :300} }
		// r = _s_util.array.find.object(get.enrollment.denied, 'id', _s_t1.profile.id(), true);
		// if(r)  return { failure : { msg : 'Your request to join this entity was denied.' , code :300} };

		var t = _s_entity.object.helpers.data.document();
		t.added = _s_dt.now.datetime();
		
		get.enrollment.pending.push(t)

		get.id = data.id;
		var update = yield _s_common.update(get, 't'+get.type, false, true);
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

		return { success : { data : new Buffer(JSON.stringify(send)).toString('base64') , relayURI : s_config.dashboard + "entities/a/confirm" } }

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
		g.push(_s_entity.object.helpers.data.document());

		// update _s_t1
		var result = yield _s_t1.library.update({
			id : _s_t1.profile.id(),
			entities : g
			})

		if(!result) return { failure : { msg : 'Updating the entity data failed.' , code : 300 } }
		
		// set in cache
		yield _s_t1.library.helpers.cached(result,_s_cache_id);
		// update object for the last step
		_s_t1 = yield _s_load.object('t1',result);

		return { status: 302, headers :{ 'Location' : _s_req.get('redirect') ||'www.google.com?&q=Grandmas+Are+The+Best' } }
		},
	'update/basic' : function*(){
		return  yield _s_entity.library.update();
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

		var update = yield _s_common.update(result, _s_entity.type, false, true);
		if(update.failure) return update;
		return { success : { data : yield _s_util.convert.single(update.faq) } }
		},
	follow : function*(){
		var data = _s_req.validate({
			id : { v:['isAlphaOrNumeric'] },
			type : { in:['1','2'] , b:true, default:'1'}
			})
		if(data.failure) return data;

		if(data.id == _s_entity.object.profile.id()) return { failure : { msg : 'Unfortunately, at this time you cannot follow yourself on Sellyx!' , code : 300 } }

		var result = yield _s_load.library("t"+data.type).get(data.id);
		if(!result) return { failure : { msg : 'This is not a valid entity.' , code : 300 } }

		// check result follows

		if(_s_util.array.find.object(result.follows, 'id', _s_entity.object.profile.id())) { return { success : { msg : 'You were already a follower of this entity!' , code : 300 } } }
		result.follows.push(_s_entity.object.helpers.data.document());

		var update = yield _s_common.update(result, "t"+data.type, false, true);
		if(update.failure) return update;
		return { success : { msg : 'You were added to the follow list for this entity.', code : 300 } }
		},
	unfollow : function*(){
		var data = _s_req.validate({
			id : { v:['isAlphaOrNumeric'] },
			type : { in:['1','2'] , b:true, default:'1'}
			})
		if(data.failure) return data;

		var result = yield _s_load.library("t"+data.type).get(data.id);
		if(!result) return { failure : { msg : 'This is not a valid entity.' , code : 300 } }

		// check result follows

		var r = _s_util.array.find.object(result.follows, 'id', _s_entity.object.profile.id(), true);
		if(!r) { return { success : { msg : 'You never were a follower of this entity!' , code : 300 } } }
		
		result.follows.splice(r.index,1);

		var update = yield _s_common.update(result, "t"+data.type, false, true);
		if(update.failure) return update;
		return { success : { msg : 'You were removed from the follow list for this entity.', code : 300 } }
		},
	approve : function*(){
		if(_s_entity.type == 1) return { failure : { msg : 'This action cannot be completed.' , code : 300 } }
		}
	}