import React, { useEffect } from "react";
import "@/App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

// i18n bootstrap (side-effect import)
import "@/shared/i18n/config";
import { SUPPORTED_LANGS, DEFAULT_LANG } from "@/shared/i18n/config";

import LandingApp from "@/apps/landing/LandingApp";
import ImmocloudApp from "@/apps/immocloud/ImmocloudApp";
import ImmowebApp from "@/apps/immoweb/ImmowebApp";
import AcademyApp from "@/apps/academy/AcademyApp";

/**
 * LangGuard: syncs i18n language with the :lang URL param on every navigation.
 * If :lang is missing or unsupported it redirects to the detected default.
 */
function LangSync({ children }) {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && SUPPORTED_LANGS.includes(lang)) {
      if (i18n.language?.slice(0, 2) !== lang) {
        i18n.changeLanguage(lang);
      }
    }
  }, [lang, i18n]);

  return children;
}

/**
 * RootRedirect: when the user hits "/" we redirect to "/{detectedLang}/".
 */
function RootRedirect() {
  const { i18n } = useTranslation();
  const detected = (i18n.language || DEFAULT_LANG).slice(0, 2);
  const lang = SUPPORTED_LANGS.includes(detected) ? detected : DEFAULT_LANG;
  return <Navigate to={`/${lang}`} replace />;
}

/**
 * NotFound fallback (keeps language prefix if available).
 */
function NotFound() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);
  return (
    <div
      data-testid="not-found"
      className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-900 p-8"
      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
    >
      <h1 className="text-7xl tracking-tight mb-4">404</h1>
      <p className="text-stone-600 mb-8 font-sans">
        {t("common.error")} — <code>{location.pathname}</code>
      </p>
      <a
        href={`/${lang}`}
        className="text-sm font-sans uppercase tracking-widest bg-stone-900 text-stone-50 px-6 py-3 hover:bg-stone-700"
      >
        ← {t("nav.landing")}
      </a>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* "/" → redirect to detected language */}
        <Route path="/" element={<RootRedirect />} />

        {/* "/:lang/*" → language-scoped routes */}
        <Route
          path="/:lang/*"
          element={
            <LangSync>
              <Routes>
                <Route index element={<LandingApp />} />
                <Route path="cloud/*" element={<ImmocloudApp />} />
                <Route path="app/*" element={<ImmowebApp />} />
                <Route path="learn/*" element={<AcademyApp />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LangSync>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
