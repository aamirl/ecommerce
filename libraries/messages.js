// Messages Library

function Messages(){}

Messages.prototype = {
	get helpers(){
		var self = this
		return {
			filters : function(){
				return {
					id : { v:['isAlphaOrNumeric'] , b:true },
					q : { v: ['isAlphaOrNumeric'] , b:true},
					listing : { v:['isAlphaOrNumeric'], b:true },
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
				r.messages = yield self._s.util.convert.multiple({data:r.messages, label:true,library:'messages.msg'});
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
								},
							3 : {
								listing : { v:['isAlphaOrNumeric'] }
								}
							},
						subject : {v:['isAlphaOrNumeric'] , b:true},
						message : {v:['isTextarea']},
						listing : { v:['isListing'] , b:true },
						priority : {in:["1","2",'3',"4",1,2,3,4], b:true, default : 1},
						}
					}
				}
			}
		},
	get : function*(obj){
		return yield this._s.common.get(obj, 'messages');
		},
	upsert : function*(obj){
		!obj?obj={}:null;

		var self = this;

		var data = ( obj.data ? this._s.req.validate({ validators : this.helpers.validators.base(), data : obj.data }) : this._s.req.validate(this.helpers.validators.base()) );
		if(data.failure) return data;

		var my_id = (obj.entity?obj.entity:this._s.entity.object.profile.id());

		if(data.id){
			// get the message thread
			var result = yield this.get(data.id);
			if(!result) return { failure : { msg : 'The message thread was not found.' , code : 300 } };
			
			var r = this._s.util.array.find.object(result.entities, 'id', my_id, true);
			if(!r) return { failure : { msg : 'You cannot add a message to this message thread.' , code : 300 } };

			var mes = this.actions.new.message(data, r.index);

			result.messages.push(mes);
			result.read = [my_id]

			result.setup.updated = this._s.dt.now.datetime()

			// undelete for all the entities involved
			yield self._s.util.each(result.entities, function*(d,i){
				if(d.deleted){
					result.entities[i].deleted = false
					}
				if(d.deleted_forever){
					result.entities[i].deleted_forever = false
					}
				})

			if(result.listing){
				var listing = yield this._s.library('listings').get(result.listing);
				if(!listing) result.subject = "Deleted Listing"

				result.subject = "Listing: " + listing.title

				}

			var r = yield this._s.common.update(result,'messages');
			if(r.failure) return r

			yield self._s.util.each(result.entities, function*(d,i){
				if(d.id != my_id){

					yield self._s.engine('notifications').new.push({
						entity : d.id,
						type : "401",
						title : "You received a reply!",
						body : self._s.entity.object.profile.name()  + " replied to a message.",
						data : {
							id: data.id,
							message : [mes]
							}	
						})

					}
				})

			return { success : { data : [mes] , code : 300 }  }
			}
		else if(data.listing){
			
			var listing = yield this._s.library('listings').get(data.listing);
			if(!listing) return { failure : { msg: 'This listing is not a valid listing anymore.' , code : 300 } }
			// if(listing.setup.active != 1) return { failure : { msg : 'This listing is not an active listing.' , code : 300 } }

			if(!data.recipients || data.recipients.length == 0) data.recipients = [listing.entity.id]
			}

		if(data.recipients.indexOf(my_id) != -1) return { failure : { msg : 'You cannot be a recipient for this message..' , code : 300 } }
		data.recipients.push(my_id);

		result = {
			entities : [],
			read : [my_id],
			subject : (data.subject?data.subject:'No Subject'),
			type : 1, 
			setup : {
				added : this._s.dt.now.datetime(),
				updated : this._s.dt.now.datetime(),
				by : this._s.t1.profile.id(),
				active : 1,
				status : 1
				}
			}


		if(data.listing){
			if(!listing){
				var listing = yield this._s.library('listings').get(data.listing);
				}

			result.listing = data.listing
			if(!listing) result.subject = "Deleted Listing"
			result.subject = "Listing: " + listing.title
			}


		var entities = yield this._s.library('entities').model.get({ entities : data.recipients , include : 'name' });
		if(!entities || entities.counter != data.recipients.length) return  { failure : { msg : 'Invalid entity identification was submitted.' , code : 300 } }
		else entities = entities.data;

		var index;

		yield self._s.util.each(entities, function*(d,i){
			d.id == my_id ? index = result.entities.length : null;
			result.entities.push({
				marked : [],
				added : self._s.dt.now.datetime(),
				name : (d.data.name.display?d.data.name.display:d.data.name),
				active : 1,
				id : d.id,
				type : d.index.replace('t',''),
				deleted : false,
				deleted_forever : false
				})
			if(d.id != my_id){
				yield self._s.engine('notifications').new.push({
					entity : d.id,
					type : "400",
					title : "You received a new message!",
					body : self._s.entity.object.profile.name()  + " sent a new message.",
					data : {
						id : "hello"
						}
					})
				}

			})

		result.messages = [this.actions.new.message(data,index)];
		return yield this._s.common.new(result,'messages', true);
		},
	get actions(){
		var self = this;
		return {
			new : {
				message : function(obj, index){
					var t = {
						message : obj.message,
						priority : obj.priority,
						added : self._s.dt.now.datetime(),
						entity : index
						}
					return t;
					}
				},
			delete : function(){

				}
			}
		}
	}

module.exports = function(){return new Messages(); }