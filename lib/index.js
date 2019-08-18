'use strict';

const EE = require('events');
const Parser = require('gitlint-parser-node');
const BaseRule = require('./rule');
const RULES = require('./rules');

class Validator extends EE {
  constructor(options) {
    super();

    this.options = { ...options };
    this.messages = new Map();
    this.errors = 0;

    this.rules = new Map();
    this.loadBaseRules();
  }

  loadBaseRules() {
    for (const key of Object.keys(RULES)) {
      this.rules.set(key, new BaseRule(RULES[key]));
    }
    // Todo: disable ability
    // this.disableRule(id);
  }

  // disableRule()
  lint(str) {
    if (Array.isArray(str)) {
      for (const item of str) {
        this.lint(item);
      }
    } else {
      const commit = new Parser(str, this);
      for (const rule of this.rules.values()) {
        if (rule.disabled) continue;
        rule.validate(commit);
      }

      setImmediate(() => {
        this.emit('commit', {
          commit: commit,
          messages: this.messages.get(commit.sha) || []
        });
      });
    }
  }

  report(opts) {
    const { commit, data } = opts;
    const sha = commit.sha;
    if (!sha) {
      throw new Error('Invalid report. Missing commit sha');
    }

    if (opts.data.level === 'fail') this.errors++;
    const ar = this.messages.get(sha) || [];
    ar.push(opts.data);
    this.messages.set(sha, ar);
    setImmediate(() => {
      this.emit('message', opts);
    });
  }
}

module.exports = Validator;
