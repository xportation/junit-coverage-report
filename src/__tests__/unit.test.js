const { getJUnitData } = require("../junit");
const path = require("path");
const { getFileContent } = require("../utils");

const loadFile = (filename) => {
  const junitFilename = path.resolve(__dirname, filename);
  return getFileContent(junitFilename);
};

test("Test junit success", () => {
  const junitContent = loadFile("data/junit_success.xml");
  const junitData = getJUnitData(junitContent);

  const total = {
    name: "pytest",
    errors: "0",
    failures: "0",
    skipped: "0",
    tests: "96",
    time: "96",
    timestamp: "2022-05-15T21:47:44.406170",
  };
  expect(junitData.total).toEqual(total);
  expect(junitData.failures).toHaveLength(0);
});

test("Test junit failure", () => {
  const junitContent = loadFile("data/junit_failure.xml");
  const junitData = getJUnitData(junitContent);

  const total = {
    name: "pytest",
    errors: "0",
    failures: "4",
    skipped: "0",
    tests: "96",
    time: "96",
    timestamp: "2022-05-15T21:50:52.356117",
  };
  expect(junitData.total).toEqual(total);
  expect(junitData.failures).toHaveLength(4);
});

test("Test junit failures", () => {
  const junitContent = loadFile("data/junit_failure.xml");
  const junitData = getJUnitData(junitContent);

  const failures = [
    {
      name: "test_billing_charge_period",
      failureMessage: "ValueError: day is out of range for month",
    },
    {
      name: "test_billing_charges",
      failureMessage:
        "AssertionError: used&#10;assert 21 == 20&#10;  +21&#10;  -20",
    },
    {
      name: "test_user_phone_nine_digits_format",
      failureMessage:
        "AssertionError: assert '5548991698418' == '55489916984182'&#10;  - 55489916984182&#10;  ?              -&#10;  + 5548991698418",
    },
    {
      name: "test_course_backup_delete_notifies_first",
      failureMessage: "assert 1 == 2&#10;  +1&#10;  -2",
    },
  ];

  for (let i = 0; i < 4; i++) {
    const failure = junitData.failures[i];
    const expected = failures[i];
    expect(failure.name).toEqual(expected.name);
    expect(failure.failureMessage).toEqual(expected.failureMessage);

    expect(failure.classname).toBeTruthy();
    expect(failure.time).toBeTruthy();
    expect(failure.failureText).toBeTruthy();
  }
});

test("Test missing file result is null", () => {
  const junitContent = loadFile("data/missing_file.xml");
  const junitData = getJUnitData(junitContent);
  expect(junitData).toBeNull();
});
