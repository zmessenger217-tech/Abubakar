import React from 'react';
import {
  X,
  Home,
  Cake,
  Image as ImageIcon,
  Heart,
  MessageSquare,
  Gift,
  Mic,
  PlusCircle,
  Share2,
  Sparkles,
  PartyPopper,
  Music,
} from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddWish: () => void;
  onOpenAddCard: () => void;
  onOpenAddMemory: () => void;
  onOpenShare: () => void;
  onReplayOpening: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  onOpenAddWish,
  onOpenAddCard,
  onOpenAddMemory,
  onOpenShare,
  onReplayOpening,
}) => {
  if (!isOpen) return null;

  const scrollTo = (id: string) => {
    onClose();
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Home / Celebration Star', icon: <Home className="w-4 h-4" />, target: 'top' },
    { label: 'Photo Album (Memories)', icon: <ImageIcon className="w-4 h-4" />, target: 'memories' },
    { label: 'Virtual Birthday Cake', icon: <Cake className="w-4 h-4" />, target: 'birthday-cake' },
    { label: 'Cousin & Sister Cards', icon: <Heart className="w-4 h-4 text-rose-400" />, target: 'family-cards' },
    { label: 'Wish Wall & Voice Messages', icon: <MessageSquare className="w-4 h-4 text-amber-400" />, target: 'wish-wall' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-80 max-w-[85vw] h-full bg-[#0e0c1f] border-r border-amber-500/30 p-6 flex flex-col justify-between shadow-2xl text-left overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shadow-md shadow-amber-500/20">
                ★
              </span>
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Abubakr’s Day
                </h3>
                <span className="text-[11px] text-amber-400/90 font-medium">
                  Birthday Celebration
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links (Matches all top bar options) */}
          <div className="space-y-1 mb-6">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-2 mb-2 block">
              Site Navigation
            </span>
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(item.target)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
              >
                <span className="text-amber-400">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Actions (Add Wish, Card, Picture, Voice) */}
          <div className="space-y-2 mb-6 pt-4 border-t border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold px-2 mb-2 block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add Your Love</span>
            </span>

            <button
              onClick={() => {
                onClose();
                onOpenAddWish();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer text-left"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>+ Add Birthday Wish</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAddWish();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer text-left"
            >
              <Mic className="w-4 h-4 text-rose-400" />
              <span>+ Record Voice Wish</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAddCard();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-colors cursor-pointer text-left"
            >
              <Gift className="w-4 h-4 text-purple-400" />
              <span>+ Add Celebration Card</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAddMemory();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-colors cursor-pointer text-left"
            >
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <span>+ Add Memory Picture</span>
            </button>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => {
              onClose();
              onOpenShare();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Website to WhatsApp</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onReplayOpening();
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Replay Celebration Opener</span>
          </button>
        </div>
      </div>
    </div>
  );
};
