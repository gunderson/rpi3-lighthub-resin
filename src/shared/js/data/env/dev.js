let defaults = require( "./default.js" ),
	_ = require( "lodash" );

module.exports = _.defaults( defaults, {
	"name": "dev"
} );