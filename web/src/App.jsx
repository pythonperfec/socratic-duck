import React, { useState, useEffect } from 'react';
import Chat from './components/Chat.jsx';
import Composer from './components/Composer.jsx';
import { MODES, DEFAULT_MODE, getStoredMode, setStoredMode } from './modes/index.js';
import ModeSwitcher from './modes/ModeSwitcher.jsx';
import { INITIAL_MESSAGES } from './mock.js';

export default function App() {
  const [mode, setMode] = useState(getStoredMode);
  const [spirit, setSpirit] = useState('COBOL');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [mood, setMood] = useState('calm');
  const [patience, setPatience] = useState(70);
  const [lastDelta, setLastDelta] = useState(4);
  const [hintLevel, setHintLevel] = useState(1);
  const [isDraining, setIsDraining] = useState(false);
  const [blockedCount, setBlockedCount] = useState(0);
  const [stampTriggered, setStampTriggered] = useState(false);
  const [isDuckTyping, setIsDuckTyping] = useState(false);

  // Solved it! Case report state
  const [caseReport, setCaseReport] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Synchronize mode attribute with document.body for theme styles
  useEffect(() => {
    document.body.dataset.mode = mode;
  }, [mode]);

  // Handle mode change via ModeSwitcher
  const handleModeChange = (newMode) => {
    if (MODES[newMode]) {
      setMode(newMode);
      setStoredMode(newMode);
    }
  };

  // Active mode components & labels from registry
  const activeModeConfig = MODES[mode] || MODES[DEFAULT_MODE];
  const {
    Scene: ModeScene,
    Meter: ModeMeter,
    Stamp: ModeStamp,
    BlockedBadge: ModeBlockedBadge,
    ChatBubble: ModeChatBubble,
    ReportCard: ModeReportCard,
    labels: modeLabels
  } = activeModeConfig;

  // Squeeze the duck / spirit manually (Easter egg!)
  const handleDuckSqueeze = () => {
    const moods = ['calm', 'squint', 'grumpy', 'delighted'];
    const nextMood = moods[(moods.indexOf(mood) + 1) % moods.length];
    setMood(nextMood);
  };

  // Trigger the Stamp for testing / dev review
  const triggerDevStamp = () => {
    setBlockedCount(prev => prev + 1);
    setStampTriggered(true);
  };

  // Trigger Patience Drain & Sigh (when patience reaches 0)
  const triggerDrainSequence = () => {
    setIsDraining(true);
    setMood('grumpy');
    setHintLevel(prev => Math.min(4, prev + 1));

    setTimeout(() => {
      setIsDraining(false);
      setPatience(60); // Recover patience for higher hint tier
      setLastDelta(0);
    }, 2800);
  };

  // Handle "Solved it! 🏆" post-mortem report generation
  const handleSolvedIt = async () => {
    setIsGeneratingReport(true);
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messages.map(m => ({ role: m.role, text: m.text })),
          mode,
          spirit: mode === 'seance' ? spirit : undefined
        })
      });

      if (!response.ok) {
        throw new Error(`Report generation failed: ${response.status}`);
      }

      const reportData = await response.json();
      setCaseReport(reportData);
      setMood('delighted');
    } catch (err) {
      console.error('Failed to generate case report:', err);
      // Fallback post-mortem
      setCaseReport({
        root_cause: "The state mutation or loop bounds violated runtime expectations.",
        lesson: "Always verify variable state at runtime rather than assuming static types.",
        flashcard: {
          q: "What was the core realization from this debugging session?",
          a: "Tracing the execution flow directly reveals hidden assumptions."
        },
        farewell: mode === 'seance' ? `The spirit of ${spirit} bows from across the ethereal veil. The bug is exorcised.` : undefined
      });
      setMood('delighted');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Handle user sending a new message (text + optional image) via POST /api/chat
  const handleSendMessage = async ({ text, image }) => {
    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: text || '(Sent code screenshot)',
      image,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsDuckTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          history: updatedMessages.map(m => ({
            role: m.role,
            text: m.text
          })),
          image: image || undefined,
          hintLevel,
          mode,
          spirit: mode === 'seance' ? spirit : undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();

      const newMood = data.mood || 'calm';
      const delta = typeof data.patience_delta === 'number' ? data.patience_delta : 0;
      const nextPatience = Math.max(0, Math.min(100, patience + delta));

      setMood(newMood);
      setLastDelta(delta);
      setPatience(nextPatience);

      if (data.blocked > 0) {
        setBlockedCount(prev => prev + data.blocked);
        setStampTriggered(true);
      }

      // If patience hits 0, trigger the duck sigh, hint level escalation, and water drain animation!
      if (nextPatience === 0) {
        triggerDrainSequence();
      }

      const duckMsg = {
        id: `d-${Date.now()}`,
        role: 'duck',
        mood: nextPatience === 0 ? 'grumpy' : newMood,
        patienceDelta: delta,
        text: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, duckMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const isSeance = mode === 'seance';
      const duckMsg = {
        id: `d-${Date.now()}`,
        role: 'duck',
        mood: 'grumpy',
        patienceDelta: -2,
        text: isSeance
          ? `The ethereal veil shudders: Trouble communicating with backend (${err.message})`
          : `Quack! Trouble communicating with server: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, duckMsg]);
    } finally {
      setIsDuckTyping(false);
    }
  };

  return (
    <div className={`bathroom-app app-mode-${mode}`}>
      {/* Post-Mortem Case File / Ofrenda Modal */}
      {caseReport && (
        <ModeReportCard
          report={caseReport}
          onClose={() => setCaseReport(null)}
          spirit={spirit}
        />
      )}

      {/* Rubber Stamp / Wax Seal Overlay */}
      <ModeStamp
        show={stampTriggered}
        onDismiss={() => setStampTriggered(false)}
      />

      {/* Top Header Bar */}
      <header className="app-header no-print">
        <div className="brand-group">
          <div className="brand-icon">{modeLabels.icon || '🦆'}</div>
          <div>
            <h1 className="brand-title">{modeLabels.title || 'Socratic Duck'}</h1>
            <p className="brand-tagline">{modeLabels.tagline}</p>
          </div>
        </div>

        {/* Mode Switcher Segmented Control */}
        <ModeSwitcher currentMode={mode} onModeChange={handleModeChange} />

        <div className="header-actions">
          {/* Solved it! Button */}
          <button
            type="button"
            className="solved-it-btn"
            onClick={handleSolvedIt}
            disabled={isGeneratingReport}
            title="Generate Post-Mortem Report"
          >
            {isGeneratingReport ? (modeLabels.solveLoading || '🦆 Filing...') : (modeLabels.solveBtn || '🏆 Solved it!')}
          </button>

          {/* Blocked Leaks Badge */}
          <ModeBlockedBadge
            count={blockedCount}
            onClick={triggerDevStamp}
          />

          {/* Dev Test Buttons */}
          <button
            type="button"
            className="dev-stamp-btn"
            onClick={triggerDevStamp}
            title="Test the leak stamp animation"
          >
            {modeLabels.testStampBtn || '🧪 Test Stamp'}
          </button>

          <button
            type="button"
            className="dev-drain-btn"
            onClick={triggerDrainSequence}
            title="Test patience reaching 0"
          >
            {modeLabels.testDrainBtn || '🧪 Test Drain'}
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="app-workspace no-print">
        {/* Left Column: Scene & Patience Meter */}
        <section className="scene-column" aria-label="Scene & State">
          <ModeScene
            mood={mood}
            onDuckClick={handleDuckSqueeze}
            isDraining={isDraining}
            hintLevel={hintLevel}
            activeSpirit={spirit}
            onSpiritChange={setSpirit}
          />

          <div className="controls-row">
            <ModeMeter
              patience={patience}
              lastDelta={lastDelta}
            />

            {/* Quick Mood Selector for Judge & Developer Demos */}
            <div className="mood-sampler" title="Demonstrate all 4 mood expressions">
              <span className="sampler-label">{modeLabels.moodLabel || 'Mood:'}</span>
              <div className="mood-pill-group">
                {['calm', 'squint', 'grumpy', 'delighted'].map(m => (
                  <button
                    key={m}
                    type="button"
                    className={`mood-pill ${mood === m ? 'active' : ''}`}
                    onClick={() => setMood(m)}
                  >
                    {modeLabels.moods?.[m] || m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Dialogue & Composer */}
        <section className="dialogue-column" aria-label="Socratic Interrogation">
          <Chat
            messages={messages}
            isDuckTyping={isDuckTyping}
            ChatBubbleComponent={ModeChatBubble}
            modeId={mode}
          />

          <Composer
            onSend={handleSendMessage}
            disabled={isDuckTyping || isGeneratingReport}
          />
        </section>
      </main>
    </div>
  );
}
