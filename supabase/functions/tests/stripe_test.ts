// Tests du code de paiement Stripe (supabase/functions/_shared/stripe.ts).
// Lancement (depuis supabase/functions) :
//   deno test --allow-env --allow-net=127.0.0.1,esm.sh,jsr.io tests/
// Aucune donnée réelle, aucun appel à Stripe : API Stripe et PostgREST simulés.

import { assert, assertEquals, assertRejects } from "jsr:@std/assert@1";
import {
  CHECKOUT_PAYMENT_METHOD_TYPES,
  eurToCents,
  mapSessionStatus,
  StripeError,
  syncPaiementFromStripe,
  toForm,
  verifyStripeSignature,
} from "../_shared/stripe.ts";

// ─── Signature webhook ───────────────────────────────────────
// Vecteur calculé indépendamment avec Node :
//   crypto.createHmac("sha256", secret).update(`${t}.${body}`).digest("hex")
const VEC = {
  secret: "whsec_test_vecteur_fictif",
  body: '{"id":"evt_test","type":"checkout.session.completed","data":{"object":{"id":"cs_test_abc"}}}',
  t: 1760000000,
  sig: "f38ddf33c56840e98ffea576a36e84f2263cb8d212c6a5dfab818df00c0972b6",
};

Deno.test("stripe signature : vecteur de référence accepté (avec v0 ignoré)", async () => {
  assert(await verifyStripeSignature(VEC.body, `t=${VEC.t},v1=${VEC.sig},v0=abc`, VEC.secret, VEC.t + 5));
});

Deno.test("stripe signature : plusieurs v1 (rotation de secret), une valide", async () => {
  assert(await verifyStripeSignature(VEC.body, `t=${VEC.t},v1=deadbeef,v1=${VEC.sig}`, VEC.secret, VEC.t));
});

Deno.test("stripe signature : refusée si corps modifié", async () => {
  const tampered = VEC.body.replace("cs_test_abc", "cs_test_xyz");
  assertEquals(await verifyStripeSignature(tampered, `t=${VEC.t},v1=${VEC.sig}`, VEC.secret, VEC.t), false);
});

Deno.test("stripe signature : refusée si mauvais secret", async () => {
  assertEquals(await verifyStripeSignature(VEC.body, `t=${VEC.t},v1=${VEC.sig}`, "whsec_autre", VEC.t), false);
});

Deno.test("stripe signature : refusée hors tolérance (rejeu)", async () => {
  assertEquals(await verifyStripeSignature(VEC.body, `t=${VEC.t},v1=${VEC.sig}`, VEC.secret, VEC.t + 301), false);
});

Deno.test("stripe signature : refusée si seule une signature v0 est fournie", async () => {
  assertEquals(await verifyStripeSignature(VEC.body, `t=${VEC.t},v0=${VEC.sig}`, VEC.secret, VEC.t), false);
});

Deno.test("stripe signature : refusée si en-tête absent, vide ou mal formé", async () => {
  for (const h of [null, "", `v1=${VEC.sig}`, `t=${VEC.t}`, `t=12a,v1=${VEC.sig}`, "n'importe quoi"]) {
    assertEquals(await verifyStripeSignature(VEC.body, h, VEC.secret, VEC.t), false, String(h));
  }
});

Deno.test("stripe signature : refusée si secret vide", async () => {
  assertEquals(await verifyStripeSignature(VEC.body, `t=${VEC.t},v1=${VEC.sig}`, "", VEC.t), false);
});

// ─── Encodage et conversions ────────────────────────────────
Deno.test("toForm : encodage imbriqué au format Stripe", () => {
  const form = toForm({
    mode: "payment",
    line_items: [{ quantity: 1, price_data: { currency: "eur", unit_amount: 15000, product_data: { name: "Séjour & co" } } }],
    metadata: { paiement_id: "abc" },
    absent: undefined,
  });
  assertEquals(form, [
    "mode=payment",
    `${encodeURIComponent("line_items[0][quantity]")}=1`,
    `${encodeURIComponent("line_items[0][price_data][currency]")}=eur`,
    `${encodeURIComponent("line_items[0][price_data][unit_amount]")}=15000`,
    `${encodeURIComponent("line_items[0][price_data][product_data][name]")}=${encodeURIComponent("Séjour & co")}`,
    `${encodeURIComponent("metadata[paiement_id]")}=abc`,
  ]);
});

