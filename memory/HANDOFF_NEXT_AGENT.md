# 🚨 HANDOFF AL NUOVO AGENTE — LEGGI PRIMA DI FARE QUALSIASI COSA

**Fork da**: sessione E1 chiusa il **24-Feb-2026 (evening — Sprint 1 chiuso)**
**Motivo fork**: passaggio pulito a Sprint 2 · M5.S2 HAL Knowledge dopo chiusura Sprint 1
**Founder**: Marco Nicastro (mcnicastro-netizen · mcnicastro@gmail.com)
**Lingua di risposta OBBLIGATORIA**: 🇮🇹 **ITALIANO**. Il Founder è italiano madrelingua.

---

## ⛔ REGOLA D'ORO — RIPETUTA DUE VOLTE STASERA DAL FOUNDER

**"NIENTE PIÙ DEVIAZIONI. SI COMPLETA IL PROGRAMMA."**

Non proporre nuove feature "nice-to-have", non suggerire enhancement fuori Sprint corrente, non deviare mai da `PIANO_ESECUZIONE.md`. Ogni idea che emerge va parcheggiata in `ASPETTI_DA_APPROFONDIRE.md` e amen. Se hai dubbi, RILEGGI questa riga.

---

## ⛔ PRIME 5 AZIONI TASSATIVE (in questo ordine, senza deviazioni)

### 1️⃣ NON scrivere codice prima di aver letto QUESTI file
```
1. /app/memory/PIANO_ESECUZIONE.md    ← ordine tassativo Sprint 1-4
2. /app/memory/DECISIONS.md           ← D-035, D-041, D-042, D-043, D-051, D-053, D-054, D-055, D-056, D-057
3. /app/memory/PRD.md                 ← cosa è stato fatto e quando
4. /app/memory/ROADMAP.md             ← stato + backlog
5. /app/memory/test_credentials.md    ← credenziali test (mcnicastro@gmail.com / Forzainter2026.)
6. /app/memory/ASPETTI_DA_APPROFONDIRE.md ← A-001, A-002, A-003 (idee memorizzate, NON implementare)
7. /app/memory/creatives/brand_lab_reference.md ← estetica ufficiale "Mediterranean Future 2035"
```

### 2️⃣ Verifica che i servizi girino
```bash
sudo supervisorctl status
# devono essere RUNNING: backend, frontend, mongodb, code-server
```

### 3️⃣ Esegui la regressione test PRIMA di toccare qualsiasi cosa
```bash
cd /app/backend && export REACT_APP_BACKEND_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d'=' -f2)
python -m pytest tests/test_m2s5_1_groups.py tests/test_m2s5_2_api_gateway.py tests/test_m2s5_3_widgets.py tests/test_m2s5_4a_xml_importer.py tests/test_m2s5_4b_domain_checker.py tests/test_m2s5_4c_legal_kit.py tests/test_m2s5_5_domain_vault.py tests/test_m2s6a_publishing.py tests/test_m2s6b_sync_engine.py tests/test_m2s6c_social_publisher.py tests/test_m2s6d_portal_wizard.py tests/test_immobilcloud_auth_register.py --tb=short -q
# Atteso: 180/180 passed
```
**Se non passa 180/180 → STOP, apri ticket al Founder. NON cominciare a "aggiustare" senza discutere.**

### 4️⃣ Chiedi conferma al Founder via `ask_human` prima di partire
Mostra al Founder:
- "Ho letto il PIANO_ESECUZIONE, siamo su **Sprint 1 item #2 = M2.6c Social Publisher** (bloccato) OPPURE possiamo saltare a Sprint 2 · M5.S2 HAL Knowledge senza blocker"
- "164/164 regressione passa" (o segnala eventuali falliti)
- "Confermi che parto da Domain Vault senza deviazioni?"

### 5️⃣ Solo dopo il "vai" del Founder inizia a scrivere codice

---

## 🎯 STATO ATTUALE DEL PROGETTO (fotografia al 24-Feb-2026)

### ✅ COMPLETATO (non toccare, non riscrivere)

