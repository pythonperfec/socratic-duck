import React, { useState } from 'react';
import Duck from './Duck.jsx';

/**
 * CaseReport.jsx - Post-mortem "Case File" Modal
 * Styled like a bathroom-tile case memo / towel file
 * Features:
 * - Delighted rubber duck celebration
 * - Root cause analysis
 * - Core architectural takeaway
 * - Interactive Flashcard with flip / reveal answer
 * - "Print / Save as PDF" button via window.print()
 */
export default function CaseReport({ report, onClose }) {
  const [showAnswer, setShowAnswer] = useState(false);

  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="case-report-backdrop" role="dialog" aria-modal="true">
      <div className="case-report-modal print-target">
        {/* Bathroom Tile Memo Header */}
        <div className="case-header">
          <div className="case-duck-badge">
            <Duck mood="delighted" />
            <div className="duck-sparkle">✨</div>
          </div>

          <div className="case-title-group">
            <div className="case-stamp">CONFIDENTIAL • RESOLVED</div>
            <h2 className="case-heading">Post-Mortem Case File</h2>
            <p className="case-date">
              Rubber Duck Interrogation Log • {new Date().toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </p>
          </div>

          <button
            type="button"
            className="case-close-btn no-print"
            onClick={onClose}
            aria-label="Close case file"
          >
            ✕
          </button>
        </div>

        {/* Case File Body */}
        <div className="case-body">
          {/* Section 1: Root Cause */}
          <section className="case-section root-cause-card">
            <div className="section-label">
              <span className="section-icon">🩺</span>
              <h3>WHAT WAS ACTUALLY BROKEN (ROOT CAUSE)</h3>
            </div>
            <p className="section-text">{report.root_cause}</p>
          </section>

          {/* Section 2: Core Lesson */}
          <section className="case-section lesson-card">
            <div className="section-label">
              <span className="section-icon">💡</span>
              <h3>THE CORE LESSON (MENTAL MODEL)</h3>
            </div>
            <p className="section-text">{report.lesson}</p>
          </section>

          {/* Section 3: Interactive Flashcard */}
          <section className="case-section flashcard-section">
            <div className="section-label">
              <span className="section-icon">🗂️</span>
              <h3>REINFORCEMENT FLASHCARD</h3>
            </div>
            <div className="flashcard-card">
              <div className="flashcard-q">
                <span className="flashcard-tag">QUESTION:</span>
                <p>{report.flashcard?.q}</p>
              </div>

              {showAnswer ? (
                <div className="flashcard-a animated-reveal">
                  <span className="flashcard-tag success">ANSWER:</span>
                  <p>{report.flashcard?.a}</p>
                </div>
              ) : (
                <button
                  type="button"
                  className="reveal-answer-btn no-print"
                  onClick={() => setShowAnswer(true)}
                >
                  🔍 Reveal Flashcard Answer
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Case Footer / Print Actions */}
        <div className="case-footer no-print">
          <button
            type="button"
            className="print-btn"
            onClick={handlePrint}
            title="Export or print this post-mortem as a PDF"
          >
            🖨️ Print / Save as PDF
          </button>
          <button
            type="button"
            className="done-btn"
            onClick={onClose}
          >
            Done Debugging
          </button>
        </div>
      </div>
    </div>
  );
}
