'use strict';

const { readJson } = require('../file');
const path = require('path');
const id = 'subsystem';

const { subsystems } = readJson(path.join(process.cwd(), '.tcvrc'));

let validSubsystems = ['build', 'feat', 'fix', 'node'];
if (subsystems) {
  validSubsystems = subsystems;
}

module.exports = {
  id,
  meta: {
    description: 'enforce subsystem validity'
  },
  defaults: {
    subsystems: validSubsystems
  },
  options: {
    subsystems: validSubsystems
  },
  validate: (context, rule) => {
    const subs = rule.options.subsystems;
    const parsed = context.toJSON();
    if (!parsed.subsystems.length) {
      if (!parsed.release && !parsed.working) {
        // Missing subsystem
        context.report({
          id,
          message: 'Missing subsystem.',
          string: parsed.title,
          line: 0,
          column: 0,
          level: 'fail',
          wanted: subs
        });
      } else {
        context.report({
          id,
          message: 'Release commits do not have subsystems',
          string: '',
          level: 'skip'
        });
      }
    } else {
      let failed = false;
      for (const sub of parsed.subsystems) {
        if (!~subs.indexOf(sub)) {
          failed = true;
          // invalid subsystem
          const column = parsed.title.indexOf(sub);
          context.report({
            id: id,
            message: `Invalid subsystem: "${sub}"`,
            string: parsed.title,
            line: 0,
            column: column,
            level: 'fail',
            wanted: subs
          });
        }
      }

      if (!failed) {
        context.report({
          id,
          message: 'valid subsystems',
          string: parsed.subsystems.join(','),
          level: 'pass'
        });
      }
    }
  }
};
