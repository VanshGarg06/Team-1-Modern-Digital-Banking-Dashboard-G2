function explainAI(factors) {
  const list = document.getElementById("explanation");
  list.innerHTML = "";

  factors.forEach(f => {
    list.innerHTML += `<li>🔎 ${f} reduced your score</li>`;
  });
}
