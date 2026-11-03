import React from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Music, Gift, Heart, PartyPopper } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface GrandOpeningModalProps {
  isOpen: boolean;
  onOpen: () => void;
}

export const GrandOpeningModal: React.FC<GrandOpeningModalProps> = ({ isOpen, onOpen }) => {
  if (!isOpen) return null;

  const handleStartCelebration = () => {
    // Start music
    audioEngine.playBirthdaySong();
    audioEngine.playPartyHorn();

    // Multistage Confetti fireworks
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const interval: number = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.4 + 0.1, y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.4 + 0.5, y: Math.random() - 0.2 } });
    }, 250);

    onOpen();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-amber-500/10 overflow-hidden">
        {/* Decorative corner ribbons */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full blur-2xl opacity-40" />
        <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-gradient-to-tr from-pink-500 to-rose-600 rounded-full blur-2xl opacity-40" />

        {/* Floating icon badge */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-500 p-0.5 shadow-lg shadow-amber-500/30 mb-5 flex items-center justify-center animate-bounce">
          <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center text-amber-400">
            <Gift className="w-10 h-10" />
          </div>
        </div>

        {/* Small intro kicker */}
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>From Your Cousins & Sister Alveena</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3 font-display">
          Happy Birthday, <span className="gold-gradient-text">Abubakr!</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-md mx-auto">
          We put together a celebration album, birthday anthem, virtual cake, and special cards from Ahmar, Hashir, Nouman, Wadeed, Bassam, Hania, and Alveena!
        </p>

        {/* Quick Audio Hint */}
        <div className="flex items-center justify-center gap-2 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-xl py-2 px-3 mb-6 mx-auto w-fit">
          <Music className="w-4 h-4 animate-pulse" />
          <span>Turn up your sound for the Happy Birthday Abubakr song!</span>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleStartCelebration}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-bold text-base sm:text-lg shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <PartyPopper className="w-5 h-5" />
          <span>Open Abubakr’s Celebration</span>
          <Heart className="w-5 h-5 fill-current text-slate-950" />
        </button>

        <p className="mt-3 text-xs text-slate-400">
          Mobile-friendly · Touch responsive · Easy to share with family
        </p>
      </div>
    </div>
  );
};
