import { useState } from "react";
import { askChatbot } from "../api/api";
import "../styles/chat.css";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await askChatbot(input);

      const botMsg = {
        sender: "bot",
        text:
          res.data.type === "text"
            ? res.data.response
            : "📊 Data returned (see table below)",
        table: res.data.type === "table" ? res.data.response : null,
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Error connecting to backend",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  return (
    <div className="chat-app">
      {/* LEFT SIDEBAR */}
      <div className="chat-sidebar">
        <h3>Chats</h3>
        <div className="chat-user active">Inventory Assistant</div>
        <div className="chat-user">Supplier Bot</div>
        <div className="chat-user">Admin</div>
      </div>

      {/* MAIN CHAT */}
      <div className="chat-main">
        <div className="chat-header">
          💊 Inventory Assistant <span>Online</span>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-bubble ${msg.sender}`}
            >
              <p>{msg.text}</p>

              {msg.table && (
                <table>
                  <thead>
                    <tr>
                      {Object.keys(msg.table[0]).map((k) => (
                        <th key={k}>{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {msg.table.map((row, r) => (
                      <tr key={r}>
                        {Object.values(row).map((v, c) => (
                          <td key={c}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <span>{msg.time}</span>
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
      <div className="chat-right">
        <h3>Notifications</h3>
        <p>✔ Expiry alert checked</p>
        <p>✔ Forecast updated</p>
        <p>✔ NLP model active</p>
      </div>
    </div>
  );
}
