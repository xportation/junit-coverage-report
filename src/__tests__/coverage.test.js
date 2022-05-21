const { getCoverageData } = require("../coverage");
const { getFileContent } = require("../utils");
const path = require("path");

const loadFile = (filename) => {
  const coverageFilename = path.resolve(__dirname, filename);
  return getFileContent(coverageFilename);
};

test("Test coverage total", () => {
  const coverageContent = loadFile("data/coverage.xml");
  const coverageData = getCoverageData(coverageContent);

  const total = {
    name: "TOTAL",
    stmts: 2046,
    miss: 222,
    cover: "89%",
    percentage: 89,
  };
  expect(coverageData.total).toEqual(total);
  expect(coverageData.coverage).toHaveLength(38);
});

test("Test coverage items", () => {
  const coverageContent = loadFile("data/coverage.xml");
  const coverageData = getCoverageData(coverageContent);

  const item00 = {
    name: "controllers/controller06.py",
    stmts: "17",
    miss: "0",
    cover: "100%",
    missing: [],
  };

  const item17 = {
    name: "handlers/handler02.py",
    stmts: "11",
    miss: "11",
    cover: "0%",
    missing: ["1-3", "6-8", "11-12", "14-16"],
  };
  expect(coverageData.coverage[0]).toEqual(item00);
  expect(coverageData.coverage[17]).toEqual(item17);
});

test("Test missing file result is null", () => {
  const coverageContent = loadFile("data/missing_file.xml");
  const coverageData = getCoverageData(coverageContent);
  expect(coverageData).toBeNull();
});

test("Test coverage items single package", () => {
  const coverageContent = loadFile("data/coverage_single_package.xml");
  const coverageData = getCoverageData(coverageContent);
  expect(coverageData.coverage).toHaveLength(2);
});
