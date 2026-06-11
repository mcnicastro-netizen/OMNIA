import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../../shared/components/LanguageSwitcher";
import HealthBadge from "../../shared/components/HealthBadge";
import MobileNav from "../../shared/components/MobileNav";

export default function ImmocloudApp() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);

  const navLinks = [{ to: `/${lang}`, label: t("nav.landing") }];

  return (
    <div
      data-testid="immocloud-app"
      className="min-h-screen bg-[#0e1419] text-stone-100"
      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
    >
      <header className="flex items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16 py-5 md:py-6 border-b border-stone-800">
        <Link to={`/${lang}`} className="text-xl md:text-2xl tracking-tight font-medium">
          OMNIA<span className="text-stone-500">·</span>
          <span className="font-light">cloud</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-sans uppercase tracking-widest text-stone-400">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-stone-100">{l.label}</Link>
          ))}
          <LanguageSwitcher />
        </nav>
        <MobileNav lang={lang} links={navLinks} theme="dark" />
      </header>

      <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-28 max-w-5xl">
        <p className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.3em] text-stone-500 mb-4 md:mb-6">
          ImmobilCloud — B2C Portal
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl leading-none tracking-tight mb-8 md:mb-10 break-words">
          {t("immocloud.tagline")}
        </h1>
        <p className="text-base sm:text-lg font-sans text-stone-400 max-w-2xl mb-8 md:mb-12 leading-relaxed">
          {t("landing.pillar_cloud_desc")}
        </p>
        <div className="inline-flex items-center gap-4 border border-stone-700 px-4 sm:px-6 py-3">
          <HealthBadge app="cloud" label="ImmobilCloud API" />
        </div>
      </section>

      <footer className="border-t border-stone-800 px-5 sm:px-8 md:px-12 lg:px-16 py-6 md:py-8 text-[10px] sm:text-xs font-sans uppercase tracking-widest text-stone-600">
        © 2026 ImmobilCloud · Coming soon: M3
      </footer>
    </div>
  );
}
