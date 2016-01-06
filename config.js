
module.exports = {

	oAuth : 'https://auth.sellyx.com/',
	app : {
		name : 'ecommerce_service',
		machine : 'SELLYX_ECOMMERCE__MAIN',
		keys : ['hi']
		},
	paths : {
		controllers : __dirname + '/controllers/',
		datafiles : __dirname + '/datafiles/',
		components : __dirname + '/components/',
		objects : __dirname + '/objects/',
		libraries : __dirname + '/libraries/',
		engine : __dirname + '/libraries/engine/',
		helpers : __dirname + '/libraries/helpers/',
		api : __dirname + '/libraries/api',
		locales : __dirname + '/assets/locales/',
		models : __dirname + '/models/'
		}
	}