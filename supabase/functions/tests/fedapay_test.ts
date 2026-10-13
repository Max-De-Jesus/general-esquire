// Tests du code de paiement FedaPay (supabase/functions/_shared).
// Lancement (depuis supabase/functions) :
//   deno test --allow-env --allow-net=127.0.0.1 tests/
// Aucune donnée réelle, aucun appel réseau sortant : FedaPay et PostgREST
// sont simulés par un serveur local.

import { assert, assertEquals, assertRejects, assertThrows } from "jsr:@std/assert@1";
import { calculerMontant, ChoixInvalide, cocooningInstallmentMonths } from "../_shared/catalogue.ts";
import { eurToXof, FedaPayError, mapStatus, syncPaiementFromFedaPay, verifyWebhookSignature } from "../_shared/fedapay.ts";

// ─── Signature webhook ───────────────────────────────────────
// Vecteur de référence calculé indépendamment avec Node :
//   crypto.createHmac("sha256", secret).update(`${t}.${body}`).digest("hex")
// (algorithme du SDK officiel fedapay-node, src/Webhook.ts)
const VEC = {
  secret: "wh_sandbox_test_vector",
  body: '{"name":"transaction.approved","entity":{"id":4242,"status":"approved"}}',
  t: 1760000000,
  sig: "5cf1b31a0171e4c7aa2b0d5d30dd9e8b47efa6a3f786e7467899421f783be3e2",
};

Deno.test("signature : vecteur de référence accepté", async () => {
  assert(await verifyWebhookSignature(VEC.body, `t=${VEC.t},s=${VEC.sig}`, VEC.secret, VEC.t + 10));
});

Deno.test("signature : plusieurs signatures, une valide", async () => {
  assert(await verifyWebhookSignature(VEC.body, `t=${VEC.t},s=deadbeef,s=${VEC.sig}`, VEC.secret, VEC.t));
});

Deno.test("signature : refusée si corps modifié", async () => {
  const tampered = VEC.body.replace("4242", "4243");
  assertEquals(await verifyWebhookSignature(tampered, `t=${VEC.t},s=${VEC.sig}`, VEC.secret, VEC.t), false);
});

Deno.test("signature : refusée si mauvais secret", async () => {
  assertEquals(await verifyWebhookSignature(VEC.body, `t=${VEC.t},s=${VEC.sig}`, "wh_autre", VEC.t), false);
});

Deno.test("signature : refusée hors tolérance (rejeu)", async () => {
  assertEquals(await verifyWebhookSignature(VEC.body, `t=${VEC.t},s=${VEC.sig}`, VEC.secret, VEC.t + 301), false);
});

Deno.test("signature : refusée si en-tête absent, vide ou mal formé", async () => {
  for (const h of [null, "", "s=" + VEC.sig, `t=${VEC.t}`, `t=abc,s=${VEC.sig}`, "n'importe quoi"]) {
    assertEquals(await verifyWebhookSignature(VEC.body, h, VEC.secret, VEC.t), false, String(h));
  }
});

Deno.test("signature : refusée si secret vide", async () => {
  assertEquals(await verifyWebhookSignature(VEC.body, `t=${VEC.t},s=${VEC.sig}`, "", VEC.t), false);
});

// ─── Statuts et conversion ──────────────────────────────────
Deno.test("mapStatus : statuts FedaPay → statuts internes", () => {
  assertEquals(mapStatus("approved"), "Payé");
  assertEquals(mapStatus("transferred"), "Payé");
  assertEquals(mapStatus("approved_partially_refunded"), "Payé");
  assertEquals(mapStatus("refunded"), "Rembourse");
  assertEquals(mapStatus("declined"), "Annule");
  assertEquals(mapStatus("canceled"), "Annule");
  assertEquals(mapStatus("expired"), "Annule");
  assertEquals(mapStatus("pending"), "En attente");
  assertEquals(mapStatus("statut_inconnu"), "En attente");
});

Deno.test("eurToXof : parité fixe 655,957", () => {
  assertEquals(eurToXof(100), 65596);
  assertEquals(eurToXof(1500), 983936);
  assertEquals(eurToXof(10000), 6559570);
});

// ─── Catalogue / montant serveur ────────────────────────────
Deno.test("montant : prix catalogue, le prix envoyé par le client est ignoré", () => {
  const r = calculerMontant({ serviceId: "part-consultation", customPrice: 1 } as never, 0);
  assertEquals(r.amountEur, 100);
});

Deno.test("montant : traduction × pages, bornes", () => {
  assertEquals(calculerMontant({ serviceId: "ent-translation", translationPages: 7 }, 0).amountEur, 70);
  // 0 / vide → 1 page, comme la page (Math.max(1, …)) ; négatif → refus.
  assertEquals(calculerMontant({ serviceId: "ent-translation", translationPages: 0 }, 0).amountEur, 10);
  assertThrows(() => calculerMontant({ serviceId: "ent-translation", translationPages: -3 }, 0), ChoixInvalide);
  assertThrows(() => calculerMontant({ serviceId: "ent-translation", translationPages: 100000 }, 0), ChoixInvalide);
});

Deno.test("montant : urgence (+50 % particulier, +1 500 € autres)", () => {
  assertEquals(calculerMontant({ serviceId: "part-consultation", isUrgent: true }, 0).amountEur, 150);
  assertEquals(calculerMontant({ serviceId: "pro-drafting", isUrgent: true }, 0).amountEur, 2000);
});

