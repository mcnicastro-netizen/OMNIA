import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../../shared/components/LanguageSwitcher";
import HealthBadge from "../../shared/components/HealthBadge";

/**
 * OMNIA Landing — minimal commercial page introducing the 3 pillars.
 * Design: editorial/serif heavy, asymmetric, low-key — no AI slop.
 */
export default function LandingApp() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);

  const pillars = [
    {
      key: "cloud",
      title: t("landing.pillar_cloud_title"),
      desc: t("landing.pillar_cloud_desc"),
      to: `/${lang}/cloud`,
      tag: "B2C",
    },
    {
      key: "app",
      title: t("landing.pillar_app_title"),
      desc: t("landing.pillar_app_desc"),
      to: `/${lang}/app`,
      tag: "B2B",
    },
    {
      key: "learn",
      title: t("landing.pillar_learn_title"),
      desc: t("landing.pillar_learn_desc"),
      to: `/${lang}/learn`,
      tag: "LMS",
    },
  ];

  return (
    <div
      data-testid="landing-app"
      className="min-h-screen bg-stone-50 text-stone-900"
      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
    >
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-stone-200">
        <div className="text-2xl tracking-tight font-medium">
          OMNIA<span className="text-stone-400">.</span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-sans uppercase tracking-widest text-stone-600">
          <Link to={`/${lang}/cloud`} className="hover:text-stone-900">
            {t("nav.immocloud")}
          </Link>
          <Link to={`/${lang}/app`} className="hover:text-stone-900">
            {t("nav.immoweb")}
          </Link>
          <Link to={`/${lang}/learn`} className="hover:text-stone-900">
            {t("nav.academy")}
          </Link>
          <LanguageSwitcher />
        </nav>
      </header>

      {/* Hero */}
      <section className="px-8 md:px-16 py-24 md:py-32 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-7">
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-stone-500 mb-6">
            Real estate · Ecosystem · 2026
          </p>
          <h1 className="text-5xl md:text-7xl leading-[1.05] tracking-tight mb-8">
            {t("landing.hero_title")}
          </h1>
          <p className="text-xl md:text-2xl font-light text-stone-600 mb-12 max-w-xl">
            {t("landing.hero_subtitle")}
          </p>
          <a
            data-testid="landing-cta"
            href={`/${lang}/cloud`}
            className="inline-block bg-stone-900 text-stone-50 px-8 py-4 text-sm font-sans uppercase tracking-widest hover:bg-stone-700 transition"
          >
            {t("landing.hero_cta")} →
          </a>
        </div>
        <aside className="md:col-span-5 md:pt-10">
          <div className="border-l border-stone-300 pl-6 space-y-3 text-sm font-sans text-stone-600">
            <p className="uppercase tracking-widest text-stone-400 text-xs mb-4">
              System status
            </p>
            <HealthBadge app="global" label="API" />
            <HealthBadge app="cloud" label="ImmobilCloud" />
            <HealthBadge app="app" label="ImmoWeb" />
            <HealthBadge app="learn" label="Academy" />
          </div>
        </aside>
      </section>

      {/* Pillars */}
      <section className="px-8 md:px-16 pb-32 grid md:grid-cols-3 gap-8 md:gap-12">
        {pillars.map((p) => (
          <Link
            key={p.key}
            to={p.to}
            data-testid={`pillar-${p.key}`}
            className="group block p-8 bg-white border border-stone-200 hover:border-stone-900 transition"
          >
            <p className="text-xs font-sans uppercase tracking-[0.3em] text-stone-400 mb-4">
              {p.tag}
            </p>
            <h2 className="text-3xl tracking-tight mb-3 group-hover:translate-x-1 transition-transform">
              {p.title}
            </h2>
            <p className="text-stone-600 leading-relaxed font-sans text-base">
              {p.desc}
            </p>
            <span className="inline-block mt-6 text-sm font-sans uppercase tracking-widest text-stone-900">
              {t("common.next")} →
            </span>
          </Link>
        ))}
      </section>

      <footer className="border-t border-stone-200 px-8 md:px-16 py-8 text-xs font-sans uppercase tracking-widest text-stone-500 flex justify-between">
        <span>© 2026 OMNIA Real Estate Ecosystem</span>
        <span>omniarealestateecosystem.it</span>
      </footer>
    </div>
  );
}
