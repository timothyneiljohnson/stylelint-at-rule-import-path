'use strict';

const assign = require('object-assign');
const stylelint = require('stylelint');
const ruleName = 'at-rule-import-path';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejectedUnderscore: 'Avoid leading underscores in import statements',
  rejectedExtension: 'Avoid file extensions in import statements'
});

const arrayContains = (searchItem, array) =>
  array.indexOf(searchItem) > -1;

module.exports = stylelint.createPlugin(ruleName, (enabled, options) =>
  (root, result) => {
    const opts = options || {};
    const hasOptions = Object.getOwnPropertyNames(opts).length > 0;
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: enabled,
      possible: [true, false]
    }, {
      actual: options,
      possible: {
        allowUnderscore: [true, false],
        allowExtension: [true, false]
      },
      optional: true
    });

    const checkForImportStatement = (atRule) => {
      if (atRule.name !== 'import') { return; }

      const params = atRule.params.replace(/'|"/g, '');
      let fileName = '';
      let importPathParts = [];

      if (params.indexOf('/') > -1) {
        importPathParts = params.split('/');
        fileName = importPathParts[importPathParts.length - 1];
      } else {
        fileName = params;
      }

      if (enabled && (!hasOptions || (hasOptions && !opts.allowUnderscore)) &&
        fileName.substring(0, 1) === '_') {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: atRule,
          message: messages.rejectedUnderscore
        });
      }
      if (enabled && (!hasOptions || (hasOptions && !opts.allowExtension)) &&
        fileName.indexOf('.') > -1) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: atRule,
          message: messages.rejectedExtension
        });
      }
    };

    if (!validOptions) {
      return;
    }

    root.walkAtRules(checkForImportStatement);
  }
);

module.exports.ruleName = ruleName;
module.exports.messages = messages;
