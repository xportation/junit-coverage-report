const fs = require("fs");

const getFileContent = (pathToFile) => {
  if (!fs.existsSync(pathToFile)) {
    return null;
  }

  return fs.readFileSync(pathToFile, "utf8");
};

module.exports = { getFileContent };
