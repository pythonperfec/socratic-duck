import React, { useState } from 'react';
import Tub from './components/Tub.jsx';
import Chat from './components/Chat.jsx';
import Composer from './components/Composer.jsx';
import PatienceMeter from './components/PatienceMeter.jsx';
import BlabStamp, { BlockedBadge } from './components/BlabStamp.jsx';
import { INITIAL_MESSAGES } from './mock.js';

export default function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [mood, setMood] = useState('calm');
  const [patience, setPatience] = useState(70);
  const [lastDelta, setLastDelta] = useState(4);
  const [blockedCount, setBlockedCount] = useState(0);
  const [stampTriggered, setStampTriggered] = useState(false);
  const [isDuckTyping, setIsDuckTyping] = useState(false);

  // Squeeze the duck manually (Easter egg!)
  const handleDuckSqueeze = () => {
    const moods = ['calm', 'squint', 'grumpy', 'delighted'];
    const nextMood = moods[(moods.indexOf(mood) + 1) % moods.length];
    setMood(nextMood);
  };

  // Trigger the Blab Stamp for testing / dev review
  const triggerDevStamp = () => {
    setBlockedCount(prev => prev + 1);
    setStampTriggered(true);
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
          image: image || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();

      const newMood = data.mood || 'calm';
      const delta = typeof data.patience_delta === 'number' ? data.patience_delta : 0;

      setMood(newMood);
      setLastDelta(delta);
      setPatience(prev => Math.max(0, Math.min(100, prev + delta)));

      if (data.blocked > 0) {
        setBlockedCount(prev => prev + data.blocked);
        setStampTriggered(true);
      }

      const duckMsg = {
        id: `d-${Date.now()}`,
        role: 'duck',
        mood: newMood,
        patienceDelta: delta,
        text: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, duckMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const duckMsg = {
        id: `d-${Date.now()}`,
        role: 'duck',
        mood: 'grumpy',
        patienceDelta: -2,
        text: `Quack! Trouble communicating with server: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, duckMsg]);
    } finally {
      setIsDuckTyping(false);
    }
  };

  return (
    <div className="bathroom-app">
      {/* Rubber Stamp Overlay (Triggered on answer leak attempt) */}
      <BlabStamp
        show={stampTriggered}
        onDismiss={() => setStampTriggered(false)}
      />

      {/* Top Header Bar */}
      <header className="app-header">
        <div className="brand-group">
          <div className="brand-icon">🦆</div>
          <div>
            <h1 className="brand-title">Socratic Duck</h1>
            <p className="brand-tagline">Bathroom Debugger • Strictly Engineered to Never Give the Fix</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Blocked Leaks Badge */}
          <BlockedBadge
            count={blockedCount}
            onClick={triggerDevStamp}
          />

          {/* Hidden/Dev Stamp Trigger Button */}
          <button
            type="button"
            className="dev-stamp-btn"
            onClick={triggerDevStamp}
            title="Test the rubber stamp animation"
          >
            🧪 Test Blab Stamp
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="app-workspace">
        {/* Left Column: Bathtub Scene & Patience Meter */}
        <section className="scene-column" aria-label="Bathtub & State">
          <Tub
            mood={mood}
            onDuckClick={handleDuckSqueeze}
          />

          <div className="controls-row">
            <PatienceMeter
              patience={patience}
              lastDelta={lastDelta}
            />

            {/* Quick Mood Selector for Judge & Developer Demos */}
            <div className="mood-sampler" title="Demonstrate all 4 SVG Duck expressions">
              <span className="sampler-label">Duck Mood:</span>
              <div className="mood-pill-group">
                {['calm', 'squint', 'grumpy', 'delighted'].map(m => (
                  <button
                    key={m}
                    type="button"
                    className={`mood-pill ${mood === m ? 'active' : ''}`}
                    onClick={() => setMood(m)}
                  >
                    {m === 'calm' && '😌 calm'}
                    {m === 'squint' && '🧐 squint'}
                    {m === 'grumpy' && '😤 grumpy'}
                    {m === 'delighted' && '✨ delighted'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Soap-Bubble Chat & Composer */}
        <section className="dialogue-column" aria-label="Socratic Interrogation">
          <Chat
            messages={messages}
            isDuckTyping={isDuckTyping}
          />

          <Composer
            onSend={handleSendMessage}
            disabled={isDuckTyping}
          />
        </section>
      </main>
    </div>
  );
}
