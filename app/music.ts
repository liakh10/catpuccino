// Procedural cozy café music — a warm pad + a slow, lazy jazz-ish arpeggio built
// live with WebAudio (no mp3 dependency). Started by a user gesture (wake splash).

export class MusicEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  playing = false;
  muted = false;
  private step = 0;

  // A warm major-9 flavoured palette (café jazz), two octaves.
  private readonly notes = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];

  private ensure(): boolean {
    if (this.ctx) return true;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.0001;
      this.master.connect(this.ctx.destination);
      return true;
    } catch { return false; }
  }

  private pad() {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    [130.81, 196.0, 246.94].forEach((f, i) => {
      const o = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      o.type = "sine"; o.frequency.value = f;
      const lfo = this.ctx!.createOscillator(); const lg = this.ctx!.createGain();
      lfo.frequency.value = 0.06 + i * 0.02; lg.gain.value = 1.2;
      lfo.connect(lg); lg.connect(o.frequency);
      g.gain.value = 0.045;
      o.connect(g); g.connect(this.master!);
      o.start(t); lfo.start(t);
    });
  }

  private tick = () => {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    const pattern = [0, 2, 4, 6, 4, 2, 3, 1];
    const idx = pattern[this.step % pattern.length] + (this.step % 16 >= 8 ? 1 : 0);
    const f = this.notes[Math.min(idx, this.notes.length - 1)];
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "triangle"; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.08, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + 1.9);
    this.step++;
  };

  play() {
    if (!this.ensure() || !this.ctx || !this.master) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    if (this.playing) return;
    this.playing = true;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setValueAtTime(Math.max(0.0001, this.master.gain.value), this.ctx.currentTime);
    this.master.gain.exponentialRampToValueAtTime(this.muted ? 0.0001 : 0.85, this.ctx.currentTime + 2.5);
    this.pad();
    this.tick();
    this.timer = window.setInterval(this.tick, 720);
  }

  pause() {
    this.playing = false;
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (this.ctx && this.master) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);
    }
  }

  toggle() { if (this.playing) this.pause(); else this.play(); }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.ctx && this.master) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.exponentialRampToValueAtTime(m ? 0.0001 : 0.85, this.ctx.currentTime + 0.4);
    }
  }

  dispose() { this.pause(); try { this.ctx?.close(); } catch { /* */ } this.ctx = null; }
}

let _music: MusicEngine | null = null;
export function getMusic(): MusicEngine {
  if (!_music) {
    _music = new MusicEngine();
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") (window as unknown as { __music?: MusicEngine }).__music = _music;
  }
  return _music;
}
