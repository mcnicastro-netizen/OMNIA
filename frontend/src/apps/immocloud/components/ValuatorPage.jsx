/* OMNIA — Public GIS Valuator (M3.S6)
 *
 * Free public page where any visitor can get an instant market valuation
 * of an Italian residential property. Calls POST /api/cloud/valuator.
 *
 * Path: /it/cloud/valutatore
 *
 * Lead capture: optional email/name field captures a "valuation lead" into
 * db.valuation_leads (source='ImmobilCloud-Valuator') — high-intent contact.
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/cloud/valuator`;

const PROPERTY_TYPES = [
  "appartamento", "attico", "loft", "villa", "monolocale",
  "rustico_casale", "ufficio", "negozio", "garage_box",
];

const CONDITIONS = [
  "nuovo", "ristrutturato", "ottimo", "buono",
  "abitabile", "da_ristrutturare", "ruderi_da_demolire",
];

const ENERGY_CLASSES = ["A4", "A3", "A2", "A1", "A", "B", "C", "D", "E", "F", "G"];

const empty = {
  city: "", zone: "", address: "",
  property_type: "appartamento",
  surface_sqm: "",
  condition: "buono",
  energy_class: "",
  floor: "",
  name: "", email: "",
};

export default function ValuatorPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const upd = (k, v) => setForm({ ...form, [k]: v });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError(""); setResult(null);
    try {
      const payload = { ...form };
      ["surface_sqm", "floor"].forEach((k) => {
        if (payload[k] === "" || payload[k] == null) delete payload[k];
        else payload[k] = Number(payload[k]);
      });
      // Clean empty strings
      Object.keys(payload).forEach((k) => {
        if (payload[k] === "") delete payload[k];
      });
      const r = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(typeof d.detail === "string" ? d.detail : t("valuator.err_generic"));
      } else {
        setResult(d);
      }
    } catch {
      setError(t("valuator.err_generic"));
    } finally { setBusy(false); }
  };

  const reset = () => {
    setResult(null);
    setForm(empty);
    setError("");
  };

  return (
    <div data-testid="valuator-page" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#C19A6B] font-semibold mb-2">
          {t("valuator.eyebrow")}
        </p>
        <h1 className="text-3xl md:text-5xl font-light tracking-tight" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
          {t("valuator.title")}
        </h1>
        <p className="text-stone-600 text-base mt-3 max-w-2xl">
          {t("valuator.subtitle")}
        </p>
      </header>

      {!result && (
        <form data-testid="valuator-form" onSubmit={submit} className="bg-white border border-stone-200 rounded-lg p-6 space-y-5">
          {/* Localizzazione */}
          <section>
            <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-3 font-medium">
              {t("valuator.section_location")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label={t("valuator.f_city")} required>
                <input
                  data-testid="val-city" required value={form.city}
                  onChange={(e) => upd("city", e.target.value)}
                  placeholder={t("valuator.f_city_ph")}
                  className={inputCls}
                />
              </Field>
              <Field label={t("valuator.f_zone")}>
                <select data-testid="val-zone" value={form.zone}
                  onChange={(e) => upd("zone", e.target.value)} className={inputCls}>
                  <option value="">{t("valuator.f_zone_auto")}</option>
                  <option value="centro">{t("valuator.zone_centro")}</option>
                  <option value="semicentro">{t("valuator.zone_semicentro")}</option>
                  <option value="periferia">{t("valuator.zone_periferia")}</option>
                </select>
              </Field>
            </div>
            <Field label={t("valuator.f_address")} className="mt-3">
              <input
                data-testid="val-address" value={form.address}
                onChange={(e) => upd("address", e.target.value)}
                placeholder={t("valuator.f_address_ph")}
                className={inputCls}
              />
            </Field>
          </section>

          {/* Immobile */}
          <section>
            <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-3 font-medium">
              {t("valuator.section_property")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Field label={t("valuator.f_type")}>
                <select data-testid="val-type" value={form.property_type}
                  onChange={(e) => upd("property_type", e.target.value)} className={inputCls}>
                  {PROPERTY_TYPES.map((p) => (
                    <option key={p} value={p}>{p.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </Field>
              <Field label={t("valuator.f_surface")} required>
                <input
                  data-testid="val-surface" type="number" min="10" max="10000" required
                  value={form.surface_sqm}
                  onChange={(e) => upd("surface_sqm", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label={t("valuator.f_floor")}>
                <input
                  data-testid="val-floor" type="number" min="-2" max="80"
                  value={form.floor}
                  onChange={(e) => upd("floor", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Field label={t("valuator.f_condition")}>
                <select data-testid="val-condition" value={form.condition}
                  onChange={(e) => upd("condition", e.target.value)} className={inputCls}>
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>{t(`valuator.cond_${c}`, c.replace(/_/g, " "))}</option>
                  ))}
                </select>
              </Field>
              <Field label={t("valuator.f_energy")}>
                <select data-testid="val-energy" value={form.energy_class}
                  onChange={(e) => upd("energy_class", e.target.value)} className={inputCls}>
                  <option value="">{t("valuator.unknown")}</option>
                  {ENERGY_CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
          </section>

          {/* Lead capture (optional) */}
          <section>
            <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-3 font-medium">
              {t("valuator.section_contact_optional")}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <input
                data-testid="val-name" placeholder={t("valuator.f_name_ph")}
                value={form.name} onChange={(e) => upd("name", e.target.value)}
                className={inputCls}
              />
              <input
                data-testid="val-email" type="email" placeholder={t("valuator.f_email_ph")}
                value={form.email} onChange={(e) => upd("email", e.target.value)}
                className={inputCls}
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-2">{t("valuator.contact_hint")}</p>
          </section>

          {error && (
            <div data-testid="valuator-error" className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit" disabled={busy} data-testid="val-submit"
            className="w-full md:w-auto px-8 py-3 bg-[#0B1E3F] text-white text-sm uppercase tracking-widest font-medium rounded hover:bg-[#C19A6B] transition disabled:opacity-50"
          >
            {busy ? t("valuator.calculating") : t("valuator.submit")}
          </button>
        </form>
      )}

      {result && <ValuationResult result={result} onReset={reset} lang={lang} />}
    </div>
  );
}

function ValuationResult({ result, onReset, lang }) {
  const { t } = useTranslation();
  const fmt = (n) => `€ ${Math.round(n).toLocaleString("it-IT")}`;
  const confColor = {
    high: "bg-emerald-100 text-emerald-800 border-emerald-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    low: "bg-stone-100 text-stone-800 border-stone-200",
  }[result.confidence] || "bg-stone-100 text-stone-800 border-stone-200";

  return (
    <div data-testid="valuator-result" className="space-y-6">
      {/* Hero: estimated value */}
      <div className="bg-gradient-to-br from-[#0B1E3F] to-[#1a3055] text-white rounded-lg p-8">
        <p className="text-xs uppercase tracking-widest text-[#C19A6B] font-semibold mb-2">
          {t("valuator.r_eyebrow")}
        </p>
        <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-3" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
          <span data-testid="r-value-avg">{fmt(result.estimated_value.avg)}</span>
        </h2>
        <p className="text-sm text-stone-300 mb-4">
          {t("valuator.r_range")}: <strong className="text-white" data-testid="r-value-range">
            {fmt(result.estimated_value.min)} — {fmt(result.estimated_value.max)}
          </strong>
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs uppercase tracking-widest bg-white/10 px-3 py-1 rounded">
            {fmt(result.price_per_sqm.avg)}/m²
          </span>
          <span className={`text-xs uppercase tracking-widest px-3 py-1 rounded border ${confColor}`}>
            {t("valuator.confidence")}: {t(`valuator.conf_${result.confidence}`)}
          </span>
        </div>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-stone-200 rounded-lg p-5">
          <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-3 font-medium">
            {t("valuator.r_inputs")}
          </h3>
          <dl className="text-sm space-y-1.5">
            <Row label={t("valuator.r_city")} value={`${result.city_resolved || "—"} ${result.region ? `(${result.region})` : ""}`} />
            <Row label={t("valuator.r_zone")} value={result.zone_tier + (result.zone_explicit ? "" : ` (${t("valuator.r_inferred")})`)} />
            <Row label={t("valuator.r_surface")} value={`${result.surface_sqm} m²`} />
            <Row label={t("valuator.r_psm")} value={`${fmt(result.price_per_sqm.min)} — ${fmt(result.price_per_sqm.max)}`} />
          </dl>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-5">
          <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-3 font-medium">
            {t("valuator.r_multipliers")}
          </h3>
          <dl className="text-sm space-y-1.5">
            <Row label={t("valuator.r_mult_type")} value={`× ${result.multipliers_applied.property_type}`} />
            <Row label={t("valuator.r_mult_condition")} value={`× ${result.multipliers_applied.condition}`} />
            <Row label={t("valuator.r_mult_energy")} value={`× ${result.multipliers_applied.energy_class}`} />
            <Row label={t("valuator.r_mult_floor")} value={`× ${result.multipliers_applied.floor}`} />
            <Row label={<strong>{t("valuator.r_mult_total")}</strong>} value={<strong>× {result.multipliers_applied.total}</strong>} />
          </dl>
        </div>
      </div>

      {/* Comparables */}
      {result.comparable_count > 0 && (
        <div data-testid="r-comparables" className="bg-white border border-stone-200 rounded-lg p-5">
          <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-3 font-medium">
            {t("valuator.r_comparables", { count: result.comparable_count })}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.comparables.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                to={`/${lang}/cloud/property/${c.id}`}
                className="text-xs p-3 border border-stone-200 rounded hover:border-[#0B1E3F] transition"
              >
                <div className="font-medium text-stone-900 truncate">{c.title}</div>
                <div className="text-stone-600 mt-0.5">
                  {c.city}{c.zone ? ` · ${c.zone}` : ""} · {c.surface_sqm} m² · {c.rooms ? `${c.rooms} locali` : ""}
                </div>
                <div className="text-[#0B1E3F] font-semibold mt-1">
                  {fmt(c.price)} · {fmt(c.price_per_sqm)}/m²
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Methodology */}
      <details className="bg-stone-50 border border-stone-200 rounded-lg p-4">
        <summary className="text-xs uppercase tracking-widest text-stone-500 cursor-pointer font-medium">
          {t("valuator.r_methodology")}
        </summary>
        <p className="text-xs text-stone-600 mt-3 leading-relaxed">{result.methodology}</p>
        <p className="text-[11px] text-stone-500 mt-2 italic">
          {t("valuator.r_data_source")}: {result.data_source}
        </p>
      </details>

      {/* Disclaimer */}
      <p className="text-[11px] text-stone-500 italic">{result.disclaimer}</p>

      {/* CTA */}
      <div className="flex flex-wrap gap-3 pt-4">
        <button
          onClick={onReset} data-testid="r-recompute"
          className="px-6 py-3 border border-stone-300 text-sm uppercase tracking-widest rounded hover:bg-stone-50"
        >
          {t("valuator.r_recompute")}
        </button>
        {result.valuation_lead_id && (
          <p data-testid="r-lead-captured" className="text-xs text-emerald-700 self-center bg-emerald-50 border border-emerald-200 rounded px-3 py-2">
            ✓ {t("valuator.r_lead_thanks")}
          </p>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:border-[#0B1E3F]";

function Field({ label, children, required, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-xs uppercase tracking-widest text-stone-500 mb-1.5">
        {label}{required && " *"}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-stone-500">{label}</dt>
      <dd className="text-stone-900 text-right">{value}</dd>
    </div>
  );
}
