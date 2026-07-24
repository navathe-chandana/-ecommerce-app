import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceSearchButton = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const isSupported = !!SpeechRecognition;

  useEffect(() => {
    if (!isSupported) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === "not-allowed" || event.error === "permission-denied") {
        toast.error("Microphone permission denied. Please allow mic access.");
      } else if (event.error === "no-speech") {
        toast.error("No speech detected. Try again.");
      } else {
        toast.error("Voice search error. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [isSupported]);

  useEffect(() => {
    if (!isListening && transcript.trim()) {
      onResult(transcript.trim());
      setTranscript("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const handleClick = () => {
    if (!isSupported) {
      toast.error("Voice search isn't supported in this browser. Try Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        toast.error("Could not start voice search.");
      }
    }
  };

  return (
    <div className="voice-search-wrap">
      <button
        type="button"
        className={`voice-search-btn ${isListening ? "voice-search-active" : ""}`}
        onClick={handleClick}
        title={isSupported ? "Search by voice" : "Voice search not supported"}
      >
        {isListening ? "⏹" : "🎤"}
      </button>

      {isListening && (
        <div className="voice-search-overlay">
          <div className="voice-pulse">
            <span></span><span></span><span></span>
          </div>
          <p className="voice-listening-text">Listening...</p>
          {transcript && <p className="voice-live-transcript">"{transcript}"</p>}
        </div>
      )}
    </div>
  );
};

export default VoiceSearchButton;