import React from 'react';
import Tub from '../../components/Tub.jsx';
import PatienceMeter from '../../components/PatienceMeter.jsx';
import BlabStamp, { BlockedBadge } from '../../components/BlabStamp.jsx';
import CaseReport from '../../components/CaseReport.jsx';

export const palette = {
  soot: null,
  bg: '#E9F1EF',
  primary: '#2E9C9A',
  accent: '#F5C400',
  text: '#1F2D2D',
  card: '#FBF4E4',
  secondary: '#F2B6B0'
};

export const labels = {
  id: 'duck',
  name: 'Duck',
  title: 'Socratic Duck',
  tagline: 'Bathroom Debugger • Strictly Engineered to Never Give the Fix',
  icon: '🦆',
  solveBtn: '🏆 Solved it!',
  solveLoading: '🦆 Filing Case...',
  testStampBtn: '🧪 Test Stamp',
  testDrainBtn: '🧪 Test Drain',
  blockedLabel: 'Blabs Intercepted',
  moodLabel: 'Duck Mood:',
  moods: {
    calm: '😌 calm',
    squint: '🧐 squint',
    grumpy: '😤 grumpy',
    delighted: '✨ delighted'
  }
};

export function Scene(props) {
  return <Tub {...props} />;
}

export function Meter(props) {
  return <PatienceMeter {...props} />;
}

export function Stamp(props) {
  return <BlabStamp {...props} />;
}

export { BlockedBadge };

export function ReportCard(props) {
  return <CaseReport {...props} />;
}

export function ChatBubble({ msg, isDuck }) {
  return (
    <div className={`soap-bubble ${isDuck ? 'duck-bubble' : 'user-bubble'}`}>
      <div className="bubble-sheen"></div>
      {msg.image && (
        <div className="bubble-attachment">
          <img src={msg.image} alt="Code screenshot" className="attached-img" />
        </div>
      )}
      <div className="bubble-text">{msg.text}</div>
      <div className="bubble-footer">
        {msg.patienceDelta !== undefined && isDuck && (
          <span className={`patience-tag ${msg.patienceDelta >= 0 ? 'gain' : 'loss'}`}>
            {msg.patienceDelta > 0 ? `+${msg.patienceDelta} Patience` : `${msg.patienceDelta} Patience`}
          </span>
        )}
        <span className="bubble-timestamp">{msg.timestamp || 'Just now'}</span>
      </div>
    </div>
  );
}
