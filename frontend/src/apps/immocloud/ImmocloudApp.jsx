import React from "react";
import { useTranslation } from "react-i18next";
import HealthBadge from "../../shared/components/HealthBadge";
import TopNav from "../../shared/components/TopNav";
import Brand from "../../shared/components/Brand";

export default function ImmocloudApp() {
  const { t } = useTranslation();

  return (
    <div
      data-testid="immocloud-app"
      className="min-h-screen bg-[#0e1419] text-stone-100 overflow-x-hidden"
      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
    >
      <TopNav current="cloud" theme="dark" suffix="cloud" />

      <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-24 max-w-screen-2xl mx-auto">
        <div className="max-w-5xl">
          <p className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.3em] text-stone-500 mb-4 md:mb-6">
            <Brand>ImmobilCloud — B2C Portal</Brand>
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-8 md:mb-10 break-words">
            {t("immocloud.tagline")}
          </h1>
          <p className="text-base sm:text-lg font-sans text-stone-400 max-w-2xl mb-8 md:mb-12 leading-relaxed">
            {t("landing.pillar_cloud_desc")}
          </p>
          <div className="inline-flex items-center gap-4 border border-stone-700 px-4 sm:px-6 py-3 max-w-full">
            <HealthBadge app="cloud" label="ImmobilCloud API" />
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-800">
        <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-6 md:py-8 text-[10px] sm:text-xs font-sans uppercase tracking-widest text-stone-600">
          © 2026 <Brand>ImmobilCloud</Brand> · Coming soon: M3
        </div>
      </footer>
    </div>
  );
}
