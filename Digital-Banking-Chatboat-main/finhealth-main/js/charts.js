function renderChart(canvasId, labels, data, label) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label,
        data,
        borderColor: "#00ff9c",
        backgroundColor: "rgba(0,255,156,0.15)",
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      plugins: { legend: { labels: { color: "#00ff9c" }}},
      scales: {
        x: { ticks: { color: "#00ff9c" }},
        y: { ticks: { color: "#00ff9c" }}
      }
    }
  });
}
