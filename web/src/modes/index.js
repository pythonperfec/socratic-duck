import * as duckMode from './duck/index.jsx';
import * as seanceMode from './seance/index.jsx';

export const MODES = {
  duck: duckMode,
  seance: seanceMode
};

export const DEFAULT_MODE = 'duck';

const STORAGE_KEY = 'socratic_duck_active_mode';

/**
 * Safely retrieve persisted mode from localStorage
 */
export function getStoredMode() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && MODES[saved]) {
      return saved;
    }
  } catch (err) {
    console.warn('[ModeRegistry] Could not read localStorage:', err);
  }
  return DEFAULT_MODE;
}

/**
 * Safely persist active mode to localStorage
 */
export function setStoredMode(modeId) {
  try {
    if (MODES[modeId]) {
      localStorage.setItem(STORAGE_KEY, modeId);
    }
  } catch (err) {
    console.warn('[ModeRegistry] Could not write localStorage:', err);
  }
}
