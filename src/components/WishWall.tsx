import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Send, Heart, MessageSquare, Wand2, User, Users, Mic, Square, Trash2, Volume2 } from 'lucide-react';
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { INITIAL_WISHES, COUSIN_BLESSINGS, CousinWish } from '../data/memories';
import { audioEngine } from '../services/audioEngine';
import { VoiceMessagePlayer } from './VoiceMessagePlayer';

export interface FirestoreWish extends CousinWish {
  audioDataUrl?: string;
  hasAudio?: boolean;
}

export const WishWall: React.FC = () => {
  const [wishes, setWishes] = useState<FirestoreWish[]>(INITIAL_WISHES);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Cousin');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🌟');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inline voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);
  const [recorderError, setRecorderError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  // Real-time Firestore sync
  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('serverTime', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const liveWishes: FirestoreWish[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: data.name || 'Friend',
            relation: data.relation || 'Cousin',
            message: data.message || '',
            badge: data.badge || '🌟 Wish',
            timestamp: data.createdAt ? new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today',
            color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
            audioDataUrl: data.audioDataUrl || '',
            hasAudio: !!data.audioDataUrl,
          };
        });

        if (liveWishes.length > 0) {
          // Merge initial baseline cousin/sister wishes if they are not duplicated
          const existingIds = new Set(liveWishes.map((w) => w.name.toLowerCase()));
          const extraBaseline = INITIAL_WISHES.filter((w) => !existingIds.has(w.name.toLowerCase()));
          setWishes([...liveWishes, ...extraBaseline]);
        } else {
          setWishes(INITIAL_WISHES);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'wishes');
        setWishes(INITIAL_WISHES);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleGenerateBlessing = () => {
    const randomBlessing = COUSIN_BLESSINGS[Math.floor(Math.random() * COUSIN_BLESSINGS.length)];
    setMessage(randomBlessing);
    audioEngine.playChime();
  };

  const startVoiceRecording = async () => {
    try {
      setRecorderError(null);
      audioEngine.pauseForVoiceMessage();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioDataUrl(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
        setIsRecording(false);
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        audioEngine.resumeAfterVoiceMessage();
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 45) {
            stopVoiceRecording();
            return 45;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Microphone error:', err);
      setRecorderError('Microphone permission required to record audio.');
      setIsRecording(false);
      audioEngine.resumeAfterVoiceMessage();
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleAddWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        relation: relation.trim() || 'Cousin',
        message: message.trim(),
        badge: `${selectedEmoji} ${relation || 'Family Wish'}`,
        audioDataUrl: audioDataUrl || '',
        hasAudio: !!audioDataUrl,
        createdAt: new Date().toISOString(),
        serverTime: serverTimestamp(),
      };

      await addDoc(collection(db, 'wishes'), payload);

      audioEngine.playApplause();
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.7 },
      });

      setName('');
      setMessage('');
      setAudioDataUrl(null);
      setIsSubmitting(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'wishes');
      // Optimistic local add if offline
      const fallbackWish: FirestoreWish = {
        id: Date.now().toString(),
        name: name.trim(),
        relation: relation.trim() || 'Cousin',
        message: message.trim(),
        badge: `${selectedEmoji} ${relation || 'Family Wish'}`,
        timestamp: 'Just now',
        color: 'from-amber-500/20 to-rose-500/20 border-amber-500/30',
        audioDataUrl: audioDataUrl || undefined,
        hasAudio: !!audioDataUrl,
      };
      setWishes([fallbackWish, ...wishes]);
      setName('');
      setMessage('');
      setAudioDataUrl(null);
      setIsSubmitting(false);
    }
  };

  const handleDeleteWish = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this wish?')) return;
    try {
      await deleteDoc(doc(db, 'wishes', id));
      audioEngine.playChime();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'wishes');
      // Fallback local remove if offline/initial item
      setWishes((prev) => prev.filter((w) => w.id !== id));
    }
  };

  return (
    <section id="wish-wall" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Live Firebase Guestbook</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mb-3">
          Birthday Wish & <span className="gold-gradient-text">Voice Wall</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300">
          Leave a written prayer or record a real voice message for Abubakr. Background music automatically pauses when voice messages play!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form to leave a wish */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Send Abubakr a Wish</span>
            </h3>
            <button
              type="button"
              onClick={handleGenerateBlessing}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline cursor-pointer"
              title="Auto-generate a warm cousin prayer/blessing"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Magic Blessing</span>
            </button>
          </div>

          <form onSubmit={handleAddWish} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Ahmar, Hashir, Alveena..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Relation to Abubakr
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  placeholder="E.g., Cousin, Sister, Friend, Uncle..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <Users className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Choose an Emoji Badge
              </label>
              <div className="flex gap-2 text-lg">
                {['🌟', '🎂', '🤲', '🚀', '👑', '❤️', '🎮'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      selectedEmoji === emoji
                        ? 'bg-amber-400/20 border border-amber-400 scale-110 shadow-md'
                        : 'bg-slate-950 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Message
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your heartfelt wish or prayer for Abubakr..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Voice Message Attachment */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  <span>Voice Wish (Optional)</span>
                </span>
                <span className="text-[10px] text-slate-400">Song pauses during playback</span>
              </div>

              {recorderError && (
                <p className="text-xs text-rose-400">{recorderError}</p>
              )}

              {!audioDataUrl ? (
                <div>
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startVoiceRecording}
                      className="py-1.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Record Voice Message</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={stopVoiceRecording}
                        className="py-1.5 px-3 rounded-xl bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Square className="w-3 h-3 fill-current" />
                        <span>Stop ({recordingSeconds}s)</span>
                      </button>
                      <span className="text-xs text-rose-400 animate-pulse">Recording voice...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-300 flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> Voice recorded!
                    </span>
                    <button
                      type="button"
                      onClick={() => setAudioDataUrl(null)}
                      className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                  <VoiceMessagePlayer audioSrc={audioDataUrl} senderName={name || 'You'} />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Posting Wish...' : 'Post Birthday Wish'}</span>
            </button>
          </form>
        </div>

        {/* Existing Wishes Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <span className="text-sm font-semibold text-slate-300">
              Messages from Family & Friends ({wishes.length})
            </span>
            <span className="text-xs text-amber-400/80">Synced with Firebase ☁️</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[580px] overflow-y-auto pr-1">
            {wishes.map((w) => (
              <div
                key={w.id}
                className="rounded-2xl p-4 bg-slate-900/80 border border-slate-800 hover:border-amber-400/30 transition-all text-left flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {w.name}
                      </h4>
                      <span className="text-[11px] text-amber-400/90 font-medium">
                        {w.relation}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300 whitespace-nowrap">
                        {w.badge}
                      </span>
                      <button
                        onClick={(e) => handleDeleteWish(w.id, e)}
                        className="p-1 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                        title="Delete wish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-2">
                    &ldquo;{w.message}&rdquo;
                  </p>

                  {/* Voice Player if attached */}
                  {w.audioDataUrl && (
                    <VoiceMessagePlayer audioSrc={w.audioDataUrl} senderName={w.name} />
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> With Cousin Love
                  </span>
                  <span>{w.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
