/* OMNIA — Al Chat Widget (M5.S1)
 * Floating Action Button in basso-destra. Si espande in pannello chat.
 * Path montato dentro AgencyShell per essere globale in IMMOWEB.
 */
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../../shared/lib/api";

export default function AlChatWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [sid, setSid] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy]);

  const send = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setBusy(true);
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    try {
      const r = await api.post("/app/al/chat", { session_id: sid, message: text });
      if (!sid) setSid(r.data.session_id);
      setMessages((m) => [...m, {
        role: "assistant", content: r.data.reply, tool: r.data.tool_used,
      }]);
    } catch (e) {
      const detail = e?.response?.data?.detail;
      setMessages((m) => [...m, {
        role: "assistant",
        content: detail === "rate_limit_exceeded"
          ? t("al.err_rate_limit")
          : t("al.err_generic"),
      }]);
    } finally { setBusy(false); }
  };

  const newSession = () => {
    setSid(null);
    setMessages([]);
    setInput("");
  };

  if (!open) {
    return (
      <button
        data-testid="al-fab"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-[#0B1E3F] text-white rounded-full shadow-xl hover:bg-[#C19A6B] transition flex items-center justify-center text-xl font-light"
        style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        title={t("al.open_chat")}
      >
        Al
      </button>
    );
  }

  return (
    <div
      data-testid="al-widget"
      className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-32px)] h-[520px] max-h-[calc(100vh-100px)] bg-white border border-stone-200 rounded-lg shadow-2xl flex flex-col"
    >
      <header className="px-4 py-3 border-b border-stone-200 flex items-center justify-between bg-[#0B1E3F] text-white rounded-t-lg">
        <div>
          <h3 className="font-light text-base" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Al</h3>
          <p className="text-[10px] uppercase tracking-widest text-stone-300">{t("al.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            data-testid="al-new-session"
            onClick={newSession}
            className="text-[10px] uppercase tracking-widest opacity-70 hover:opacity-100"
            title={t("al.new")}
          >
            ↻
          </button>
          <button
            data-testid="al-close"
            onClick={() => setOpen(false)}
            className="text-lg leading-none opacity-70 hover:opacity-100"
            title={t("al.close")}
          >
            ×
          </button>
        </div>
      </header>

      <div ref={scrollRef} data-testid="al-messages" className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-stone-500 text-xs py-8">
            <p className="mb-3">{t("al.welcome")}</p>
            <ul className="text-left space-y-1.5 text-[11px] text-stone-600 max-w-[260px] mx-auto">
              <li>· &ldquo;{t("al.suggest_1")}&rdquo;</li>
              <li>· &ldquo;{t("al.suggest_2")}&rdquo;</li>
              <li>· &ldquo;{t("al.suggest_3")}&rdquo;</li>
              <li>· &ldquo;{t("al.suggest_4")}&rdquo;</li>
            </ul>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            data-testid={`al-msg-${m.role}`}
            className={`text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-stone-100 ml-6 p-3 rounded-lg"
                : "bg-[#FAF7F2] mr-6 p-3 rounded-lg border border-stone-200"
            }`}
          >
            {m.content}
            {m.tool && (
              <span className="block mt-1.5 text-[10px] uppercase tracking-widest text-[#C19A6B]">
                via {m.tool}
              </span>
            )}
          </div>
        ))}
        {busy && (
          <div data-testid="al-typing" className="text-xs text-stone-400 italic px-3">
            {t("al.typing")}
          </div>
        )}
      </div>

      <form onSubmit={send} className="border-t border-stone-200 p-3 flex gap-2">
        <input
          data-testid="al-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("al.placeholder")}
          maxLength={2000}
          className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#0B1E3F]"
          disabled={busy}
        />
        <button
          type="submit"
          data-testid="al-send"
          disabled={busy || !input.trim()}
          className="px-4 py-2 bg-[#0B1E3F] text-white text-xs uppercase tracking-widest rounded hover:bg-[#C19A6B] disabled:opacity-50"
        >
          {t("al.send")}
        </button>
      </form>
    </div>
  );
}
