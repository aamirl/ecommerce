var _messages = _s_load.library('messages');


module.exports = {
	'get/inbox' : function*(){
		var data = _s_req.validate(_messages.helpers.filters());
		if(data.failure) return data;
		
		data.entity = _s_entity.object.profile.id();
		data.endpoint = true;

		return yield _messages.get(data);
		},
	'get/trash' : function*(){
		var data = _s_req.validate(_messages.helpers.filters());
		if(data.failure) return data;
		
		data.entity = _s_entity.object.profile.id();
		data.endpoint = true;
		data.deleted = true;

		return yield _messages.get(data);
		},
	upsert : function*(){
		return yield _messages.upsert();
		},
	delete : function*(){
		var data = _s_req.validate({
			ids : { v:['isArray'] }
			})
		if(data.failure) return data;

		// lets pull up the messages
		var results = yield _messages.get(data);
		if(!results || results.counter != data.ids.length) return { failure : { msg : 'Not all messages were found.', code : 300 } };

		var errors = [];
		yield _s_util.each(results.data, function*(o,i){
			var r = _s_util.array.find.object(o.data.entities, 'id', _s_entity.object.profile.id(), true);
			if(!r){errors.push({ msg : 'The message with id ' + o.id + ' was not found to be valid for the current user.' }); return false }

			r.object.deleted = true;
			o.data.entities[r.index] = r.object;
			o.data.id = o.id;

			var update = yield _s_common.update(o.data, 'messages');
			if(update.failure) errors.push({ msg : 'The message with the id of ' + o.id + ' was not successfully deleted.' })
			})
		if(errors.length > 0) return { failure : { msg : 'There were errors in processing the deletions. Please see accompanying details for more information.' , data : errors ,code :300 } }
		return { success : { msg : 'The messages were successfully deleted.' , code : 300 } }
		},
	'delete/forever' : function*(){
		var data = _s_req.validate({
			ids : { v:['isArray'] }
			})
		if(data.failure) return data;

		// lets pull up the messages
		var results = yield _messages.get(data);
		if(!results || results.counter != data.ids.length) return { failure : { msg : 'Not all messages were found.', code : 300 } };

		var errors = [];
		yield _s_util.each(results.data, function*(o,i){
			var r = _s_util.array.find.object(o.data.entities, 'id', _s_entity.object.profile.id(), true);
			if(!r){errors.push({ msg : 'The message with id ' + o.id + ' was not found to be valid for the current user.' }); return false }

			r.object.deleted_forever = true;
			o.data.entities[r.index] = r.object;
			o.data.id = o.id;

			var update = yield _s_common.update(o.data, 'messages');
			if(update.failure) errors.push({ msg : 'The message with the id of ' + o.id + ' was not successfully deleted.' })
			})
		if(errors.length > 0) return { failure : { msg : 'There were errors in processing the deletions. Please see accompanying details for more information.' , data : errors ,code :300 } }
		return { success : { msg : 'The messages were successfully deleted.' , code : 300 } }
		},
	recover : function*(){
		var data = _s_req.validate({
			ids : { v:['isArray'] }
			})
		if(data.failure) return data;

		// lets pull up the messages
		var results = yield _messages.get(data);
		if(!results || results.counter != data.ids.length) return { failure : { msg : 'Not all messages were found.', code : 300 } };

		var errors = [];
		yield _s_util.each(results.data, function*(o,i){
			var r = _s_util.array.find.object(o.data.entities, 'id', _s_entity.object.profile.id(), true);
			if(!r){errors.push({ msg : 'The message with id ' + o.id + ' was not found to be valid for the current user.' }); return false }

			r.object.deleted = false;
			o.data.entities[r.index] = r.object;
			o.data.id = o.id;

			var update = yield _s_common.update(o.data, 'messages');
			if(update.failure) errors.push({ msg : 'The message with the id of ' + o.id + ' was not successfully recovered.' })
			})
		if(errors.length > 0) return { failure : { msg : 'There were errors in processing the recoveries. Please see accompanying details for more information.' , data : errors ,code :300 } }
		return { success : { msg : 'The messages were successfully recovered.' , code : 300 } }
		},
	read : function*(){
		var data = _s_req.validate({
			id : { v:['isMessageThread'] }
			})
		if(data.failure) return data;

		// lets pull up the message
		var result = yield _messages.get(data);
		if(!result) return { failure : { msg : 'Your message was not found.', code : 300 } };

		// now lets confirm that the entity is in the thread
		var r = _s_util.array.find.object(result.entities, 'id', _s_entity.object.profile.id(), true);
		if(!r) return { failure : { msg : 'You are not a valid recipient for this message.' , code : 300 } }


		if(_s_util.indexOf(result.read, _s_t1.profile.id()) != -1){ return { success : { msg : 'Read' , code : 300 } } }
		(result.read).push(_s_t1.profile.id());

		var update = yield _s_common.update(result,'messages');
		if(update.failure) return { failure : { msg : 'Message read was not saved', code :300 } }
		return { success : { msg : 'Read', code : 300 } }
		}
	}