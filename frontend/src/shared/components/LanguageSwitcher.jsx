import React from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGS } from "../i18n/config";

const LANG_LABELS = { it: "IT", en: "EN", es: "ES" };

/**
 * Minimal language switcher: dropdown with IT / EN / ES.
 * Stores choice in localStorage via i18n config.
 */
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = (i18n.language || "it").slice(0, 2);

  const change = (e) => {
    const next = e.target.value;
    i18n.changeLanguage(next);
    // Update URL prefix if present
    const segments = window.location.pathname.split("/").filter(Boolean);
    if (SUPPORTED_LANGS.includes(segments[0])) {
      segments[0] = next;
    } else {
      segments.unshift(next);
    }
    const newPath = "/" + segments.join("/");
    window.history.replaceState({}, "", newPath + window.location.search);
  };

  return (
    <select
      data-testid="lang-switcher"
      value={current}
      onChange={change}
      className="bg-transparent border border-stone-400 rounded px-2 py-1 text-sm font-medium tracking-wider cursor-pointer hover:bg-stone-100 transition"
      aria-label="Language selector"
    >
      {SUPPORTED_LANGS.map((l) => (
        <option key={l} value={l}>
          {LANG_LABELS[l]}
        </option>
      ))}
    </select>
  );
}
