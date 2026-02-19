async function sendChatMessage() {
    const input = document.getElementById("chatInput").value;

    const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
    });

    const data = await res.json();

    const box = document.getElementById("chatBox");
    box.innerHTML += `<div><b>You:</b> ${input}</div>`;
    box.innerHTML += `<div><b>Bot:</b> ${data.reply}</div>`;

    document.getElementById("chatInput").value = "";

    // ✅ ADD THIS PART
    if (input.toLowerCase().includes("sip")) {
        setTimeout(function () {
            window.location.href = "calculators/sip.html";
        }, 1000);
    }
}
