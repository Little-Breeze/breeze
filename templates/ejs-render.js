const fs = require('fs');
const chalk = require('chalk');
const ejs = require('ejs');

module.exports = function (cf) {
	ejs.renderFile(
		cf.tpl,
		{
			title: cf.title,
			body: cf.html,
			app: JSON.stringify(cf.app),
			isApp: !!cf.isApp
		},
		(err, body) => {
			if (err) {
				throw err;
			} else {
				if (fs.existsSync(cf.htmlFile)) {
					fs.unlinkSync(cf.htmlFile);
				}
				fs.writeFileSync(cf.htmlFile, body);
				console.log(chalk.green(`${cf.htmlFile} emit`));
			}
		}
	);
}