import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../../shared/components/LanguageSwitcher";
import HealthBadge from "../../shared/components/HealthBadge";

export default function ImmocloudApp() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);

  return (
    <div
      data-testid="immocloud-app"
      className="min-h-screen bg-[#0e1419] text-stone-100"
      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
    >
      <header className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-stone-800">
        <Link to={`/${lang}`} className="text-2xl tracking-tight font-medium">
          OMNIA<span className="text-stone-500">·</span>
          <span className="font-light">cloud</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-sans uppercase tracking-widest text-stone-400">
          <Link to={`/${lang}`} className="hover:text-stone-100">{t("nav.landing")}</Link>
          <LanguageSwitcher />
        </nav>
      </header>

      <section className="px-8 md:px-16 py-24 md:py-32 max-w-5xl">
        <p className="text-xs font-sans uppercase tracking-[0.3em] text-stone-500 mb-6">
          ImmobilCloud — B2C Portal
        </p>
        <h1 className="text-6xl md:text-8xl leading-none tracking-tight mb-10">
          {t("immocloud.tagline")}
        </h1>
        <p className="text-lg font-sans text-stone-400 max-w-2xl mb-12 leading-relaxed">
          {t("landing.pillar_cloud_desc")}
        </p>
        <div className="inline-flex items-center gap-4 border border-stone-700 px-6 py-3">
          <HealthBadge app="cloud" label="ImmobilCloud API" />
        </div>
      </section>

      <footer className="border-t border-stone-800 px-8 md:px-16 py-8 text-xs font-sans uppercase tracking-widest text-stone-600">
        © 2026 ImmobilCloud · Coming soon: M3
      </footer>
    </div>
  );
}
