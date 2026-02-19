function simulateFuture(data, extraSave) {
  const improvedSavings = data.savings + extraSave;
  const newRatio = improvedSavings / data.income;

  if (newRatio >= 0.3)
    return "Excellent future improvement predicted 🚀";

  if (newRatio >= 0.2)
    return "Moderate improvement predicted 📈";

  return "Minimal improvement predicted ⚠️";
}
