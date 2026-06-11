import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../../shared/components/LanguageSwitcher";
import HealthBadge from "../../shared/components/HealthBadge";

export default function AcademyApp() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);

  return (
    <div
      data-testid="academy-app"
      className="min-h-screen bg-[#fdf6e3] text-stone-900"
      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
    >
      <header className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-amber-900/20">
        <Link to={`/${lang}`} className="text-2xl tracking-tight font-medium">
          OMNIA<span className="text-amber-700">·</span>
          <span className="font-light">learn</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-sans uppercase tracking-widest text-stone-700">
          <Link to={`/${lang}`} className="hover:text-amber-700">{t("nav.landing")}</Link>
          <LanguageSwitcher />
        </nav>
      </header>

      <section className="px-8 md:px-16 py-24 md:py-32 max-w-5xl">
        <p className="text-xs font-sans uppercase tracking-[0.3em] text-amber-800 mb-6">
          Omnia Academy — Agent Training
        </p>
        <h1 className="text-6xl md:text-8xl leading-none tracking-tight mb-10">
          {t("academy.tagline")}
        </h1>
        <p className="text-lg font-sans text-stone-700 max-w-2xl mb-12 leading-relaxed">
          {t("landing.pillar_learn_desc")}
        </p>
        <div className="inline-flex items-center gap-4 bg-white/60 border border-amber-900/20 px-6 py-3">
          <HealthBadge app="learn" label="Academy API" />
        </div>
      </section>

      <footer className="border-t border-amber-900/20 px-8 md:px-16 py-8 text-xs font-sans uppercase tracking-widest text-stone-600">
        © 2026 Omnia Academy · Coming soon: M6
      </footer>
    </div>
  );
}
