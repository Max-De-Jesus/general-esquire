// Vérifie que les tarifs affichés par la page de paiement
// (src/app/paiement/page.tsx, SERVICE_PRESETS) sont identiques à ceux
// facturés par le serveur (supabase/functions/_shared/catalogue.ts).
// Le montant payé est celui du serveur : une divergence ferait afficher un
// prix et encaisser un autre.
//
// Usage : node scripts/verifier-tarifs.mjs [chemin/vers/catalogue.ts]
// Sortie non nulle si divergence, ou si aucun tarif n'est lu (garde de comptage).

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const pagePath = resolve(here, "../src/app/paiement/page.tsx");
const cataloguePath = resolve(process.argv[2] ?? resolve(here, "../../../supabase/functions/_shared/catalogue.ts"));

if (!existsSync(cataloguePath)) {
  console.error(`ÉCHEC : catalogue serveur introuvable (${cataloguePath}).`);
  process.exit(2);
}

const EXPECTED_COUNT = 22;

function fromPage(src) {
  const block = src.slice(src.indexOf("const SERVICE_PRESETS"), src.indexOf("/* ═", src.indexOf("const SERVICE_PRESETS")));
  const out = {};
  for (const m of block.matchAll(/\{\s*id: "([^"]+)",[\s\S]*?\n\s{4}\}/g)) {
    const body = m[0];
    out[m[1]] = {
      price: Number(/price: (\d+)/.exec(body)?.[1]),
      isCustom: /isCustom: true/.test(body),
      translation: /type: "translation"/.test(body),
    };
  }
  return out;
}

function fromCatalogue(src) {
  const out = {};
  for (const m of src.matchAll(/^\s*"([a-z]+-[a-z]+)": \{([^}]*)\}/gm)) {
    const body = m[2];
    out[m[1]] = {
      price: Number(/price: (\d+)/.exec(body)?.[1]),
      isCustom: /isCustom: true/.test(body),
      translation: /type: "translation"/.test(body),
    };
  }
  return out;
}

const page = fromPage(readFileSync(pagePath, "utf8"));
const cat = fromCatalogue(readFileSync(cataloguePath, "utf8"));
const ids = new Set([...Object.keys(page), ...Object.keys(cat)]);
const errors = [];

if (Object.keys(page).length !== EXPECTED_COUNT) errors.push(`page : attendu=${EXPECTED_COUNT} prestations, obtenu=${Object.keys(page).length}`);
if (Object.keys(cat).length !== EXPECTED_COUNT) errors.push(`catalogue : attendu=${EXPECTED_COUNT} prestations, obtenu=${Object.keys(cat).length}`);

for (const id of ids) {
  const a = page[id];
  const b = cat[id];
  if (!a) errors.push(`${id} : présent côté serveur, absent de la page`);
  else if (!b) errors.push(`${id} : présent sur la page, absent du serveur`);
  else if (a.price !== b.price || a.isCustom !== b.isCustom || a.translation !== b.translation) {
    errors.push(`${id} : page=${JSON.stringify(a)} serveur=${JSON.stringify(b)}`);
  }
}

if (errors.length) {
  console.error("ÉCHEC — tarifs divergents :\n  " + errors.join("\n  "));
  process.exit(1);
}
console.log(`OK — ${ids.size} prestations identiques entre la page et le serveur.`);
