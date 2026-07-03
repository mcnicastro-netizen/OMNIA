# 🗺️ ROADMAP OMNIA — Stato avanzamento

**Ultimo aggiornamento**: 29 Giugno 2026 — 🛑 **D-035 STOP PRE-LAUNCH, ritorno al programma operativo originale**
**Riferimento completo**: vedi `PROGRAMMA_OMNIA.md` (v2.4), `CHANGELOG.md`, `DECISIONS.md` e `OPEN_SOURCE_FINDINGS.md` (audit GitHub 29-Giu)

---

## 🛑 DECISIONE STRATEGICA VINCOLANTE — 29 Giu 2026 (D-035)

Il Founder ha esplicitamente fermato il filone pre-launch. Citazione: *"abbiamo perso il filo inseguendo un pre-launch che a me non interessa per ora. Non ci sarà nessun pre-launch senza Academy e features funzionanti. Riprenderemo dal Programma Operativo originale"*.

**Conseguenze immediate**:
- ⏸️ **Filone commerciale CONGELATO** (Landing `/it/agenzie`, Banner CTA, warm-up Resend, outreach Founders 50, Sora 2 videos, pricing publishing)
- ✅ **Si torna alla sequenza M2 → M3 → M4 → M5 → M6 del `PROGRAMMA_OMNIA.md`**, integrata da D-032 (M5 prima di M4)
- 🔍 **Audit completo**: alla prossima sessione si ricostruisce l'elenco esatto dei TODO **saltati o fatti parzialmente** dentro M2/M3/M5 già "chiusi"
- 📷 **MLS multi-agenzia** (M4.S1+S2) ha priorità di studio: Founder aveva fornito **screenshots Agestanet** (UX modulo MLS) + **screenshot box MLS nicastroimmobiliare.it** — da rilocalizzare o richiedere nuovo upload alla prossima sessione
- 🌟 **Santo Graal PNG** (`ChatGPT Image 15 apr 2026`) torna **unica north-star di prodotto**
- 📌 Tutto il codice già consegnato (M1/M2/M3/M5.S1/M5.S3/M3.S6-pro/ANNCSU) **resta in produzione**, nessun rollback

---

## Stato attuale (29-Giu-2026 — post-D-035)

🟢 **DONE**: M1 · M2 · M3 (incl. ANNCSU autocomplete) · M5.S1 · M5.S3 · M3.S6-pro · Foundation commerciale (in stato dormiente)

```
M1   M2   M3   ANNCSU  M5.S1  M5.S3  M3.S6-pro    M4   M5.S2  M5.S4  M6    Pre-launch
✅   ✅   ✅   ✅      ✅     ✅     ✅           ⏸️   ⏸️     ⏸️     ⏸️    🛑 CONGELATO
```

### ⏸️ DECISIONI ESPLICITAMENTE RIMANDATE (sessione separata, post-M6)
- **Tier Enterprise** (>20 utenti, multi-sede, SLA dedicato) — *"Voglio ragionarci ancora"*
- **Custom API per Enterprise** — per-call / flat / revenue-share
- **Pre-launch + Founders 50** — riapertura solo dopo Academy + features complete (D-035)

### 🔴 Prossima sessione — Riapertura al PROGRAMMA_OMNIA.md

**Sequenza obbligata (D-035)**:

1. **Audit "lavori saltati o parziali"** dentro M2/M3/M5 già flaggati ✅ — fare lista esaustiva prima di partire
2. **Recupero materiali Founder per MLS**:
   - Cercare screenshots Agestanet negli asset del job
   - Cercare screenshot box MLS nicastroimmobiliare.it
   - Se non più disponibili → chiedere nuovo upload al Founder
3. Continuare da dove si era effettivamente fermato il programma operativo, secondo la sequenza D-032: **M5.S4 Virtual Staging → M5.S5 Mutui → M5.S6 APE → M5.S2 AL Knowledge → M6 Academy → M4 MLS+Stripe+Crediti**


