// @flow strict

import fs from 'fs';
import splitExpenses from './splitExpenses';
import verifyPayments from './verifyPayments';

const testFiles = [
  {
    fileName: 'test_inputs/input1.json',
    shouldPrint: true
  },
  {
    fileName: 'test_inputs/input2.json',
    shouldPrint: true
  },
  {
    fileName: 'test_inputs/input3.json',
    shouldPrint: true
  },
  {
    fileName: 'test_inputs/input4.json',
    shouldPrint: true
  },
  {
    fileName: 'test_inputs/input5.json',
    shouldPrint: true
  },
];

for (let i = 0; i<testFiles.length; i++) {
  let test = testFiles[i];
  console.log('Checking ', test.fileName);
  let data = fs.readFileSync(test.fileName);
  let expenses = JSON.parse(data);
  if (test.shouldPrint) console.log(expenses);

  let payAssignments = splitExpenses(expenses);

  if (test.shouldPrint) console.log(payAssignments);

  let verificationResult = verifyPayments(payAssignments, expenses);
  if (verificationResult) {
    console.log('Passed test case ', test.fileName);
  } else {
    console.log('Failed test case ', test.fileName);
  }
}
