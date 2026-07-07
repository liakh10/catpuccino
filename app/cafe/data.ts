import type { CatSpec } from "../art/cats";

// ── menu (coffee-leaning; Catpuccino is the signature) ──
export interface DrinkDef { id: string; name: string; }
export const DRINKS: DrinkDef[] = [
  { id: "catpuccino", name: "Catpuccino" },
  { id: "espresso", name: "Espresso" },
  { id: "latte", name: "Caffè Latte" },
  { id: "matcha", name: "Matcha" },
  { id: "cocoa", name: "Hot Cocoa" },
];

// ── the clowder (breeds). cost = beans to adopt into the Collection. ──
export const CATS: CatSpec[] = [
  { id: "marmalade", name: "Marmalade", rarity: "common", cost: 0, base: "#e8a15a", shade: "#c9763a", belly: "#f6e3c8", ear: "#e08a86", eye: "#6b8f3a", accent: "#d98aa0", accessory: "none", patch: "tabby" },
  { id: "biscuit", name: "Biscuit", rarity: "common", cost: 0, base: "#f0dcb8", shade: "#d8bd8e", belly: "#fbf3e2", ear: "#e2a0a0", eye: "#8a6a3a", accent: "#d98aa0", accessory: "bow" },
  { id: "smoke", name: "Smoke", rarity: "common", cost: 80, base: "#b8b0a4", shade: "#918a7c", belly: "#f2ede2", ear: "#dca0a0", eye: "#7a8fa0", accent: "#8a8f9a", accessory: "none", patch: "spots" },
  { id: "espresso", name: "Espresso", rarity: "rare", cost: 160, base: "#6b4a34", shade: "#4a3220", belly: "#f0e6d4", ear: "#d98a86", eye: "#d0a24a", accent: "#3a2a1a", accessory: "none", patch: "tuxedo" },
  { id: "matcha", name: "Matcha", rarity: "rare", cost: 220, base: "#9aa88a", shade: "#74856a", belly: "#eef0e2", ear: "#d99a9a", eye: "#6a8f4a", accent: "#6f9a5a", accessory: "scarf" },
  { id: "mocha", name: "Mocha", rarity: "epic", cost: 380, base: "#d8c4a0", shade: "#7a5638", belly: "#f4ead6", ear: "#d98a86", eye: "#4aa0c0", accent: "#3a2a1a", accessory: "monocle" },
  { id: "caramella", name: "Caramella", rarity: "epic", cost: 460, base: "#f0d0a0", shade: "#c98a5a", belly: "#fbf3e2", ear: "#e08a86", eye: "#8a6a3a", accent: "#c26a4e", accessory: "cap", patch: "spots" },
  { id: "barista", name: "The Barista", rarity: "legendary", cost: 700, base: "#4a4048", shade: "#2a222c", belly: "#d8cdb8", ear: "#d98a86", eye: "#e5b45a", accent: "#6f9a5a", accessory: "apron" },
];

export function catById(id: string): CatSpec { return CATS.find((c) => c.id === id) ?? CATS[0]; }
export function drinkById(id: string): DrinkDef { return DRINKS.find((d) => d.id === id) ?? DRINKS[0]; }

const RARITY_WEIGHT: Record<CatSpec["rarity"], number> = { common: 6, rare: 3, epic: 2, legendary: 1 };

// A visiting customer: any breed can wander in (weighted so commons show more).
export function randomCustomer(): CatSpec {
  const pool: CatSpec[] = [];
  for (const c of CATS) for (let i = 0; i < RARITY_WEIGHT[c.rarity]; i++) pool.push(c);
  return pool[(Math.random() * pool.length) | 0];
}

export function randomDrinkId(): string { return DRINKS[(Math.random() * DRINKS.length) | 0].id; }
