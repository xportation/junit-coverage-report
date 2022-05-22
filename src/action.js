const { getJUnitData } = require("./junit");
const { getCoverageData } = require("./coverage");
const { getUnitReport, getCoverageReport } = require("./report");
const core = require("@actions/core");
const { getFileContent } = require("./utils");

async function main() {
  console.log("--- junit coverage report ---");

  const junitFileContent = getFileContent(
    core.getInput("junit-path", {
      required: false,
    })
  );

  const coverageFileContent = getFileContent(
    core.getInput("coverage-path", {
      required: false,
    })
  );

  const customTemplate = getFileContent(
    core.getInput("template-path", {
      required: false,
    })
  );

  console.log(customTemplate);
  console.log(getJUnitData(junitFileContent));
  console.log(getCoverageData(coverageFileContent));
  console.log(getUnitReport());
  console.log(getCoverageReport());
}

main().catch((err) => {
  core.error(err);
  core.setFailed(err.message);
});
