// @flow strict

import type ExpenseItem from 'splitExpenses';
import type PayAssignment from 'splitExpenses';


// The main logic of this verification function is that, once all the expenses have been paid,
// the net balance for each person should be 0
export default function verifyPayments(payAssignments: Array<PayAssignment>, expenses: Array<ExpenseItem>): boolean {
  var balance = new Map();

  // Calculate how much each person owes or is owed
  // (This part is the same as the implementation in splitExpenses())
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

  // Make all the payments and calculate everyone's resulting balance
  for (let i=0; i<payAssignments.length; i++) {
    let payment = payAssignments[i];
    let payer = payment.payer;
    let payee = payment.payee;
    let amount = payment.amount;
    balance.set(payer, balance.get(payer) + amount);
    balance.set(payee, balance.get(payee) - amount);
  }

  // Check if everyone's balance is 0
  for (let [person, value] of balance) {
    if (Math.abs(value) > 0.001) { // Allow for small rounding errors in case of large floating point calculations
      return false;
    }
  }
  return true;
}