**Milestone core**
- M1 Foundation 100%
- M2 ImmoWeb core 100% (incl. stress test 5 agenti concorrenti — validato 23-Feb da testing_agent_v3_fork, report `/app/test_reports/iteration_25.json`)
- M3 ImmobilCloud B2C (7/9 DoD — mancano solo ricerca avanzata + privacy audit, in Sprint 3)
- M5 AI Suite: S1 (HAL Agents) + S3 (HAL Legal) + S4.1 (Virtual Staging base) + S5 (Mutui)

**M2.5 White Label / Doppio Binario**
- M2.5.1 Multi-branch / Franchising ✅
- M2.5.2 API Gateway + wallet crediti ✅
- M2.5.3 Widget embeddabili ✅
- M2.5.4a Universal XML Importer ✅
- M2.5.4b Domain Ownership Checker ✅ (landing `/it/verifica-dominio` + API v1 + widget)
- M2.5.4c Legal Templates Pack ✅ (4 PDF: GDPR/PEC/disdetta/CNR-IIT)
- **M2.5.5 Domain Vault ✅ NEW (23-Feb-2026, D-056)** — signup con garanzia contrattuale "il tuo dominio resta tuo" + policy pubblica `/it/domain-sovereignty-policy` + audit trail append-only `domain_vault_events` + 11/11 pytest
- M2.6a Publishing Center Foundation ✅
- M2.6b Sync Engine + Compliance ✅
- **M2.6d Universal Portal Wizard ✅ NEW (23-Feb-2026, D-057)** — 4-step wizard self-service per portali custom (regionali/franchising/nicchia) + tenant isolation via slug namespacing `x-{agency8}-{slug}` + feed URL clipboard-copy + 13/13 pytest

**Setup produzione (fuori codice — 24-Feb-2026)**
- 📧 **Cloudflare Email Routing** attivato su `omniarealestateecosystem.it` — MX Aruba orfano rimosso, regola `info@ → mcnicastro@gmail.com` attiva, test end-to-end **delivered** confermato in inbox Gmail dal Founder
- 📘 **Pagina Facebook OMNIA Real Estate Lab** in creazione — Founder ha ricevuto 3 varianti di descrizione (bio breve/media/lunga) rispettose di D-051 (no brand mentions)

**Documenti strategici**
- PROGRAMMA_OMNIA v3.0 (approvato Founder 06-Lug-2026)
- GO_TO_MARKET.md
- PRICING_OMNIA.md v2
- BUSINESS_MODEL.md
- PIANO_ESECUZIONE.md (23-Feb-2026 — ordine tassativo Sprint 1-4)

**Test suite**: **180/180 pytest pass** (132 originali + 11 Domain Vault + 13 Portal Wizard + 8 immobilcloud auth + 16 Social Publisher) + stress test M2 concorrenza validato.

### 🔴 NEXT — Sprint 1 CHIUSO al 100%, prossimo Sprint 2

**Sprint 1 · 3/3 items completati**:
1. ✅ M2.5.5 Domain Vault (fatto 23-Feb-2026)
2. ✅ **M2.6c Social Publisher** (fatto 24-Feb-2026, D-058) — Facebook Page + Instagram Business + Telegram con adapter async httpx, credenziali cifrate AES-256-GCM, audit trail. 16/16 pytest verdi + regressione totale **180/180 verdi**.
3. ✅ M2.6d Universal Portal Wizard (fatto 23-Feb-2026)

**Sprint 2 — prossima priorità (nessun blocker)**: **M5.S2 HAL Knowledge** — RAG su corpus `/app/memory/PRD.md` + `ROADMAP.md` + `DECISIONS.md` + eventuale doc utente. Emergent LLM key già disponibile (Gemini/Claude embeddings + generation). Zero credenziali esterne richieste.

**Item bloccante residuo (solo per uso reale IG, non blocca Sprint 2)**: il Founder deve collegare l'account Instagram Business alla Facebook Page "Omnia real estate lab" (ID `1275173392335417`) — richiede solo qualche clic nel Meta Business Manager. Fino ad allora, il canale IG è configurabile ma il primo `POST /channels/{id}/validate` restituirà errore Meta. Nessun impatto su FB Page (già funzionante) o Telegram (in attesa di bot token).

Dopo Sprint 2: Sprint 3 (M3 backlog + M5.S4) → Sprint 4 (Perf + deploy).

