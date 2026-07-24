import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../api/chatApi";
import ChatMessage from "./ChatMessage";

const SUGGESTED_QUESTIONS = [
  "Where is my order?",
  "What payment methods do you accept?",
  "What's your return policy?",
  "How long does shipping take?",
];

const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ChatWidget = ({ externalOpen, onExternalClose }) => {
   const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (externalOpen) setIsOpen(true);
  }, [externalOpen]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, loading]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("chatConversations") || "[]");
    setConversations(saved);
  }, []);

  const saveConversation = (finalMessages) => {
    if (finalMessages.length === 0) return;
    const preview = finalMessages.find((m) => m.role === "user")?.content?.slice(0, 40) || "Chat";
    const updated = [
      { id: Date.now(), preview, messages: finalMessages, date: new Date().toLocaleDateString() },
      ...conversations,
    ].slice(0, 10);
    setConversations(updated);
    localStorage.setItem("chatConversations", JSON.stringify(updated));
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: "user", content: text, time: nowTime() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const history = newMessages.map((m) => ({ role: m.role, content: m.content }));
      const res = await sendChatMessage({ message: text, history: history.slice(0, -1) });
      const assistantMessage = { role: "assistant", content: res.data.reply, time: nowTime(), animate: true };
      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      saveConversation(finalMessages);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I'm having trouble responding right now. Please try again.", time: nowTime() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const startNewChat = () => {
    setMessages([]);
    setShowHistory(false);
  };

  const loadConversation = (conv) => {
    setMessages(conv.messages);
    setShowHistory(false);
  };

  return isOpen ? (
    <div className="chat-window">
      <div className="chat-header">
        <button
          className="chat-header-icon-btn chat-close-btn"
          onClick={() => { setIsOpen(false); onExternalClose && onExternalClose(); }}
        >
          ✕
        </button>
        <div className="chat-header-avatar">🤖</div>
        <div style={{ flex: 1 }}>
          <p className="chat-header-title">Support Assistant</p>
          <p className="chat-header-subtitle">
            <span className="chat-online-dot"></span> Usually replies instantly
          </p>
        </div>
        <button className="chat-header-icon-btn" onClick={() => setShowHistory(!showHistory)} title="Chat history">🕘</button>
        <button className="chat-header-icon-btn" onClick={startNewChat} title="New chat">➕</button>
      </div>

      {showHistory ? (
        <div className="chat-history-panel">
          <p className="chat-history-title">Recent Conversations</p>
          {conversations.length === 0 ? (
            <p className="chat-history-empty">No past conversations yet.</p>
          ) : (
            conversations.map((conv) => (
              <button key={conv.id} className="chat-history-item" onClick={() => loadConversation(conv)}>
                <span className="chat-history-preview">{conv.preview}...</span>
                <span className="chat-history-date">{conv.date}</span>
              </button>
            ))
          )}
        </div>
      ) : (
        <>
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-welcome">
                <div className="chat-welcome-icon">🤖</div>
                <p className="chat-welcome-title">Hi! I'm your support assistant</p>
                <p className="chat-welcome-subtitle">Ask me about orders, payments, or shipping.</p>
                <div className="chat-suggestions">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button key={q} className="chat-suggestion-chip" onClick={() => sendMessage(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} animate={msg.animate && i === messages.length - 1} />
              ))
            )}

            {loading && (
              <div className="chat-message-wrap">
                <div className="chat-message chat-message-assistant chat-typing">
                  <span></span><span></span><span></span>
                </div>
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
        </>
      )}
    </div>
  ) : null;
};

export default ChatWidget;