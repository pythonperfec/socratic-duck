import React from 'react';
import Duck from './Duck.jsx';

/**
 * Tub.jsx - Whimsical Bathtub scene
 * Features:
 * - Tile grid background in tile-teal (#2E9C9A) with clean grout lines (#E9F1EF)
 * - Porcelain bathtub basin with soft ceramic shadows
 * - Aqua/teal bathwater with rolling ripples
 * - Water drain animation when patience drops to 0 (the duck sighs and ladder advances)
 * - Clusters of soap foam / suds bubbles around the waterline
 * - A pink soap bar in a chrome/brass dish on the tub rim
 * - Hosts the Duck floating and reacting to current mood
 */
export default function Tub({ mood = 'calm', onDuckClick, isDraining = false, hintLevel = 1 }) {
  return (
    <div className={`tub-scene ${isDraining ? 'scene-draining' : ''}`} aria-label="Bathtub Scene">
      {/* Tiled Wall Background Pattern */}
      <div className="tile-wall">
        {/* Subtle decorative bathroom towel or pipe detail */}
        <div className="towel-rail">
          <div className="rail-bracket left"></div>
          <div className="rail-bar"></div>
          <div className="rail-bracket right"></div>
          <div className="hanging-towel" title="Cozy Towel"></div>
        </div>

        {/* Vintage Bathtub Faucet */}
        <div className="faucet-assembly">
          <div className="faucet-pipe"></div>
          <div className="faucet-spout">
            <div className="faucet-drip" title="Dripping water bubble"></div>
          </div>
          <div className="faucet-knob hot" title="Hot Tap"></div>
          <div className="faucet-knob cold" title="Cold Tap"></div>
        </div>

        {/* Hint Ladder Badge on the tile wall */}
        <div className="hint-ladder-tag" title="Socratic Hint Tier (Advances when patience hits 0)">
          <span className="ladder-step">HINT LEVEL {hintLevel}/4</span>
        </div>
      </div>

      {/* Bathtub Basin & Water Chamber */}
      <div className="tub-basin-container">
        {/* Soap Dish on the Tub Rim */}
        <div className="soap-dish" title="Soap Pink Bar (#F2B6B0)">
          <div className="soap-bar">
            <span className="soap-emboss">SOAP</span>
          </div>
        </div>

        {/* Outer Tub Ceramic Rim */}
        <div className="tub-rim">
          <div className="rim-highlight"></div>
        </div>

        {/* Inside Tub Water Chamber */}
        <div className={`tub-interior ${isDraining ? 'tub-interior-draining' : ''}`}>
          {/* Drain Whirlpool / Vortex when patience reaches 0 */}
          {isDraining && (
            <div className="drain-whirlpool" title="Water draining as duck sighs...">
              <div className="whirlpool-ring r1"></div>
              <div className="whirlpool-ring r2"></div>
              <div className="drain-stopper"></div>
              <div className="drain-bubble-swirl"></div>
            </div>
          )}

          {/* Animated Water Body */}
          <div className={`water-surface ${isDraining ? 'water-draining' : ''}`}>
            <div className="water-wave wave-back"></div>
            <div className="water-wave wave-mid"></div>

            {/* The Duck floating peacefully in the water */}
            <div 
              className={`duck-wrapper ${isDraining ? 'duck-draining-swirl' : ''}`}
              onClick={onDuckClick} 
              role="button" 
              tabIndex={0}
              title="Click the duck to give a quick squeeze!"
            >
              <Duck mood={mood} />
              {isDraining && (
                <div className="duck-sigh-bubble" aria-live="polite">
                  *sigh* ...quack
                </div>
              )}
            </div>

            <div className="water-wave wave-front"></div>
          </div>

          {/* Clusters of Foamy Soap Suds & Floating Bubbles */}
          <div className="foam-cluster left-foam">
            <span className="sud sud-1"></span>
            <span className="sud sud-2"></span>
            <span className="sud sud-3"></span>
            <span className="sud sud-4"></span>
            <span className="sud sud-5"></span>
          </div>

          <div className="foam-cluster right-foam">
            <span className="sud sud-6"></span>
            <span className="sud sud-7"></span>
            <span className="sud sud-8"></span>
            <span className="sud sud-9"></span>
          </div>

          {/* Occasional floating bubbles rising up from tub */}
          <div className="floating-bubble bubble-a"></div>
          <div className="floating-bubble bubble-b"></div>
          <div className="floating-bubble bubble-c"></div>
        </div>

        {/* Bathtub Base / Porcelain Body */}
        <div className="tub-body">
          <div className="tub-feet left-foot"></div>
          <div className="tub-feet right-foot"></div>
        </div>
      </div>
    </div>
  );
}
