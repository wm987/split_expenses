"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _splitExpenses = _interopRequireDefault(require("./splitExpenses"));

var _verifyPayments = _interopRequireDefault(require("./verifyPayments"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var testFiles = [{
  fileName: 'test_inputs/input1.json',
  shouldPrint: true
}, {
  fileName: 'test_inputs/input2.json',
  shouldPrint: true
}, {
  fileName: 'test_inputs/input3.json',
  shouldPrint: true
}, {
  fileName: 'test_inputs/input4.json',
  shouldPrint: true
}, {
  fileName: 'test_inputs/input5.json',
  shouldPrint: true
}];

for (var i = 0; i < testFiles.length; i++) {
  var test = testFiles[i];
  console.log('Checking ', test.fileName);

  var data = _fs["default"].readFileSync(test.fileName);

  var expenses = JSON.parse(data);
  if (test.shouldPrint) console.log(expenses);
  var payAssignments = (0, _splitExpenses["default"])(expenses);
  if (test.shouldPrint) console.log(payAssignments);
  var verificationResult = (0, _verifyPayments["default"])(payAssignments, expenses);

  if (verificationResult) {
    console.log('Passed test case ', test.fileName);
  } else {
    console.log('Failed test case ', test.fileName);
  }
}