import React from "react";
import "@/App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import "@/shared/i18n/config";
import { SUPPORTED_LANGS, DEFAULT_LANG } from "@/shared/i18n/config";
import { AuthProvider } from "@/shared/lib/auth";

import LandingApp from "@/apps/landing/LandingApp";
import ImmocloudApp from "@/apps/immocloud/ImmocloudApp";
import ImmowebApp from "@/apps/immoweb/ImmowebApp";
import DashboardPage from "@/apps/immoweb/DashboardPage";
import AcademyApp from "@/apps/academy/AcademyApp";

import LoginPage from "@/apps/auth/LoginPage";
import RegisterPage from "@/apps/auth/RegisterPage";
import ForgotPasswordPage from "@/apps/auth/ForgotPasswordPage";
import ProtectedRoute from "@/shared/components/ProtectedRoute";

function LangSync({ children }) {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  useEffect(() => {
    if (lang && SUPPORTED_LANGS.includes(lang)) {
      if (i18n.language?.slice(0, 2) !== lang) i18n.changeLanguage(lang);
      document.documentElement.lang = lang;
    }
  }, [lang, i18n]);
  return children;
}

function RootRedirect() {
  const { i18n } = useTranslation();
  const detected = (i18n.language || DEFAULT_LANG).slice(0, 2);
  const lang = SUPPORTED_LANGS.includes(detected) ? detected : DEFAULT_LANG;
  return <Navigate to={`/${lang}`} replace />;
}

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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route
            path="/:lang/*"
            element={
              <LangSync>
                <Routes>
                  <Route index element={<LandingApp />} />

                  {/* Auth pages (public) */}
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />

                  {/* B2C portal */}
                  <Route path="cloud/*" element={<ImmocloudApp />} />

                  {/* B2B agency app */}
                  <Route path="app" element={<ImmowebApp />} />
                  <Route
                    path="app/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "agent"]}>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Academy */}
                  <Route path="learn/*" element={<AcademyApp />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </LangSync>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
