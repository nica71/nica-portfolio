// Элементы
const toggle = document.getElementById("ai-chat-toggle");
const modal  = document.getElementById("ai-chat-modal");
const close  = document.getElementById("ai-chat-close");
const body   = document.getElementById("ai-chat-body");
const input  = document.getElementById("ai-chat-text");
const send   = document.getElementById("ai-chat-send");

// Память диалога: массив сообщений [{role:"user"|"assistant", content:"..."}]
let conversation = [];


// Открытие/закрытие
toggle.onclick = () => {
  modal.classList.add("shown");
  input.focus();
};

close.onclick = () => {
  modal.classList.remove("shown");
};

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal.classList.remove("shown");
});

function addMsg(text, cls) {
  const div = document.createElement("div");
  div.className = "msg " + cls;
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

async function askAI(text) {
  // добавляем сообщение пользователя в историю
  conversation.push({ role: "user", content: text });
  addMsg(text, "user");
  input.value = "";

  try {
    const res = await fetch(`${window.BACKEND_URL}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: conversation })
    });

    if (!res.ok) throw new Error("Bad response");

    const data = await res.json();
    const reply = data.reply || "Nu am răspuns acum.";

    // добавляем ответ ассистента в историю
    conversation.push({ role: "assistant", content: reply });
    addMsg(reply, "bot");
  } catch (err) {
    addMsg("Eroare / Ошибка conexiunii cu serverul.", "bot");
  }
}

// Отправка по кнопке
send.onclick = () => {
  const text = input.value.trim();
  if (text) {
    askAI(text);
  }
};

// Отправка по Enter
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
      askAI(text);
    }
  }
});
