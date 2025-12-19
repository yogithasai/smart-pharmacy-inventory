import { useState } from "react";
import { sendChatMessage } from "../../api/api";
import ChatHeader from "./ChatHeader";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import "../../styles/chat.css";

export default function ChatLayout() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      sender: "user",
      type: "text",
      content: text,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await sendChatMessage(text);

      const botMessage = {
        sender: "bot",
        type: res.data.type,
        content: res.data.response,
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "text",
          content: "⚠️ Server error. Please try again.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <ChatHeader />
      <ChatWindow messages={messages} loading={loading} />
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}
