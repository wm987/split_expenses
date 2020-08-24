"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = verifyPayments;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// The main logic of this verification function is that, once all the expenses have been paid,
// the net balance for each person should be 0
function verifyPayments(payAssignments, expenses) {
  var balance = new Map(); // Calculate how much each person owes or is owed
  // (This part is the same as the implementation in splitExpenses())

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
  } // Make all the payments and calculate everyone's resulting balance


  for (var _i = 0; _i < payAssignments.length; _i++) {
    var payment = payAssignments[_i];
    var _payer = payment.payer;
    var payee = payment.payee;
    var amount = payment.amount;
    balance.set(_payer, balance.get(_payer) + amount);
    balance.set(payee, balance.get(payee) - amount);
  } // Check if everyone's balance is 0


  var _iterator = _createForOfIteratorHelper(balance),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
          person = _step$value[0],
          value = _step$value[1];

      if (Math.abs(value) > 0.001) {
        // Allow for small rounding errors in case of large floating point calculations
        return false;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return true;
}