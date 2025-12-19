import { useState } from "react";
import { askChatbot } from "../api/api";
import "../styles/chat.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await askChatbot(input);
      const botMsg = { role: "bot", text: res.data.answer };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Server not responding" },
      ]);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-app">
        {/* LEFT SIDEBAR */}
        <div className="chat-sidebar glass">
          <h3>Chats</h3>
          <div className="chat-user active">💊 Inventory Assistant</div>
          <div className="chat-user">📦 Supplier Bot</div>
          <div className="chat-user">🛠 Admin</div>
        </div>

        {/* MAIN CHAT */}
        <div className="chat-main glass">
          <div className="chat-header">
            💊 Inventory Assistant <span>● Online</span>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <p style={{ opacity: 0.6 }}>
                Ask anything about inventory, expiry, reorder…
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-row ${msg.role === "user" ? "user" : ""}`}
              >
                <div className="chat-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about inventory, expiry, reorder..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="chat-right glass">
          <h3>Notifications</h3>
          <p>✔ Expiry alerts checked</p>
          <p>✔ Forecast updated</p>
          <p>✔ NLP model active</p>
        </div>
      </div>
    </div>
  );
}
