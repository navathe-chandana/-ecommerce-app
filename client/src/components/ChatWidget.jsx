import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../api/chatApi";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! 👋 I'm here to help with orders, payments, or anything else. What can I do for you?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Send conversation history (excluding the initial greeting) for context
      const history = newMessages.slice(1).map((m) => ({ role: m.role, content: m.content }));
      const res = await sendChatMessage({ message: input, history: history.slice(0, -1) });
      setMessages([...newMessages, { role: "assistant", content: res.data.reply }]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I'm having trouble responding right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="chat-bubble" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-avatar">🤖</div>
            <div>
              <p className="chat-header-title">Support Assistant</p>
              <p className="chat-header-subtitle">Usually replies instantly</p>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role === "user" ? "chat-message-user" : "chat-message-assistant"}`}>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="chat-message chat-message-assistant chat-typing">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>➤</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;