Deno.test("checkout : carte uniquement, Link exclu (ADR 0004)", () => {
  assertEquals([...CHECKOUT_PAYMENT_METHOD_TYPES], ["card"]);
  assertEquals(toForm({ payment_method_types: [...CHECKOUT_PAYMENT_METHOD_TYPES] }), [
    `${encodeURIComponent("payment_method_types[0]")}=card`,
  ]);
});

Deno.test("eurToCents : arrondi au centime", () => {
  assertEquals(eurToCents(100), 10000);
  assertEquals(eurToCents(214.29), 21429);
  assertEquals(eurToCents(0.1 + 0.2), 30);
});

Deno.test("mapSessionStatus : statuts de session → statuts internes", () => {
  assertEquals(mapSessionStatus({ status: "complete", payment_status: "paid" }), "Payé");
  assertEquals(mapSessionStatus({ status: "open", payment_status: "unpaid" }), "En attente");
  assertEquals(mapSessionStatus({ status: "complete", payment_status: "unpaid" }), "En attente");
  assertEquals(mapSessionStatus({ status: "complete", payment_status: "unpaid" }, true), "Annule");
  assertEquals(mapSessionStatus({ status: "expired", payment_status: "unpaid" }), "Annule");
});

// ─── Synchronisation (Stripe + PostgREST simulés) ───────────

interface MockState {
  session: Record<string, unknown>;
  row: Record<string, unknown>;
  patches: number;
  authHeader?: string | null;
}

const SESSION_ID = "cs_test_a1B2c3";
const PAIEMENT_ID = "6f1c9a52-0000-4000-8000-000000000002";

function startMock(state: MockState) {
  const server = Deno.serve({ port: 0, hostname: "127.0.0.1", onListen() {} }, async (req) => {
    const url = new URL(req.url);
    if (url.pathname === `/v1/checkout/sessions/${SESSION_ID}` && req.method === "GET") {
      state.authHeader = req.headers.get("authorization");
      return Response.json(state.session);
    }
    // PostgREST : objet si Accept vnd.pgrst.object (.single()), sinon tableau (.maybeSingle()).
    const asObject = (req.headers.get("accept") ?? "").includes("vnd.pgrst.object");
    const reply = (rows: Record<string, unknown>[]) => Response.json(asObject ? rows[0] : rows);
    if (url.pathname === "/rest/v1/paiements" && req.method === "PATCH") {
      const patch = await req.json();
      if (url.searchParams.get("status") === "neq.Payé" && state.row.status === "Payé") return reply([]);
      state.patches++;
      state.row = { ...state.row, ...patch };
      return reply([state.row]);
    }
    if (url.pathname === "/rest/v1/paiements" && req.method === "GET") return reply([state.row]);
    return new Response("not found", { status: 404 });
  });
  const base = `http://127.0.0.1:${server.addr.port}`;
  Deno.env.set("STRIPE_API_BASE", base);
  Deno.env.set("STRIPE_SECRET_KEY", "sk_test_cle_fictive_pour_tests");
  Deno.env.set("SUPABASE_URL", base);
  Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-not-a-secret");
  return server;
}

const basePaiement = (over: Record<string, unknown> = {}) => ({
  id: PAIEMENT_ID,
  status: "En attente",
  provider: "stripe",
  provider_transaction_id: SESSION_ID,
  provider_status: "open/unpaid",
  charged_amount: 15000,
  ...over,
});

const session = (over: Record<string, unknown> = {}) => ({
  id: SESSION_ID,
  status: "complete",
  payment_status: "paid",
  amount_total: 15000,
  currency: "eur",
  metadata: { paiement_id: PAIEMENT_ID },
  ...over,
});