**Sequenza definita (tempo illimitato, qualità prima):**

#### Fase 1 — Pre-launch foundation (2-4 settimane)
1. ✅ Pricing v1.0 definitivo *(FATTO 26-Giu)*
2. ✅ Resend setup completo *(FATTO 26-Giu)*
3. ✅ **Landing `/it/agenzie` v0.1** *(FATTO 27-Giu mattina, considerata "prima bozza")*
   - Backend `/api/founders/{spots,register}` + 2 template email
   - Frontend con hero, counter, 3 wow-moment, pricing table, form 5 campi
   - File: `/app/backend/apps/marketing/founders.py`, `/app/frontend/src/apps/landing/AgenziesLandingPage.jsx`
4. ⏳ **Landing v0.2 refinement** (al prossimo accesso): cambi richiesti da founder dopo review
5. ⏳ **Banner CTA** sul Valuator + AL Legal (mezza giornata)
   - Footer sticky → link `/it/agenzie`
   - Tracking click
6. ⏳ **i18n EN/ES** della landing (copy traduzione)
7. ⏳ **Test reale E2E** mail in inbox (registrazione con vera email founder)

#### Fase 2 — Demo letale 3 minuti (3-5 settimane)
5. 🎬 **Storyboard finale** (1 giorno insieme)
6. 🛠️ **Dati demo realistici** su staging (2-3 giorni)
7. 📹 **Screen recording 4K** (1-2 giorni)
8. 🎙️ **Voice-over professionale** (Fiverr top-tier, ~€150, 1 settimana attesa)
9. ✂️ **Editing + sottotitoli IT/EN/ES** (2-3 giorni)
10. 📤 **Upload landing + YouTube + LinkedIn** (1 giorno)

#### Fase 3 — Completamento features in parallelo (2-3 mesi)
11. **M5.S2 AL Knowledge** (RAG sul manuale)
12. **Manuale OMNIA strutturato** (input per RAG, 6-10 ore scrittura)
13. ~~**ANNCSU Sprint 2** (autocomplete indirizzi Valuator)~~ ✅ DONE 29-Giu-2026
14. **Code Review pre-produzione** (security audit)
15. **M5.S4 Virtual Staging** (bloccato fino a `FAL_KEY` founder)
16. **M6 Omnia Academy** (struttura base)

#### Fase 4 — Outreach Founders 50 (3-6 mesi)
17. Warm-up dominio 2 settimane progressive
18. Cold outreach LinkedIn Sales Navigator (~€80/mese) + email a database segmentato
19. 5 demo dirette/settimana
20. Closing tracking + feedback loop bug-fix
21. **Trigger go-live**: 15 Founders firmati & paganti

#### Fase 5 — Internazionale (12+ mesi post go-live)
- Spagna (i18n ES già pronto)
- Portogallo (PT da aggiungere)
- Francia + Germania (Phase 3, 24+ mesi)
- USA via partnership MLS (Phase 4, 36+ mesi)
- Cina + Paesi Arabi (Phase 5+, modello licensing)

#### ⏸️ Sessioni separate da pianificare
- **Tier Enterprise + Custom API**: pricing, struttura, SLA, modelli contrattuali
- **Analisi mercati Cina + Paesi Arabi**: costi-benefici, partner locali, normative

### 🟡 Bug noti / TODO tecnico
- CORS backend si aspetta `learn.omniarealestateecosystem.it` ma CNAME su Cloudflare è `cloud`. Allineare al prossimo accesso.
- Aggiungere CNAME `learn` su Cloudflare per Academy quando sarà costruita (P3).


---

## Milestone in corso

**M2 — ImmoWeb MVP (Agency CRM)** — 95% completata · sessioni 1→5 chiuse

Prossima azione: **D-FUTURE-07 AI Smart Import Clienti** (P0 next session), poi **M2.S6 Custom Domain** (richiede scelta provider DNS).

**🚨 P0 PRIMA COSA AL RIENTRO**:

