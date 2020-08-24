"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var assert = require('assert').strict;

function spitExpenses(expenses) {
  var balance = new Map(); // Calculate how much each person owes or is owed

  for (var i = 0; i < expenses.length; i++) {
    var item = expenses[i];
    var itemCost = item.item_cost;
    var payer = item.payer;
    var numInvolved = 1 + item.borrowers.length;
    var costPerPerson = item.item_cost / numInvolved;

    if (balance.get(payer) == undefined) {
      balance.set(payer, itemCost - costPerPerson);
    } else {
      balance.set(payer, balance.get(payer) + itemCost - costPerPerson);
    }

    for (var k = 0; k < item.borrowers.length; k++) {
      var borrower = item.borrowers[k];

      if (balance.get(borrower) == undefined) {
        balance.set(borrower, 0 - costPerPerson);
      } else {
        balance.set(borrower, balance.get(borrower) - costPerPerson);
      }
    }
  } // Seperate people into the disjoint sets of debtors and lenders


  var lenders = new Map();
  var debtors = new Map();
  var totalCredit = 0;
  var totalDebt = 0;

  var _iterator = _createForOfIteratorHelper(balance),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
          person = _step$value[0],
          value = _step$value[1];

      console.log(person, ' ', value);

      if (value > 0) {
        lenders.set(person, value);
        totalCredit += value;
      }

      if (value < 0) {
        debtors.set(person, value);
        totalDebt += value; //note: totalDebt is negative
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  assert(totalDebt + totalCredit == 0, "Error: totalDebt + totalCredit != 0"); // Settle debts

  var payAssignments = [];
  var lendersIterator = lenders.entries();
  var debtorsIterator = debtors.entries();
  var currentLenderCursor = lendersIterator.next();
  var currentDebtorCursor = debtorsIterator.next();
  var currentLender = currentLenderCursor.value; // Array [name, value]

  var currentDebtor = currentDebtorCursor.value; // Array [name, value]

  while (totalCredit > 0.001) {
    // Disregard minor rounding errors
    if (currentDebtor == undefined) {
      throw "currentDebtor is undefined. This might be caused by rounding errors produced by excessively large transaction amounts";
    }

    if (currentLender == undefined) {
      throw "currentDebtor is undefined. This might be caused by rounding errors produced by excessively large transaction amounts";
    }

    if (currentDebtor[1] < 0 && currentLender[1] > 0) {
      // assign payment
      var paymentAmount = Math.min(-currentDebtor[1], currentLender[1]);
      assert(paymentAmount > 0, "Error: paymentAmount not positive"); // assert: paymentAmount > 0

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

var _default = spitExpenses;
exports["default"] = _default;