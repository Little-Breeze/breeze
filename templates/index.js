const memfs = require('mem-fs');
const editor = require('mem-fs-editor');
const path = require('path');
const doc = require('./doc');
const CWD = process.cwd();
const store = memfs.create();
const fs = editor.create(store);

function createComponent(breezeCfg, name) {
  let context = {
    name: name
  };

  var components_base = path.join(CWD, breezeCfg.base, breezeCfg.components, name);

  fs.copyTpl(
    path.resolve(__dirname, 'component', 'index.js.ejs'), 
    path.resolve(components_base, 'index.js'), 
    context
  );
  fs.copyTpl(
    path.resolve(__dirname, 'component', 'style.styl.ejs'), 
    path.resolve(components_base, name.toLowerCase() + '.styl'),
    context
  );
  fs.commit(function(){
    console.log('Component ' + name + ' created @' + breezeCfg.components + '/ ' + name + ' \n');    
    console.log(doc['component'](name));
  });

}

function createPage(breezeCfg, name) {
  let context = {
    name: name
  };

  var page_base = path.join(CWD, breezeCfg.base, breezeCfg.pages.name, name);

  fs.copyTpl(
    path.resolve(__dirname, 'page', 'index.js.ejs'), 
    path.resolve(page_base, 'index.js'), 
    context
  );
  fs.copyTpl(
    path.resolve(__dirname, 'page', 'style.styl.ejs'), 
    path.resolve(page_base, name.toLowerCase() + '.styl'),
    context
  );
  fs.commit(function(){
    console.log('Page' + name + ' created @' + breezeCfg.pages.name + '/ ' + name + ' \n');    
    console.log(doc['component'](name));
  });

}

module.exports = {
  createComponent,
  createPage
};