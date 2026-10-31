import React from 'react';

/**
 * GhostDuck.jsx - Translucent SVG Spectral Duck for Séance Mode
 * Moods:
 * - calm (watching)
 * - squint (stirring)
 * - grumpy (restless)
 * - delighted (at peace)
 */
export default function GhostDuck({ mood = 'calm', onClick, isDraining = false }) {
  // Map internal moods to spectral expressions
  const getEyeExpression = () => {
    switch (mood) {
      case 'squint':
        return (
          <g className="ghost-eyes ghost-eyes-stirring">
            {/* Skeptical spectral squint */}
            <path d="M 64 64 Q 74 61 84 65" stroke="#17110E" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="74" cy="67" r="3.5" fill="#E8A33D" />
            <circle cx="75" cy="66" r="1.2" fill="#EFE6D2" />
            {/* Occult monocle ring */}
            <circle cx="74" cy="65" r="9" stroke="#E8A33D" strokeWidth="1.8" fill="none" opacity="0.8" />
            <line x1="82" y1="71" x2="88" y2="78" stroke="#E8A33D" strokeWidth="1.5" />
          </g>
        );
      case 'grumpy':
        return (
          <g className="ghost-eyes ghost-eyes-restless">
            {/* Stern angled spectral brow */}
            <path d="M 62 58 L 78 64" stroke="#8E1B1B" strokeWidth="3.2" strokeLinecap="round" />
            <ellipse cx="72" cy="66" rx="4" ry="3" fill="#8E1B1B" />
            <circle cx="73" cy="65" r="1.5" fill="#EFE6D2" />
          </g>
        );
      case 'delighted':
        return (
          <g className="ghost-eyes ghost-eyes-peace">
            {/* Closed contented crescent eyes */}
            <path d="M 64 66 Q 74 58 84 66" stroke="#E8A33D" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="74" cy="52" r="1.8" fill="#F28C0F" className="ghost-sparkle" />
          </g>
        );
      default:
        // Calm / watching: Large luminous spectral eyes
        return (
          <g className="ghost-eyes ghost-eyes-watching">
            <circle cx="74" cy="63" r="5" fill="#17110E" />
            <circle cx="75" cy="61.5" r="2" fill="#EFE6D2" />
            <circle cx="74" cy="63" r="6" stroke="#E8A33D" strokeWidth="1" fill="none" opacity="0.6" />
          </g>
        );
    }
  };

  const getBeak = () => {
    switch (mood) {
      case 'grumpy':
        return (
          <path
            d="M 80 67 C 93 68 100 73 97 78 C 88 80 80 77 78 72 Z"
            fill="#E8A33D"
            stroke="#8E1B1B"
            strokeWidth="1.5"
          />
        );
      case 'delighted':
        return (
          <g>
            <path
              d="M 80 67 C 94 65 102 70 98 75 C 90 77 82 75 79 70 Z"
              fill="#F28C0F"
              stroke="#E8A33D"
              strokeWidth="1.5"
            />
            {/* Gentle smile curve */}
            <path d="M 82 72 Q 88 77 94 73" stroke="#8E1B1B" strokeWidth="1.2" fill="none" />
          </g>
        );
      default:
        return (
          <path
            d="M 80 67 C 94 67 101 71 98 76 C 90 78 82 76 79 71 Z"
            fill="#E8A33D"
            stroke="#17110E"
            strokeWidth="1.2"
          />
        );
    }
  };

  return (
    <div
      className={`ghost-duck-container ${isDraining ? 'ghost-draining' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      title="Commune with the Ghost Duck"
    >
      <svg
        className={`ghost-duck-svg mood-${mood}`}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Spectral Ethereal Glow Filter */}
          <filter id="ghostGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Ghost body gradient */}
          <linearGradient id="ghostGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EFE6D2" stopOpacity="0.88" />
            <stop offset="60%" stopColor="#E8A33D" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#3B3631" stopOpacity="0.25" />
          </linearGradient>

          {/* Candlelight highlight */}
          <radialGradient id="candleLight" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#17110E" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ethereal aura cloud */}
        <circle cx="80" cy="85" r="55" fill="url(#candleLight)" className="ghost-halo" />

        {/* Floating Ghost Duck Body with wispy ectoplasm tail */}
        <g filter="url(#ghostGlow)">
          <path
            d="M 50 110 
               C 30 115 15 125 18 102 
               C 20 88 38 85 52 82 
               C 50 72 55 52 68 45 
               C 85 36 98 48 95 65 
               C 105 70 125 78 128 95 
               C 132 115 110 128 85 124 
               C 70 122 60 128 50 110 Z"
            fill="url(#ghostGrad)"
            stroke="#EFE6D2"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Wispy ectoplasmic ripples at bottom */}
          <path
            d="M 22 108 Q 30 122 42 114 Q 58 130 75 118 Q 95 132 112 119 Q 124 126 128 108"
            stroke="#E8A33D"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            fill="none"
            opacity="0.7"
          />

          {/* Ghost Wing wisps */}
          <path
            d="M 58 88 C 72 84 94 88 102 98 C 94 105 75 106 62 98 Z"
            fill="#EFE6D2"
            fillOpacity="0.25"
            stroke="#E8A33D"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Beak */}
          {getBeak()}

          {/* Spectral Eye */}
          {getEyeExpression()}

          {/* Ancient Runes / Compiler Marks on Ghost Flank */}
          <text x="68" y="102" fill="#8E1B1B" fontSize="6.5" fontFamily="monospace" opacity="0.6">
            {mood === 'delighted' ? 'HALT 0' : mood === 'grumpy' ? 'TRAP 7' : 'GOTO'}
          </text>
        </g>
      </svg>
    </div>
  );
}
