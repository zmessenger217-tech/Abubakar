/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Share2,
  Cake,
  Image as ImageIcon,
  Heart,
  MessageSquare,
  Gift,
  Award,
  Menu,
  PlusCircle,
  Mic,
} from 'lucide-react';

import { BackgroundEffects } from './components/BackgroundEffects';
import { GrandOpeningModal } from './components/GrandOpeningModal';
import { AudioPlayerWidget } from './components/AudioPlayerWidget';
import { HeroSection } from './components/HeroSection';
import { InteractiveCake } from './components/InteractiveCake';
import { MemoryGallery } from './components/MemoryGallery';
import { FamilyCousinCards } from './components/FamilyCousinCards';
import { WishWall } from './components/WishWall';
import { ShareModal } from './components/ShareModal';
import { SidebarDrawer } from './components/SidebarDrawer';
import { AddWishModal } from './components/AddWishModal';
import { AddCardModal } from './components/AddCardModal';
import { AddMemoryModal } from './components/AddMemoryModal';
import { audioEngine } from './services/audioEngine';

export default function App() {
  const [isGrandOpeningOpen, setIsGrandOpeningOpen] = useState<boolean>(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAddWishModalOpen, setIsAddWishModalOpen] = useState<boolean>(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState<boolean>(false);
  const [isAddMemoryModalOpen, setIsAddMemoryModalOpen] = useState<boolean>(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReplayOpening = () => {
    setIsGrandOpeningOpen(true);
  };

  const triggerCelebrationBurst = () => {
    audioEngine.playPartyHorn();
    audioEngine.playApplause();
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0a1a] text-slate-100 relative selection:bg-amber-400 selection:text-slate-950 pb-24 sm:pb-16">
      {/* Dynamic Background Balloons & Sparkles */}
      <BackgroundEffects />

      {/* Grand Opening Gift Entrance Modal */}
      <GrandOpeningModal
        isOpen={isGrandOpeningOpen}
        onOpen={() => setIsGrandOpeningOpen(false)}
      />

      {/* Slide-out Sidebar Drawer with Navigation & Quick Add Actions */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenAddWish={() => setIsAddWishModalOpen(true)}
        onOpenAddCard={() => setIsAddCardModalOpen(true)}
        onOpenAddMemory={() => setIsAddMemoryModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        onReplayOpening={handleReplayOpening}
      />

      {/* Modals for Adding Wishes, Cards, and Memory Pictures */}
      <AddWishModal
        isOpen={isAddWishModalOpen}
        onClose={() => setIsAddWishModalOpen(false)}
      />

      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
      />

      <AddMemoryModal
        isOpen={isAddMemoryModalOpen}
        onClose={() => setIsAddMemoryModalOpen(false)}
      />

      {/* Easy Share Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Floating Audio Player & Interactive Soundboard */}
      <AudioPlayerWidget />

      {/* Top Bar Navigation (Strict 3-zone contract with sidebar menu trigger) */}
      <header className="sticky top-0 z-30 w-full bg-[#0c0a1a]/85 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Sidebar Toggle & Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar menu"
              className="p-2 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-900 border border-slate-800 transition-colors flex items-center justify-center cursor-pointer shrink-0"
              title="Open Navigation & Add Actions"
            >
              <Menu className="w-5 h-5" />
            </button>

            <a
              href="#"
              className="text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-display flex items-center gap-2 group"
            >
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                ★
              </span>
              <span className="gold-gradient-text">Abubakr</span>
            </a>
          </div>

          {/* Zone 2: 4-5 single-line clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => scrollToSection('memories')}
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 hover:underline cursor-pointer"
            >
              Photo Album
            </button>
            <button
              onClick={() => scrollToSection('birthday-cake')}
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 hover:underline cursor-pointer"
            >
              Virtual Cake
            </button>
            <button
              onClick={() => scrollToSection('family-cards')}
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 hover:underline cursor-pointer font-semibold text-amber-400"
            >
              Cousin & Sister Cards
            </button>
            <button
              onClick={() => scrollToSection('wish-wall')}
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 hover:underline cursor-pointer"
            >
              Wish Wall & Voice
            </button>
          </nav>

          {/* Zone 3: Quick Add Actions & Primary Share */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddWishModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-semibold cursor-pointer transition-colors"
              title="Add Wish or Voice Message"
            >
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Wish / Voice</span>
            </button>

            <button
              onClick={() => setIsAddCardModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30 text-xs font-semibold cursor-pointer transition-colors"
              title="Create a Celebration Card"
            >
              <Gift className="w-3.5 h-3.5 text-purple-400" />
              <span>+ Card</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Celebratory Content */}
      <main className="relative z-10">
        {/* 1. Hero Spotlight & Greeting */}
        <HeroSection
          onScrollToCake={() => scrollToSection('birthday-cake')}
          onScrollToGallery={() => scrollToSection('memories')}
          onScrollToWishes={() => scrollToSection('wish-wall')}
          onOpenShare={() => setIsShareModalOpen(true)}
        />

        {/* 2. Interactive Virtual Birthday Cake & Blow Candles Ceremony */}
        <InteractiveCake />

        {/* 3. Memory Photo Album Gallery (Synced with Firebase) */}
        <MemoryGallery
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenAddMemory={() => setIsAddMemoryModalOpen(true)}
        />

        {/* 4. Six Cards from Cousins (Ahmar, Hashir, Nouman, Wadeed, Bassam, Hania) & Sister Alveena */}
        <FamilyCousinCards onOpenAddCard={() => setIsAddCardModalOpen(true)} />

        {/* 5. Live Firebase Guestbook & Voice Wishes */}
        <WishWall />

        {/* Special Celebration Banner / Call to Action */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-rose-500/20 border border-amber-500/30 text-center shadow-2xl backdrop-blur-md overflow-hidden">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl" />

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-3">
              <Gift className="w-4 h-4" />
              <span>Celebration Time</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-3">
              Happy Birthday Once Again, Dear Abubakr! 🎈
            </h3>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-6 leading-relaxed">
              May this day be the kickoff to your happiest, most successful year yet. Keep smiling, keep dreaming, and never stop being extraordinary!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={triggerCelebrationBurst}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Blast Celebration Fireworks</span>
              </button>

              <button
                onClick={() => setIsAddWishModalOpen(true)}
                className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                <Mic className="w-4 h-4 text-rose-400" />
                <span>Record Voice Wish</span>
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-5 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share with Family</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-200">Abubakr’s Birthday Celebration</span>
            <span aria-hidden="true">·</span>
            <span>Connected to Firebase Firestore</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Lahore, Pakistan</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Share Link
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Ergonomic Bottom Action Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0c0a1a]/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-5 items-center h-16 px-1">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex flex-col items-center justify-center min-h-[44px] text-slate-400 hover:text-amber-400 transition-colors"
        >
          <Menu className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5 text-amber-300">Menu</span>
        </button>

        <button
          onClick={() => scrollToSection('birthday-cake')}
          className="flex flex-col items-center justify-center min-h-[44px] text-slate-400 hover:text-amber-400 transition-colors"
        >
          <Cake className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Cake</span>
        </button>

        <button
          onClick={() => scrollToSection('memories')}
          className="flex flex-col items-center justify-center min-h-[44px] text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ImageIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Photos</span>
        </button>

        <button
          onClick={() => setIsAddWishModalOpen(true)}
          className="flex flex-col items-center justify-center min-h-[44px] text-slate-400 hover:text-rose-400 transition-colors"
        >
          <Mic className="w-5 h-5 text-rose-400" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5 text-rose-300">Voice Wish</span>
        </button>

        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex flex-col items-center justify-center min-h-[44px] text-amber-400 hover:text-amber-300 font-semibold transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Share</span>
        </button>
      </nav>
    </div>
  );
}
