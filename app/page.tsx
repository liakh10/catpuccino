"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CA, TICKER, X_URL, PUMP_URL, DEX_URL, isRealCA } from "./config";
import { CATS, catById } from "./cafe/data";
import { Cat } from "./art/cats";
import { CupLogo, XIcon, Bean, Paw, Drink } from "./art/icons";
import { getSfx } from "./sfx";
import { getMusic } from "./music";
import { getBeans, setBeans, getUnlocked, addUnlocked } from "./store";
import Enter from "./Enter";

const Cafe = dynamic(() => import("./cafe/Cafe"), { ssr: false });

const NAV = [
  { href: "#play", label: "Play" },
  { href: "#cats", label: "The Cats" },
  { href: "#menu", label: "Menu" },
];

const HOW = [
  ["Take the order", "A cat sits down with a drink in its thought bubble. Read what it wants."],
  ["Brew it", "Tap that drink on the menu to make it — a fresh Catpuccino, latte, matcha…"],
  ["Serve & purr", "Tap the cat to serve. Fast serves earn more beans and build a combo."],
];

const NOTES = [
  { h: "What is this?", b: "A cozy little café you run for cats. Brew their drinks before they get grumpy, earn beans, and adopt the whole clowder. It plays right on the page." },
  { h: "The beans", b: "Beans you earn adopt new cats into your Collection. $CATPU is the café's house bean — fair launch on Solana, no roadmap of promises, just vibes and cats." },
  { h: "Signature", b: "The Catpuccino: a cappuccino with a little cat drawn in the foam. Every cat orders one eventually. Nobody can resist." },
];

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function CABlock() {
  const [copied, setCopied] = useState(false);
  const real = isRealCA();
  const copy = () => navigator.clipboard?.writeText(CA).then(() => { setCopied(true); getSfx().coin(); setTimeout(() => setCopied(false), 1400); }).catch(() => {});
  return (
    <div className="ca">
      <span className="ca-label">CA</span>
      <code className="ca-value">{real ? CA : "SOON"}</code>
      {real && <button className="ca-copy" onClick={copy}>{copied ? "copied" : "copy"}</button>}
    </div>
  );
}

function BuyLinks({ small }: { small?: boolean }) {
  const cls = small ? "btn btn-sm" : "btn";
  return (
    <div className="buy">
      <a className={`${cls} btn-coffee`} href={isRealCA() ? PUMP_URL + CA : PUMP_URL} target="_blank" rel="noreferrer">Pump Fun</a>
      <a className={`${cls} btn-cream`} href={isRealCA() ? DEX_URL + CA : DEX_URL} target="_blank" rel="noreferrer">DexScreener</a>
    </div>
  );
}

// ── the gimmick: a cat peeking in a corner whose eyes follow the cursor ──
function CornerCat() {
  const lp = useRef<SVGGElement>(null);
  const rp = useRef<SVGGElement>(null);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = box.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const ex = r.left + r.width / 2, ey = r.top + r.height * 0.42;
      const a = Math.atan2(e.clientY - ey, e.clientX - ex);
      const tx = Math.cos(a) * 3.2, ty = Math.sin(a) * 3.2;
      lp.current?.setAttribute("transform", `translate(${tx} ${ty})`);
      rp.current?.setAttribute("transform", `translate(${tx} ${ty})`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div className="corner-cat" ref={box} aria-hidden>
      <svg viewBox="0 0 120 90" fill="none">
        <path d="M20 44c-8-30-2-40 8-40 6 0 10 8 12 18M100 44c8-30 2-40-8-40-6 0-10 8-12 18" fill="#4a4048" stroke="#2a1c14" strokeWidth="3" />
        <path d="M60 30c26 0 42 18 42 44 0 10-4 16-12 16H30c-8 0-12-6-12-16 0-26 16-44 42-44Z" fill="#4a4048" stroke="#2a1c14" strokeWidth="3" />
        <g><circle cx="46" cy="60" r="10" fill="#f4e9d8" /><g ref={lp}><circle cx="46" cy="60" r="4.6" fill="#2a1c14" /></g></g>
        <g><circle cx="74" cy="60" r="10" fill="#f4e9d8" /><g ref={rp}><circle cx="74" cy="60" r="4.6" fill="#2a1c14" /></g></g>
        <path d="M57 72h6l-3 3Z" fill="#e08a86" />
      </svg>
    </div>
  );
}

