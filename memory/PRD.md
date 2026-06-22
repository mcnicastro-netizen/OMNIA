# OMNIA Real Estate — Product Requirements Document

**Versione**: 1.0
**Data**: Gennaio 2026
**Founder**: mcnicastro-netizen
- **Stato progetto**: 🎉 **M1 ✅ + M2 ✅ 100% DONE** • **M3.S1 ✅ + M3.S2 ✅ + M3.S3 ✅ + M3.S4 ✅ + M3.S4.1 ✅ + M3.S5 v2 ✅ DONE** — Portale B2C ImmobilCloud completo: Home, Registrazione segmentata, Publishing Center agente, Mappa Leaflet, Pagina dettaglio pubblica con form contatto e notifica email Resend all'agente, **Pubblicazione annunci da privati (B2C) gratuita con workflow moderazione admin** (free-tier 1 attivo, queue admin approve/reject con notes). Funnel acquisizione + UGC chiuso end-to-end. • Prossimo: **M3.S6 Valutatore GIS pubblico (27k zone OMI)** o **M3.S7 Account B2C con saved searches + alert email**

---

## Problem Statement

Costruire OMNIA, ecosistema digitale verticale completo per il settore immobiliare italiano, composto da 3 piattaforme integrate:

1. **ImmobilCloud** — Portale immobiliare B2C (privati + pubblico)
2. **ImmoWeb** — Gestionale CRM B2B per agenzie immobiliari
3. **Omnia Academy** — Piattaforma di formazione agenti certificata

**Vision**: "Più valore, più efficienza, più risultati."

**Differenziale competitivo** (vs Idealista / Immobiliare.it / Casa.it — analisi 16 Giu 2026):

📊 **Stack tradizionale agenzia italiana = €10.000-12.000/anno**:
- Immobiliare.it (30 spazi): ~€500/mese = €6.000/anno (fonte: forum immobilio.it Dic 2025)
- Idealista (30 annunci): ~€250/mese = €3.000/anno
- Gestionale tipo Gestim/Getrix: €80-150/mese = €1.500/anno

💰 **OMNIA fase lancio = €348-948/anno (-95%)** — Starter €29, Pro €29, Agency €79

🎯 **Gap del mercato che OMNIA chiude**:
| Feature | Idealista | Immobiliare.it | Wikicasa | Getrix | OMNIA |
|---|:-:|:-:|:-:|:-:|:-:|
| Pricing trasparente in homepage | ❌ | ❌ | ❌ | ❌ | ✅ |
| AI nativa nel CRM | ❌ | ⚠️ | ❌ | ❌ | ✅ |
| White-label sito agenzia su dominio proprio | ❌ | ❌ | ❌ | ❌ | ✅ |
| Academy integrata | ⚠️ | ❌ | ❌ | ❌ | ✅ |
| MLS aperto (no franchising) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Lead scoring AI (qualità lead) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Migrazione "clone del vecchio sito" | ❌ | ❌ | ❌ | ❌ | ✅ |
| Privacy 4 livelli dinamica | ❌ | ❌ | ❌ | ❌ | ✅ |
| Nessun setup fee / nessun lock-in | ❌ | ❌ | ❌ | ❌ | ✅ |

🔥 **Scoperte chiave** (vedi `COMPETITIVE_ANALYSIS_IDEALISTA.md` per dettagli):
- **Immobiliare.it Pro = Getrix rebrand** (acquisizione, 16.000 installazioni legacy → pool migrabile)
- **Idealista NON ha CRM proprio**: rivende Miogest/Gestim/Casa.it (debolezza strategica)
- **Lamentela #1 mercato**: lead poco qualificati → risolta da Lead Scoring AI (D-025)
- **Tutti hanno pricing opaco** ("Contattaci") → OMNIA mette listino in homepage

---

## User Personas

1. **Privato Acquirente/Venditore** — usa ImmobilCloud per cercare/pubblicare
2. **Agente Immobiliare** — usa ImmoWeb come strumento di lavoro quotidiano
3. **Broker / Titolare Agenzia** — usa ImmoWeb + Analytics + MLS + Academy
4. **Studente Academy** — usa Omnia Academy per certificarsi
5. **Partner Finanziario (banca/mutui)** — riceve lead qualificati

---

## Core Requirements (Static)

### Funzionali
- Multi-tenant (ogni agenzia isolata)
- Multi-utente per agenzia con ruoli
- Multi-lingua (IT primario, EN export)
- Privacy GDPR-compliant
- White Label brandizzabile

### Non funzionali
- Mobile-first responsive
- Performance: < 2s load time
- SEO ottimizzato
- Backup giornaliero
- Audit log completo

---

## What's Been Implemented

