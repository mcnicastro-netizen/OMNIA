# 🗺️ ROADMAP OMNIA — Stato avanzamento

**Ultimo aggiornamento**: Gennaio 2026
**Riferimento completo**: vedi `PROGRAMMA_OMNIA.md`

---

## Stato attuale

🟡 **M2 IN CORSO** — M2.S1 + S2 + S2bis done (~38%), prossima M2.S3 (CRM clienti)

```
M1  M2  M3  M4  M5  M6
✅  🟡  ⏸️  ⏸️  ⏸️  ⏸️
100% 38% 0%  0%  0%  0%
```

### ⏸️ SESSIONE INTERROTTA il 12 Giu 2026 — Ripresa da qui:

**🚨 P0 PRIMA COSA AL RIENTRO**: Founder ha segnalato labels strani in Settings + sidebar (es. "Unione" invece di "Immobili", "Consiglio" invece di "Clienti", "Dati quadrati" invece di "Dati fiscali", "Invece cibi" invece di "Colore primario"). Probabile Chrome auto-translate (già visto con Aruba). Azione:
1. Chiedere al Founder di provare "Mostra originale" sulla pagina
2. Se persiste → audit completo `/app/frontend/src/shared/i18n/locales/it.json` per chiavi mancanti/duplicati e fix labels
3. URL preview pagina Settings da ispezionare: `https://audit-tool-12.preview.emergentagent.com/it/app/settings`

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

### M2 — ImmoWeb MVP (6 sessioni)
- [x] **M2.S1 — Dashboard agenzia + onboarding** ✅ (12 Giu 2026)
  - Backend: `Agency` model (fiscal/address/contact/branding) + `AgencyInvite` model con magic-link token
  - 9 endpoint nuovi: POST/GET/PATCH `/app/agencies`, POST/GET/DELETE `/app/agencies/me/invites`, GET `/app/agencies/me/members`, GET `/app/invites/verify`, POST `/app/invites/accept`, GET `/app/dashboard/kpis`
  - Magic-link flow completo: invito → email Resend → verify pubblico → accept (set password) → auto-login
  - Slug auto-generato per agenzia (con dedup)
  - Indici Mongo: `agencies.slug` (unique), `agency_invites.token` (unique), compound `(agency_id, status)`, `(agency_id, email)`
  - Template email IT/EN/ES per invito agenzia (Resend)
  - Frontend: `OnboardingWizard` 4-step (Identity → Fiscal → Branding → Done), `AgencyShell` con sidebar navy + topbar, `DashboardPage` con 6 KPI cards (2 reali: members/invites; 4 locked M2.S2/S3/S4), `MembersPage` con tab Attivi/Inviti + invite modal + revoca, `SettingsPage` per edit agenzia, `AcceptInvitePage` pubblica
  - 5 nuovi data-testid namespaces (`onb-*`, `kpi-*`, `sidebar-nav-*`, `invite-*`, `accept-*`)
  - i18n IT/EN/ES esteso (75+ chiavi nuove)
  - Routing: redirect automatico `agency_admin` senza agency → `/app/onboarding`
- [x] **M2.S2bis — Upload foto immobili** ✅ (12 Giu 2026)
  - PhotoUploader: drag&drop, resize client-side 1600px, JPEG 82%, max 15 foto, set cover, riordino, delete
  - Integrato in PropertyFormPage (new + edit), stoccaggio base64 nel doc Mongo (migrazione S3 in M3)
- [x] **M2.S2 — CRUD Immobili + Import CSV/XML** ✅ (12 Giu 2026)
  - Backend `Property` model (16 tipi, 25 features, 6 stati), `ImportJob` audit
  - 9 endpoint REST + CSV template + bulk CSV/XML import
  - XML feed parsing Italian-friendly (Immobiliare.it/Idealista/generico)
  - **Parser DEDICATO Agestanet** (`import_agestanet.py`): mappatura 51 codici tipologia, classi energetiche DL 192/DL 90/2013, condizioni, riscaldamento, fino a 15 foto. Auto-detection: se XML contiene `cod_tipologia` o `id_agenzia` → parser Agestanet attivato automaticamente.
  - Frontend: PropertiesPage, PropertyFormPage (8 sezioni, 25 feature checkboxes), PropertyImportPage (CSV+XML wizard + **modalità "Incolla XML"** per casi in cui non è disponibile URL pubblico)
  - i18n 90+ chiavi nuove, KPI properties_active reale, sidebar Immobili sbloccata
  - Testato E2E con XML formato Agestanet reale (Villa Mascalucia, App. Acireale, App. Catania) → 3/3 importati senza errori
- [ ] M2.S3 — CRM clienti + Richieste
- [ ] M2.S4 — Matching engine
- [ ] M2.S5 — Multiposting XML portali
- [ ] M2.S6 — White Label base

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