Deno.test("montant : montant libre borné", () => {
  assertEquals(calculerMontant({ serviceId: "cj-custom", customPrice: "250" }, 0).amountEur, 250);
  assertThrows(() => calculerMontant({ serviceId: "cj-custom", customPrice: "4" }, 0), ChoixInvalide);
  assertThrows(() => calculerMontant({ serviceId: "cj-custom", customPrice: "-100" }, 0), ChoixInvalide);
  assertThrows(() => calculerMontant({ serviceId: "cj-custom", customPrice: "abc" }, 0), ChoixInvalide);
  assertThrows(() => calculerMontant({ serviceId: "cj-custom", customPrice: "50001" }, 0), ChoixInvalide);
});

Deno.test("montant : prestation inconnue refusée", () => {
  assertThrows(() => calculerMontant({ serviceId: "gratuit" }, 0), ChoixInvalide);
});

Deno.test("montant : cocooning par échéances (même règle que la page)", () => {
  // Octobre (9) → session janvier : hors fenêtre → 6 échéances.
  assertEquals(cocooningInstallmentMonths("janvier", 9), 6);
  assertEquals(calculerMontant({ serviceId: "chrys-stay", cocooningOption: "tranches", cocooningSession: "janvier" }, 9).amountEur, 250);
  // Février (1) → janvier : 9 - 1 = 8 échéances.
  assertEquals(cocooningInstallmentMonths("janvier", 1), 8);
  // Octobre (9) → session juillet : 8 - (9 - 7) = 6.
  assertEquals(cocooningInstallmentMonths("juillet", 9), 6);
  assertEquals(calculerMontant({ serviceId: "chrys-stay", cocooningOption: "unique" }, 9).amountEur, 1500);
});

// ─── Synchronisation avec FedaPay (serveurs simulés) ────────

interface MockState {
  tx: { id: number; status: string; amount: number };
  row: Record<string, unknown>;
  patches: number;
}

function startMock(state: MockState) {
  const server = Deno.serve({ port: 0, hostname: "127.0.0.1", onListen() {} }, async (req) => {
    const url = new URL(req.url);
    // FedaPay : GET /v1/transactions/:id
    if (url.pathname === `/v1/transactions/${state.tx.id}` && req.method === "GET") {
      return Response.json({ "v1/transaction": state.tx });
    }
    // PostgREST : comme le vrai serveur, renvoie un objet si l'en-tête Accept
    // demande application/vnd.pgrst.object+json (.single()), sinon un tableau
    // (.maybeSingle() de postgrest-js 2.x demande un tableau et convertit
    // « 0 ligne » en null côté client).
    const asObject = (req.headers.get("accept") ?? "").includes("vnd.pgrst.object");
    const reply = (rows: Record<string, unknown>[]) => Response.json(asObject ? rows[0] : rows);
    // PATCH /rest/v1/paiements?id=eq.X[&status=neq.Payé]
    if (url.pathname === "/rest/v1/paiements" && req.method === "PATCH") {
      const patch = await req.json();
      const neq = url.searchParams.get("status");
      if (neq === "neq.Payé" && state.row.status === "Payé") return reply([]);
      state.patches++;
      state.row = { ...state.row, ...patch };
      return reply([state.row]);
    }
    if (url.pathname === "/rest/v1/paiements" && req.method === "GET") {
      return reply([state.row]);
    }
    return new Response("not found", { status: 404 });
  });
  const base = `http://127.0.0.1:${server.addr.port}`;
  Deno.env.set("FEDAPAY_API_BASE", base);
  Deno.env.set("FEDAPAY_SECRET_KEY", "sk_sandbox_test_only");
  Deno.env.set("SUPABASE_URL", base);
  Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-not-a-secret");
  return server;
}

const basePaiement = () => ({
  id: "6f1c9a52-0000-4000-8000-000000000001",
  status: "En attente",
  provider: "fedapay",
  provider_transaction_id: "4242",
  provider_status: "pending",
  charged_amount: 65596,
});

Deno.test({
  name: "sync : approved → Payé, une seule notification même si rejoué",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const state: MockState = { tx: { id: 4242, status: "approved", amount: 65596 }, row: basePaiement(), patches: 0 };
    const server = startMock(state);
    try {
      const first = await syncPaiementFromFedaPay(basePaiement());
      assertEquals(first.becamePaid, true);
      assertEquals(state.row.status, "Payé");
      assert(state.row.paid_at, "paid_at renseigné");

      // Webhook rejoué / retour client concurrent sur une copie périmée de la ligne.
      const second = await syncPaiementFromFedaPay(basePaiement());
      assertEquals(second.becamePaid, false, "pas de deuxième notification");
      assertEquals(state.patches, 1);
    } finally {
      await server.shutdown();
    }
  },
});

Deno.test({
  name: "sync : montant FedaPay différent → refus, aucune écriture",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const state: MockState = { tx: { id: 4242, status: "approved", amount: 100 }, row: basePaiement(), patches: 0 };
    const server = startMock(state);
    try {
      await assertRejects(() => syncPaiementFromFedaPay(basePaiement()), FedaPayError, "Montant");
      assertEquals(state.patches, 0);
      assertEquals(state.row.status, "En attente");
    } finally {
      await server.shutdown();
    }
  },
});

Deno.test({
  name: "sync : declined → Annule, pas de notification",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const state: MockState = { tx: { id: 4242, status: "declined", amount: 65596 }, row: basePaiement(), patches: 0 };
    const server = startMock(state);
    try {
      const r = await syncPaiementFromFedaPay(basePaiement());
      assertEquals(r.becamePaid, false);
      assertEquals(state.row.status, "Annule");
    } finally {
      await server.shutdown();
    }
  },
});
