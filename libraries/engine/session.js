// Session Library


function Session(sess){
	this.info = sess;
	}

Session.prototype = {
	get : function(path, truthy){
		if(path == undefined) {return this.info;}
		else {
			var o = this.info;
			path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		    path = path.replace(/^\./, '');           // strip a leading dot
		    var a = path.split('.');
		    while (a.length) {
		        var n = a.shift();
		        if (n in o) {
		            o = o[n];
		        	} 
		        else {
		            return;
		        	}
		    	}

		    if(truthy !== undefined && truthy) return _s_util.tf(o)
		    else return o;
			}
		},
	set : function(path, value){
		try { 
			var schema = this.info;
			var pList = path.split('.');
			var len = pList.length;
			for(var i = 0; i < len-1; i++) {
				var elem = pList[i];
				if( !schema[elem] ) schema[elem] = {}
				schema = schema[elem];
				}
			// this.info[pList[len-1]] = value;
			schema[pList[len-1]] = value;
			return { success : true };
			}
		catch(err){
			return { failure : err };
			}
		},
	delete : function(path){
		try {
			var schema = this.info;
			var pList = path.split('.');
			var len = pList.length;
			for(var i = 0; i < len-1; i++) {
				var elem = pList[i];
				if( !schema[elem] ) return false;
				schema = schema[elem];
				}
			delete schema[pList[len-1]];
			return { success : true };
			}
		catch(err){
			return { failure : err };
			}
		},
	update : function(path, data){
		try{
			this.info[path] = _s_util.merge(this.info[path], data, true);
			return { success : true };
			}
		catch(err){
			return { failure : err };
			}
		}
	}

module.exports = function(sess){
  	if(!(this instanceof Session)) { return new Session(sess); }
	}
