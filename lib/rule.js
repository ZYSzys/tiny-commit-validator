'use strict';

class Rule {
  constructor(opts) {
    opts = {
      options: {},
      defaults: {},
      meta: {},
      ...opts
    };

    if (!opts.id) {
      throw new Error('Rule must have an id');
    }

    if (typeof opts.validate !== 'function') {
      throw new Error('Rule must have validate function');
    }

    this.id = opts.id;
    this.disabled = opts.disbaled === true;
    this.meta = opts.meta;
    this.defaults = { ...opts.defaults };
    this.options = { ...opts.defaults, ...opts.options };
    this._validate = opts.validate;
  }

  validate(commit) {
    this._validate(commit, this);
  }
}

module.exports = Rule;
