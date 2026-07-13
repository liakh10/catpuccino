"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CA, TICKER, PUMP_URL, DEX_URL, isRealCA } from "../config";
import { CATS } from "../cafe/data";
import { CupLogo } from "../art/icons";

const SECTIONS = [
  { id: "overview", label: "What is Catpuccino?" },
  { id: "controls", label: "Gameplay & Controls" },
  { id: "scoring", label: "Scoring & Beans" },
  { id: "clowder", label: "The Clowder" },
  { id: "token", label: `${TICKER} Token` },
  { id: "local", label: "Local & Free" },
  { id: "roadmap", label: "Roadmap" },
  { id: "faq", label: "FAQ" },
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="docs-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

const RARITY_ORDER: Array<(typeof CATS)[number]["rarity"]> = ["common", "rare", "epic", "legendary"];

export default function DocsContent() {
  const [active, setActive] = useState("overview");
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    for (const s of SECTIONS) {
      const el = refs.current[s.id];
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  const real = isRealCA();

  return (
    <>
      <header className="nav">
        <Link href="/#top" className="brand"><CupLogo size={26} /> <b>Catpuccino</b> <span className="brand-ticker">{TICKER}</span></Link>
        <nav className="nav-links">
          <Link href="/#play">Play</Link>
          <Link href="/#cats">The Cats</Link>
          <Link href="/#menu">Menu</Link>
          <span className="docs-nav-crumb">Docs</span>
        </nav>
        <div className="nav-actions">
          <Link href="/#play" className="btn btn-coffee btn-sm">Play</Link>
        </div>
      </header>

      <div className="docs-shell">
        <aside className="docs-side">
          <span className="docs-kicker">Field Manual</span>
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={`docs-nav-link ${active === s.id ? "active" : ""}`}>
              {s.label}
            </a>
          ))}
        </aside>

        <main className="docs-main">
          <div className="docs-hero">
            <h1>Catpuccino Docs</h1>
            <p>Everything about the café loop, the clowder, beans, and {TICKER} — in one page.</p>
          </div>

          <section id="overview" ref={(el) => { refs.current.overview = el; }} className="docs-section">
            <h2>What is Catpuccino?</h2>
            <p>
              Catpuccino Café is a cozy single-player café-management game, playable instantly in the
              browser — no download, no signup. Cats sit down with a drink order in a thought bubble;
              you brew the right drink and serve it before their patience runs out.
            </p>
            <div className="docs-table">
              <Row label="Ticker">{TICKER} (Solana, fair launch)</Row>
              <Row label="Format">Single-player café sim, real-time, browser canvas + DOM</Row>
              <Row label="Menu">5 drinks — Catpuccino, Espresso, Caffè Latte, Matcha, Hot Cocoa</Row>
              <Row label="The Clowder">8 cat breeds across 4 rarities to adopt</Row>
              <Row label="Cost to play">Free, unlimited, no wallet required</Row>
            </div>
          </section>

          <section id="controls" ref={(el) => { refs.current.controls = el; }} className="docs-section">
            <h2>Gameplay & Controls</h2>
            <p>Three seats, one tray. Read the order, brew it, serve it — all with taps or clicks.</p>
            <div className="docs-table">
              <Row label="Take order">A cat sits at an open seat with a drink in its thought bubble</Row>
              <Row label="Brew">Tap a drink on the menu — it lands on the tray, one at a time</Row>
              <Row label="Serve">Tap the waiting cat — the tray drink must match its order</Row>
              <Row label="Patience">Each cat has a drain bar; empty patience = the cat leaves upset</Row>
              <Row label="Hearts">3 hearts total. A cat leaving costs one heart and resets your combo</Row>
              <Row label="Combo">Consecutive correct serves build a combo — bigger score & bean bonus per serve</Row>
              <Row label="Game over">Hearts hit zero — your run score and beans are banked</Row>
            </div>
          </section>

          <section id="scoring" ref={(el) => { refs.current.scoring = el; }} className="docs-section">
            <h2>Scoring & Beans</h2>
            <p>
              Two separate numbers: <b>score</b> resets every run and only your best is kept; <b>beans</b> are
              a persistent currency that carries over between runs and pays for the clowder.
            </p>
            <div className="docs-table">
              <Row label="Score">Base 100 + a bonus for serving early (patience left) + 20 per combo step</Row>
              <Row label="Beans">8 base + up to 8 for a fast serve + up to 10 for a running combo</Row>
              <Row label="Best score">Saved locally — only beaten runs overwrite it</Row>
              <Row label="Wrong serve">Serving the wrong drink (or an empty tray) resets your combo, no heart lost</Row>
            </div>
          </section>

          <section id="clowder" ref={(el) => { refs.current.clowder = el; }} className="docs-section">
            <h2>The Clowder — Cats & Rarity</h2>
            <p>
              Any breed can wander in as a customer regardless of whether you&apos;ve adopted it. Beans earned
              in a shift adopt new cats permanently into your Collection — rarer coats cost more.
            </p>
            <div className="docs-table">
              {RARITY_ORDER.map((rarity) => {
                const cats = CATS.filter((c) => c.rarity === rarity);
                return (
                  <Row key={rarity} label={rarity}>
                    {cats.map((c) => `${c.name} (${c.cost === 0 ? "starter" : `${c.cost} beans`})`).join(" · ")}
                  </Row>
                );
              })}
            </div>
          </section>

          <section id="token" ref={(el) => { refs.current.token = el; }} className="docs-section">
            <h2>{TICKER} Token</h2>
            <p>
              Beans are the in-game currency — free, earned by playing, spent adopting cats. {TICKER} is a
              separate community token tied to the café; it does not affect gameplay, drop rates, or
              anything in the Collection.
            </p>
            <div className="docs-table">
              <Row label="Contract">{real ? <code className="mono">{CA}</code> : "SOON — not launched yet"}</Row>
              <Row label="Launch style">Fair launch on Pump Fun, no presale, no team allocation</Row>
              <Row label="Buy links">
                <a href={real ? PUMP_URL + CA : PUMP_URL} target="_blank" rel="noreferrer">Pump Fun</a>
                {" · "}
                <a href={real ? DEX_URL + CA : DEX_URL} target="_blank" rel="noreferrer">DexScreener</a>
              </Row>
              <Row label="Beans vs token">Beans never convert to {TICKER} and {TICKER} never buys beans — kept separate on purpose</Row>
            </div>
          </section>

          <section id="local" ref={(el) => { refs.current.local = el; }} className="docs-section">
            <h2>Local & Free</h2>
            <p>
              There is no backend, no account, and no wallet gate on the game itself. Your progress lives
              only in this browser.
            </p>
            <div className="docs-table">
              <Row label="Storage">Best score, beans, and adopted cats saved to this browser&apos;s localStorage</Row>
              <Row label="Device-local">Clearing site data or switching browsers/devices resets progress</Row>
              <Row label="No leaderboard">Scores aren&apos;t submitted anywhere — &quot;best&quot; is a personal record only</Row>
            </div>
            <p className="docs-note">
              Cross-device syncing, shared leaderboards, and any real-money mechanic are not built —
              see Roadmap below.
            </p>
          </section>

          <section id="roadmap" ref={(el) => { refs.current.roadmap = el; }} className="docs-section">
            <h2>Roadmap</h2>
            <div className="docs-table">
              <Row label="Live">Café loop, 8 cats across 4 rarities, 5 drinks, local best score & beans</Row>
              <Row label="Planned">More drinks & cat breeds, seasonal menu events</Row>
              <Row label="Token">{TICKER} fair launch — CA appears here and on the buy links the moment it&apos;s live</Row>
            </div>
          </section>

          <section id="faq" ref={(el) => { refs.current.faq = el; }} className="docs-section">
            <h2>FAQ</h2>
            <dl className="docs-faq">
              <dt>Do I need a wallet to play?</dt>
              <dd>No. The café is fully playable free, with no connection of any kind.</dd>
              <dt>What happens to my beans if I close the tab?</dt>
              <dd>They&apos;re saved to this browser&apos;s localStorage and are there next time you open the site.</dd>
              <dt>Is {TICKER} live yet?</dt>
              <dd>Not yet. The contract address on this page reads &quot;SOON&quot; until it launches.</dd>
              <dt>Can I lose beans?</dt>
              <dd>Only by spending them to adopt a cat — there&apos;s no penalty or decay otherwise.</dd>
            </dl>
          </section>
        </main>
      </div>
    </>
  );
}
