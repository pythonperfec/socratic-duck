import React from 'react';

/**
 * ChatBubble.jsx - Ghostly Parchment Message Bubble for Séance Mode
 */
export default function ChatBubble({ msg, isDuck }) {
  return (
    <div className={`seance-parchment-bubble ${isDuck ? 'spirit-bubble' : 'mortal-bubble'}`}>
      {/* Antique parchment seal corner */}
      <div className="parchment-seal-corner"></div>

      {/* Code image attachment preview if present */}
      {msg.image && (
        <div className="parchment-attachment">
          <img src={msg.image} alt="Occult code relic" className="attached-img" />
        </div>
      )}

      {/* Message content */}
      <div className="parchment-body">
        {msg.text}
      </div>

      {/* Parchment footer with patience delta & timestamp */}
      <div className="parchment-footer">
        {msg.patienceDelta !== undefined && isDuck && (
          <span className={`spirit-patience-tag ${msg.patienceDelta >= 0 ? 'gain' : 'loss'}`}>
            {msg.patienceDelta > 0 ? `+${msg.patienceDelta} Wax` : `${msg.patienceDelta} Melted`}
          </span>
        )}
        <span className="parchment-time">{msg.timestamp || 'From the Ether'}</span>
      </div>
    </div>
  );
}
