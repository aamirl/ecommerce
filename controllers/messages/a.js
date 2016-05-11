


module.exports = function(){  return new Controller(); }

function Controller(){}
Controller.prototype = {
	'count' : function*(){
		var _messages = this._s.library('messages');
		
		var data = this._s.req.validate(_messages.helpers.filters());
		if(data.failure) return data;
		
		data.entity = this._s.entity.object.profile.id();
		data.endpoint = true;
		data.unread = true;
		data.count = true;

		return yield _messages.get(data);
		},
	'get/threads' : function*(){
		var _messages = this._s.library('messages');
		
		var data = this._s.req.validate(_messages.helpers.filters());
		if(data.failure) return data;
		
		data.entity = this._s.entity.object.profile.id();
		data.endpoint = true;

		return yield _messages.get(data);
		},
	'get/threads/listing' : function*(){
		var _messages = this._s.library('messages');
		var _listings = this._s.library('listings');
		
		var r = _messages.helpers.filters()
		r.listing.b = false

		var data = this._s.req.validate(r);
		if(data.failure) return data;

		data.endpoint = true

		var listing = yield _listings.get(data.listing);
		if(!listing) return { failure : { msg : 'The listing was not found.' , code :300 } }
		if(listing.entity.id != this._s.entity.object.profile.id()) return { failure : { msg : 'This listing does not belong to the entity trying to view it.' } }
		
		return yield _messages.get(data);
		},
	'get/thread' : function*(){
		var _messages = this._s.library('messages');
		var _listings = this._s.library('listings');
		
		var data = this._s.req.validate({
			id : { v:['isMessageThread'] }
			});
		if(data.failure) return data;
		
		var r = yield _messages.get(data);

		var f = this._s.util.array.find.object(r.entities, 'id', this._s.entity.object.profile.id(), true);
		if(!f) return { failure : { msg : 'This thread does not belong to the current entity' , code :300 } }

		return { success : { data : yield _messages.helpers.convert(r) } }
		},
	'get/thread/listing' : function*(){
		var _messages = this._s.library('messages');
		
		var data = this._s.req.validate({
			listing : { v:['isAlphaOrNumeric'] },
			entities : { v:['isArray'] , b:true, default :[] },
			});
		if(data.failure) return data;

		data.entities.push(this._s.entity.object.profile.id())

		var result = yield _messages.get(data);

		if(!result || result.counter != 1) return { failure : { msg: 'No previous history.' , code :300  } }
		else {
			result = result.data[0]
			result.data.id = result.id
			result = result.data
			}

		return { success : { data : yield _messages.helpers.convert(result) } }
		},
	'get/trash' : function*(){
		var _messages = this._s.library('messages');
		
		var data = this._s.req.validate(_messages.helpers.filters());
		if(data.failure) return data;
		
		data.entity = this._s.entity.object.profile.id();
		data.endpoint = true;
		data.deleted = true;

		return yield _messages.get(data);
		},
	upsert : function*(){
		var _messages = this._s.library('messages');
		
		return yield _messages.upsert();
		},
	delete : function*(){
		var _messages = this._s.library('messages');
		var self = this

		var data = this._s.req.validate({
			ids : { v:['isArray'] }
			})
		if(data.failure) return data;

		// lets pull up the messages
		var results = yield _messages.get(data);
		if(!results || results.counter != data.ids.length) return { failure : { msg : 'Not all messages were found.', code : 300 } };

		var errors = [];
		yield this._s.util.each(results.data, function*(o,i){
			var r = self._s.util.array.find.object(o.data.entities, 'id', self._s.entity.object.profile.id(), true);
			if(!r){errors.push({ msg : 'The message with id ' + o.id + ' was not found to be valid for the current user.' }); return false }

			r.object.deleted = true;
			o.data.entities[r.index] = r.object;
			o.data.id = o.id;

			var update = yield self._s.common.update(o.data, 'messages');
			if(update.failure) errors.push({ msg : 'The message with the id of ' + o.id + ' was not successfully deleted.' })
			})
		if(errors.length > 0) return { failure : { msg : 'There were errors in processing the deletions. Please see accompanying details for more information.' , data : errors ,code :300 } }
		return { success : { msg : 'The messages were successfully deleted.' , code : 300 } }
		},
	'delete/forever' : function*(){
		var _messages = this._s.library('messages');
		var self = this

		var data = this._s.req.validate({
			ids : { v:['isArray'] }
			})
		if(data.failure) return data;

		// lets pull up the messages
		var results = yield _messages.get(data);
		if(!results || results.counter != data.ids.length) return { failure : { msg : 'Not all messages were found.', code : 300 } };

		var errors = [];
		yield self._s.util.each(results.data, function*(o,i){
			var r = self._s.util.array.find.object(o.data.entities, 'id', self._s.entity.object.profile.id(), true);
			if(!r){errors.push({ msg : 'The message with id ' + o.id + ' was not found to be valid for the current user.' }); return false }

			r.object.deleted_forever = true;
			o.data.entities[r.index] = r.object;
			o.data.id = o.id;

			var update = yield self._s.common.update(o.data, 'messages');
			if(update.failure) errors.push({ msg : 'The message with the id of ' + o.id + ' was not successfully deleted.' })
			})
		if(errors.length > 0) return { failure : { msg : 'There were errors in processing the deletions. Please see accompanying details for more information.' , data : errors ,code :300 } }
		return { success : { msg : 'The messages were successfully deleted.' , code : 300 } }
		},
	recover : function*(){
		var _messages = this._s.library('messages');
		var self = this

		var data = this._s.req.validate({
			ids : { v:['isArray'] }
			})
		if(data.failure) return data;

		// lets pull up the messages
		var results = yield _messages.get(data);
		if(!results || results.counter != data.ids.length) return { failure : { msg : 'Not all messages were found.', code : 300 } };

		var errors = [];
		yield this._s.util.each(results.data, function*(o,i){
			var r = self._s.util.array.find.object(o.data.entities, 'id', self._s.entity.object.profile.id(), true);
			if(!r){errors.push({ msg : 'The message with id ' + o.id + ' was not found to be valid for the current user.' }); return false }

			r.object.deleted = false;
			o.data.entities[r.index] = r.object;
			o.data.id = o.id;

			var update = yield self._s.common.update(o.data, 'messages');
			if(update.failure) errors.push({ msg : 'The message with the id of ' + o.id + ' was not successfully recovered.' })
			})
		if(errors.length > 0) return { failure : { msg : 'There were errors in processing the recoveries. Please see accompanying details for more information.' , data : errors ,code :300 } }
		return { success : { msg : 'The messages were successfully recovered.' , code : 300 } }
		},
	read : function*(){
		var _messages = this._s.library('messages');
		
		var data = this._s.req.validate({
			id : { v:['isMessageThread'] }
			})
		if(data.failure) return data;

		// lets pull up the message
		var result = yield _messages.get(data);
		if(!result) return { failure : { msg : 'Your message was not found.', code : 300 } };

		// now lets confirm that the entity is in the thread
		var r = this._s.util.array.find.object(result.entities, 'id', this._s.entity.object.profile.id(), true);
		if(!r) return { failure : { msg : 'You are not a valid recipient for this message.' , code : 300 } }


		if(this._s.util.indexOf(result.read, this._s.entity.object.profile.id()) != -1){ return { success : { msg : 'Read' , code : 300 } } }
		(result.read).push(this._s.entity.object.profile.id());

		var update = yield this._s.common.update(result,'messages');
		if(update.failure) return { failure : { msg : 'Message read was not saved', code :300 } }
		return { success : { msg : 'Read', code : 300 } }
		}
	}