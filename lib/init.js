'use strict';

const { copyTcvrc } = require('./file');

function init() {
  if (copyTcvrc()) {
    console.log('Inited successfully');
    process.exit();
  } else {
    throw new Error('inited failed');
  }
}

module.exports = init;
