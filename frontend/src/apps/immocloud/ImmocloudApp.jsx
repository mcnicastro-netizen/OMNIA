import React, { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TopNav from "../../shared/components/TopNav";
import Brand from "../../shared/components/Brand";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/cloud`;

/* ImmobilCloud B2C — M3.S1
 * Public, no-auth. Lighter and more colorful than the editorial B2B ImmoWeb shell.
 * Theme: warm cream background + deep navy primary + amber accent for CTAs.
 */
const THEME = {
  bg: "bg-[#fbf9f5]",      // cream
  card: "bg-white",
  text: "text-[#1c1917]",
  muted: "text-[#78716c]",
  primary: "bg-[#0B1E3F]",   // deep navy
  primaryText: "text-white",
  accent: "bg-[#C19A6B]",    // warm gold
  accentText: "text-white",
};

export default function ImmocloudApp() {
  return (
    <div className={`min-h-screen ${THEME.bg} ${THEME.text}`} data-testid="immocloud-app">
      <TopNav current="cloud" theme="light" suffix="cloud" />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
      </Routes>
      <FooterB2C />
    </div>
  );
}

/* =========================================================================
 *  HOME — hero search + facets + featured cards
 * ========================================================================= */
function HomePage() {
  const { t } = useTranslation();
  const [facets, setFacets] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [operation, setOperation] = useState("sale");
  const [city, setCity] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    fetch(`${API}/facets?operation=${operation}`)
      .then((r) => r.json()).then(setFacets).catch(() => {});
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
      {/* ───────── Hero ───────── */}
      <section className="relative px-5 sm:px-8 md:px-16 py-16 md:py-24" data-testid="cloud-hero">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-4">
            <Brand>ImmobilCloud</Brand>
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6 font-light"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            {t("immocloud.tagline")}
          </h1>
          <p className="text-base md:text-lg text-stone-600 max-w-2xl mb-10">
            {t("cloud.hero_subtitle")}
          </p>

          {/* Operation toggle */}
          <div className="inline-flex bg-white border border-stone-200 rounded-full p-1 mb-6 shadow-sm">
            <OpButton id="sale" active={operation === "sale"} onClick={() => setOperation("sale")}>
              {t("cloud.op_sale")}
            </OpButton>
            <OpButton id="rent" active={operation === "rent"} onClick={() => setOperation("rent")}>
              {t("cloud.op_rent")}
            </OpButton>
          </div>

          {/* Search box */}
          <form onSubmit={submit} className="bg-white rounded-2xl border border-stone-200 shadow-md p-3 flex flex-col md:flex-row gap-2 max-w-3xl">
            <input
              data-testid="cloud-search-city"
              type="text" value={city} onChange={(e) => setCity(e.target.value)}
              placeholder={t("cloud.search_placeholder")}
              list="cloud-cities-suggest"
              className="flex-1 px-4 py-3 text-base outline-none rounded-lg focus:bg-stone-50"
            />
            <datalist id="cloud-cities-suggest">
              {(facets?.cities || []).map((c) => <option key={c.city} value={c.city} />)}
            </datalist>
            <button
              data-testid="cloud-search-btn" type="submit"
              className={`${THEME.primary} ${THEME.primaryText} px-6 py-3 rounded-lg font-medium tracking-wide hover:opacity-90 transition`}
            >
              {t("cloud.search_btn")}
            </button>
          </form>

          {facets && (
            <p className="text-xs text-stone-500 mt-4" data-testid="cloud-total">
              {t("cloud.total_listings", { n: facets.total_active })}
            </p>
          )}
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
                  to={`search?operation=${operation}&city=${encodeURIComponent(c.city)}`}
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

function OpButton({ id, active, onClick, children }) {
  return (
    <button
      type="button" onClick={onClick} data-testid={`op-${id}`}
      className={`px-6 py-2 text-sm font-medium rounded-full transition ${
        active ? "bg-[#0B1E3F] text-white" : "text-stone-600 hover:text-stone-900"
      }`}>
      {children}
    </button>
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

  const filters = useMemo(() => ({
    operation: params.get("operation") || "sale",
    city: params.get("city") || "",
    property_type: params.get("property_type") || "",
    price_min: params.get("price_min") || "",
    price_max: params.get("price_max") || "",
    surface_min: params.get("surface_min") || "",
    rooms_min: params.get("rooms_min") || "",
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
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
            <h1 className="text-2xl md:text-3xl font-light tracking-tight"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              {filters.city ? t("cloud.results_in_city", { city: filters.city }) : t("cloud.all_results")}
            </h1>
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

          <p className="text-xs text-stone-500 mb-4" data-testid="results-count">
            {t("cloud.total_results", { n: data.total })}
          </p>

          {loading ? (
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

function FooterB2C() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-stone-200 mt-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-16 py-8 text-xs text-stone-500 flex flex-wrap items-center justify-between gap-3">
        <span>© 2026 <Brand>OMNIA Real Estate Ecosystem</Brand></span>
        <span>{t("cloud.footer_tagline")}</span>
      </div>
    </footer>
  );
}
