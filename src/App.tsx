/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Phase = 'INHALE' | 'HOLD' | 'EXHALE';

interface BreathingMode {
  id: string;
  name: string;
  subtitle: string;
  phases: { type: Phase; duration: number }[];
  shape: 'square' | 'circle' | 'triangle';
}

const MODES: BreathingMode[] = [
  {
    id: '4-4-4-4',
    name: 'BOX BREATHING',
    subtitle: '4-4-4-4 TECHNIQUE',
    shape: 'square',
    phases: [
      { type: 'INHALE', duration: 4 },
      { type: 'HOLD', duration: 4 },
      { type: 'EXHALE', duration: 4 },
      { type: 'HOLD', duration: 4 },
    ],
  },
  {
    id: '4-7-8',
    name: '4-7-8 BREATHING',
    subtitle: 'RELAXATION TECHNIQUE',
    shape: 'triangle',
    phases: [
      { type: 'INHALE', duration: 4 },
      { type: 'HOLD', duration: 7 },
      { type: 'EXHALE', duration: 8 },
    ],
  },
  {
    id: '6-6',
    name: 'COHERENT',
    subtitle: '6-6 TECHNIQUE',
    shape: 'circle',
    phases: [
      { type: 'INHALE', duration: 6 },
      { type: 'EXHALE', duration: 6 },
    ],
  },
];

