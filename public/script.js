let selectedTone = "polite";

function setTone(tone, event) {
  selectedTone = tone;

  document.querySelectorAll(".tone-buttons button").forEach(btn => {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");
}

async function convertText() {
  const message = document.getElementById("inputText").value;
  const outputDiv = document.getElementById("output");

  if (!message) {
    outputDiv.innerText = "Please enter a message";
    return;
  }

  outputDiv.innerText = "Making it Corporate";

  const response = await fetch("/convert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      tone: selectedTone
    })
  });

  const data = await response.json();
  outputDiv.innerText = data.result;
}
function copyText() {
  const text = document.getElementById("output").innerText;
  navigator.clipboard.writeText(text);

  const btn = document.querySelector(".copy-btn");
  btn.innerText = "✅";

  setTimeout(() => {
    btn.innerText = "📋";
  }, 1000);
}