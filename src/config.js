const path = require('path');
const fs = require('fs');
const CWD = process.cwd();
let default_breeze = require('./breeze.config.js');
const requireFromString = require('./util').requireFromString; 
// const getPath = require('./util').getPath;

function extend(target, source) {
    var hasOwnProperty = {}.hasOwnProperty;

    for(var key in source) {
        if(hasOwnProperty.call(target, key)) {
            if(key === 'alias' || key === 'template') {
                // for alias, rewrite already defined, and add in new
                for(var al in source[key]) {
                    target[key][al] = source[key][al];
                }
            } else {
                target[key] = source[key];
            }
        }
    }

    // rewrite with local absolute path
    for(var key in target.alias) {
        var value = target.alias[key];
        target.alias[key] = path.join(target.base, value);
    }

    /**
     *  mock data replacement happend only when mock value setted on template configuration, or multiple page configuration
     *
     *  the replacement process happended on START Mode only 
     *
     */
    // if(typeof target.pages == 'object') {
    //     for(var key in target.pages) {
    //         var entry = target.pages[key]
    //         if(typeof entry == 'object') {
    //             // entry = { entry: 'pages/index', template: 'src/template.html' }
    //             target.pages[key] = {
    //                 entry: path.resolve(CWD, target.base, entry.entry)
    //                 // template: path.resolve(CWD, entry.template),
    //                 // mock data replacement for server side rendering 
    //                 // mock: entry.mock && path.resolve(CWD, entry.mock),
    //             }
    //         } else {
    //             target.pages[key] = {
    //                 entry: target.pages[key],
    //                 // template: target.template.path,
    //                 // mock data replacement for server side rendering 
    //                 // mock: target.template.mock,
    //             }
    //         }
    //     }
    // }

    if(target.alias_modules) {
        // modules alias
        for(var key in target.alias_modules) {
            target.alias[key] = target.alias_modules[key];
        }
    }

    return target;
}

function isExists(filename) {
    return fs.existsSync(path.resolve(CWD, filename));
}

module.exports = {
    getBreeze: function() {

        if(isExists('breeze.config.js')) {
            var filepath = path.resolve(CWD, 'breeze.config.js');
            var fileContent = fs.readFileSync(filepath, 'utf-8');
            var breeze = requireFromString(fileContent, 'breeze.config.js');
            return extend(default_breeze, breeze);
        }

        if(isExists('breeze.json')) {
            var filepath = path.resolve(CWD, 'breeze.json');
            var fileContent = fs.readFileSync(filepath, 'utf-8');
            var breeze = requireFromString(fileContent, 'breeze.config.js');   
            return extend(default_breeze, breeze);
        }

        return default_breeze;

    },
    hasBreeze: function() {
       return isExists('breeze.config.js') || isExists('breeze.json');
    }
}

