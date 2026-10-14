# MGIS130 Loan Calculator

A simple responsive loan calculator demonstrating a three-layer information system.

## Files
- `index.html` — semantic form and results interface
- `styles.css` — visual design and responsive layout
- `script.js` — reads/validates inputs, calculates payments, and updates results

## Run locally
Open `index.html` in a modern browser. No installation, build step, external API, or secret key is required.

## Test ideas
1. Use the defaults: $25,000, 6.5% annual interest, 5 years.
2. Change the interest rate to `0`; the monthly payment should equal principal divided by the number of months.
3. Enter a negative loan amount and submit; an error should appear.
4. Enter a term of `0`, a decimal term, or a term above `50`; an error should appear.
5. Resize the browser to a phone-width layout and confirm the results remain readable.

## Architecture
- Data layer: `readLoanData()` obtains and validates form values.
- Processing layer: `calculateLoan()` calculates the monthly payment, total repayment, and interest.
- Presentation layer: HTML/CSS define the interface; `displayResults()` and the submit handler update visible output.

For the assignment, document your own testing observations and actual AI prompts/responses. Do not claim a test passed until you have run it.