1. **Auto-translate Chrome confermato**: la maggior parte dei labels strani era Chrome (Founder ha provato "Mostra originale" e si è risolto da solo per Sidebar+Settings).

2. **DECISIONI STRATEGICHE WHITE LABEL — APPROVATE DAL FOUNDER (12 Giu 2026)**:

   ❌ **RIMUOVERE da Settings**: color picker "Colore primario/d'accento" (confusi per non-grafici).

   ✅ **D-016 — Strategia migrazione "Sostituisci un pezzo alla volta"**:
   - Fase 1: OMNIA in parallelo (1-2 mesi, zero rischio)
   - Fase 2: OMNIA sostituisce gestionale (Agestanet o simili) → disdici gestionale
   - Fase 3 (opzionale): OMNIA sostituisce anche il sito
   - Pricing target: €19-29/mese small, €79-129/mese large (da definire)

   ✅ **D-017 — Per caso A (agenzia ha già sito)**:
   - Partiamo con **feed XML compatibile** (M2.S5) che alimenta il sito esistente come fa Agestanet
   - In futuro estendiamo con plugin WordPress / embed code
   - **NOTA**: Founder ha un'idea aggiuntiva potenzialmente vincente che condividerà a tempo debito → CHIEDERGLIELA al rientro o quando appropriato

   ✅ **D-018 — Per caso B (template OMNIA)**:
   - **Ogni agenzia col SUO dominio** (es. nicastroimmobiliare.it), non sottodominio OMNIA
   - Agenzia compra e rinnova il dominio in autonomia (come fa già con il provider tipo Basic Soft)
   - OMNIA ospita il sito generato dal template e l'agenzia punta i DNS

   ✅ **D-019 — Template design strategy**:
   - **Li facciamo NOI** con `design_agent_full_stack`
   - 5-10 template di qualità "**i migliori del mercato**"
   - **Possiamo clonare/ispirarci a siti specifici esistenti** se necessario per raggiungere quality bar
   - Da fare in M2.S6 o M3 (decidere quando al rientro)

3. **Settings page semplificata** (P0 al rientro):
   - Rimuovere color picker
   - Rimuovere "URL del logo" (sarà gestito nei template, non qui)
   - Lasciare: identità + dati fiscali + indirizzo + contatti
   - Aggiungere sezione "Sito web" con 2 modalità:
     - 🅰️ "Ho già il mio sito" → URL + (futuro) feed XML
     - 🅱️ "Crea sito con OMNIA" → galleria template (placeholder per ora)

**Cosa è pronto da testare/caricare sul Founder PREVIEW**:
- Preview URL: https://audit-tool-12.preview.emergentagent.com/it/login
- Login: `mcnicastro@gmail.com` / `Forzainter2026.`
- Flusso da testare: Login → Onboarding → Crea Agenzia → Properties → Nuovo Immobile (con foto JPEG drag&drop)
- DB locale è stato **pulito** alla fine sessione → pronto per primo onboarding pulito

**Cosa il Founder deve ancora fare (in ordine, senza fretta)**:
1. Caricare 1-6 immobili reali sul PREVIEW con foto per validare UX
2. Quando soddisfatto: Save to GitHub + **UN SOLO Deploy** (M2.S1+S2+S2bis tutto insieme — risparmia crediti)
3. Tornare per **M2.S3 — CRM clienti + lead**

**Vincolo importante del Founder**: usare deploy con parsimonia (consuma crediti).

---

## Milestone in corso

**M2 — ImmoWeb MVP (Agency CRM)** (3 di 6 sessioni)

Prossima azione: **M2.S3 — CRM clienti + matching engine**

---

## Backlog dettagliato per Milestone

### M1 — Foundation (4 sessioni)
- [x] **M1.S1 — Decisioni architetturali** ✅ (10 Giu 2026)
  - Monorepo Turborepo
  - Sottodomini corti su omniarealestateecosystem.it
  - Shared schema MongoDB multi-tenant
