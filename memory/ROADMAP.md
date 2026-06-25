# 🗺️ ROADMAP OMNIA — Stato avanzamento

**Ultimo aggiornamento**: 25 Febbraio 2026
**Riferimento completo**: vedi `PROGRAMMA_OMNIA.md` (v2.3), `CHANGELOG.md` e `BUSINESS_MODEL.md`

---

## Stato attuale (25-Feb-2026 — PAUSA founder)

🟢 **M1+M2+M3+M5.S1+M5.S3+M3.S6-pro ✅ DONE**

```
M1   M2   M3   M3.S6-pro  M5.S1  M5.S3  M4   M5.S2  M5.S4  M6
✅   ✅   ✅   ✅         ✅     ✅     ⏸️   ⏸️     ⏸️     ⏸️
100% 100% 100% 100%       100%   100%   0%   0%     0%     0%
```

### ✅ Completato 25-Feb-2026
- **M3.S6-pro GIS Valuator Pro**: copertura nazionale (Nominatim province fallback), UNI 10750 commercial surface, coefficienti merito (piano/esposizione/affaccio/riscaldamento/ascensore/anno) + regionali + vincoli/locazione. 37/37 backend + 4/4 frontend E2E PASS.
- **CTA Compare Market**: bottone dorato su pannello risultato → deep-link a `/it/cloud/search` con filtri precompilati (city + property_type + price ±20%) → funnel Valutazione → Lead.

### 🔴 Prossima sessione (post-pausa)
**Opzioni in ordine di priorità**:
1. 🟡 **ANNCSU Sprint 2** — autocomplete/validazione indirizzi nel Valuator (P1, ~1 giorno)
2. 🔍 **Code Review pre-produzione** — analisi statica completa codebase prima di entrare in M4 Stripe (P1, ~0.5 giorni, raccomandato prima del go-live)
3. 🎨 **M5.S4 Virtual Staging** — fal.ai (SAM 2 + Flux Inpainting + Real-ESRGAN), **bloccato in attesa FAL_KEY founder**
4. 📚 **M5.S2 AL Knowledge** — RAG sul manuale utente, **bloccato in attesa che il manuale sia scritto**


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
