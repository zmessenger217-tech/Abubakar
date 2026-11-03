import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Mic } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface VoiceMessagePlayerProps {
  audioSrc: string;
  senderName: string;
}

export const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({ audioSrc, senderName }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioSrc);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.onended = () => {
      setIsPlaying(false);
      setProgress(0);
      audioEngine.resumeAfterVoiceMessage();
    };

    audio.onpause = () => {
      setIsPlaying(false);
      audioEngine.resumeAfterVoiceMessage();
    };

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioSrc]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioEngine.resumeAfterVoiceMessage();
    } else {
      // Pause background music before playing voice
      audioEngine.pauseForVoiceMessage();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error('Audio playback error:', err);
        audioEngine.resumeAfterVoiceMessage();
      });
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center gap-3">
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        title={isPlaying ? 'Pause Voice Message' : `Play Voice Wish from ${senderName}`}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        )}
      </button>

      {/* Progress & Waveform Simulation */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-[10px] text-amber-300 font-medium mb-1">
          <span className="flex items-center gap-1">
            <Mic className="w-3 h-3 text-amber-400" />
            <span>Voice Wish</span>
          </span>
          <span className="tabular-nums">
            {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'} / {formatTime(duration)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-rose-400 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-[10px] text-slate-500 hidden sm:flex items-center gap-0.5 shrink-0" title="Song pauses while voice plays">
        <Volume2 className="w-3 h-3 text-amber-400/80" />
      </div>
    </div>
  );
};