### Pre-progetto (eredità da Immocloud-2.0 + IMMOWEB)
- ✅ Modelli dati canonici allineati (Phase A+B, 104 test) — documentati
- ✅ Adapter bidirezionale cross-repo
- ✅ Feed XML multi-portale (documentato, da riportare)
- ✅ MLS Security + Privacy 4 livelli (documentato, da riportare)
- ✅ Workflow collaborazione 5gg (documentato, da riportare)
- ✅ Valutatore GIS con 27.228 zone OMI (documentato, da riportare)

### M2 — ImmoWeb MVP (Agency CRM)
- ✅ **M2.S2 (12 Giu 2026)** — CRUD Immobili + Import CSV/XML:
  - Backend `Property` model (16 tipi, 25 boolean features, 6 stati, energy class, owner riservato, photos, geo)
  - 9 endpoint REST CRUD + CSV template download + POST /import/csv + POST /import/xml
  - Bulk import audit log (`ImportJob` con errori per riga)
  - XML feed parsing flessibile (alias Italian: titolo/prezzo/mq/vani + Immobiliare.it/Idealista compatible)
  - Frontend: `PropertiesPage` (grid card + filtri + search), `PropertyFormPage` (form 8 sezioni con 25 feature checkboxes), `PropertyImportPage` (CSV+XML wizard amichevole 3-step)
  - i18n IT: 90+ chiavi (16 tipi, 25 features, condizioni, ecc.)
  - KPI dashboard "properties_active" ora REALE
  - Sidebar Immobili sbloccata
- ✅ **M2.S1 (12 Giu 2026)** — Dashboard agenzia + onboarding:
  - Backend `Agency` model (fiscal/address/contact/branding) + `AgencyInvite` (magic-link)
  - 9 endpoint REST `/api/app/agencies/*`, `/api/app/invites/*`, `/api/app/dashboard/kpis`
  - Magic-link flow E2E: invito → email Resend → verify → set password → auto-login
  - Frontend: `OnboardingWizard` 4-step, `AgencyShell` (sidebar navy + topbar), `DashboardPage` con KPI grid, `MembersPage` (tab Attivi/Inviti + modal invito + revoca), `SettingsPage`, `AcceptInvitePage`
  - 3 template email IT/EN/ES per invito agenzia
  - Indici DB ottimizzati (slug unique, token unique, compound agency_id+status)
  - 75+ chiavi i18n aggiunte
  - Tested via curl end-to-end + Playwright UI flow

### M1 — Foundation
- ✅ **M1.S1 (10 Giu 2026)** — 3 decisioni architetturali approvate:
  - Monorepo Turborepo (D-011)
  - Sottodomini corti su omniarealestateecosystem.it (D-012)
  - Shared schema MongoDB multi-tenant (D-013)
- ✅ **M1.S2 (11 Giu 2026)** — Setup monorepo + struttura base:
  - i18n nativa IT/EN/ES con react-i18next + auto-detection browser (D-014)
  - Logical Monorepo implementato (D-015): backend `apps/` + `shared/`, frontend `apps/` + `shared/`
  - MongoDB connesso con indici tenant-aware su 6 collection
  - Endpoint health funzionanti: `/api/`, `/api/health`, `/api/core/health`, `/api/cloud/health`, `/api/app/health`, `/api/learn/health`
  - 4 app frontend live: Landing (`/{lang}`), ImmoCloud (`/{lang}/cloud`), ImmoWeb (`/{lang}/app`), Academy (`/{lang}/learn`)
  - Componenti condivisi: `LanguageSwitcher`, `HealthBadge`, axios client con header `Accept-Language` auto
  - Routing intelligente con redirect lingua + 404 personalizzato
  - Design distintivo per app (Landing chiaro/serif, Cloud dark, Web stone, Academy cream)
- ✅ **M1.S3 (11 Giu 2026)** — Auth JWT + Ruoli + Multi-tenant:
  - bcrypt + PyJWT installati
  - 7 endpoint auth: register, login, me, refresh, logout, forgot-password, reset-password
  - 5 ruoli: super_admin, agency_admin, agent, client, student
  - JWT HS256 (access 15min, refresh 7gg) in cookie httpOnly+secure
  - Brute force protection (5 tentativi = lockout 15 min)
  - Admin auto-seeding (mcnicastro@gmail.com)
  - Resend integration con 6 template email (welcome+reset × IT/EN/ES)
  - Frontend: AuthProvider, ProtectedRoute, LoginPage, RegisterPage, ForgotPasswordPage, DashboardPage
  - i18n integrato in tutto auth flow