- [x] **M1.S2 — Setup monorepo + struttura base** ✅ (11 Giu 2026)
  - Logical Monorepo backend (apps/ + shared/)
  - Logical Monorepo frontend (apps/ + shared/)
  - i18n nativa IT/EN/ES funzionante (auto-detection)
  - MongoDB connesso con indici tenant-aware
  - 4 endpoint health funzionanti in 3 lingue
  - 4 app frontend navigabili (Landing, Cloud, App, Learn)
  - Routing multi-app + multi-lingua testato
  - Responsive mobile/tablet/desktop con hamburger menu
  - Brand names protetti da auto-translate (componente Brand)
- [x] **M1.S3 — Auth JWT + Ruoli + Multi-tenant** ✅ (11 Giu 2026)
  - bcrypt + PyJWT installati
  - 7 endpoint auth: register, login, me, refresh, logout, forgot-password, reset-password
  - 5 ruoli: super_admin, agency_admin, agent, client, student
  - JWT HS256 (access 15min, refresh 7gg) in cookie httpOnly+secure
  - Brute force protection (5 tentativi = lockout 15 min)
  - Admin auto-seeding (mcnicastro@gmail.com)
  - Resend integration con 6 template email (welcome+reset × IT/EN/ES)
  - Frontend: AuthProvider, ProtectedRoute, LoginPage, RegisterPage, ForgotPasswordPage, DashboardPage
  - i18n integrato in tutto auth flow
- [x] **M1.S4 — Deploy preview + dominio** ✅ (11 Giu 2026)
  - SEO/OG tags multi-lingua in `index.html` (title, og, twitter card, JSON-LD Organization)
  - 4 hreflang links (it/en/es/x-default) + canonical
  - Design north-star salvato in `/app/memory/DESIGN_NORTHSTAR.md` (palette navy/teal/viola/oro + Fraunces+Inter)
  - DNS setup guide salvata in `/app/memory/DNS_SETUP_GUIDE.md` (apex + 4 sottodomini cloud./app./learn./api.)
  - Resend domain verification guide salvata in `/app/memory/RESEND_DOMAIN_GUIDE.md` (skip in M1, da fare prima di M2 onboarding)
  - `.gitignore` fix: rimosso blocking `.env*` (i file vanno committati per Emergent deploy)
  - `CORS_ORIGINS` esteso per supportare i domini di produzione (apex + 4 sottodomini)
  - Deploy readiness check: ✅ PASS

### M2 — ImmoWeb MVP (7 sessioni — S3.5 aggiunta per gap "chi vende")
- [x] **M2.S1 — Dashboard agenzia + onboarding** ✅ (12 Giu 2026)
- [x] **M2.S2bis — Upload foto immobili** ✅ (12 Giu 2026)
- [x] **M2.S2 — CRUD Immobili + Import CSV/XML** ✅ (12 Giu 2026)
  - + Parser Agestanet dedicato testato su 65 immobili reali
- [x] **Settings UI refactor** ✅ (16 Giu 2026)
  - Rimossi logo URL + color picker. Aggiunta sezione "Sito web agenzia" con 2 modalità (external/template).
- [x] **M2.S3 — CRM Clienti + Preferenze ricerca (idealista-style)** ✅ (16 Giu 2026)
  - Backend `/api/app/clients` CRUD + filtri + CSV import
  - Frontend ClientsPage + ClientFormPage con preferenze replica Idealista
  - Test: 15/15 pytest backend + 7/7 flussi UI passed
- [x] **M2.S3.5 — Property↔Seller link** ✅ (16 Giu 2026)
- [x] **M2.S4 — Matching Engine + Lead Scoring AI** ✅ (16-17 Giu 2026)
- [x] **M2.S5 — Multiposting XML + Clone-from-URL + Theme Registry** ✅ (17-18 Giu 2026)
- [x] **D-FUTURE-04 Smart Clients List** ✅ (18 Giu 2026)
- [x] **D-FUTURE-07 AI Smart Import Clienti** (Gemini-3 Flash) ✅ (18 Giu 2026)
- [x] **M2.S6 — Custom Domain + Host-based routing** ✅ (18 Giu 2026)

