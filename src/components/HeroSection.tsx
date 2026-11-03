import React from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Cake, Image as ImageIcon, PartyPopper, MapPin, Calendar, Award } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface HeroSectionProps {
  onScrollToCake: () => void;
  onScrollToGallery: () => void;
  onScrollToWishes: () => void;
  onOpenShare: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToCake,
  onScrollToGallery,
  onScrollToWishes,
  onOpenShare,
}) => {
  const triggerConfettiBlast = () => {
    audioEngine.playConfettiPop();
    audioEngine.playPartyHorn();
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
    });
  };

  return (
    <section className="relative pt-6 pb-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Decorative overhead lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-24 bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent blur-2xl pointer-events-none" />

      {/* Hero Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Dedication, Title, and Action Buttons */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-6">
          {/* Unboxed Metadata Kicker (Anti-slop compliant) */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-amber-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>A Grand Celebration For</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Our Beloved Cousin</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Lahore, Pakistan
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
            Happy Birthday, <br className="hidden sm:inline" />
            <span className="gold-gradient-text drop-shadow-[0_4px_24px_rgba(245,158,11,0.25)]">
              Abubakr!
            </span>
          </h1>

          {/* Sincere, Heartwarming Family Dedication */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Lovingly celebrated by your cousins <span className="text-amber-300 font-medium">Ahmar, Hashir, Nouman, Wadeed, Bassam, Hania</span>, and sister <span className="text-rose-300 font-medium">Alveena</span> — wishing you a year filled with grand adventures, high achievements, and endless smiles!
          </p>

          {/* Quick Info & Stats (Zero-pill clean metadata format) */}
          <div className="pt-2 pb-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-400 border-y border-slate-800/80">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-200 font-medium">Top Student & Champion</span>
            </div>
            <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400 shrink-0 fill-rose-400/20" />
              <span className="text-slate-200 font-medium">Loved by Cousins & Sister</span>
            </div>
            <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-200 font-medium">Best Year Ahead</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('family-cards');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 sm:px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-5 h-5 text-slate-950 fill-current" />
              <span>Read Cousin & Sister Cards</span>
            </button>

            <button
              onClick={onScrollToCake}
              className="px-5 sm:px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 font-semibold text-sm sm:text-base hover:border-amber-400/40 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Cake className="w-5 h-5 text-amber-400" />
              <span>Blow The Candles</span>
            </button>

            <button
              onClick={triggerConfettiBlast}
              className="p-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Launch Confetti Fireworks"
            >
              <PartyPopper className="w-5 h-5" />
              <span className="text-xs font-semibold sm:hidden">Confetti</span>
            </button>
          </div>
        </div>

        {/* Right Column: Spotlight Feature Card of Abubakr */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm sm:max-w-md">
            {/* Glow backdrop behind frame */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/25 via-purple-600/20 to-rose-500/20 rounded-3xl blur-2xl -z-10" />

            {/* Premium Photo Frame */}
            <div className="relative rounded-3xl p-3 sm:p-4 bg-slate-900/90 border border-amber-500/30 shadow-2xl backdrop-blur-md group transition-transform duration-300 hover:scale-[1.01]">
              {/* Photo Container with subtle shimmer border */}
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-950">
                <img
                  src="/assets/aistudio/5_19dba8cb.jpeg"
                  alt="Abubakr under the golden Happy Birthday balloon arch"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {/* Photo Overlay Gradient for Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-85" />

                {/* Floating Corner Star Badge */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-amber-400/40 rounded-xl px-3 py-1 flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">Birthday Star</span>
                </div>

                {/* In-Photo Bottom Caption */}
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold block mb-0.5">
                    Golden Celebration
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    Abubakr’s Special Day
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    Under the golden balloons, shining brighter than the candles!
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer Actions */}
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1 text-amber-400/90 font-medium">
                  <Sparkles className="w-3.5 h-3.5" /> Born to shine bright
                </span>
                <button
                  onClick={onOpenShare}
                  className="text-amber-400 hover:text-amber-300 font-medium hover:underline cursor-pointer flex items-center gap-1"
                >
                  Share with Family →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
