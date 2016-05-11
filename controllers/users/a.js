

module.exports = function(){  return new Controller(); }

function Controller(){}
Controller.prototype = {
	get : function*(){
		return { success : { data : yield this._s.t1.profile.all(true) } }
		},
	'entities/summary' : function*(){
		return { success : { data: this._s.t1.entities.summary() } }
		},
	'update/basic' : function*(){
		// this is the api endpoint for updating the information for an existing user that is basic
		var data = this._s.req.validate({
			tagline : { v:['isAlphaOrNumeric'] , b:true },
			description : { v : ['isTextarea'] , b:true },
			social : this._s.common.helpers.validators.social(),
			currency : { in:this._s.currency.helpers.valid(), b:true },
			standard : { in:['US','MT'], b:true },
			});

		if(data.failure) return data;
		return  yield this._s.library('t1').update({data:data , result : this._s.t1.data});
		},
	'update/address' : function*(){
		var s = this._s.common.helpers.validators.address({required:true,json:false});
		s.index = { v:['isInt'] , b:true };
		var data = this._s.req.validate(s)

		if(data.failure) return data;

		// next we are going to see whether the inputted address exists in the address book
		var addresses = this._s.t1.profile.addresses.all();
		if(this._s.util.array.compare.objects(addresses , data)) return {  failure : { msg : 'You already have this address on file.' , code : 300 } };

		var result = this._s.t1.data;

		// let's see if we are adding this or updating something
		if(data.index || data.index == 0){
			var index = data.index;
			delete data.index;
			result.addresses[index] = data;
			}
		else result.addresses.push(data);			

		return  yield this._s.library('t1').update({data:data , result : result , return_target : 'addresses'});
		},
	'update/address/delete' : function*(){
		var data = this._s.req.validate({
			index : { v:['isInt'] , b:true }
			})

		if(data.failure) return data;

		var result = this._s.t1.data;
		result.addresses.splice(data.index,1);

		return  yield this._s.library('t1').update({data:data , result : result , return_target : 'addresses'});
		}
	}