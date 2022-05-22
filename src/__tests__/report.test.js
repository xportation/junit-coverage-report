const { getReport } = require("../report");
const path = require("path");
const { getFileContent } = require("../utils");
const { getJUnitData } = require("../junit");
const { getCoverageData } = require("../coverage");

const loadFile = (filename) => {
  const fullFilename = path.resolve(__dirname, filename);
  return getFileContent(fullFilename);
};

test("Test report", () => {
  const coverageContent = loadFile("data/coverage.xml");
  const coverageData = getCoverageData(coverageContent);
  const junitContent = loadFile("data/junit_failure.xml");
  const junitData = getJUnitData(junitContent);
  const repositoryUrl =
    "https://www.github.com/xportation/junit-coverage-report";

  const reportExpected = loadFile("data/report.html");
  expect(getReport(junitData, coverageData, repositoryUrl)).toBe(
    reportExpected
  );
});

test("Test report single coverage package", () => {
  const coverageContent = loadFile("data/coverage_single_package.xml");
  const coverageData = getCoverageData(coverageContent);
  const junitContent = loadFile("data/junit_success.xml");
  const junitData = getJUnitData(junitContent);
  const repositoryUrl =
    "https://www.github.com/xportation/junit-coverage-report/main";

  const reportExpected = loadFile("data/report_single_package.html");
  expect(getReport(junitData, coverageData, repositoryUrl)).toBe(
    reportExpected
  );
});

test("Test custom report", () => {
  const coverageContent = loadFile("data/coverage_single_package.xml");
  const coverageData = getCoverageData(coverageContent);
  const junitContent = loadFile("data/junit_failure.xml");
  const junitData = getJUnitData(junitContent);
  const customTemplateContent = loadFile("data/custom_template.tmpl");
  const repositoryUrl =
    "https://www.github.com/xportation/junit-coverage-report/main";

  const reportExpected = loadFile("data/custom_report.html");
  expect(getReport(junitData, coverageData, repositoryUrl, customTemplateContent)).toBe(
    reportExpected
  );
});
