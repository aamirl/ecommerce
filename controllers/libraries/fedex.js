// Fedex API

// var _parser = require('xml2js').parseString;
var services = {
    EUROPE_FIRST_INTERNATIONAL_PRIORITY : 'European First International Priority',
    FEDEX_1_DAY_FREIGHT : 'One Day Freight',
    FEDEX_2_DAY : 'Two Day',
    FEDEX_2_DAY_AM : 'Two Day, AM Service',
    FEDEX_2_DAY_FREIGHT : 'Two Day, Freight',
    FEDEX_3_DAY_FREIGHT : 'Three Day, Freight',
    FEDEX_EXPRESS_SAVER : 'Express Saver',
    FEDEX_FIRST_FREIGHT : 'First Freight',
    FEDEX_GROUND : 'Standard Ground',
    FEDEX_HOME_DELIVERY : 'Home Delivery',
    GROUND_HOME_DELIVERY : 'Ground Home Delivery',
    FIRST_OVERNIGHT : 'First Overnight',
    INTERNATIONAL_DISTRIBUTION_FREIGHT : 'International Distribution Freight',
    INTERNATIONAL_ECONOMY : 'International Economy Standard Service',
    INTERNATIONAL_ECONOMY_DISTRIBUTION : 'International Economy Distribution Service',
    INTERNATIONAL_ECONOMY_FREIGHT : 'International Economy Freight Service',
    INTERNATIONAL_FIRST : 'International First Service',
    INTERNATIONAL_PRIORITY : 'International Priority',
    INTERNATIONAL_PRIORITY_DISTRIBUTION : 'International Priority Distribution',
    INTERNATIONAL_PRIORITY_FREIGHT : 'International Priority Freight Service',
    PRIORITY_OVERNIGHT : 'Priority Overnight',
    STANDARD_OVERNIGHT : 'Standard Overnight'
    };
var packaging = {
    FEDEX_EXTRA_LARGE_BOX : 'Fedex Extra Large Box',
    FEDEX_LARGE_BOX : 'Fedex Large Box',
    FEDEX_MEDIUM_BOX : 'Fedex Medium Box',
    FEDEX_SMALL_BOX : 'Fedex Small Box',
    FEDEX_10KG_BOX : 'Fedex 10KG Box',
    FEDEX_25KG_BOX : 'Fedex 25KG Box',
    FEDEX_BOX : 'Fedex Box',
    FEDEX_ENVELOPE : 'Fedex Envelope',
    FEDEX_PAK : 'Fedex Pak',
    FEDEX_TUBE : 'Fedex Tube',
    YOUR_PACKAGING : 'Custom Packaging'
    };

