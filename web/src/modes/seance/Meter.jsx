import React from 'react';

/**
 * Meter.jsx - Candle Patience Meter for Séance Mode
 * Displays an antique altar candle whose wax burns down as patience drops.
 * Patience: 0-100%
 */
export default function Meter({ patience = 70, lastDelta = 0 }) {
  const clampPatience = Math.max(0, Math.min(100, Math.round(patience)));

  const getStatusText = (val) => {
    if (val > 80) return "Vigorous flame • Pure focus";
    if (val > 55) return "Steadily burning • Thoughtful logic";
    if (val > 25) return "Wax gutters • Guttering patience";
    if (val > 0) return "Dying ember • Spirit nears departure";
    return "Flame extinguished • The circle breaks";
  };

  const getFlameClass = (val) => {
    if (val === 0) return 'flame-dead';
    if (val < 30) return 'flame-gutter';
    if (val > 75) return 'flame-strong';
    return 'flame-normal';
  };

  // Height percentage of the wax body (minimum 12% so candle doesn't completely vanish)
  const waxHeightPercent = Math.max(12, clampPatience);

  return (
    <div className="candle-meter-container" aria-label="Candle Patience Meter">
      <div className="candle-meter-header">
        <span className="meter-label-seance">🕯️ Spirit Patience:</span>
        <span className="meter-numeric-seance">{clampPatience}/100</span>
      </div>

      <div className="candle-meter-track">
        {/* The Candle Pillar Assembly */}
        <div className="altar-candle-holder">
          {/* Candle Body containing the dynamic wax level */}
          <div className="candle-pillar-shaft">
            <div
              className="candle-wax-fill"
              style={{ height: `${waxHeightPercent}%` }}
            >
              {/* Flickering Flame at the top of the wax */}
              <div className={`candle-wick-flame ${getFlameClass(clampPatience)}`}>
                <div className="wick-stem"></div>
                {clampPatience > 0 && (
                  <>
                    <div className="flame-core"></div>
                    <div className="flame-aura"></div>
                  </>
                )}
              </div>

              {/* Dripping Wax Droplets along the candle column */}
              <div className="wax-drips-container">
                <div className="wax-drip drip-1"></div>
                <div className="wax-drip drip-2"></div>
                <div className="wax-drip drip-3"></div>
              </div>
            </div>
          </div>

          {/* Heavy Antique Pewter Base */}
          <div className="candle-holder-base">
            <div className="holder-rim"></div>
            <div className="holder-dish"></div>
          </div>
        </div>

        {/* Delta feedback badge */}
        {lastDelta !== 0 && (
          <div className={`seance-delta-indicator ${lastDelta > 0 ? 'gain' : 'loss'}`}>
            {lastDelta > 0 ? `+${lastDelta} wax` : `${lastDelta} melted`}
          </div>
        )}
      </div>

      <div className="candle-meter-status">
        <span className="status-rune">✦</span>
        <span className="status-reading">{getStatusText(clampPatience)}</span>
      </div>
    </div>
  );
}
