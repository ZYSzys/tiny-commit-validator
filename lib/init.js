'use strict';

const { copyTvcrc } = require('./file');

function init() {
  if (copyTvcrc()) {
    console.log('Inited successfully');
    process.exit();
  } else {
    throw new Error('inited failed');
  }
}

module.exports = init;
