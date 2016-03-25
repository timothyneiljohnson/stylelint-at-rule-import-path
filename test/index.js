const ruleTester = require('stylelint-rule-tester');
var atRuleImportNoUnderscore = require('..');

const messages = atRuleImportNoUnderscore.messages;
const testRule = ruleTester(atRuleImportNoUnderscore.rule, atRuleImportNoUnderscore.ruleName);

const basics = (tr) => {
  tr.ok('');
  tr.ok('a {}');
  tr.ok('a { top: 0; }');
};

testRule(true, (tr) => {
  basics(tr);

  tr.notOk('@import "_foo";', messages.rejectedUnderscore);
  tr.notOk('@import "path/_foo";', messages.rejectedUnderscore);
  tr.notOk('@import "foo.scss";', messages.rejectedExtension);
  tr.notOk('@import "path/foo.scss";', messages.rejectedExtension);
  tr.ok('@import "foo";');
  tr.ok('@import "path/foo";');

  tr.notOk('@import \'_foo\';', messages.rejectedUnderscore);
  tr.notOk('@import \'path/_foo\';', messages.rejectedUnderscore);
  tr.notOk('@import \'foo.scss\';', messages.rejectedExtension);
  tr.notOk('@import \'path/foo.scss\';', messages.rejectedExtension);
  tr.ok('@import \'foo\';');
  tr.ok('@import \'path/foo\';');
});

testRule(true, { allowUnderscore: true }, (tr) => {
  basics(tr);

  tr.ok('@import "_foo";');
  tr.ok('@import "path/_foo";');
  tr.ok('@import \'_foo\';');
  tr.ok('@import \'path/_foo\';');
});

testRule(true, { allowExtension: true }, (tr) => {
  basics(tr);

  tr.ok('@import "foo.scss";');
  tr.ok('@import "path/foo.scss";');
  tr.ok('@import \'foo.scss\';');
  tr.ok('@import \'path/foo.scss\';');
});

