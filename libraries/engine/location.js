// Location

var maxmind = require('maxmind');

function Location(inp){

	this.data = {};

	inp = '72.21.92.59';
	
	var set_latlon = _s_req.headers('latlon');
	var set_location = _s_req.headers('loc');
	var set_ip = _s_req.headers('ip');
	
	if( set_latlon ){ 
		var p = set_latlon.split(',')
		if(p.length!=2){
			maxmind.init(_s_config.paths.geoip + 'GeoLiteCity.dat');
			this.active.set(maxmind.getLocation(inp))
			}
		this.active.set({
			latitude : p[0],
			longitude : p[1],
			source : 'user_submitted_latlon'
			})
		}

	else if(set_location){
		try{var t =JSON.parse(set_location)}
		catch(err){var t=set_location}

		var translate = _s_req.validate({data:t,validators:_s_common.helpers.validators.location()})
		if(translate.failure){
			maxmind.init(_s_config.paths.geoip + 'GeoLiteCity.dat');
			this.active.set(maxmind.getLocation(inp))
			}
		else{
			translate.source = 'user_submitted_location';
			this.data.active = translate;
			}
		}
	else if(set_ip){
		maxmind.init(_s_config.paths.geoip + 'GeoLiteCity.dat');
		this.active.set(maxmind.getLocation(set_ip))
		}
	else{
		maxmind.init(_s_config.paths.geoip + 'GeoLiteCity.dat');
		this.active.set(maxmind.getLocation(inp))
		}
	}


Location.prototype = {
	get helpers(){
		var self = this;
		return {
			address : {
				validate : function*(obj){
					
					if(obj.country) obj.country = _s_countries.name(obj.country);
					if(obj.primary) delete obj.primary;
					if(obj.label) delete obj.label;


					var r = ((_s_util.object.values(obj)).join(',')).replaceAll(' ', '+');
					
					var get = yield _s_req.http({
						url : 'https://maps.googleapis.com/maps/api/geocode/json?address='+r+'&key=AIzaSyDZaSz-chRuNJYhBZlLLO5FEwbc0nm96DQ'
						})

					if(get.status != 'ZERO_RESULTS') return get.results;

					return { failure : { msg : "No Results" , code : 300 } };
					},
				extract : function*(obj){
					var data = obj.data;
					var latlon = (obj.latlon?obj.latlon:false);

					var address = {};

					yield _s_util.each(data.address_components , function*(v,k){
						switch(v.types[0]){
							case 'street_number':
								!address.street1?address.street1 = v.long_name:address.street1 += ' ' + v.long_name;
								break;
							case  'street_number':
							case  'route' :
								!address.street1?address.street1 = v.long_name:address.street1 += ' ' + v.long_name;
								break;
							case 'premise':
							case 'subpremise':
								!address.street2?address.street2 = v.long_name:address.street2 += ' ' + v.long_name;
								break;
							case 'locality':
								!address.city?address.city=v.long_name:null;
								break;
							case 'administrative_area_level_1':
								!address.state?address.state=v.long_name:null;
								break;
							case 'country':
								// TODO : HANDLE THIS ISSUE WHERE COUNTRY NAME DOESNT EQUAL THE GOOGLE NAME
								if(!address.country) address.country = yield _s_countries.reverse(v.long_name)
								break;
							case 'postal_code':
								!address.postal?address.postal=v.long_name:null;
								break;
							}
						})
					
					if(latlon){
						address.lat = data.geometry.location.lat;
						address.lon = data.geometry.location.lng;
						}

					return address;
					}
				},
			calculate : {
				distance : function(obj){
					var origin = ( !obj.origin ? (self.active.get()).coordinates : obj.origin )
					var destination = obj.destination;
					// units of 1 means miles, 2 means km
					var units = _s_dimensions.active.get();

					var radlat1 = Math.PI * (origin.lat)/180
				    var radlat2 = Math.PI * (destination.lat)/180
				    var radlon1 = Math.PI * (origin.lon)/180
				    var radlon2 = Math.PI * (destination.lon)/180
				    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(Math.PI * ((origin.lon)-(destination.lon))/180);
				    dist = Math.acos(dist)
				    dist = dist * 180/Math.PI
				    dist = dist * 60 * 1.1515

				    if(units == 'US'){
				    	var e = (dist * 0.8684).toFixed(2);
				    	return {
				    		data : dist,
				    		converted : e + ' mi'
				    		}
				    	}

				    // var e = (dist * 1.609344).toFixed(2);
				    return {
				    	data : dist,
				    	converted : dist.toFixed(2) + ' km'
				    	}
					}
				},
			units : function(){
				var units = _s_dimensions.active.get();
				if(units=='US') return 'mi';
				return 'km';
				}
			}
		},
	get active() {
		var self = this;
		return {
			get : function(truthy){
				return self.data.active;
				},
			set : function(obj){
				// let's translate the info into storables 

				self.data.active = {
					formatted : (obj.name?obj.name:obj.city + ' ' + obj.regionName + ' ' + obj.countryName),
					city : obj.city,
					postal : obj.postalCode,
					coordinates : {
						lat : obj.latitude,
						lon : obj.longitude
						},
					region : {
						name : obj.regionName,
						code : obj.region
						},
					country : {
						name : obj.countryName,
						code : obj.countryCode
						},
					source : (obj.source||'maxmind')
					}
				// console.log(self.data.active);
				}
			}
		}
	}


// input is the ip address of the remote machine
module.exports = function(inp){
  	if(!(this instanceof Location)) { return new Location(inp); }
	}