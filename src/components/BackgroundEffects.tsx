import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../services/audioEngine';

interface FloatingBalloon {
  id: number;
  left: number; // percentage
  delay: number; // seconds
  size: number; // px
  color: string;
  stringColor: string;
  popped?: boolean;
}

const BALLOON_COLORS = [
  { bg: 'from-amber-400 to-amber-600', string: 'border-amber-300' },
  { bg: 'from-rose-500 to-pink-600', string: 'border-rose-300' },
  { bg: 'from-blue-500 to-indigo-600', string: 'border-blue-300' },
  { bg: 'from-emerald-400 to-teal-600', string: 'border-emerald-300' },
  { bg: 'from-purple-500 to-violet-600', string: 'border-purple-300' },
];

export const BackgroundEffects: React.FC = () => {
  const [balloons, setBalloons] = useState<FloatingBalloon[]>([
    { id: 1, left: 6, delay: 0, size: 48, color: BALLOON_COLORS[0].bg, stringColor: BALLOON_COLORS[0].string },
    { id: 2, left: 22, delay: 4, size: 56, color: BALLOON_COLORS[1].bg, stringColor: BALLOON_COLORS[1].string },
    { id: 3, left: 45, delay: 2, size: 52, color: BALLOON_COLORS[2].bg, stringColor: BALLOON_COLORS[2].string },
    { id: 4, left: 74, delay: 5, size: 60, color: BALLOON_COLORS[3].bg, stringColor: BALLOON_COLORS[3].string },
    { id: 5, left: 88, delay: 1, size: 50, color: BALLOON_COLORS[4].bg, stringColor: BALLOON_COLORS[4].string },
    { id: 6, left: 14, delay: 7, size: 54, color: BALLOON_COLORS[2].bg, stringColor: BALLOON_COLORS[2].string },
    { id: 7, left: 62, delay: 8, size: 46, color: BALLOON_COLORS[0].bg, stringColor: BALLOON_COLORS[0].string },
  ]);

  const handlePopBalloon = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playConfettiPop();
    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 25,
      spread: 60,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
    });

    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );

    // Re-spawn balloon after 4 seconds
    setTimeout(() => {
      setBalloons((prev) =>
        prev.map((b) => (b.id === id ? { ...b, popped: false } : b))
      );
    }, 4000);
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Ambient gradient mesh */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />

      {/* Twinkling ambient sparkles */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-300"
            style={{
              top: `${(i * 37) % 96}%`,
              left: `${(i * 59) % 96}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              opacity: (i % 5) * 0.2 + 0.3,
              animation: `pulse ${(i % 3) + 2}s infinite ease-in-out alternate`,
            }}
          />
        ))}
      </div>

      {/* Interactive Floating Balloons */}
      {balloons.map(
        (b) =>
          !b.popped && (
            <div
              key={b.id}
              onClick={(e) => handlePopBalloon(b.id, e)}
              className="absolute pointer-events-auto cursor-pointer transition-transform hover:scale-110 active:scale-95 group"
              style={{
                left: `${b.left}%`,
                bottom: '-120px',
                animation: `floatUpward 18s linear infinite`,
                animationDelay: `${b.delay}s`,
              }}
              title="Pop balloon for confetti!"
            >
              <div
                className={`rounded-full bg-gradient-to-br ${b.color} shadow-lg shadow-black/40 relative flex items-center justify-center`}
                style={{ width: `${b.size}px`, height: `${b.size * 1.22}px` }}
              >
                {/* Balloon highlight */}
                <div className="absolute top-2 left-2 w-2.5 h-4 bg-white/40 rounded-full rotate-45 blur-[0.5px]" />
                {/* Knot */}
                <div className="absolute -bottom-1.5 w-2 h-1.5 bg-amber-600/70 rounded-sm" />
                {/* String */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[1px] h-12 bg-white/30" />
              </div>
            </div>
          )
      )}

      <style>{`
        @keyframes floatUpward {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.85;
          }
          50% {
            transform: translateY(-55vh) rotate(6deg);
          }
          90% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(-115vh) rotate(-6deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
