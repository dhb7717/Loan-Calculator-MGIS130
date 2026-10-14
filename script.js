/*
 * Data layer: reads and validates values entered by the user.
 * Processing layer: calculates monthly payment and totals.
 * Presentation layer: displays results and validation messages in the page.
 */

"use strict";

const loanForm = document.querySelector("#loan-form");
const amountInput = document.querySelector("#loan-amount");
const rateInput = document.querySelector("#interest-rate");
const termInput = document.querySelector("#loan-term");
const errorMessage = document.querySelector("#error-message");

const monthlyPaymentOutput = document.querySelector("#monthly-payment");
const totalPaymentOutput = document.querySelector("#total-payment");
const totalInterestOutput = document.querySelector("#total-interest");

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

// DATA LAYER: read form values and check that they fall within accepted limits.
function readLoanData() {
  const amount = Number(amountInput.value);
  const annualRate = Number(rateInput.value);
  const years = Number(termInput.value);

  if (amountInput.value.trim() === "" || !Number.isFinite(amount) || amount <= 0 || amount > 1_000_000_000) {
    return { error: "Enter a loan amount greater than $0 and no more than $1,000,000,000.", field: amountInput };
  }

  if (rateInput.value.trim() === "" || !Number.isFinite(annualRate) || annualRate < 0 || annualRate > 100) {
    return { error: "Enter an annual interest rate from 0% to 100%.", field: rateInput };
  }

  if (termInput.value.trim() === "" || !Number.isInteger(years) || years < 1 || years > 50) {
    return { error: "Enter a whole-number loan term from 1 to 50 years.", field: termInput };
  }

  return { data: { amount, annualRate, years } };
}

// PROCESSING LAYER: use the standard amortizing-loan payment formula.
// For zero interest, divide the principal evenly across all monthly payments.
function calculateLoan(loan) {
  const numberOfPayments = loan.years * 12;
  const monthlyRate = loan.annualRate / 100 / 12;

  let monthlyPayment;
  if (monthlyRate === 0) {
    monthlyPayment = loan.amount / numberOfPayments;
  } else {
    const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments);
    monthlyPayment = loan.amount * (monthlyRate * rateFactor) / (rateFactor - 1);
  }

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = Math.max(0, totalPayment - loan.amount);

  return { monthlyPayment, totalPayment, totalInterest };
}

// PRESENTATION LAYER: update visible output without putting calculation logic in the UI.
function displayResults(results) {
  monthlyPaymentOutput.textContent = moneyFormatter.format(results.monthlyPayment);
  totalPaymentOutput.textContent = moneyFormatter.format(results.totalPayment);
  totalInterestOutput.textContent = moneyFormatter.format(results.totalInterest);
}

function clearValidation() {
  errorMessage.textContent = "";
  [amountInput, rateInput, termInput].forEach((input) => {
    input.removeAttribute("aria-invalid");
  });
}

loanForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearValidation();

  const loanResult = readLoanData();
  if (loanResult.error) {
    errorMessage.textContent = loanResult.error;
    loanResult.field.setAttribute("aria-invalid", "true");
    loanResult.field.focus();
    return;
  }

  const results = calculateLoan(loanResult.data);
  displayResults(results);
});

// Show an initial estimate using the example values already in the form.
const initialLoan = readLoanData();
if (initialLoan.data) {
  displayResults(calculateLoan(initialLoan.data));
}