function Collection() {
  const [beans, setBeansState] = useState(0);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => { setBeansState(getBeans()); setUnlocked(getUnlocked()); };
    refresh();
    window.addEventListener("catpu:update", refresh);
    window.addEventListener("catpu:awake", refresh);
    return () => { window.removeEventListener("catpu:update", refresh); window.removeEventListener("catpu:awake", refresh); };
  }, []);

  const adopt = (id: string, cost: number) => {
    if (getBeans() < cost) { getSfx().sad(); return; }
    setBeans(getBeans() - cost); const u = addUnlocked(id);
    setBeansState(getBeans()); setUnlocked([...u]); setFlash(id);
    getSfx().unlock(); setTimeout(() => setFlash(null), 900);
  };

  const has = (c: (typeof CATS)[number]) => c.cost === 0 || unlocked.includes(c.id);

  return (
    <div className="collection">
      <div className="coll-bar reveal"><Bean size={20} /> <b>{beans}</b> beans to spend · {unlocked.filter((id) => catById(id).cost > 0).length}/{CATS.filter((c) => c.cost > 0).length} adopted</div>
      <div className="coll-grid">
        {CATS.map((c) => {
          const owned = has(c);
          return (
            <div className={`coll-card reveal rarity-${c.rarity} ${owned ? "owned" : "locked"} ${flash === c.id ? "flash" : ""}`} key={c.id}>
              <div className="coll-art"><Cat spec={c} /></div>
              <div className="coll-name">{c.name}</div>
              <div className="coll-rar">{c.rarity}</div>
              {owned ? <div className="coll-tag">in the café</div>
                : <button className="btn btn-sm btn-coffee" onClick={() => adopt(c.id, c.cost)}><Bean size={14} /> {c.cost}</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  useReveal();
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    const onAwake = () => setMutedState(getMusic().muted);
    window.addEventListener("catpu:awake", onAwake);
    return () => window.removeEventListener("catpu:awake", onAwake);
  }, []);

  const toggleMute = () => {
    const m = !muted; setMutedState(m); getMusic().setMuted(m); getSfx().setEnabled(!m);
    if (!m) getMusic().play();
  };

  return (
    <>
      <Enter />
      <CornerCat />

      <main>
        <header className="nav">
          <a href="#top" className="brand"><CupLogo size={26} /> <b>Catpuccino</b> <span className="brand-ticker">{TICKER}</span></a>
          <nav className="nav-links">{NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}</nav>
          <div className="nav-actions">
            <button className="icon-btn" onClick={toggleMute} title="sound">{muted ? "off" : "on"}</button>
            <a href={X_URL} target="_blank" rel="noreferrer" className="icon-btn" aria-label="X"><XIcon size={16} /></a>
            <a href="#play" className="btn btn-coffee btn-sm">Play</a>
          </div>
        </header>

        {/* HERO = the playable café */}
        <section id="top" className="hero">
          <span className="pill reveal"><Paw size={14} /> a cozy cat café · on Solana</span>
          <h1 className="hero-title reveal">Catpuccino Café</h1>
          <p className="hero-sub reveal">Brew tiny coffees for sleepy cats. Keep them purring, earn beans, adopt the whole clowder. <b>Steam rising, cat incoming.</b></p>
          <div id="play" className="reveal"><Cafe /></div>
          <div className="hero-token reveal"><CABlock /><BuyLinks small /></div>
        </section>

        {/* HOW TO PLAY */}
        <section className="section">
          <div className="section-head reveal"><span className="pill">How it works</span><h2 className="section-title">Three sips to a happy cat</h2></div>
          <div className="how">
            {HOW.map(([h, b], i) => (
              <div className="how-item reveal" key={h}>
                <span className="how-n">{i + 1}</span>
                <h3>{h}</h3><p>{b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* THE CATS */}
        <section id="cats" className="section section-cats">
          <div className="section-head reveal"><span className="pill">The Cats</span><h2 className="section-title">Adopt the clowder</h2><p className="section-lead">Spend the beans you brew to bring every regular home. Rarer cats, rarer coats.</p></div>
          <Collection />
        </section>

        {/* MENU / NOTES */}
        <section id="menu" className="section">
          <div className="section-head reveal"><span className="pill">Menu</span><h2 className="section-title">On the chalkboard</h2></div>
          <div className="notes-wall">
            {NOTES.map((n, i) => (
              <article className={`note note-${i % 3} reveal`} key={n.h}><h3>{n.h}</h3><p>{n.b}</p></article>
            ))}
          </div>
          <div className="drinks-row reveal">
            {["catpuccino", "espresso", "latte", "matcha", "cocoa"].map((d) => (
              <div className="drink-chip" key={d}><Drink id={d} size={44} /><span>{d === "catpuccino" ? "Catpuccino" : d === "latte" ? "Caffè Latte" : d === "cocoa" ? "Hot Cocoa" : d[0].toUpperCase() + d.slice(1)}</span></div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-top reveal">
            <a href="#top" className="brand"><CupLogo size={24} /> <b>Catpuccino Café</b></a>
            <div className="footer-links"><a href="#play">Play</a><a href="#cats">Cats</a><a href="#menu">Menu</a><a href={X_URL} target="_blank" rel="noreferrer" className="footer-x"><XIcon size={15} /> X</a></div>
          </div>
          <div className="footer-buy reveal"><CABlock /><BuyLinks small /></div>
          <p className="footer-bottom">© {new Date().getFullYear()} {TICKER} · brewed with love for cats</p>
        </footer>
      </main>
    </>
  );
}
