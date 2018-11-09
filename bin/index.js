#!/usr/bin/env node

const program = require('commander');
const package = require('../package.json');
const breezeCfg = require('../src/config.js');
const tasks = require('../src/tasks.js');

var __mode;

program
  .version(package.version)
  .option('-p --port', 'custom server port')
  .option('-s --server', 'run server')
  .option('-w --watch', 'run eslint in watch mode')
  .arguments('[mode] [name]')
  .action(function(mode, name) {
    console.log('mode: ', mode);
    __mode = mode;
    if (!breezeCfg.hasBreeze() && mode !== 'init' && mode !== 'init-redux') {
      console.error('breeze can\'t run without breeze.config.js \n');
      process.exit(1);
    }
    let modes = ['init', 'init-redux', 'init-prerender', 'start', 'build', 'build-server', 'prerender', 'component', 'page'];
    if (modes.indexOf(mode) === -1) {
      console.log('breeze task miss match \n');
      cli.help();
    } else {
      tasks[mode](name || program.port || program.server || program.watch);
    }
  });

program.parse(process.argv);