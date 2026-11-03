import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Image as ImageIcon, Upload, Send, MapPin, Calendar, Sparkles } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { audioEngine } from '../services/audioEngine';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [location, setLocation] = useState('Lahore, Pakistan');
  const [date, setDate] = useState('Birthday Celebration');
  const [note, setNote] = useState('');
  const [contributor, setContributor] = useState('Cousin');
  const [photoUrl, setPhotoUrl] = useState('');
  const [tag, setTag] = useState<'celebration' | 'candid' | 'style' | 'school'>('celebration');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !note.trim() || !photoUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const tagLabels = {
        celebration: 'Celebration Special',
        candid: 'Family Favorite',
        style: 'Iconic Style',
        school: 'School Moments',
      };

      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim() || 'Precious moment with Abubakr',
        location: location.trim() || 'Lahore, Pakistan',
        date: date.trim() || 'Celebration Days',
        note: note.trim(),
        contributor: contributor.trim() || 'Cousin',
        url: photoUrl,
        tag,
        tagLabel: tagLabels[tag],
        createdAt: new Date().toISOString(),
        serverTime: serverTimestamp(),
      };

      await addDoc(collection(db, 'memory_pictures'), payload);

      audioEngine.playChime();
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
      });

      setIsSubmitting(false);
      onClose();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'memory_pictures');
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
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display">
              Add Memory Picture
            </h3>
            <p className="text-xs text-slate-400">
              Share a photo of Abubakr with a loving story for the album!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Source */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Photo (Upload Image or Paste URL)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Paste image URL..."
                value={photoUrl.startsWith('data:') ? 'Image uploaded from device' : photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
              <label className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 shrink-0">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Photo Preview */}
            {photoUrl && (
              <div className="mt-2 relative w-32 aspect-[3/4] rounded-xl overflow-hidden border border-amber-500/30 shadow-md">
                <img
                  src={photoUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Memory Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Fun Times in Lahore..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="celebration">Birthday Special</option>
                <option value="candid">Family Favorite</option>
                <option value="style">Cool Poses</option>
                <option value="school">School Days</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" /> Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="E.g., Lahore, Pakistan"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400" /> Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="E.g., November 2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Memory Note / Story
            </label>
            <textarea
              required
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What happened on this day? Write a sweet note about Abubakr..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400 resize-none"
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
              disabled={isSubmitting || !photoUrl}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Uploading...' : 'Add to Album'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
