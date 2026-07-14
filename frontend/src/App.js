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
import ErrorBoundary from "@/shared/components/ErrorBoundary";

import LandingApp from "@/apps/landing/LandingApp";
import AgenziesLandingPage from "@/apps/landing/AgenziesLandingPage";
import WidgetsShowcasePage from "@/pages/WidgetsShowcasePage";
import ImmocloudApp from "@/apps/immocloud/ImmocloudApp";
import ImmowebApp from "@/apps/immoweb/ImmowebApp";
import DashboardPage from "@/apps/immoweb/DashboardPage";
import OnboardingWizard from "@/apps/immoweb/OnboardingWizard";
import MembersPage from "@/apps/immoweb/MembersPage";
import SettingsPage from "@/apps/immoweb/SettingsPage";
import PropertiesPage from "@/apps/immoweb/PropertiesPage";
import PropertyFormPage from "@/apps/immoweb/PropertyFormPage";
import PropertyImportPage from "@/apps/immoweb/PropertyImportPage";
import ClientsPage from "@/apps/immoweb/ClientsPage";
import ClientFormPage from "@/apps/immoweb/ClientFormPage";
import ClientImportPage from "@/apps/immoweb/ClientImportPage";
import MatchesPage from "@/apps/immoweb/MatchesPage";
import MatchLeadScorePage from "@/apps/immoweb/MatchLeadScorePage";
import PortalsPage from "@/apps/immoweb/PortalsPage";
import WebsitePage from "@/apps/immoweb/WebsitePage";
import ModerationPage from "@/apps/immoweb/ModerationPage";
import VirtualStagingPage from "@/apps/immoweb/pages/VirtualStagingPage";
import FascicoloPage from "@/apps/immoweb/pages/FascicoloPage";
import MutuiToolPage from "@/apps/immoweb/pages/MutuiToolPage";
import GroupPage from "@/apps/immoweb/pages/GroupPage";
import ApiKeysPage from "@/apps/immoweb/pages/ApiKeysPage";
import AcademyApp from "@/apps/academy/AcademyApp";
import LegalApp from "@/apps/legal/LegalApp";

import LoginPage from "@/apps/auth/LoginPage";
import RegisterPage from "@/apps/auth/RegisterPage";
import ForgotPasswordPage from "@/apps/auth/ForgotPasswordPage";
import AcceptInvitePage from "@/apps/auth/AcceptInvitePage";
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
        <ErrorBoundary>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route
            path="/:lang/*"
            element={
              <LangSync>
                <Routes>
                  <Route index element={<LandingApp />} />

                  {/* Founders 50 — landing for B2B agencies */}
                  <Route path="agenzie" element={<AgenziesLandingPage />} />

                  {/* M2.5.3 — Track B widgets showcase (public) */}
                  <Route path="widgets" element={<WidgetsShowcasePage />} />

                  {/* Auth pages (public) */}
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="accept-invite" element={<AcceptInvitePage />} />

                  {/* B2C portal */}
                  <Route path="cloud/*" element={<ImmocloudApp />} />

                  {/* B2B agency app */}
                  <Route path="app" element={<ImmowebApp />} />
                  <Route
                    path="app/onboarding"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin"]}>
                        <OnboardingWizard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="app/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "agent"]}>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="app/group"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "group_admin"]}>
                        <GroupPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="app/api-keys"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "group_admin", "branch_admin"]}>
                        <ApiKeysPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="app/members"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "agent"]}>
                        <MembersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="app/settings"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin"]}>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="app/properties"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "agent"]}>
                        <PropertiesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="app/properties/import"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "agent"]}>
                        <PropertyImportPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="app/properties/new"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "agent"]}>
                        <PropertyFormPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="app/mutui"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "agent"]}>
                        <MutuiToolPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="app/properties/:id/fascicolo"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "agent"]}>
                        <FascicoloPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="app/properties/:id"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "agent"]}>
                        <PropertyFormPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Clients (CRM) */}
                  <Route
                    path="app/clients"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "agent"]}>
                        <ClientsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="app/clients/new"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "agent"]}>
                        <ClientFormPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="app/clients/import"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "agent"]}>
                        <ClientImportPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="app/clients/:id"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "agent"]}>
                        <ClientFormPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Matches (M2.S4) */}
                  <Route
                    path="app/matches"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "agent"]}>
                        <MatchesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="app/matches/lead"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "agent"]}>
                        <MatchLeadScorePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Portals (M2.S5 Layer A) */}
                  <Route
                    path="app/portals"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin"]}>
                        <PortalsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Website / Brand Studio (M2.S5 Layer D) */}
                  <Route
                    path="app/website"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin"]}>
                        <WebsitePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Virtual Staging (M5.S4.1) — arreda foto vuote con AI */}
                  <Route
                    path="app/staging"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "agency_admin", "agent"]}>
                        <VirtualStagingPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Moderation (M3.S5 v2) — admin reviews B2C private listings */}
                  <Route
                    path="app/moderation"
                    element={
                      <ProtectedRoute allowedRoles={["super_admin", "platform_admin", "admin"]}>
                        <ModerationPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Academy */}
                  <Route path="learn/*" element={<AcademyApp />} />

                  {/* AL Legal (M5.S3) — accessible to all authenticated users (agents + B2C) */}
                  <Route
                    path="legal"
                    element={
                      <ProtectedRoute>
                        <LegalApp />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </LangSync>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
