import React from 'react';

/**
 * Stamp.jsx - Wax-Seal Stamp for Séance Mode
 * Displays the wax-seal stamp: "THE SPIRIT ALMOST SPOKE"
 * Triggered whenever the guard harness blocks an answer leak.
 */
export default function Stamp({ show = false, onDismiss }) {
  if (!show) return null;

  return (
    <div
      className="seance-stamp-overlay"
      onClick={onDismiss}
      role="alert"
      aria-live="assertive"
    >
      <div className="seance-wax-seal" onClick={(e) => e.stopPropagation()}>
        {/* Scalloped molten wax border */}
        <div className="wax-melt-rim"></div>

        {/* Embossed Wax Medallion */}
        <div className="wax-center-die">
          <div className="wax-runic-ring">
            <span>• NON REVELARE • SILENTIUM •</span>
          </div>

          <div className="wax-main-inscription">
            <span className="seal-top-rune">🕯️ ⚔️ 🕯️</span>
            <h2 className="seal-headline">THE SPIRIT ALMOST SPOKE</h2>
            <p className="seal-subline">The ethereal guard silenced the forbidden answer</p>
          </div>

          <div className="wax-sigil-icon">☠️</div>
        </div>

        <button
          type="button"
          className="seal-dismiss-btn"
          onClick={onDismiss}
        >
          Resume the Séance ✕
        </button>
      </div>
    </div>
  );
}

/**
 * Header Badge displaying total silenced spirits
 */
export function BlockedBadge({ count = 0, onClick }) {
  if (count === 0) return null;

  return (
    <button
      type="button"
      className="seance-blocked-badge"
      onClick={onClick}
      title={`${count} spirit leaks prevented by the ethereal guard`}
    >
      <span className="badge-skull">🩸</span>
      <span className="badge-count-text">{count} Silenced</span>
    </button>
  );
}
