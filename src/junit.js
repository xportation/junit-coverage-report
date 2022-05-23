const { XMLParser } = require("fast-xml-parser");
const core = require("@actions/core");
const _ = require("lodash");

const getJUnitData = (fileContent) => {
  const junitXml = parseJunitXml(fileContent);
  if (!junitXml) {
    return null;
  }

  const total = getTotal(junitXml);
  const failures = getFailures(junitXml);
  return { total, failures };
};

const parseJunitXml = (junitContent) => {
  if (!junitContent || !junitContent.length) {
    return null;
  }

  const options = {
    ignoreDeclaration: true,
    ignoreAttributes: false,
  };
  const parser = new XMLParser(options);
  const output = parser.parse(junitContent);

  if (_.isEmpty(output)) {
    core.warning(`Junit file is not XML or not well formed`);
    return null;
  }
  return output;
};

const getTotal = (junitXml) => {
  const testSuite = junitXml.testsuites.testsuite;
  return {
    name: testSuite["@_name"],
    errors: testSuite["@_errors"],
    failures: testSuite["@_failures"],
    skipped: testSuite["@_skipped"],
    tests: testSuite["@_tests"],
    time: testSuite["@_tests"],
    timestamp: testSuite["@_timestamp"],
  };
};

const getFailures = (junitXml) => {
  let failures = [];
  const testSuite = junitXml.testsuites.testsuite;
  for (let i = 0; i < testSuite.testcase.length; i++) {
    const testcase = testSuite.testcase[i];
    if (testcase.failure) {
      const failure = {
        classname: testcase["@_classname"],
        name: testcase["@_name"],
        time: testcase["@_time"],
        failureText: testcase.failure["#text"],
        failureMessage: testcase.failure["@_message"],
      };
      failures.push(failure);
    }
  }
  return failures;
};

module.exports = { getJUnitData };
