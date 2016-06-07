
function Listings(){}
module.exports = function(){ return new Listings(); }


Listings.prototype = {
	get helpers() {
		var self = this;
		return {
			filters : function(){
				return {
					q : { v:['isSearch'] , b:true },
					id : { v:['isLocalListing'] , b:true },
					ids : { v:['isArray'] , b:true },
					entity : { v:['isAlphaOrNumeric'], b:true },
					distance : { v:['isDistance'], b:true  },
					type : { csv_in:[1,2,3,4,5,6,7,8,'1','2','3','4','5','6','7','8'] , b:true },
					entity_type : { csv_in:['t1','t2'] , b:true },
					p_type : { in:['1','2',1,2] , b:true },
					
					// filters for products
					categories : { v:['isArray'] , b:true },
					conditions : { csv_in:['1','2','3','4','5','6','7'] , b: true },
					price : { range:[0,100000000] , b:true , array : true },

					// filters for housing
					htype : { csv_in:['1','2','3','4','5','6','7',1,2,3,4,5,6,7] , b:true },
					rooms : { csv_in:[1,2,3,4,5,6,7,'1','2','3','4','5','6','7'] , b:true },
					bathrooms_f : { csv_in:[1,2,3,4,5,6,7,'1','2','3','4','5','6','7'] , b:true },
					bathrooms_h : { csv_in:[1,2,3,4,5,6,7,'1','2','3','4','5','6','7'] , b:true },

					rank : { in:['asc','desc'] , default : 'desc', b:true },
					sort : { in:['price','distance','date'] , b:true, default : 'date' },
					convert : { in:['true','false'] , default:'true' },
					include : { v:['isAlphaOrNumeric'], b:true },
					exclude : { v:['isAlphaOrNumeric'], b:true },
					x : { v:['isInt'] , b:true , default : 0 },
					y : { v:['isInt'] , b:true , default : 100 },
					count : { in:['true','false',true,false], b:true, default:false },
					s_status : { csv_in:['0','1','2','3',0,1,2,3] , b:true },
					s_active : { csv_in:[1,0,"0","1"], b:true, default :[1] }
					}
				},
			validators : {
				base : function(){
					var h1 = {
						price : { v:['isPrice'] },
						payment_type : { in:[2,'2'] , default : 2, b:true },
						p_type : { in:[1,2,'1','2'] , b : true , default : 1},
						price_type : { in :[5,6,7,8,9,10,11,12,'5','6','7','8','9','10','11','12'] , b:true, default :9 },
						htype : { in:['1','2','3','4','5','6','7'] },
						rooms : { in:['1','2','3','4','5','6','7']  },
						bathrooms_f : { in:['1','2','3','4','5','6','7'] , b:true, default : 0 },
						bathrooms_h : { in:['1','2','3','4','5','6','7'] , b:true, default : 0 },
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

					var h2 = {
						price : { v:['isPrice'] },
						payment_type : { in:[2,'2'] , default : 2, b:true },
						p_type : { in:[1,2,'1','2'] , b : true , default : 1},
						price_type : { in :[13,'13'] , b:true, default :13 },
						htype : { in:['1','2','3','4','5','6','7'] },
						rooms : { in:['1','2','3','4','5','6','7']  },
						bathrooms_f : { in:['1','2','3','4','5','6','7'] , b:true, default : 0 },
						bathrooms_h : { in:['1','2','3','4','5','6','7'] , b:true, default : 0 },
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
						price_type : { in :[4,5,6,7,8,9,10,11,12,'4','5','6','7','8','9','10','11','12'] , b:true, default :4 },
						p_type : { in:[1,2,'1','2'] , b : true , default : 1},
						quantity : { v : ['isInt'] , b:true , default : 0 },
						quantity_mpo : { in:[1,'1'] , b:true, default : 1 },
						payment_type : { in:[1,'1'] , default : 1, b:true },
						}

					var e = {
						price : { v:['isPrice'] },
						company : { v:['isAlphaOrNumeric'] },
						price_type : { in :[5,6,7,8,9,10,11,12,'5','6','7','8','9','10','11',12] , b:true, default :11 },
						jtitle : { v:['isTextarea'] },
						payment_type : { in:[2,'2'] , default : 2, b:true },
						experience : { in:['1','2','3','4','5','6','7'] },
						education : { in:['1','2','3','4','5','6','7','8'] }
						}

					var n = {
						company : { v:['isAlphaOrNumeric'] },
						jtitle : { v:['isTextarea'] },
						experience : { in:['1','2','3','4','5','6','7'] },
						price_type : { in :['14',14] , b:true, default :14 },
						payment_type : { in:[2,'2'] , default : 2, b:true },
						education : { in:['1','2','3','4','5','6','7','8'] }
						}
						
					var l1 = {
						category : { v : ['isCategory'] },
						payment_type : { in:[1,2,'1','2'] , default : 1, b:true },
						condition : { v : ['isCondition'] },
						quantity : { v : ['isInt'] , b:true , default : 0},
						quantity_mpo : { v : ['isInt'] , b:true },
						price : { v:['isPrice'] },
						price_type : { in :[1,2,3,12,'1','2','3','12'] , b:true, default :1 },
						p_type : { in:[1,2,'1','2'] , b : true , default : 1},
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

					var l2 = {
						category : { v : ['isCategory'] },
						payment_type : { in:[1,2,'1','2'] , default : 1, b:true },
						condition : { v : ['isCondition'] },
						quantity : { v : ['isInt'] , b:true , default : 0},
						quantity_mpo : { v : ['isInt'] , b:true },
						price : { v:['isPrice'] },
						price_type : { in :[4,5,6,7,8,9,10,11,12,'4','5','6','7','8','9','10','11',12] , b:true, default :4 },
						p_type : { in:[1,2,'1','2'] , b : true , default : 1},
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
								1 : l1,
								2 : l2,
								3 : z,
								4 : h1,
								5 : h2,
								6 : e,
								7 : e,
								8 : n
								}
							},
						title : { v:['isAlphaOrNumeric'] },
						location : {
							json : true,
							data : self._s.common.helpers.validators.location()
							},
						description : { v:['isTextarea'] , b : true },
						images : { v:['isArray'] , b:'array'},
						video : { in:[1,2,'1','2'] , default : 2, b:true },
						setup : {
							json : true,
							b:true,
							default:{ active : 1, status : 1, added : self._s.dt.now.datetime() },
							data : {
								active : { in:[0,1] , b:true, default : 1 },
								status : { in:[0,1,2,3,4,5,6,7] , b:true, default : 1 },
								added : { v:['isDatetime'] , b:true, default : self._s.dt.now.datetime() },
								modified : { v:['isDatetime'] , b:true, default : self._s.dt.now.datetime() },
								by : { v:['isUser'] , default : self._s.t1.profile.id() }
								}
							},
						questions : {
							aoo : true,
							default : [],
							data : {
								q : { v:['isAlphaOrNumeric'] },
								a : { v:['isAlphaOrNumeric'] },
								added : { v:['isDatetime'] , default : self._s.dt.now.datetime() }
								}
							}
						}

					return s;
					}
				},
			convert : function*(s , type){
				var _interests = self._s.library('interests');

				if(s.delivery){
					s.delivery.value = {
						data : s.delivery.value,
						converted : self._s.l.info('delivery',s.delivery.value,'listings'),
						}
					if(s.delivery.extra) s.delivery.extra = {
						data : s.delivery.extra,
						converted : self._s.currency.convert.front(s.delivery.extra)
						}
					}


				if(s.interest){
					s.interest = yield _interests.helpers.convert(s.interest);
					}
				else if(s.interests && s.interests.length > 0){
					s.interests = yield _interests.helpers.convert(s.interests);
					}
		
				return yield self._s.util.convert.single({data:s,label:true , library : 'listings'});
				}
			}
		},
	new : function*(obj){
		!obj?obj={}:null;

		var data = ( obj.data ? this._s.req.validate({ validators : this.helpers.validators.base(), data : obj.data }) : this._s.req.validate(this.helpers.validators.base()) );
		if(data.failure) return data;

		// combine the data from the entrance object with the data
		data = this._s.util.merge(data, {
			entity : this._s.entity.object.helpers.data.document(),
			orders : []
			});
		
		if(data.quantity == 0){
			data.setup.status = 2
			data.setup.active = 0
			}

		var t = yield this._s.common.new(data,'listings', true);
		if(t.failure) return t

		if(data.quantity != 0){


			var follows = this._s.entity.object.profile.followers.all()
			if(!follows) return t

			var self = this;

			yield self._s.util.each(follows, function*(d,i){
				
					yield self._s.engine('notifications').new.push({
						entity : d.id,
						type : "701",
						title : self._s.entity.object.profile.name() + " has a new listing!",
						body : self._s.entity.object.profile.name()  + " just put up a new listing called " + data.title + ". Check it out now!" ,
						data : {
							id: t.id
							}	
						})

				})
			}


		return t;
		},
	update : function*(obj){
		!obj?obj={}:null;

		var r = this._s.util.clone.deep(this.helpers.validators.base());
		r.id = { v:['isLocalListing'] }
		delete r.setup
		delete r.questions


		var data = (obj.data?this._s.req.validate({data:obj.data,validators:r}):this._s.req.validate(r))
		if(data.failure) return data;

		// let's pull the listing from the database
		var results = yield this.model.get(data.id);
		if(!results) return { failure : { msg : 'The listing could not be found in the system.' , code : 300 } }

		if(!obj.corporate && (results.entity.id != this._s.entity.object.profile.id())) return { failure : { msg : 'The listing does not belong to the entity making the changes.' , code : 300 } }

		delete results.distance;

		if(results.type != data.type) return { failure : { msg : 'This listing type cannot be changed.', code : 300 } }
		
		if(data.quantity == 0){
			results.setup.active = 0
			results.setup.status = 2
			}
		else{
			results.setup.active = 1
			results.setup.status = 1
			}

		results.setup.modified = this._s.dt.now.datetime()


		var t = yield this._s.common.update(this._s.util.merge(results, data) ,'listings',true);
	 	if(t.failure) return t

	 	if(results.favorites && results.favorites.count > 0){

		 	yield self._s.util.each(results.favorites , function*(d,i){
				if(d.id != my_id){

					yield self._s.engine('notifications').new.push({
						entity : d.id,
						type : "702",
						title : "A listing that you favorited was changed.",
						body : results.title + " was changed. See the changes now!",
						data : {
							id: results.id
							}	
						})

					}
				})

		 	}

	 	return t

		},
	get actions() {
		var self = this;
		return {
			message : function*(obj){
				!obj?obj={}:null;
				var entity = (obj.entity?obj.entity:self._s.entity.object.profile.id())

				var data = self._s.req.validate({
					id : { v:['isListing'] },
					interest : { v:['isInterest'] },
					message : { v:['isAlphaOrNumeric'] }
					})
				if(data.failure) return data;

				var result = yield self.model.get(data.id);
				if(!result) return { failure : { msg : 'The requested listing was not found.' , code : 300 } }

				// now find the interest inside the listing
				var interest = self._s.util.array.find.object(result.interests, 'interest', data.interest, true);
				if(!interest) return { failure : { msg : 'The requested interest was not found.' , code : 300 } }

				if(obj.type == 1){
					if(entity != interest.object.entity.id) return { failure : { msg : 'You are not allowed to send messages in this particular interest thread.' } }
					}
				else{
					if(entity != result.entity.id){ return { failure : { msg : 'You are not allowed to send messages in this particular interest thread.' } }; }
					}
				var t = {
					message : data.message,
					by : obj.type,
					on : self._s.dt.now.datetime()
					}


				var messages = result.interests[interest.index].messages;
				messages.push(t)
				result.interests[interest.index].messages = messages

				var update = yield self._s.common.update(result,'listings');

				if(update.failure) return update.failure
				return { success : { data : messages } }
				// return {success : {data :  t }}
				},
			status : function*(obj){
				!obj?obj={}:null;

				var data = self._s.req.validate({
					id : {v:['isLocalListing']},
					status : { in:[0,1,2,3,'0','1','2','3'] },
					// status : obj.corporate?{ in:[0,1,2,3,'0','1','2','3'] }:{ in:[1,2,3,'1','2','3'] }
					});
				if(data.failure) return data;

				return yield self._s.common.check({
					id : data.id,
					library : 'listings',
					label : 'listing',
					entity : (obj.entity?obj.entity:{ id : self._s.entity.object.profile.id(), target : true }),
					corporate : (obj.corporate?self._s.entity.object.profile.id():null),
					status : {
						allowed : (obj.corporate?[0,1,2,3]:[1,2,3]),
						change : data.status
						},
					active : [1]
					});
				}
			}
		},
	get : function*(obj){
		
		return yield this._s.common.get(obj, 'listings', function(data, _s){
			if(data.location){
				data.distance = _s.loc.helpers.calculate.distance({
					destination : data.location.coordinates
					})
				}
			return data;
			});
		}
	}

