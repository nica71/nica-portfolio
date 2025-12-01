// chat.js – NICA AI Assistant + лог разговоров + отправка диалога на сервер

document.addEventListener("DOMContentLoaded", () => {
  const backendUrl = window.BACKEND_URL || "";
  if (!backendUrl) {
    console.error("BACKEND_URL не задан. Чат не сможет обратиться к серверу.");
  }

  const toggle = document.getElementById("ai-chat-toggle");
  const modal = document.getElementById("ai-chat-modal");
  const closeBtn = document.getElementById("ai-chat-close");
  const bodyEl = document.getElementById("ai-chat-body");
  const input = document.getElementById("ai-chat-text");
  const sendBtn = document.getElementById("ai-chat-send");
  const heroBtn = document.getElementById("hero-ai-chat"); // может не быть

  // Если чего-то не хватает в DOM, просто выходим
  if (!toggle || !modal || !closeBtn || !bodyEl || !input || !sendBtn) {
    console.warn("AI chat: какие-то элементы не найдены в DOM.");
    return;
  }

  // ---- ХРАНИМ РАЗГОВОР ----
  const conversation = [];
  let conversationSent = false;
  let isSending = false;

  function hasUserMessages() {
    return conversation.some((m) => m.role === "user");
  }

  function addMessageBubble(role, text) {
    const wrap = document.createElement("div");
    wrap.className = `ai-msg ai-msg-${role}`;
    wrap.textContent = text;
    bodyEl.appendChild(wrap);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function pushMessage(role, text) {
    conversation.push({
      role,
      content: text,
      ts: new Date().toISOString(),
    });
  }

  async function sendTranscript(reason = "unknown") {
    if (conversationSent) return;
    if (!hasUserMessages()) return;
    if (!backendUrl) return;

    conversationSent = true;

    try {
      await fetch(`${backendUrl}/api/notify-conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation,
          reason,
          page: "nica-portfolio",
          time: new Date().toISOString(),
        }),
      });
    } catch (e) {
      console.error("Ошибка отправки транскрипта:", e);
    }
  }

  // ---- ОТПРАВКА СООБЩЕНИЯ В БЭКЕНД ----
  async function handleSend() {
    if (isSending) return;
    const text = input.value.trim();
    if (!text) return;

    // сообщение пользователя
    addMessageBubble("user", text);
    pushMessage("user", text);
    input.value = "";
    input.focus();

    if (!backendUrl) {
      const msg = "Backend indisponibil (nu este setat BACKEND_URL).";
      addMessageBubble("assistant", msg);
      pushMessage("assistant", msg);
      return;
    }

    isSending = true;
    sendBtn.disabled = true;
    input.disabled = true;

    try {
      const res = await fetch(`${backendUrl}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        throw new Error(`Ответ сервера: ${res.status}`);
      }

      const data = await res.json();
      const reply =
        (data && (data.reply || data.answer || data.message)) ||
        "I don't have an answer right now, try rephraseing the question.";

      addMessageBubble("assistant", reply);
      pushMessage("assistant", reply);
    } catch (err) {
      console.error("Ошибка общения с backend:", err);
      const msg =
        "There was an error communicating with the server. Please try again later.";
      addMessageBubble("assistant", msg);
      pushMessage("assistant", msg);
    } finally {
      isSending = false;
      sendBtn.disabled = false;
      input.disabled = false;
      input.focus();
    }
  }

  // ---- ОБРАБОТЧИКИ UI ----

  toggle.addEventListener("click", () => {
    modal.classList.add("shown");
    input.focus();
  });

  if (heroBtn) {
    heroBtn.addEventListener("click", () => {
      modal.classList.add("shown");
      input.focus();
    });
  }

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("shown");
    sendTranscript("modal_close");
  });

  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleSend();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // ---- ОТПРАВКА ПРИ ЗАКРЫТИИ СТРАНИЦЫ ----

  window.addEventListener("beforeunload", () => {
    if (conversationSent) return;
    if (!hasUserMessages()) return;
    if (!backendUrl) return;

    const payload = {
      conversation,
      reason: "page_unload",
      page: "nica-portfolio",
      time: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });
    navigator.sendBeacon(`${backendUrl}/api/notify-conversation`, blob);
    conversationSent = true;
  });

  console.log("NICA AI chat initialized.");
});
