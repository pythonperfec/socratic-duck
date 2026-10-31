import React, { useEffect, useRef } from 'react';

/**
 * Chat.jsx - Soap-bubble dialogue thread
 * Features:
 * - Floating soap-bubble style message bubbles (duck left, user right)
 * - Pearlescent sheen & gentle float-in bounce animations
 * - Image thumbnail support for code screenshots
 * - Animated soap-suds typing indicator when the duck is deliberating
 * - Smooth auto-scrolling
 */
export default function Chat({
  messages = [],
  isDuckTyping = false,
  ChatBubbleComponent = null,
  modeId = 'duck'
}) {
  const bottomRef = useRef(null);

  // Auto-scroll on new messages or typing state
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isDuckTyping]);

  const isSeance = modeId === 'seance';

  const renderMoodEmoji = (mood) => {
    if (isSeance) {
      switch (mood) {
        case 'delighted': return '🕊️';
        case 'squint': return '🔮';
        case 'grumpy': return '⚡';
        default: return '👁️';
      }
    }

    switch (mood) {
      case 'delighted': return '✨🦆';
      case 'squint': return '🧐🦆';
      case 'grumpy': return '😤🦆';
      default: return '🦆';
    }
  };

  return (
    <div className="chat-viewport" aria-label="Conversation dialogue thread">
      <div className="chat-messages-list">
        {messages.map((msg) => {
          const isDuck = msg.role === 'duck';
          return (
            <div
              key={msg.id || `${msg.role}-${msg.timestamp}`}
              className={`message-row ${isDuck ? 'duck-row' : 'user-row'}`}
            >
              {isDuck && (
                <div
                  className="duck-avatar-bubble"
                  title={`${isSeance ? 'Spectral state' : 'Duck mood'}: ${msg.mood || 'calm'}`}
                >
                  <span className="avatar-duck">{renderMoodEmoji(msg.mood)}</span>
                </div>
              )}

              {ChatBubbleComponent ? (
                <ChatBubbleComponent msg={msg} isDuck={isDuck} />
              ) : (
                <div className={`soap-bubble ${isDuck ? 'duck-bubble' : 'user-bubble'}`}>
                  <div className="bubble-sheen"></div>
                  {msg.image && (
                    <div className="bubble-attachment">
                      <img src={msg.image} alt="Code screenshot" className="attached-img" />
                    </div>
                  )}
                  <div className="bubble-text">{msg.text}</div>
                  <div className="bubble-footer">
                    {msg.patienceDelta !== undefined && isDuck && (
                      <span className={`patience-tag ${msg.patienceDelta >= 0 ? 'gain' : 'loss'}`}>
                        {msg.patienceDelta > 0 ? `+${msg.patienceDelta} Patience` : `${msg.patienceDelta} Patience`}
                      </span>
                    )}
                    <span className="bubble-timestamp">{msg.timestamp || 'Just now'}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Bubble Indicator */}
        {isDuckTyping && (
          <div className="message-row duck-row typing-row">
            <div className="duck-avatar-bubble">
              <span className="avatar-duck">{isSeance ? '🕯️' : '🦆'}</span>
            </div>
            <div className={`soap-bubble duck-bubble typing-bubble ${isSeance ? 'seance-typing-bubble' : ''}`}>
              <div className="bubble-sheen"></div>
              <div className="typing-suds">
                <span className="typing-dot d1"></span>
                <span className="typing-dot d2"></span>
                <span className="typing-dot d3"></span>
              </div>
              <span className="typing-hint">
                {isSeance ? 'Spirit is communing with your logic...' : 'Duck is inspecting your logic...'}
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
