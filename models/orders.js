// orders models


function Model(){}
module.exports = function(){ return new Model(); }

Model.prototype = {

	new : function*(obj, meta){
		return yield this._s.db.es.add({
			index : 'orders',
			body : obj
			}, meta);
		},
	update : function*(obj){
		var doc = {
			id : obj.id,
			doc : (obj.doc?obj.doc:obj),
			index : 'orders',
			merge : true
			}
		delete obj.id;
		return yield this._s.db.es.update(doc);
		},
	get : function*(obj){
		if(obj.id || typeof obj == 'string') return yield this._s.db.es.get('orders', obj);

		var search = {
			index : 'orders',
			body : {
				query : {
					bool : {
						must : [
							
							],
						filter : []
						}
					},
				sort : [{
					"setup.added" : { 
						order : 'desc'
						}
					}]
				}
			};

		obj.listing ? search.body.query.bool.must.push({match:{'listing':obj.listing}}) : null;
		obj.quantity ? search.body.query.bool.must.push({ range: { 'quantity' : { gt : obj.quantity } } }) : null;
		obj.s_status ? search.body.query.bool.filter.push({terms:{'setup.status':obj.s_status}}) : null;
		obj.s_active ? search.body.query.bool.filter.push({terms:{'setup.active':obj.s_active}}) : null;
		obj.buying ? search.body.query.bool.filter.push({term:{'buying.id':obj.buying}}) : null;
		obj.selling ? search.body.query.bool.filter.push({term:{'selling.id':obj.selling}}) : null;
		obj.key ? search.body.query.bool.filter.push({term:{'key':obj.key}}) : null;
		obj.type ? search.body.query.bool.filter.push({term:{'type':obj.type}}) : null;
		
		// if(obj.sort){
		// 	search.body.sort = [];
		// 	if(obj.sort == 'distance'){
		// 		search.body.sort.push({
		//             _geo_distance : {
		//                 "location.coordinates" : location.coordinates,
		//                 order : obj.rank,
		//                 unit : "km",
		//                 mode : "min",
		//                 distance_type : "sloppy_arc"
	 //            		}
  //       			})
		// 		}
		// 	else if(obj.sort == 'date'){
		// 		search.body.sort.push({
		// 			"setup.added" : { 
		// 				order : obj.rank
		// 				}
		// 			})
		// 		}
		// 	else if(obj.sort == 'price'){
		// 		search.body.sort.push({
		// 			price : {
		// 				order : obj.rank
		// 				}
		// 			})
		// 		}
		// 	}

		// console.log(JSON.stringify(search))
		if(obj.count) return yield this._s.db.es.count(search,obj);
		return yield this._s.db.es.search(search, obj)
		}
	}
