import React, { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../shared/components/LanguageSwitcher";
import PropertyMapView from "./components/PropertyMapView";
import PropertyDetailPage from "./components/PropertyDetailPage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/cloud`;

// Unsplash hero image: warm italian villa interior, free license
const HERO_IMG = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=70&auto=format&fit=crop";

const THEME = {
  bg: "bg-[#fbf9f5]", card: "bg-white", text: "text-[#1c1917]", muted: "text-[#78716c]",
  primary: "bg-[#0B1E3F]", primaryText: "text-white", accent: "bg-[#C19A6B]", accentText: "text-white",
};

export default function ImmocloudApp() {
  return (
    <div className={`min-h-screen ${THEME.bg} ${THEME.text}`} data-testid="immocloud-app">
      <CloudTopNav />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="property/:pid" element={<PropertyDetailPage />} />
      </Routes>
      <FooterB2C />
    </div>
  );
}

/* CloudTopNav — replaces shared TopNav with B2C-specific nav (no Formazione).
 * 3 links: Cerca casa · Vendi casa · Area riservata. */
function CloudTopNav() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[#fbf9f5]/95 border-b border-stone-200">
      <div className="flex items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16 py-4 max-w-screen-2xl mx-auto gap-4">
        <Link to={`/${lang}/cloud`} data-testid="cloud-topnav-logo"
          className="text-xl md:text-2xl tracking-tight font-medium text-stone-900"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
          ImmobilCloud<sup className="text-[10px] text-stone-400 ml-0.5">™</sup>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm uppercase tracking-widest">
          <Link to={`/${lang}/cloud/search`} data-testid="cloud-nav-search" className="text-stone-600 hover:text-stone-900">
            {t("cloud.nav_search")}
          </Link>
          <Link to={`/${lang}/cloud/register?intent=sell`} data-testid="cloud-nav-sell" className="text-stone-600 hover:text-stone-900">
            {t("cloud.nav_sell")}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to={`/${lang}/cloud/register`} data-testid="cloud-nav-area"
            className="px-4 py-2 text-xs uppercase tracking-widest bg-[#0B1E3F] text-white rounded hover:bg-[#C19A6B] transition">
            {t("cloud.nav_area")}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

/* =========================================================================
 *  HOME — hero search + facets + featured cards
 * ========================================================================= */
function HomePage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);
  const [facets, setFacets] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [operation, setOperation] = useState("sale");
  const [city, setCity] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    fetch(`${API}/facets?operation=${operation}`).then((r) => r.json()).then(setFacets).catch(() => {});
    fetch(`${API}/search?operation=${operation}&page_size=6&sort=recent`)
      .then((r) => r.json()).then((d) => setFeatured(d.items || [])).catch(() => {});
  }, [operation]);

  const submit = (e) => {
    e?.preventDefault?.();
    const params = new URLSearchParams();
    params.set("operation", operation);
    if (city) params.set("city", city);
    nav(`search?${params.toString()}`);
  };

  return (
    <>
      {/* ───────── Hero split-layout ───────── */}
      <section className="px-5 sm:px-8 md:px-16 py-10 md:py-16" data-testid="cloud-hero">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-4">
              ImmobilCloud<sup className="text-[8px]">™</sup>
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-6 font-light"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              {t("immocloud.tagline")}
            </h1>
            <p className="text-base md:text-lg text-stone-600 max-w-xl mb-8">
              {t("cloud.hero_subtitle")}
            </p>
            <form onSubmit={submit} className="bg-white rounded-2xl border border-stone-200 shadow-md p-3 flex flex-col sm:flex-row gap-2">
              <input
                data-testid="cloud-search-city" type="text" value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t("cloud.search_placeholder")}
                list="cloud-cities-suggest"
                className="flex-1 px-4 py-3 text-base outline-none rounded-lg focus:bg-stone-50"
              />
              <datalist id="cloud-cities-suggest">
                {(facets?.cities || []).map((c) => <option key={c.city} value={c.city} />)}
              </datalist>
              <button data-testid="cloud-search-btn" type="submit"
                className="bg-[#0B1E3F] text-white px-6 py-3 rounded-lg font-medium tracking-wide hover:bg-[#C19A6B] hover:shadow-md transition-all">
                {t("cloud.search_btn")}
              </button>
            </form>
            {facets && (
              <p className="text-xs text-stone-500 mt-4" data-testid="cloud-total">
                {t("cloud.total_listings", { n: facets.total_active })}
              </p>
            )}
          </div>
          <div className="hidden lg:block">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <img src={HERO_IMG} alt="" loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 3 ACTION CARDS (Cerca · Vendi · Affitta) ───────── */}
      <section className="px-5 sm:px-8 md:px-16 py-12" data-testid="cloud-3cards">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          <ActionCard
            id="cerca" testid="card-cerca" icon="🔍"
            title={t("cloud.card_cerca_title")} text={t("cloud.card_cerca_text")}
            cta={t("cloud.card_cerca_cta")} to={`/${lang}/cloud/search?operation=sale`}
            accent="navy"
          />
          <ActionCard
            id="vendi" testid="card-vendi" icon="🏷️"
            title={t("cloud.card_vendi_title")} text={t("cloud.card_vendi_text")}
            cta={t("cloud.card_vendi_cta")} to={`/${lang}/cloud/register?intent=sell`}
            accent="gold"
          />
          <ActionCard
            id="affitta" testid="card-affitta" icon="🔑"
            title={t("cloud.card_affitta_title")} text={t("cloud.card_affitta_text")}
            cta={t("cloud.card_affitta_cta")} to={`/${lang}/cloud/register?intent=rent_out`}
            accent="navy"
          />
        </div>
      </section>

      {/* ───────── Top cities ───────── */}
      {facets?.cities?.length > 0 && (
        <section className="px-5 sm:px-8 md:px-16 py-8" data-testid="cloud-cities-row">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-4">
              {t("cloud.popular_cities")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {facets.cities.slice(0, 12).map((c) => (
                <Link key={c.city}
                  to={`search?operation=sale&city=${encodeURIComponent(c.city)}`}
                  data-testid={`cloud-city-pill-${c.city}`}
                  className="px-4 py-2 bg-white border border-stone-200 rounded-full text-sm hover:border-stone-700 hover:shadow-sm transition">
                  {c.city} <span className="text-stone-400 ml-1">{c.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── Featured cards ───────── */}
      {featured.length > 0 && (
        <section className="px-5 sm:px-8 md:px-16 py-12" data-testid="cloud-featured">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-light tracking-tight"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                {t("cloud.featured_title")}
              </h2>
              <Link to={`search?operation=${operation}`} className="text-xs uppercase tracking-widest text-stone-600 hover:text-stone-900">
                {t("cloud.see_all")} →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => <PropertyCard key={p.id} p={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function ActionCard({ id, testid, icon, title, text, cta, to, accent }) {
  const isGold = accent === "gold";
  return (
    <Link to={to} data-testid={testid}
      className={`group block bg-white rounded-2xl border border-stone-200 p-7 hover:shadow-xl hover:-translate-y-1 transition-all ${
        isGold ? "hover:border-[#C19A6B]" : "hover:border-[#0B1E3F]"
      }`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${
        isGold ? "bg-[#fef7ed] text-[#C19A6B]" : "bg-[#e7eaf2] text-[#0B1E3F]"
      }`}>{icon}</div>
      <h3 className="text-xl font-medium text-stone-900 mb-2"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}>{title}</h3>
      <p className="text-sm text-stone-600 mb-4 min-h-[3rem]">{text}</p>
      <span className={`text-xs uppercase tracking-widest font-medium ${
        isGold ? "text-[#C19A6B]" : "text-[#0B1E3F]"
      }`}>{cta} →</span>
    </Link>
  );
}

/* =========================================================================
 *  SEARCH — paginated list with sidebar filters
 * ========================================================================= */
function SearchPage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ items: [], total: 0, has_next: false, page: 1 });
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list" | "map"
  const [mapMarkers, setMapMarkers] = useState([]);

  const filters = useMemo(() => ({
    operation: params.get("operation") || "sale",
    city: params.get("city") || "",
    property_type: params.get("property_type") || "",
    price_min: params.get("price_min") || "",
    price_max: params.get("price_max") || "",
    surface_min: params.get("surface_min") || "",
    rooms_min: params.get("rooms_min") || "",
    bedrooms_min: params.get("bedrooms_min") || "",
    energy_class: params.get("energy_class") || "",
    sort: params.get("sort") || "recent",
    page: parseInt(params.get("page") || "1"),
  }), [params]);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && qs.set(k, v));
    qs.set("page_size", "20");
    fetch(`${API}/search?${qs.toString()}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters]);

  // M3.S3 — fetch map markers when switching to map view or filters change
  useEffect(() => {
    if (viewMode !== "map") return;
    const qs = new URLSearchParams();
    ["operation", "city", "property_type", "price_min", "price_max",
     "rooms_min", "bedrooms_min", "energy_class"].forEach((k) => {
      if (filters[k]) qs.set(k, filters[k]);
    });
    qs.set("limit", "500");
    fetch(`${API}/map?${qs.toString()}`)
      .then((r) => r.json())
      .then((d) => setMapMarkers(d.items || []))
      .catch(() => setMapMarkers([]));
  }, [viewMode, filters]);

  const updateFilter = (k, v) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    next.delete("page");
    setParams(next);
  };

  const goToPage = (n) => {
    const next = new URLSearchParams(params);
    next.set("page", n);
    setParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="px-5 sm:px-8 md:px-16 py-8 max-w-6xl mx-auto" data-testid="cloud-search-page">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="lg:w-64 flex-shrink-0 space-y-6">
          <h2 className="text-xs uppercase tracking-widest text-stone-500">
            {t("cloud.filters")}
          </h2>

          <FilterBlock label={t("cloud.f_operation")}>
            <SegSelect value={filters.operation} onChange={(v) => updateFilter("operation", v)}
              options={[
                { v: "sale", l: t("cloud.op_sale") },
                { v: "rent", l: t("cloud.op_rent") },
              ]} />
          </FilterBlock>

          <FilterBlock label={t("cloud.f_city")}>
            <input
              data-testid="filter-city" value={filters.city}
              onChange={(e) => updateFilter("city", e.target.value)}
              placeholder={t("cloud.search_placeholder")}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm"
            />
          </FilterBlock>

          <FilterBlock label={t("cloud.f_type")}>
            <select
              data-testid="filter-type"
              value={filters.property_type}
              onChange={(e) => updateFilter("property_type", e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm">
              <option value="">{t("cloud.any")}</option>
              {["appartamento", "casa", "villa", "loft", "attico", "monolocale", "ufficio"].map((tp) => (
                <option key={tp} value={tp}>{tp}</option>
              ))}
            </select>
          </FilterBlock>

          <FilterBlock label={t("cloud.f_price")}>
            <div className="flex gap-2">
              <input
                data-testid="filter-price-min" type="number" placeholder={t("cloud.min")}
                value={filters.price_min}
                onChange={(e) => updateFilter("price_min", e.target.value)}
                className="w-1/2 px-2 py-2 bg-white border border-stone-300 rounded text-sm"
              />
              <input
                data-testid="filter-price-max" type="number" placeholder={t("cloud.max")}
                value={filters.price_max}
                onChange={(e) => updateFilter("price_max", e.target.value)}
                className="w-1/2 px-2 py-2 bg-white border border-stone-300 rounded text-sm"
              />
            </div>
          </FilterBlock>

          <FilterBlock label={t("cloud.f_surface_min")}>
            <input
              data-testid="filter-surface-min" type="number" placeholder="m²"
              value={filters.surface_min}
              onChange={(e) => updateFilter("surface_min", e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm"
            />
          </FilterBlock>

          <FilterBlock label={t("cloud.f_rooms_min")}>
            <select
              data-testid="filter-rooms-min" value={filters.rooms_min}
              onChange={(e) => updateFilter("rooms_min", e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm">
              <option value="">{t("cloud.any")}</option>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
            </select>
          </FilterBlock>

          <FilterBlock label={t("cloud.f_bedrooms_min")}>
            <select
              data-testid="filter-bedrooms-min" value={filters.bedrooms_min}
              onChange={(e) => updateFilter("bedrooms_min", e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm">
              <option value="">{t("cloud.any")}</option>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
            </select>
          </FilterBlock>

          <FilterBlock label={t("cloud.f_energy_class")}>
            <select
              data-testid="filter-energy-class" value={filters.energy_class}
              onChange={(e) => updateFilter("energy_class", e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-sm">
              <option value="">{t("cloud.any")}</option>
              {["A4", "A3", "A2", "A1", "A", "B", "C", "D", "E", "F", "G"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </FilterBlock>
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
            <h1 className="text-2xl md:text-3xl font-light tracking-tight"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              {filters.city ? t("cloud.results_in_city", { city: filters.city }) : t("cloud.all_results")}
            </h1>
            <div className="flex items-center gap-3">
              {/* M3.S3 — list/map view toggle */}
              <div className="inline-flex bg-white border border-stone-300 rounded overflow-hidden text-xs uppercase tracking-widest">
                <button
                  data-testid="view-toggle-list"
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 transition ${
                    viewMode === "list" ? "bg-[#0B1E3F] text-white" : "text-stone-600 hover:bg-stone-50"
                  }`}>
                  {t("cloud.view_list")}
                </button>
                <button
                  data-testid="view-toggle-map"
                  onClick={() => setViewMode("map")}
                  className={`px-3 py-1.5 transition ${
                    viewMode === "map" ? "bg-[#0B1E3F] text-white" : "text-stone-600 hover:bg-stone-50"
                  }`}>
                  {t("cloud.view_map")}
                </button>
              </div>
              <select
                data-testid="filter-sort" value={filters.sort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="px-3 py-1.5 bg-white border border-stone-300 rounded text-sm">
                <option value="recent">{t("cloud.sort_recent")}</option>
                <option value="price_asc">{t("cloud.sort_price_asc")}</option>
                <option value="price_desc">{t("cloud.sort_price_desc")}</option>
                <option value="surface_desc">{t("cloud.sort_surface_desc")}</option>
              </select>
            </div>
          </div>

          <p className="text-xs text-stone-500 mb-4" data-testid="results-count">
            {t("cloud.total_results", { n: data.total })}
          </p>

          {viewMode === "map" ? (
            <PropertyMapView markers={mapMarkers} />
          ) : loading ? (
            <p className="text-stone-500 text-sm" data-testid="search-loading">
              {t("common.loading")}
            </p>
          ) : data.items.length === 0 ? (
            <p className="text-stone-500 text-base py-12" data-testid="search-empty">
              {t("cloud.no_results")}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="search-results-list">
                {data.items.map((p) => <PropertyCard key={p.id} p={p} />)}
              </div>
              {(data.has_next || data.page > 1) && (
                <div className="flex justify-center gap-2 mt-10" data-testid="pagination">
                  <button onClick={() => goToPage(data.page - 1)} disabled={data.page <= 1}
                    className="px-4 py-2 border border-stone-300 rounded disabled:opacity-30 hover:bg-stone-100 text-sm">
                    ← {t("cloud.prev")}
                  </button>
                  <span className="px-4 py-2 text-sm text-stone-600">
                    {t("cloud.page_of", { page: data.page, total: Math.ceil(data.total / 20) })}
                  </span>
                  <button onClick={() => goToPage(data.page + 1)} disabled={!data.has_next}
                    className="px-4 py-2 border border-stone-300 rounded disabled:opacity-30 hover:bg-stone-100 text-sm">
                    {t("cloud.next")} →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </section>
  );
}

function FilterBlock({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SegSelect({ value, onChange, options }) {
  return (
    <div className="flex bg-stone-100 rounded p-0.5">
      {options.map((o) => (
        <button key={o.v} type="button" onClick={() => onChange(o.v)}
          data-testid={`seg-${o.v}`}
          className={`flex-1 px-3 py-1.5 text-sm rounded transition ${
            value === o.v ? "bg-white text-stone-900 shadow-sm font-medium" : "text-stone-600"
          }`}>
          {o.l}
        </button>
      ))}
    </div>
  );
}

/* =========================================================================
 *  Property card (B2C, photo-driven)
 * ========================================================================= */
function PropertyCard({ p }) {
  const { t } = useTranslation();
  const cover = p.cover_url ? `${BACKEND_URL}${p.cover_url}` : null;
  const price = p.operation === "rent"
    ? `${formatEUR(p.rent_monthly)}/mese`
    : formatEUR(p.price);
  return (
    <article data-testid={`cloud-card-${p.id}`}
      className="bg-white rounded-xl overflow-hidden border border-stone-200 hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <div className="aspect-[4/3] bg-stone-100 relative">
        {cover ? (
          <img src={cover} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 text-5xl">⌂</div>
        )}
        {p.energy_class && (
          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest bg-white/90 backdrop-blur px-2 py-1 rounded">
            {t("cloud.energy")}: {p.energy_class}
          </span>
        )}
        {p.operation === "rent" && (
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-[#C19A6B] text-white px-2 py-1 rounded">
            {t("cloud.op_rent")}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xl font-semibold text-[#0B1E3F]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
          {price}
        </p>
        <h3 className="text-sm font-medium text-stone-900 mt-1 line-clamp-2">{p.title}</h3>
        <p className="text-xs text-stone-500 mt-1">
          {p.city}{p.zone && ` · ${p.zone}`}
        </p>
        <div className="flex items-center gap-3 mt-3 text-xs text-stone-600">
          {p.surface_sqm && <span>{p.surface_sqm} m²</span>}
          {p.rooms && <span>· {p.rooms} {t("cloud.rooms_short")}</span>}
          {p.bathrooms && <span>· {p.bathrooms} {t("cloud.baths_short")}</span>}
        </div>
        {p.agency && (
          <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-3 pt-2 border-t border-stone-100">
            {t("cloud.by_agency")}: <span className="text-stone-700">{p.agency.name}</span>
          </p>
        )}
      </div>
    </article>
  );
}

function formatEUR(n) {
  if (n == null) return "—";
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

/* =========================================================================
 *  REGISTER — B2C user (M3.S5 v1)
 * ========================================================================= */
function RegisterPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);
  const nav = useNavigate();
  const [params] = useSearchParams();
  const presetIntent = params.get("intent");
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    intents: presetIntent ? [presetIntent] : [],
    notification_channels: ["email"],
    gdpr_consent: false,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);

  const toggleArray = (key, val) => {
    setForm((f) => ({ ...f, [key]: f[key].includes(val) ? f[key].filter((v) => v !== val) : [...f[key], val] }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const r = await fetch(`${API}/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, lang }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.detail || "register_failed");
      setDone(data.user);
    } catch (e) {
      setErr(String(e.message || e));
    } finally { setBusy(false); }
  };

  if (done) {
    return (
      <section className="max-w-md mx-auto py-20 px-5" data-testid="cloud-register-done">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center">
          <p className="text-3xl mb-3">✓</p>
          <h2 className="text-2xl font-light tracking-tight mb-2"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            {t("cloud.reg_done_title")}
          </h2>
          <p className="text-sm text-stone-600 mb-6">
            {t("cloud.reg_done_text", { name: done.name })}
          </p>
          <button onClick={() => nav(`/${lang}/cloud`)}
            className="px-5 py-2.5 bg-[#0B1E3F] text-white text-xs uppercase tracking-widest rounded-md hover:bg-[#C19A6B]">
            {t("cloud.reg_back_home")}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-xl mx-auto py-12 px-5" data-testid="cloud-register-page">
      <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
        {t("cloud.reg_title")}
      </h1>
      <p className="text-stone-600 mb-8">{t("cloud.reg_subtitle")}</p>

      <form onSubmit={submit} className="bg-white border border-stone-200 rounded-2xl p-7 space-y-5">
        {err && <p data-testid="reg-error" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{err}</p>}

        <Field label={t("cloud.reg_name")}>
          <input data-testid="reg-name" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm focus:border-stone-700 outline-none" />
        </Field>

        <Field label="Email">
          <input data-testid="reg-email" required type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm focus:border-stone-700 outline-none" />
        </Field>

        <Field label={t("cloud.reg_password")}>
          <input data-testid="reg-password" required type="password" minLength={8} value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm focus:border-stone-700 outline-none" />
          <p className="text-xs text-stone-500 mt-1">{t("cloud.reg_password_hint")}</p>
        </Field>

        <Field label={t("cloud.reg_intents_title")}>
          <div className="space-y-2">
            {[
              { id: "sell", label: t("cloud.reg_intent_sell"), desc: t("cloud.reg_intent_sell_desc") },
              { id: "rent_out", label: t("cloud.reg_intent_rent_out"), desc: t("cloud.reg_intent_rent_out_desc") },
              { id: "get_alerts", label: t("cloud.reg_intent_alerts"), desc: t("cloud.reg_intent_alerts_desc") },
            ].map((opt) => (
              <label key={opt.id} data-testid={`reg-intent-${opt.id}`}
                className={`block p-3 border rounded-lg cursor-pointer transition ${
                  form.intents.includes(opt.id) ? "border-[#0B1E3F] bg-[#0B1E3F]/5" : "border-stone-200 hover:border-stone-400"
                }`}>
                <input type="checkbox" checked={form.intents.includes(opt.id)}
                  onChange={() => toggleArray("intents", opt.id)} className="mr-2" />
                <span className="font-medium text-sm">{opt.label}</span>
                <p className="text-xs text-stone-500 ml-6">{opt.desc}</p>
              </label>
            ))}
          </div>
        </Field>

        <Field label={t("cloud.reg_channels_title")}>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.notification_channels.includes("email")}
                onChange={() => toggleArray("notification_channels", "email")}
                data-testid="reg-channel-email" />
              ✉️ Email
            </label>
            <label className="flex items-center gap-2 text-sm text-stone-400 cursor-not-allowed" title="Disponibile prossimamente">
              <input type="checkbox" disabled />
              🔔 {t("cloud.reg_channel_push_coming")}
            </label>
          </div>
        </Field>

        <label className="flex items-start gap-2 text-xs text-stone-600">
          <input type="checkbox" checked={form.gdpr_consent}
            onChange={(e) => setForm({ ...form, gdpr_consent: e.target.checked })}
            data-testid="reg-gdpr" required />
          <span>{t("cloud.reg_gdpr_text")}</span>
        </label>

        <button type="submit" disabled={busy || form.intents.length === 0 || !form.gdpr_consent}
          data-testid="reg-submit-btn"
          className="w-full bg-[#0B1E3F] text-white px-6 py-3 rounded-lg font-medium text-sm uppercase tracking-widest hover:bg-[#C19A6B] transition disabled:opacity-50">
          {busy ? t("cloud.reg_submitting") : t("cloud.reg_submit_btn")}
        </button>
      </form>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-stone-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function FooterB2C() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-stone-200 mt-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-16 py-8 text-xs text-stone-500 flex flex-wrap items-center justify-between gap-3">
        <span>© 2026 OMNIA Real Estate Ecosystem</span>
        <span>{t("cloud.footer_tagline")}</span>
      </div>
    </footer>
  );
}
