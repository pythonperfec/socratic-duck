import React from 'react';
import GhostDuck from './GhostDuck.jsx';

/**
 * Scene.jsx - Candlelit Study with Drifting Fog for Séance Mode
 * Displays:
 * - Ancient dark study background (soot #17110E, dark wood)
 * - Drifting animated fog layers (#3B3631)
 * - Candle flames flickering
 * - Translucent GhostDuck (with 4 mood states: watching, stirring, restless, at peace)
 * - Spirit selector (COBOL, Fortran, Pascal, BASIC, ALGOL)
 */
export default function Scene({
  mood = 'calm',
  onDuckClick,
  isDraining = false,
  hintLevel = 1,
  activeSpirit = 'COBOL',
  onSpiritChange
}) {
  const spirits = [
    { id: 'COBOL', name: 'COBOL (1959)', desc: 'Mainframe division records' },
    { id: 'Fortran', name: 'Fortran (1957)', desc: 'Numerical scientific computing' },
    { id: 'Pascal', name: 'Pascal (1970)', desc: 'Structured type discipline' },
    { id: 'BASIC', name: 'BASIC (1975)', desc: 'Line numbers & 8-bit RAM' },
    { id: 'ALGOL', name: 'ALGOL (1960)', desc: 'Algorithmic BNF purity' }
  ];

  return (
    <div className="seance-study-container" aria-label="Dark Candlelit Study">
      {/* Drifting Spectral Fog Layers */}
      <div className="fog-layer fog-back"></div>
      <div className="fog-layer fog-mid"></div>

      {/* Ancient Bookcase / Study Elements */}
      <div className="study-wood-frame">
        <div className="study-header-banner">
          <span className="study-occult-symbol">🕯️ ⛧ 🕯️</span>
          <span className="study-title-label">THE CHILL COMMUNION</span>
          <span className="spell-tier-badge">Circle Tier {hintLevel}/4</span>
        </div>

        {/* Ambient Candle Flames */}
        <div className="ambient-candle candle-left">
          <div className="candle-stick"></div>
          <div className="candle-wick"></div>
          <div className="candle-flame"></div>
          <div className="candle-halo"></div>
        </div>

        <div className="ambient-candle candle-right">
          <div className="candle-stick"></div>
          <div className="candle-wick"></div>
          <div className="candle-flame"></div>
          <div className="candle-halo"></div>
        </div>

        {/* Center Séance Altar with Floating Ghost Duck */}
        <div className="seance-altar">
          <div className="altar-circle">
            <svg viewBox="0 0 200 200" className="magic-circle-svg">
              <circle cx="100" cy="100" r="90" stroke="#E8A33D" strokeWidth="1.2" strokeDasharray="4 3" fill="none" opacity="0.4" />
              <circle cx="100" cy="100" r="75" stroke="#F28C0F" strokeWidth="1" strokeDasharray="12 4" fill="none" opacity="0.3" />
              <polygon points="100,20 175,150 25,150" stroke="#E8A33D" strokeWidth="0.8" fill="none" opacity="0.25" />
              <polygon points="100,180 25,50 175,50" stroke="#E8A33D" strokeWidth="0.8" fill="none" opacity="0.25" />
            </svg>
          </div>

          <GhostDuck
            mood={mood}
            onClick={onDuckClick}
            isDraining={isDraining}
          />
        </div>

        {/* Foreground Floating Fog */}
        <div className="fog-layer fog-front"></div>
      </div>

      {/* Spirit Conjuring Bar */}
      <div className="spirit-conjure-bar">
        <div className="spirit-bar-label">
          <span className="spirit-eye-icon">👁️</span>
          <span>Spirit in Communion:</span>
        </div>

        <div className="spirit-selector-group">
          {spirits.map(s => (
            <button
              key={s.id}
              type="button"
              className={`spirit-chip ${activeSpirit === s.id ? 'active' : ''}`}
              onClick={() => onSpiritChange && onSpiritChange(s.id)}
              title={s.desc}
            >
              <span className="spirit-sigil">✦</span>
              <span className="spirit-name">{s.id}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
