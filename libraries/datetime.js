
function DateTime(){
	this.standards = {
		dt : "dddd, MMMM Do, YYYY, h:mm A",
		d : "dddd, MMMM Do, YYYY"
		};

	this.dt = require('moment');
	this.dtz = require('moment-timezone');
	this.active = 'America/Los_Angeles'
	// !_s_session.get('timezone', true) ? this.active = 'America/Los_Angeles' : this.active = _s_session.get('timezone');

	}

DateTime.prototype = {
	timeago : function(date){
		return this.dt(date).fromNow();
		},
	add : function(date, duration, type){

		return this.dt(date).add(duration, type).format();

		},
	// test to see if input date is valid
	get valid() {
		var self = this;
		return {
			datetime : function(inp){
				return self.dt(inp, self.standards.dt).isValid();
				},
			date : function(inp){
				return self.dt(inp, self.standards.d).isValid();
				}
			}
		},
	// get the current date and time for storing information in UTC format
	get now() {
		var self = this;
		return {
			datetime: function(){
				return self.dtz.utc().format();
				},
			date : function(){
				return self.dtz.utc().format();
				}
			}
		},
	get compare() {
		var self = this;
		return {
			before : function(testee, tester){
				if(tester == 'now') tester = self.now.datetime();
				else tester = self.convert.datetime.input(tester);

				// testee = self.convert.datetime.input(testee);

				return self.dt(testee).isBefore(tester);
				},
			after : function(testee, tester){
				if(tester == 'now') tester = self.now.datetime();
				else tester = self.convert.datetime.input(tester);

				// testee = self.convert.datetime.input(testee);

				return self.dt(testee).isAfter(tester);
				}
			}
		},
	// convert the input date into a readable date of the current user's timezone
	get adjust(){
		var self = this;
		return {
			subtract : function(date, number, units, format){
				return date.subtract(number,(units ? units : 'days')).format(format ? format : this.standards.dt)
				}
			}
		},
	get convert() {
		var self = this;
		return {
			date : {
				output : function(date){
					return self.dtz.tz(date, self.active).format(self.standards.d);
					},
				// convert the input date into UTC for storage
				input : function(date){
					return self.dtz.utc(self.dt(date, self.standards.d).format()).format();
					}
				},
			datetime : {
				output : function(date){
					return self.dtz.tz(date, self.active).format(self.standards.dt);
					},
				// convert the input date into UTC for storage
				input : function(date){
					return self.dtz.utc(self.dt(date, self.standards.dt).format()).format();
					}
				}
			}
		}
	}



module.exports = function(){
  	if(!(this instanceof DateTime)) { return new DateTime(); }
	}

