import React from 'react';

/**
 * ReportCard.jsx - Ofrenda Card for Séance Mode
 * Styled with an ornate marigold border (#F28C0F), dark soot background (#17110E),
 * and candle amber illumination. Features root cause, lesson, flashcard, and spirit farewell.
 */
export default function ReportCard({ report, onClose, spirit = 'COBOL' }) {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const defaultFarewell = `The spirit of ${spirit} bows from across the ethereal veil. The bug is exorcised. May your execution paths stay bounded and pure.`;

  return (
    <div className="ofrenda-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ofrenda-card-container" onClick={(e) => e.stopPropagation()}>
        {/* Ornate Marigold Flower Border Frame */}
        <div className="marigold-border-frame">
          <div className="marigold-corner top-left">🌼</div>
          <div className="marigold-corner top-right">🌼</div>
          <div className="marigold-corner bottom-left">🌼</div>
          <div className="marigold-corner bottom-right">🌼</div>

          {/* Header */}
          <div className="ofrenda-header">
            <div className="ofrenda-sigil">🕯️ 💀 🕯️</div>
            <h2 className="ofrenda-title">OFRENDA OF THE EXORCISED BUG</h2>
            <p className="ofrenda-subtitle">Communion with the Spirit of {spirit} Concluded</p>
          </div>

          <div className="ofrenda-body">
            {/* 1. Root Cause */}
            <div className="ofrenda-section">
              <div className="section-banner">
                <span className="banner-icon">📜</span>
                <span className="banner-text">The Spirit's Diagnosis (Root Cause)</span>
              </div>
              <p className="ofrenda-text">{report.root_cause}</p>
            </div>

            {/* 2. Core Lesson */}
            <div className="ofrenda-section">
              <div className="section-banner">
                <span className="banner-icon">🕯️</span>
                <span className="banner-text">Eternal Lesson from the Silicon Veil</span>
              </div>
              <p className="ofrenda-text">{report.lesson}</p>
            </div>

            {/* 3. Flashcard */}
            {report.flashcard && (
              <div className="ofrenda-flashcard">
                <div className="flashcard-ribbon">RUNE OF RETENTION (FLASHCARD)</div>
                <div className="flashcard-q">
                  <strong>Question:</strong> {report.flashcard.q}
                </div>
                <div className="flashcard-a">
                  <strong>Insight:</strong> {report.flashcard.a}
                </div>
              </div>
            )}

            {/* 4. Spirit Farewell */}
            <div className="ofrenda-farewell">
              <span className="farewell-flower">🌼</span>
              <p className="farewell-message">
                "{report.farewell || defaultFarewell}"
              </p>
              <span className="farewell-flower">🌼</span>
            </div>
          </div>

          {/* Actions */}
          <div className="ofrenda-actions no-print">
            <button
              type="button"
              className="ofrenda-print-btn"
              onClick={handlePrint}
              title="Print or Save Ofrenda as PDF"
            >
              📜 Inscribe & Print PDF
            </button>
            <button
              type="button"
              className="ofrenda-close-btn"
              onClick={onClose}
            >
              Seal the Crypt ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
