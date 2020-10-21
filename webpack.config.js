/* eslint-env node */

const glob = require( "glob" );
const path = require( "path" );

module.exports = {
	cache: true,
	devtool: "cheap-module-source-map",
	entry: ( files => {
		let out = {};

		files.forEach( file => {
			let outName = file.split( "/" ).slice( -1 )[ 0 ].split( "." ).slice( 0 )[ 0 ];
			out[ outName ] = file;
		} );

		return out;
	} )( glob.sync( "./js/*.{,m}js" ) ),
	module: {
		rules: [ {
			test: /\.{,m}js$/,
			exclude: /node_modules/,
			use: {
				loader: "babel-loader",
				options: {
					presets: [ "@babel/preset-env" ],
					plugins: [ "@babel/plugin-transform-runtime" ]
				}
			}
		} ]
	},
	output: {
		filename: "[name].js",
		path: path.resolve( __dirname, "htdocs/js" )
	},
	target: "web"
};
