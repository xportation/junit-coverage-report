const fs = require("fs");

const getFileContent = (pathToFile) => {
  if (!fs.existsSync(pathToFile)) {
    return null;
  }

  console.log("File to read", pathToFile);
  return fs.readFileSync(pathToFile, "utf8");
};

module.exports = { getFileContent };
