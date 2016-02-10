
module.exports = {
	root : 'https://ec.sellyx.com/',
	// root : 'http://10.0.1.3:10000/',
	oAuth : 'https://auth.sellyx.com/',
	// financials : 'http://localhost:8000/',
	financials : 'https://ec.sellyx.com/payments/',
	// dashboard : 'http://localhost:8090/',
	dashboard : 'http://dashboard.sellyx.com/',
	certs : {
		// issuer : '10.0.1.3',
		issuer : 'ec.sellyx.com',
		key : '/sellyx/certs/ec_sellyx_com.key',
		cert : '/sellyx/certs/server.pem',
		// key : __dirname + '/certs/server.key',
		// cert : __dirname + '/certs/server.crt'
		},
	app : {
		name : 'ecommerce_service',
		machine : 'SELLYX_ECOMMERCE__MAIN',
		keys : ['hi']
		},
	paths : {
		geoip : __dirname + '/geoip/',
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