/**
 * Audio Engine for Abubakr's Birthday Celebration
 * Uses the user's newly attached song track (`/assets/aistudio/song-j3bB7D3Zmqm6bUxcJm8u__1__f18324e7.mp4`),
 * with looping, volume control, voice message coordination (auto-pause and resume),
 * and celebratory interactive sound effects.
 */

const SONG_URL = '/assets/aistudio/song-j3bB7D3Zmqm6bUxcJm8u__1__f18324e7.mp4';

class BirthdayAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private sfxCtx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private wasPlayingBeforeVoice: boolean = false;
  private volume: number = 0.85;
  private onStateChangeCallback: ((playing: boolean) => void) | null = null;
  private onTimeUpdateCallback: ((current: number, duration: number) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    if (this.audio) return;

    try {
      if (typeof document !== 'undefined') {
        let el = document.getElementById('birthday-song-audio') as HTMLAudioElement | null;
        if (!el) {
          el = document.createElement('audio');
          el.id = 'birthday-song-audio';
          el.src = SONG_URL;
          el.loop = true;
          el.preload = 'auto';
          document.body.appendChild(el);
        }
        this.audio = el;
      } else {
        this.audio = new Audio(SONG_URL);
        this.audio.loop = true;
        this.audio.preload = 'auto';
      }

      this.audio.volume = this.volume;
      this.audio.load();

      this.audio.onplay = () => {
        this.isPlaying = true;
        if (this.onStateChangeCallback) this.onStateChangeCallback(true);
      };

      this.audio.onpause = () => {
        this.isPlaying = false;
        if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      };

      this.audio.ontimeupdate = () => {
        if (this.audio && this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(this.audio.currentTime, this.audio.duration || 0);
        }
      };

      this.audio.onerror = (e) => {
        console.warn('Audio element error:', e, this.audio?.error);
      };
    } catch (err) {
      console.error('Failed to initialize audio element:', err);
    }
  }

  private initSfxContext() {
    if (!this.sfxCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.sfxCtx = new AudioCtx();
      this.sfxGain = this.sfxCtx.createGain();
      this.sfxGain.gain.setValueAtTime(this.volume, this.sfxCtx.currentTime);
      this.sfxGain.connect(this.sfxCtx.destination);
    }
    if (this.sfxCtx && this.sfxCtx.state === 'suspended') {
      this.sfxCtx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    if (this.sfxGain && this.sfxCtx) {
      this.sfxGain.gain.setValueAtTime(this.volume, this.sfxCtx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public onStateChange(cb: (playing: boolean) => void) {
    this.onStateChangeCallback = cb;
  }

  public onTimeUpdate(cb: (current: number, duration: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public playBirthdaySong() {
    this.initAudioElement();
    if (!this.audio) return;

    this.initSfxContext();

    if (this.audio.readyState === 0) {
      this.audio.load();
    }

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isPlaying = true;
        if (this.onStateChangeCallback) this.onStateChangeCallback(true);
      }).catch((err) => {
        console.warn('Audio play failed or was interrupted:', err);
        this.isPlaying = false;
        if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      });
    }
  }

  public stopBirthdaySong() {
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    if (this.onStateChangeCallback) this.onStateChangeCallback(false);
  }

  public toggleMusic() {
    if (this.isPlaying) {
      this.stopBirthdaySong();
    } else {
      this.playBirthdaySong();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTime(): number {
    return this.audio ? this.audio.currentTime : 0;
  }

  public getDuration(): number {
    return this.audio && Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
  }

  public seek(seconds: number) {
    if (this.audio && Number.isFinite(seconds)) {
      this.audio.currentTime = seconds;
    }
  }

  // Voice message coordination
  public pauseForVoiceMessage() {
    if (this.isPlaying) {
      this.wasPlayingBeforeVoice = true;
      this.stopBirthdaySong();
    }
  }

  public resumeAfterVoiceMessage() {
    if (this.wasPlayingBeforeVoice && !this.isPlaying) {
      this.wasPlayingBeforeVoice = false;
      this.playBirthdaySong();
    }
  }

  // Interactive Sound Effects
  public playPartyHorn() {
    this.initSfxContext();
    if (!this.sfxCtx || !this.sfxGain) return;
    const now = this.sfxCtx.currentTime;
    const osc = this.sfxCtx.createOscillator();
    const gain = this.sfxCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.15);
    osc.frequency.linearRampToValueAtTime(440, now + 0.5);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.6);
  }

  public playConfettiPop() {
    this.initSfxContext();
    if (!this.sfxCtx || !this.sfxGain) return;
    const now = this.sfxCtx.currentTime;
    const bufferSize = this.sfxCtx.sampleRate * 0.15;
    const buffer = this.sfxCtx.createBuffer(1, bufferSize, this.sfxCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.sfxCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.sfxCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(2, now);

    const gain = this.sfxCtx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);
  }

  public playApplause() {
    this.initSfxContext();
    if (!this.sfxCtx) return;
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        this.playConfettiPop();
      }, i * 90);
    }
  }

  public playChime() {
    this.initSfxContext();
    if (!this.sfxCtx || !this.sfxGain) return;
    const now = this.sfxCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      if (!this.sfxCtx || !this.sfxGain) return;
      const osc = this.sfxCtx.createOscillator();
      const gain = this.sfxCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.55);
    });
  }

  public playCandleBlow() {
    this.initSfxContext();
    if (!this.sfxCtx || !this.sfxGain) return;
    const now = this.sfxCtx.currentTime;
    const bufferSize = this.sfxCtx.sampleRate * 0.4;
    const buffer = this.sfxCtx.createBuffer(1, bufferSize, this.sfxCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * (i / bufferSize));
    }
    const noise = this.sfxCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.sfxCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.4);

    const gain = this.sfxCtx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);
  }
}

export const audioEngine = new BirthdayAudioEngine();
