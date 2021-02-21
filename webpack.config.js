/* eslint-env node */

const glob = require( "glob" );
const path = require( "path" );

const localMode = process.env.NODE_ENV || "production";

module.exports = {
	cache: true,
	devtool: process.env.NODE_ENV === "development" ? "eval-cheap-source-map" : "eval",
	entry: ( files => {
		let out = {};

		files.forEach( file => {
			let outName = file.split( "/" ).slice( -1 )[ 0 ].split( "." ).slice( 0 )[ 0 ];
			out[ outName ] = file;
		} );

		return out;
	} )( glob.sync( "./js/*.{,m}js" ) ),
	mode: localMode,
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
		},
		{
			test: /\.ts$/,
			use: "ts-loader",
			exclude: /node_modules/
		} ]
	},
	output: {
		filename: "[name].js",
		path: path.resolve( __dirname, "htdocs/js" )
	},
	target: "web",
	watchOptions: {
		ignored: [ "node_modules/**" ]
	}
};
