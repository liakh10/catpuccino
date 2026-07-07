// Local persistence: best score, total beans (coins), unlocked cats. Device-local.
const BEST_KEY = "catpu_best";
const BEANS_KEY = "catpu_beans";
const CATS_KEY = "catpu_cats";
const MUTED_KEY = "catpu_muted";

export function getBest(): number { try { return Number(localStorage.getItem(BEST_KEY) || "0") || 0; } catch { return 0; } }
export function saveBest(v: number): boolean {
  if (v <= getBest()) return false;
  try { localStorage.setItem(BEST_KEY, String(v)); return true; } catch { return false; }
}

export function getBeans(): number { try { return Number(localStorage.getItem(BEANS_KEY) || "0") || 0; } catch { return 0; } }
export function setBeans(v: number) { try { localStorage.setItem(BEANS_KEY, String(Math.max(0, Math.floor(v)))); } catch { /* */ } }

export function getUnlocked(): string[] {
  try { const s = localStorage.getItem(CATS_KEY); return s ? (JSON.parse(s) as string[]) : []; } catch { return []; }
}
export function addUnlocked(id: string): string[] {
  const cur = getUnlocked();
  if (!cur.includes(id)) { cur.push(id); try { localStorage.setItem(CATS_KEY, JSON.stringify(cur)); } catch { /* */ } }
  return cur;
}

export function getMuted(): boolean { try { return localStorage.getItem(MUTED_KEY) === "1"; } catch { return false; } }
export function setMuted(v: boolean) { try { localStorage.setItem(MUTED_KEY, v ? "1" : "0"); } catch { /* */ } }
