#!/usr/bin/env node
'use strict';

const { exec, execSync } = require('child_process');
const yargs = require('yargs');
const chalk = require('chalk');
const Validator = require('../lib');
const pretty = require('../lib/pretty');
const utils = require('../lib/utils');
const subsystem = require('../lib/rules/subsystem')

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

const validator = new Validator(argv);

if (argv.list) {
  const rules = Array.from(validator.rules.keys());
  const maxLength = rules.reduce((l, item) => {
    return Math.max(l, item.length);
  }, 0);

  for (const rule of validator.rules.values()) {
    utils.describeRule(rule, maxLength);
  }
  return;
}

if (argv['list-subsystems']) {
  utils.describeSubsystem(subsystem.defaults.subsystems.sort());
  return;
}

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
        execSync('git reset --soft HEAD~');
        console.log(chalk.red('Please reedit your commit message'));
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
