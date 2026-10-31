import React, { useEffect, useState } from 'react';

/**
 * PatienceMeter.jsx - Rubber-duck-yellow "water level" gauge
 * Represents the Duck's patience (0 - 100), starting at 70.
 * Styled as a charming bathroom water column / pressure gauge with rising bubbles.
 */
export default function PatienceMeter({ patience = 70, lastDelta = 0 }) {
  const [showDelta, setShowDelta] = useState(false);
  const clampedPatience = Math.max(0, Math.min(100, patience));

  // Trigger brief floating delta badge when lastDelta changes
  useEffect(() => {
    if (lastDelta !== 0) {
      setShowDelta(true);
      const timer = setTimeout(() => setShowDelta(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [lastDelta, patience]);

  // Status descriptor
  let statusText = 'Attentive';
  let statusMood = 'calm';
  if (clampedPatience >= 80) {
    statusText = 'Delighted';
    statusMood = 'delighted';
  } else if (clampedPatience >= 40) {
    statusText = 'Attentive';
    statusMood = 'calm';
  } else if (clampedPatience > 0) {
    statusText = 'Squinting';
    statusMood = 'grumpy';
  } else {
    statusText = 'Sighed (Level Up!)';
    statusMood = 'grumpy';
  }

  return (
    <div className="patience-meter-card" aria-label="Duck Patience Gauge">
      <div className="meter-header">
        <span className="meter-title">
          <span className="meter-icon">🌡️</span> PATIENCE
        </span>
        <span className={`meter-status ${statusMood}`}>
          {statusText}
        </span>
      </div>

      <div className="gauge-housing">
        {/* Delta Pop Badge */}
        {showDelta && lastDelta !== 0 && (
          <div className={`delta-badge ${lastDelta > 0 ? 'positive' : 'negative'}`}>
            {lastDelta > 0 ? `+${lastDelta}` : lastDelta}
          </div>
        )}

        {/* Vintage Gauge Column */}
        <div className="gauge-glass" title={`${clampedPatience}% Patience`}>
          {/* Tick marks along the glass column */}
          <div className="gauge-ticks">
            <span className="tick tick-100" data-label="100"></span>
            <span className="tick tick-75" data-label="75"></span>
            <span className="tick tick-50" data-label="50"></span>
            <span className="tick tick-25" data-label="25"></span>
            <span className="tick tick-0" data-label="0"></span>
          </div>

          {/* Liquid level */}
          <div
            className="gauge-liquid"
            style={{ height: `${clampedPatience}%` }}
          >
            {/* Wave meniscus at top of liquid */}
            <div className="liquid-wave"></div>
            {/* Tiny rising bubbles inside the liquid */}
            <div className="liquid-bubble b1"></div>
            <div className="liquid-bubble b2"></div>
            <div className="liquid-bubble b3"></div>
          </div>
        </div>

        {/* Gauge numerical readout */}
        <div className="gauge-readout">
          <span className="readout-value">{clampedPatience}</span>
          <span className="readout-max">/100</span>
        </div>
      </div>
    </div>
  );
}
