import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, formatApiErrorDetail } from "../../shared/lib/auth";
import LanguageSwitcher from "../../shared/components/LanguageSwitcher";
import Brand from "../../shared/components/Brand";

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);
  const { register } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent",
    existing_domain: "",
  });
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const isAgencyRole = form.role === "agent" || form.role === "agency_admin";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (isAgencyRole && !policyAccepted) {
      setError(t("domain_vault.policy_required_error"));
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        lang,
      };
      if (isAgencyRole) {
        payload.domain_sovereignty_confirmed = policyAccepted;
        if (form.existing_domain.trim()) {
          payload.existing_domain = form.existing_domain.trim();
        }
      }
      await register(payload);
      nav(`/${lang}/app/dashboard`, { replace: true });
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-testid="register-page"
      className="min-h-screen bg-stone-100 text-stone-900 flex flex-col"
      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
    >
      <header className="flex items-center justify-between px-5 sm:px-8 md:px-12 py-5 border-b border-stone-300 bg-white">
        <Link to={`/${lang}`} className="text-xl md:text-2xl tracking-tight font-medium">
          <Brand>OMNIA</Brand><span className="text-stone-400">·</span>
          <Brand className="font-light">app</Brand>
        </Link>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <form
          onSubmit={submit}
          data-testid="register-form"
          className="w-full max-w-md bg-white border border-stone-300 p-8 md:p-10"
        >
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-amber-700 mb-3">
            <Brand>Join OMNIA</Brand>
          </p>
          <h1 className="text-3xl md:text-4xl tracking-tight mb-8">{t("auth.register_title")}</h1>

          {["name", "email", "password"].map((f) => (
            <label key={f} className="block mb-5">
              <span className="block text-xs font-sans uppercase tracking-widest text-stone-500 mb-2">
                {t(`auth.${f}`)}
              </span>
              <input
                data-testid={`register-${f}`}
                type={f === "email" ? "email" : f === "password" ? "password" : "text"}
                required
                value={form[f]}
                onChange={set(f)}
                className="w-full px-4 py-3 border border-stone-300 bg-stone-50 font-sans text-base focus:outline-none focus:border-stone-900"
              />
            </label>
          ))}

          <label className="block mb-6">
            <span className="block text-xs font-sans uppercase tracking-widest text-stone-500 mb-2">
              {t("auth.role")}
            </span>
            <select
              data-testid="register-role"
              value={form.role}
              onChange={set("role")}
              className="w-full px-4 py-3 border border-stone-300 bg-stone-50 font-sans text-base focus:outline-none focus:border-stone-900"
            >
              <option value="agent">{t("auth.role_agent")}</option>
              <option value="agency_admin">{t("auth.role_agency_admin")}</option>
              <option value="client">{t("auth.role_client")}</option>
              <option value="student">{t("auth.role_student")}</option>
            </select>
          </label>

          {isAgencyRole && (
            <div
              data-testid="domain-vault-block"
              className="mb-6 border border-emerald-800/30 bg-emerald-50/60 p-5"
              style={{ borderLeftWidth: "3px", borderLeftColor: "#1F6B5C" }}
            >
              <div className="flex items-start gap-3 mb-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1F6B5C] text-white text-sm shrink-0"
                  data-testid="domain-vault-badge-icon"
                >
                  🛡️
                </span>
                <div>
                  <p
                    data-testid="domain-vault-badge"
                    className="text-sm md:text-base font-medium tracking-tight text-[#0B1E3F]"
                  >
                    {t("domain_vault.badge")}
                  </p>
                  <p className="text-xs font-sans text-stone-600 mt-1">
                    {t("domain_vault.badge_subtitle")}
                  </p>
                </div>
              </div>

              <label className="block mb-3">
                <span className="block text-xs font-sans uppercase tracking-widest text-stone-500 mb-2">
                  {t("domain_vault.existing_domain_label")}
                </span>
                <input
                  data-testid="register-existing-domain"
                  type="text"
                  value={form.existing_domain}
                  onChange={set("existing_domain")}
                  placeholder={t("domain_vault.existing_domain_placeholder")}
                  className="w-full px-4 py-3 border border-stone-300 bg-white font-sans text-base focus:outline-none focus:border-stone-900"
                />
                <span className="mt-2 block text-xs font-sans text-stone-500">
                  {t("domain_vault.existing_domain_help")}{" "}
                  <Link
                    to={`/${lang}/verifica-dominio`}
                    className="underline text-[#1F6B5C] hover:text-[#0B1E3F]"
                    data-testid="domain-vault-verify-link"
                  >
                    {t("domain_vault.existing_domain_verify_cta")} →
                  </Link>
                </span>
              </label>

              <label
                className="flex items-start gap-3 mt-4 cursor-pointer"
                data-testid="domain-vault-policy-label"
              >
                <input
                  type="checkbox"
                  data-testid="register-policy-checkbox"
                  checked={policyAccepted}
                  onChange={(e) => setPolicyAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#1F6B5C]"
                />
                <span className="text-xs font-sans text-stone-700 leading-relaxed">
                  <Trans
                    i18nKey="domain_vault.policy_checkbox"
                    components={{
                      policy: (
                        <Link
                          to={`/${lang}/domain-sovereignty-policy`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-[#0B1E3F] hover:text-[#1F6B5C]"
                          data-testid="domain-vault-policy-link"
                        />
                      ),
                    }}
                  />
                </span>
              </label>
            </div>
          )}

          {error && (
            <div data-testid="register-error" className="mb-5 p-3 border border-red-300 bg-red-50 text-red-700 text-sm font-sans">
              {error}
            </div>
          )}

          <button
            data-testid="register-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-stone-50 px-6 py-4 text-xs sm:text-sm font-sans uppercase tracking-widest hover:bg-stone-700 transition disabled:opacity-50"
          >
            {loading ? t("common.loading") : t("auth.register_cta")} →
          </button>

          <p className="mt-8 pt-6 border-t border-stone-200 text-sm font-sans text-stone-600">
            {t("auth.have_account")}{" "}
            <Link to={`/${lang}/login`} className="text-stone-900 underline">
              {t("auth.login_now")}
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