- ✅ **M1.S4 (11 Giu 2026)** — Deploy preview + dominio:
  - SEO/OG tags multi-lingua in `index.html` (title, og, twitter card, JSON-LD Organization)
  - 4 hreflang links (it/en/es/x-default) + canonical pointing to `omniarealestateecosystem.it`
  - **Design north-star** salvato in `/app/memory/DESIGN_NORTHSTAR.md` (palette navy `#0B1E3F` / teal `#1F6B5C` / viola `#4B3D7A` / oro `#C8A653`, font Fraunces + Inter, principi anti-AI-slop)
  - **DNS setup guide** in `/app/memory/DNS_SETUP_GUIDE.md` (apex + sottodomini cloud./app./learn./api.)
  - **Resend domain guide** in `/app/memory/RESEND_DOMAIN_GUIDE.md` (skip in M1, da fare prima onboarding agenzie)
  - `.gitignore` fix: rimosso `.env*` blocking
  - `CORS_ORIGINS` esteso per produzione (apex + 4 sottodomini)
  - Deploy readiness check: ✅ PASS

### M2 — ImmoWeb (in corso)
- **M2.S1** ✅ Agency Onboarding + Dashboard + Magic-Link Team Invites (Resend)
- **M2.S2** ✅ Property CRUD (16 types, 25 features) + Photo Uploader (base64/canvas resize) + CSV Import + Custom Agestanet XML Parser (65 properties test OK)
- **M2.S2bis** ✅ Cross-app unified TopNav + Desktop UI overflow fixes
- **Settings UI refactor** ✅ (16/06/2026) — Rimossi logo URL + color picker. Aggiunta sezione "Sito web agenzia" con 2 modalità: external (URL + futuro feed XML M2.S5) | omnia_template (galleria M2.S6).
- **M2.S3** ✅ (16/06/2026) — **CRM Clienti completo**: backend CRUD `/api/app/clients` con filtri (q/status/client_type/operation/city) + paginazione + CSV import + CSV template. Frontend `ClientsPage` (lista con tabella + filtri) + `ClientFormPage` (anagrafica + preferenze ricerca idealista-style: operation, property_types[], cities[], zones[], price/surface/rooms/bathrooms ranges, conditions[], floor_preferences[], must_have_features[], energy_min_class, needs_photos/virtual_tour, GDPR consent). Sidebar `Clienti` sbloccata. 15/15 pytest backend + 7/7 flussi UI passed.
- **M2.S3.5** ✅ (17/06/2026, D-026) — **Property↔Seller bidirectional link**: aggiunto `Property.seller_client_id`, endpoint `/clients/sellers` (autocomplete), `/clients/{id}/properties` (immobili in carico). UI SellerPicker combobox nel form immobile + sezione "Immobili in carico" nella scheda Cliente seller/landlord. PATCH null-clear supportato. 10/10 pytest backend + flussi UI passed.
- **M2.S4** ✅ (17/06/2026, D-025) — **Matching Engine + Lead Scoring AI**: algoritmo deterministico 14 criteri/100pt (`matching.py`), 4 endpoint REST (`/matches`, `/matches/property/{pid}`, `/matches/client/{cid}`, POST `/matches/lead-score`). **Lead Scoring AI con Gemini-3-flash-preview via Emergent LLM Key + fallback rule-based.** Output AI in italiano naturale: score 0-100 + temperatura (freddo/tiepido/caldo/rovente) + reasons[] + action_hint commerciale. Frontend MatchesPage (card colorate per temperatura + filtro min_score) + MatchLeadScorePage (banner + action card + reasons + breakdown). Sidebar `Match` sbloccata. 17/17 pytest backend + flussi UI passed. Costo medio Gemini per call: ~$0.001.
- **M2.S5 Layer A** ✅ (18/06/2026, D-029) — **Portal Manager**: backend `/api/app/portals` (catalog GET + CRUD + test endpoint) con encryption AES-256 via Fernet sulle password portali. 7 portali catalogati al lancio (Idealista, Immobiliare.it, Casa.it, Wikicasa, Subito.it, Facebook Catalog, LinkedIn). Frontend `PortalsPage` con tabella sottoscrizioni + modale subscribe + card portali disponibili. Sidebar `Portali` attiva. Layer B/C/D in arrivo (XML feed gen / site-as-feed / clone-from-URL).
- **M2.S5 Layer B** ✅ (18/06/2026, D-028) — **OSF v1.0 Public Feed**: endpoint pubblici `GET /api/feed/{slug}.xml`, `GET /api/feed/{slug}.json`, `GET /api/feed/schema/osf-v1.json` (NO auth, portali pullano anonimamente). Schema OMNIA Standard Feed: clean (stringhe non codici numerici), dual XML+JSON, AI-extended namespace `omnia:*`, JSON Schema documentato pubblicamente per invitare adozione come standard. Testato E2E: 200 OK con feed valido + 404 su slug sconosciuto + multi-tenant rispettato.
- **M2.S5 Layer C** ✅ (18/06/2026) — **Public Site (HTML SEO crawlable)**: 4 endpoint pubblici per consumatori esterni (Idealista pull, Google bot, share social):
  - `GET /api/p/{slug}/` — agency listing index (HTML server-rendered, schema.org RealEstateAgent JSON-LD)
  - `GET /api/p/{slug}/{pid}` — single property page con OG tags + schema.org Product/RealEstateListing JSON-LD + photos lazy + canonical
  - `GET /api/p/{slug}/sitemap.xml` — sitemap XML standard (lastmod, changefreq, priority)
  - `GET /api/public/property/{pid}/photo/{i}` — binary JPEG da base64 con `Cache-Control: max-age=86400`
  - Owner block strippato sempre; styling base inline (clean, fast load <6KB). Verificato 200 OK + JSON-LD valido + 404 su slug/pid sconosciuti.
