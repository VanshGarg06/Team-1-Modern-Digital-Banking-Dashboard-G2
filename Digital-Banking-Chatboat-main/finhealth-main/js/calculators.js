// CAR LOAN EMI
function carLoan() {
  const P = +amount.value;
  const r = (+rate.value / 12) / 100;
  const n = +years.value * 12;
  const emi = (P * r * Math.pow(1+r, n)) / (Math.pow(1+r, n)-1);
  result.innerText = "Monthly EMI: ₹" + emi.toFixed(2);
}

// EDUCATION LOAN
function educationLoan() {
  const P = +amount.value;
  const r = (+rate.value / 12) / 100;
  const n = +years.value * 12;
  const emi = (P * r * Math.pow(1+r, n)) / (Math.pow(1+r, n)-1);
  result.innerText = "Monthly EMI: ₹" + emi.toFixed(2);
}

// HOME LOAN
function homeLoan() {
  carLoan();
}

// INSURANCE COVER
function insuranceCalc() {
  const income = +incomeVal.value;
  const years = +coverYears.value;
  result.innerText = "Recommended Cover: ₹" + (income * years * 10).toLocaleString();
}

// RETIREMENT CORPUS
function retirementCalc() {
  const expense = +monthlyExpense.value;
  const years = +retireYears.value;
  const corpus = expense * 12 * years * 25;
  result.innerText = "Required Corpus: ₹" + corpus.toLocaleString();
}

// TAX CALCULATION
function taxCalc() {
  const income = +annualIncome.value;
  let tax = 0;
  if (income > 500000) tax = (income - 500000) * 0.2;
  result.innerText = "Estimated Tax: ₹" + tax.toLocaleString();
}
