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
import AddressAutocomplete from "./AddressAutocomplete";

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

const emptyPro = {
  // UNI 10750 superfici (lasciate vuote = 0)
  veranda_mq: "", terrazzo_mq: "", balcone_mq: "",
  cantina_mq: "", soffitta_mq: "",
  box_auto_mq: "", posto_auto_scoperto_mq: "",
  giardino_villa_mq: "", giardino_condom_mq: "",
  taverna_mq: "", mansarda_abitabile_mq: "",
  // Merito
  floor_class: "", exposure: "", view: "", heating: "", elevator: "",
  year_built: "",
  vincolo_storico: false, vincolo_paesag: false,
  locazione_libera_breve: false, locazione_lunga: false, nuda_proprieta: false,
};

const FLOOR_CLASSES = [
  "seminterrato", "piano_terra", "piano_1", "piano_intermedio",
  "ultimo_no_asc", "ultimo_con_asc", "attico_panoramico",
];
const EXPOSURES = ["sud", "sud_est", "sud_ovest", "est", "ovest", "nord_est", "nord_ovest", "nord", "cieca", "doppia_esp"];
const VIEWS = ["interno", "cortile", "strada", "verde", "panoramico", "mare", "lago_montagna"];
const HEATINGS = ["autonomo", "centralizzato", "pompa_calore", "assente"];
const ELEVATORS = ["presente", "presente_piano_alto", "assente_piano_basso", "assente_piano_alto"];

