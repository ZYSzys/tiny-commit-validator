'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

exports.appendFile = function(file, content) {
  const parts = path.parse(file);
  if (!fs.existsSync(parts.dir)) {
    mkdirp.sync(parts.dir);
  }
  // TODO: what if the file is a dir?
  fs.appendFileSync(file, content, 'utf8');
};

exports.writeFile = function(file, content) {
  const parts = path.parse(file);
  if (!fs.existsSync(parts.dir)) {
    mkdirp.sync(parts.dir);
  }
  // TODO: what if the file is a dir?
  fs.writeFileSync(file, content, 'utf8');
};

exports.writeJson = function(file, obj) {
  exports.writeFile(file, JSON.stringify(obj, null, 2));
};

exports.readFile = function(file) {
  if (fs.existsSync(file)) {
    return fs.readFileSync(file, 'utf8');
  }
  return '';
};

exports.readJson = function(file) {
  const content = exports.readFile(file);
  if (content) {
    return JSON.parse(content);
  }
  return {};
};

exports.copyTvcrc = function() {
  const src = path.join(__dirname, '.tvcrc');
  const dest = path.join(process.cwd(), '.tvcrc');
  try {
    fs.copyFileSync(src, dest)
    return true;
  } catch (e) {
    throw e;
    return false;
  }
}

exports.existsTvcrc = function() {
  const tvcrc = path.join(process.cwd(), '.tvcrc');
  return fs.existsSync(tvcrc);
}
