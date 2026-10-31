import React, { useState, useRef } from 'react';

/**
 * Composer.jsx - Input bar for interacting with the Socratic Duck
 * Features:
 * - Expanding multi-line text input
 * - Screenshot / image upload with instant thumbnail preview and remove button
 * - Enter to send, Shift+Enter for newline
 * - Tactile soap/duck styled send button
 */
export default function Composer({ onSend, disabled = false }) {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setImagePreview(loadEvent.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if ((!trimmed && !imagePreview) || disabled) return;

    onSend({
      text: trimmed,
      image: imagePreview
    });

    setText('');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    // Auto-expand up to 120px
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="composer-container">
      {/* Thumbnail preview if an image was selected */}
      {imagePreview && (
        <div className="thumbnail-preview-bar">
          <div className="thumbnail-card">
            <img src={imagePreview} alt="Screenshot preview" className="thumbnail-img" />
            <button
              type="button"
              className="remove-thumb-btn"
              onClick={removeImage}
              title="Remove screenshot"
              aria-label="Remove image"
            >
              ✕
            </button>
            <span className="thumbnail-label">Code Screenshot</span>
          </div>
        </div>
      )}

      <div className="composer-tray">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        {/* Upload Screenshot Button */}
        <button
          type="button"
          className="attach-btn"
          onClick={() => fileInputRef.current?.click()}
          title="Attach code or error screenshot"
          disabled={disabled}
          aria-label="Attach screenshot"
        >
          <span className="attach-icon">📸</span>
        </button>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Confess your bug or hypothesis to the duck..."
          disabled={disabled}
          rows={1}
          className="composer-textarea"
        />

        {/* Send Button */}
        <button
          type="button"
          className="send-btn"
          onClick={handleSend}
          disabled={disabled || (!text.trim() && !imagePreview)}
          title="Send to Socratic Duck (Enter)"
          aria-label="Send message"
        >
          <span className="send-text">Squeeze</span>
          <span className="send-duck-icon">🦆</span>
        </button>
      </div>
    </div>
  );
}
