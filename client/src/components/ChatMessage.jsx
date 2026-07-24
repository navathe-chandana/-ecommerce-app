import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const ChatMessage = ({ message, animate }) => {
  const [displayedText, setDisplayedText] = useState(animate ? "" : message.content);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!animate) return;
    let i = 0;
    const text = message.content;
    const interval = setInterval(() => {
      i += 3;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [animate, message.content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isUser = message.role === "user";

  return (
    <div className={`chat-message-wrap ${isUser ? "chat-message-wrap-user" : ""}`}>
      <div className={`chat-message ${isUser ? "chat-message-user" : "chat-message-assistant"}`}>
        <ReactMarkdown
          components={{
            code({ inline, className, children, ...props }) {
              return inline ? (
                <code className="chat-inline-code" {...props}>{children}</code>
              ) : (
                <pre className="chat-code-block"><code {...props}>{children}</code></pre>
              );
            },
          }}
        >
          {displayedText}
        </ReactMarkdown>

        {!isUser && (
          <button className="chat-copy-btn" onClick={handleCopy}>
            {copied ? "✓ Copied" : "📋 Copy"}
          </button>
        )}
      </div>
      <span className={`chat-timestamp ${isUser ? "chat-timestamp-user" : ""}`}>
        {message.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
};

export default ChatMessage;