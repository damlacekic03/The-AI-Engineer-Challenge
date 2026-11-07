import { useEffect, useRef, useState } from "react";

const welcomeMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, this is a space for you. What's been on your mind lately?",
};

const suggestions = [
  "I'm feeling a little stressed",
  "I want to find my motivation",
  "Build a new habit",
];

function App() {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const conversationRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    conversationRef.current?.scrollTo({
      top: conversationRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  async function sendMessage(message) {
    const content = message.trim();
    if (!content || isSending) return;

    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content },
    ]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Could not get a response from the server.",
        );
      }
      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("The server returned an invalid response.");
      }

      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "error",
          content: `Your message could not be sent. Check that the backend is running and try again. (${error.message})`,
        },
      ]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Feel Better home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>feel better</span>
        </a>
        <div className="topbar-note">
          <span className="status-dot" />
          <span>Here for you, ready to listen</span>
        </div>
        <div className="topbar-spacer" aria-hidden="true" />
      </header>

      <section className="chat-layout" aria-label="Supportive chat">
        <div className="intro">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            MAKE SPACE FOR YOURSELF
          </div>
          <h1>
            Let's
            <br />
            <span>talk it through.</span>
          </h1>
          <p>
            Share what's on your mind. Sometimes feeling better starts with
            simply talking.
          </p>
          <div className="intro-footer">
            <span className="sparkle" aria-hidden="true">
              ✳
            </span>
            No judgment. Take it at your own pace.
          </div>
        </div>

        <section className="chat-card" aria-label="Chat window">
          <div className="chat-card-header">
            <div className="coach-avatar" aria-hidden="true">
              i
            </div>
            <div className="coach-details">
              <strong>Feel Better</strong>
              <span>
                <span className="status-dot" />
                Supportive chat
              </span>
            </div>
            <span className="secure-label">
              <span aria-hidden="true">✦</span> A space just for you
            </span>
          </div>

          <div
            className="conversation"
            ref={conversationRef}
            aria-live="polite"
            aria-label="Messages"
          >
            <div className="day-divider">
              <span>TODAY</span>
            </div>
            {messages.map((message) => (
              <div
                className={`message-row message-row--${message.role}`}
                key={message.id}
              >
                {message.role !== "user" && (
                  <div className="message-avatar" aria-hidden="true">
                    i
                  </div>
                )}
                <div
                  className={`message-bubble message-bubble--${message.role}`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="message-row message-row--assistant">
                <div className="message-avatar" aria-hidden="true">
                  i
                </div>
                <div className="message-bubble typing" aria-label="Writing a reply">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="suggestions" aria-label="Suggested starters">
              <span className="suggestions-label">HERE ARE A FEW WAYS TO START</span>
              <div className="suggestion-list">
                {suggestions.map((suggestion) => (
                  <button
                    className="suggestion-chip"
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    disabled={isSending}
                  >
                    {suggestion}
                    <span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="composer" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="message-input">
              Your message
            </label>
            <textarea
              id="message-input"
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write what's on your mind..."
              rows={1}
              maxLength={4000}
              disabled={isSending}
            />
            <button
              className="send-button"
              type="submit"
              aria-label="Send message"
              disabled={isSending || !input.trim()}
            >
              <span aria-hidden="true">↑</span>
            </button>
            <div className="composer-hint">
              <span>↵ Send</span>
              <span>⇧ + ↵ New line</span>
            </div>
          </form>
        </section>
      </section>

      <footer className="page-footer">
        <span>One step, one breath, one moment at a time.</span>
        <span className="footer-separator" />
        <span>This chat is not a substitute for professional support.</span>
      </footer>
    </main>
  );
}

export default App;