### 🛑 ESPLICITAMENTE FUORI SCOPE fino a Sprint 4 chiuso

**Il Founder ha detto CHIARAMENTE più volte (23-Feb e 24-Feb): "niente più deviazioni, si completa il programma"**. NON toccare/proporre:

- ❌ Video promo brand OMNIA (Sora 2, Kling, Pippit, altri) — memorizzato in `ASPETTI_DA_APPROFONDIRE.md`
- ❌ Nuove landing marketing
- ❌ Form contatti pubblico (idea suggerita dall'agente il 24-Feb, esplicitamente rifiutata dal Founder come deviazione)
- ❌ Manuale Operativo cap. 3-20 (in coda per volere Founder)
- ❌ M6 Omnia Academy (in coda per volere Founder)
- ❌ M4 MLS + Stripe (post-società — richiede P.IVA, IBAN, contratto Stripe di OMNIA)
- ❌ M5.S7 Modulistica AI (post-società)
- ❌ M5.S8 Firma elettronica + Visure (post-società)
- ❌ Pre-launch commerciale (congelato D-035, sblocca solo dopo M6)
- ❌ APE Partnership integration (in attesa risposte da APEFACILE + EnUp)
- ❌ Aspetti da approfondire A-001 (BNPL) + A-002 (NVIDIA API Catalog) + A-003 (AI Creative Studio) — memorizzati, NON implementare
- ❌ Brand Lab expansion (già consegnata, non toccare)
- ❌ Nuovi widget non pianificati
- ❌ Refactoring "cosmetici" non richiesti
- ❌ Domain Vault fase 2 (firma digitale policy — memorizzato in D-056 come "post-Sprint 4")
- ❌ Portal Wizard fase 2 (modalità push/API — memorizzato in D-057 come "post-Sprint 4")
- ❌ Deploy Emergent (Founder l'ha dismesso a giugno per costi — riattivare solo al go-live post Sprint 4)
- ❌ Pulizia DNS Cloudflare (7 A record orfani `mx.` + CNAME `app`/`cloud`/`_domainconnect` — non urgente, si fa quando il Founder ha voglia)


---

## 🔒 REGOLE VINCOLANTI (viola una di queste = danno al progetto)

### 🏷️ **D-041 White Label / Doppio Binario**
OGNI nuova feature nasce in **3 modalità simultanee**:
1. UI dentro OMNIA (Track A turnkey)
2. API pubblica v1 in crediti (Track B)
3. Widget embeddabile (Track B partner web agency)

Deroghe da giustificare nello sprint plan e discutere col Founder.

### 📄 **D-035 No Paper / Santo Graal**
Ogni deliverable è **100% digitale**. Mai stampa cartacea, mai firma su carta. Delivery via:
- Email + PDF allegati (Resend)
- Download in-browser (blob URL)
- Firma digitale SPID/CIE/OTP/PEC

### 🚫 **D-051 No Brand Mentions**
**MAI** nominare competitor concreti (Agestanet, Gestim, Getrix, ecc.) nel codice, UI, log, PDF, email, commenti. Sempre keyword categoriali generiche ("il tuo attuale fornitore", "hosting", "web agency", "software solutions").

Se scopri una menzione competitor da qualche parte → **RIMUOVILA** e loggalo in `DECISIONS.md`.

### 🇮🇹 **Lingua Founder**
Il Founder scrive e legge in **italiano**. Tutte le risposte del main agent, tutti i copy di landing/UI/email/PDF devono essere in italiano. i18n IT è la lingua primaria (poi EN + ES).

### 🎨 **Estetica ufficiale del brand**
Palette hex code strict: `#0B1E3F` (navy) + `#1F6B5C` (emerald) + `#C8A653` (gold) + `#F5F1E8` (off-white) + `#4EE1D3` (cyan hologram).
Font: Fraunces (serif hero) + Inter (body/UI).
Style: Mediterranean Future 2035 (Zaha Hadid + Blade Runner 2049 warmth). MAI cliché toscani/Bialetti/tetti-rossi.
Dettagli in `/app/memory/creatives/brand_lab_reference.md`.

---

## 🐙 REPO GITHUB — ATTENZIONE MASSIMA

**Il progetto ha un repo GitHub attivo**: `mcnicastro-netizen/OMNIA`

### ⚠️ REGOLE GITHUB (non violare)

1. **Il push a GitHub è UNIDIREZIONALE** (Emergent → GitHub, non viceversa)
2. **I file `.env` NON sono su GitHub** (esclusi per sicurezza). Se il Founder scaricasse il codice da GitHub servirebbe ricreare a mano:
   - `/app/backend/.env` (MONGO_URL, DB_NAME, CORS_ORIGINS, EMERGENT_LLM_KEY, RESEND_API_KEY, FAL_KEY, CREDENTIALS_MASTER_KEY)
   - `/app/frontend/.env` (REACT_APP_BACKEND_URL, WDS_SOCKET_PORT)
3. **NON eseguire mai `git push` diretto** — il Founder usa la feature "Save to GitHub" della UI Emergent per farlo. Se il Founder chiede di pushare, digli di usare quella feature (o chiama `support_agent`).
4. **NON toccare le cartelle `.git` e `.emergent`** — sono richieste dalla piattaforma.
5. **`git log` funziona** (Emergent committa dopo ogni tuo step, puoi ispezionare la storia). `git diff` invece **NON funziona** perché non ci sono working changes.
6. Se il Founder chiede di **tornare a una versione precedente** → suggerisci la feature "Rollback" della piattaforma Emergent (gratis, sicura). **NON fare `git reset` o `git revert` manuali**.

---

## 💰 CONSUMO CREDITI — evita l'anomalia che ha causato il fork

Il fork è stato suggerito da Emmy per **consumo anomalo crediti**. Nel dubbio del perché:

### 🔴 Cose che consumano molti crediti (ridurre)
- Chiamate ridondanti a `web_search_tool_v2` (usa `search_context_size: "low"` o "medium" quando basta)
- Chiamate al `testing_agent_v3_fork` "solo per sicurezza" — chiamalo SOLO dopo modifiche significative
- `screenshot_tool` chiamato multiple volte in loop implementa-screenshot-implementa (BAD PATTERN)
- File create con contenuto verboso ridondante
- Interrogazioni ripetute allo stesso file (usa `view_bulk` una volta invece di 5 `view_file` separate)

### 🟢 Cose ottimizzate (pattern corretto)
- Parallel tool calls dove indipendenti (leggere N file → 1 `view_bulk`)
- `search_replace` mirati invece di `create_file` overwrite di file grandi
- `mcp_execute_bash` con comandi combinati (`&&`) invece di multipli chiamate
- Testing agent SOLO su batch di features grandi, non su micro-fix
- `finish` chiamato tempestivamente (non tenere il lavoro aperto inutilmente)

### 🎯 Pattern anti-deriva (CRITICO)
Il Founder ha esplicitamente identificato "carne sul fuoco" come problema il 23-Feb. Sintomi da evitare:
- Aggiungere feature "utili" non pianificate solo perché "veloci"
- Proporre nuovi moduli quando la roadmap ha ancora buchi
- Rispondere a domande casuali con implementazioni concrete (annota in `ASPETTI_DA_APPROFONDIRE.md` invece)
- Trasformare una domanda in un piano di 3 sprint

Se il Founder dice "che ne pensi di X?" → **rispondi analiticamente**, NON implementare.
Se il Founder dice "fai X" → **verifica che sia in `PIANO_ESECUZIONE.md`** prima di procedere.

---

## 🧪 TESTING PROTOCOL

### Quando testare autonomamente (self-test)
- Cambio piccolo su file esistente
- Bug fix minore
- Uso: `curl` per backend, `mcp_screenshot_tool` per frontend, `mcp_execute_bash python -m pytest` per test suite

### Quando invocare `testing_agent_v3_fork`
- Feature nuova completa (backend + frontend + integrazione)
- Batch di 2+ endpoint nuovi
- Bug segnalato dal Founder come "ricorrente" o critico
- Stress test / carico / concorrenza
- Prima di dichiarare uno Sprint chiuso

### `test_credentials.md` sempre aggiornato
Se crei/modifichi utenti di test, aggiorna SUBITO `/app/memory/test_credentials.md`. Il testing agent legge quel file — se manca, il test fallirà.

---

## 🎯 PROSSIMA AZIONE CONCRETA

**Sprint 1 · Item #1 · M2.5.5 Domain Vault ✅ FATTO (23-Feb-2026)** — vedi D-056.
**Sprint 1 · Item #2 · M2.6c Social Publisher ✅ FATTO (24-Feb-2026)** — vedi D-058.
**Sprint 1 · Item #3 · M2.6d Universal Portal Wizard ✅ FATTO (23-Feb-2026)** — vedi D-057.

### 🟢 Item corrente: **Sprint 2 · M5.S2 HAL Knowledge**

**Cosa fa HAL Knowledge**:
Chatbot "how-to" della piattaforma OMNIA che risponde su come usare le funzionalità del CRM. RAG (Retrieval Augmented Generation) su corpus di documenti già scritti:
- `/app/memory/PRD.md` (cosa fa OMNIA, feature per feature)
- `/app/memory/ROADMAP.md` (stato + backlog)
- `/app/memory/DECISIONS.md` (57+ decisioni tecniche/business, ognuna con contesto)
- Manuale utente (se scritto entro il momento) — altrimenti si può partire senza

**Stack tecnico raccomandato**:
- Embeddings: Emergent LLM Key (Gemini `text-embedding-004` o alternativa)
- Vector store: MongoDB Atlas Vector Search (già disponibile) oppure in-memory se il corpus resta <1MB
- Generation: Gemini 3 Flash via Emergent LLM Key (economico, veloce)
- Retrieval: top-k=5 chunk + reranking soglia coseno >0.6
- Guardrails: se confidence <0.7 → "Non ho abbastanza contesto, chiedi al team OMNIA"

**Definition of Done Sprint 2**: HAL Knowledge risponde a 10 domande how-to di test con confidence ≥0.85 e citazione fonte. 15+ pytest. UI accessibile dal CRM come 3° bottone HAL (D-040 — 3 bottoni fisici, no router LLM).

**⚠️ OBBLIGO — Prima di scrivere una riga di codice RAG**: chiama `integration_playbook_expert_v2` con query mirata su embeddings + vector search + RAG pattern con Emergent LLM Key.

### 🔴 Blocker residuo M2.6c (non blocca Sprint 2)

Il canale Instagram in M2.6c è pronto ma richiede che il Founder colleghi l'IG Business Account alla sua Facebook Page "Omnia real estate lab" (ID `1275173392335417`) dal Meta Business Manager. Fino ad allora, `POST /channels/{id}/validate` su IG restituirà errore Meta. Zero impatto su FB Page e Telegram, zero impatto su Sprint 2.

Telegram: canale progettato ma configurabile solo quando il Founder fornisce Bot Token da @BotFather + Chat ID. UI self-service pronta a riceverli.


---

## 📞 SE HAI DUBBI

- Domanda strategica → `ask_human` al Founder
- Domanda piattaforma Emergent → `support_agent`
- Bug in fase debug → `troubleshoot_agent`
- Integrazione 3rd party (Meta, Stripe, ecc.) → `integration_playbook_expert_v2`
- Testing complesso → `testing_agent_v3_fork`

---

## 🔒 IMPEGNO ESPLICITO DEL NUOVO AGENTE

Leggendo questo file ti impegni implicitamente a:
1. ✅ Rispettare l'ordine di `PIANO_ESECUZIONE.md` senza deviazioni
2. ✅ Non toccare codice già consegnato senza discutere col Founder
3. ✅ Non proporre feature fuori scope Sprint 1-4
4. ✅ Aggiornare PRD.md + ROADMAP.md + DECISIONS.md dopo ogni Sprint chiuso
5. ✅ Testare (self o subagent) prima di dichiarare "fatto"
6. ✅ Rispondere in italiano al Founder
7. ✅ Ottimizzare consumo crediti (no loop implementa-screenshot, no test agent per micro-fix)
8. ✅ Mai touching GitHub direttamente (unidirezionale, gestito da Founder)

---

**Firmato**: E1 (agente uscente) — 23-Feb-2026
**Buon lavoro. Rispetta l'ordine, chiudi il progetto. Il Founder è italiano e conta su di te.** 🇮🇹
