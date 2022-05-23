const { XMLParser } = require("fast-xml-parser");
const core = require("@actions/core");
const _ = require("lodash");

const getCoverageData = (fileContent) => {
  const coverageXml = parseCoverageXml(fileContent);
  if (!coverageXml) {
    return null;
  }

  const total = getTotal(coverageXml);
  const coverage = parseXml(coverageXml);
  return { coverage, total };
};

const parseCoverageXml = (coverageContent) => {
  if (!coverageContent || !coverageContent.length) {
    return null;
  }

  const options = {
    ignoreDeclaration: true,
    ignoreAttributes: false,
  };
  const parser = new XMLParser(options);
  const output = parser.parse(coverageContent);

  if (_.isEmpty(output)) {
    core.warning(`Coverage file is not XML or not well formed`);
    return null;
  }
  return output.coverage;
};

const getTotal = (coverageXml) => {
  const cover = floatToInt(coverageXml["@_line-rate"]);
  const linesValid = parseInt(coverageXml["@_lines-valid"]);
  const linesCovered = parseInt(coverageXml["@_lines-covered"]);
  return {
    name: "TOTAL",
    stmts: linesValid,
    miss: linesValid - linesCovered,
    cover: `${cover}%`,
    percentage: cover,
  };
};

const floatToInt = (strValue) => {
  const floatValue = parseFloat(strValue.replace(",", "."));
  return Math.round(floatValue * 100.0);
};

const parseXml = (coverageXml) => {
  let files = [];
  if (Array.isArray(coverageXml.packages.package)) {
    for (let i = 0; i < coverageXml.packages.package.length; i++) {
      const p = coverageXml.packages.package[i];
      parsePackage(p, files);
    }
  } else {
    parsePackage(coverageXml.packages.package, files);
  }
  return files;
};

function parsePackage(p, files) {
  if (Array.isArray(p.classes.class)) {
    for (let j = 0; j < p.classes.class.length; j++) {
      const c = p.classes.class[j];
      files.push(parseClass(c));
    }
  } else {
    files.push(parseClass(p.classes.class));
  }
}

const parseClass = (c) => {
  const { stmts, missing, totalMissing } = parseLines(c.lines);

  const lineRate = c["@_line-rate"];
  const isFullCoverage = lineRate === "1";
  const cover = isFullCoverage ? "100%" : `${floatToInt(lineRate)}%`;

  return {
    name: c["@_filename"],
    stmts: `${stmts}`,
    miss: `${totalMissing}`,
    cover: cover,
    missing: missing,
  };
};

const parseLines = (lines) => {
  let stmts = lines.line.length;
  const missingLines = [];
  for (let i = 0; i < lines.line.length; i++) {
    const line = lines.line[i];
    if (line["@_hits"] === "0") {
      missingLines.push(parseInt(line["@_number"]));
    }
  }
  const missing = missingLines.reduce((arr, val, i, a) => {
    if (!i || val !== a[i - 1] + 1) arr.push([]);
    arr[arr.length - 1].push(val);
    return arr;
  }, []);

  const missingTxt = [];
  for (let i = 0; i < missing.length; i++) {
    const m = missing[i];
    if (m.length === 1) {
      missingTxt.push(`${m[0]}`);
    } else {
      missingTxt.push(`${m[0]}-${m[m.length - 1]}`);
    }
  }
  return {
    stmts,
    missing: missingTxt,
    totalMissing: missingLines.length,
  };
};

module.exports = { getCoverageData };
