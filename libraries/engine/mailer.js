// Mailer
var smtpTransport = require('nodemailer-smtp-transport');

function Mailer(){

	

	}


Mailer.prototype.send = function(obj){
	
	var send = require('nodemailer').createTransport(smtpTransport({
		host : 'smtp.gmail.com',
		auth : {
			user : (obj.registration?'registration@sellyx.com':'contact@sellyx.com'),
			pass : 'sTech123'
			}
		}));


	// obj must have to, subject, text, html version of mail
	if(obj.registration) obj.from = 'Sellyx Registration <registration@sellyx.com>'
	else obj.from = 'Sellyx Contact <contact@sellyx.com>'

	var deferred = _s_q.defer();	
	send.sendMail(obj, deferred.resolve());
	return deferred.promise.then(function(error, info){
		return error;	
		})

	}

module.exports = function(){
  	if(!(this instanceof Mailer)) { return new Mailer(); }
	}


















