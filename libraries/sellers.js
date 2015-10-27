// Sellers Library

function Sellers(){

	}

Sellers.prototype = {
	model : _s_load.model('sellers'),
	get helpers(){
		var self = this;
		return {
			cached : function*(result , key){
				if(result.addresses.length > 0){
					var c = _s_util.array.find.object(result.addresses,'primary','true',true);
					result.country = c.object.country;
					}

				var r = yield _s_util.convert.single({data:result,label:true,library:'sellers',dates:{r:true}});

				if(key) {
					if(typeof key !==  'string') key = _s_cache_key;
					yield _s_cache.key.set({ cache_key: key, key : 'seller' , value : r });
					}
				return r;
				}
			}
		},
	get : function*(obj){
		return yield _s_common.get(obj, 'sellers');
		},
	new : function*(obj){
		// this is to add a new seller

		var doc = {
			name : obj.name,
			website : obj.website,
			fans : [],
			social : {
				twitter : {},
				facebook : {},
				google : {},
				instagram : {},
				pinterest : {}
				},
			faq : [],
			addresses : [],
			reputation : {
				score : 0,
				data : []
				},
			numbers : [],
			verifications : {
				types : [],
				verified : false
				},
			description : (obj.description || 'Say anything you want about your company.'),
			totals : {},
			type : 1,
			master : obj.user,
			setup : {
				added : _s_dt.now.datetime(),
				status : 1,
				active : 1
				}
			}

		return yield _s_common.new(doc,'sellers', true);
		},
	update : function*(obj){
		// this is the update function for the Sellers library for basic information
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
			if(!obj.convert) return { success : yield _s_common.helpers.convert(result, 'Sellers') }
			return { success : true }
			}
		return { failure : { msg : 'The user could not be updated at this time.' , code : 300 } }
		}
	}


module.exports = function(){
  	if(!(this instanceof Sellers)) { return new Sellers(); }
	}