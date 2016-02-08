var non = ['null', 'undefined', undefined, null];




String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
    }
String.prototype.replaceAll = function(target, replacement){
    var re = new RegExp(target, 'g');
    return this.replace(re, replacement);
    }
String.prototype.nl2br = function(){
    return this.replace(/\n/g , '<br />');
    }
Array.prototype.max = function() {
        return Math.max.apply(null, this);
        };
Array.prototype.min = function() {
    return Math.min.apply(null, this);
    };
Array.prototype.clone = function() {
    return this.slice(0);
    }
Object.prototype.sum = function() {
    var total = 0;
    for(var key in this){
        if( this.hasOwnProperty( key ) ) {
            total += this[key];
            }
        }
    return total;
    };


module.exports = {
    round : function(value,exp){
        if (typeof exp === 'undefined' || +exp === 0)
        return Math.round(value);

        value = +value;
        exp  = +exp;

        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
        return NaN;

        // Shift
        value = value.toString().split('e');
        value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
        },
    merge : function(obj1, obj2, clean){
        var clns = clean || true;
        var obj3 = {};

        for (var attrname in obj1) { 
            if(((clns && ( non.indexOf(obj1[attrname]) === -1 )) || !clns) && typeof obj1[attrname] != 'function') obj3[attrname] = obj1[attrname]; 
            }
        for (var attrname in obj2) { 
            if(((clns && ( non.indexOf(obj2[attrname]) === -1 )) || !clns)  && typeof obj1[attrname] != 'function') obj3[attrname] = obj2[attrname]; 
            }
        return obj3;
        },
    object : {
        stringed : function(obj, path, truthy){
            if(path == undefined || Object.keys(obj).length == 0 ) return false;
            else {
                var o = obj;
                path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
                path = path.replace(/^\./, '');           // strip a leading dot
                var a = path.split('.');
                while (a.length) {
                    var n = a.shift();
                    if (n in o) {
                        o = o[n];
                        } 
                    else {
                        return;
                        }
                    }

                if(truthy !== undefined && truthy) return this.tf(o)
                else return o;
                }
            },
        // if they are the same object it will return true;
        same : function(source, tester){
            if(Object.keys(source).length != Object.keys(tester).length) return false;

            var same = true;
            _s_u.each(tester, function(v,k){
                if(source[k] != v) {
                    same = false;
                    return false;
                    }
                })
            return same;
            },
        values : function(obj){
            var arr = [];
            _s_u.each(obj, function(v,k){
                arr.push(v);
                })
            return arr;
            },
        delete : function(obj){
            var data = _s_util.clone.deep(obj.data);
            if(obj.delete){
                _s_u.each(obj.delete, function(o,i){
                    if(data[o]) delete data[o]
                    })
                }
            if(obj.keep){
                _s_u.each(obj.keep, function(o,i){
                    if(!data[o]) delete data[o];
                    })
                }
            return data;
            },
        extract : function(obj){
            var send = {};

            if(obj.exclude){
                var tester = obj.exclude.split(',');
                _s_u.each(obj.data,function(v,k){
                    if(_s_util.indexOf(tester, k)==-1) send[k] = v;
                    })
                }
            if(obj.include){
                var tester = obj.include.split(',');
                _s_u.each(obj.data,function(v,k){
                    if(_s_util.indexOf(tester, k)!=-1) send[k] = v;
                    })
                }

            return send;
            }
        },
    get array() {
        var self = this;
        return {
            check : {
                object : function(obj){
                    // this is to see if there is a key/value pair that matches the input
                    var arr = obj.array;

                    // tester should be an array of keys and values
                    var tester = obj.tester;
                    var matches = false;

                    _s_u.each(arr , function(o,i){

                        _s_u.each(tester, function(v,k){
                            if(typeof v == 'object'){

                                _s_u.each(v , function(s_v, s_k){

                                    if(o[k][s_k] && o[k][s_k] == s_v){
                                        matches = true;
                                        return false;
                                        }

                                    })

                                }
                            else if(o[k] && o[k] == v){
                                matches = true;
                                return false;
                                }
                            })
                        return !matches;
                        })
                    
                    return matches;
                    } 
                },
            compare : {
                // this will take in an array of objects and compare them all to the input object to see if the tested object matches any of the objects in the array
                objects : function(obj , test){
                    var arr = (obj.array?obj.array:obj);
                    var testee = (test?test:obj.test);
                    var same = false;

                    _s_u.each(arr , function(o,i){
                        var r = self.object.same(o, test);
                        same = r;
                        return !r
                        })
                    
                    return same;
                    }
                },
            find : {
                // this will return the object inside an array of objects if the value of a certain key matches input
                object : function(arr, key, value, index, type){
                    // type is the key for an embedded object
                    for (var i = 0; i < arr.length; i++) {
                        var test = (type?arr[i][type][key]:arr[i][key])
                        if (test == value) {
                            if(index){
                                return { object : arr[i] , index : i };
                                }
                            else{
                                return arr[i];
                                }

                            }
                        }
                    return false;
                    },
                objects : function(arr, key, value, index, indexes_only){
                    var send = [];
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i][key] == value) {
                            if(indexes_only){
                                send.push(i);
                                }
                            else if(index){
                                send.push({ object : arr[i] , index : i });
                                }
                            else{
                                send.push(arr[i]);
                                }
                            }
                        }
                    if(send.length > 0) return send;
                    else return false;
                    }
                },
            splicem : function(obj){
                // multiple splice
                var valuesArr = obj.array;
                var removeValFromIndex = obj.remove;

                for (var i = removeValFromIndex.length -1; i >= 0; i--)
                    valuesArr.splice(removeValFromIndex[i],1);

                return valuesArr;
                }
            }
        },
    clone : {
        shallow : function(obj){
            // return _s_u.clone(obj);
            return _s_u.extend({}, obj);
            },
        deep : function(obj){            
            return JSON.parse(JSON.stringify(obj));
            }
        },
    parameters : {
        // helper to make a querystring get parameters for a fed data structure
        get : function(obj){
            var qs = require('querystring');
            var data = obj.data?obj.data:obj;
            var str = "";

            _s_u.each(data, function(v,k){
                if(v instanceof Object){
                    str += qs.stringify(v);
                    }
                else{
                    str += '&' + k + '=' + v
                    }
                })

            return str;
            }  
        },
    clean : function(obj){
        _s_u.each(obj, item, function(){
            if(non.indexOf(item) === -1 ) delete obj[item];
            })
        return obj;
        },
    indexOf : function(arr, find) {
        for(var i = 0, j = arr.length; i < j; i++) {
            if (arr[i] == find) {
                return i;
                }
            }
        return -1;
        },
    tf : function(input){
        var truthy = [true, 'true', '1', 1];
        
        if(input instanceof Object && Object.keys(input).length > 0) return true;
        if(input.constructor == Array && input.length > 0 ) return true;
        if(truthy.indexOf(input) != -1 || input) return true;

        return false;
        },
    each: function*(obj, func) {
        if (obj == null) return obj;

        var i, length = obj.length;
        if (length === +length) {
            for (i = 0; i < length; i++) {
                var r = yield func.call(null, obj[i], i);
                if(r==false) break;
                }
            } 
        else {
            var keys = _s_u.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                var r = yield func.call(null, obj[keys[i]], keys[i])
                if(r==false) break;
                }
            }
        return obj;
        },
    get convert() {
        var self = this;
        return {
            // this is for a single object of k/v
            single : function*(obj){
                var data = (obj.data ? obj.data : obj);
                
                var countries = _s_countries.get();
                // load options

                var label = (obj.label ? obj.label : false);
                var objectify = (obj.objectify ? obj.objectify : false);
                var library = (obj.library ? obj.library : false);
                // type is for the seller/customer/status/language
                var type = (obj.type? obj.type : false);

                
                // load validator strings
                var amounts = ['total','amount','price','subtotal','msrp','sale','standard1','standard2','sale1','sale2','return1','return2','sreturn1','sreturn2','local','requested','processed','refunded','authorized'];
                // var amounts = 'total|amount|price|subtotal|msrp|sale|standard1|standard2|sale1|sale2|return1|return2|sreturn1|sreturn2|local|requested|processed|refunded|authorized';
                var csvs = 'restricted|categories';
                var dates = 'added|deleted|modified|submitted|start|end|expiration|cancelled|rejected|requested|approved|denied|withdrawn';
                var countries_t = 'origin|country';
                var dimensions = 's_length|s_width|s_height|s_weight';

                yield _s_util.each(data, function*(v,k){
                    // here if  see that if the value is an object, that means that we have a sellyx object, which has a label and a data attribute. we wil add to that sellyx object a 'converted' property. otherwise, we just have a simple k,v pair that we are converting


                    if(obj.exclude && obj.exclude.search(k) !== -1 ) return;

                    var targ = (v instanceof Object && v.data ? v.data : v);

                    if(k=='totals' | k == 'amounts'){
                        k = _s_currency.convert.array.front({data:v});
                        return;
                        }
                    if(_s_util.indexOf(amounts,k) != -1){
                        var converted =  _s_currency.convert.front(targ, false);
                        }
                    else if(k == 'address'){
                        if(v.constructor == Array){
                            var go = _s_util.clone.shallow(obj);
                            !go.data ? go = v : go.data = v ;
                            data[k] = yield _s_util.convert.multiple(go);
                            return;
                            }
                        else if(v.country){
                            data[k].country = countries[v.country].name;
                            return;
                            }
                        }
                    else if(new RegExp(dates).test(k)){
                        var c = (obj.dates && obj.dates.d ? _s_dt.convert.date.output(targ) : _s_dt.convert.datetime.output(targ) );
                        if(obj.dates && obj.dates.r) var converted = c;
                        // else var converted = c;
                        else var converted = {readable:c , timeago : _s_dt.timeago(targ) }
                        }
                    else if(new RegExp(csvs).test(k)){
                        try{
                            var converted = targ.join(',');
                            }
                        catch(err){
                            var converted = targ;
                            }
                        }
                    else if(new RegExp(countries_t).test(k)){
                        var converted = countries[targ].name;
                        }
                    else if(new RegExp(dimensions).test(k)){
                        var converted = _s_dimensions.convert.front(k, targ, label);
                        }
                    else if(k == 'condition'){
                        var converted = _s_l.info('condition' , targ);
                        }
                    else if(k == 'category'){
                        if(v instanceof Object) return;
                        // else var converted = 'CATEGORY NAME';
                        else var converted = _s_sf.categories.name(v);
                        }
                    else if((library == 'orders' && k == 'items')){
                        var go = _s_util.clone.shallow(obj);
                        !go.data ? go = v : go.data = v ;
                        go.library = k;
                        data[k] = yield _s_util.convert.multiple(go);
                        return;
                        }
                    else if(k == 'setup' || k == 'pricing' || k == 'manufacturer' || k=='line' || (k=='seller' && library == 'inventory') ){
                        var go = _s_util.clone.shallow(obj);
                        !go.data ? go = v : go.data = v
                        data[k] = yield _s_util.convert.single(go);
                        return;
                        }
                    else if(k=='images'){
                        if(obj.images && v.length > 0 ){
                            data[k] = _s_load.engine('images').get.set({
                                path : obj.images.path,
                                images : v
                                })
                            return;
                            }
                        else{
                            return;
                            }
                        }
                    else if(v.value){
                        return;
                        }
                    else{
                        var converted = _s_l.info(k, targ, library, type);
                        }

                    // now we figure out what we want to do with the converted value
                    if(converted != targ){
                        if(v instanceof Object && v.data && objectify){
                            // this is easy. we want to just add the property to the sellyx object and we are done.
                            data[k].converted = converted;
                            }
                        else if(objectify){
                            data[k] = {
                                data : v,
                                converted : converted
                                }
                            }
                        else{
                            // now that we are here, we will see if we are supposed to convert the data into a label property along with the original, or if we are supposed to simply convert the original value into a display value.

                            // if label is an instanceof a string, we have a string that we want to test against to see whether we should convert this value into a label or not
                            if(label){
                                if(label.include){
                                    // if it tests true, that means that we have a specific csv of items that we want to test against to convert into a label
                                    if(new RegExp(label.include).test(k)){
                                        data[k] = {
                                            data : v,
                                            converted : converted
                                            }
                                        }
                                    else{
                                        data[k] = converted;
                                        }
                                    }
                                else if(label.exclude){
                                     if(new RegExp(label.exclude).test(k)){
                                        data[k] = converted;    
                                        }
                                    else{
                                        data[k] = {
                                            data : v,
                                            converted : converted
                                            }
                                        }
                                    }
                                else{
                                    data[k] = {
                                        data : v,
                                        converted : converted
                                        } 
                                    }
                                }
                            else{
                                data[k] = converted;    
                                }
                            }
                        }
                    })
                
                return data;
                },
            multiple : function*(obj){
                var data = obj.data;
                var options = obj;

                if(data.constructor == Array){

                    yield self.each(data, function*(item,ind){
                        options.data = item;

                        data[ind] = yield self.convert.single(options);
                        if(obj.func) obj.func(item); 
                        })
                    }
                else{
                    data = yield self.convert.single(obj);                    
                    }

                return data;
                }
            }
        }
    }