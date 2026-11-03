import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Share2, Trash2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { audioEngine } from '../services/audioEngine';

export interface FamilyCardData {
  id: string;
  senderName: string;
  relation: string;
  roleBadge: string;
  isSister?: boolean;
  avatarIcon: string;
  photoUrl: string;
  photoCaption: string;
  title: string;
  message: string;
  dua: string;
  audioUrl?: string;
  themeColor: {
    border: string;
    bgGradient: string;
    accent: string;
    tagBg: string;
  };
  initialLikes: number;
}

export const FAMILY_CARDS: FamilyCardData[] = [];

interface FamilyCousinCardsProps {
  onOpenAddCard?: () => void;
}

export const FamilyCousinCards: React.FC<FamilyCousinCardsProps> = ({ onOpenAddCard }) => {
  const [cards, setCards] = useState<FamilyCardData[]>([]);
  const [likes, setLikes] = useState<{ [id: string]: number }>({});
  const [filter, setFilter] = useState<'all' | 'cousins' | 'sister'>('all');

  useEffect(() => {
    const q = query(collection(db, 'birthday_cards'), orderBy('serverTime', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedCards: FamilyCardData[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          const themeName = data.theme || 'gold';
          let themeColor = {
            border: 'border-amber-500/40',
            bgGradient: 'from-amber-500/15 via-slate-900 to-slate-900',
            accent: 'text-amber-300',
            tagBg: 'bg-amber-400/20 border-amber-400/40 text-amber-300',
          };
          if (themeName === 'rose') {
            themeColor = {
              border: 'border-rose-500/40',
              bgGradient: 'from-rose-500/15 via-slate-900 to-slate-900',
              accent: 'text-rose-300',
              tagBg: 'bg-rose-400/20 border-rose-400/40 text-rose-300',
            };
          } else if (themeName === 'blue') {
            themeColor = {
              border: 'border-blue-500/40',
              bgGradient: 'from-blue-500/15 via-slate-900 to-slate-900',
              accent: 'text-blue-300',
              tagBg: 'bg-blue-400/20 border-blue-400/40 text-blue-300',
            };
          } else if (themeName === 'emerald') {
            themeColor = {
              border: 'border-emerald-500/40',
              bgGradient: 'from-emerald-500/15 via-slate-900 to-slate-900',
              accent: 'text-emerald-300',
              tagBg: 'bg-emerald-400/20 border-emerald-400/40 text-emerald-300',
            };
          } else if (themeName === 'purple') {
            themeColor = {
              border: 'border-purple-500/40',
              bgGradient: 'from-purple-500/15 via-slate-900 to-slate-900',
              accent: 'text-purple-300',
              tagBg: 'bg-purple-400/20 border-purple-400/40 text-purple-300',
            };
          }
          return {
            id: doc.id,
            senderName: data.senderName,
            relation: data.relation,
            roleBadge: data.roleBadge,
            isSister: data.relation?.toLowerCase().includes('sister'),
            avatarIcon: data.relation?.toLowerCase().includes('sister') ? '💖' : '🌟',
            photoUrl: data.photoUrl,
            photoCaption: data.photoCaption,
            title: data.title,
            message: data.message,
            dua: data.dua,
            audioUrl: data.audioUrl,
            themeColor,
            initialLikes: data.likes || 1,
          };
        });
        setCards(loadedCards);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'birthday_cards');
        setCards([]);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredCards = cards.filter((card) => {
    if (filter === 'sister') return card.isSister;
    if (filter === 'cousins') return !card.isSister;
    return true;
  });

  const handleLikeCard = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    audioEngine.playChime();

    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 25,
      spread: 50,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
    });

    try {
      await updateDoc(doc(db, 'birthday_cards', id), {
        likes: increment(1),
      });
    } catch (err) {
      // ignore
    }
  };

  const handleDeleteCard = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    try {
      await deleteDoc(doc(db, 'birthday_cards', id));
      audioEngine.playChime();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'birthday_cards');
    }
  };

  const handleDeleteAllCards = async () => {
    if (!window.confirm('Are you sure you want to delete all celebration cards?')) return;
    try {
      for (const card of cards) {
        await deleteDoc(doc(db, 'birthday_cards', card.id));
      }
      audioEngine.playChime();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'birthday_cards');
    }
  };

  const handleShareCard = (card: FamilyCardData) => {
    const text = `🎉 Birthday Card for Abubakr from ${card.relation} ${card.senderName}:\n\n"${card.message}"\n\nDu'a: ${card.dua}\n\nCelebrate with us: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: `Birthday Card from ${card.senderName} to Abubakr`,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
    audioEngine.playPartyHorn();
  };

  return (
    <section id="family-cards" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Decorative overhead glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-44 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Heartfelt Wishes from Family</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display mb-3">
          Cards From <span className="gold-gradient-text">Family & Friends</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300">
          Dedicated birthday cards created with personal photos and wishes. Add your own card below!
        </p>

        {/* Filter and Add Card Button Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Cards ({cards.length})
            </button>
            <button
              onClick={() => setFilter('cousins')}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filter === 'cousins'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cousins
            </button>
            <button
              onClick={() => setFilter('sister')}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filter === 'sister'
                  ? 'bg-rose-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sister 💖
            </button>
          </div>

          {onOpenAddCard && (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAddCard}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Add Celebration Card</span>
              </button>
              {cards.length > 0 && (
                <button
                  onClick={handleDeleteAllCards}
                  className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Delete all cards"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete All Cards</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid of Cards or Empty State */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/60 border border-slate-800 rounded-3xl max-w-md mx-auto p-6">
          <p className="text-sm text-slate-400 mb-4">No birthday cards added yet. Be the first to create one for Abubakr!</p>
          {onOpenAddCard && (
            <button
              onClick={onOpenAddCard}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-md cursor-pointer"
            >
              + Create First Card
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className={`group relative rounded-3xl p-5 sm:p-6 bg-gradient-to-b ${card.themeColor.bgGradient} border-2 ${card.themeColor.border} shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between`}
            >
              <div>
                {/* Card Header: Sender Info & Badge */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-lg shadow-inner">
                      {card.avatarIcon}
                    </span>
                    <div className="text-left">
                      <h3 className="text-base font-bold text-white leading-tight">
                        {card.senderName}
                      </h3>
                      <span className="text-xs text-slate-300">
                        {card.relation}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border ${card.themeColor.tagBg}`}
                    >
                      {card.roleBadge}
                    </span>
                    <button
                      onClick={(e) => handleDeleteCard(card.id, e)}
                      className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                      title="Delete card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Photo Frame & Caption */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-950 border border-white/15 shadow-md">
                  <img
                    src={card.photoUrl}
                    alt={card.photoCaption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-200">
                    <span className="bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
                      {card.photoCaption}
                    </span>
                    <span className="text-amber-400 font-medium">Lahore 📍</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="text-left space-y-2 mb-4">
                  <h4 className={`text-base font-bold font-display ${card.themeColor.accent}`}>
                    {card.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                    &ldquo;{card.message}&rdquo;
                  </p>

                  {/* Du'a / Prayer Box */}
                  <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-amber-200/90 leading-relaxed italic">
                    <span className="font-semibold text-amber-300 not-italic block mb-0.5">
                      Prayer for Abubakr:
                    </span>
                    {card.dua}
                  </div>

                  {/* Card Song / Audio Player */}
                  {card.audioUrl && (
                    <div className="mt-3 p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const audioEl = document.getElementById(`card-audio-${card.id}`) as HTMLAudioElement;
                            if (audioEl) {
                              if (audioEl.paused) {
                                audioEl.play().catch(() => {});
                              } else {
                                audioEl.pause();
                              }
                            }
                          }}
                          className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow hover:scale-105 transition-transform cursor-pointer"
                          title="Play this card's song"
                        >
                          🎵
                        </button>
                        <div className="text-left">
                          <span className="text-xs font-semibold text-slate-200 block">Card Song Track</span>
                          <span className="text-[10px] text-amber-400">Click to play/pause</span>
                        </div>
                      </div>
                      <audio
                        id={`card-audio-${card.id}`}
                        src={card.audioUrl}
                        loop
                        preload="none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => handleLikeCard(card.id, e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 text-xs font-medium border border-white/10 transition-colors cursor-pointer"
                  title="Send love to this wish"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span className="tabular-nums font-semibold">{likes[card.id] || card.initialLikes}</span>
                  <span className="text-[10px] text-slate-400">Loves</span>
                </button>

                <button
                  onClick={() => handleShareCard(card)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-colors cursor-pointer"
                  title="Share this specific card to WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Card</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
