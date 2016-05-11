// Reviews Library

function Reviews(){}

Reviews.prototype = {

	get helpers() {
		var self = this
		return {
			filters : function(){
				return {
					id : { v:['isThread'] , b:true },
					q : { v: ['isSearch'] , b:true},
					entity : { v:['isEntity'] , b:true },
					for : { v:['isAlphaOrNumeric'], b:true },
					convert : { in:['true','false'] , default : 'true' },
					include : { v:['isAlphaOrNumeric'], b:true },
					exclude : { v:['isAlphaOrNumeric'], b:true },
					active : { v:['isAlphaOrNumeric'], b:true },
					x : { v:['isInt'] , b:true , default : 0 },
					y : { v:['isInt'] , b:true , default : 10 },
					count : { in:['true','false',true,false], b:true, default:false }
					}
				},
			validators : {
				base : function(obj){
					!obj?obj={}:null;
					return {
						eon : {
							1 : {
								order : {v:['isListingOrder']}
								},
							2 : {
								id : { v:['isReview'] }
								}
							},
						rating : {in:[1,2,3,4,5]},
						message : {v:['isTextarea']},
						}
					}
				},
			convert : function*(s){
				console.log('here')
				s.comments = yield self._s.util.convert.multiple({ data:s.comments, label:true, library:'reviews' })

				return yield self._s.util.convert.single({data:s,label:true , library : 'reviews'});
				}
			}
		},
	get : function*(obj){
		return yield this._s.common.get(obj, 'reviews');
		},
	upsert : function*(obj){
		!obj?obj={}:null;

		var data = ( obj.data ? this._s.req.validate({ validators : this.helpers.validators.base(), data : obj.data }) : this._s.req.validate(this.helpers.validators.base()) );
		if(data.failure) return data;

		if(data.order){
			var _orders = this._s.library('orders')
			var order = yield _orders.get(data.order)
			if(!order) return { failure : { msg : 'This is not a valid listing order.', code : 300 } }

			// now we check to see if the reviewer is a buyer or seller of the item
			if(order.buying.id != this._s.entity.object.profile.id() && order.selling.id != this._s.entity.object.profile.id()) return { failure : { msg : 'This order was not bought or sold by you.' , code : 300 } }
			
			var reviewee = (order.buying.id == this._s.entity.object.profile.id() ? 1 : 2)
		
			// next we check to see if the order was cancelled or completed
			if(this._s.util.indexOf([52,53,54,55,56,57,'52','53','54','55','56','57'], order.setup.status) == -1) return { failure : { msg : 'This order is not an order that can be reviewed.' , code : 300 } }

			// finally we check and see if this user previously wrote a review for this target
			var check = yield this.get({ by: (reviewee==1?order.buying.id:order.selling.id) , target : data.order })
			console.log(check)
			if(!check){

				var doc = {
					by : this._s.entity.object.helpers.data.document(),
					for : (reviewee == 1 ? order.selling : order.buying),
					target : data.order,
					review_for : 1,													// type of 1 means it was for an order
					comments : [],
					rating : data.rating,
					message : data.message,
					upvotes : [],
					downvotes : [],
					setup : {
						added : this._s.dt.now.datetime(),
						by : this._s.entity.object.profile.id(),
						active : 1,
						status : 1
						}
					}

				var t = yield this._s.common.new(doc,'reviews', true);
				}
			else{
				if(check.counter != 1) return { failure : { msg : 'There was an unknown error.' , code : 300 } }

				delete data.order
				data.id = check.data[0].id
				}
			}
		
		if(data.id){
			// pull up the review
			var result = yield this.get(data.id)
			if(!result) return { failure : { msg : 'The review was not found', code : 300 } }

			if(result.by.id != this._s.entity.object.profile.id()) return { failure : { msg : 'This review cannot be edited by the current entity.' , code : 300 } }

			var old_rating = result.rating

			result.message = data.message
			result.rating = data.rating

			var t = yield this._s.common.update(result,'reviews');
			}

		if(t.failure) return t
	
		var target = (data.order ? (reviewee==1?order.selling:order.buying) : result.for)

		// now we pull up the entity and update their rating
		var _entities = this._s.library('entities')
		var entity = yield _entities.get({ id: target.id , indices:(target.type?target.type:'t1') })
		if(!entity) return { failure : { msg : 'The review was added but the entity was not updated.' , code : 300 } }


		if(!entity.reviews){
			entity.reviews = { rating : data.rating , counter : 1 }
			}
		else{
			var rating = entity.reviews.rating * entity.reviews.counter
			
			console.log(rating)

			if(data.order) {
				entity.reviews.counter++
				}
			else if(data.id){
				rating -= old_rating
				}
	
			entity.reviews.rating = (rating += data.rating) / entity.reviews.counter
			}

		var t = yield this._s.common.update(entity, (target.type?target.type:'t1'))
		if(t.failure) return t
		return { success : { data:true} }
		},
	get actions(){
		var self = this;
		return {
			new : {
				message : function(obj, index){
					var t = {
						message : obj.message,
						priority : obj.priority,
						added : this._s.dt.now.datetime(),
						entity : index
						}
					return t;
					}
				},
			delete : function(){

				}
			}
		}
	}

module.exports = function(){return new Reviews(); }