function Fedex(){}
Fedex.prototype = {
    helpers : {
        prep : function(){
            return {
                WebAuthenticationDetail : {
                    UserCredential : {
                        Key : 'ENU57FY4X5Djobkt',
                        Password : '3CdJs5Scpb3yjVMmTKtbDj3v5'
                        }
                    },
                ClientDetail : {
                    AccountNumber : '510087860',
                    MeterNumber : '118603289'
                    },

                };
            }
        },
    get get() {
        var self = this;
        return {
            postal : function*(obj){
                var country = (obj.country?obj.country:_s_countries.active.get());
                console.log(country);
                var data = self.helpers.prep(); 
                var path = _s_config.paths.api + '/fedex/CountryService_v4.wsdl';
                console.log(path);
                
                data.Version = {
                    ServiceId : 'cnty',
                    Major : '4',
                    Intermediate : '0',
                    Minor : '0'
                    }
                data.PostalCode = obj.postal;
                data.CountryCode = yield _s_countries.code(country);


                var deferred = _s_q.defer();
                _soap.createClient( path , deferred.makeNodeResolver());

                var results = yield deferred.promise.then(function(client){
                    var deferred2 = _s_q.defer();
                    
                    client.postalCodeInquiry(data , deferred2.makeNodeResolver());
                    return deferred2.promise.then(function(result){
                    
                        return result;

                        })
                    })

                results = results[0];
                console.log(results);
                if(results.HighestSeverity && results.HighestSeverity != 'ERROR' && results.HighestSeverity != 'FAILURE'){
                    return true;
                    }
                return false

                },
            rates : function*(obj){
                var data = self.helpers.prep(); 
                var path = _s_config.paths.api + '/fedex/RateService_v18.wsdl';
                
                data.Version = {
                    ServiceId : 'crs',
                    Major : '18',
                    Intermediate : '0',
                    Minor : '0'
                    }

                data = _s_util.merge(data, {
                    ReturnTransitAndCommit : true,
                    RequestedShipment : {
                        DropoffType : obj.dropoff ? obj.dropoff : 'REGULAR_PICKUP',
                        // ShipTimestamp : '2015-06-22T10:56:46-06:00',
                        // ShipTimestamp : obj.date ? obj.date : _s_dt.now.date(),
                        // PackagingType : obj.packaging ? obj.packaging : 'YOUR_PACKAGING',
                        // TotalInsuredValue : {
                        //     Amount : (obj.insured ? obj.insured : 100),
                        //     Currency : 'USD'
                        //     },
                        Shipper : {
                            Address : {
                                PostalCode : obj.origin.postal,
                                CountryCode : obj.origin.country,
                                }
                            },
                        Recipient : {
                            Address : {
                                PostalCode : (obj.recipient.postal ? obj.recipient.postal : _s_countries.active.postal.get()),
                                CountryCode : (obj.recipient.country ? obj.recipient.country : _s_countries.active.get()),
                                Residential : obj.business ? false : true
                                }
                            },
                        ShippingChargesPayment : {
                            PaymentType : 'SENDER',
                            Payor : {
                                ResponsibleParty : {
                                    AccountNumber : '510087860',
                                    Address : {
                                        CountryCode : 'US'
                                        }
                                    }
                                }
                            },
                        CustomsClearanceDetail : { 
                            CommercialInvoice : { 
                                Purpose : 'SOLD' 
                                } 
                            },
                        PackageCount : '1',
                        RequestedPackageLineItems : {
                            SequenceNumber : 1,
                            GroupPackageCount : 1,
                            Weight : {
                                Units : 'KG',
                                Value :  obj.package ? Math.ceil(parseFloat(obj.package + obj.dimensions.s_weight)) : Math.ceil(parseFloat(obj.dimensions.s_weight))
                                },
                            Dimensions : {
                                Length : Math.ceil(obj.dimensions.s_length),
                                Width : Math.ceil(obj.dimensions.s_width.toString()),
                                Height : Math.ceil(obj.dimensions.s_height.toString()),
                                Units : 'CM'
                                }
                            }
                        // ShipmentSpecialService : 'FEDEX_ONE_RATE'
                        }
                    })

                obj.serviceId ? data.RequestedShipment.ServiceType = obj.serviceId : null;
                obj.packaging ? data.RequestedShipment.PackagingType = obj.packaging : null;

                
                // if(obj.origin.country == 'IN' && obj.recipient.country == 'IN'){
                //     data.RequestedShipment.CustomsClearanceDetail = { 
                //         CommercialInvoice : { 
                //             Purpose : 'SOLD' 
                //             } 
                //         };
                //     }
                
                // var _soap = require('soap');
                var _soap = require('easysoap');
                var send = {};

                var deferred = _s_q.defer();
                _soap.createClient( {wsdl:path} , deferred.makeNodeResolver());

                var results = yield deferred.promise.then(function(client){
                    var deferred2 = _s_q.defer();
                    
                    client.getRates(data , deferred2.makeNodeResolver());
                    return deferred2.promise.then(function(result){
                        return result;

                        })
                    })

                results = results[0];
                
                if(results.HighestSeverity && results.HighestSeverity != 'ERROR' && results.HighestSeverity != 'FAILURE'){
                            
                    _s_u.each(results.RateReplyDetails, function(dets, ind){

                        send[dets.ServiceType] = {
                            service : {
                                label : 'FedEx: ' + services[dets.ServiceType],
                                id : dets.ServiceType
                                },
                            packaging : {
                                label : packaging[dets.PackagingType],
                                id : dets.PackagingType
                                },
                            rate : parseFloat(dets.RatedShipmentDetails[0].ShipmentRateDetail.TotalNetCharge.Amount),
                            // transit : 
                            }

                        })

                    }

                return send;
                }
            }

        }
    }



module.exports = function(){
    if(!(this instanceof Fedex)) { return new Fedex(); }
    }


















