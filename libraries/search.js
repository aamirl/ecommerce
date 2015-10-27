// Search Library
var _countries = _s_load.library('countries');

function Search(){

	}

Search.prototype = {
	model : _s_load.model('search'),
	helpers : {
		filters : {
			world : function(obj){
				var base = {
					q : { v:['isSearch'] , b : true},
					condition : { c_in:['1','2','3','4','5','6','7'] , b: true , array:true },
					custom : { in:[1,2,'1','2']  , b:true },
					category : { v:['isCategory'] , b:true },
					sellyxship : { in:[1,2,'1','2']  , b:true },
					negotiable : { in:[1,2,'1','2'] , b:true , array:true },
					rank : { in:['asc','desc'] , default : 'asc', b:true },
					rating : { in:['asc','desc'] , default : 'desc' , b:true},
					x : { v:['isInt'] , b:true , default : 0 },
					y : { v:['isInt'] , b:true , default : 10 },
					};
				if(obj) return _s_util.merge(base,obj);
				return base;
				},
			local : function(obj){
				var base = {
					q : { v:['isSearch'] , b:true },
					distance : { in:[5,10,15,20,50,100,150,200,250,"5","10","15","20","50","100","150","200","250"], b:true , default : 250 },
					category : { v:['isCategory'] , b:true },
					condition : { c_in:['1','2','3','4','5','6','7'] , b: true , array:true },
					price : { range:[0,100000000] , b:true , array : true },
					ranking : { in:[1,2] , default : 1 , b:true},
					type : { in:[1,2,3,4,5,6,7,8,'1','2','3','4','5','6','7','8'] , b:true},
					by : { in:[1,2,'1','2'] , b:true},
					updown : { in:['asc','desc'] , default : 'desc' , b:true },
					x : { v:['isInt'] , b:true , default : 0},
					y : { v:['isInt'] , b:true , default : 10 }
					}
				if(obj) return _s_util.merge(base,obj);
				return base;
				},
			seller : function(){
				var base = {
					q : { v:['isSearch'] , b : true},
					seller : { v:['isSeller'] },
					condition : { c_in:['1','2','3','4','5','6','7'] , b: true , array:true },
					custom : { in:[1,2,'1','2']  , b:true },
					sellyxship : { in:[1,2,'1','2']  , b:true },
					negotiable : { in:[1,2,'1','2'] , b:true , array:true },
					rank : { in:['asc','desc'] , default : 'desc', b:true },
					rating : { in:['asc','desc'] , default : 'desc' , b:true},
					x : { v:['isInt'] , b:true , default : 0 },
					y : { v:['isInt'] , b:true , default : 1 },
					}
				if(obj) return _s_util.merge(base,obj);
				return base;
				}
			},
		parameterize : function(obj){

			var seller_filters = ['condition','negotiations','price'];
			var str = '';

			_s_u.each(obj, function(dets, filter){
				if(_s_util.indexOf(seller_filters, filter) !== -1){

					if(dets instanceof Array){
						var res = dets.join(',');
						}
					else{
						var res = dets;
						}
					str += '&' + filter + '=' + res;
					}
				})
			return str;
			}
		},
	get get(){
		var self = this;
		return {
			local : function*(obj){	
				var _local = _s_load.library('local');
				var _location = _s_load.library('location');
				var send = [];
				var query = yield self.model.local(obj);

				if(!query) return send;
				else var data = query.results.data;

				var u_id = _s_user.profile.id();
				// lets standardize the results
				yield _s_util.each(data , function*(doc, ind){

					var id = doc.id;
					doc = doc.data;

					var r = {
						id : id,
						type : doc.type,
						name : doc.title,
						description : (doc.description?doc.description:''),
						price : doc.price,
						distance : _location.helpers.calculate.distance({ destination : doc.location.coordinates })
						}
					var interest = _s_util.array.find.object(doc.interests, 'id' , u_id, false, 'user');
					interest ? r.interest = true : null;
					doc.category ? r.category = doc.category : null;
					doc.images.length > 0 ? r.images = doc.images : null;
					doc.seller ? r.seller = doc.seller : r.user = doc.user;
					doc.world?r.world = true :null;
					send.push(yield _local.helpers.convert.listing(r))
				
					})

				return { data : send , filters : query.filters , total : query.results.total }
				},
			seller : function*(obj){
				var send = [];
				var _inventory = _s_load.library('inventory');
				var _products = _s_load.library('products');
				var _images = _s_load.library('images');
				var query = yield self.model.world(obj);
				if(!query) return send;
				
				// lets standardize the results
				yield _s_util.each(query.results.data , function*(doc, ind){
					var id = doc.id;
					doc = doc.data;

					var r = {
						id : id,
						manufacturer : (doc.line.manufacturer?doc.line.manufacturer.name+' ':doc.sellers[0].seller.name + ' '),
						line : doc.line.name ,
						name :  doc.name,
						images : _images.get.set(doc.images),
						s_id : obj.seller
						}

					doc.combos = yield _products.helpers.convert.combos(doc.combos , doc.line.category);
					send = send.concat(yield _inventory.helpers.filter.inner({ data : doc, template : r , filters : query.filters }));
					})

				return { data : send , filters : query.filters , total : query.results.total }
				},
			world : function*(obj){
				var send = [];
				var _inventory = _s_load.library('inventory');
				var _images = _s_load.library('images');
				var _currency = _s_load.library('currency');
				
				var query = yield self.model.world(obj);
				if(!query) return send;
				
				yield _s_util.each(query.results.data , function*(d, ind){
					var id = d.id;
					doc = d.data;
					var r = {
						id : id,
						manufacturer : (doc.line.manufacturer?doc.line.manufacturer.name+' ':doc.sellers[0].seller.name + ' '),
						line : doc.line.name ,
						name :  doc.name,
						images : _images.get.set(doc.images)
						}
					if(d.sort[0] == d.sort[1]) r.prices = _currency.convert.front(d.sort[0]);
					else r.prices = _currency.convert.front(d.sort[0]) + ' - ' + _currency.convert.front(d.sort[1]);
					send.push(r);
					})

				return { data : send , filters : query.filters , total : query.results.total };
				}
			}
		}
	}

module.exports = function(){
  	if(!(this instanceof Search)) { return new Search(); }
	}


















