'use strict';

const { test } = require('tap');
const Validator = require('../lib');

const failedStr = `commit 7d3a7ea0d7df9b6f11df723dec370f49f4f87e99
Author: ZYSzys <zhangyongsheng@youzan.com>
Date:   Sun Aug 18 10:10:46 2019 -0600
    test: test test.
`;

const passedStr = `commit 7d3a7ea0d7df9b6f11df723dec370f49f4f87e99
Author: ZYSzys <zhangyongsheng@youzan.com>
Date:   Sun Aug 18 10:10:46 2019 -0600
    build: test test.
`;

test('Validator', (t) => {
  t.test('fail', (tt) => {
    const v = new Validator();
    v.lint(failedStr);
    v.on('commit', (data) => {
      const msgs = data.messages;
      const filtered = msgs.filter((item) => {
        return item.level === 'fail';
      });
      tt.equal(filtered.length, 1, 'messages.length');
      tt.end();
    });
  });

  t.test('pass', (tt) => {
    const v = new Validator();
    v.lint(passedStr);
    v.on('commit', (data) => {
      const msgs = data.messages;
      const filtered = msgs.filter((item) => {
        return item.level === 'pass';
      });
      console.log(filtered);
      tt.equal(filtered.length, 0, 'messages.length');
      tt.end();
    });
  });

  t.end();
});
