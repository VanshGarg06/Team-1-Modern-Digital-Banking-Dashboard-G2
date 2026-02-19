function calculateHealth() {
  const income = Number(document.getElementById("income").value);
  const expenses = Number(document.getElementById("expenses").value);
  const savings = Number(document.getElementById("savings").value);

  if (income <= 0) {
    alert("Enter valid income");
    return;
  }

  // HEALTH SCORE LOGIC
  let score = 100;

  if (expenses > income * 0.7) score -= 30;
  if (savings < income * 0.2) score -= 20;
  if (expenses > income) score -= 30;

  score = Math.max(score, 10);

  document.getElementById("scoreCircle").innerText = score;

  // SCORE TEXT
  let status = score >= 75 ? "Excellent" :
               score >= 50 ? "Good" :
               "Needs Improvement";

  document.getElementById("scoreText").innerText =
    "Your financial health is " + status;

  generateInsights(income, expenses, savings);
  explainSpending(income, expenses);
}

function generateInsights(income, expenses, savings) {
  const insights = document.getElementById("insights");
  insights.innerHTML = "";

  if (expenses > income * 0.7)
    insights.innerHTML += "<li>⚠ You are spending too much of your income</li>";

  if (savings < income * 0.2)
    insights.innerHTML += "<li>💡 Try saving at least 20% of income</li>";

  if (expenses < income * 0.5)
    insights.innerHTML += "<li>✅ Great expense control</li>";
}

function explainSpending(income, expenses) {
  let text = "";

  if (expenses > income)
    text = "You are spending more than you earn. This may lead to debt.";
  else if (expenses > income * 0.7)
    text = "Your spending is high. Consider cutting non-essential costs.";
  else
    text = "Your spending is well balanced.";

  document.getElementById("explain").innerText = text;
}
