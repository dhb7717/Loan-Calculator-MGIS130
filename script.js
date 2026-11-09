
"use strict";

// DATA LAYER: locate form elements and inputs.
const loanForm = document.querySelector("#loan-form");
const resetButton = document.querySelector("#reset-button");
const errorMessage = document.querySelector("#error-message");

const loanInputs = [
  document.querySelector("#amount-a"),
  document.querySelector("#rate-a"),
  document.querySelector("#term-a"),
  document.querySelector("#amount-b"),
  document.querySelector("#rate-b"),
  document.querySelector("#term-b")
];

const outputs = {
  monthlyA: document.querySelector("#monthly-a"),
  totalA: document.querySelector("#total-a"),
  interestA: document.querySelector("#interest-a"),
  monthlyB: document.querySelector("#monthly-b"),
  totalB: document.querySelector("#total-b"),
  interestB: document.querySelector("#interest-b"),
  comparison: document.querySelector("#comparison-message"),
  savings: document.querySelector("#savings-message")
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

// DATA LAYER: read and validate one loan.
function readLoanData(startIndex, loanName) {
  const amountText = loanInputs[startIndex].value.trim();
  const rateText = loanInputs[startIndex + 1].value.trim();
  const termText = loanInputs[startIndex + 2].value.trim();

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
      error: `${loanName}: Enter a loan amount greater than $0 and no more than $1,000,000,000.`,
      field: loanInputs[startIndex]
    };
  }

  if (
    rateText === "" ||
    !Number.isFinite(annualRate) ||
    annualRate < 0 ||
    annualRate > 100
  ) {
    return {
      error: `${loanName}: Enter an annual interest rate from 0% to 100%.`,
      field: loanInputs[startIndex + 1]
    };
  }

  if (
    termText === "" ||
    !Number.isInteger(years) ||
    years < 1 ||
    years > 50
  ) {
    return {
      error: `${loanName}: Enter a whole-number loan term from 1 to 50 years.`,
      field: loanInputs[startIndex + 2]
    };
  }

  return {
    data: { amount, annualRate, years }
  };
}

// PROCESSING LAYER: calculate monthly payment and total costs.
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

  if (
    ![monthlyPayment, totalPayment, totalInterest].every(Number.isFinite)
  ) {
    throw new Error("Invalid calculation result.");
  }

  return { monthlyPayment, totalPayment, totalInterest };
}

// PRESENTATION LAYER: display the results.
function displayLoanResults(results, loanName) {
  const suffix = loanName.toLowerCase();

  outputs[`monthly${loanName}`].textContent =
    moneyFormatter.format(results.monthlyPayment);

  outputs[`total${loanName}`].textContent =
    moneyFormatter.format(results.totalPayment);

  outputs[`interest${loanName}`].textContent =
    moneyFormatter.format(results.totalInterest);
}

// PRESENTATION LAYER: compare total repayment.
function displayComparison(loanA, loanB) {
  if (Math.abs(loanA.totalPayment - loanB.totalPayment) < 0.01) {
    outputs.comparison.textContent =
      "Both loans have approximately the same total repayment.";

    outputs.savings.textContent = "";
    return;
  }

  const cheaperLoan = loanA.totalPayment < loanB.totalPayment
    ? "Loan A"
    : "Loan B";

  const savings = Math.abs(
    loanA.totalPayment - loanB.totalPayment
  );

  outputs.comparison.textContent =
    `${cheaperLoan} has the lower estimated total repayment.`;

  outputs.savings.textContent =
    `Estimated difference: ${moneyFormatter.format(savings)}.`;
}

// Clear previous results.
function clearResults() {
  Object.values(outputs).forEach((output) => {
    output.textContent = "";
  });

  outputs.comparison.textContent =
    "Enter your loan details and select Compare loans.";
}

// Clear validation messages.
function clearValidation() {
  errorMessage.textContent = "";

  loanInputs.forEach((input) => {
    input.removeAttribute("aria-invalid");
  });
}

// Display an error and focus the invalid field.
function showError(message, field) {
  clearResults();
  errorMessage.textContent = message;

  if (field) {
    field.setAttribute("aria-invalid", "true");
    field.focus();
  }
}

// Clear warning when the user edits an input.
loanInputs.forEach((input) => {
  input.addEventListener("input", () => {
    input.removeAttribute("aria-invalid");
    errorMessage.textContent = "";
  });
});

// PROCESSING LAYER: calculate and compare both loans.
loanForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearValidation();

  try {
    const resultA = readLoanData(0, "Loan A");

    if (resultA.error) {
      showError(resultA.error, resultA.field);
      return;
    }

    const resultB = readLoanData(3, "Loan B");

    if (resultB.error) {
      showError(resultB.error, resultB.field);
      return;
    }

    const loanA = calculateLoan(resultA.data);
    const loanB = calculateLoan(resultB.data);

    displayLoanResults(loanA, "A");
    displayLoanResults(loanB, "B");
    displayComparison(loanA, loanB);
  } catch (error) {
    console.error("Loan comparison error:", error);
    showError(
      "Sorry, the loans could not be compared. Check your entries and try again."
    );
  }
});

// Reset the form and restore default comparison.
resetButton.addEventListener("click", () => {
  loanForm.reset();
  clearValidation();

  const loanA = readLoanData(0, "Loan A");
  const loanB = readLoanData(3, "Loan B");

  if (loanA.data && loanB.data) {
    const resultsA = calculateLoan(loanA.data);
    const resultsB = calculateLoan(loanB.data);

    displayLoanResults(resultsA, "A");
    displayLoanResults(resultsB, "B");
    displayComparison(resultsA, resultsB);
  } else {
    clearResults();
  }
});

// Display the default comparison when the page loads.
try {
  const loanA = readLoanData(0, "Loan A");
  const loanB = readLoanData(3, "Loan B");

  if (loanA.data && loanB.data) {
    const resultsA = calculateLoan(loanA.data);
    const resultsB = calculateLoan(loanB.data);

    displayLoanResults(resultsA, "A");
    displayLoanResults(resultsB, "B");
    displayComparison(resultsA, resultsB);
  } else {
    clearResults();
  }
} catch (error) {
  console.error("Initial comparison error:", error);
  clearResults();
}
