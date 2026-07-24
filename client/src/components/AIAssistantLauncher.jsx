import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatWidget from "./ChatWidget";

const AIAssistantLauncher = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  const openChat = () => {
    setMenuOpen(false);
    setChatOpen(true);
  };

  const goToHub = () => {
    setMenuOpen(false);
    navigate("/ai");
  };

  return (
    <>
      <div className="ai-launcher-wrap">
        {menuOpen && (
          <div className="ai-launcher-menu">
            <button className="ai-launcher-item" onClick={openChat}>💬 Chat with us</button>
            <button className="ai-launcher-item" onClick={goToHub}>✨ AI Hub — Recommendations</button>
          </div>
        )}
        <button className="chat-bubble" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "✨"}
        </button>
      </div>

      <ChatWidget externalOpen={chatOpen} onExternalClose={() => setChatOpen(false)} />
    </>
  );
};

export default AIAssistantLauncher;