- **M2.S5 Layer D Phase 1** ✅ (18/06/2026, D-023) — **Brand Profile Extractor**: `POST /api/app/website/extract-from-url` con httpx + BeautifulSoup + Gemini-3-flash-preview. Estrae da un URL fornito dall'agenzia: palette (4 hex), typography (family+scale), structure (header/hero/nav/card style), voice (tone+tagline), logo_hint, confidence 0-100. Persistito in `agency.website.extracted_profile`. Verificato su tecnocasa.it: palette esatta (#00843D verde + #FFF200 giallo) + hero `search_box_centered` + confidence 95.
- **M2.S5 Layer D Phase 2** ⏳ — Bundle Next.js generation + CNAME deploy (rinviato a M2.S6 Theme Registry)
- **M2.S5 Layer A++** ⏳ — Cron worker reale push portali push_api
- **Hardening 18/06/2026**:
  - 💰 **Lead Score caching** (24h TTL via MongoDB index) — call seguente cache-hit 55× più veloce, zero costi Gemini ripetuti. `force_refresh=true` per bypass manuale.
  - 🎯 **Match preview inline** nel PropertyFormPage (edit mode): top 3 clienti compatibili con score badges + link diretto al Lead Score AI page. Riduce drasticamente i click per arrivare al valore.
  - 🛡️ **Error Boundary globale** in App.js — zero white-screen of death in produzione, UI di recovery con tasto Ricarica/Home + dettaglio tecnico collapsable.
- **M2.S5 Layer B+C+D** ⏳ — XML Feed Generator (OSF schema D-028) + Site-as-Feed pages + Clone-from-URL (D-023)
- **M2.S5** ⏳ XML Multiposting/Feed Output — *user has "secret idea" to discuss prima del coding*
- **M2.S6** ⏳ White Label + Template Gallery

### M3 — ImmobilCloud
*Non ancora iniziata*

### M4 — MLS + Stripe
*Non ancora iniziata*

### M5 — AI Suite
*Non ancora iniziata*

### M6 — Academy
*Non ancora iniziata*

---

## Prioritized Backlog

Riferimento completo: vedi `ROADMAP.md`

### P0 (M1-M4) — MVP vendibile
- Foundation + Auth multi-tenant
- ImmoWeb completo (CRM agenzie)
- ImmobilCloud (portale pubblico)
- MLS + Stripe + crediti + visibilità

### P1 (M5-M6) — Vantaggio competitivo
- AI Suite (Copywriter, Chatbot, Mutui, Modulistica)
- Omnia Academy completa

### P2 (Post-M6) — Espansione
- PWA mobile
- Virtual Cleaning + Interior Redesign AI
- Firma digitale reale
- WhatsApp Business
- Catasto reale
- Social publishing

---

## Test Credentials

Vedi `test_credentials.md` (creato al primo deploy).

---

## Architettura tecnica (da confermare in M1.S1)

### Stack
- **Frontend**: React 18 + Tailwind + shadcn/ui
- **Backend**: FastAPI (Python 3.11+)
- **Database**: MongoDB (Motor async driver)
- **Hosting**: Emergent Platform
- **AI**: Gemini via Emergent LLM Key
- **Payment**: Stripe
- **Email**: SendGrid
- **Storage**: Emergent Object Storage
- **Geocoding**: Nominatim (OSM, free)

### Pattern
- Multi-tenant con `agency_id` su ogni documento
- JWT auth con refresh token
- Webhook Stripe per pagamenti
- Cron jobs per multiposting XML
- Background tasks per AI generation

---

*Prossima revisione: al termine di M1*
