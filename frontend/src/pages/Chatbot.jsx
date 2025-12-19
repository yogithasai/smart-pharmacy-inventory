import { useState, useEffect, useRef } from "react";
import { askChatbot } from "../api/api";
import "../styles/chat.css";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userText,
        time: new Date().toLocaleTimeString(),
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await askChatbot(userText);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          // ✅ BACKEND NOW RETURNS answer DIRECTLY
          text: res.data.answer,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Unable to connect to chatbot service.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-page-wrapper">
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
            {messages.map((msg, i) => (
              <div key={i} className={`chat-row ${msg.sender}`}>
                <div className="avatar">
                  {msg.sender === "bot" ? "🤖" : "👤"}
                </div>

                <div className={`chat-bubble ${msg.sender}`}>
                  <p>{msg.text}</p>
                  <span className="time">{msg.time}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-row bot">
                <div className="avatar">🤖</div>
                <div className="chat-bubble bot typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={bottomRef}></div>
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
