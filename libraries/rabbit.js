var rmq = require('rabbit.js').createContext('amqp://guest:guest@10.0.1.2');
console.log('[x] created context %s',rmq);

function Rabbit(){
	this.send();
	}

Rabbit.prototype = {
	send : function(){
		console.log('adad')
		var queueName = "test";
		var message = "hi "
		var encoding = "utf8";

		rmq.on("ready", function () {
			console.log(" [x] Context is ready");

			var pub = rmq.socket("PUB");
			pub.connect(queueName, function () {
				console.log(" [x] Connected to queue");

				var data = JSON.stringify({ message: message });
				pub.write(data, encoding);
				console.log(" [x] Sent message: %s", message);

				context.close();
				console.log(" [x] Closed context");
				});
			});
		// rmq.on('ready', function() {
		// 	console.log('here');
		// 	var pub = rmq.socket('PUB'), sub = rmq.socket('SUB');
		// 	sub.pipe(process.stdout);
		// 	sub.connect('events', function() {
		// 		pub.connect('events', function() {
		// 			pub.write(JSON.stringify({welcome: 'rabbit.js'}), 'utf8');
		// 			});
		// 		});
		// 	})
		}
	}


module.exports = function(){
  	if(!(this instanceof Rabbit)) { return new Rabbit(); }
	}


















