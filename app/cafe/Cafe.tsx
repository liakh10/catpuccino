"use client";

import { useEffect, useRef, useState } from "react";
import type { CatSpec } from "../art/cats";
import { Cat } from "../art/cats";
import { CafeScene } from "../art/scene";
import { Drink, Bean, Heart, Star } from "../art/icons";
import { DRINKS, randomCustomer, randomDrinkId, drinkById } from "./data";
import { getBest, saveBest, getBeans, setBeans } from "../store";
import { getMusic } from "../music";
import { getSfx } from "../sfx";

const SEATS = 3;
const TICK = 0.1; // seconds

type CState = "wait" | "served" | "leave";
interface Customer { key: number; cat: CatSpec; order: string; patience: number; max: number; state: CState; t: number; }
interface Sim {
  phase: "idle" | "playing" | "over";
  hearts: number; score: number; beans: number; combo: number; elapsed: number;
  prepared: string | null; seats: (Customer | null)[]; spawnCd: number; nextKey: number; shake: number;
}

function idleSim(): Sim {
  return { phase: "idle", hearts: 3, score: 0, beans: 0, combo: 0, elapsed: 0, prepared: null, seats: Array(SEATS).fill(null), spawnCd: 0, nextKey: 1, shake: -1 };
}
function patienceMax(elapsed: number) { return Math.max(4.5, 10 - elapsed / 26); }
function spawnInterval(score: number) { return Math.max(0.7, 2.4 - score / 3500); }

function makeCustomer(sim: Sim): Customer {
  const max = patienceMax(sim.elapsed);
  return { key: sim.nextKey++, cat: randomCustomer(), order: randomDrinkId(), patience: max, max, state: "wait", t: 0 };
}

function snapshot(s: Sim): Sim { return { ...s, seats: s.seats.map((c) => (c ? { ...c } : null)) }; }

