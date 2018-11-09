const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const breezeCfg = require('../src/config').getBreeze();
const argv = require('yargs').argv;
const chalk = require('chalk');
const isProd = argv.mode === 'production';
const isDev = !isProd;
const CWD = process.cwd();
const hotMiddlewareConfig = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000';

function getPath(...paths) {
  return paths.reduce((total, curValue) => {
    return path.resolve(total, curValue);
  }, path.resolve(CWD));
}

function getClient() {
  if (isDev) {
    return [
      hotMiddlewareConfig,
      path.resolve(CWD, breezeCfg.base, breezeCfg.entry),
    ];
  } else {
    return [path.resolve(CWD, breezeCfg.base, breezeCfg.entry)]
  }
}

const isMulti = typeof(breezeCfg.pages.multi) === 'object';
let multiEntries = Object.create(null);
let htmlPlugins = [];

if (isMulti) { // for multi pages config
  const modules = Object.keys(breezeCfg.pages.multi);
  for (let srcModule of modules) {
    const srcModuleDir = getPath(breezeCfg.base, breezeCfg.pages.name, srcModule);
		if (!fs.existsSync(getPath(srcModuleDir))) {
      throw Error(`can't find module folder: ${srcModule}`);
      return;
    }
    const srcModuleVal = breezeCfg.pages.multi[srcModule];
    const srcModuleEntry = getPath(srcModuleDir, srcModuleVal.entry);
    console.log('src module entry: ', srcModuleEntry);
		if (!fs.existsSync(srcModuleEntry)) {
			throw Error(`entry:${srcModule} 组件入口文件不存在`);
		}
		console.log(chalk.yellowBright(`client module:${srcModule}`));
    multiEntries[srcModule] = [hotMiddlewareConfig, srcModuleEntry]
    // let outputDir = buildConfig[srcModule].outputDir || srcModule;
    let outputDir = srcModule;

		htmlPlugins.push(
			new HtmlWebpackPlugin({
				filename: `${outputDir}/index.html`,
				template: getPath(srcModuleDir, 'index.html'),
				inject: true,
				hash: false,
				chunks: [srcModule, 'vendor', 'common', 'runtime'],
				minify: {
					removeComments: isProd,
					collapseWhitespace: isProd,
					minifyJS: isProd
				}
			})
		);
	}
} else { // for spa page config
  htmlPlugins.push(
    new HtmlWebpackPlugin({
      template: getPath('src/index.html'),
      inject: 'true'
    })
  )
}

const config = {
  mode: isDev ? 'development' : 'production',
  entry: (function() {
    if (isMulti) {
      console.log('multi: ', multiEntries);
      return multiEntries;
    } else {
      let entries = {
        vendor: breezeCfg.vendor || ['react', 'react-dom'],
        client: getClient(),
      };
      return entries;
    }
  })(),
  output: {
    path: getPath(breezeCfg.build),
    chunkFilename: '[name].[chunkhash].js',
    filename: `[name].[${isDev ? 'hash' : 'chunkhash'}].js`,
    publicPath: isDev ? '/' : breezeCfg.static[process.env.MODE]
  },
  devtool: isDev ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: require('./babel.js')
      },
      {
        test: /\.styl$/,
        include: path.resolve(CWD, breezeCfg.base),
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
				test: /\.(png|jpg|gif|jpeg|svg)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: isProd ? breezeCfg.base64_image_limit : 1,
						name: './images/[name].[hash:8].[ext]'
					}
				}
      },
      {
				test: /\.(ttf|otf|woff|woff2|eot)$/,
				use: {
					loader: 'url-loader',
					options: {
						name: './fonts/[name].[ext]',
						limit: 8192
					}
				}
      },
      {
				test: /\.json$/,
				use: 'json-loader'
			}
    ]
  },
  resolve: {
    alias: breezeCfg.alias,
    extensions: ['.js', '.jsx', '.css', '.styl', '.png', '.jpg']
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new MiniCssExtractPlugin({
			filename: '[name].[hash].css',
			chunkFilename: '[name].[hash].css'
		}),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin((function(){
      var global_defines =  {
           'process.env': {
               MODE: JSON.stringify(process.env.MODE),
               NODE_ENV: JSON.stringify('development')
           },
           'API': JSON.stringify(breezeCfg.api[process.env.MODE]),
           'STATIC': JSON.stringify(breezeCfg.static[process.env.MODE])
      };

      for(var global in breezeCfg.globals) {
           global_defines[global.toUpperCase()] = JSON.stringify(breezeCfg.globals[global][process.env.MODE])
      }

      return global_defines;
    })()),
    ...htmlPlugins
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        common: {
					name: 'common',
					chunks: 'initial',
					minChunks: 2
				},
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
}

if (isDev) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
  config.plugins.push(
		new OptimizeCSSAssetsPlugin()
	);
}

module.exports = config;