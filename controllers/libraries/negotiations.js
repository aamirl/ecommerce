// negotiations library

function Negotiations(){

	}

Negotiations.prototype = {

	model : _s_load.model('negotiations'),
	helpers : {
		convert : function*(obj){

			var r = yield _s_common.helpers.convert(obj , 'negotiations', { 'offers' : 'negotiations.offers' });

			return r;
			},
		filters : function(){
			return {
				id : { v:['isNegotiation'] , b:true },
				user : { v:['isUser'] , b:true },
				seller : { v:['isSeller'] , b:true },
				convert : { in:['true','false'] , default : 'true' },
				include : { v:['isAlphaOrNumeric'], b:true },
				exclude : { v:['isAlphaOrNumeric'], b:true },
				active : { v:['isAlphaOrNumeric'], b:true },
				x : { v:['isInt'] , b:true , default : 0 },
				y : { v:['isInt'] , b:true , default : 10 },
				count : { in:['true','false',true,false], b:true, default:false }
				};
			},
		checks : {
			user : function(result){
				if(result.user.id != _s_user.profile.id()) return { failure : 'This negotiation is not under your control. Please refresh the page and try again.' };
				if(result.setup.active != 1 || result.setup.status != 1) return { failure : 'This negotiation is not eligible for the change that you are trying to make.' };
				return true;
				},
			seller : function(result){
				if(result.seller.id != _s_seller.profile.id()) return { failure : 'This negotiation is not under your control. Please refresh the page and try again.' };
				if(result.setup.active != 1 || result.setup.status != 1) return { failure : 'This negotiation is not eligible for the changes that you are trying to make.' };
				return true;
				}
			}
		},
	get : function*(obj){
		return yield _s_common.get(obj, 'negotiations');
		},
	update : function(){

		},
	get new(){
		var self = this;
		return {
			offer : function(obj){
				return	{
					id : Math.floor(Math.random() * 1000000000),
					quantity : obj.quantity,
					redemption : {
						redeemed : false
						},
					added : _s_dt.now.datetime(),
					price : obj.price,
					by : obj.by,
					expiration : obj.expiration,
					prompt : obj.prompt,
					status : 1
					}
				}
			}
		},
	get actions(){
		var self = this;
		return {
			status : {
				negotiation : function*(obj){
					!obj?obj={}:null;

					var r = {
						id : {v:['isNegotiation']},
						status : obj.status
						}

					obj.corporate ? r.status = { in:[0,1,2,'0','1','2'] } : null;

					var data = _s_req.validate(r);
					if(data.failure) return data;

					var v = {
						id : data.id,
						library : 'negotiations',
						label : 'negotiation',
						seller : (obj.seller||false),
						user : (obj.user||false),
						corporate : (obj.corporate?_s_corporate.profile.master():null),
						status : {
							change : data.status,
							allowed : obj.allowed
							},
						additional : obj.additional
						}

					obj.corporate ? v.status = [0,1,2] : null;
					return yield _s_common.check(v);
					},
				offer : function*(obj){
					!obj?obj={}:null;

					var r = {
						id : {v:['isNegotiation']},
						extra : {v:['isNegotiationOffer']},
						}

					obj.corporate ? r.status = { in:[0,1,2,'0','1','2'] } : null;

					var data = _s_req.validate(r);
					if(data.failure) return data;

					var v = {
						id : data.id,
						library : 'negotiations',
						label : 'negotiation',
						seller : (obj.seller||false),
						user : (obj.user||false),
						deep : {
							array : 'offers',
							property : 'id',
							value : data.extra,
							status : {
								allowed : [1],
								change : (obj.deep&&obj.deep.change?obj.deep.change:null)
								},
							additional_checks :(obj.deep&&obj.deep.additional_checks?obj.deep.additional_checks:null)
							},
						corporate : (obj.corporate?_s_corporate.profile.master():null),
						status : {
							allowed : [1],
							change : obj.status
							},
						additional : (obj.additional||false)
						}

					obj.corporate ? v.status = [0,1,2] : null;
					return yield _s_common.check(v);
					}
				}
			}
		}
	}

module.exports = function(){
  	if(!(this instanceof Negotiations)) { return new Negotiations(); }
	}


