export default function App() {
  const [activeMode, setActiveMode] = useState<BreathingMode>(MODES[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const phaseStartTime = useRef<number | null>(null);

  const currentPhase = activeMode.phases[currentPhaseIndex];

  useEffect(() => {
    let animationFrame: number;

    const tick = (time: number) => {
      if (!phaseStartTime.current) {
        phaseStartTime.current = time;
      }
      
      const elapsed = (time - phaseStartTime.current) / 1000;
      const duration = activeMode.phases[currentPhaseIndex].duration;
      
      if (elapsed >= duration) {
        phaseStartTime.current = time;
        setCurrentPhaseIndex((prev) => (prev + 1) % activeMode.phases.length);
        setProgress(0);
      } else {
        setProgress(elapsed / duration);
      }

      animationFrame = requestAnimationFrame(tick);
    };

    if (isActive) {
      animationFrame = requestAnimationFrame(tick);
    } else {
      phaseStartTime.current = null;
      setProgress(0);
      setCurrentPhaseIndex(0);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isActive, currentPhaseIndex, activeMode.phases]);

  const toggleSession = () => setIsActive(!isActive);

  const handleModeChange = (mode: BreathingMode) => {
    if (activeMode.id === mode.id) return;
    setIsActive(false);
    setActiveMode(mode);
  };

  return (
    <div className="flex flex-col min-h-screen bg-nike-white select-none overflow-hidden">
      {/* Header */}
      <header className="h-16 flex items-center justify-center px-4 border-b border-hover-gray bg-nike-white z-50">
        <div className="w-full" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="text-center mb-12">
          <motion.h2 
            key={activeMode.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display-hero-mobile md:text-6xl text-nike-black mb-1"
          >
            {activeMode.name}
          </motion.h2>
          <p className="font-medium text-text-secondary uppercase tracking-[0.2em] text-xs">
            {activeMode.subtitle}
          </p>
        </div>

        {/* Interaction Shape */}
        <div 
          onClick={toggleSession}
          className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center cursor-pointer group"
          id="breathing-trigger"
        >
          <ShapeRenderer 
            shape={activeMode.shape} 
            progress={progress} 
            isActive={isActive} 
            phaseIndex={currentPhaseIndex}
            phases={activeMode.phases}
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {!isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                className="font-display-hero-mobile text-text-secondary whitespace-nowrap"
                style={{ fontSize: '40px' }}
              >
                TAP TO START
              </motion.div>
            )}
            
            <AnimatePresence mode="wait">
              {isActive && (
                <motion.div
                  key={currentPhase.type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="font-display-hero-mobile text-nike-black"
                >
                  {currentPhase.type}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Phase Info (Mobile only extra or just spacing) */}
        <div className="h-20 mt-8" />
      </main>

      {/* Navigator */}
      <nav className="fixed bottom-12 left-1/2 -translate-x-1/2 px-6 w-full max-w-md z-40">
        <div className="bg-light-gray p-1 rounded-full flex gap-1 items-center justify-between border border-hover-gray">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode)}
              className={`flex-1 py-3 px-2 rounded-full font-medium text-xs uppercase tracking-tight transition-all duration-300 ${
                activeMode.id === mode.id 
                  ? 'bg-nike-black text-nike-white shadow-sm' 
                  : 'text-text-secondary hover:text-nike-black'
              }`}
            >
              {mode.id}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function ShapeRenderer({ shape, progress, isActive, phaseIndex, phases }: {
  shape: 'square' | 'circle' | 'triangle';
  progress: number;
  isActive: boolean;
  phaseIndex: number;
  phases: { type: Phase; duration: number }[];
}) {
  const currentPhase = phases[phaseIndex];
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  const totalSteps = phases.length;
  const isCoherent = shape === 'circle' && phases.length === 2;

  // Get the path definition based on shape
  // Note: SVG is rotated -90deg, so we adjust starting points accordingly
  const getPathD = () => {
    switch (shape) {
      case 'square':
        // Start from top-right (which becomes top-left after -90deg rotation)
        return "M95 5 L95 95 L5 95 L5 5 Z";
      case 'triangle':
        // Triangle with vertex pointing right (becomes top after -90deg rotation)
        // Start from right vertex, go clockwise
        return "M92 50 L8 92 L8 8 Z";
      case 'circle':
        // Start from right (3 o'clock) which becomes top (12 o'clock) after -90deg rotation
        return "M 95 50 a 45,45 0 1,1 -90,0 a 45,45 0 1,1 90,0";
      default:
        return "";
    }
  };

  // Calculate the total path length for stroke animation
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      console.log(`Path length for ${shape}:`, length);
    }
  }, [shape]);

  const getScale = () => {
    if (!isActive) return 1;
    const peak = 1.3;
    const base = 1.0;
    if (currentPhase.type === 'INHALE') return base + (progress * (peak - base));
    if (currentPhase.type === 'EXHALE') return peak - (progress * (peak - base));
    if (currentPhase.type === 'HOLD') {
      const prevPhase = phases[(phaseIndex - 1 + totalSteps) % totalSteps];
      return prevPhase.type === 'INHALE' ? peak : base;
    }
    return base;
  };

  const scale = getScale();

  // Calculate stroke dash offset for progress animation
  const getStrokeDashoffset = () => {
    if (!isActive) return pathLength;

    if (isCoherent) {
      // Coherent breathing: fill during INHALE, clear during EXHALE
      if (currentPhase.type === 'INHALE') {
        // Fill clockwise: go from pathLength (empty) to 0 (full)
        return pathLength * (1 - progress);
      } else {
        // Clear counter-clockwise: go from 0 (full) to pathLength (empty)
        return pathLength * progress;
      }
    } else {
      // Other modes: continuous progress through all phases
      const globalProgress = (phaseIndex + progress) / totalSteps;
      return pathLength - (pathLength * globalProgress);
    }
  };

  const strokeDashoffset = getStrokeDashoffset();

  return (
    <motion.div
      animate={{ scale }}
      transition={{ duration: 0.3, ease: "linear" }}
      className="w-full h-full relative p-4 flex items-center justify-center"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full fill-none overflow-visible"
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Track (Static Guide) */}
        {shape === 'square' && (
          <rect x="5" y="5" width="90" height="90" className="stroke-hover-gray stroke-[2]" />
        )}
        {shape === 'circle' && (
          <circle cx="50" cy="50" r="45" className="stroke-hover-gray stroke-[2]" />
        )}
        {shape === 'triangle' && (
          <path d="M92 50 L8 92 L8 8 Z" className="stroke-hover-gray stroke-[2]" />
        )}

        {/* Hidden reference path for length calculation */}
        <path
          ref={pathRef}
          d={getPathD()}
          stroke="none"
          fill="none"
          style={{ opacity: 0, pointerEvents: 'none' }}
        />

        {/* Progress Stroke (Moving Perimeter) */}
        {isActive && pathLength > 0 && (
          <path
            d={getPathD()}
            stroke="#111111"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={strokeDashoffset}
            fill="none"
          />
        )}
      </svg>
    </motion.div>
  );
}
