'use strict';

const http = require('http');
const path = require('path');
const util = require('util');
const opn = require('opn');
const webpack = require('webpack');
const express = require('express');
// const getPath = require('./util').getPath;
// const proxy = require('express-http-proxy');
const CWD = process.cwd();

module.exports.start = function(breezeCfg) {

  const webpackConfig = require('../webpack/webpack.base.config.js');
  
  let app = express();
  
  let compiler = webpack(webpackConfig);

  app.use(require("webpack-dev-middleware")(compiler, {
    logLevel: 'warn', publicPath: webpackConfig.output.publicPath
  }));
  
  app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
  }));

  app.get('/', function(req, res, next) {
    var filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, function(err, result){
      if (err) {
        return next(err);
      }
      res.set('content-type','text/html');
      res.send(result);
      res.end();
    });
  });

  let staticDir = path.resolve(CWD, 'app'); // for local dev
  app.use(express.static(staticDir));

  http.createServer(app).listen(breezeCfg.port, function() {
    let url = util.format('http://%s:%d', breezeCfg.host, breezeCfg.port);
    console.log('Listening at %s', url);
    opn(url + '/index.html');
  });

}