const path = require('path');
const process = require('process');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
// const argv = require('yargs').argv;
const CWD = process.cwd();

const serverPlugins = [
	new webpack.DefinePlugin({
		__client__: false,
		__production__: false,
		__dev__: true
	})
];

const plugins = [
	[
		'babel-plugin-transform-require-ignore',
		{
			extensions: ['.styl', '.css']
		}
	]
];

module.exports = {
	entry: {
		prerender: path.resolve(__dirname, '../src/prerender.js'),
	},
	target: 'node',
	externals: [nodeExternals()],
	output: {
		path: path.resolve(CWD, 'dist-server'),
		filename: '[name].js'
	},
	resolve: {
		extensions: ['jsx', '.js'],
		alias: {
			'prerender': path.resolve(CWD, 'prerender'),
		},
		modules: ['node_modules', path.resolve(CWD, 'prerender'), path.resolve(CWD, 'node_modules'), path.resolve(CWD)]
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: [
					// {loader: 'cache-loader'},
					// {
					// 	loader: 'thread-loader',
					// 	options: {
					// 		workers: require('os').cpus().length - 1
					// 	}
					// },
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
							plugins: plugins,
							presets: [
								[
									"@babel/preset-env",
									{
										"modules": false
									}
								],
								"@babel/preset-react"
							]
						}
					}
				]
			},
			{
				test: /\.(png|jpg|gif|jpeg|svg)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: './images/[name].[ext]',
						emitFile: false
					}
				}
			}
		]
	},
	plugins: serverPlugins
};
