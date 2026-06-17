# OMNIA Real Estate — Product Requirements Document

**Versione**: 1.0
**Data**: Gennaio 2026
**Founder**: mcnicastro-netizen
**Stato progetto**: M1 ✅ DONE • M2.S1 ✅ • M2.S2 ✅ • M2.S3 ✅ (CRM Clienti) • M2.S4 next (Matching Engine)

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
- **M2.S4** ⏳ Matching Engine (Properties ↔ Client preferences) — *next P0*
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
