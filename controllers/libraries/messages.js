// Messages Library

function Messages(){}

Messages.prototype = {

	model : _s_load.model('messages'),
	helpers : {
		filters : function(){
			return {
				id : { v:['isThread'] , b:true },
				q : { v: ['isSearch'] , b:true},
				entity : { v:['isEntity'] , b:true },
				convert : { in:['true','false'] , default : 'true' },
				include : { v:['isAlphaOrNumeric'], b:true },
				exclude : { v:['isAlphaOrNumeric'], b:true },
				active : { v:['isAlphaOrNumeric'], b:true },
				x : { v:['isInt'] , b:true , default : 0 },
				y : { v:['isInt'] , b:true , default : 10 },
				count : { in:['true','false',true,false], b:true, default:false }
				}
			},
		convert : function*(r){
			r.messages = yield _s_util.convert.multiple({data:r.messages, label:true,library:'messages.msg'});
			return r;
			},
		validators : {
			base : function(obj){
				!obj?obj={}:null;
				return {
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
				}
			}
		},
	get : function*(obj){
		return yield _s_common.get(obj, 'messages');
		},
	upsert : function*(obj){
		!obj?obj={}:null;

		var data = ( obj.data ? _s_req.validate({ validators : this.helpers.validators.base(), data : obj.data }) : _s_req.validate(this.helpers.validators.base()) );
		if(data.failure) return data;

		var my_id = (obj.entity?obj.entity:_s_entity.object.profile.id());

		if(data.id){
			// get the message thread
			var result = yield this.get(data.id);
			if(!result) return { failure : { msg : 'The message thread was not found.' , code : 300 } };
			
			var r = _s_util.array.find.object(result.entities, 'id', my_id, true);
			if(!r) return { failure : { msg : 'You cannot add a message to this message thread.' , code : 300 } };

			result.messages.push(this.actions.new.message(data, r.index));
			result.read = [my_id]
			return yield _s_common.update(result,'messages');
			}

		if(data.recipients.indexOf(my_id) != -1) return { failure : { msg : 'You cannot be a recipient for this message..' , code : 300 } }
		data.recipients.push(my_id);

		result = {
			entities : [],
			read : [my_id],
			type : 1, 
			setup : {
				added : _s_dt.now.datetime(),
				by : _s_t1.profile.id(),
				active : 1,
				status : 1
				}
			}

		var entities = yield _s_load.library('entities').model.get({ entities : data.recipients , include : 'name' });
		if(!entities || entities.counter != data.recipients.length) return  { failure : { msg : 'Invalid entity identification was submitted.' , code : 300 } }
		else entities = entities.data;

		var index;

		_s_u.each(entities, function(d,i){
			d.id == my_id ? index = result.entities.length : null;
			result.entities.push({
				marked : [],
				added : _s_dt.now.datetime(),
				name : (d.data.name.display?d.data.name.display:d.data.name),
				active : 1,
				id : d.id,
				type : d.index.replace('t',''),
				deleted : false,
				deleted_forever : false
				})

			// yield _s_load.library('notifications').new.websocket({
			// 	user : d.id,
			// 	message : JSON.stringify({ header : "message_count" , body :  })				
			// 	})


			})

		result.messages = [this.actions.new.message(data,index)];
		return yield _s_common.new(result,'messages', true);
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
						entity : index
						}
					obj.subject?t.subject=obj.subject:null;
					return t;
					}
				},
			delete : function(){

				}
			}
		}
	}

module.exports = function(){
  	if(!(this instanceof Messages)) { return new Messages(); }
	}


















