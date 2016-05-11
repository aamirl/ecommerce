module.exports = function(){  return new Controller(); }

function Controller(){}
Controller.prototype = {
	'get/by' : function*(){
		var _reviews = this._s.library('reviews');
		var data = this._s.req.validate(_reviews.helpers.filters());
		if(data.failure) return data;

		data.by = this._s.entity.object.profile.id()
		data.endpoint = true;

		return yield _reviews.get(data);
		},
	'get/for' : function*(){
		var _reviews = this._s.library('reviews');
		var data = this._s.req.validate(_reviews.helpers.filters());
		if(data.failure) return data;

		data.for = this._s.entity.object.profile.id()
		data.endpoint = true;

		return yield _reviews.get(data);
		},
	upsert : function*(){
		var _reviews = this._s.library('reviews');
		return yield _reviews.upsert();
		},
	'comment/add' : function*(){
		var _reviews = this._s.library('reviews');
		var data = this._s.req.validate({
			id : { v:['isReview'] },
			comment : { v:['isTextarea'] }
			})
		if(data.failure) return data

		var result = yield _reviews.get(data.id)
		if(!result) return { failure : { msg : 'The review could not be found' , code : 300 } }
		console.log(result)
		if(result.setup.active != 1) return { failure : { msg : 'This review cannot be commented on.' , code : 300 } }

		result.comments.push({
			entity : this._s.entity.object.helpers.data.document(),
			comment : data.comment,
			id : this._s.common.helpers.generate.id(),
			setup : {
				status : 1,
				active : 1,
				added : this._s.dt.now.datetime()
				}
			})

		var t = yield this._s.common.update(result, 'reviews')
		if(t.failure) return t

		return { success : { data : true } }
		},
	delete : function*(){
		var _reviews = this._s.library('reviews');
		var data = this._s.req.validate({
			ids : { v:['isArray'] }
			})
		if(data.failure) return data;

		// lets pull up the messages
		var results = yield _messages.get(data);
		if(!results || results.counter != data.ids.length) return { failure : { msg : 'Not all messages were found.', code : 300 } };

		var errors = [];
		yield this._s.util.each(results.data, function*(o,i){
			var r = this._s.util.array.find.object(o.data.entities, 'id', this._s.entity.object.profile.id(), true);
			if(!r){errors.push({ msg : 'The message with id ' + o.id + ' was not found to be valid for the current user.' }); return false }

			r.object.deleted = true;
			o.data.entities[r.index] = r.object;
			o.data.id = o.id;

			var update = yield this._s.common.update(o.data, 'messages');
			if(update.failure) errors.push({ msg : 'The message with the id of ' + o.id + ' was not successfully deleted.' })
			})
		if(errors.length > 0) return { failure : { msg : 'There were errors in processing the deletions. Please see accompanying details for more information.' , data : errors ,code :300 } }
		return { success : { msg : 'The messages were successfully deleted.' , code : 300 } }
		},
	}