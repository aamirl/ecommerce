// notifications

function Notifications(){}

Notifications.prototype = {
	get helpers(){
		return{
			request : function*(obj){

				var r = yield _s_req.sellyx({
					new_key : 'Yp^$p8*jK.d8&QF79%3vcD!4KrP$m49tY/s',
					method : 'POST',
					type : 'urlquery',
					url : 'https://mq.sellyx.com',
					form : obj.data,
					headers : {
						'Content-Type' : 'application/json'
						}
					})

				if(req.success) return { success : { msg : 'Notification sent.' , code : 300 } }
				return { failure : { msg : 'The notifcation was not sent.' , code : 300 } }
				}
			}
		},
	get new() {
		var self = this;
		return {
			push : function*(obj){

				var arn = yield _s_req.sellyx({
					path : 'notification/fetch',
					method : 'GET',
					params : {
						user_id : obj.entity
						}
					})

				if(!arn.success) return { failure :  { msg : 'A push notification was not sent to the end entity.' , code : 300 } }
				var endpoint = arn.success.data;
				if(endpoint.length == 0) return { failure : { msg : 'There were no registered devices for thie endpoint.' , code : 300 } }

				return yield self.helpers.request({
					data : {
						type : 102,
						endpoint : endpoint,
						message : "\\\" " + obj.message + "\\\"",
						expiration : (obj.expiration?obj.expiration:100)
						}
					})
			
				},
			email : function*(){

				return yield self.helpers.request({
					data : {
						type : 106,
						endpoint : obj.email,
						message : obj.message,
						subject : obj.subject,
						expiration : (obj.expiration:100)
						}
					})


				}
			}
		}

	}

module.exports = function(){
  	if(!(this instanceof Notifications)) { return new Notifications(); }
	}


















