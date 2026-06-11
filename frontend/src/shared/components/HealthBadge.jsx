import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";

/**
 * HealthBadge: small UI widget that hits the backend health endpoint
 * for a specific app and shows green/red dot + label.
 *
 * Props:
 *   - app: "core" | "cloud" | "app" | "learn"
 *   - label: optional override
 */
export default function HealthBadge({ app, label }) {
  const { t, i18n } = useTranslation();
  const [status, setStatus] = useState("checking"); // checking | ok | error
  const [detail, setDetail] = useState("");

  useEffect(() => {
    let mounted = true;
    const url = app === "global" ? "/health" : `/${app}/health`;
    api
      .get(url)
      .then((r) => {
        if (!mounted) return;
        setStatus("ok");
        setDetail(r.data?.message?.text || "");
      })
      .catch(() => {
        if (!mounted) return;
        setStatus("error");
        setDetail(t("health.error"));
      });
    return () => {
      mounted = false;
    };
  }, [app, i18n.language, t]);

  const dot =
    status === "ok"
      ? "bg-emerald-500"
      : status === "error"
      ? "bg-red-500"
      : "bg-amber-400 animate-pulse";

  return (
    <div
      data-testid={`health-badge-${app}`}
      className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-stone-700"
    >
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      <span>{label || app}</span>
      {detail && <span className="text-stone-500">— {detail}</span>}
    </div>
  );
}
