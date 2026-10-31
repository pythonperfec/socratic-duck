import React, { useEffect } from 'react';

/**
 * BlabStamp.jsx - High-impact rubber stamp that slams down when the guard blocks a leak
 * Features:
 * - Rotated red-orange stamp border and distressed ink typography
 * - Heavy thud slam-down scale and vibration keyframes
 * - Audible visual impact
 * - Includes a companion badge showing total blocked leaks count
 */
export function BlockedBadge({ count = 0, onClick }) {
  return (
    <div
      className={`blocked-badge ${count > 0 ? 'has-blocks' : ''}`}
      onClick={onClick}
      title="Number of answers the Socratic guard has intercepted"
      role="status"
    >
      <span className="badge-stamp-icon">🛡️</span>
      <span className="badge-label">LEAKS BLOCKED</span>
      <span className="badge-count">{count}</span>
    </div>
  );
}

export default function BlabStamp({ show = false, onDismiss }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        if (onDismiss) onDismiss();
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  if (!show) return null;

  return (
    <div className="stamp-overlay" onClick={onDismiss} role="alert" aria-live="assertive">
      <div className="stamp-card" title="Click to dismiss">
        <div className="stamp-body">
          <div className="stamp-outer-border">
            <div className="stamp-inner-border">
              <div className="stamp-subtext">GUARD HARNESS INTERCEPT</div>
              <div className="stamp-headline">DUCK ALMOST BLABBED!</div>
              <div className="stamp-warning">ANSWER LEAK PREVENTED • SOCRATIC INTEGRITY PRESERVED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
