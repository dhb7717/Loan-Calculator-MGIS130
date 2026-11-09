
"use strict";

// DATA LAYER: find the form and its fields.
const loanForm = document.querySelector("#loan-form");
const amountInput = document.querySelector("#loan-amount");
const rateInput = document.querySelector("#interest-rate");
const termInput = document.querySelector("#loan-term");
const errorMessage = document.querySelector("#error-message");
const resetButton = document.querySelector("#reset-button");

const monthlyPaymentOutput = document.querySelector("#monthly-payment");
const totalPaymentOutput = document.querySelector("#total-payment");
const totalInterestOutput = document.querySelector("#total-interest");

const loanInputs = [amountInput, rateInput, termInput];

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

// DATA LAYER: validate the user's entries.
function readLoanData() {
  const amountText = amountInput.value.trim();
  const rateText = rateInput.value.trim();
  const termText = termInput.value.trim();

  const amount = Number(amountText);
  const annualRate = Number(rateText);
  const years = Number(termText);

  if (amountText === "" || !Number.isFinite(amount) ||
      amount <= 0 || amount > 1_000_000_000) {
    return {
      error: "Enter a loan amount greater than $0 and no more than $1,000,000,000.",
      field: amountInput
    };
  }

  if (rateText === "" || !Number.isFinite(annualRate) ||
      annualRate < 0 || annualRate > 100) {
    return {
      error: "Enter an annual interest rate from 0% to 100%.",
      field: rateInput
    };
  }

  if (termText === "" || !Number.isInteger(years) ||
      years < 1 || years > 50) {
    return {
      error: "Enter a whole-number loan term from 1 to 50 years.",
      field: termInput
    };
  }

  return { data: { amount, annualRate, years } };
}

// PROCESSING LAYER: calculate payment and total costs.
function calculateLoan(loan) {
  const numberOfPayments = loan.years * 12;
  const monthlyRate = loan.annualRate / 100 / 12;

  let monthlyPayment;

  if (monthlyRate === 0) {
    monthlyPayment = loan.amount / numberOfPayments;
  } else {
    const factor = Math.pow(1 + monthlyRate, numberOfPayments);
    monthlyPayment =
      loan.amount * (monthlyRate * factor) / (factor - 1);
  }

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = Math.max(0, totalPayment - loan.amount);

  if (![monthlyPayment, totalPayment, totalInterest].every(Number.isFinite)) {
    throw new Error("Invalid calculation result.");
  }

  return { monthlyPayment, totalPayment, totalInterest };
}

// PRESENTATION LAYER: show the calculated results.
function displayResults(results) {
  monthlyPaymentOutput.textContent =
    moneyFormatter.format(results.monthlyPayment);
  totalPaymentOutput.textContent =
    moneyFormatter.format(results.totalPayment);
  totalInterestOutput.textContent =
    moneyFormatter.format(results.totalInterest);
}

function clearResults() {
  monthlyPaymentOutput.textContent = "—";
  totalPaymentOutput.textContent = "—";
  totalInterestOutput.textContent = "—";
}

function clearValidation() {
  errorMessage.textContent = "";

  loanInputs.forEach((input) => {
    input.removeAttribute("aria-invalid");
  });
}

function showError(message, field = null) {
  clearResults();
  errorMessage.textContent = message;

  if (field) {
    field.setAttribute("aria-invalid", "true");
    field.focus();
  }
}

// Clear the old warning when the user starts correcting an input.
loanInputs.forEach((input) => {
  input.addEventListener("input", () => {
    input.removeAttribute("aria-invalid");
    errorMessage.textContent = "";
  });
});

// Calculate the loan when the form is submitted.
loanForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearValidation();

  try {
    const loanResult = readLoanData();

    if (loanResult.error) {
      showError(loanResult.error, loanResult.field);
      return;
    }

    displayResults(calculateLoan(loanResult.data));
  } catch (error) {
    console.error("Loan calculation error:", error);
    showError("Sorry, the payment could not be calculated. Check your entries and try again.");
  }
});

// Reset all fields and recalculate the default values.
resetButton.addEventListener("click", () => {
  loanForm.reset();
  clearValidation();

  try {
    const loanResult = readLoanData();

    if (loanResult.error) {
      showError(loanResult.error, loanResult.field);
      return;
    }

    displayResults(calculateLoan(loanResult.data));
  } catch (error) {
    console.error("Loan reset error:", error);
    showError("Unable to reset the calculator. Please try again.");
  }
});

// Show the initial estimate on page load.
try {
  const initialLoan = readLoanData();

  if (initialLoan.data) {
    displayResults(calculateLoan(initialLoan.data));
  } else {
    clearResults();
  }
} catch (error) {
  console.error("Initial calculation error:", error);
  clearResults();
}
