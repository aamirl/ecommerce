
// Interests Model

function Model(){}
module.exports = function(){ return new Model(); }

Model.prototype = {

	
	get : function*(obj){

		console.log(obj)
		var get = {
			index : 'listings',
			body : {
				query : {
					bool : {
						must : [
							],
						filter : [
							{ term : { 'setup.active' : 1 } }
							]
						}
					}
				}
			};


		
		if(obj.entity){
			var y = {
				nested : {
					path : 'interests', 
					query : {
						bool : {
							must : [
								{match : {'interests.entity.id' : obj.entity } } 
								],
							filter : []
							} 
						} 
					} 
				}

			if(obj.s_status){

				y.nested.query.bool.filter.push({ terms : { 'interests.setup.status' : obj.s_status } })

				}

			get.body.query.bool.must.push(y) 
			}
		else if(obj.s_status){

			get.body.query.bool.must.push({
				nested : {
					path : 'interests', 
					query : {
						bool : {
							must : [
								{match : {'interests.setup.status' : obj.s_status } } 
								] 
							} 
						} 
					} 
				})

			}
		
		if(obj.count) return yield this._s.db.es.count(get,obj);
		return yield this._s.db.es.search(get, obj)
		}
	}
