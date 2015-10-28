
module.exports = {

	oAuth : 'https://auth.sellyx.com/',
	app : {
		name : 'ecommerce_server',
		machine : 'SELLYX_ECOMMERCE__MAIN',
		keys : ['hi']
		},
	paths : {
		images : {
			products : {
				main : '/resources/products/main/',
				sellers : '/resources/products/seller/'
				},
			listings : '/resources/listings/main/',
			users : '/resources/users/main/',
			sellers : '/resources/sellers/main/'
			},
		controllers : __dirname + '/controllers/',
		datafiles : __dirname + '/datafiles/',
		components : __dirname + '/components/',
		objects : __dirname + '/objects/',
		libraries : __dirname + '/libraries/',
		engine : __dirname + '/libraries/engine/',
		helpers : __dirname + '/libraries/helpers/',
		api : __dirname + '/libraries/api',
		locales : __dirname + '/assets/locales/be/',
		models : __dirname + '/models/',
		semis : __dirname + '/semis/',
		img : root + 'dist/css/img/',
		vendor : root + 'dist/js/vendor/',
		bower : root + 'dist/js/vendor/bower_components/',
		src : {
			css : '../assets/css/',
			js : '../assets/js/',
			locales : '../assets/locales/fe/',
			},
		dist : {
			css : root + 'dist/css/',
			js : {
				main : root + 'dist/js/',
				pieces : root + 'dist/js/pieces/',
				templates : root + 'dist/js/templates/',
				},
			locales : root + 'dist/locales/'
			}
		}
	}