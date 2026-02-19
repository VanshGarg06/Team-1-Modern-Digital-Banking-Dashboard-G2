function calculate() {
  let e = +emergency.value * 2;
  let dti = debt.value / (income.value || 1) * 100;
  let s = +savings.value * 0.2;
  let c = ((credit.value - 300) / 600) * 20;
  let t = +track.value * 20;

  let score = Math.min(100, Math.max(0, e + (20 - dti) + s + c + t));

  document.getElementById("score").innerText =
    "FINHEALTH SCORE: " + Math.round(score) + "/100";

  document.getElementById("message").innerText =
    score >= 80 ? "OPTIMAL FINANCIAL STATE" :
    score >= 60 ? "STABLE BUT IMPROVABLE" :
    score >= 40 ? "RISK ZONE" :
    "CRITICAL CONDITION";
}
const layers = document.querySelectorAll(".layer");

document.addEventListener("mousemove", e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;

  layers.forEach((layer, index) => {
    const depth = (index + 1) * 0.4;
    layer.style.transform =
      `translate(${x * depth}px, ${y * depth}px)`;
  });
});
/* ================================
   NEON PARTICLE ENGINE
================================ */

const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

let w, h;

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = Array.from({ length: 140 }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.4,
  size: Math.random() * 2 + 0.5
}));

let mouse = { x: w / 2, y: h / 2 };

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animateParticles() {
  ctx.clearRect(0, 0, w, h);

  particles.forEach(p => {
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 150) {
      p.x -= dx * 0.002;
      p.y -= dy * 0.002;
    }

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h;
    if (p.y > h) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = "#00ff9c";
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();
async function sendMessage() {
    const msg = document.getElementById("msg").value;

    const res = await fetch("http://localhost:8000/chat", {

        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: msg
        })
    });

    const data = await res.json();
    document.getElementById("reply").innerText = data.reply;
}
