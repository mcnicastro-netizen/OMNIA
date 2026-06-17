import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AgencyShell from "./components/AgencyShell";
import { api } from "../../shared/lib/api";

const FREQUENCIES = ["hourly", "every_4h", "daily", "weekly", "manual"];

function StatusPill({ status }) {
  const map = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    disabled: "bg-stone-100 text-stone-500 border-stone-200",
    error: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${map[status] || map.pending}`}>
      {status}
    </span>
  );
}

export default function PortalsPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // {portal_code} for add modal
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/app/portals");
      setItems(data.items);
      setAvailable(data.available);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const togglePortal = async (sub) => {
    try {
      await api.patch(`/app/portals/${sub.id}`, { enabled: !sub.enabled });
      load();
    } catch (e) { setError(String(e?.response?.data?.detail || e)); }
  };

  const updateField = async (sub, key, value) => {
    try {
      await api.patch(`/app/portals/${sub.id}`, { [key]: value });
      load();
    } catch (e) { setError(String(e?.response?.data?.detail || e)); }
  };

  const removeSub = async (sub) => {
    if (!window.confirm(`Rimuovere il portale ${sub.portal_name}?`)) return;
    await api.delete(`/app/portals/${sub.id}`);
    load();
  };

  const testSub = async (sub) => {
    try {
      const { data } = await api.post(`/app/portals/${sub.id}/test`);
      alert(`Test ${data.portal_code}: esporterebbe ${data.would_export_count} annunci (mode=${data.mode}).`);
    } catch (e) { setError(String(e?.response?.data?.detail || e)); }
  };

  return (
    <AgencyShell current="portals">
      <section data-testid="portals-page" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl tracking-tight" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              {t("portals.title") || "Portali pubblicitari"}
            </h1>
            <p className="text-stone-600 mt-1 max-w-2xl">
              {t("portals.subtitle") || "Pubblica i tuoi annunci automaticamente sui portali immobiliari. Le credenziali sono cifrate end-to-end."}
            </p>
          </div>
        </div>

        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>}

        {loading ? (
          <p className="text-stone-500 text-sm">{t("common.loading")}</p>
        ) : (
          <>
            {/* Subscribed table */}
            {items.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-lg p-8 text-center">
                <p className="text-stone-500">{t("portals.empty") || "Nessun portale ancora attivato. Scegli un portale qui sotto per iniziare."}</p>
              </div>
            ) : (
              <div data-testid="portals-table" className="bg-white border border-stone-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr className="text-left text-xs uppercase tracking-widest text-stone-500">
                      <th className="px-4 py-3 font-medium">Portale</th>
                      <th className="px-4 py-3 font-medium">Stato</th>
                      <th className="px-4 py-3 font-medium">Frequenza</th>
                      <th className="px-4 py-3 font-medium">Credenziali</th>
                      <th className="px-4 py-3 font-medium">Prossimo invio</th>
                      <th className="px-4 py-3 font-medium text-right">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((s) => (
                      <tr key={s.id} data-testid={`portal-row-${s.portal_code}`} className="border-b border-stone-100">
                        <td className="px-4 py-3">
                          <div className="font-medium text-stone-900">{s.portal_name}</div>
                          <div className="text-xs text-stone-500">{s.mode}{s.site ? ` · ${s.site.replace(/^https?:\/\//, "")}` : ""}</div>
                        </td>
                        <td className="px-4 py-3"><StatusPill status={s.status} /></td>
                        <td className="px-4 py-3">
                          <select
                            data-testid={`freq-${s.portal_code}`}
                            value={s.frequency}
                            onChange={(e) => updateField(s, "frequency", e.target.value)}
                            className="px-2 py-1 border border-stone-300 rounded text-xs"
                          >
                            {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-xs text-stone-600">
                          {s.credentials?.email || s.credentials?.username || "—"}
                          {s.has_password && <span className="ml-2 text-emerald-700">🔒 pwd</span>}
                        </td>
                        <td className="px-4 py-3 text-xs text-stone-500">
                          {s.next_transfer_at ? new Date(s.next_transfer_at).toLocaleString("it-IT") : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              data-testid={`toggle-${s.portal_code}`}
                              onClick={() => togglePortal(s)}
                              className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${s.enabled ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-700 border-stone-300 hover:border-stone-700"}`}
                            >
                              {s.enabled ? "ON" : "OFF"}
                            </button>
                            <button
                              data-testid={`test-${s.portal_code}`}
                              onClick={() => testSub(s)}
                              className="text-[10px] uppercase tracking-widest px-2 py-1 rounded border border-stone-300 hover:bg-stone-50"
                            >
                              Test
                            </button>
                            <button
                              data-testid={`del-${s.portal_code}`}
                              onClick={() => removeSub(s)}
                              className="text-[10px] uppercase tracking-widest px-2 py-1 rounded text-red-700 hover:bg-red-50"
                            >
                              ×
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Available catalog */}
            {available.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">
                  {t("portals.available") || "Portali disponibili"} · <span className="text-stone-400">i prossimi 92 in arrivo</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {available.map((p) => (
                    <button
                      key={p.code}
                      type="button"
                      data-testid={`add-portal-${p.code}`}
                      onClick={() => setModal({ portal_code: p.code, portal_name: p.name })}
                      className="text-left bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-700 transition"
                    >
                      <div className="font-medium text-stone-900">{p.name}</div>
                      <div className="text-xs text-stone-500 mt-1">{p.mode}</div>
                      <div className="text-[10px] uppercase tracking-widest text-emerald-700 mt-2">+ Attiva</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Subscribe modal */}
        {modal && (
          <SubscribeModal
            portal={modal}
            onClose={() => setModal(null)}
            onCreated={() => { setModal(null); load(); }}
          />
        )}
      </section>
    </AgencyShell>
  );
}

function SubscribeModal({ portal, onClose, onCreated }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [enabled, setEnabled] = useState(true);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/app/portals", {
        portal_code: portal.portal_code,
        credentials: {
          email: email.trim() || null,
          username: username.trim() || null,
        },
        password: password || null,
        frequency,
        enabled,
        notes: notes.trim() || null,
      });
      onCreated();
    } catch (err) {
      setError(String(err?.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <form onSubmit={submit} data-testid="subscribe-modal" className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            Attiva {portal.portal_name}
          </h3>
          <p className="text-xs text-stone-500 mt-1">Le credenziali sono cifrate prima del salvataggio.</p>
        </div>
        <input data-testid="modal-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email account portale" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm" />
        <input data-testid="modal-username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username (opzionale)" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm" />
        <input data-testid="modal-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm" />
        <select data-testid="modal-frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm">
          {FREQUENCIES.map((f) => <option key={f} value={f}>Frequenza: {f}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} /> Attiva subito
        </label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Note (opzionale)" className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm h-20" />
        {error && <p className="text-xs text-red-700">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900">Annulla</button>
          <button type="submit" disabled={saving} data-testid="modal-submit" className="px-4 py-2 bg-stone-900 text-white text-xs uppercase tracking-widest rounded-md hover:bg-stone-700 disabled:opacity-50">
            {saving ? "..." : "Attiva portale"}
          </button>
        </div>
      </form>
    </div>
  );
}
