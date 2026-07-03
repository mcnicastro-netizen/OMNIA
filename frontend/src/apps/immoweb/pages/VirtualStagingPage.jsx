/*
 * OMNIA — M5.S4.1 Virtual Staging page (agent tool)
 *
 * Pipeline 3-stage (SAM2 → Flux inpaint → Real-ESRGAN) with live progress.
 * Watermark "Render virtuale OMNIA" applied on server-side download (AGCM 2024 + Art. 21 Codice Consumo).
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../../shared/lib/api";
import AgencyShell from "../components/AgencyShell";

const POLL_INTERVAL = 3500;
const MAX_MB = 12;

const STAGE_LABELS = {
  sam2_mask: "1 · Segmentazione stanza (SAM 2)",
  flux_inpaint: "2 · Arredamento AI (Flux)",
  upscale: "3 · Upscale 4x (Real-ESRGAN)",
};

const STAGE_STATUS_LABEL = {
  queued: "In coda",
  running: "Elaborazione...",
  done: "Completato",
  failed: "Errore",
};

export default function VirtualStagingPage() {
  const { t } = useTranslation();
  const [styles, setStyles] = useState({ styles: [], room_types: [] });
  const [selectedStyle, setSelectedStyle] = useState("modern");
  const [selectedRoom, setSelectedRoom] = useState("living");
  const [uploading, setUploading] = useState(false);
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourcePreview, setSourcePreview] = useState("");
  const [generating, setGenerating] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const pollRef = useRef(null);
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  // Load style catalog + history on mount
  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/app/staging/styles");
        setStyles(r.data);
      } catch (e) {
        console.error("Failed to load styles:", e);
      }
      try {
        const h = await api.get("/app/staging/history");
        setHistory(h.data.items || []);
      } catch (e) {
        console.error("Failed to load history:", e);
      }
    })();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // ─── Poll active job ─────────────────────────────
  const startPolling = useCallback((jobId) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const r = await api.get(`/app/staging/jobs/${jobId}`);
        setCurrentJob(r.data);
        if (r.data.status === "done" || r.data.status === "failed") {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setGenerating(false);
          // Refresh history
          try {
            const h = await api.get("/app/staging/history");
            setHistory(h.data.items || []);
          } catch (_) { /* history refresh failed, non-blocking */ }
        }
      } catch (e) {
        console.error("Poll failed:", e);
      }
    }, POLL_INTERVAL);
  }, []);

  // ─── Handle file upload ──────────────────────────
  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setError("");
    if (!/^image\/(jpe?g|png|webp)$/.test(file.type)) {
      setError("Formato non supportato. Usa JPG, PNG o WEBP.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File troppo grande (max ${MAX_MB} MB).`);
      return;
    }

    // Local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setSourcePreview(e.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await api.post("/app/staging/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSourceUrl(r.data.url);
    } catch (e) {
      setError("Upload fallito: " + (e.response?.data?.detail || e.message));
    } finally {
      setUploading(false);
    }
  }, []);

  const onFileInputChange = (e) => handleFile(e.target.files?.[0]);
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  // ─── Trigger generation ──────────────────────────
  const handleGenerate = async () => {
    if (!sourceUrl || generating) return;
    setError("");
    setGenerating(true);
    setCurrentJob(null);
    try {
      const r = await api.post("/app/staging/generate", {
        image_url: sourceUrl,
        style: selectedStyle,
        room_type: selectedRoom,
      });
      setCurrentJob(r.data);
      startPolling(r.data.id);
    } catch (e) {
      setError("Generazione fallita: " + (e.response?.data?.detail || e.message));
      setGenerating(false);
    }
  };

  // ─── Download watermarked result ─────────────────
  const handleDownload = async () => {
    if (!currentJob?.id) return;
    try {
      const r = await api.get(`/app/staging/jobs/${currentJob.id}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `omnia-staging-${currentJob.id.slice(0, 8)}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError("Download fallito: " + (e.message));
    }
  };

  const handleReset = () => {
    setSourceUrl("");
    setSourcePreview("");
    setCurrentJob(null);
    setError("");
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setGenerating(false);
  };

  // ─── UI ────────────────────────────────────────────
  const totalCost = useMemo(() => {
    if (!currentJob?.stages) return 0;
    return currentJob.stages.reduce((s, st) => s + (st.cost_usd || 0), 0);
  }, [currentJob]);

  return (
    <AgencyShell current="staging">
      <div
        data-testid="virtual-staging-page"
        className="min-h-screen bg-stone-50 text-stone-900"
        style={{ fontFamily: "'Fraunces', Georgia, serif" }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <header className="mb-8">
          <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-amber-700 mb-2">
            OMNIA · Virtual Staging AI
          </p>
          <h1 className="text-4xl sm:text-5xl leading-tight tracking-tight mb-3">
            Arreda le foto vuote con l&apos;AI
          </h1>
          <p className="text-base font-sans text-stone-600 max-w-2xl">
            Pipeline professionale a 3 stadi: segmentazione SAM 2 → arredamento
            AI Flux → upscale 4x. Ogni render è marcato &quot;Render virtuale&quot; per
            conformità AGCM.
          </p>
        </header>

        {/* ─── Step 1: upload ────────────────────────── */}
        <section className="bg-white border border-stone-200 p-6 mb-6">
          <h2 className="text-lg font-sans font-semibold uppercase tracking-widest text-stone-700 mb-4">
            1. Carica una foto della stanza vuota
          </h2>

          {!sourcePreview ? (
            <div
              data-testid="staging-dropzone"
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed transition-colors p-12 text-center cursor-pointer ${
                dragOver
                  ? "border-amber-500 bg-amber-50"
                  : "border-stone-300 hover:border-stone-400 bg-stone-50"
              }`}
            >
              <p className="text-stone-500 font-sans text-sm mb-2">
                Trascina qui la foto oppure clicca per selezionare
              </p>
              <p className="text-stone-400 font-sans text-xs">
                JPG · PNG · WEBP · max {MAX_MB} MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                data-testid="staging-file-input"
                onChange={onFileInputChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img
                src={sourcePreview}
                alt="Sorgente"
                data-testid="staging-source-preview"
                className="w-full sm:w-64 h-auto object-cover border border-stone-200"
              />
              <div className="flex-1 space-y-3">
                {uploading && (
                  <p className="text-sm font-sans text-amber-700">
                    ⏳ Upload in corso...
                  </p>
                )}
                {sourceUrl && (
                  <p className="text-sm font-sans text-emerald-700">
                    ✓ Foto caricata, pronta per il rendering
                  </p>
                )}
                <button
                  onClick={handleReset}
                  data-testid="staging-reset-btn"
                  className="text-xs font-sans uppercase tracking-widest text-stone-500 hover:text-stone-700 border border-stone-300 px-3 py-1.5"
                >
                  Cambia foto
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ─── Step 2: params ────────────────────────── */}
        {sourceUrl && (
          <section className="bg-white border border-stone-200 p-6 mb-6">
            <h2 className="text-lg font-sans font-semibold uppercase tracking-widest text-stone-700 mb-4">
              2. Scegli stile e tipo di stanza
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-stone-500 mb-2">
                  Stile arredamento
                </label>
                <div className="flex flex-wrap gap-2">
                  {styles.styles.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setSelectedStyle(s.key)}
                      data-testid={`staging-style-${s.key}`}
                      className={`px-4 py-2 text-sm font-sans transition border ${
                        selectedStyle === s.key
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-white text-stone-700 border-stone-300 hover:border-stone-500"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-stone-500 mb-2">
                  Tipo di stanza
                </label>
                <div className="flex flex-wrap gap-2">
                  {styles.room_types.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => setSelectedRoom(r.key)}
                      data-testid={`staging-room-${r.key}`}
                      className={`px-4 py-2 text-sm font-sans transition border ${
                        selectedRoom === r.key
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-white text-stone-700 border-stone-300 hover:border-stone-500"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between">
              <p className="text-xs font-sans text-stone-500">
                Tempo stimato: 60-120 secondi · Costo: ~$0.06/render
              </p>
              <button
                onClick={handleGenerate}
                disabled={!sourceUrl || generating}
                data-testid="staging-generate-btn"
                className="bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 text-white text-sm font-sans uppercase tracking-widest px-6 py-3 transition"
              >
                {generating ? "Generazione in corso..." : "Genera con AI"}
              </button>
            </div>
          </section>
        )}

        {/* ─── Step 3: progress + result ─────────────── */}
        {currentJob && (
          <section
            data-testid="staging-progress"
            className="bg-white border border-stone-200 p-6 mb-6"
          >
            <h2 className="text-lg font-sans font-semibold uppercase tracking-widest text-stone-700 mb-4">
              3. Pipeline AI
            </h2>
            <div className="space-y-3">
              {currentJob.stages.map((s, i) => (
                <div
                  key={s.name}
                  data-testid={`staging-stage-${i}`}
                  className="flex items-center justify-between border border-stone-100 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-sans text-stone-700">
                      {STAGE_LABELS[s.name] || s.name}
                    </span>
                    {s.status === "running" && (
                      <span className="inline-block w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                    )}
                    {s.status === "done" && (
                      <span className="text-emerald-600">✓</span>
                    )}
                    {s.status === "failed" && (
                      <span className="text-red-600">✗</span>
                    )}
                  </div>
                  <div className="text-xs font-sans text-stone-500 flex items-center gap-4">
                    <span>{STAGE_STATUS_LABEL[s.status]}</span>
                    {s.duration_ms && (
                      <span>{(s.duration_ms / 1000).toFixed(1)}s</span>
                    )}
                    {s.cost_usd && <span>${s.cost_usd.toFixed(3)}</span>}
                  </div>
                </div>
              ))}
              {currentJob.error && (
                <div className="border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm font-sans">
                  {currentJob.error}
                </div>
              )}
            </div>

            {currentJob.status === "done" && currentJob.variant_url && (
              <div className="mt-6 pt-6 border-t border-stone-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-sans uppercase tracking-widest text-stone-500 mb-2">
                      Prima
                    </p>
                    <img
                      src={sourcePreview}
                      alt="Prima"
                      className="w-full border border-stone-200"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-sans uppercase tracking-widest text-emerald-700 mb-2">
                      Dopo (Render virtuale OMNIA)
                    </p>
                    <img
                      src={currentJob.variant_url}
                      alt="Staged"
                      data-testid="staging-result-img"
                      className="w-full border border-emerald-300"
                    />
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xs font-sans text-stone-500">
                    Costo totale: ${totalCost.toFixed(3)} · Job {currentJob.id.slice(0, 8)}
                  </p>
                  <button
                    onClick={handleDownload}
                    data-testid="staging-download-btn"
                    className="bg-stone-900 hover:bg-stone-700 text-white text-sm font-sans uppercase tracking-widest px-5 py-2.5"
                  >
                    Scarica con watermark
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ─── Error ─────────────────────────────────── */}
        {error && (
          <div
            data-testid="staging-error"
            className="border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm font-sans mb-6"
          >
            {error}
          </div>
        )}

        {/* ─── History ───────────────────────────────── */}
        {history.length > 0 && (
          <section className="bg-white border border-stone-200 p-6">
            <h2 className="text-lg font-sans font-semibold uppercase tracking-widest text-stone-700 mb-4">
              Cronologia render ({history.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {history.slice(0, 12).map((h) => (
                <div
                  key={h.id}
                  data-testid={`staging-history-${h.id.slice(0, 8)}`}
                  className="border border-stone-100"
                >
                  {h.variant_url ? (
                    <img
                      src={h.variant_url}
                      alt={h.style}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 bg-stone-100 flex items-center justify-center text-xs text-stone-400">
                      {h.status}
                    </div>
                  )}
                  <div className="p-2 text-[11px] font-sans text-stone-500">
                    {h.style} · {h.room_type}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        </div>
      </div>
    </AgencyShell>
  );
}
