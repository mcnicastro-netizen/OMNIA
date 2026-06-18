# 🗺️ ROADMAP OMNIA — Stato avanzamento

**Ultimo aggiornamento**: 18 Giugno 2026
**Riferimento completo**: vedi `PROGRAMMA_OMNIA.md` (v2.1) e `COMPETITIVE_ANALYSIS_IDEALISTA.md`

---

## Stato attuale

🟢 **M2.S1→S5 ✅ DONE (95%)** — resta solo M2.S6 (Custom Domain) + 🔴 nuova P0 D-FUTURE-07 (AI Smart Import Clienti).

```
M1   M2    M3  M4  M5  M6
✅   🟢    ⏸️  ⏸️  ⏸️  ⏸️
100% 95%  0%  0%  0%  0%
```

### 🔥 Sessione 18 Giugno 2026 — Riassunto

Completato in un giorno:
- **M2.S5 Layer D Phase 2** — Theme Registry & Site Generation (4 temi headless consumano brand_profile estratto)
- **Social Share** su property pubblica (WA · FB · Email · Copy)
- **D-FUTURE-04 Smart Clients List** — editorial-sober (AI Lead Score sort, bucket pills, temperature monocroma, action hint)
- **Inline Click-to-Call/WhatsApp** sulle row clienti con messaggio AI-precompilato
- **UI CSV Import Clienti** (`/it/app/clients/import`)

Test totali: **30/30 backend pytest passed**, 0 regressioni.

### 🔴 Nuova priorità emersa: D-FUTURE-07
Il Founder ha fatto notare che il CSV template richiede 5-13h per 100 clienti → barriera all'adoption. La soluzione è applicare il pattern Brand-Extractor (Gemini parsa input non strutturato → schema OMNIA) alla migrazione clienti. **P0 per la prossima sessione.**

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
- [ ] 🆕 **M2.S3.5 — Property↔Seller link** (mini-sprint, mezza giornata) [D-026]
  - `Property.seller_client_id` con dropdown autocomplete in form immobile
  - Tab "Immobili in carico" nella scheda Cliente seller
  - Pannello "Contatti proprietario" nella scheda immobile
  - **Razionale**: prerequisito M2.S4 (matching deve sapere chi vende cosa)
- [ ] 🔥 **M2.S4 — Matching Engine + Lead Scoring AI** [D-025]
  - Layer 1: Property↔Client match score deterministico
  - Layer 2: Lead Scoring AI (Gemini-3 Flash via Emergent LLM Key)
  - Layer 3: Vista Match per immobile/cliente + notifica email
- [ ] 🔥 **M2.S5 — Multiposting XML + Clone-from-URL** [D-023]
  - Feed XML in uscita verso portali (Idealista, Immobiliare.it, Casa.it, Wikicasa)
  - Feed XML compatibile sito esistente (anti-Agestanet, D-017)
  - **Clone-from-URL**: Playwright + Gemini Vision → bundle Next.js statico identico
- [ ] **M2.S6 — Theme registry + White Label headless** [D-022]
  - Theme registry per agenzia (S3 versioned bundles)
  - Editor visuale base + custom domain CNAME
  - CI per build automatico

### M3 — ImmobilCloud MVP (5 sessioni)
- [ ] M3.S1 — Home pubblica + design system
- [ ] M3.S2 — Ricerca + Mappa + Filtri
- [ ] M3.S3 — Scheda immobile + Contatto agente
- [ ] M3.S4 — Valutatore GIS pubblico
- [ ] M3.S5 — Pubblicazione annuncio privato

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
