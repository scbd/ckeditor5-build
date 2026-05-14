/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

/* eslint-env node */

const path = require( 'path' );
const { loaders } = require( '@ckeditor/ckeditor5-dev-utils' );
const TerserWebpackPlugin = require( 'terser-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

const ckCorePackages = [
	'ckeditor5-core',
	'ckeditor5-engine',
	'ckeditor5-ui',
	'ckeditor5-utils',
	'ckeditor5-icons',
	'ckeditor5-watchdog',
	'ckeditor5-editor-multi-root',
];

module.exports = {
	devtool: 'source-map',
	performance: { hints: false },

	entry: {
		ckeditor: path.resolve( __dirname, 'src', 'ckeditor.js' ),
		'content-style': path.resolve( __dirname, 'src', 'content-style.js' )
	},

	resolve: {
		alias: Object.fromEntries(
			ckCorePackages.map( pkg => [
				`@ckeditor/${ pkg }`,
				path.resolve( __dirname, `node_modules/ckeditor5/node_modules/@ckeditor/${ pkg }` )
			] )
		)
	},

	output: {
		// The name under which the editor will be exported.
		library: 'ClassicEditor',

		path: path.resolve( __dirname, 'build' ),
		filename: ( { chunk } ) => chunk.name === 'ckeditor' ? 'ckeditor.js' : '[name].js',
		libraryTarget: 'umd',
		libraryExport: 'default'
	},

	optimization: {
		minimizer: [
			new TerserWebpackPlugin( {
				terserOptions: {
					output: {
						// Preserve CKEditor 5 license comments.
						comments: /^!/
					}
				},
				extractComments: false
			} )
		]
	},

	plugins: [
		new MiniCssExtractPlugin( {
			filename: ( { chunk } ) => chunk.name === 'ckeditor' ? 'ckeditor.css' : '[name].css'
		} )
	],

	module: {
		rules: [
			{
				test: /\.svg$/,
				use: [ 'raw-loader' ]
			},
			loaders.getStylesLoader( {
				minify: true,
				extractToSeparateFile: true,
				sourceMap: true
			} )
		]
	}
};
