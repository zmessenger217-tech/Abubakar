import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Gift, Sparkles, Send, Upload, Image as ImageIcon } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { ABUBAKR_PHOTOS } from '../data/memories';
import { audioEngine } from '../services/audioEngine';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose }) => {
  const [senderName, setSenderName] = useState('');
  const [relation, setRelation] = useState('Cousin');
  const [roleBadge, setRoleBadge] = useState('Cousin Squad 🌟');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [dua, setDua] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(ABUBAKR_PHOTOS[0].url);
  const [photoCaption, setPhotoCaption] = useState('Special Memory');
  const [theme, setTheme] = useState<'gold' | 'rose' | 'blue' | 'emerald' | 'purple' | 'yellow'>('gold');
  const [audioUrl, setAudioUrl] = useState('/assets/aistudio/song-j3bB7D3Zmqm6bUxcJm8u__1__f18324e7.mp4');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhoto(reader.result as string);
        setPhotoCaption('Personal Photo');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const cardPayload = {
        senderName: senderName.trim(),
        relation: relation.trim() || 'Cousin',
        roleBadge: roleBadge.trim() || 'Cousin Squad 🌟',
        title: title.trim() || `Happy Birthday from ${senderName}`,
        message: message.trim(),
        dua: dua.trim() || 'May Allah bless Abubakr with endless joy and success! 🤲✨',
        photoUrl: selectedPhoto,
        photoCaption: photoCaption.trim() || 'Special Memory',
        audioUrl,
        theme,
        likes: 1,
        createdAt: new Date().toISOString(),
        serverTime: serverTimestamp(),
      };

      await addDoc(collection(db, 'birthday_cards'), cardPayload);

      audioEngine.playPartyHorn();
      audioEngine.playApplause();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
      });

      setIsSubmitting(false);
      onClose();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'birthday_cards');
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

        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display">
              Create a Birthday Card
            </h3>
            <p className="text-xs text-slate-400">
              Add your personalized celebration card with your own picture!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="E.g., Ahmar, Alveena, Hania..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Relation
              </label>
              <input
                type="text"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="E.g., Cousin, Sister, Friend..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Picture Upload / Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Card Picture (Upload from your device or select below)
            </label>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="text"
                placeholder="Or paste image URL..."
                value={selectedPhoto.startsWith('data:') ? 'Custom uploaded photo' : selectedPhoto}
                onChange={(e) => setSelectedPhoto(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
              <label className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Thumbnail selector */}
            <div className="grid grid-cols-6 gap-2">
              {ABUBAKR_PHOTOS.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => {
                    setSelectedPhoto(photo.url);
                    setPhotoCaption(photo.subtitle);
                  }}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedPhoto === photo.url
                      ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/30'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Song / Audio Attachment */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Card Song / Audio Track (Default celebration song or upload your own song)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="Audio URL or song..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
              <label className="py-2 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Song</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Card Theme
            </label>
            <div className="grid grid-cols-6 gap-1.5 text-xs">
              {(['gold', 'rose', 'blue', 'emerald', 'purple', 'yellow'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`py-1.5 px-2 rounded-xl capitalize border transition-all cursor-pointer ${
                    theme === t
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Card Title / Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Happy Birthday to the Best Cousin!"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Personal Message
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What makes Abubakr special to you? Share your warmest birthday wishes..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Du&apos;a / Prayer for Abubakr
            </label>
            <input
              type="text"
              value={dua}
              onChange={(e) => setDua(e.target.value)}
              placeholder="E.g., May Allah bless you with happiness and barakah! 🤲✨"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
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
              <span>{isSubmitting ? 'Adding Card...' : 'Add Celebration Card'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
