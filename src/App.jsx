import { useState, useRef, useEffect } from "react";

const BACKEND_URL = "/api/chat";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setMessages(prev => [...prev, { sender: "phil", text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { sender: "phil", text: "Oops, something went wrong. Try again!" }
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f3f3f3" }}>
      <div style={{ padding: "16px", background: "#2563eb", color: "white", fontWeight: "bold" }}>Phil</div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.sender === "user" ? "right" : "left", marginBottom: "10px" }}>
            <span
              style={{
                display: "inline-block",
                background: m.sender === "user" ? "#3b82f6" : "white",
                color: m.sender === "user" ? "white" : "black",
                padding: "10px 14px",
                borderRadius: "12px",
                maxWidth: "75%",
                wordWrap: "break-word"
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
        {typing && <div style={{ fontSize: "12px", color: "#777" }}>Phil is typing...</div>}
        <div ref={chatEndRef}></div>
      </div>

      <div style={{ padding: "12px", display: "flex", gap: "8px", background: "white" }}>
        <input
          style={{ flex: 1, padding: "8px" }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Text Phil..."
        />
        <button onClick={sendMessage} style={{ padding: "8px 16px" }}>Send</button>
      </div>
    </div>
  );
}
