import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../../shared/lib/api";
import AgencyShell from "../components/AgencyShell";
import Brand from "../../../shared/components/Brand";

/**
 * PortalsPage — M2.6a Publishing Center (D-052).
 * Dashboard 2-tab: Attivi (with connection status) · Disponibili (from catalog).
 * Activation: 1-click for portals without credentials, modal form otherwise.
 */
export default function PortalsPage() {
  const { t } = useTranslation();
  const [catalog, setCatalog] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");
  const [modal, setModal] = useState(null); // {portal, creds:{}}
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [cat, conn] = await Promise.all([
        api.get("/app/publishing/catalog"),
        api.get("/app/publishing/connections"),
      ]);
      setCatalog(cat.data.items || []);
      setConnections(conn.data.items || []);
    } catch (e) {
      setError(e?.response?.data?.detail || "load_error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const activePortalSlugs = new Set(connections.map((c) => c.portal_slug));
  const available = catalog.filter((p) => !activePortalSlugs.has(p.slug));
  const portalMap = Object.fromEntries(catalog.map((p) => [p.slug, p]));

  const openActivate = (portal) => {
    const creds = {};
    (portal.credential_fields || []).forEach((f) => { creds[f.name] = ""; });
    setModal({ portal, creds });
    setError(null);
  };

  const submitActivate = async () => {
    if (!modal) return;
    setBusy(true); setError(null);
    try {
      await api.post("/app/publishing/connections", {
        portal_slug: modal.portal.slug,
        credentials: modal.creds,
      });
      setModal(null);
      await load();
    } catch (e) {
      setError(e?.response?.data?.detail || "activate_error");
    } finally { setBusy(false); }
  };

  const deactivate = async (id) => {
    if (!confirm(t("portals.confirm_deactivate") || "Disattivare questo portale?")) return;
    try {
      await api.delete(`/app/publishing/connections/${id}`);
      await load();
    } catch (e) { setError(e?.response?.data?.detail || "delete_error"); }
  };

  return (
    <AgencyShell current="publishing">
      <section data-testid="portals-page" className="space-y-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-2">
            <Brand>ImmoWeb · Publishing Center</Brand>
          </p>
          <h1 className="text-3xl md:text-4xl tracking-tight" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            {t("portals.title") || "Portali Immobiliari"}
          </h1>
          <p className="text-sm text-stone-600 mt-2 max-w-2xl">
            {t("portals.subtitle") ||
              "Attiva i portali su cui vuoi pubblicare gli annunci. OMNIA genera un feed XML aggiornato in tempo reale — ogni portale scarica autonomamente ogni notte."}
          </p>
          <div className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded px-3 py-2 max-w-2xl">
            ⚠️ <strong>Compliance HARD attiva</strong>: solo gli annunci con prezzo, classe energetica e almeno 3 foto vengono pubblicati. Gli altri sono esclusi dal feed automaticamente.
          </div>
        </div>

        {/* Metrics header */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl">
          <MetricBox label={t("portals.total_active") || "Portali attivi"} value={connections.filter((c) => c.status === "active").length} testid="metric-active" />
          <MetricBox label={t("portals.available") || "Disponibili"} value={available.length} testid="metric-available" />
          <MetricBox label={t("portals.catalog_total") || "Catalogo totale"} value={catalog.length} testid="metric-catalog" />
        </div>

        {error && <div data-testid="portals-error" className="text-sm text-red-700 bg-red-50 border border-red-300 rounded p-3">{error}</div>}

        {/* Tabs */}
        <div className="flex gap-6 border-b border-stone-200">
          {["active", "available"].map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              data-testid={`portals-tab-${k}`}
              className={`pb-3 text-xs uppercase tracking-widest border-b-2 -mb-px transition ${
                tab === k ? "border-stone-900 text-stone-900" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              {k === "active" ? `${t("portals.active") || "Attivi"} (${connections.length})` : `${t("portals.disponibili") || "Disponibili"} (${available.length})`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-[10px] uppercase tracking-widest text-stone-500">
              <tr>
                <th className="text-left px-4 py-3">Portale</th>
                <th className="text-left px-4 py-3">Categoria</th>
                <th className="text-left px-4 py-3">Modalità</th>
                <th className="text-left px-4 py-3">Traffico</th>
                <th className="text-left px-4 py-3">Stato</th>
                <th className="text-right px-4 py-3">Azioni</th>
              </tr>
            </thead>
            <tbody data-testid="portals-table-body">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-6 text-stone-500 text-center">…</td></tr>
              ) : tab === "active" ? (
                connections.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-stone-500 text-center" data-testid="portals-empty-active">
                    Nessun portale attivo. Vai alla tab "Disponibili" per attivarne uno.
                  </td></tr>
                ) : connections.map((c) => {
                  const p = portalMap[c.portal_slug] || {};
                  return (
                    <tr key={c.id} data-testid={`portal-conn-${c.portal_slug}`} className="border-t border-stone-200 hover:bg-stone-50">
                      <td className="px-4 py-3 font-medium">{p.name || c.portal_slug}</td>
                      <td className="px-4 py-3 text-stone-600 text-xs">{p.category || "—"}</td>
                      <td className="px-4 py-3 text-stone-600 text-xs">{p.integration_type || "—"}</td>
                      <td className="px-4 py-3 text-stone-600">{"★".repeat(p.traffic_score || 0)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => deactivate(c.id)} data-testid={`portal-deactivate-${c.portal_slug}`} className="text-xs uppercase tracking-widest text-red-600 hover:text-red-800">disattiva</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                available.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-stone-500 text-center">Tutti i portali del catalogo sono già attivi.</td></tr>
                ) : available.map((p) => (
                  <tr key={p.slug} data-testid={`portal-catalog-${p.slug}`} className="border-t border-stone-200 hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-stone-600 text-xs">{p.category}</td>
                    <td className="px-4 py-3 text-stone-600 text-xs">{p.integration_type}</td>
                    <td className="px-4 py-3 text-stone-600">{"★".repeat(p.traffic_score || 0)}</td>
                    <td className="px-4 py-3 text-stone-500 text-xs">{p.notes?.substring(0, 40) || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openActivate(p)} data-testid={`portal-activate-${p.slug}`} className="text-xs uppercase tracking-widest bg-emerald-700 text-white px-3 py-1.5 rounded hover:bg-emerald-800">Attiva</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <details className="text-xs text-stone-600 max-w-2xl">
          <summary className="cursor-pointer">Come funziona</summary>
          <div className="mt-2 space-y-1 bg-stone-50 border border-stone-200 rounded p-3">
            <p>1. Attivi un portale qui e (se richiesto) inserisci le credenziali del tuo account presso quel portale</p>
            <p>2. OMNIA genera automaticamente un feed XML alla tua URL agenzia</p>
            <p>3. Il portale scarica il feed ogni notte e sincronizza gli annunci sul suo sito</p>
            <p>4. Solo gli annunci "compliance HARD" (prezzo + classe energetica + 3+ foto) finiscono nel feed</p>
          </div>
        </details>

        {/* Activation modal */}
        {modal && (
          <div data-testid="portal-activate-modal" className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setModal(null)}>
            <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg mb-1" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Attiva {modal.portal.name}</h3>
              <p className="text-xs text-stone-500 mb-4">{modal.portal.notes}</p>
              {(modal.portal.credential_fields || []).length === 0 ? (
                <p className="text-sm text-stone-600 mb-4">Nessuna credenziale richiesta — attivazione immediata.</p>
              ) : (
                <div className="space-y-3 mb-4">
                  {modal.portal.credential_fields.map((f) => (
                    <div key={f.name}>
                      <label className="text-xs text-stone-500 block mb-1">{f.label}</label>
                      <input
                        type={f.type === "email" ? "email" : "text"}
                        data-testid={`portal-cred-${f.name}`}
                        value={modal.creds[f.name] || ""}
                        onChange={(e) => setModal({ ...modal, creds: { ...modal.creds, [f.name]: e.target.value } })}
                        className="w-full border border-stone-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button onClick={() => setModal(null)} className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-800 px-3 py-2">Annulla</button>
                <button onClick={submitActivate} disabled={busy} data-testid="portal-modal-confirm" className="text-xs uppercase tracking-widest bg-emerald-700 text-white px-4 py-2 rounded hover:bg-emerald-800 disabled:opacity-40">
                  {busy ? "…" : "Attiva portale"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </AgencyShell>
  );
}

function MetricBox({ label, value, testid }) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg px-4 py-3" data-testid={testid}>
      <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">{label}</p>
      <p className="text-2xl font-medium" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    active: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-800",
    disabled: "bg-stone-200 text-stone-600",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase tracking-widest ${styles[status] || styles.disabled}`}>
      {status}
    </span>
  );
}
