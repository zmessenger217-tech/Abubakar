import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { X, Mic, Square, Trash2, Send, Wand2, User, Users, Volume2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { COUSIN_BLESSINGS } from '../data/memories';
import { audioEngine } from '../services/audioEngine';
import { VoiceMessagePlayer } from './VoiceMessagePlayer';

interface AddWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRecordOpen?: boolean;
}

export const AddWishModal: React.FC<AddWishModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Cousin');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🌟');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);
  const [recorderError, setRecorderError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  if (!isOpen) return null;

  const handleGenerateBlessing = () => {
    const randomBlessing = COUSIN_BLESSINGS[Math.floor(Math.random() * COUSIN_BLESSINGS.length)];
    setMessage(randomBlessing);
    audioEngine.playChime();
  };

  const startVoiceRecording = async () => {
    try {
      setRecorderError(null);
      // Pause song during recording to get a clear voice message
      audioEngine.pauseForVoiceMessage();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
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
      setRecorderError('Microphone access denied. Please allow microphone permission in your browser.');
      setIsRecording(false);
      audioEngine.resumeAfterVoiceMessage();
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const clearVoiceRecording = () => {
    setAudioDataUrl(null);
    setRecordingSeconds(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const wishPayload = {
        name: name.trim(),
        relation: relation.trim() || 'Cousin',
        message: message.trim(),
        badge: `${selectedEmoji} ${relation || 'Family Wish'}`,
        audioDataUrl: audioDataUrl || '',
        hasAudio: !!audioDataUrl,
        createdAt: new Date().toISOString(),
        serverTime: serverTimestamp(),
      };

      await addDoc(collection(db, 'wishes'), wishPayload);

      audioEngine.playApplause();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
      });

      setName('');
      setMessage('');
      setAudioDataUrl(null);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'wishes');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-left max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white font-display">
              Add Birthday Wish & Voice
            </h3>
            <p className="text-xs text-slate-400">
              Leave a message or record a live audio wish for Abubakr!
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerateBlessing}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Du&apos;a Idea</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., Cousin Ahmar, Uncle Tariq..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Relation to Abubakr
            </label>
            <div className="relative">
              <input
                type="text"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="E.g., Cousin, Elder Sister, Friend..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <Users className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your Written Birthday Wish
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your prayers and warm birthday wishes for Abubakr..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* Voice Message Recorder Section */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                <span>Voice Wish (Optional)</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Song pauses when voice plays
              </span>
            </div>

            {recorderError && (
              <p className="text-xs text-rose-400">{recorderError}</p>
            )}

            {!audioDataUrl ? (
              <div className="flex items-center gap-3 pt-1">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startVoiceRecording}
                    className="py-2 px-3.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Mic className="w-4 h-4 text-amber-400" />
                    <span>Record Voice Wish</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={stopVoiceRecording}
                      className="py-2 px-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-rose-500/20"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop Recording ({recordingSeconds}s)</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-xs text-rose-300">Recording live...</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    Voice recording ready!
                  </span>
                  <button
                    type="button"
                    onClick={clearVoiceRecording}
                    className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Re-record</span>
                  </button>
                </div>
                {/* Voice Preview */}
                <VoiceMessagePlayer audioSrc={audioDataUrl} senderName={name || 'You'} />
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Posting Wish...' : 'Post Birthday Wish'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
