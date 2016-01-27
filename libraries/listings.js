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
					entity : { v:['isAlphaOrNumeric'], b:true },
					distance : { v:['isDistance'], b:true , default : 250 },
					categories : { v:['isArray'] , b:true },
					conditions : { csv_in:['1','2','3','4','5','6','7'] , b: true },
					price : { range:[0,100000000] , b:true , array : true },
					rank : { in:['asc','desc'] , default : 'desc', b:true },
					type : { in:[1,2,3,4,5,6,7,8,'1','2','3','4','5','6','7','8'] , b:true },
					sort : { in:['price','distance','date'] , b:true, default : 'date' },
					convert : { in:['true','false'] , default:'true' },
					include : { v:['isAlphaOrNumeric'], b:true },
					exclude : { v:['isAlphaOrNumeric'], b:true },
					x : { v:['isInt'] , b:true , default : 0 },
					y : { v:['isInt'] , b:true , default : 100 }
					}
				},
			validators : {
				base : function(){
					var h = {
						price : { v:['isPrice'] },
						payment_type : { in:[2,'2'] , default : 2, b:true },
						p_type : { in:[1,2,'1','2'] , b : true},
						htype : { in:['1','2','3','4','5','6','7'] },
						rooms : { in:['1','2','3','4','5','6','7'] },
						bathrooms_f : { in:['1','2','3','4','5','6','7'] },
						bathrooms_h : { in:['1','2','3','4','5','6','7'] },
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

					var z = {
						price : { v:['isPrice'] },
						payment_type : { in:[1,2,'1','2'] , default : 1, b:true },
						}

					var e = {
						price : { v:['isPrice'] },
						p_type : { in:[3,4,5,'3','4','5'] },
						company : { v:['isAlphaOrNumeric'] },
						jtitle : { v:['isTextarea'] },
						payment_type : { in:[2,'2'] , default : 2, b:true },
						experience : { in:['1','2','3','4','5','6','7'] },
						}

					var n = {
						company : { v:['isAlphaOrNumeric'] },
						jtitle : { v:['isTextarea'] },
						experience : { in:['1','2','3','4','5','6','7'] },
						payment_type : { in:[2,'2'] , default : 2, b:true },
						}
						
					var l = {
						category : { v : ['isCategory'] , b:true },
						payment_type : { in:[1,2,'1','2'] , default : 1, b:true },
						condition : { v : ['isCondition'] },
						quantity : { v : ['isInt'] , b:true},
						quantity_mpo : { v : ['isInt'] , b:true , default :1},
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
								3 : z,
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
						setup : {
							json : true,
							b:true,
							default:{ active : 1, status : 1, added : _s_dt.now.datetime() },
							data : {
								active : { in:[0,1] , b:true, default : 1 },
								status : { in:[0,1,2,3,4,5,6,7] , b:true, default : 1 },
								added : { v:['isDatetime'] , b:true, default : _s_dt.now.datetime() },
								by : { v:['isUser'] , default : _s_t1.profile.id() }
								}
							},
						questions : {
							aoo : true,
							default : [],
							data : {
								q : { v:['isAlphaOrNumeric'] },
								a : { v:['isAlphaOrNumeric'] },
								added : { v:['isDatetime'] , default : _s_dt.now.datetime() },
								// by : { v:['isAlphaOrNumeric'] , default : _s_entity.object.profile.id() }
								}
							},
						// interests : {
						// 	aoo : true,
						// 	default : [],
						// 	data : {
						// 		interest : _s_common.generate.id(),
						// 		entity : {
						// 			json : true,
						// 			default : _s_entity.object.helpers.data.document(),
						// 			data : {

						// 				}
						// 			}
						// 		}
						// 	}
						}

					return s;
					}
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

		var data = ( obj.data ? _s_req.validate({ validators : this.helpers.validators.base(), data : obj.data }) : _s_req.validate(this.helpers.validators.base()) );
		if(data.failure) return data;

		// combine the data from the entrance object with the data
		data = _s_util.merge(data, {
			entity : _s_entity.object.helpers.data.document(),
			orders : [],
			interests : [{
				interest : Math.floor((Math.random() * 10000000000000)),
			 	entity : {
			 		id : '569066db7c444ad53ca26509',
			 		name : 'Customer',
			 		verified : false
			 		},
			 	price : 10.00,
			 	contact : 'test-customer@sellyx.com',
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
				}]
			});

		return yield _s_common.new(data,'listings', true);
		},
	update : function*(obj){
		!obj?obj={}:null;

		var r = this.helpers.validators.base();
		r.id = { v:['isLocalListing'] }

		var data = (obj.data?_s_req.validate({data:obj.data,validators:r}):_s_req.validate(r))
		if(data.failure) return data;

		// let's pull the listing from the database
		var results = yield this.model.get(data.id);
		if(!results) return { failure : { msg : 'The listing could not be found in the system.' , code : 300 } }

		if(results.entity.id != _s_entity.object.profile.id()) return { failure : { msg : 'The listing does not belong to the entity making the changes.' , code : 300 } }
		return yield _s_common.update(_s_util.merge(results,data),'listings',true);
		},
	get actions() {
		var self = this;
		return {
			message : function*(obj){
				!obj?obj={}:null;
				var entity = (obj.entity?obj.entity:_s_entity.object.profile.id())

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
					if(entity != interest.object.entity.id) return { failure : { msg : 'You are not allowed to send messages in this particular interest thread.' } }
					}
				else{
					if(entity != result.entity.id){ return { failure : { msg : 'You are not allowed to send messages in this particular interest thread.' } }; }
					}
				
				result.interests[interest.index].messages.push({
					message : data.message,
					by : obj.type,
					on : _s_dt.now.datetime()
					})

				if(obj.type == 1){
					return yield _s_common.update(result,'listings',[{ insert : 'interest' , target : {id:'id' , data : entity, depth : 'entity'} , replace : 'interests' }]);
					}
				return yield _s_common.update(result,'listings');
				},
			status : function*(obj){
				!obj?obj={}:null;

				var data = _s_req.validate({
					id : {v:['isLocalListing']},
					status : obj.corporate?{ in:[0,1,2,3,'0','1','2','3'] }:{ in:[1,2,3,'1','2','3'] }
					});
				if(data.failure) return data;

				return yield _s_common.check({
					id : data.id,
					library : 'listings',
					label : 'listing',
					entity : (obj.entity?obj.entity:{ id : _s_entity.object.profile.id(), target : true }),
					corporate : (obj.corporate?_s_corporate.profile.master():null),
					status : {
						allowed : (obj.corporate?[0,1,2]:[1,2]),
						change : data.status
						},
					active : [1]
					});
				}
			}
		},
	get : function*(obj){
		return yield _s_common.get(obj, 'listings', function(data){
			data.distance = _s_loc.helpers.calculate.distance({
				destination : data.location.coordinates
				})
			return data;
			});
		}
	}



module.exports = function(){
  	if(!(this instanceof Listings)) { return new Listings(); }
	}