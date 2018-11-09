const path = require("path");
const fs = require("fs");
const process = require("process");
const watch = require("watch");
const chalk = require("chalk");
const config = require("./config");
const server = require("./server");
const template = require("../templates");

let breezeCfg = config.getBreeze();

require("shelljs/global");

const CWD = process.cwd();

function checkModules() {
  if (!fs.existsSync(path.resolve(CWD, "node_modules"))) {
    console.log("install node modules ... \n");
    exec("npm install");
  }
}

// use webpack in node_modules/.bin/webpack
const webpack = path.resolve(
  __dirname,
  "..",
  "node_modules",
  ".bin",
  "webpack"
);

const tasks = {
  init: function(name) {
    if (!name) {
      console.log("App name is required");
      process.exit(1);
    }
    mkdir(name);
    cp(
      "-R",
      path.resolve(__dirname, "..", "templates", "app/*"),
      path.resolve(CWD, name)
    );
    console.log("Project ", name, "create success");
  },

  "init-redux": function(name) {
    if (!name) {
      console.log("App name is required");
      process.exit(1);
    }
    mkdir(name);
    cp(
      "-R",
      path.resolve(__dirname, "..", "templates", "redux/*"),
      path.resolve(CWD, name)
    );
    console.log("Project", name, "create success");
  },

  "init-prerender": function() {
    cp(
      "-R",
      path.resolve(__dirname, "..", "templates", "prerender/*"),
      path.resolve(CWD)
    );
  },

  start: function() {
    checkModules();
    process.env.MODE = "start";
    server.start(breezeCfg);
  },

  build: function() {
    checkModules();
    (process.env.MODE = "build"),
      exec(
        webpack +
          " --config " +
          path.resolve(__dirname, "..", "webpack", "webpack.base.config.js") +
          " --progress"
      );
  },

  "build-server": function() {
    if (!breezeCfg.prerender) {
      console.log(chalk.red("breeze.config.js中prerender选项需要设为true"));
      process.exit(9);
    }
    (process.env.MODE = "build-server"),
      exec(
        webpack +
          " --config " +
          path.resolve(__dirname, "..", "webpack", "webpack.server.config.js") +
          " --progress"
      );
  },

  prerender: function() {
    if (!breezeCfg.prerender) {
      console.log(chalk.red("breeze.config.js中prerender选项需要设为true"));
      process.exit(9);
    }
    process.env.MODE = "prerender";
    exec(
      webpack +
        " --config " +
        path.resolve(__dirname, "..", "webpack", "webpack.server.config.js") +
        " --progress"
    );
    exec(`node ${path.resolve(CWD, "dist-server/prerender")}`);
  },

  component: function(name) {
    if (!name || !name.length) {
      console.log("Component name is required");
      process.exit(1);
    }

    name = name[0].toUpperCase() + name.slice(1);

    template.createComponent(breezeCfg, name);
    console.log("组件", name, "创建成功\n");
    console.log(
      "目录:" + [breezeCfg.base, breezeCfg.components, name].join("/")
    );
  },

  page: function(name) {
    if (!name || !name.length) {
      console.log("Page name is required");
      process.exit(1);
    }

    name = name[0].toUpperCase() + name.slice(1);

    template.createPage(breezeCfg, name);
    console.log("页面", name, "创建成功\n");
    console.log(
      "目录:" + [breezeCfg.base, breezeCfg.pages.name, name].join("/")
    );
  }
};

module.exports = tasks;