### M3 — ImmobilCloud (6 sprint completati, 1 da fare)
- [x] **M3.S1 — Home pubblica + Registrazione segmentata B2C** ✅ (19 Giu)
- [x] **M3.S2 — Publishing Center lato agente** ✅ (19 Giu)
- [x] **M3.S3 — Mappa Leaflet + Filtri avanzati + Geocoding OSM** ✅ (22 Giu)
- [x] **M3.S4 — Pagina dettaglio pubblica + Form contatto** ✅ (22 Giu)
- [x] **M3.S4.1 — Email lead notification via Resend** ✅ (22 Giu)
- [x] **M3.S5 v2 — Annunci privati B2C + Moderazione admin** ✅ (22 Giu)
- [x] **M3.S6 — Valutatore GIS pubblico (124 città IT, 50 pytest)** ✅ (22 Giu)
- [x] **M3.S7 — Saved searches + Alert email matching B2C** ✅ (23 Giu) — 12 pytest + 11 Playwright PASS

### M5 — AI Suite (8 sprint, sequenza definita D-028 del 23 Giu)
- [x] 🤖 **M5.S1 — AL for Agents** ✅ (24 Giu) — chatbot CRM con function-calling JSON, streaming SSE token-by-token, **inline ✨ "Migliora con AL" su titolo+descrizione (IT/EN/ES)** in ImmoWeb + ImmobilCloud. Test 100% (iteration_17/18/19).
- [ ] 📚 **M5.S2 — AL Knowledge** (chatbot how-to piattaforma, prerequisito: manuale scritto da E1)
- [x] ⚖️ **M5.S3 — AL Legal** ✅ (24 Giu) — 5 sub-agenti specializzati + Tavily web search (7 fonti normative IT) + anti-hallucination validator (confidence 0.85) + Chain of Thought + temperature 0.2 + upload PDF + disclaimer L.247/2012. Pagina `/it/legal`. Test 16/16 backend + 100% frontend (iteration_20).
- [ ] 🎨 **M5.S4 — Virtual Staging** (Nano Banana arreda foto vuote)
  - [x] **S4.1** — Pipeline 3-stage + endpoint + frontend dropzone + watermark ✅ 03-Lug-2026
  - [ ] S4.2 — Reverse Staging + 4-varianti parallele + prompt CRM-aware
    - [ ] Sub-task: **Inline "Arreda questa foto"** — bottone accanto a ogni foto nel form immobili → apre modale Virtual Staging pre-caricato con URL foto listing → risultato salvato come nuova foto dell'annuncio (senza uscire dal flusso di caricamento). Trasforma il tool da "usato occasionalmente" a "usato ogni giorno".
  - [ ] S4.3 — Micro-tour video 5s (Kling) + embed listing B2C + export Reels 9:16
  - [ ] S4.4 — A/B testing portale + dashboard analytics
- [ ] 💰 **M5.S5 — Comparatore mutui** (scraping banche IT)
- [ ] 🌡️ **M5.S6 — Certificazione APE** (calcolo orientativo)
- [ ] 📑 **M5.S7 — Modulistica AI** (post-società)
- [ ] ✍️ **M5.S8 — Firma elettronica + Visure** (post-società, account paid)

