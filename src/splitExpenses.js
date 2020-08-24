// @flow strict

const assert = require('assert').strict;

export type ExpenseItem = {
  payer: string,
  item_cost: number,
  item_name: string,
  borrowers: Array<string>
}

export type PayAssignment = {
  payer: string,
  amount: number,
  payee: string
}

function spitExpenses(expenses: Array<ExpenseItem>): Array<PayAssignment> {

  var balance = new Map();

  // Calculate how much each person owes or is owed
  for (let i=0; i<expenses.length; i++) {
    let item = expenses[i];
    let itemCost = item.item_cost;
    let payer = item.payer;
    let numInvolved = 1 + item.borrowers.length;
    let costPerPerson = item.item_cost / numInvolved;

    if (balance.get(payer) == undefined) {
      balance.set(payer, itemCost - costPerPerson);
    } else {
      balance.set(payer, balance.get(payer) + itemCost - costPerPerson);
    }

    for (let k=0; k<item.borrowers.length; k++) {
      let borrower = item.borrowers[k];
      if (balance.get(borrower) == undefined) {
        balance.set(borrower, 0 - costPerPerson);
      } else {
        balance.set(borrower, balance.get(borrower) - costPerPerson);
      }
    }
  }

  // Seperate people into the disjoint sets of debtors and lenders
  var lenders = new Map();
  var debtors = new Map();
  var totalCredit = 0;
  var totalDebt = 0;
  for (let [person, value] of balance) {
    if (value > 0) {
      lenders.set(person, value);
      totalCredit += value;
    }
    if (value < 0) {
      debtors.set(person, value);
      totalDebt += value; //note: totalDebt is negative
    }
  }

  assert(totalDebt + totalCredit == 0, "Error: totalDebt + totalCredit != 0");

  // Settle debts
  var payAssignments: Array<PayAssignment> = [];

  var lendersIterator = lenders.entries();
  var debtorsIterator = debtors.entries();

  var currentLenderCursor = lendersIterator.next();
  var currentDebtorCursor = debtorsIterator.next();

  var currentLender = currentLenderCursor.value; // Array [name, value]
  var currentDebtor = currentDebtorCursor.value; // Array [name, value]

  while (totalCredit > 0.001) { // Disregard minor rounding errors
    if (currentDebtor == undefined) {
      throw "currentDebtor is undefined. This might be caused by rounding errors produced by excessively large transaction amounts";
    }
    if (currentLender == undefined) {
      throw "currentDebtor is undefined. This might be caused by rounding errors produced by excessively large transaction amounts";
    }

    if (currentDebtor[1] < 0 && currentLender[1] > 0) {
      // assign payment
      let paymentAmount = Math.min(-currentDebtor[1], currentLender[1]);
      assert(paymentAmount > 0, "Error: paymentAmount not positive")
      // assert: paymentAmount > 0
      currentDebtor[1] += paymentAmount;
      currentLender[1] -= paymentAmount;

      lenders.set(currentDebtor[0], currentDebtor[1]);
      lenders.set(currentLender[0], currentLender[1]);

      totalCredit -= paymentAmount;

      payAssignments.push({
        payer: currentDebtor[0],
        amount: paymentAmount,
        payee: currentLender[0]
      });
    }
    if (currentDebtor[1] >= 0) {
      currentDebtorCursor = debtorsIterator.next();
      currentDebtor = currentDebtorCursor.value;
    }
    if (currentLender[1] <= 0) {
      currentLenderCursor = lendersIterator.next();
      currentLender = currentLenderCursor.value;
    }
  }

  return payAssignments;
}

export default spitExpenses;
