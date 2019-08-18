#!/usr/bin/env node
'use strict';

const { exec, execSync } = require('child_process');
const yargs = require('yargs');
const Validator = require('../lib');
const pretty = require('../lib/pretty');

const argv = yargs
  .usage('Validate commit message.\nUsage: $0 sha')
  .alias('h', 'help')
  .alias('v', 'version')
  .option('l', {
    alias: 'list',
    describe: 'Show all rules',
    type: 'boolean'
  })
  .option('s', {
    alias: 'list-subsystems',
    describe: 'Show all valid subsystems',
    type: 'boolean'
  })
  .command({
    command: 'init',
    desc: 'Init configuration',
    builder: () => {},
    handler: () => require('../lib/init')()
  })
  .argv;

if (argv.list) {
  return;
}

if (argv['list-subsystems']) {
  return;
}

const validator = new Validator(argv);
validator.on('commit', c => {
  pretty(c.commit, c.messages, validator);
  run();
});

const args = argv._;
if (!args.length) {
  args.push('HEAD');
}

function run() {
  if (!args.length) {
    process.exitCode = validator.errors;
    if (validator.errors > 0) {
      process.on('exit', () => {
        // execSync('git commit --amend');
        console.log('need to change commit message');
      });
    }
    return;
  }
  const sha = args.shift();

  exec(`git show --quiet --format=medium ${sha}`, (err, stdout, stderr) => {
    if (err) throw err; // cb(err)
    validator.lint(stdout.trim());
  });
}

run();
