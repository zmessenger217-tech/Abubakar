import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Wind, Utensils, RotateCcw, Heart, CheckCircle2 } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

export const InteractiveCake: React.FC = () => {
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true, true, true]);
  const [isCakeCut, setIsCakeCut] = useState<boolean>(false);
  const [wishText, setWishText] = useState<string>('');
  const [isWishModalOpen, setIsWishModalOpen] = useState<boolean>(false);
  const [savedWish, setSavedWish] = useState<string>('');

  const allCandlesBlown = candlesLit.every((lit) => !lit);

  const toggleCandle = (index: number) => {
    const next = [...candlesLit];
    next[index] = !next[index];
    setCandlesLit(next);

    if (!next[index]) {
      audioEngine.playCandleBlow();
    } else {
      audioEngine.playChime();
    }

    // If that was the last candle blown
    if (next.every((lit) => !lit)) {
      triggerCandleBlownCelebration();
    }
  };

  const blowAllCandles = () => {
    audioEngine.playCandleBlow();
    setCandlesLit([false, false, false, false, false]);
    triggerCandleBlownCelebration();
  };

  const triggerCandleBlownCelebration = () => {
    setTimeout(() => {
      audioEngine.playApplause();
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#fbbf24'],
      });
    }, 250);
  };

  const cutTheCake = () => {
    audioEngine.playPartyHorn();
    audioEngine.playApplause();
    setIsCakeCut(true);
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.65 },
    });
  };

  const relightCandles = () => {
    setCandlesLit([true, true, true, true, true]);
    setIsCakeCut(false);
    audioEngine.playChime();
  };

  const handleSaveWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (wishText.trim()) {
      setSavedWish(wishText.trim());
      setIsWishModalOpen(false);
      audioEngine.playChime();
      confetti({ particleCount: 40, spread: 60 });
    }
  };

  return (
    <section id="birthday-cake" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Cake Ceremony</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mb-3">
          Blow The Candles, <span className="gold-gradient-text">Make A Wish!</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300">
          Tap each candle or use the button below to blow them out for Abubakr, then cut the celebration cake!
        </p>
      </div>

      {/* Cake Stage Card */}
      <div className="relative bg-slate-900/80 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md text-center overflow-hidden">
        {/* Wish Sealed Banner if user made a wish */}
        {savedWish && (
          <div className="mb-6 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 max-w-md mx-auto flex items-center justify-center gap-2 text-amber-300 text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">Wish for Abubakr: &ldquo;{savedWish}&rdquo;</span>
          </div>
        )}

        {/* The Animated SVG / Graphic Cake */}
        <div className="relative w-72 sm:w-80 h-72 mx-auto flex flex-col items-center justify-end select-none">
          {/* Row of 5 Candles */}
          <div className="flex items-end justify-center gap-4 sm:gap-5 mb-1 z-10">
            {candlesLit.map((isLit, idx) => (
              <div
                key={idx}
                onClick={() => toggleCandle(idx)}
                className="flex flex-col items-center cursor-pointer group"
                title={isLit ? 'Tap to blow out candle' : 'Tap to relight candle'}
              >
                {/* Flame or smoke */}
                <div className="h-7 flex items-end justify-center">
                  {isLit ? (
                    <div className="relative animate-flame">
                      {/* Outer orange flame */}
                      <div className="w-3.5 h-6 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
                      {/* Inner blue/white core */}
                      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-2.5 rounded-full bg-white opacity-80" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-[10px] text-slate-400 animate-pulse">
                      <span className="w-1 h-3 bg-slate-500/40 rounded-full blur-[0.5px] -translate-y-1" />
                    </div>
                  )}
                </div>

                {/* Candle Wick */}
                <div className="w-0.5 h-2 bg-slate-800" />

                {/* Candle Body */}
                <div
                  className={`w-3.5 sm:w-4 h-12 rounded-t-sm shadow-md transition-colors ${
                    idx % 2 === 0
                      ? 'bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500'
                      : 'bg-gradient-to-b from-rose-300 via-pink-400 to-rose-500'
                  }`}
                >
                  {/* Candle stripes */}
                  <div className="w-full h-1 bg-white/40 my-1.5" />
                  <div className="w-full h-1 bg-white/40 my-1.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Tier 1 (Top Tier) */}
          <div className="relative w-40 sm:w-44 h-12 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300 rounded-t-2xl shadow-inner border-t-2 border-amber-50 flex items-center justify-around px-3">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm" />
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm" />
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm" />
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm" />
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm" />
            {/* Dripping Cream */}
            <div className="absolute -bottom-1 left-0 right-0 h-2 bg-amber-100 rounded-b-xl" />
          </div>

          {/* Tier 2 (Middle Tier) */}
          <div className="relative w-56 sm:w-64 h-14 bg-gradient-to-b from-amber-800 via-amber-900 to-slate-950 rounded-t-2xl shadow-lg border-t-2 border-amber-300/40 flex items-center justify-around px-4">
            <div className="flex gap-2">
              <span className="text-xs">🍓</span>
              <span className="text-xs">✨</span>
              <span className="text-xs">🍓</span>
              <span className="text-xs">✨</span>
              <span className="text-xs">🍓</span>
            </div>
          </div>

          {/* Tier 3 (Base Tier) with optional slice cut animation */}
          <div className="relative w-68 sm:w-76 h-16 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 rounded-t-3xl shadow-2xl border-t-2 border-yellow-200 flex items-center justify-center px-4 overflow-hidden">
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-wider uppercase font-display flex items-center gap-1.5">
              <span>★</span>
              <span>Happy Birthday Abubakr</span>
              <span>★</span>
            </div>

            {/* Cut slice separator line */}
            {isCakeCut && (
              <div className="absolute right-12 top-0 bottom-0 w-1 bg-amber-950 animate-pulse" />
            )}
          </div>

          {/* Silver Cake Platter / Stand */}
          <div className="w-76 sm:w-88 h-4 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-full shadow-2xl border-t border-white" />
          <div className="w-24 h-4 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-500 rounded-b-lg shadow-md" />
        </div>

        {/* Celebration State Banner */}
        <div className="mt-8 mb-6">
          {allCandlesBlown ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-sm font-medium animate-bounce">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>All candles blown! Wishes are heading straight to heaven! 🌟</span>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-400">
              {candlesLit.filter(Boolean).length} glowing candle{candlesLit.filter(Boolean).length > 1 ? 's' : ''} left on Abubakr’s cake
            </p>
          )}
        </div>

        {/* Cake Control Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {!allCandlesBlown ? (
            <button
              onClick={blowAllCandles}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Wind className="w-4 h-4 text-slate-950" />
              <span>Blow All Candles</span>
            </button>
          ) : (
            <button
              onClick={relightCandles}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Relight Candles</span>
            </button>
          )}

          {!isCakeCut ? (
            <button
              onClick={cutTheCake}
              className="px-5 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm shadow-lg shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Utensils className="w-4 h-4" />
              <span>Cut The Cake</span>
            </button>
          ) : (
            <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-medium flex items-center gap-1.5">
              <span>🍰 A sweet slice for everyone!</span>
            </div>
          )}

          <button
            onClick={() => setIsWishModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 font-medium text-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-pink-400" />
            <span>{savedWish ? 'Edit Birthday Wish' : 'Make A Birthday Wish'}</span>
          </button>
        </div>
      </div>

      {/* Wish Maker Modal */}
      {isWishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 text-left shadow-2xl">
            <h3 className="text-xl font-bold text-white font-display mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Make a Wish for Abubakr</span>
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Write a sincere prayer or wish before blowing out the candles!
            </p>

            <form onSubmit={handleSaveWish} className="space-y-4">
              <textarea
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="E.g., May Allah grant you immense wisdom, success in school, and everlasting joy..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWishModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-transform"
                >
                  Save & Seal Wish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
