// Minimal WebAudio SFX for the café — soft, warm, never harsh. Lazy after a gesture.
export class Sfx {
  private ctx: AudioContext | null = null;
  enabled = true;
  constructor() { try { this.enabled = localStorage.getItem("catpu_muted") !== "1"; } catch { /* */ } }
  private ac(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)(); } catch { this.enabled = false; return null; } }
    return this.ctx;
  }
  private blip(freq: number, dur: number, type: OscillatorType, vol: number, slideTo?: number) {
    const ac = this.ac(); if (!ac) return;
    const t = ac.currentTime; const o = ac.createOscillator(); const g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t); if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur);
  }
  private noise(dur: number, filt: number, vol: number, hp = false) {
    const ac = this.ac(); if (!ac) return;
    const t = ac.currentTime; const len = Math.floor(ac.sampleRate * dur);
    const buf = ac.createBuffer(1, len, ac.sampleRate); const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = ac.createBufferSource(); s.buffer = buf;
    const f = ac.createBiquadFilter(); f.type = hp ? "highpass" : "lowpass"; f.frequency.value = filt;
    const g = ac.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(ac.destination); s.start(t); s.stop(t + dur + 0.02);
  }
  setEnabled(b: boolean) { this.enabled = b; try { localStorage.setItem("catpu_muted", b ? "0" : "1"); } catch { /* */ } }

  bell() { this.blip(1320, 0.18, "sine", 0.05, 1760); this.blip(1980, 0.16, "sine", 0.03); }   // door chime
  brew() { this.noise(0.32, 1600, 0.05, true); this.blip(220, 0.18, "sine", 0.03, 320); }        // steam pour
  serve() { this.blip(660, 0.1, "sine", 0.05, 880); this.blip(990, 0.12, "triangle", 0.04); }     // ding
  purr() { this.blip(120, 0.4, "sawtooth", 0.03, 90); }                                            // content purr
  coin() { this.blip(880, 0.08, "square", 0.04, 1320); }
  sad() { this.blip(400, 0.3, "sine", 0.05, 180); }                                                // sad meow
  unlock() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.blip(f, 0.2, "triangle", 0.06), i * 100)); }
  click() { this.blip(560, 0.04, "sine", 0.03, 740); }
  tap() { this.blip(720, 0.05, "sine", 0.035); }
}
let _sfx: Sfx | null = null;
export function getSfx(): Sfx { if (!_sfx) _sfx = new Sfx(); return _sfx; }