export default function Cafe() {
  const simRef = useRef<Sim>(idleSim());
  const [sim, setSim] = useState<Sim>(idleSim());
  const [best, setBestState] = useState(() => (typeof window !== "undefined" ? getBest() : 0));

  const sync = () => setSim(snapshot(simRef.current));

  // game loop — self-contained so its deps stay empty
  useEffect(() => {
    const id = window.setInterval(() => {
      const s = simRef.current;
      if (s.phase !== "playing") return;
      s.elapsed += TICK;
      let missed = false;
      for (let i = 0; i < s.seats.length; i++) {
        const c = s.seats[i]; if (!c) continue;
        if (c.state === "wait") {
          c.patience -= TICK;
          if (c.patience <= 0) { c.state = "leave"; c.t = 0; s.hearts -= 1; s.combo = 0; missed = true; }
        } else { c.t += TICK; if (c.t > 0.6) s.seats[i] = null; }
      }
      // spawn
      s.spawnCd -= TICK;
      if (s.spawnCd <= 0) {
        const empty = s.seats.findIndex((x) => x === null);
        if (empty >= 0) { s.seats[empty] = makeCustomer(s); s.spawnCd = spawnInterval(s.score); getSfx().bell(); }
      }
      if (s.shake >= 0) s.shake = -1;
      if (missed) getSfx().sad();
      if (s.hearts <= 0) {
        s.phase = "over";
        if (saveBest(s.score)) setBestState(s.score);
        setBeans(getBeans() + s.beans);
        window.dispatchEvent(new Event("catpu:update"));
        getSfx().sad();
      }
      setSim(snapshot(s));
    }, TICK * 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") (window as unknown as { __cafe?: Sim }).__cafe = simRef.current;
  }, []);

  const start = () => {
    const s = simRef.current;
    Object.assign(s, idleSim());   // reset fields on the same object (keeps window.__cafe valid)
    s.phase = "playing";
    s.seats[0] = makeCustomer(s);
    s.spawnCd = 0.9;
    try { getMusic().play(); } catch { /* */ }
    getSfx().bell();
    sync();
  };

  const prepare = (drinkId: string) => {
    const s = simRef.current; if (s.phase !== "playing") return;
    s.prepared = drinkId; getSfx().brew(); sync();
  };

  const serve = (i: number) => {
    const s = simRef.current; if (s.phase !== "playing") return;
    const c = s.seats[i]; if (!c || c.state !== "wait") return;
    if (!s.prepared) { s.shake = i; getSfx().tap(); sync(); return; }
    if (s.prepared === c.order) {
      const ratio = c.patience / c.max;
      s.score += 100 + Math.round(ratio * 120) + s.combo * 20;
      s.beans += 8 + Math.round(ratio * 8) + Math.min(10, s.combo);
      s.combo += 1; s.prepared = null; c.state = "served"; c.t = 0;
      getSfx().serve(); getSfx().purr(); getSfx().coin();
    } else { s.shake = i; s.combo = 0; getSfx().sad(); }
    sync();
  };

  const hearts = Array.from({ length: 3 }, (_, i) => i < sim.hearts);

  return (
    <div className="cafe">
      {/* HUD */}
      <div className="cafe-hud">
        <div className="hud-hearts">{hearts.map((f, i) => <Heart key={i} filled={f} size={24} />)}</div>
        <div className="hud-mid">
          <span className="hud-stat"><Star size={16} /> {sim.score.toLocaleString()}</span>
          <span className="hud-stat"><Bean size={16} /> {sim.beans}</span>
          {sim.combo > 1 && <span className="hud-combo">×{sim.combo} combo</span>}
        </div>
        <span className="hud-best">best {best.toLocaleString()}</span>
      </div>

      {/* stage */}
      <div className="cafe-stage">
        <CafeScene className="scene-bg" />

        <div className="seats">
          {sim.seats.map((c, i) => (
            <div className="seat" key={i}>
              {c && (
                <div className={`seat-in ${c.state} ${sim.shake === i ? "shake" : ""}`}>
                  {c.state === "wait" && (
                    <div className="bubble" onClick={() => serve(i)} role="button" aria-label={`Serve ${drinkById(c.order).name}`}>
                      <Drink id={c.order} size={44} />
                      <span className="patience"><span className="patience-fill" style={{ width: `${Math.max(0, (c.patience / c.max) * 100)}%`, background: c.patience / c.max < 0.3 ? "#e07a72" : "#7c9a6a" }} /></span>
                    </div>
                  )}
                  {c.state === "served" && <div className="pop">purr~</div>}
                  {c.state === "leave" && <div className="pop sadpop">meow…</div>}
                  <div className="seat-cat" onClick={() => serve(i)}><Cat spec={c.cat} /></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* overlays */}
        {sim.phase === "idle" && (
          <div className="cafe-overlay">
            <h3>Ready to open?</h3>
            <p>Cats will line up with orders. Brew the right drink, then tap the cat to serve.</p>
            <button className="btn btn-coffee btn-lg" onClick={start}>Open the café</button>
          </div>
        )}
        {sim.phase === "over" && (
          <div className="cafe-overlay">
            <h3>Café closed</h3>
            <div className="over-stats">
              <span><Star size={18} /> {sim.score.toLocaleString()}</span>
              <span><Bean size={18} /> +{sim.beans} beans</span>
            </div>
            <p className="over-best">{sim.score >= best && sim.score > 0 ? "new best shift!" : `best ${best.toLocaleString()}`}</p>
            <button className="btn btn-coffee btn-lg" onClick={start}>Open again</button>
          </div>
        )}
      </div>

      {/* tray + menu */}
      <div className="tray">
        <span className="tray-label">tray</span>
        <div className={`tray-cup ${sim.prepared ? "full" : ""}`}>
          {sim.prepared ? <Drink id={sim.prepared} size={52} /> : <span className="tray-empty">empty</span>}
        </div>
      </div>
      <div className="menu">
        {DRINKS.map((d) => (
          <button key={d.id} className={`menu-btn ${sim.prepared === d.id ? "active" : ""}`} onClick={() => prepare(d.id)} disabled={sim.phase !== "playing"}>
            <Drink id={d.id} size={46} />
            <span>{d.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
