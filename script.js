
/*
 * Data layer: reads and validates user input.
 * Processing layer: calculates monthly payments and totals.
 * Presentation layer: displays results and error messages.
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

const loanInputs = [amountInput, rateInput, termInput];

// DATA LAYER: validate input before using it.
function readLoanData() {
  const amountText = amountInput.value.trim();
  const rateText = rateInput.value.trim();
  const termText = termInput.value.trim();

  const amount = Number(amountText);
  const annualRate = Number(rateText);
  const years = Number(termText);

  if (
    amountText === "" ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > 1_000_000_000
  ) {
    return {
      error: "Enter a loan amount greater than $0 and no more than $1,000,000,000.",
      field: amountInput
    };
  }

  if (
    rateText === "" ||
    !Number.isFinite(annualRate) ||
    annualRate < 0 ||
    annualRate > 100
  ) {
    return {
      error: "Enter an annual interest rate from 0% to 100%.",
      field: rateInput
    };
  }

  if (
    termText === "" ||
    !Number.isInteger(years) ||
    years < 1 ||
    years > 50
  ) {
    return {
      error: "Enter a whole-number loan term from 1 to 50 years.",
      field: termInput
    };
  }

  return { data: { amount, annualRate, years } };
}

// PROCESSING LAYER: calculate the loan payment and total costs.
function calculateLoan(loan) {
  const numberOfPayments = loan.years * 12;
  const monthlyRate = loan.annualRate / 100 / 12;

  let monthlyPayment;

  if (monthlyRate === 0) {
    monthlyPayment = loan.amount / numberOfPayments;
  } else {
    const rateFactor = Math.pow(1 + monthlyRate, numberOfPayments);

    monthlyPayment =
      loan.amount *
      (monthlyRate * rateFactor) /
      (rateFactor - 1);
  }

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = Math.max(0, totalPayment - loan.amount);

  // Prevent invalid numeric results from being displayed.
  if (
    !Number.isFinite(monthlyPayment) ||
    !Number.isFinite(totalPayment) ||
    !Number.isFinite(totalInterest)
  ) {
    throw new Error("The calculation produced an invalid result.");
  }

  return { monthlyPayment, totalPayment, totalInterest };
}

// PRESENTATION LAYER: display valid results.
function displayResults(results) {
  monthlyPaymentOutput.textContent =
    moneyFormatter.format(results.monthlyPayment);

  totalPaymentOutput.textContent =
    moneyFormatter.format(results.totalPayment);

  totalInterestOutput.textContent =
    moneyFormatter.format(results.totalInterest);
}

// Clear old results so invalid input cannot leave a misleading estimate.
function clearResults() {
  monthlyPaymentOutput.textContent = "—";
  totalPaymentOutput.textContent = "—";
  totalInterestOutput.textContent = "—";
}

// Remove old validation messages and field warnings.
function clearValidation() {
  errorMessage.textContent = "";

  loanInputs.forEach((input) => {
    input.removeAttribute("aria-invalid");
  });
}

// Show an error and focus the field that needs attention.
function showError(message, field = null) {
  clearResults();
  errorMessage.textContent = message;

  if (field) {
    field.setAttribute("aria-invalid", "true");
    field.focus();
  }
}

// Revalidate naturally as the user corrects a flagged field.
loanInputs.forEach((input) => {
  input.addEventListener("input", () => {
    input.removeAttribute("aria-invalid");
    errorMessage.textContent = "";
  });
});

// Handle form submission safely.
loanForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearValidation();

  try {
    const loanResult = readLoanData();

    if (loanResult.error) {
      showError(loanResult.error, loanResult.field);
      return;
    }

    const results = calculateLoan(loanResult.data);
    displayResults(results);
  } catch (error) {
    console.error("Loan calculator error:", error);

    showError(
      "Sorry, the payment could not be calculated. Check your entries and try again."
    );
  }
});

// Display an initial estimate when the default values are valid.
try {
  const initialLoan = readLoanData();

  if (initialLoan.data) {
    displayResults(calculateLoan(initialLoan.data));
  } else {
    clearResults();
  }
} catch (error) {
  console.error("Initial loan calculation error:", error);
  clearResults();
}
