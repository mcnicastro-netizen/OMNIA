import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../../shared/components/LanguageSwitcher";
import HealthBadge from "../../shared/components/HealthBadge";
import MobileNav from "../../shared/components/MobileNav";
import Brand from "../../shared/components/Brand";

export default function ImmowebApp() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);

  const navLinks = [
    { to: `/${lang}`, label: t("nav.landing") },
    { to: "#login", label: t("nav.login") },
  ];

  return (
    <div
      data-testid="immoweb-app"
      className="min-h-screen bg-stone-100 text-stone-900"
      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
    >
      <header className="flex items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16 py-5 md:py-6 border-b border-stone-300 bg-white">
        <Link to={`/${lang}`} className="text-xl md:text-2xl tracking-tight font-medium">
          <Brand>OMNIA</Brand><span className="text-stone-400">·</span>
          <Brand className="font-light">app</Brand>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-sans uppercase tracking-widest text-stone-600">
          {navLinks.map((l) =>
            l.to.startsWith("#") ? (
              <a key={l.to} href={l.to} className="hover:text-stone-900">{l.label}</a>
            ) : (
              <Link key={l.to} to={l.to} className="hover:text-stone-900">{l.label}</Link>
            )
          )}
          <LanguageSwitcher />
        </nav>
        <MobileNav lang={lang} links={navLinks} theme="light" />
      </header>

      <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-28 max-w-5xl">
        <p className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.3em] text-amber-700 mb-4 md:mb-6">
          <Brand>ImmoWeb — B2B Agency CRM</Brand>
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl leading-none tracking-tight mb-8 md:mb-10 text-stone-900 break-words">
          {t("immoweb.tagline")}
        </h1>
        <p className="text-base sm:text-lg font-sans text-stone-600 max-w-2xl mb-8 md:mb-12 leading-relaxed">
          {t("landing.pillar_app_desc")}
        </p>
        <div className="inline-flex items-center gap-4 bg-white border border-stone-300 px-4 sm:px-6 py-3">
          <HealthBadge app="app" label="ImmoWeb API" />
        </div>
      </section>

      <footer className="border-t border-stone-300 px-5 sm:px-8 md:px-12 lg:px-16 py-6 md:py-8 text-[10px] sm:text-xs font-sans uppercase tracking-widest text-stone-500">
        © 2026 <Brand>ImmoWeb</Brand> · Coming soon: M2
      </footer>
    </div>
  );
}
