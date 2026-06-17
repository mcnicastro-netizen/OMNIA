import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import AgencyShell from "./components/AgencyShell";
import { api } from "../../shared/lib/api";

const TYPES = ["", "buyer", "seller", "tenant", "landlord", "investor"];
const STATUSES = ["", "new", "contacted", "qualified", "negotiating", "closed_won", "closed_lost", "archived"];

function formatPrice(v) {
  if (v == null) return "—";
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
}

export default function ClientsPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);
  const nav = useNavigate();
  const [data, setData] = useState({ items: [], total: 0, page: 1, page_size: 20 });
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [clientType, setClientType] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status) params.set("status", status);
      if (clientType) params.set("client_type", clientType);
      const { data } = await api.get(`/app/clients?${params.toString()}`);
      setData(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <AgencyShell current="clients">
      <section data-testid="clients-page" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1
              className="text-3xl md:text-4xl tracking-tight"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {t("clients.title")}
            </h1>
            <p className="text-stone-600 mt-1">{t("clients.subtitle")}</p>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/${lang}/app/clients/new`}
              data-testid="clients-new-btn"
              className="px-5 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest font-medium rounded-md hover:bg-stone-700 transition"
            >
              {t("clients.new_btn")}
            </Link>
          </div>
        </div>

        {/* Filters */}
        <form onSubmit={onSearch} className="flex flex-wrap gap-3 items-end bg-white border border-stone-200 rounded-lg p-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs uppercase tracking-widest text-stone-500 mb-1.5">{t("common.search")}</label>
            <input
              data-testid="clients-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("clients.search_placeholder")}
              className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:border-stone-900"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 mb-1.5">{t("clients.filter_type")}</label>
            <select data-testid="filter-client-type" value={clientType} onChange={(e) => setClientType(e.target.value)} className="px-3 py-2 border border-stone-300 rounded-md text-sm">
              {TYPES.map((s) => (
                <option key={s} value={s}>{s ? t(`clients.type_${s}`) : t("clients.filter_all")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 mb-1.5">{t("clients.filter_status")}</label>
            <select data-testid="filter-client-status" value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border border-stone-300 rounded-md text-sm">
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s ? t(`clients.status_${s}`) : t("clients.filter_all")}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="px-4 py-2 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest rounded-md hover:bg-stone-700">
            {t("common.search")}
          </button>
        </form>

        {loading ? (
          <p className="text-stone-500 text-sm">{t("common.loading")}</p>
        ) : data.items.length === 0 ? (
          <div data-testid="clients-empty" className="bg-white border border-stone-200 rounded-lg p-12 text-center">
            <p
              className="text-2xl mb-2"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {t("clients.empty_title")}
            </p>
            <p className="text-stone-500 mb-6 max-w-md mx-auto">{t("clients.empty_subtitle")}</p>
            <Link
              to={`/${lang}/app/clients/new`}
              className="inline-block px-5 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest rounded-md hover:bg-stone-700"
            >
              {t("clients.new_btn")}
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr className="text-left text-xs uppercase tracking-widest text-stone-500">
                  <th className="px-4 py-3 font-medium">{t("clients.table_name")}</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">{t("clients.table_contact")}</th>
                  <th className="px-4 py-3 font-medium">{t("clients.table_type")}</th>
                  <th className="px-4 py-3 font-medium">{t("clients.table_status")}</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">{t("clients.table_source")}</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((c) => (
                  <tr
                    key={c.id}
                    data-testid={`client-row-${c.id}`}
                    onClick={() => nav(`/${lang}/app/clients/${c.id}`)}
                    className="border-b border-stone-100 cursor-pointer hover:bg-stone-50 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-900">
                        {c.name} {c.surname || ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600 hidden md:table-cell">
                      <div className="text-xs">{c.email || "—"}</div>
                      <div className="text-xs text-stone-400">{c.phone || ""}</div>
                    </td>
                    <td className="px-4 py-3">
                      {(() => {
                        const tone = (() => {
                          switch (c.client_type) {
                            case "buyer": return "bg-blue-50 text-blue-700 border-blue-100";
                            case "tenant": return "bg-violet-50 text-violet-700 border-violet-100";
                            case "seller": return "bg-emerald-50 text-emerald-700 border-emerald-100";
                            case "landlord": return "bg-teal-50 text-teal-700 border-teal-100";
                            case "investor": return "bg-amber-50 text-amber-700 border-amber-100";
                            default: return "bg-stone-100 text-stone-700 border-stone-200";
                          }
                        })();
                        return (
                          <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${tone}`}>
                            {t(`clients.type_${c.client_type}`)}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded uppercase tracking-wide ${
                        c.status === "new" ? "bg-blue-50 text-blue-700" :
                        c.status === "qualified" || c.status === "negotiating" ? "bg-amber-50 text-amber-700" :
                        c.status === "closed_won" ? "bg-emerald-50 text-emerald-700" :
                        c.status === "closed_lost" || c.status === "archived" ? "bg-stone-100 text-stone-500" :
                        "bg-stone-100 text-stone-700"
                      }`}>
                        {t(`clients.status_${c.status}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs hidden lg:table-cell">
                      {c.source || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AgencyShell>
  );
}