export default function ValuatorPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);
  const [form, setForm] = useState(empty);
  const [pro, setPro] = useState(emptyPro);
  const [proMode, setProMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const upd = (k, v) => setForm({ ...form, [k]: v });
  const updPro = (k, v) => setPro({ ...pro, [k]: v });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError(""); setResult(null);
    try {
      const payload = { ...form };
      ["surface_sqm", "floor"].forEach((k) => {
        if (payload[k] === "" || payload[k] == null) delete payload[k];
        else payload[k] = Number(payload[k]);
      });
      Object.keys(payload).forEach((k) => {
        if (payload[k] === "") delete payload[k];
        // Strip internal-only fields (from autocomplete metadata)
        if (k.startsWith("_")) delete payload[k];
      });

      // Pro mode: assemble commercial_surfaces + merit
      if (proMode) {
        const surfaceKeys = [
          "veranda_mq", "terrazzo_mq", "balcone_mq", "cantina_mq", "soffitta_mq",
          "box_auto_mq", "posto_auto_scoperto_mq", "giardino_villa_mq",
          "giardino_condom_mq", "taverna_mq", "mansarda_abitabile_mq",
        ];
        const cs = {};
        if (form.surface_sqm) cs.principale_mq = Number(form.surface_sqm);
        surfaceKeys.forEach((k) => {
          const v = pro[k];
          if (v !== "" && v != null && Number(v) > 0) cs[k] = Number(v);
        });
        if (Object.keys(cs).length > 1) payload.commercial_surfaces = cs;

        const merit = {};
        ["floor_class", "exposure", "view", "heating", "elevator"].forEach((k) => {
          if (pro[k]) merit[k] = pro[k];
        });
        if (pro.year_built && Number(pro.year_built) > 1700) merit.year_built = Number(pro.year_built);
        ["vincolo_storico", "vincolo_paesag", "locazione_libera_breve", "locazione_lunga", "nuda_proprieta"].forEach((k) => {
          if (pro[k]) merit[k] = true;
        });
        if (Object.keys(merit).length > 0) payload.merit = merit;
      }

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
    setPro(emptyPro);
    setProMode(false);
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
              <AddressAutocomplete
                testid="val-address"
                value={form.address}
                onChange={(v) => upd("address", v)}
                onSelect={(rec) => {
                  // Auto-fill comune/CAP/coords if not already filled
                  setForm((f) => ({
                    ...f,
                    address: rec.normalized || f.address,
                    city: rec.comune || f.city,
                    _cap: rec.cap || undefined,
                    _lat: rec.lat || undefined,
                    _lon: rec.lon || undefined,
                    _provincia: rec.provincia_sigla || undefined,
                  }));
                }}
                placeholder={t("valuator.f_address_ph")}
                inputClassName={inputCls}
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

          {/* PRO MODE — UNI 10750 + Merito */}
          <section className="border-t border-stone-200 pt-6">
            <label className="flex items-center gap-3 cursor-pointer mb-4" data-testid="val-pro-toggle">
              <input
                type="checkbox"
                checked={proMode}
                onChange={(e) => setProMode(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-[#0B1E3F]">
                {t("valuator.pro_toggle")}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#C19A6B] bg-[#FAF7F2] px-2 py-0.5 rounded">PRO</span>
            </label>
            {!proMode && (
              <p className="text-[11px] text-stone-500">{t("valuator.pro_hint")}</p>
            )}

            {proMode && (
              <div data-testid="val-pro-section" className="space-y-6 mt-2">
                {/* UNI 10750 surfaces */}
                <div>
                  <h4 className="text-[11px] uppercase tracking-widest text-stone-500 mb-3">
                    {t("valuator.pro_surfaces_title")} — UNI 10750
                  </h4>
                  <p className="text-[11px] text-stone-500 mb-3">{t("valuator.pro_surfaces_hint")}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      ["balcone_mq", "Balconi"],
                      ["terrazzo_mq", "Terrazzi"],
                      ["veranda_mq", "Verande"],
                      ["cantina_mq", "Cantina"],
                      ["soffitta_mq", "Soffitta"],
                      ["box_auto_mq", "Box auto"],
                      ["posto_auto_scoperto_mq", "Posto auto"],
                      ["giardino_villa_mq", "Giardino villa"],
                      ["giardino_condom_mq", "Giardino cond."],
                      ["taverna_mq", "Taverna"],
                      ["mansarda_abitabile_mq", "Mansarda abit."],
                    ].map(([k, label]) => (
                      <label key={k} className="block">
                        <span className="text-[10px] uppercase tracking-widest text-stone-500">{label} (mq)</span>
                        <input
                          data-testid={`val-pro-${k}`}
                          type="number" min="0" step="1"
                          value={pro[k]}
                          onChange={(e) => updPro(k, e.target.value)}
                          className={inputCls}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Merit factors */}
                <div>
                  <h4 className="text-[11px] uppercase tracking-widest text-stone-500 mb-3">
                    {t("valuator.pro_merit_title")}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SelectField testid="val-pro-floor-class" label="Piano" value={pro.floor_class} onChange={(v) => updPro("floor_class", v)} options={FLOOR_CLASSES} t={t} ns="floor_class" />
                    <SelectField testid="val-pro-exposure" label="Esposizione" value={pro.exposure} onChange={(v) => updPro("exposure", v)} options={EXPOSURES} t={t} ns="exposure" />
                    <SelectField testid="val-pro-view" label="Affaccio" value={pro.view} onChange={(v) => updPro("view", v)} options={VIEWS} t={t} ns="view" />
                    <SelectField testid="val-pro-heating" label="Riscaldamento" value={pro.heating} onChange={(v) => updPro("heating", v)} options={HEATINGS} t={t} ns="heating" />
                    <SelectField testid="val-pro-elevator" label="Ascensore" value={pro.elevator} onChange={(v) => updPro("elevator", v)} options={ELEVATORS} t={t} ns="elevator" />
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-widest text-stone-500">Anno costruzione</span>
                      <input
                        data-testid="val-pro-year_built"
                        type="number" min="1700" max="2030"
                        value={pro.year_built}
                        onChange={(e) => updPro("year_built", e.target.value)}
                        className={inputCls}
                      />
                    </label>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      ["vincolo_storico", "Vincolo storico-artistico"],
                      ["vincolo_paesag", "Vincolo paesaggistico"],
                      ["locazione_libera_breve", "Locato (contratto breve)"],
                      ["locazione_lunga", "Locato (contratto lungo)"],
                      ["nuda_proprieta", "Nuda proprietà"],
                    ].map(([k, label]) => (
                      <label key={k} className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                        <input
                          data-testid={`val-pro-${k}`}
                          type="checkbox"
                          checked={!!pro[k]}
                          onChange={(e) => updPro(k, e.target.checked)}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
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

      {result && <ValuationResult result={result} onReset={reset} lang={lang} formCity={form.city} formType={form.property_type} />}
    </div>
  );
}

function SelectField({ testid, label, value, onChange, options, t, ns }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-stone-500">{label}</span>
      <select
        data-testid={testid}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {t(`valuator.${ns}_${o}`, o.replace(/_/g, " "))}
          </option>
        ))}
      </select>
    </label>
  );
}

function ValuationResult({ result, onReset, lang, formCity, formType }) {
  const { t } = useTranslation();
  const fmt = (n) => `€ ${Math.round(n).toLocaleString("it-IT")}`;
  const confColor = {
    high: "bg-emerald-100 text-emerald-800 border-emerald-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    low: "bg-stone-100 text-stone-800 border-stone-200",
  }[result.confidence] || "bg-stone-100 text-stone-800 border-stone-200";

  // Build "Confronta con immobili simili" deep-link to /:lang/cloud/search
  // City from form (raw user input), property_type from form, price range ±20%
  const avg = result.estimated_value?.avg || 0;
  const priceMin = Math.max(0, Math.round(avg * 0.8));
  const priceMax = Math.round(avg * 1.2);
  const compareParams = new URLSearchParams();
  compareParams.set("operation", "sale");
  if (formCity) compareParams.set("city", formCity);
  if (formType) compareParams.set("property_type", formType);
  if (priceMin > 0) compareParams.set("price_min", String(priceMin));
  if (priceMax > 0) compareParams.set("price_max", String(priceMax));
  const compareUrl = `/${lang}/cloud/search?${compareParams.toString()}`;

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
          <span className={`text-xs uppercase tracking-widest px-3 py-1 rounded border ${confColor}`} data-testid="r-confidence">
            {t("valuator.confidence")}: {t(`valuator.conf_${result.confidence}`)}
          </span>
        </div>
      </div>

      {/* Province fallback notice */}
      {result.fallback_used === "province" && result.province_name && (
        <div data-testid="r-province-fallback" className="bg-[#FAF7F2] border border-[#C19A6B]/40 rounded p-3 text-xs text-stone-700">
          <strong>ℹ️ {t("valuator.r_province_fallback_title", "Comune non in dataset diretto")}</strong> — {t("valuator.r_province_fallback_body", `usata media provinciale di ${result.province_name} (${result.province_sigla}) come riferimento.`, { name: result.province_name, sigla: result.province_sigla })}
        </div>
      )}

      {/* Detail grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-stone-200 rounded-lg p-5">
          <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-3 font-medium">
            {t("valuator.r_inputs")}
          </h3>
          <dl className="text-sm space-y-1.5">
            <Row label={t("valuator.r_city")} value={`${result.city_resolved || (result.province_name || "—")} ${result.region ? `(${result.region})` : ""}`} />
            <Row label={t("valuator.r_zone")} value={result.zone_tier + (result.zone_explicit ? "" : ` (${t("valuator.r_inferred")})`)} />
            <Row label={t("valuator.r_surface")} value={`${result.surface_sqm} m²`} />
            {result.surface?.commercial_mq && result.surface.commercial_mq !== result.surface_sqm && (
              <Row
                label={
                  <span title="UNI 10750: superficie ponderata di balconi, terrazzi, cantine, box, ecc.">
                    {t("valuator.r_commercial_mq", "Superficie commerciale (UNI 10750)")}
                  </span>
                }
                value={<strong data-testid="r-commercial-mq">{result.surface.commercial_mq} m²</strong>}
              />
            )}
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
            {typeof result.multipliers_applied.merit_pct === "number" && result.multipliers_applied.merit_pct !== 0 && (
              <Row
                label={t("valuator.r_mult_merit", "Coefficiente di merito")}
                value={<span data-testid="r-merit-pct">{(result.multipliers_applied.merit_pct * 100).toFixed(1)}%</span>}
              />
            )}
            {typeof result.multipliers_applied.regional_pct === "number" && result.multipliers_applied.regional_pct !== 0 && (
              <Row
                label={t("valuator.r_mult_regional", "Coefficiente regionale")}
                value={<span data-testid="r-regional-pct">{(result.multipliers_applied.regional_pct * 100).toFixed(2)}%</span>}
              />
            )}
            <Row label={<strong>{t("valuator.r_mult_total")}</strong>} value={<strong>× {result.multipliers_applied.total}</strong>} />
          </dl>
        </div>
      </div>

      {/* Surface breakdown UNI 10750 */}
      {result.surface?.breakdown && Object.keys(result.surface.breakdown).length > 1 && (
        <div data-testid="r-surface-breakdown" className="bg-white border border-stone-200 rounded-lg p-5">
          <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-3 font-medium">
            {t("valuator.r_surface_breakdown", "Componenti superficie commerciale UNI 10750")}
          </h3>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs">
            {Object.entries(result.surface.breakdown).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <dt className="text-stone-500 capitalize">{k.replace(/_mq$/, "").replace(/_/g, " ")}</dt>
                <dd className="font-medium">{v} m²</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Merit breakdown */}
      {result.merit_breakdown && Object.keys(result.merit_breakdown).length > 0 && (
        <div data-testid="r-merit-breakdown" className="bg-white border border-stone-200 rounded-lg p-5">
          <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-3 font-medium">
            {t("valuator.r_merit_breakdown", "Coefficienti di merito applicati")}
          </h3>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs">
            {Object.entries(result.merit_breakdown).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <dt className="text-stone-500 capitalize">{k.replace(/_/g, " ")}</dt>
                <dd className={`font-medium ${v > 0 ? "text-emerald-700" : v < 0 ? "text-rose-700" : ""}`}>
                  {v > 0 ? "+" : ""}{(v * 100).toFixed(1)}%
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

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
        <Link
          to={compareUrl}
          data-testid="r-compare-market"
          className="px-6 py-3 bg-[#C19A6B] text-white text-sm uppercase tracking-widest font-medium rounded hover:bg-[#a8845a] transition inline-flex items-center gap-2"
          title={t("valuator.r_compare_market_hint")}
        >
          {t("valuator.r_compare_market")} →
        </Link>
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
