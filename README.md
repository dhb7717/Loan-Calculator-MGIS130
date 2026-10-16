
# Simple Loan Calculator

A responsive web application that calculates monthly loan payments,
total repayment, and total interest based on user-provided loan details.

## Live Application

**[Open the Loan Calculator](https://dhb7717.github.io/Loan-Calculator-MGIS130/)**

## Project Overview

This project demonstrates a three-layer information system using
HTML, CSS, and JavaScript. Users can enter a loan amount, annual
interest rate, and repayment term to estimate the cost of a loan.

The application runs in the browser and does not require an account,
server, or database.

## Features

- Calculates estimated monthly loan payments.
- Displays total repayment and total interest.
- Handles loans with a 0% annual interest rate.
- Validates user input and displays helpful error messages.
- Clears outdated results when input validation fails.
- Includes a reset button to restore the form's default values.
- Uses responsive CSS for desktop and mobile screens.
- Formats monetary results in US dollars.

## Technology Stack

- **HTML5:** Page structure and form controls.
- **CSS3:** Styling, layout, and responsive design.
- **JavaScript:** Input validation, loan calculations, and page updates.
- **GitHub Pages:** Hosting the live application.
- **Git and GitHub:** Source control and project history.

## Three-Layer Architecture

### 1. Data Layer

The `readLoanData()` function reads the user's entries and validates
the loan amount, annual interest rate, and repayment term before
passing the data to the calculation logic.

### 2. Processing Layer

The `calculateLoan()` function calculates the monthly payment,
total repayment, and total interest. It handles zero-interest loans
separately and checks that calculation results are finite numbers.

### 3. Presentation Layer

The `displayResults()`, `clearResults()`, and `showError()` functions
update the webpage with calculation results or validation feedback.
HTML defines the interface, while CSS controls its appearance.

Keeping these responsibilities separate makes the application easier
to understand, test, and maintain. For example, the calculation
formula can be changed without redesigning the page.

## Project Files

| File | Purpose |
|---|---|
| `index.html` | Defines the calculator interface and form fields. |
| `styles.css` | Defines the visual design and responsive layout. |
| `script.js` | Validates inputs, calculates payments, and updates results. |
| `README.md` | Documents the project, architecture, and testing. |

## How to Run Locally

1. Download or clone this repository.
2. Open the project folder.
3. Open `index.html` in a modern web browser.
4. Enter the loan details and select Calculate payment.
5. Use Reset to restore the form's default values.

No additional packages or build tools are required.

## Testing Checklist

Test the application with the following scenarios and record the
actual outcome of each test before submitting the project.

- [ ] Valid loan amount, interest rate, and term.
- [ ] Zero-interest loan.
- [ ] Empty loan amount.
- [ ] Negative loan amount.
- [ ] Negative or excessively high interest rate.
- [ ] Fractional or out-of-range loan term.
- [ ] Reset restores the default values and updates the results.
- [ ] Invalid input displays an error and clears old results.
- [ ] Layout remains usable at narrow mobile screen widths.
- [ ] Live GitHub Pages application loads correctly.

## Limitations

This calculator provides estimates based on a fixed annual interest
rate and regular monthly payments. Actual loan terms, fees, taxes,
insurance, lender rules, and payment schedules may affect real
borrowing costs. The estimate is not a loan offer or financial advice.

## Development and AI Assistance

ChatGPT was used to assist with code review, error handling,
responsive design, reset functionality, and project documentation.
The code and suggested improvements should be tested before being
treated as correct.

The project owner should document their own decisions, observations,
testing results, and reflections in the assignment's AI critique
appendix.

## Repository

Source code and commit history:
https://github.com/dhb7717/Loan-Calculator-MGIS130
