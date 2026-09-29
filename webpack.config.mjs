/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { loaders } from '@ckeditor/ckeditor5-dev-utils';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );
const require = createRequire( import.meta.url );

const ckCorePackages = [
	'ckeditor5-core',
	'ckeditor5-engine',
	'ckeditor5-ui',
	'ckeditor5-utils',
	'ckeditor5-icons',
	'ckeditor5-watchdog',
	'ckeditor5-editor-multi-root',
];

export default {
	devtool: 'source-map',
	performance: { hints: false },

	entry: {
		ckeditor: path.resolve( __dirname, 'src', 'ckeditor.js' ),
		'content-style': path.resolve( __dirname, 'src', 'content-style.js' )
	},

	resolve: {
		// Force every dependent package to resolve these "core" CKEditor 5 packages to the same
		// physical copy, wherever npm happened to place it (hoisted at the top level or nested
		// under ckeditor5/node_modules) — otherwise duplicate instances break class checks like
		// `instanceof Plugin` across packages.
		alias: Object.fromEntries(
			ckCorePackages.map( pkg => [
				`@ckeditor/${ pkg }`,
				path.dirname( require.resolve( `@ckeditor/${ pkg }/package.json` ) )
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
