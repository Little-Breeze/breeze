const path = require("path");
const Module = require("module");
const process = require("process");
const CWD = process.cwd();

function getPath(...paths) {
  return paths.reduce((total, curValue) => {
    return path.resolve(total, curValue);
  }, path.resolve(CWD));
}

function requireFromString(code, filename, opts) {
  if (typeof filename === "object") {
    opts = filename;
    filename = undefined;
  }

  opts = opts || {};
  filename = filename || "";

  opts.appendPaths = opts.appendPaths || [];
  opts.prependPaths = opts.prependPaths || [];

  if (typeof code !== "string") {
    throw new Error("code must be a string, not " + typeof code);
  }

  var paths = Module._nodeModulePaths(path.dirname(filename));

  var parent = module.parent;
  var m = new Module(filename, parent);
  m.filename = filename;
  m.paths = []
    .concat(opts.prependPaths)
    .concat(paths)
    .concat(opts.appendPaths);
  m._compile(code, filename);

  var exports = m.exports;
  parent &&
    parent.children &&
    parent.children.splice(parent.children.indexOf(m), 1);

  return exports;
}

module.exports = {
  getPath,
  requireFromString
};
