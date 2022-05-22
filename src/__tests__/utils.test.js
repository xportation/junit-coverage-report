const path = require("path");
const { getFileContent } = require("../utils");

test("Test load missing file", () => {
  const missingFilename = path.resolve(__dirname, "data/missing.xml");
  const nullContent = getFileContent(missingFilename);
  expect(nullContent).toBeNull();
});

test("Test null/undefined/empty filename", () => {
  expect(getFileContent("")).toBeNull();
  expect(getFileContent("abc")).toBeNull();
  expect(getFileContent(null)).toBeNull();
  expect(getFileContent(undefined)).toBeNull();
});
