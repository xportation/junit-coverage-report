const Handlebars = require("handlebars");
const urlJoin = require("proper-url-join");
const _ = require("lodash");

const template =
  "{{#if coverage}}" +
  "<img alt=\"Coverage\" src=\"{{coverage.badge}}\" />" +
  "<br/>" +
  "<details>" +
  "    <summary>Coverage Report</summary>" +
  "    <table>" +
  "        <tr>" +
  "            <th>File</th>" +
  "            <th>Stmts</th>" +
  "            <th>Miss</th>" +
  "            <th>Cover</th>" +
  "            <th>Missing</th>" +
  "        </tr>" +
  "        <tbody>" +
  "            {{#coverage.items}}" +
  "            <tr>" +
  "                <td><a href=\"{{fileUrl}}\">{{filename}}</a></td>" +
  "                <td>{{stmts}}</td>" +
  "                <td>{{miss}}</td>" +
  "                <td>{{cover}}</td>" +
  "                <td>" +
  "                {{#missing}}" +
  "                    <a href=\"{{url}}\">{{range}}</a> " +
  "                {{/missing}}" +
  "                </td>" +
  "            </tr>" +
  "            {{/coverage.items}}" +
  "            <tr>" +
  "                <td><b>TOTAL</b></td>" +
  "                <td><b>{{coverage.total.stmts}}</b></td>" +
  "                <td><b>{{coverage.total.miss}}</b></td>" +
  "                <td><b>{{coverage.total.cover}}</b></td>" +
  "                <td>&nbsp;</td>" +
  "            </tr>" +
  "        </tbody>" +
  "    </table>" +
  "</details>" +
  "<br/> " +
  "{{/if}}" +
  "{{#if junit}}" +
  "<table>" +
  "    <tbody>" +
  "        <tr>" +
  "            <td><strong>Tests</strong></td>" +
  "            <td><strong>Skipped</strong></td>" +
  "            <td><strong>Failures</strong></td>" +
  "            <td><strong>Errors</strong></td>" +
  "            <td><strong>Time</strong></td>" +
  "        </tr>" +
  "        <tr>" +
  "            <td>{{junit.tests}}</td>" +
  "            <td>{{junit.skipped}} 💤</td>" +
  "            <td>{{junit.failures}} ❌</td>" +
  "            <td>{{junit.errors}} 🔥</td>" +
  "            <td>{{junit.time}} ⏱</td>" +
  "        </tr>" +
  "    </tbody>" +
  "</table>" +
  "<br/>" +
  "{{#if junit.failuresItems}}" +
  "<details>" +
  "    <summary>Unit Failures</summary>" +
  "    <table>" +
  "        <tr>" +
  "            <th>Test</th>" +
  "            <th>Message</th>" +
  "        </tr>" +
  "        <tbody>" +
  "            {{#junit.failuresItems}}" +
  "            <tr>" +
  "                <td>{{filename}}</td>" +
  "                <td><code>{{{message}}}</code></td>" +
  "            </tr>" +
  "            {{/junit.failuresItems}}" +
  "        </tbody>" +
  "    </table>" +
  "</details>" +
  "{{/if}}" +
  "{{/if}}";

const buildCoverageMissingCoverageLines = (missing, fileUrl) => {
  return missing.map((range) => {
    const [start, end = start] = range.split("-");
    const fragment = start === end ? `L${start}` : `L${start}-L${end}`;
    const url = `${fileUrl}#${fragment}`;
    return { range, url };
  });
};

const buildCoverageBadgeUrl = (percentage) => {
  let color;
  if (percentage >= 90) color = "brightgreen";
  else if (percentage >= 80) color = "green";
  else if (percentage >= 60) color = "yellow";
  else if (percentage >= 40) color = "orange";
  else color = "red";

  return `https://img.shields.io/badge/Coverage-${percentage}%25-${color}.svg`;
};

const buildCoverageInfo = (coverageData, repositoryUrl) => {
  if (_.isEmpty(coverageData)) {
    return {}
  }
  const badge = buildCoverageBadgeUrl(coverageData.total.percentage);
  const total = {
    stmts: coverageData.total.stmts,
    miss: coverageData.total.miss,
    cover: coverageData.total.cover
  };
  let items = [];
  for (let i = 0; i < coverageData.coverage.length; i++) {
    const item = coverageData.coverage[i];
    const fileUrl = urlJoin(repositoryUrl, item.name);
    const filename = item.name;
    const stmts = item.stmts;
    const miss = item.miss;
    const cover = item.cover;
    const missing = buildCoverageMissingCoverageLines(item.missing, fileUrl);
    items.push({ fileUrl, filename, stmts, miss, cover, missing });
  }
  return { badge, total, items };
};

const buildJunitInfo = (junitData) => {
  if (_.isEmpty(junitData)) {
    return {}
  }
  const tests = junitData.total.tests;
  const skipped = junitData.total.skipped;
  const failures = junitData.total.failures;
  const errors = junitData.total.errors;
  const time = junitData.total.time;
  let failuresItems = [];
  for (let i = 0; i < junitData.failures.length; i++) {
    const failure = junitData.failures[i];
    const filename = failure.name;
    const message = failure.failureMessage.replaceAll("&#10", "<br/>");
    failuresItems.push({ filename, message });
  }
  return { tests, skipped, failures, errors, time, failuresItems };
};

const getReport = (junitData, coverageData, repositoryUrl, templateContent) => {
  let coverage;
  if (coverageData) {
    coverage = buildCoverageInfo(coverageData, repositoryUrl);
  }
  let junit;
  if (junitData) {
    junit = buildJunitInfo(junitData);
  }

  let render;
  if (templateContent) {
    render = Handlebars.compile(templateContent);
  } else {
    render = Handlebars.compile(template);
  }
  return render({ coverage, junit });
};

module.exports = { getReport };
