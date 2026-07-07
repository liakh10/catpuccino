"use client";

import { useEffect, useRef, useState } from "react";
import { getMusic } from "./music";
import { getSfx } from "./sfx";
import { CupLogo, Steam } from "./art/icons";
import { Cat } from "./art/cats";
import { catById } from "./cafe/data";

const BOOT_LINES = [
  "unlocking the café door",
  "grinding fresh beans",
  "warming the milk",
  "waking the cats",
  "steaming the foam",
];

type Phase = "boot" | "wake" | "gone";

// Cozy intro: a café "opening up" loader → a "tap to open the café" splash that
// starts the music on the gesture, then reveals the site.
export default function Enter() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [pct, setPct] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);
  const sleepy = catById("biscuit");

  useEffect(() => {
    if (phase !== "gone") document.body.style.overflow = "hidden"; else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  useEffect(() => {
    if (phase !== "boot") return;
    let p = 0;
    const id = window.setInterval(() => {
      p = Math.min(100, p + 3 + Math.random() * 6);
      setPct(Math.round(p));
      const have = Math.min(BOOT_LINES.length, Math.ceil((p / 100) * BOOT_LINES.length));
      setLines((prev) => (prev.length < have ? BOOT_LINES.slice(0, have) : prev));
      if (p >= 100) { clearInterval(id); setTimeout(() => setPhase("wake"), 420); }
    }, 140);
    return () => clearInterval(id);
  }, [phase]);

  const wake = () => {
    if (done.current) return;
    done.current = true;
    try { getMusic().play(); } catch { /* */ }
    getSfx().bell();
    setLeaving(true);
    window.dispatchEvent(new Event("catpu:awake"));
    setTimeout(() => setPhase("gone"), 700);
  };

  if (phase === "gone") return null;

  return (
    <div className={`enter ${leaving ? "enter-leaving" : ""}`}>
      {phase === "boot" && (
        <div className="boot">
          <div className="boot-logo"><CupLogo size={52} /><Steam size={22} className="boot-steam" /></div>
          <p className="boot-title">Catpuccino Café</p>
          <div className="boot-bar"><span className="boot-fill" style={{ width: `${pct}%` }} /></div>
          <p className="boot-pct">{pct}%</p>
          <ul className="boot-log">
            {lines.map((l, i) => <li key={i}><span className="boot-ok">✓</span> {l}…</li>)}
          </ul>
        </div>
      )}

      {phase === "wake" && (
        <button className="wake" onClick={wake} aria-label="Tap to open the café">
          <span className="wake-cat"><Cat spec={sleepy} blink /></span>
          <span className="wake-sign">Catpuccino Café</span>
          <span className="wake-cta">tap to open the café</span>
          <span className="wake-sub">sound on · freshly brewed</span>
        </button>
      )}
    </div>
  );
}
