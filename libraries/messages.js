// Messages Library

function Messages(){}

Messages.prototype = {

	model : _s_load.model('messages'),
	helpers : {
		filters : function(){
			return {
				id : { v:['isThread'] , b:true },
				q : { v: ['isSearch'] , b:true},
				seller : { v:['isSeller'] , b:true },
				user : { v:['isUser'] , b:true },
				convert : { in:['true','false'] , default : 'true' },
				include : { v:['isAlphaOrNumeric'], b:true },
				exclude : { v:['isAlphaOrNumeric'], b:true },
				active : { v:['isAlphaOrNumeric'], b:true },
				x : { v:['isInt'] , b:true , default : 0 },
				y : { v:['isInt'] , b:true , default : 10 }
				}
			},
		convert : function*(r){
			r.messages = yield _s_util.convert.multiple({data:r.messages, label:true,library:'messages.msg'});
			return r;
			}
		},
	get : function*(obj){
		return yield _s_common.get(obj, 'messages');
		},
	upsert : function*(obj){
		!obj?obj={}:null;

		var validators = {
			eon : {
				1 : {
					recipients : {v:['isArray']}
					},
				2 : {
					id : { v:['isMessageThread'] }
					}
				},
			subject : {v:['isAlphaOrNumeric'] , b:true},
			message : {v:['isTextarea']},
			priority : {in:["1","2",'3',"4",1,2,3,4], b:true, default : 1},
			as : {in:["1","2",1,2] , b:true, default : 1},
			}

		if(obj.data) var data = _s_req.validate({ data : obj.data, validators : validators })
		else var data = _s_req.validate(validators);
		if(data.failure) return data;

		if(data.id){
			// get the message thread
			var result = yield this.get(data.id);
			if(!result) return { failure : { msg : 'The message thread was not found.' , code : 300 } };
			if(data.as == 2 && !_s_seller) return { failure : { msg : 'There is no seller account linked to your user profile.' , code : 300 } };

			var r = _s_util.array.find.object(result.users, 'id', (data.as == 1 ? obj.user : obj.seller), true);
			if(!r) return { failure : { msg : 'You cannot add a message to this message thread.' , code : 300 } };

			result.messages.push(this.actions.new.message(data, r.index));
			return yield _s_common.update(result,'messages');
			}



		if(data.as == 1){
			if((data.recipients).indexOf(obj.user) != -1) return { failure : { msg : 'You cannot send a message to yourself.' , code : 300 } }
			var my_id = obj.user;
			}
		else{
			if(!obj.seller) return { failure : { msg : 'There is no seller account linked to your user profile.' , code : 300 } }
			if((data.recipients).indexOf(obj.seller) != -1) return { failure : { msg : 'You cannot send a message to your company from your company account.' , code : 300 } }
			var my_id = obj.seller;
			}

		data.recipients.push(my_id);

		var result = false;
		var results = yield this.get({ recipients : data.recipients, convert : false });
		if(results){
			// now we can go through the array of results and only look for the document which occured only between the recipients
			_s_u.each(results.data, function(result_i,ind){
				if(result_i.data.users.length == data.recipients.length){
					result = result_i;
					return false;
					}
				})
			
			if(result) {
				var r = _s_util.array.find.object(result.data.users, 'id', my_id, true);
				result.data.messages.push(this.actions.new.message(data,r.index));

				_s_u.each(result.data.users , function(user,ind){
					result.data.users[ind].read = (ind == r.index ? true : false) 
					})

				result.data.id = result.id;
				return yield _s_common.update(result.data,'messages');
				}
			}

		result = {
			users : [],
			type : 1, 
			setup : {
				added : _s_dt.now.datetime(),
				by : _s_user.profile.id(),
				active : 1,
				status : 1
				}
			}

		// find all the users/sellers
		var recipients = yield _s_load.engine('users').model.get({su:data.recipients,include:'name'});
		if(!recipients || recipients.counter != data.recipients.length) return { failure : { msg : 'Not all the users or sellers were found to send the message to.' , code : 300 } };
		var indexed = false;
		_s_u.each(recipients.data, function(d,i){
			d.id == my_id ? indexed = result.users.length : null;
			var c = {
				marked : [],
				added : _s_dt.now.datetime(),
				name : (d.index == 'users' ? d.data.name.display : d.data.name),
				active : 1,
				id : d.id,
				type : (d.index=='users'?1:2)
				}

			if(d.type == 'users'){
				c.read = (d.id == my_id ? true : false)
				}
			else{
				c.read_users = [_s_user.profile.id()]
				}
			
			result.users.push(c)
			})

		result.messages = [this.actions.new.message(data,indexed)];
		return yield _s_common.new(result,'messages', true);
		},
	update : function*(obj){
		// this is the update function for the manufacturer library
		// we can validate informtion here and then based on the flag add other things if needed
		!obj?obj={}:null;


		if(obj.data){
			var data = obj.data;
			}
		else{
			var data = _s_req.validate({
				id : { v:['isManufacturer'] },
				name : { v : ['isAlphaOrNumeric'] },
				country : { v:['isCountry'] },
				category : { v:['isCategory'] }
				});
			}

		if(data.failure) return data;

		return yield _s_common.update(data, 'Messages');

		// var results = yield this.model.update(data);
		// if(results){
		// 	if(obj.raw) return { success : data }
		// 	return { success : yield _s_common.helpers.convert(data, 'Messages') }
		// 	}
		// return { failure : { msg : 'The manufacturer could not be updated at this time.' , code:300 } } 
		},
	get actions(){
		var self = this;
		return {
			new : {
				message : function(obj, index){
					var t = {
						message : obj.message,
						priority : obj.priority,
						added : _s_dt.now.datetime(),
						user : index
						}
					obj.subject?t.subject=obj.subject:null;
					return t;
					}
				}
			}
		}
	}

module.exports = function(){
  	if(!(this instanceof Messages)) { return new Messages(); }
	}


















