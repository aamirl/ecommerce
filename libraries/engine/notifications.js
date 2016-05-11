// notifications

var _grandma = require('grandma');
_grandma.config('Yp^$p8*jK.d8&QF79%3vcD!4KrP$m49tY/s')

function Notifications(){}

Notifications.prototype = {
	get helpers(){
		return{
			// convert : function*(obj){
			// 	return yield self._s.util.convert.multiple({ data:obj, label:true, library:library });

			// 	},
			request : function*(obj){

				var r = yield this._s.req.sellyx({
					new_key : 'Yp^$p8*jK.d8&QF79%3vcD!4KrP$m49tY/s',
					method : 'POST',
					type : 'urlquery',
					url : 'https://mq.sellyx.com',
					form : obj.data,
					headers : {
						'Content-Type' : 'application/json'
						}
					})

				if(r.success) return { success : { msg : 'Notification sent.' , code : 300 } }
				return { failure : { msg : 'The notifcation was not sent.' , code : 300 } }
				}
			}
		},
	get : function*(obj, count){

		var get = yield this._s.model('notifications').get({id:obj.entity, include:'notifications'})
		if(!get) return { failure : { msg : 'No results.' , code : 300 } }

		get.notifications = yield this._s.util.convert.multiple({ data:get.notifications, label:true });

		if(count) return { success : { data : get.notifications.length } }

		return { success : { data : get } }
		},
	upsert : function*(obj){

		var notification = this._s.util.clone.deep(obj);
		notification.added = this._s.dt.now.datetime()
		notification.read = false
		notification.id = this._s.common.helpers.generate.id()
		delete notification.add
		delete notification.entity

		var get = yield this._s.model('notifications').get(obj.entity)

		if(!get){
			var doc = {
				id : obj.entity,
				notifications : [notification],
				setup : {
					added :  this._s.dt.now.datetime(),
					active : 1,
					status : 1
					}
				}

			// add the document
			return yield this._s.model('notifications').new(doc)
			}
			
		// update the document
		get.notifications.push(notification)
		return yield this._s.model('notifications').update(get)
		},
	get new() {
		var self = this;
		return {


			rest : function*(obj){

				return yield self.helpers.request({
					data : {
						type : 107,
						endpoint : obj.method?obj.method:'POST' + ' ' + obj.endpoint + ' '+(obj.content_type?obj.content_type:'application/json'),
						message : "{\"servermsg\": "+(obj.code?obj.code:103)+", \"message\": \""+JSON.stringify(obj.data)+"\" }",
						expiration : (obj.expiration?obj.expiration:100)
						}
					});



				},
			websocket : function*(obj){
				_grandma.GSSWebSocketSchedule(obj.user, (obj.broadcast?obj.key:""), {servermsg: obj.code, message : obj.message}, 100);
				return { success : true }
				},
			push : function*(obj){
		
				if(obj.add) yield self.upsert(obj)

				obj.data.target = obj.entity

				_grandma.GSSPushGCMSchedule(obj.entity, obj.type, obj.title, obj.body, obj.data, 100);
				return { success : true }
				},
			email : function*(obj){

				return yield self.helpers.request({
					data : {
						type : 106,
						endpoint : obj.email,
						message : "Content-Type: text/html; charset=ISO-8859-1\r\nSubject: " + obj.subject + "\r\n\r\n" + obj.message + "\r\n",
						expiration : (obj.expiration?obj.expiration:100)
						}
					})


				}
			}
		}

	}

module.exports = function(){ return new Notifications(); }


















