// Users Library

function Users(){

	}

Users.prototype = {
	model : _s_load.model('users'),
	get helpers(){
		var self = this;
		return {
			cached : function*(result , key){
				if(result.addresses.length > 0){
					var c = _s_util.array.find.object(result.addresses,'primary','true',true);
					result.country = c.object.country;
					}

				var r = yield _s_util.convert.single({data:result,label:true,library:'users',dates:{r:true}});

				if(key) {
					if(typeof key !==  'string') key = _s_cache_key;
					yield _s_cache.key.set({ cache_key: key, key : 'user' , value : r });
					}
				return r;
				}
			}
		},
	get : function*(obj){
		return yield _s_common.get(obj, 'users');
		},
	new : function*(obj){
		// this is to add a new user to the user library
		
		// you have to supply an object here with the document coming from the oAuth server - that will serve as the base of the user document
		var doc = {
			id:obj.id,
			name : {
				first : obj.name.first,
				middle : obj.name.middle,
				last : obj.name.last,
				display : obj.name.display,
				},
			email : {
				id : obj.email,
				verified : true
				},
			fans : [],
			currency : 1,
			standard : 1,
			addresses : [],
			reputation : {
				score : obj.reputation.score,
				data : obj.reputation.data
				},
			numbers : [
				{
					number : obj.telephone,
					primary : true
					}
				],
			verifications : {
				types : [],
				verified : false
				},
			tagline : 'Add tagline here!',
			description : 'Say anything you want to say or describe about yourself to the world here.',
			setup : {
				added : obj.createdAt,
				status : obj.status,
				active : obj.active
				}
			}
		
		return yield _s_common.new(doc,'users', true);
		},
	update : function*(obj){
		// this is the update function for the users library for basic information
		// we are going to supply the information being updated here 

		if(!obj && !obj.data){
			return { failure : { msg : 'No information was submitted for update.'} , code : 300 }
			}

		var data = (obj.data?obj.data:obj);

		if(Object.keys(data).length == 1){
			// means only id was submitted so nothing needs to be changed
			return { failure : { msg : 'No details were changed for this user.' , code : 300 } }
			}

		// first we want to load the user information
		var result = yield this.get({id:data.id,convert:false});
		if(!result) return { failure : {  msg : 'This user\'s information was not found.' , code : 300 } }

		result = _s_util.merge(result,data);

		var update = yield this.model.update(result);
		if(update){
			if(!obj.convert) return { success : yield _s_common.helpers.convert(result, 'users') }
			return { success : true }
			}
		return { failure : { msg : 'The user could not be updated at this time.' , code : 300 } }
		}
	}


module.exports = function(){
  	if(!(this instanceof Users)) { return new Users(); }
	}