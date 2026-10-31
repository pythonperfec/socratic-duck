import React from 'react';

/**
 * ModeSwitcher.jsx - Neutral segmented control for switching app modes ("Duck" | "Séance")
 * Persisted in localStorage with try/catch.
 */
export default function ModeSwitcher({ currentMode = 'duck', onModeChange }) {
  const modes = [
    { id: 'duck', label: '🦆 Duck', title: 'Bathroom Debugger (Default)' },
    { id: 'seance', label: '🕯️ Séance', title: 'Ghost in the Machine (Ancient Compilers)' }
  ];

  return (
    <div className="mode-switcher-segmented" role="radiogroup" aria-label="Debugger Mode Switcher">
      {modes.map((m) => {
        const isActive = currentMode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={`mode-segment-btn ${isActive ? 'active' : ''}`}
            onClick={() => onModeChange(m.id)}
            title={m.title}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
