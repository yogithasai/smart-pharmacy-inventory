import { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    onSend(text);
    setText("");
  };

  return (
    <div className="chat-input">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask about inventory, expiry, reorder..."
        disabled={disabled}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend} disabled={disabled}>
        Send
      </button>
    </div>
  );
}