function syncTest(name: string, fn: () => Promise<void>) {
  Deno.test({ name, sanitizeResources: false, sanitizeOps: false, fn });
}

syncTest("stripe sync : payé → Payé, une seule notification même si rejoué", async () => {
  const state: MockState = { session: session(), row: basePaiement(), patches: 0 };
  const server = startMock(state);
  try {
    const first = await syncPaiementFromStripe(basePaiement());
    assertEquals(first.becamePaid, true);
    assertEquals(state.row.status, "Payé");
    assert(state.row.paid_at, "paid_at renseigné");
    assertEquals(state.authHeader, "Bearer sk_test_cle_fictive_pour_tests");
    const second = await syncPaiementFromStripe(basePaiement());
    assertEquals(second.becamePaid, false, "pas de deuxième notification");
    assertEquals(state.patches, 1);
  } finally {
    await server.shutdown();
  }
});

syncTest("stripe sync : montant différent → refus, aucune écriture", async () => {
  const state: MockState = { session: session({ amount_total: 100 }), row: basePaiement(), patches: 0 };
  const server = startMock(state);
  try {
    await assertRejects(() => syncPaiementFromStripe(basePaiement()), StripeError, "Montant");
    assertEquals(state.patches, 0);
  } finally {
    await server.shutdown();
  }
});

syncTest("stripe sync : devise différente → refus, aucune écriture", async () => {
  const state: MockState = { session: session({ currency: "usd" }), row: basePaiement(), patches: 0 };
  const server = startMock(state);
  try {
    await assertRejects(() => syncPaiementFromStripe(basePaiement()), StripeError);
    assertEquals(state.patches, 0);
  } finally {
    await server.shutdown();
  }
});

syncTest("stripe sync : session d'un autre paiement → refus", async () => {
  const state: MockState = { session: session({ metadata: { paiement_id: "autre" } }), row: basePaiement(), patches: 0 };
  const server = startMock(state);
  try {
    await assertRejects(() => syncPaiementFromStripe(basePaiement()), StripeError, "autre paiement");
    assertEquals(state.patches, 0);
  } finally {
    await server.shutdown();
  }
});

syncTest("stripe sync : expirée → Annule", async () => {
  const state: MockState = { session: session({ status: "expired", payment_status: "unpaid" }), row: basePaiement(), patches: 0 };
  const server = startMock(state);
  try {
    const r = await syncPaiementFromStripe(basePaiement());
    assertEquals(r.becamePaid, false);
    assertEquals(state.row.status, "Annule");
  } finally {
    await server.shutdown();
  }
});

syncTest("stripe sync : paiement différé refusé (événement signé) → Annule", async () => {
  const state: MockState = { session: session({ payment_status: "unpaid" }), row: basePaiement(), patches: 0 };
  const server = startMock(state);
  try {
    await syncPaiementFromStripe(basePaiement(), { asyncPaymentFailed: true });
    assertEquals(state.row.status, "Annule");
  } finally {
    await server.shutdown();
  }
});

syncTest("stripe sync : un paiement encaissé ne redescend jamais", async () => {
  const state: MockState = {
    session: session({ status: "expired", payment_status: "unpaid" }),
    row: basePaiement({ status: "Payé", provider_status: "complete/paid" }),
    patches: 0,
  };
  const server = startMock(state);
  try {
    const r = await syncPaiementFromStripe(basePaiement({ status: "Payé", provider_status: "complete/paid" }));
    assertEquals(r.becamePaid, false);
    assertEquals(state.patches, 0);
    assertEquals(state.row.status, "Payé");
  } finally {
    await server.shutdown();
  }
});

syncTest("stripe sync : identifiant de session invalide refusé avant tout appel", async () => {
  const state: MockState = { session: session(), row: basePaiement(), patches: 0 };
  const server = startMock(state);
  try {
    await assertRejects(
      () => syncPaiementFromStripe(basePaiement({ provider_transaction_id: "../../v1/customers" })),
      StripeError,
      "invalide",
    );
    assertEquals(state.authHeader, undefined, "aucun appel à l'API simulée");
  } finally {
    await server.shutdown();
  }
});
