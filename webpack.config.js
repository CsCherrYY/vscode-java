// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

//@ts-check
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = function (env, argv) {
	env = env || {};

	return [{
	  name: 'assets',
	  mode: 'none',
	  entry: {
		'formatter': './src/formatter/assets/index.ts'
	  },
	  module: {
		rules: [{
		  test: /\.ts(x?)$/,
		  exclude: /node_modules/,
		  use: 'ts-loader'
		}, {
		  test: /\.(scss)$/,
		  use: [{
			loader: 'style-loader'
		  }, {
			loader: 'css-loader'
		  }, {
			loader: 'postcss-loader',
			options: {
			  plugins: function () {
				return [require('autoprefixer')];
			  }
			}
		  }, {
			loader: 'sass-loader'
		  }]
		}]
	  },
	  output: {
		filename: 'assets/[name]/index.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		devtoolModuleFilenameTemplate: "../[resource-path]"
	  },
	  plugins: [
		new HtmlWebpackPlugin({
		  filename: path.resolve(__dirname, 'dist/assets/formatter/index.html'),
		  template: 'src/formatter/assets/index.html',
		  inlineSource: '.(js|css)$',
		  chunks: ['formatter']
		}),
		new HtmlWebpackInlineSourcePlugin(),
	  ],
	  devtool: 'source-map',
	  resolve: {
		extensions: ['.js', '.ts', '.tsx']
	  }
	}, {
		name: 'extension',
		watchOptions: {
			ignored: /node_modules/
		},
		target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
		node: {
			__dirname: false,
			__filename: false,
		},
		entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
		output: { // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
			path: path.resolve(__dirname, 'dist'),
			filename: 'extension.js',
			libraryTarget: "commonjs2",
			devtoolModuleFilenameTemplate: "../[resource-path]",
		},
		externals: {
			vscode: "commonjs vscode", // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
		},
		devtool: 'source-map',
		resolve: { // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
			extensions: ['.ts', '.js'],
		},
		module: {
			rules: [{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [{
					loader: 'ts-loader',
				}]
			}]
		},
	}]
  };
