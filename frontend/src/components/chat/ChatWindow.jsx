import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, loading }) {
  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <MessageBubble key={index} msg={msg} />
      ))}

      {loading && <div className="typing">Inventory Assistant is typing...</div>}
    </div>
  );
}
