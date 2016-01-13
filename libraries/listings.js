// Listings

var _interests = _s_load.library('interests');


function Listings(){}

Listings.prototype = {
	model : _s_load.model('listings'),
	get helpers() {
		var self = this;
		return {
			filters : function(){
				return {
					q : { v:['isSearch'] , b:true },
					id : { v:['isLocalListing'] , b:true },
					distance : { in:[5,10,15,20,50,100,150,200,250,"5","10","15","20","50","100","150","200","250"], b:true , default : 250 },
					categories : { v:['isArray'] , b:true },
					conditions : { csv_in:['1','2','3','4','5','6','7'] , b: true },
					price : { range:[0,100000000] , b:true , array : true },
					rank : { in:['asc','desc'] , default : 'asc', b:true },
					type : { in:[1,2,3,4,5,6,7,8,'1','2','3','4','5','6','7','8'] , b:true},
					by : { in:[1,2,'1','2'] , b:true},
					convert : { in:['true','false'] , default:'true' },
					include : { v:['isAlphaOrNumeric'], b:true },
					exclude : { v:['isAlphaOrNumeric'], b:true },
					x : { v:['isInt'] , b:true , default : 0 },
					y : { v:['isInt'] , b:true , default : 100 }
					}
				},
			validators : function(){
				var h = {
					price : { v:['isPrice'] },
					p_type : { in:[1,2,'1','2'] , b : true},
					htype : { in:['1','2','3','4','5','6'] },
					rooms : { in:['1','2','3','4','5','6'] },
					bathrooms_f : { in:['1','2','3','4','5','6'] },
					bathrooms_h : { in:['1','2','3','4','5','6'] },
					square_feet : {v:['isInt'] },
					pets : {
						dependency : true,
						data : {
							1 : 'none',
							2 : {
								cats : { in:[1,2,'1','2'] },
								ldogs : { in:[1,2,'1','2'] },
								sdogs : { in:[1,2,'1','2'] },
								birds : { in:[1,2,'1','2'] },
								}
							}
						}
					}

				var e = {
					price : { v:['isPrice'] },
					p_type : { in:[3,4,5,'3','4','5'] },
					company : { v:['isAlphaOrNumeric'] },
					jtitle : { v:['isTextarea'] },
					experience : { in:['1','2','3','4','5','6','7'] },
					}

				var n = {
					company : { v:['isAlphaOrNumeric'] },
					jtitle : { v:['isTextarea'] },
					experience : { in:['1','2','3','4','5','6','7'] },
					}
					
				var l = {
					category : { v : ['isCategory'] , b:true },
					condition : { v : ['isCondition'] },
					quantity : { v : ['isInt'] , b:true},
					price : { v:['isPrice'] },
					p_type : { in:[1,2,'1','2'] , b : true},
					delivery : {
						extra : {
							values : {
								1 : 'none',
								2 : 'none',
								3 : {v:['isPrice']},
								4 : 'none',
								5 : {v:['isPrice']}
								}
							} , b:true 
						},
					}

				var s = {
					type : {
						dependency : true,
						data : {
							1 : l,
							2 : l,
							3 : 'none',
							4 : h,
							5 : h,
							6 : e,
							7 : e,
							8 : n
							}
						},
					title : { v:['isAlphaOrNumeric'] },
					location : _s_common.helpers.validators.location(),
					description : { v:['isTextarea'] , b : true },
					images : { v:['isArray'] , b:'array'},
					video : { in:[1,2,'1','2'] , default : 2, b:true },
					payment_type : { in:[1,2,'1','2'] , default : 1, b:true },
					}

				return s;
				},
			convert : function*(s , type){

				if(s.delivery){
					s.delivery.value = {
						data : s.delivery.value,
						converted : _s_l.info('delivery',s.delivery.value,'listings'),
						}
					if(s.delivery.extra) s.delivery.extra = {
						data : s.delivery.extra,
						converted : _s_currency.convert.front(s.delivery.extra)
						}
					}


				if(s.interest){
					s.interest = yield _interests.helpers.convert(s.interest);
					}
				else if(s.interests && s.interests.length > 0){
					s.interests = yield _interests.helpers.convert(s.interests);
					}
		
				return yield _s_util.convert.single({data:s,label:true , library : 'listings'});
				}
			}
		},
	new : function*(obj){
		!obj?obj={}:null;

		var r = this.helpers.validators();
		if(!obj.user && !obj.seller){
			r.eon = {
				1 : {
					user : { v:['isUser'] }
					},
				2 : {
					seller : { v:['isSeller'] },
					sync : { v:['isPAL'] , b:true }
					}
				}
			}

		if(obj.data) var data = _s_req.validate({ data : obj.data, validators : r })
		else var data = _s_req.validate(r);
		if(data.failure) return data;

		// combine the data from the entrance object with the data
		data = _s_util.merge(obj,data);

		// first of all let's see if this is being added to a user or a seller
		r = ( data.seller ? 'seller' : 'user' );

		// validate the user/seller
		var _o_target = yield _s_load.object(r+'s',data[r]);
		if(!_o_target.data) return { failure : { msg : 'The ' + r + ' was not found and the listing could not be created at this time.' , code : 300 } }
		data[r] = _o_target.helpers.data.document();

		data.setup = {
			active : 1,
			status : 1,
			added : _s_dt.now.datetime(),
			by : _s_user.profile.id()
			}
		data.questions = [];
		data.interests = [
			 {
			 	interest : Math.floor((Math.random() * 10000000000000)),
			 	user : {
			 		id : '569066db7c444ad53ca26509',
			 		name : 'Customer',
			 		verified : false
			 		},
			 	price : 10.00,
			 	contact : 'ammar@sellyx.com',
			 	location : _s_loc.active.get(),
			 	messages : [
			 		{
			 			message : 'Hi this is a test message',
			 			by : 1, 
			 			on : _s_dt.now.datetime()
			 		}
			 		],
			 	setup : {
			 		active : 1,
			 		status : 1,
			 		added : _s_dt.now.datetime()
			 		}
			 }
			];
			
		// data.location = _s_loc.active.get();

		return yield _s_common.new(data,'listings', true);
		},
	update : function*(obj){
		!obj?obj={}:null;

		if(obj.data){
			var data = obj.data;
			}
		else{
			var r = this.helpers.validators();
			r.id = { v:['isLocalListing'] }

			var data = _s_req.validate(r);
			if(data.failure) return data;
			}

		// let's pull the listing from the database
		var results = yield this.model.get(data.id);
		if(!results) return { failure : { msg : 'The listing could not be found in the system.' , code : 300 } }

		if(obj.user || obj.seller){

			// check to see if the listing belongs to the user or the seller
			if(results.user){
				if(results.user.id != _s_user.profile.id()) return { failure : { msg : 'The listing does not belong to the user making the changes.' , code : 300 } }
				}
			else{
				if(!_s_seller || results.seller.id != _s_seller.profile.id()) return { failure : { msg : 'The listing does not belong to the seller making the changes.' } }
				}
			}

		return yield _s_common.update(_s_util.merge(results,data),'listings',true);
		},
	get actions() {
		var self = this;
		return {
			message : function*(obj){
				!obj?obj={}:null;

				var data = _s_req.validate({
					id : { v:['isListing'] },
					interest : { v:['isInterest'] },
					message : { v:['isAlphaOrNumeric'] }
					})
				if(data.failure) return data;

				var result = yield self.model.get(data.id);
				if(!result) return { failure : { msg : 'The requested listing was not found.' , code : 300 } }

				// now find the interest inside the listing
				var interest = _s_util.array.find.object(result.interests, 'interest', data.interest, true);
				if(!interest) return { failure : { msg : 'The requested interest was not found.' , code : 300 } }

				if(obj.type == 1){
					// means that this is the user trying to change things
					if(obj.user != interest.object.user.id) return { failure : { msg : 'You are not allowed to send messages in this particular interest thread.' } }

					}
				else{
					// this means its the seller/owner
					// lets see if the seller/owner posted as a seller or a user
					if(result.seller){
						if(!obj.seller || obj.seller != result.seller.id) return { failure : { msg : 'You are not allowed to send messages in this particular interest thread.' } }; 
						}
					else{
						if(obj.user != result.user.id) return { failure : { msg : 'You are not allowed to send messages in this particular interest thread.' } }; 
						}
					}
				

				result.interests[interest.index].messages.push({
					message : data.message,
					by : obj.type,
					on : _s_dt.now.datetime()
					})

				if(obj.type == 1){
					return yield _s_common.update(result,'listings',[{ insert : 'interest' , target : {id:'id' , data : obj.user, depth : 'user'} , replace : 'interests' }]);
					}
				return yield _s_common.update(result,'listings');
				},
			status : function*(obj){
				!obj?obj={}:null;

				var r = {
					id : {v:['isLocalListing']},
					status : { in:[1,2,3,'1','2','3'] }
					}

				obj.corporate ? r.status = { in:[0,1,2,3,'0','1','2','3'] } : null;

				var data = _s_req.validate(r);
				if(data.failure) return data;

				r = {
					id : data.id,
					library : 'listings',
					label : 'listing',
					seller : obj.seller,
					user : obj.user,
					corporate : (obj.corporate?_s_corporate.profile.master():null),
					status : {
						allowed : [1,2],
						change : data.status
						},
					active : [1]
					}

				obj.corporate ? r.status = [0,1,2] : null;
				return yield _s_common.check(r);
				}
			}
		},
	get : function*(obj){
		return yield _s_common.get(obj, 'listings');
		}
	}



module.exports = function(){
  	if(!(this instanceof Listings)) { return new Listings(); }
	}