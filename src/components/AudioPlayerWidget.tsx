import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, PartyPopper, Sparkles, Volume1, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../services/audioEngine';

export const AudioPlayerWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isSoundboardOpen, setIsSoundboardOpen] = useState<boolean>(false);

  useEffect(() => {
    audioEngine.onStateChange((playing) => {
      setIsPlaying(playing);
    });

    audioEngine.onTimeUpdate((curr, dur) => {
      setCurrentTime(curr);
      setDuration(dur);
    });
  }, []);

  const handleTogglePlay = () => {
    audioEngine.toggleMusic();
    setIsPlaying(audioEngine.getIsPlaying());
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioEngine.setVolume(val);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    audioEngine.seek(seekTime);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const triggerHorn = () => {
    audioEngine.playPartyHorn();
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.85 } });
  };

  const triggerPopper = () => {
    audioEngine.playConfettiPop();
    confetti({ particleCount: 45, spread: 70, origin: { y: 0.85 } });
  };

  const triggerApplause = () => {
    audioEngine.playApplause();
    confetti({ particleCount: 50, spread: 90, origin: { y: 0.85 } });
  };

  const triggerChime = () => {
    audioEngine.playChime();
  };

  return (
    <>
      {/* Native HTML5 Audio Element for reliable browser media playback */}
      <audio
        id="birthday-song-audio"
        src="/assets/aistudio/song-j3bB7D3Zmqm6bUxcJm8u__1__f18324e7.mp4"
        loop
        preload="auto"
      />

      {/* Floating Audio Dock */}
      <div className="fixed bottom-4 left-4 sm:left-6 z-40 flex flex-col gap-2">
        {/* Soundboard Drawer (when opened) */}
        {isSoundboardOpen && (
          <div className="bg-slate-900/95 border border-amber-500/30 backdrop-blur-md rounded-2xl p-3 shadow-2xl w-64 animate-fadeIn mb-1">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-amber-400">Celebration FX</span>
              <button
                onClick={() => setIsSoundboardOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={triggerHorn}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 transition-colors cursor-pointer text-left"
              >
                <PartyPopper className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Party Horn</span>
              </button>
              <button
                onClick={triggerPopper}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 transition-colors cursor-pointer text-left"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span>Confetti Pop</span>
              </button>
              <button
                onClick={triggerApplause}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 transition-colors cursor-pointer text-left"
              >
                <Bell className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Cheer & Clap</span>
              </button>
              <button
                onClick={triggerChime}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 transition-colors cursor-pointer text-left"
              >
                <Volume1 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Magic Chimes</span>
              </button>
            </div>
          </div>
        )}

        {/* Compact Dock Control Bar */}
        <div className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md border border-amber-500/30 rounded-2xl p-1.5 sm:p-2 shadow-xl shadow-black/50 transition-all">
          {/* Play/Pause Button */}
          <button
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause birthday song' : 'Play birthday song'}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform cursor-pointer shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Song Info & Timeline */}
          <div className="flex flex-col pr-1 min-w-[120px] sm:min-w-[170px]">
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-xs font-semibold text-slate-100 max-w-[130px] sm:max-w-[150px] truncate">
                Happy Birthday Abubakr
              </span>
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-3">
                  <div className="w-0.5 bg-amber-400 h-full animate-[pulse_0.4s_infinite]" />
                  <div className="w-0.5 bg-amber-400 h-2/3 animate-[pulse_0.6s_infinite]" />
                  <div className="w-0.5 bg-amber-400 h-4/5 animate-[pulse_0.5s_infinite]" />
                </div>
              )}
            </div>

            {/* Scrubber slider and time display */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-16 sm:w-24 h-1 accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] text-amber-400/90 tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Soundboard trigger */}
          <button
            onClick={() => setIsSoundboardOpen(!isSoundboardOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 transition-colors"
            title="Soundboard and Sound Effects"
          >
            <PartyPopper className="w-4 h-4" />
          </button>

          {/* Volume control */}
          <div className="hidden sm:flex items-center gap-1.5 pl-1 border-l border-slate-800">
            {volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-14 h-1 accent-amber-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
};
