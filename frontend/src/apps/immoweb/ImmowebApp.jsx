import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../../shared/components/LanguageSwitcher";
import HealthBadge from "../../shared/components/HealthBadge";

export default function ImmowebApp() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);

  return (
    <div
      data-testid="immoweb-app"
      className="min-h-screen bg-stone-100 text-stone-900"
      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
    >
      <header className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-stone-300 bg-white">
        <Link to={`/${lang}`} className="text-2xl tracking-tight font-medium">
          OMNIA<span className="text-stone-400">·</span>
          <span className="font-light">app</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-sans uppercase tracking-widest text-stone-600">
          <Link to={`/${lang}`} className="hover:text-stone-900">{t("nav.landing")}</Link>
          <a href="#login" className="hover:text-stone-900">{t("nav.login")}</a>
          <LanguageSwitcher />
        </nav>
      </header>

      <section className="px-8 md:px-16 py-24 md:py-32 max-w-5xl">
        <p className="text-xs font-sans uppercase tracking-[0.3em] text-amber-700 mb-6">
          ImmoWeb — B2B Agency CRM
        </p>
        <h1 className="text-6xl md:text-8xl leading-none tracking-tight mb-10 text-stone-900">
          {t("immoweb.tagline")}
        </h1>
        <p className="text-lg font-sans text-stone-600 max-w-2xl mb-12 leading-relaxed">
          {t("landing.pillar_app_desc")}
        </p>
        <div className="inline-flex items-center gap-4 bg-white border border-stone-300 px-6 py-3">
          <HealthBadge app="app" label="ImmoWeb API" />
        </div>
      </section>

      <footer className="border-t border-stone-300 px-8 md:px-16 py-8 text-xs font-sans uppercase tracking-widest text-stone-500">
        © 2026 ImmoWeb · Coming soon: M2
      </footer>
    </div>
  );
}
