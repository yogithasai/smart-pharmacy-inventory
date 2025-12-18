import { useState } from "react";
import { askChatbot } from "../api/api";

export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    const res = await askChatbot(question);
    setAnswer(res.data.answer);
  };

  return (
    <div>
      <h1>Inventory Assistant</h1>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something..."
      />
      <button onClick={handleAsk}>Ask</button>
      <p>{answer}</p>
    </div>
  );
}
