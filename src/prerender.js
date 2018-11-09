const path = require('path');
const fs = require('fs');
const process = require('process');
const chalk = require('chalk');
const ejsRender = require('../templates/ejs-render');
const breeze = require('./config');
const breezeCfg = breeze.getBreeze();
const CWD = process.cwd();

const argv = require('yargs').argv;
let prerenderConfig = 'index';

if (argv.cfg) {
	prerenderConfig = 'index.' + argv.cfg;
}

const configFile = path.resolve(CWD, `config/${prerenderConfig}.js`);
if (!fs.existsSync(configFile)) {
	exit(`${configFile} does not exist`);
}

const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
const outputFileName = 'index.html';
const srcRoot = path.resolve(CWD, 'src');
const isDev = argv.env !== 'prod';
// TODO: 根据config来定义API
const api = `https://www${isDev ? '-demo' : ''}.test.com`;
const tplRoot = path.resolve(CWD, 'config'); 
const modules = [];
const preRenderers = Object.create(null);

console.log(chalk.yellowBright(`api: ${api}`));
console.log(chalk.yellowBright(`server config: ${prerenderConfig}.js`));
console.log(chalk.yellowBright(`env: ${isDev ? 'demo' : 'production'}`));
build();

function getFilePathByConfig(mod) {
	if (typeof(breezeCfg.pages.multi) === 'object') {
		return path.resolve(CWD, `src/pages/${mod}`);
	} else {
		return path.resolve(CWD, 'src');
	}
}

function build() {
	for (let mod of Object.keys(config)) {
		let filePath = getFilePathByConfig(mod)
		if (fs.existsSync(filePath)) {
			modules.push(mod);
			preRenderers[mod] = require(`prerender/${mod}.js`).default;
			console.log(preRenderers);
		} else {
			const error = `can't find module folder: ${mod}`;
			exit(error);
		}
  }
  
	if (modules.length) {
		for (let moduleToPrerender of modules) {
			console.log(chalk.yellowBright(`server module:${moduleToPrerender}`));
			const moduleConfig = config[moduleToPrerender];
			const cf = {
				title: moduleConfig.title,
				tpl: path.resolve(tplRoot, moduleConfig.tpl),
				htmlFile: (function() {
					if (typeof(breezeCfg.pages.multi) === 'object') {
						return path.resolve(srcRoot, 'pages', moduleToPrerender, outputFileName);
					} else {
						return path.resolve(srcRoot, outputFileName);
					}
				})()
			};
			renderModule(moduleToPrerender, cf);
		}
	} else {
		const error = `can't find any module to build`;
		exit(error);
	}
}

function renderModule(currentModule, cf) {
	const renderer = preRenderers[currentModule];
	if (typeof renderer === 'function') {
		let renderCf = renderer.apply(renderer, [currentModule, cf, api, isDev]);
		ejsRender(renderCf);
	} else {
		const error = `can't find module prerenderer: ${currentModule}`;
		process.exit(error);
	}
}

function exit(error) {
	console.log(chalk.red(error));
	process.exit(9);
}