### 💡 AL Inline Enhancements — Backlog idee (24 Giu 2026)
Stesso pattern di `AlImproveButton` (modal inline su form immobile):
- [ ] **✨ Suggerisci features** — AL analizza descrizione + foto caricate → propone di spuntare automaticamente le caratteristiche nel form (balcone, ascensore, cantina, posto auto, vista, ecc.). Risparmia 1-2 min per annuncio. Richiede: vision-capable model (Gemini 3 Flash supporta immagini). Priority: P2 dopo M5.S3-S4. (Idea utente, 24 Giu)
- [ ] **✨ Suggerisci tag SEO** — meta description + keyword + struttura H1/H2 per la pagina annuncio pubblica B2C
- [ ] **✨ Stima prezzo coerente** — confronto con valutatore GIS + recenti vendite → flag automatico se prezzo annuncio fuori-mercato ±20% (warning in form, non blocco)
- [ ] **✨ Lint annuncio** — AL controlla che descrizione non contenga numeri di telefono/email (vietato sui portali), claim non verificabili, refusi gravi

---

### 🚨 PRIORITÀ STRATEGICA RIVISTA (D-032, 24 Giu 2026)

Dopo l'analisi business completa (vedi `BUSINESS_MODEL.md`):

**Roadmap aggiornata in ordine di valore economico**:
1. ✅ M5.S1 AL Agents (24 Giu) — fatto
2. ✅ M5.S3 AL Legal (24 Giu) — fatto
3. 🟡 **M5.S4 Virtual Staging** ← NEXT (abilita vetrina/premium B2C, Stream 3)
4. 🟡 **M4 Stripe + Crediti + Monetizzazione B2C** ← post M5.S4 (sblocca Stream 2, 3, 4)
5. 🟡 **M5.S5 Comparatore Mutui** (sblocca Stream 5 marketplace, €150k/mese partner commission)
6. 🟡 **M5.S6 APE certification** (altro Stream 5)
7. 🟡 **M5.S2 AL Knowledge** (RAG manuale — quando il manuale è scritto)
8. 🔴 **M6 Omnia Academy** (Stream 7)
9. 🔴 Data insights B2B (Stream 6, anno 3+)

**Blocker M4**: nuova società Founder per credenziali bancarie Stripe.
**Blocker M5.S4**: `FAL_KEY` (free $5 credit da https://fal.ai/dashboard/keys).

### Strategia monetizzazione (Founder, 23 Giu)
- **M4 (Stripe + crediti + abbonamenti) rinviata** fino al completamento del gestionale + costituzione nuova società per registrazione marchi e credenziali bancarie
- Sequenza definitiva: **M3 ✅ → M5 (AI Suite) → M6 (Academy) → M4 (Monetizzazione)**

### M4 — MLS + Stripe (5 sessioni) 🎉 VENDIBILE
- [ ] M4.S1 — MLS Network multi-agenzia
- [ ] M4.S2 — Workflow collaborazione 5gg
- [ ] M4.S3 — Stripe abbonamenti
- [ ] M4.S4 — Sistema crediti pay-as-you-go
- [ ] M4.S5 — Punti visibilità

### M5 — AI Suite (4 sessioni)
- [ ] M5.S1 — AI Copywriter annunci
- [ ] M5.S2 — Chatbot "Al" pubblico
- [ ] M5.S3 — Comparatore mutui
- [ ] M5.S4 — Modulistica AI + Visure

### M6 — Omnia Academy (5 sessioni) 🏆 COMPLETO
- [ ] M6.S1 — Struttura LMS base
- [ ] M6.S2 — Quiz + Certificazioni
- [ ] M6.S3 — Chatbot tutor "Al Academy"
- [ ] M6.S4 — Marketplace agenti certificati
- [ ] M6.S5 — Crediti formativi + FIAIP

---

## Backlog Futuro (post-M6)

Idee parcheggiate qui per non far scope creep:
- PWA mobile agenti
- Virtual Cleaning AI + Interior Redesign AI
- Firma digitale FEA/FEQ (Namirial/Aruba)
- WhatsApp Business + Booking
- Catasto reale (VisureItalia/Sister)
- Social publishing (FB/LinkedIn)
- App nativa iOS/Android

---

## Legenda stati

- ⏸️ Not Started
- 🟡 In corso
- ✅ Completato
- 🔴 Bloccato
- ⏭️ Spostato a backlog futuro
