function runAI() {
  const data = {
    income: +income.value,
    expenses: +expenses.value,
    savings: +savings.value,
    emergency: +emergency.value
  };

  const result = computeAIIndex(data);

  aiScore.innerText = result.score;

  riskLevel.innerText =
    result.score > 75 ? "🟢 Low Risk" :
    result.score > 50 ? "🟡 Medium Risk" :
    "🔴 High Risk";

  personality.innerText =
    result.score > 75 ? "Cautious Planner" :
    result.score > 50 ? "Balanced Spender" :
    "Risk-Prone Spender";

  explainAI(result.factors);
}

function simulate() {
  const data = {
    income: +income.value,
    expenses: +expenses.value,
    savings: +savings.value
  };

  const extra = +extraSave.value;
  simulationResult.innerText = simulateFuture(data, extra);
}
