import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import AgencyShell from "./components/AgencyShell";
import { api, API_BASE } from "../../shared/lib/api";
import { formatApiErrorDetail } from "../../shared/lib/auth";

function parseCSV(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n").filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const sep = (lines[0].match(/;/g) || []).length > (lines[0].match(/,/g) || []).length ? ";" : ",";
  const headers = lines[0].split(sep).map((h) => h.trim().replace(/^\ufeff/, "").replace(/^"|"$/g, ""));
  const rows = lines.slice(1).map((line) => {
    const values = line.split(sep).map((v) => v.trim().replace(/^"|"$/g, ""));
    const obj = {};
    headers.forEach((h, i) => (obj[h] = values[i] ?? ""));
    return obj;
  });
  return { headers, rows };
}

export default function ClientImportPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "it").slice(0, 2);
  const nav = useNavigate();
  const fileInput = useRef(null);

  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [filename, setFilename] = useState("");
  const [result, setResult] = useState(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");

  const downloadTemplate = async () => {
    const url = `${API_BASE}/app/clients/_template/csv`;
    const resp = await fetch(url, { credentials: "include" });
    const blob = await resp.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "omnia-clienti-template.csv";
    link.click();
  };

  const handleFile = (file) => {
    setError(""); setResult(null); setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { headers, rows } = parseCSV(e.target.result);
        setHeaders(headers); setRows(rows);
      } catch (err) {
        setError(t("client_import.parse_error", { msg: err.message }));
      }
    };
    reader.readAsText(file, "utf-8");
  };

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const doImport = async () => {
    setImporting(true); setError("");
    try {
      const { data } = await api.post("/app/clients/import/csv", { rows, filename });
      setResult(data);
    } catch (err) {
      setError(formatApiErrorDetail(err?.response?.data?.detail) || t("common.error"));
    } finally {
      setImporting(false);
    }
  };

  return (
    <AgencyShell current="clients">
      <section data-testid="client-import-page" className="max-w-4xl space-y-6">
        <div>
          <Link to={`/${lang}/app/clients`} className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900">
            ← {t("client_import.back_to_clients")}
          </Link>
          <h1 className="text-3xl md:text-4xl tracking-tight mt-2" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            {t("client_import.title")}
          </h1>
          <p className="text-stone-600 mt-1">{t("client_import.subtitle")}</p>
        </div>

        <div className="bg-stone-100 border border-stone-200 rounded-lg p-5 flex gap-3 items-start text-sm text-stone-700">
          <span className="text-base leading-none mt-0.5">◆</span>
          <div>
            <p className="font-medium mb-1">{t("client_import.intro_title")}</p>
            <p>{t("client_import.intro_text")}</p>
          </div>
        </div>

        <Step num="1" title={t("client_import.step1_title")} text={t("client_import.step1_text")}>
          <button
            data-testid="client-csv-template-btn"
            onClick={downloadTemplate}
            className="px-5 py-2.5 border border-stone-300 bg-white text-xs uppercase tracking-widest rounded-md hover:bg-stone-50"
          >
            {t("client_import.template_btn")}
          </button>
          <p className="text-xs text-stone-500 mt-2">{t("client_import.separator_hint")}</p>
        </Step>

        <Step num="2" title={t("client_import.step2_title")} text={t("client_import.step2_text")}>
          <div
            data-testid="client-csv-dropzone"
            onClick={() => fileInput.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center cursor-pointer hover:border-stone-500 hover:bg-stone-50 transition"
          >
            <p className="text-stone-700 font-medium">{t("client_import.drop_here")}</p>
            <p className="text-xs text-stone-500 mt-1">{t("client_import.or_click")}</p>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept=".csv,text/csv"
            data-testid="client-csv-file-input"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
          {filename && <p className="text-xs text-stone-600 mt-2">📄 {filename} · {rows.length} righe</p>}
          {error && (
            <p data-testid="client-csv-error" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 mt-3">
              {error}
            </p>
          )}
        </Step>

        {rows.length > 0 && !result && (
          <Step num="3" title={t("client_import.step3_title")} text="">
            <div className="bg-white border border-stone-200 rounded-lg p-4 mb-4">
              <p className="text-xs uppercase tracking-widest text-stone-500 mb-2">
                {t("client_import.preview_title", { count: rows.length })}
              </p>
              <div className="overflow-auto max-h-64">
                <table className="text-xs w-full" data-testid="client-csv-preview-table">
                  <thead className="bg-stone-50 sticky top-0">
                    <tr>
                      {headers.slice(0, 6).map((h) => (
                        <th key={h} className="text-left px-2 py-1.5 font-medium text-stone-600">{h}</th>
                      ))}
                      {headers.length > 6 && <th className="text-left px-2 py-1.5 text-stone-400">…</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-t border-stone-100">
                        {headers.slice(0, 6).map((h) => (
                          <td key={h} className="px-2 py-1.5 text-stone-700 truncate max-w-[150px]">{row[h]}</td>
                        ))}
                        {headers.length > 6 && <td className="px-2 py-1.5 text-stone-400">…</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <button
              data-testid="client-csv-import-btn"
              onClick={doImport}
              disabled={importing}
              className="px-6 py-3 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest font-medium rounded-md hover:bg-stone-700 disabled:opacity-50"
            >
              {importing ? t("client_import.importing") : t("client_import.import_btn", { count: rows.length })}
            </button>
          </Step>
        )}

        {result && (
          <div
            data-testid="client-csv-result"
            className="bg-white border border-stone-300 rounded-lg p-6"
          >
            <h3 className="font-semibold text-stone-900 text-lg mb-2">
              ✓ {t("client_import.done_title")}
            </h3>
            <p className="text-stone-700 mb-2">
              {t("client_import.done_imported", { imported: result.imported, total: result.total_rows })}
            </p>
            {result.errors?.length > 0 && (
              <details className="text-sm text-stone-700 mt-2">
                <summary className="cursor-pointer font-medium">
                  ⚠ {t("client_import.done_errors", { count: result.errors.length })}
                </summary>
                <ul className="mt-2 ml-4 list-disc">
                  {result.errors.slice(0, 10).map((e, i) => (
                    <li key={i}>{t("client_import.error_row", { row: e.row, message: e.message })}</li>
                  ))}
                </ul>
              </details>
            )}
            <button
              onClick={() => nav(`/${lang}/app/clients`)}
              className="mt-4 px-5 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest rounded-md hover:bg-stone-700"
            >
              {t("client_import.go_to_list")}
            </button>
          </div>
        )}
      </section>
    </AgencyShell>
  );
}

function Step({ num, title, text, children }) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center font-semibold text-sm">
          {num}
        </span>
        <div className="flex-1">
          <h3 className="font-semibold text-stone-900 mb-1">{title}</h3>
          {text && <p className="text-sm text-stone-600 mb-3">{text}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
