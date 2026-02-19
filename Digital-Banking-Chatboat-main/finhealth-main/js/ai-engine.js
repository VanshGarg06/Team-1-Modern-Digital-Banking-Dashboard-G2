function computeAIIndex(data) {
  let score = 100;
  let factors = [];

  const expenseRatio = data.expenses / data.income;
  const savingRatio = data.savings / data.income;

  if (expenseRatio > 0.7) {
    score -= 25;
    factors.push("High expense ratio");
  }

  if (savingRatio < 0.2) {
    score -= 20;
    factors.push("Low savings rate");
  }

  if (data.emergency < data.expenses * 3) {
    score -= 15;
    factors.push("Weak emergency fund");
  }

  if (expenseRatio > 1) {
    score -= 30;
    factors.push("Expenses exceed income");
  }

  return {
    score: Math.max(score, 10),
    factors
  };
}
