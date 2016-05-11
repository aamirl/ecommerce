// Images Library
var gm = require('gm'), fs = require('fs'), path = require('path');

function Images(){
	}

Images.prototype = {
	get single() {
		var self  = this;
		return {
			product : {
				main : function(obj){
					if(obj.data) var data = obj.data
					else var data = obj;

					if(!obj.set){
	    				return '/' + (data[0].image?data[0].image:data[0]);
	    				}
	    			else{

	    				if(obj.dets){
		    				return {
		    					image : data,
								details : obj.dets
		    					}
	    					}
	    				else {
	    					return {
								image : data
								}
	    					}
	    				}

					}
				}
			}
		},
	get sets() {
		var self  = this;
		return {
			products : {
				main : function(obj){
								
					if(obj.data) var data = obj.data
					else var data = obj;

					var send = [];


					_s_u.each(data, function(img_dets, ind){

						send.push(self.single.product.main({ data : img_dets.image, set : true , dets : img_dets }))

						})

					return send;
					}
				}
			}
		},
	get get(){
		var self = this;
		return {
			set : function(obj){
				var path = (obj.path ? obj.path : _s_config.paths.images.products.main);
				var images = (obj.images ? obj.images : obj);
				var send = [];

				_s_u.each(images, function(data, ind){
					var img = (data instanceof Object ? data.image : data);
					send.push(self.get.single({image:img,path:path}));
					})

				return send;
				},
			single : function(obj){
				// var type = (obj.types : obj.types : false);
				var send = {};

				_s_u.each(['small','medium','large'], function(size,ind){
					send[size] = obj.path + size + '/' + obj.image;
					})
				return send;
				}
			}
		},
	stream : function*(app, loc){


		var parse = require('co-busboy');
		var parts = parse(app);

		try{
			while (part = yield parts) {
				var stream = fs.createWriteStream('public/resources/' + loc + '/' + Math.floor((Math.random() * 10000000000000000000)) + path.extname(part.filename) );
				part.pipe(stream);
				console.log('uploading %s -> %s', part.filename, stream.path);
				}

			return {success : stream.path };
			}
		catch(err){
			return {failure : err};
			}

		},
	get set() {
		var self = this;
		return {
			object : function(obj){
				var sizes = ( obj.sizes ? obj.sizes : { large: { w: 900, h: 900 }, medium: { w: 400, h: 400 }, small: { w: 150, h: 150 }, } )
				var images = [];

				var go = function(file){
					
					var image = (file.name?file.name:file).split('/');
					image = image[image.length - 1];

					_s_q.promise(function(){
						_s_u.each(sizes, function(dets, size){
							self.process({ src : './' + (file.name?file.name:file), h: dets.h, w: dets.w, dest : obj.dest + '/' + size + '/' + image });
							})
						})
					.then(function(){
						console.log('here');
						})

					return image;
					}


				if(obj.spacer){
					_s_u.each(obj.src , function(imgs, spacer){
						_s_u.each(imgs, function(file , ind){
							var a = {
								image : go(file),
								}
							a[obj.spacer] = spacer;
							images.push(a)
							})
						
						})
					}
				else{
					_s_u.each(obj.src, function(file , ind){
						images.push({
							image : go(file)
							})
						})
					}

				return images;
				},
			array : function(obj){
				var sizes = ( obj.sizes ? obj.sizes : { large: { w: 900, h: 900 }, medium: { w: 400, h: 400 }, small: { w: 150, h: 150 }, } )
				var images = [];

				_s_u.each(obj.src, function(img, file){
					
					var image_name = (img.name ? img.name.split('/') : img.split('/'));
					image_name = image_name[image_name.length - 1];

					_s_q.promise(function(){
						_s_u.each(sizes, function(dets, size){
							self.process({ src : './' + (img.name?img.name:img), h: dets.h, w: dets.w, dest : obj.dest + '/' + size + '/' + image_name });
							})
						})
					.then(function(){
						console.log('here');
						})

					images.push(image_name);
					})

				return images;
				},
			single : function(obj){
				var sizes = ( obj.sizes ? obj.sizes : { large: { w: 900, h: 900 }, medium: { w: 400, h: 400 }, small: { w: 150, h: 150 }, } )

				var img = obj.src;

				var image_name = (img.name ? img.name.split('/') : img.split('/'));
				image_name = image_name[image_name.length - 1];

				_s_q.promise(function(){
					_s_u.each(sizes, function(dets, size){
						self.process({ src : './' + (img.name?img.name:img), h: dets.h, w: dets.w, dest : obj.dest + '/' + size + '/' + (obj.name?obj.name:image_name) });
						})
					})
				.then(function(){
					console.log('here');
					})


				}
			}
		},
	process : function(obj){

		gm(obj.src)
			.options({imageMagick:true})
			.resize(obj.w,obj.h)
			.extent(obj.w, obj.h, 'white','center')
			.flatten()
			// .out('-background white -alpha remove')
			.noProfile()
			.write('./public/resources/' + obj.dest, function (err) {
			if (!err) console.log('Success');
			else console.log(err);
			});

		},
	remove : {
		temp : function(obj){
			var defer = _s_q.defer();
			fs.unlink('../sellyx/' + obj.file, defer);
			return defer.promise;
			},
		existing : function(obj){
			var image = obj.image;
			var path = obj.path;

			_s_u.each(['small','large','medium'], function(size,ind){

				fs.unlink('../sellyx/public' + path  + size + '/' + image , function(err,dat){
				
					});
				})
			}
		}
	
	}

module.exports = function(){return new Images(); }


















