const { getJUnitData } = require("./junit");
const { getCoverageData } = require("./coverage");
const { getReport } = require("./report");
const { getFileContent } = require("./utils");
const core = require("@actions/core");
const github = require('@actions/github');
const { addPullRequestComment } = require("./commentator");

const loadFile = (filePath) => {
  if (!filePath) {
    return null;
  }

  filePath = filePath.startsWith("/") ? filePath : `${process.env.GITHUB_WORKSPACE}/${filePath}`;
  return getFileContent(filePath);
}


const getPullRequestFilesUrl = () => {
  const { context, repository } = github;
  const { payload } = context;
  const { repo, owner } = context.repo;
  const _repository = repository || `${owner}/${repo}`
  const commit = payload.pull_request.head.sha;
  return `https://github.com/${_repository}/blob/${commit}`;
}

const generateReport = (junitFileContent, coverageFileContent, customTemplateFileContent) => {
  const repositoryUrl = getPullRequestFilesUrl();
  const coverageData = getCoverageData(coverageFileContent);
  const junitData = getJUnitData(junitFileContent);
  return getReport(junitData, coverageData, repositoryUrl, customTemplateFileContent);
}

const addComment = async (token, report) => {
  const { context } = github;
  const { eventName } = context;
  if (eventName === "pull_request") {
    await addPullRequestComment(token, report);
  }
}

async function main() {
  console.log("--- junit coverage report ---");
  const token = core.getInput("github-token", { required: true });
  const junitPath = core.getInput("junit-path", { required: false });
  const coveragePath = core.getInput("coverage-path", { required: false });
  const templatePath = core.getInput("template-path", { required: false });

  const junitFileContent = loadFile(junitPath);
  const coverageFileContent = loadFile(coveragePath);
  const customTemplateFileContent = loadFile(templatePath);

  const report = generateReport(junitFileContent, coverageFileContent, customTemplateFileContent);
  await addComment(token, report);
}

main().catch((err) => {
  core.error(err);
  core.setFailed(err.message);
});
