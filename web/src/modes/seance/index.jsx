import Scene from './Scene.jsx';
import Meter from './Meter.jsx';
import Stamp, { BlockedBadge } from './Stamp.jsx';
import ChatBubble from './ChatBubble.jsx';
import ReportCard from './ReportCard.jsx';

export const palette = {
  soot: '#17110E',
  candleAmber: '#E8A33D',
  waxRed: '#8E1B1B',
  bone: '#EFE6D2',
  marigold: '#F28C0F',
  fog: '#3B3631',
  bg: '#17110E',
  primary: '#E8A33D',
  accent: '#F28C0F',
  text: '#EFE6D2',
  card: '#1F1814',
  secondary: '#8E1B1B'
};

export const labels = {
  id: 'seance',
  name: 'Séance',
  title: 'The Ghost in the Machine',
  tagline: 'Séance Debugger • Ancient Compilers Interrogate from Beyond the Grave',
  icon: '🕯️',
  solveBtn: '🕯️ Exorcise Bug',
  solveLoading: '🕯️ Communion...',
  testStampBtn: '🧪 Test Seal',
  testDrainBtn: '🧪 Test Melt',
  blockedLabel: 'Spirits Silenced',
  moodLabel: 'Spectral State:',
  moods: {
    calm: '👁️ watching',
    squint: '🔮 stirring',
    grumpy: '⚡ restless',
    delighted: '🕊️ at peace'
  }
};

export {
  Scene,
  Meter,
  Stamp,
  BlockedBadge,
  ChatBubble,
  ReportCard
};
