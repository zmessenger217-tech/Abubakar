import React, { useState, useEffect } from 'react';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Share2, MapPin, Calendar, Heart, Download, PlusCircle } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { ABUBAKR_PHOTOS, MemoryPhoto } from '../data/memories';
import { audioEngine } from '../services/audioEngine';

interface MemoryGalleryProps {
  onOpenShareModal: () => void;
  onOpenAddMemory?: () => void;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({ onOpenAddMemory }) => {
  const [photos, setPhotos] = useState<MemoryPhoto[]>(ABUBAKR_PHOTOS);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<MemoryPhoto | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'memory_pictures'), orderBy('serverTime', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const livePhotos: MemoryPhoto[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            url: data.url,
            title: data.title,
            subtitle: data.subtitle || 'Shared by family',
            tag: data.tag || 'celebration',
            tagLabel: data.tagLabel || 'Family Memory',
            location: data.location || 'Lahore, Pakistan',
            date: data.date || 'Memorable Days',
            note: data.note || '',
          };
        });

        if (livePhotos.length > 0) {
          const liveUrls = new Set(livePhotos.map((p) => p.url));
          const extraBaseline = ABUBAKR_PHOTOS.filter((p) => !liveUrls.has(p.url));
          setPhotos([...extraBaseline, ...livePhotos]);
        } else {
          setPhotos(ABUBAKR_PHOTOS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'memory_pictures');
        setPhotos(ABUBAKR_PHOTOS);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredPhotos = selectedTag === 'all'
    ? photos
    : photos.filter((p) => p.tag === selectedTag);

  const openLightbox = (photo: MemoryPhoto) => {
    setActivePhoto(photo);
    audioEngine.playChime();
  };

  const closeLightbox = () => {
    setActivePhoto(null);
  };

  const nextPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = photos.findIndex((p) => p.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % photos.length;
    setActivePhoto(photos[nextIndex]);
    audioEngine.playChime();
  };

  const prevPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = photos.findIndex((p) => p.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setActivePhoto(photos[prevIndex]);
    audioEngine.playChime();
  };

  const handleSharePhoto = (photo: MemoryPhoto) => {
    const text = `Check out this lovely photo of Abubakr on his Birthday: "${photo.title}"! 🎉🎂 ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: `Happy Birthday Abubakr - ${photo.title}`,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <section id="memories" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Moments & Memories</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mb-3">
          Abubakr’s <span className="gold-gradient-text">Photo Album</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300">
          From his golden birthday celebration to school days and his iconic thinker poses — a collection of fond memories.
        </p>

        {/* Filter and Add Memory Button */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedTag === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Moments ({photos.length})
            </button>
            <button
              onClick={() => setSelectedTag('celebration')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedTag === 'celebration'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Birthday Special
            </button>
            <button
              onClick={() => setSelectedTag('style')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedTag === 'style'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cool Poses
            </button>
            <button
              onClick={() => setSelectedTag('school')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedTag === 'school'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              School Days
            </button>
            <button
              onClick={() => setSelectedTag('candid')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedTag === 'candid'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Candid Smiles
            </button>
          </div>

          {onOpenAddMemory && (
            <button
              onClick={onOpenAddMemory}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Add Memory Picture</span>
            </button>
          )}
        </div>
      </div>

      {/* Responsive Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => openLightbox(photo)}
            className="group relative rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/40 p-3 sm:p-4 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
          >
            {/* Image Container with Styled CSS Fallback */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={photo.url}
                alt={photo.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />

              {/* Shading scrim for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

              {/* Top Meta Tag & Zoom trigger */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-amber-300 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/20 shadow-md">
                  {photo.tagLabel}
                </span>

                <span className="w-8 h-8 rounded-lg bg-slate-950/80 backdrop-blur-md text-slate-300 flex items-center justify-center group-hover:text-amber-400 group-hover:scale-110 transition-all border border-slate-700/60 shadow-md">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </div>

              {/* Bottom In-image Location Tag */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{photo.location}</span>
              </div>
            </div>

            {/* Card Content & Cousin Note */}
            <div className="pt-3.5 px-1 space-y-1.5 text-left">
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                {photo.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {photo.note}
              </p>

              {/* Unboxed metadata separator */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{photo.date}</span>
                </span>
                <span className="text-amber-400/90 font-medium group-hover:underline">
                  Tap to view →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/80 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700/60 shadow-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Big Image Viewport with Nav Arrows */}
            <div className="relative lg:w-3/5 bg-black flex items-center justify-center overflow-hidden min-h-[320px] sm:min-h-[420px]">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-full object-contain p-2"
              />

              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 shadow-md cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 shadow-md cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Right: Detailed Story & Actions */}
            <div className="lg:w-2/5 p-6 flex flex-col justify-between text-left overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{activePhoto.tagLabel}</span>
                </div>

                <h3 className="text-2xl font-bold text-white font-display">
                  {activePhoto.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> {activePhoto.location}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {activePhoto.date}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-xs font-semibold text-amber-300 block mb-1">
                    Cousin’s Memory Note:
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activePhoto.note}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-800 mt-6 flex flex-col gap-2.5">
                <button
                  onClick={() => handleSharePhoto(activePhoto)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share This Photo to WhatsApp</span>
                </button>

                <a
                  href={activePhoto.url}
                  download={`Abubakr_${activePhoto.id}.jpeg`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res Photo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
