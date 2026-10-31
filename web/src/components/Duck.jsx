import React from 'react';

/**
 * Rubber Duck with 4 distinct SVG mood expressions:
 * - calm: Contented, steady gaze, gentle smile
 * - squint: Skeptical narrowed eye, raised eyebrow, questioning bill
 * - grumpy: Downward furrowed brow, stern flat bill, annoyed
 * - delighted: Arched happy eyes, open smiling bill, blushing soap-pink cheeks
 */
export default function Duck({ mood = 'calm', className = '' }) {
  // Normalize mood
  const activeMood = ['calm', 'squint', 'grumpy', 'delighted'].includes(mood) ? mood : 'calm';

  return (
    <div className={`duck-container ${activeMood} ${className}`} title={`Duck mood: ${activeMood}`}>
      <svg
        viewBox="0 0 160 140"
        className="duck-svg"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`Rubber duck with ${activeMood} expression`}
      >
        <defs>
          {/* Subtle warm duck shading */}
          <radialGradient id="duckBodyGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="60%" stopColor="#F5C400" />
            <stop offset="100%" stopColor="#D9A800" />
          </radialGradient>

          <radialGradient id="duckHeadGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFE580" />
            <stop offset="70%" stopColor="#F5C400" />
            <stop offset="100%" stopColor="#DEAB00" />
          </radialGradient>

          <linearGradient id="beakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9F43" />
            <stop offset="100%" stopColor="#EE5253" />
          </linearGradient>

          <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#1F2D2D" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Water Ripple Shadow below Duck */}
        <ellipse cx="80" cy="122" rx="46" ry="10" fill="#2E9C9A" opacity="0.3" />

        {/* Tail Feather */}
        <path
          d="M 124 95 Q 146 80 144 68 Q 134 76 122 84 Z"
          fill="#D9A800"
        />

        {/* Duck Main Body */}
        <ellipse
          cx="86"
          cy="94"
          rx="44"
          ry="30"
          fill="url(#duckBodyGrad)"
          filter="url(#softShadow)"
        />

        {/* Wing with mood adjustments */}
        {activeMood === 'delighted' ? (
          /* Wing flapping happily up */
          <path
            d="M 68 88 C 72 70, 96 66, 110 74 C 114 86, 96 100, 74 96 Z"
            fill="#D9A800"
            stroke="#C49500"
            strokeWidth="1.5"
            transform="rotate(-12 86 84)"
          />
        ) : (
          /* Rested folded wing */
          <path
            d="M 66 94 C 74 80, 102 82, 112 92 C 104 106, 78 108, 66 94 Z"
            fill="#DEAB00"
            opacity="0.9"
            stroke="#C49500"
            strokeWidth="1"
          />
        )}

        {/* Head */}
        <circle
          cx="52"
          cy="52"
          r="26"
          fill="url(#duckHeadGrad)"
          filter="url(#softShadow)"
        />

        {/* Forehead Specular highlight */}
        <ellipse cx="44" cy="38" rx="8" ry="4" fill="#FFF2A8" opacity="0.6" transform="rotate(-25 44 38)" />

        {/* Rosy Cheeks for Delighted */}
        {activeMood === 'delighted' && (
          <ellipse cx="40" cy="62" rx="6" ry="3.5" fill="#F2B6B0" opacity="0.85" />
        )}

        {/* --- MOOD EYES --- */}
        {activeMood === 'calm' && (
          /* Calm open round friendly eyes */
          <g className="duck-eye-calm">
            <ellipse cx="44" cy="46" rx="4.5" ry="5.5" fill="#1F2D2D" />
            <circle cx="42.5" cy="44" r="1.8" fill="#FFFFFF" />
            {/* Subtle gentle curved eyebrow */}
            <path d="M 39 37 Q 45 35 49 38" stroke="#8A6700" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {activeMood === 'squint' && (
          /* Squint / Skeptical: one eye narrowed, eyebrow cocked */
          <g className="duck-eye-squint">
            {/* Narrowed squint eye */}
            <path d="M 38 48 Q 45 44 51 47" stroke="#1F2D2D" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 40 48 Q 45 51 50 48" stroke="#1F2D2D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            {/* Arched skeptical eyebrow */}
            <path d="M 37 36 Q 45 31 52 35" stroke="#8A6700" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {activeMood === 'grumpy' && (
          /* Grumpy / Furrowed brow, irritated flat stare */
          <g className="duck-eye-grumpy">
            <ellipse cx="45" cy="48" rx="4" ry="4.5" fill="#1F2D2D" />
            <circle cx="43.5" cy="46.5" r="1.3" fill="#FFFFFF" />
            {/* Angry downward angled eyebrow */}
            <path d="M 37 39 L 51 44" stroke="#8A6700" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          </g>
        )}

        {activeMood === 'delighted' && (
          /* Delighted: Happy smiling arc eyes (^ ^) */
          <g className="duck-eye-delighted">
            <path d="M 38 48 Q 44 40 50 48" stroke="#1F2D2D" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 37 35 Q 44 31 51 36" stroke="#8A6700" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* --- MOOD BEAK / BILL --- */}
        {activeMood === 'calm' && (
          /* Classic rounded beak */
          <g className="duck-bill-calm">
            <path
              d="M 32 50 C 18 52, 12 58, 20 63 C 28 65, 34 63, 36 58 Z"
              fill="url(#beakGrad)"
            />
            {/* Smile line */}
            <path d="M 22 57 Q 30 58 35 56" stroke="#C0392B" strokeWidth="1" fill="none" />
            <circle cx="28" cy="54" r="0.9" fill="#962D22" />
          </g>
        )}

        {activeMood === 'squint' && (
          /* Slightly tilted questioning beak */
          <g className="duck-bill-squint">
            <path
              d="M 32 50 C 17 50, 14 56, 21 62 C 29 65, 34 62, 36 57 Z"
              fill="url(#beakGrad)"
            />
            <path d="M 21 56 Q 28 57 34 54" stroke="#C0392B" strokeWidth="1.2" fill="none" />
            <circle cx="27" cy="53" r="0.9" fill="#962D22" />
          </g>
        )}

        {activeMood === 'grumpy' && (
          /* Downward flat / frown beak */
          <g className="duck-bill-grumpy">
            <path
              d="M 32 52 C 18 55, 14 62, 22 66 C 29 67, 34 64, 36 60 Z"
              fill="url(#beakGrad)"
            />
            {/* Stern frown crease */}
            <path d="M 20 61 Q 28 58 35 60" stroke="#8B0000" strokeWidth="1.6" fill="none" />
            <circle cx="26" cy="57" r="0.9" fill="#962D22" />
          </g>
        )}

        {activeMood === 'delighted' && (
          /* Open laughing / joyful beak */
          <g className="duck-bill-delighted">
            {/* Upper bill */}
            <path
              d="M 32 48 C 16 48, 12 55, 22 58 C 29 59, 34 56, 36 52 Z"
              fill="url(#beakGrad)"
            />
            {/* Open mouth interior */}
            <path
              d="M 22 56 Q 28 64 34 57 Z"
              fill="#900C3F"
            />
            {/* Lower jaw */}
            <path
              d="M 24 59 Q 29 66 35 61"
              stroke="#D35400"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="27" cy="51" r="0.9" fill="#962D22" />
          </g>
        )}
      </svg>
    </div>
  );
}
