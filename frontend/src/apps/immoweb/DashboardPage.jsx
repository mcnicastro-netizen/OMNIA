import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/lib/auth";
import LanguageSwitcher from "../../shared/components/LanguageSwitcher";
import HealthBadge from "../../shared/components/HealthBadge";
import Brand from "../../shared/components/Brand";

/**
 * ImmoWeb Dashboard — first authenticated page for the agency CRM.
 * In M2 this will be expanded with KPIs, lists, etc.
 */
export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const onLogout = async () => {
    await logout();
    nav(`/${lang}/login`, { replace: true });
  };

  return (
    <div
      data-testid="dashboard-page"
      className="min-h-screen bg-stone-100 text-stone-900"
      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
    >
      <header className="flex items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16 py-5 border-b border-stone-300 bg-white">
        <Link to={`/${lang}`} className="text-xl md:text-2xl tracking-tight font-medium">
          <Brand>OMNIA</Brand><span className="text-stone-400">·</span>
          <Brand className="font-light">app</Brand>
        </Link>
        <div className="flex items-center gap-4 md:gap-6 text-sm font-sans">
          <span className="hidden sm:inline text-stone-600">
            {user?.name} · <Brand className="uppercase text-xs tracking-widest">{user?.role}</Brand>
          </span>
          <button
            data-testid="logout-btn"
            onClick={onLogout}
            className="text-xs font-sans uppercase tracking-widest text-stone-600 hover:text-stone-900"
          >
            {t("auth.logout")} →
          </button>
          <LanguageSwitcher />
        </div>
      </header>

      <section className="px-5 sm:px-8 md:px-12 lg:px-16 py-12 md:py-16">
        <p className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.3em] text-amber-700 mb-4">
          <Brand>Dashboard — Coming soon: M2</Brand>
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4">
          {t("auth.welcome_back")}, {user?.name}.
        </h1>
        <p className="text-base sm:text-lg font-sans text-stone-600 max-w-2xl mb-10">
          {t("dashboard.placeholder")}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
          <div className="p-5 md:p-6 bg-white border border-stone-300">
            <p className="text-xs font-sans uppercase tracking-widest text-stone-500 mb-2">
              {t("dashboard.your_role")}
            </p>
            <p className="text-2xl tracking-tight">
              <Brand>{user?.role}</Brand>
            </p>
          </div>
          <div className="p-5 md:p-6 bg-white border border-stone-300">
            <p className="text-xs font-sans uppercase tracking-widest text-stone-500 mb-2">
              {t("dashboard.agencies")}
            </p>
            <p className="text-2xl tracking-tight">{user?.agency_ids?.length || 0}</p>
          </div>
          <div className="p-5 md:p-6 bg-white border border-stone-300">
            <p className="text-xs font-sans uppercase tracking-widest text-stone-500 mb-2">
              {t("dashboard.system")}
            </p>
            <HealthBadge app="app" label="ImmoWeb API" />
          </div>
        </div>
      </section>
    </div>
  );
}
