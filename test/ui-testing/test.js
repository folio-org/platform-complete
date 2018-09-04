const placeholder = require('./placeholder');

module.exports.test = (uiTestCtx) => {
  const allTests = [
    placeholder
  ];

  allTests.forEach(testModule => testModule.test(uiTestCtx));
};
