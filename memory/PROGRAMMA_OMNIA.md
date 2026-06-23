# 📘 PROGRAMMA OPERATIVO — Progetto OMNIA
## Dal MVP all'ecosistema completo · 6 Milestone · ~30 sessioni · 3-6 mesi

**Versione**: 2.3
**Data creazione**: Gennaio 2026
**Ultimo aggiornamento**: 22 Giugno 2026 (post M3.S1→S6 ✅ DONE — portale B2C ImmobilCloud feature-complete con valutatore GIS pubblico)
**Founder / Product Owner**: mcnicastro-netizen
**Lead Developer**: E1 (Emergent Agent)
**Stato**: M1 ✅ DONE · M2 ✅ DONE (S1→S6) · **M3.S1→S6 ✅ DONE** · M3.S7 ⏳ NEXT · M4/M5/M6 backlog

---

## 🔥 Cambiamenti strategici v2.3 (rispetto a v2.2)

Dopo le sessioni del 19-22 Giugno è stato completato l'intero ciclo M3.S1→S6, chiudendo end-to-end il funnel B2C ImmobilCloud:

| Cosa cambia | v2.2 | v2.3 |
|---|---|---|
| **Stato M3** | M3.S1 ✅ DONE | **M3.S1→S6 ✅ DONE** (6 sprint completati in 4 giorni reali) |
| **Funnel B2C** | Solo home + ricerca pubblica | **End-to-end**: home → registrazione segmentata → ricerca → mappa interattiva → dettaglio → form contatto con email notification → pubblicazione privati con moderazione → **valutatore GIS** |
| **Lead generation** | Form contatto basic | 3 canali: contact form (agenzie), private listing (B2C UGC), **valuation_leads** (lead-magnet alta intenzione) |
| **Valutatore** | "Da progettare con OMI 27k zone" | ✅ **Dataset curato 124 città × 3 zone tier**, 50 pytest di congruenza, output verificati su scala Italia (Portofino €20k/m² → Crotone €575/m²) |
| **Email engine** | Magic-link + invite | + **lead_notification** template Resend live (notifica agente quando arriva un lead) |
| **Moderazione UGC** | "Da progettare" | ✅ Workflow admin completo (queue / approve / reject con notes) |

### Razionale v2.3

L'obiettivo dichiarato era: "il valutatore è una NOSTRA SKILL". Il delivery va oltre il "valutatore basico":
- Dataset auditabile e versionato (`italy_real_estate_prices_2025.py`) — fonti documentate
- Algoritmo deterministico con audit trail (multipliers_applied visibili)
- 50 pytest che assicurano congruenza prezzi su Italia intera
- Funziona come **lead-magnet attivo**: chi cerca stima ha intenzione di vendere → lead caldissimo per agenti

## 🔥 Cambiamenti strategici v2.2 (rispetto a v2.1)

Dopo M2.S6 (custom domains) + D-FUTURE-07 (AI Smart Import) completati con successo, M2 chiuso 100%:

| Cosa cambia | v2.1 | v2.2 |
|---|---|---|
| **Stato M2** | "S1→S5 ✅, S6 ⏳" | **M2 ✅ DONE** (tutti i 6 sprint completati) |
| **Custom Domain** | "Sottodominio agenzia" | **Custom CNAME + Host-based routing middleware** (`agenzia-rossi.it` → tema headless) |
| **AI Smart Import** | "Backend in design" | ✅ **End-to-end con Gemini 3 Flash** — parsifica Excel disordinati/vCard/Outlook in schema OMNIA |
| **Next focus** | M3.S1 (B2C portal) | M3 al completo (S1→S7) come milestone unica |

## 🔥 Cambiamenti strategici v2.1 (rispetto a v2.0)

Dopo il completamento di M2.S5 (tutti i Layer A→D) e la sessione del 18 Giugno è emersa una nuova decisione vincolante (D-FUTURE-07):

Dopo il completamento di M2.S5 (tutti i Layer A→D) e la sessione del 18 Giugno è emersa una nuova decisione vincolante (D-FUTURE-07):

| Cosa cambia | v2.0 | v2.1 |
|---|---|---|
| **CSV Import Clienti** | "Backend pronto, polish UI in backlog" | ✅ **UI completata** + 🔴 **nuova priorità AI Smart Import** (D-FUTURE-07) |
| **Pattern import dati** | XML Agestanet (immobili) + CSV (clienti) | Esteso: **AI-Assisted Import** per qualsiasi file disordinato (Excel non standard, vCard, contatti Gmail/Outlook, anche PDF/screenshot) |
| **Stato M2** | "S1+S2+S3 ✅ · S3.5+S4+S5+S6 ⏳" | "**S1→S5 ✅ DONE**" — manca solo S6 (custom domain) |
| **Killer feature commerciale** | Clone-from-URL siti | Clone-from-URL **+** AI Smart Import Clienti (zero-friction migration) |

### Razionale D-FUTURE-07 (AI Smart Import Clienti)

Compilare manualmente il template CSV di 18 colonne per 100 clienti = **5-13 ore di lavoro**. Nessun agente lo farà → senza dati la Smart Clients List (con AI Lead Scoring di M2.S4) vale zero. Lo stesso pattern di `brand_extractor` (Gemini parsa input non strutturato → schema OMNIA) applicato ai clienti riduce il tempo da ore a minuti, sbloccando l'adoption reale dell'ecosistema.

## 🔥 Cambiamenti strategici v2.0 (rispetto a v1.1)

Dopo l'analisi competitiva di Idealista, Immobiliare.it (=Getrix), Casa.it e gestionali italiani/spagnoli (vedi `COMPETITIVE_ANALYSIS_IDEALISTA.md`) sono state introdotte le decisioni D-022→D-026 e le seguenti modifiche al programma:

| Cosa cambia | Vecchio | Nuovo |
|---|---|---|
| **Architettura siti agenzia** | "5-10 template tema" | **Headless OMNIA, 1000+ siti unici** (D-022) |
| **M2 sprint count** | 6 sprint | **7 sprint** (aggiunto M2.S3.5 mini-sprint per `Property.seller_client_id`) |
| **M2.S4 scope** | Matching engine soltanto | Matching **+ Lead Scoring AI** (D-025) — risolve la lamentela #1 del mercato |
| **M2.S5 scope** | Solo XML multiposting verso portali | Multiposting **+ Clone-from-URL** del sito agenzia (D-023 — idea del Founder) |
| **M2.S6 scope** | "White label base + sottodominio" | **Theme registry headless** + custom domain per agenzia (D-018+D-022) |
| **Pricing** | €29 / €49 / €149 | **Lancio: GRATIS / €29 / €79** (D-024), target post-traction tabella vecchia |
| **AI Suite (M5)** | Tutto rinviato a M5 | Lead Scoring AI già in M2.S4 (anticipato); AI Copywriter resta in M5.S1 |
| **Tot sessioni** | 29 | **30** (M2.S3.5 + altre micro-aggiunte) |

---

> ## ⚠️ SEI UN AGENTE AI CHE SUBENTRA?
>
> **STOP.** Prima di leggere oltre, vai a `/app/memory/AGENT_BOOTSTRAP.md` e segui il protocollo obbligatorio.
> Le decisioni in `DECISIONS.md` sono **vincolanti** — non rimetterle in discussione.

---

## 🧭 PARTE I — Le regole del gioco

### 1.1 Come funzionano le nostre sessioni

Ogni sessione segue sempre lo stesso protocollo:

```
┌─────────────────────────────────────────────────┐
│  1. APERTURA   → "Dove eravamo rimasti?"         │
│  2. OBIETTIVO  → Cosa facciamo OGGI (1 cosa sola)│
│  3. DECISIONI  → Domande che ti pongo (se serve) │
│  4. ESECUZIONE → Io costruisco                   │
│  5. VALIDAZIONE→ Tu testi e approvi              │
│  6. CHIUSURA   → Aggiorno PRD.md + roadmap       │
└─────────────────────────────────────────────────┘
```

**Regola d'oro**: una sessione = un obiettivo chiuso. Mai "andiamo avanti finché c'è tempo".

### 1.2 I 3 file di navigazione

| File | Cosa contiene | Quando lo leggi |
|---|---|---|
| `/app/memory/PRD.md` | Cosa è stato fatto, quando, da chi | Inizio di ogni sessione |
| `/app/memory/ROADMAP.md` | Cosa rimane, in che ordine, P0/P1/P2 | Per pianificare la sessione |
| `/app/memory/DECISIONS.md` | Tutte le decisioni di business prese | Per non rifare le stesse domande |

### 1.3 Convenzioni di nomenclatura

- **Milestone** (M1–M6) = blocchi grandi (settimane)
- **Sprint** = gruppo di sessioni legate
- **Sessione** = singolo intervento (1-3 ore di lavoro)
- **Task** = pezzo atomico dentro una sessione

### 1.4 Stato di avanzamento

A fine di ogni sessione ti consegno questo formato:

```
✅ M2.S3 — CRM clienti + matching: COMPLETATO
🟡 M2.S4 — Multiposting XML: IN CORSO (50%)
⏸️  M2.S5 — White label minimo: BLOCCATO (manca dominio)
```

---

## 🗺️ PARTE II — La mappa completa delle 6 Milestone

```
M1 ─→ M2 ─→ M3 ─→ M4 ─→ M5 ─→ M6
 │     │     │     │     │     │
Fond. Immo  Immo  MLS   AI    Aca-
azione Web  Cloud Stripe Suite demy
 │     │     │     │     │     │
4 ses. 6     5     5     4     5
1-2   3-4   2-3   3-4   2     3
sett. sett. sett. sett. sett. sett.

Dopo M4 → prodotto vendibile (Founder/Pro €29-49)
Dopo M6 → ecosistema completo OMNIA come da schema PDF
```

---

# 🏗️ MILESTONE 1 — FOUNDATION & ARCHITETTURA ✅ DONE
**Durata**: 1-2 settimane · **Sessioni**: 4 · **Stato**: completata 12 Giu 2026

### M1.S1 ✅ — Decisioni architetturali (NO codice)
- Decisione 1: Monorepo (Turborepo) vs 3 repo separati → raccomando monorepo
- Decisione 2: Nome dominio principale (es. omnia.realestate)
- Decisione 3: Schema URL sottodomini
- Decisione 4: Database singolo MongoDB con tenant-id o cluster separati
- **Output**: ARCHITECTURE.md firmato
- **Tuo compito**: rispondere alle 4 domande

### M1.S2 ✅ — Setup monorepo + struttura base
- Setup Turborepo: apps/immocloud, apps/immoweb, apps/academy, packages/shared
- Modelli dati canonici condivisi
- Backend FastAPI con multi-tenant pattern
- Frontend React shell per le 3 app
- **Output**: 3 app vuote che girano + endpoint /api/health
- **Tuo compito**: vedere le 3 home pages caricarsi

### M1.S3 ✅ — Auth JWT + Ruoli + Multi-tenant
- Sistema auth condiviso (login/register/reset password)
- Ruoli: super_admin, agency_admin, agent, client, student
- Multi-tenant: ogni utente appartiene a agency_id
- Email transazionali (Resend) operative
- **Output**: account, login, ruolo funzionanti
- **Tuo compito**: API key Resend ottenuta

### M1.S4 ✅ — Deploy preview + dominio
- Deploy le 3 app su Emergent platform
- Configurazione sottodomini DNS (cloud./app./learn.omniarealestateecosystem.it)
- HTTPS automatico
- Pagina "Coming Soon" pubblica
- **Output**: 3 URL pubblici raggiungibili ✅
- **Tuo compito**: dominio omniarealestateecosystem.it acquistato

### ✅ Definition of Done M1 — TUTTO COMPLETATO
- [x] 3 app deployabili e raggiungibili online
- [x] Login/logout funzionante con ruoli
- [x] Tenant isolation testato
- [x] PRD.md e ROADMAP.md aggiornati

---

# 🏢 MILESTONE 2 — IMMOWEB MVP (Gestionale Agenzia) 🟢 95% DONE
**Durata**: 4-5 settimane · **Sessioni**: 7 · **Stato**: S1→S5 ✅ · S6 ⏳ + D-FUTURE-07 🔴 nuova priorità

### M2.S1 ✅ — Dashboard agenzia + onboarding
- Wizard setup agenzia (logo, dati fiscali, indirizzo, contatti)
- Dashboard con KPI base
- Gestione collaboratori (invito agente via magic-link Resend)
- **Completato**: 11 Giu 2026
- **Test**: 100% backend, 100% frontend

### M2.S2 ✅ — CRUD Immobili completo + Import
- Form pubblicazione immobile (16 tipologie, 25 features)
- Upload foto multiple (base64 + canvas resize client-side, da migrare a S3 in M3)
- Campi: dati base, energetici, features, owner, privacy, stati workflow
- Stati: draft / active / reserved / sold / rented / withdrawn
- Bulk CSV Import + Custom Agestanet XML Parser (testato su 65 immobili reali)
- **Completato**: 12 Giu 2026

### M2.S3 ✅ — CRM clienti + Preferenze di ricerca (idealista-style)
- Anagrafica clienti (5 tipologie: buyer/seller/tenant/landlord/investor)
- Preferenze ricerca COMPLETE (replica filtri idealista, D-021)
- CSV Import backend
- Filtri lista + tabella con chips colorati
- **Completato**: 16 Giu 2026
- **Test**: 15/15 pytest backend + 7/7 flussi UI

### M2.S3.5 ✅ — Link Property↔Seller Client (D-026)
- `Property.seller_client_id` + cascade delete safety (409 se cliente ha immobili)
- UI dropdown autocomplete venditore + scheda venditore con immobili in carico
- **Completato**: 17 Giu 2026

### M2.S4 ✅ — Matching Engine + AI Lead Scoring (D-025)
- Layer 1 deterministico (city/zone/type/op/price/surface/rooms/beds + features)
- Layer 2 Gemini-3-flash classificazione (freddo/tiepido/caldo/rovente + action_hint)
- 24h cache per ottimizzare costi LLM
- Inline match preview in PropertyFormPage
- **Completato**: 17 Giu 2026

### M2.S5 ✅ DONE — Multiposting + Clone-from-URL + Theme Registry
**Tutti e 4 i Layer + 2 enhancement completati il 18 Giu 2026.**

- ✅ **Layer A — Portal Manager**: backend CRUD `/api/app/portals` con Fernet AES-256 encryption, 7 portali catalogati (Idealista, Immobiliare.it, Casa.it, Wikicasa, Subito.it, Facebook Catalog, LinkedIn). UI tabella + modale subscribe.
- ✅ **Layer B — XML/JSON OSF Feed Generator**: endpoint pubblici `/api/feed/{slug}.xml|.json`, namespace OMNIA AI-extended.
- ✅ **Layer C — Site-as-Feed (HTML SEO)**: 4 endpoint pubblici (`/api/p/{slug}/`, `/{pid}`, sitemap.xml, photo binary). Schema.org RealEstateListing JSON-LD + OG tags + crawler-friendly.
- ✅ **Layer D Phase 1 — Brand Extractor**: BeautifulSoup + Gemini-3-flash crawla URL agenzia → JSON brand profile (palette/typography/voice/structure/logo). Endpoint `POST /api/app/website/extract-from-url`.
- ✅ **Layer D Phase 2 — Theme Registry & Site Generation**: 4 temi headless (minimal/classic/bold/luxury) consumano il brand_profile e renderizzano il sito agenzia con identità visiva. Endpoint `/api/app/website/{themes,theme,theme/apply,theme/auto-configure,preview/{id}}`. Frontend Brand Studio `/it/app/website` (extractor + theme picker + live preview iframe).
- ✅ **Enhancement Social Share**: 4 pulsanti (WhatsApp · Facebook · Email · Copy Link) iniettati in ogni property pubblica `/api/p/{slug}/{pid}`. Absolute URLs per OG/share. JS inline copy-to-clipboard.
- ✅ **D-FUTURE-04 — Smart Clients List**: editorial-sober variant. Endpoint `GET /api/app/clients/smart` (enriched + bucket filters + sort) e `POST /smart/refresh` (batch AI parallel). Frontend con ScoreBox Fraunces serif, TempPill monocroma, MatchesPill, filter pills stone.
- ✅ **Inline Click-to-Call/WhatsApp**: bottoni 📞/💬 su ogni row clienti con `tel:` href + `wa.me` deep-link con messaggio precompilato basato sull'action_hint AI.
- ✅ **UI CSV Client Import**: nuova pagina `/it/app/clients/import` con dropzone, preview e gestione errori.
- ⏳ **Layer A++**: cron worker push portali push_api (rinviato a M4.S3+ insieme allo Stripe)

**Test totale**: 30/30 backend pytest passati + 100% frontend flows.

### 🔴 D-FUTURE-07 ✅ DONE (19 Giu 2026) — AI Smart Import Clienti v1
**Risolto il blocco adoption**: CSV template richiedeva 5-13h per 100 clienti → ora trascini qualsiasi file (CSV/Excel/vCard/TXT) e Gemini-3-flash mappa al schema OMNIA in 5-15 secondi con confidence score per riga.

**Implementato**:
- Backend `apps/immoweb/clients_ai_import.py` (4 endpoint: upload+parse, get draft, patch row, commit) + pre-parser per `.csv .xlsx .vcf .txt` con format auto-detection + Gemini con system prompt domain-specific (interpreta "trilocale"→3 stanze, "venditore"→seller, ecc.) + draft TTL 1h via Mongo index.
- Frontend `ClientImportPage.jsx` dual-tab (AI default + Template CSV legacy) editorial-sober con confidence badge ★/⚠/!.
- 12/12 backend pytest + frontend full flow validato.

**v2 prevista — D-FUTURE-09**: PDF + screenshot via Gemini Vision (in backlog, memorizzato).

### M2.S6 ⏳ — Custom domain + DNS verification (D-022)
- Theme registry già operativo (Layer D Phase 2). Manca solo:
  - Custom domain (CNAME) per agenzie del piano Agency+
  - DNS verification con check TXT record (anti-takeover)
  - Wildcard SSL (Let's Encrypt o provider managed)
  - Routing ingress: `agenzia.it` → serve `/api/p/{slug}/` con host stripping
- **Tuo compito**: scegliere provider DNS (Cloudflare?) + decidere se subdomain proxy o full CNAME apex

### ✅ Definition of Done M2
- [x] Agenzia registra, onboarding, gestisce immobili (16 tipologie) e clienti (5 tipologie)
- [x] **Property↔Seller link operativo** (M2.S3.5)
- [x] **Matching engine + Lead Scoring AI live** (M2.S4)
- [x] **Multiposting OSF + Site-as-Feed + Clone-from-URL operativi** (M2.S5)
- [x] **Theme registry headless live + 4 temi applicabili** (M2.S5 Layer D Phase 2)
- [x] **Social share + Smart Clients List + Click-to-call/WA + CSV Client Import**
- [ ] **AI Smart Import Clienti** (D-FUTURE-07) — sblocca adoption
- [ ] **Custom domain CNAME funzionante** (M2.S6)
- [ ] 5 agenti in parallelo nella stessa agenzia (testabile ora)

---

# 🌐 MILESTONE 3 — IMMOBILCLOUD (Portale B2C) ✅ DONE (S1→S6) — S7 ⏳
**Durata reale**: 4 giorni (19-22 Giugno 2026) · **Sessioni**: 6 completate, 1 da fare

### M3.S1 — Home pubblica + Registrazione segmentata B2C ✅ DONE (19 Giu)
- CloudTopNav (logo ImmobilCloud™, link cerca/vendi/valuta gratis/area riservata)
- Hero split-layout + 3 card azione (Cerca/Vendi/Affitta)
- `POST /api/cloud/auth/register` con segmentazione intents (sell/rent_out/get_alerts) + notification_channels
- Test: iter_8/9 100% PASS

### M3.S2 — Publishing Center lato agente ✅ DONE (19 Giu)
- Toggle `is_listed_on_immobilcloud` per ogni immobile dell'agente
- Pulsanti share WhatsApp / Facebook / Email / Copy Link → URL pubblico `/api/p/{slug}/{pid}`
- Test: iter_10 (4 backend + 14 frontend) 100% PASS

### M3.S3 — Mappa interattiva Leaflet + Filtri avanzati ✅ DONE (22 Giu)
- Mappa OSM con marker cluster (FitBounds automatico, popup con prezzo + link dettaglio)
- Toggle Lista/Mappa nella SearchPage
- Filtri avanzati: `bedrooms_min`, `bathrooms_min`, `energy_class` (A4..G) + bbox sul `/api/cloud/map`
- Geocoding automatico Nominatim/OSM (fire-and-forget) ad ogni POST/PATCH property
- Test: iter_11 (14 backend + 18 frontend) 100% PASS

### M3.S4 — Pagina dettaglio pubblica + Form contatto ✅ DONE (22 Giu)
- `/it/cloud/property/:pid` con gallery foto, info grid (8 celle), descrizione, features, mini-mappa Leaflet, card agenzia
- Form contatto `POST /api/cloud/property/{pid}/contact` → find-or-create client + lead con `source='ImmobilCloud'` nel CRM dell'agenzia
- Schema.org JSON-LD `RealEstateListing` per SEO + share rich previews
- Test: iter_12 (10 backend + frontend) 100% PASS

### M3.S4.1 — Email lead notification via Resend ✅ DONE (22 Giu)
- Helper `_schedule_lead_email()` fire-and-forget chiamato in coda al contact endpoint
- Smart destinatario: `listing_agent_id.email` fallback su `agency.email`
- Template `lead_notification.{it,en,es}.html` con CTA deep-link CRM
- Verifica live: `[EMAIL OK] template=lead_notification id=...` < 1s
- Test: smoke E2E PASS

### M3.S5 v2 — Pubblicazione annunci da privati B2C + Moderazione admin ✅ DONE (22 Giu)
- Backend: 2 nuovi router
  - `/api/cloud/me/properties` (B2C auth) POST/GET/PATCH/DELETE/submit, free-tier 1 listing attivo, sentinel `agency_id="_private_listings"`
  - `/api/app/moderation` (admin only) queue/approve/reject con notes ≥3 char
- Frontend:
  - `/it/cloud/account/sell` (B2C) — form lista/crea/edita/sottometti, badge status, motivo rifiuto visibile
  - `/it/app/moderation` (admin) — tabs pending/approved/rejected, approve one-click + reject con textarea
- Bug fix HIGH: `_public()` ora restituisce `account_type`, `intents`, `notification_channels`, `phone` (era causa di redirect loop SellPage)
- Test: iter_13 (19 backend) + iter_14 (100% retest dopo fix) PASS

### M3.S6 — Valutatore GIS pubblico ✅ DONE (22 Giu) — **NOSTRA SKILL CORE**
- **Dataset curato 124 città italiane × 3 zone tier** (centro/semicentro/periferia) — €/m² 2025 da Borsino Immobiliare/OMI/Tecnocasa/Idealista
- Algoritmo deterministico auditabile:
  1. Normalize city → resolve canonical key (gestisce sinonimi EN)
  2. Infer zone_tier da keywords address (Trastevere/Vomero/Chiaia/Navigli…)
  3. Apply multipliers: property_type × condition × energy_class × floor
  4. Comparables query db.properties stessa città + tipo
- `POST /api/cloud/valuator` (pubblico): risposta con price_per_sqm{min,avg,max}, estimated_value{min,avg,max}, multipliers_applied (audit trail), confidence (high/medium/low), methodology, data_source, comparables, disclaimer
- `GET /api/cloud/valuator/coverage` (meta): 124 città, 20 regioni
- Frontend `/it/cloud/valutatore` con hero dark gradient + form 3-sezioni + correttori auditabili + comparables clickabili + collapsible methodology
- **Lead capture**: `db.valuation_leads` (high-intent — chi cerca stima ha decisione di vendere)
- **Verifica congruenza prezzi su Italia intera**:
  - Milano centro nuovo A → €13.682/m² ✓
  - Cortina villa ottimo → €15k/m² ✓
  - Portofino centro → €20k/m² ✓
  - Crotone periferia → €575/m² ✓
- Test: iter_15 (50 pytest + 12 backend + 4 frontend) 100% PASS

### M3.S7 — Account B2C completo: ricerche salvate + alert email ⏳ NEXT
- Backend: `POST /api/cloud/me/saved-searches`, `GET /api/cloud/me/saved-searches`, `DELETE .../{id}`
- Schema: `{user_id, name, filters: SearchFilters, frequency: daily|weekly|instant, created_at, last_run_at}`
- Cron job (APScheduler o cron Mongo) che ogni ora controlla matching tra ricerche salvate e proprietà nuove
- Email template `alert_match.{it,en,es}.html` con preview 3 immobili matching + link search
- Frontend: `/it/cloud/account` (Dashboard B2C) con tab "Ricerche salvate" + bottone "Salva questa ricerca" in SearchPage

### ✅ Definition of Done M3 (aggiornato 22 Giu)
- [x] Portale pubblico online con SEO Schema.org
- [x] Funnel acquisizione lead chiuso (form contatto + email notification real-time)
- [x] Mappa interattiva + filtri avanzati
- [x] Pagina dettaglio pubblica
- [x] Privato pubblica annuncio in autonomia (B2C UGC)
- [x] Moderazione admin queue funzionante
- [x] Valutatore GIS pubblico con 124 città verificate
- [x] Lead arrivano in ImmoWeb (3 fonti: contact form, private listing, valutatore)
- [ ] Saved searches + alert email B2C (M3.S7)

### 🔮 Backlog M3 (post-S7)
- **Upgrade valutatore**: caricare OMI 27k zone come override DB (granularità sub-quartiere)
- **Auto-assignment lead**: lead valutatore → agente OMNIA più attivo nella zona (lead score + round-robin)
- Cluster marker mappa con `react-leaflet-cluster` (>100 marker)
- Cerca vicino a te / tempo percorrenza
- Disegna su mappa / multi-zone selection
- Immobili Segreti off-market premium
- [ ] Privacy 4 livelli rispettata
- [ ] Multi-zone selection + Disegna su mappa + Cerca vicino a te + Confronta prezzi

---

# 💎 MILESTONE 4 — MLS + STRIPE + KILLER FEATURES
**Durata**: 3-4 settimane · **Sessioni**: 5

### M4.S1 — MLS Network multi-agenzia
- Sistema invito agenzie a MLS
- Acceptance workflow inter-agenzia
- Vista MLS con privacy MLS_MEMBER
- **Tuo compito**: definire regole MLS (commissioni, esclusiva)

### M4.S2 — Workflow collaborazione 5 giorni
- Richiesta visita inter-agenzia → countdown 5gg
- Stati: requested / accepted / rejected / expired
- Upgrade privacy ACCEPTED
- Audit log completo

### M4.S3 — Stripe abbonamenti (pricing aggressivo lancio D-024)
- **Fase lancio** (primi 12 mesi):
  - Starter (1 agente, 20 immobili): GRATIS primi 3 mesi → €19/mese
  - Pro (3 agenti, 100 immobili): **€29/mese**
  - Agency (illimitato + MLS + AI): **€79/mese**
  - Enterprise (network/franchising): da €299/mese
- **Fase post-traction** (dopo 100 agenzie paganti):
  - Starter €19, Pro €49, Agency €149, Enterprise €299-499
- Trial 14 giorni gratuito su tutti i piani a pagamento
- **Zero setup fee. Zero formazione a pagamento. Zero vincoli contrattuali** (anti-Getrix)
- Migrazione dati gratuita inclusa
- Listino PUBBLICO in homepage (anti-opacità Idealista/Immobiliare)
- Customer Portal Stripe
- **Tuo compito**: account Stripe attivo + IBAN (rinviato a M4.S3 come da D-010)

### M4.S4 — Sistema crediti pay-as-you-go
- Wallet crediti per agenzia
- Acquisto pacchetti (50/200/1000 crediti)
- Consumo crediti (visure, valutazioni, Top, SMS)
- **Tuo compito**: tabella prezzi crediti-vs-servizi

### M4.S5 — Punti visibilità (gap vs idealista)
- Promozione immobile: Top / Premium / In Evidenza
- Costo in crediti
- Dashboard ROI
- **Tuo compito**: prezzi visibilità

### ✅ Definition of Done M4 — 🎉 PRODOTTO VENDIBILE
- [ ] Agenzia paga €29-149/mese end-to-end
- [ ] MLS attivo con 2 agenzie test
- [ ] Sistema crediti operativo
- [ ] Pronti per **prime 2 agenzie pilota reali**

---

# 🤖 MILESTONE 5 — AI SUITE (Vantaggio competitivo)
**Durata**: 2-3 settimane · **Sessioni**: 8 (sequenza definita 23 Giu 2026, vedi D-028)

> **Decisione architetturale chiave (D-028)**: Il chatbot "Al" del santo graal è stato **split in 3 chatbot specializzati sequenziali** invece di un unico tuttofare. Stack: Gemini 3 Flash via Emergent LLM Key, web-search API gratuita in fase lancio, anti-hallucination layer, audit log 5 anni.

### M5.S1 — 🤖 Al for Agents (chatbot CRM IMMOWEB)
- Assistente conversazionale dentro l'app IMMOWEB con **function calling** sul backend
- Query Mongo in linguaggio naturale: "quanti immobili attivi a Milano sotto 300k?", "lead caldi della settimana", "match score più alto del cliente X"
- Scrittura assistita: descrizioni annunci da foto+dati, email follow-up, risposte commerciali
- **Multi-tono** (standard / lusso / giovane), multi-lingua IT/EN/ES
- **Tuo compito**: validare qualità su 20 esempi reali

### M5.S2 — 📚 Al Knowledge (chatbot how-to piattaforma)
- **Prerequisito**: il manuale OMNIA sarà scritto da E1 a progetto completato (decisione Founder 23 Giu)
- RAG su manuale curato + FAQ + (opzionale) database immobili pubblico
- Vector DB: Mongo Atlas vector search, embeddings Google text-embedding-004
- Lead capture conversazionale quando rilevante, handoff agente reale possibile
- **Tuo compito**: revisione del manuale prima del lancio

### M5.S3 — ⚖️ Al Legal (chatbot giuridico-notarile con web search)
- **Web search live** su fonti normative ufficiali (normattiva.it, gazzettaufficiale.it, agenziaentrate.gov.it, notariato.it, cassazione.it) → **API gratuita in fase lancio**
- Risposte con **citazioni inline obbligatorie** (articoli, sentenze, circolari)
- **Anti-hallucination layer**: secondo LLM verifica claim ↔ fonti, confidence scoring (soglia ≥0.85)
- Sotto soglia → "Non sono certo. Parla con un notaio →" (escalation CTA)
- **Termini d'uso** + checkbox obbligatorio: "informazioni orientative, non parere legale ai sensi L.247/2012"
- **Audit log** completo (5 anni retention)
- **NON serve** studio legale convenzionato al lancio
- **Tuo compito**: termini d'uso da revisionare con avvocato di fiducia (€200 una tantum)

### M5.S4 — 🎨 Virtual Staging foto immobili
- Gemini Nano Banana arreda foto vuote / migliora illuminazione / suggerisce render
- A/B "prima vs dopo" cliccabile
- Costo in crediti (preparazione per M4)
- **Tuo compito**: validare qualità render su 10 immobili reali

### M5.S5 — 💰 Comparatore mutui
- Form richiesta mutuo (LTV, durata, reddito, tipo tasso)
- Scraping tassi banche IT (Intesa, Unicredit, BPER, Crédit Agricole, online banks) — costo zero
- Tabella comparativa rate/TAEG/spread
- Genera lead partner finanziari (preparazione per partner affiliate)
- **Tuo compito**: 1-2 partner affiliate banche/mediatori creditizi

### M5.S6 — 🌡️ Certificazione APE
- Form input parametri termici (mq, anno costruzione, riscaldamento, isolamento, classe involucro...)
- Calcolo automatico classe energetica + tabella consumi
- PDF brandizzato in stile certificato APE
- **NB**: serve certificatore abilitato per firma legale, ma il calcolo orientativo è nostro
- **Tuo compito**: convalidare formule con 1 certificatore di fiducia

### M5.S7 — 📑 Modulistica AI (post-società)
- Template contratti italiani (proposta acquisto, mandato vendita/locazione, preliminare, lettera ai condòmini, disdetta)
- Auto-compilazione con dati CRM (cliente, immobile, prezzo)
- Generazione PDF brandizzati
- Storage documenti per agenzia
- **Tuo compito**: 5 template legali iniziali (può aiutare un legale)

### M5.S8 — ✍️ Firma elettronica + Visure (post-società)
- Integrazione DocuSign / Yousign per firma a distanza (richiede account paid)
- VisureItalia API per visure catastali/ipotecarie (richiede account paid)
- Storage documenti firmati nel cloud
- **Tuo compito**: account DocuSign + VisureItalia (a carico nuova società)

### ✅ Definition of Done M5
- [ ] Al for Agents risponde correttamente a 90%+ query CRM
- [ ] Al Knowledge copre 30+ how-to della piattaforma
- [ ] Al Legal: 95%+ risposte con citazione normativa, 0 false positive ad alta confidence
- [ ] Virtual Staging produce render vendibili
- [ ] Comparatore mutui genera primi lead reali
- [ ] APE calcolo orientativo affidabile
- [ ] Modulistica + Firma + Visure tutto integrato (post-società)

---

# 🎓 MILESTONE 6 — OMNIA ACADEMY
**Durata**: 2-3 settimane · **Sessioni**: 5

### M6.S1 — Struttura LMS base
- Catalogo corsi
- Iscrizione + tracking progresso
- Player video (Mux/Cloudflare Stream)
- Risorse scaricabili
- **Tuo compito**: scegliere 1 corso pilota

### M6.S2 — Quiz + Certificazioni
- Editor quiz
- Soglie superamento
- Esame finale
- Certificato PDF brandizzato
- **Tuo compito**: contenuti quiz primo corso

### M6.S3 — Chatbot tutor "Al Academy"
- Tutor AI per ogni corso (Gemini + RAG)
- Spiegazione concetti, esempi, esercizi
- Tracking domande frequenti
- **Tuo compito**: materiale corso pilota

### M6.S4 — Marketplace agenti certificati
- Profilo pubblico agente con certificazioni
- Badge verificati su ImmobilCloud
- Ricerca per zona + specializzazione
- **Tuo compito**: criteri certificazione

### M6.S5 — Crediti formativi + FIAIP/FIMAA
- Tracciamento ore formative
- Export certificati ordine professionale
- Calendario eventi/webinar live
- **Tuo compito**: contattare FIAIP per accreditamento

### ✅ Definition of Done M6 — 🏆 ECOSISTEMA OMNIA COMPLETO
- [ ] 3 pilastri operativi
- [ ] White label totale
- [ ] Almeno 1 corso con certificazione
- [ ] **Pronti per scale-up commerciale**

---

## 📊 PARTE III — Quadro riassuntivo

| M | Nome | Sessioni | Settimane | Costo infra cumulato | Output chiave |
|---|---|---|---|---|---|
| **M1** ✅ | Foundation | 4 | 1-2 | €0-50 | Auth + multi-tenant + DNS |
| **M2** 🟢 95% | ImmoWeb | **7** | 4-5 | €50-150 | CRM + Matching+LeadScoring + Clone-from-URL + Theme Registry + Smart Clients · **resta: AI Smart Import + Custom Domain** |
| **M3** ⏸️ | ImmobilCloud | 5 | 2-3 | €100-250 | Portale pubblico + privato carica + immobili segreti |
| **M4** ⏸️ | MLS + Stripe | 5 | 3-4 | €150-350 | 🎉 **Vendibile** con pricing aggressivo |
| **M5** ⏸️ | AI Suite | 4 | 1-2 | €200-500 | Copywriter + Chatbot + Mutui + Modulistica |
| **M6** ⏸️ | Academy | 5 | 2-3 | €250-600 | 🏆 Ecosistema completo |
| | **TOT** | **30** | **13-19 sett.** | | |

### 🎯 Argomenti commerciali chiave dopo M4 (ricavati dall'analisi competitiva)
1. **Risparmia il 95%** vs stack tradizionale (€10.000-12.000/anno → €348-948/anno)
2. **Listino trasparente** (vs "Contattaci" di tutti i competitor)
3. **Zero setup fee, zero vincoli, mese per mese**
4. **Migrazione gratuita** da Getrix/Agestanet/Gestim in 1 click
5. **Lead Scoring AI**: smetti di rincorrere lead morti
6. **Clone del tuo sito attuale in 60 secondi** (Demo killer)
7. **Sito su dominio tuo, non sottodominio nostro** (D-018)
8. **Academy inclusa** (no upsell separato)

---

## 📝 PARTE IV — Checklist per il Founder

### Necessario adesso (✅ già fatto)
- [x] Dominio principale: omniarealestateecosystem.it
- [x] Account Emergent attivo con Universal LLM Key (~100 crediti residui da monitorare)
- [x] Account GitHub: repo mcnicastro-netizen/OMNIA

### Necessario M2 (ancora in corso)
- [x] API Key Resend (operativa, magic-link funzionanti)
- [ ] **Dominio Resend verificato** per inviare a email esterne (oggi sandbox)
- [ ] 3-5 **URL siti agenzie reali** per testare Clone-from-URL (M2.S5)
- [ ] Credenziali XML portali Idealista/Immobiliare.it/Casa.it (M2.S5)
- [ ] Logo OMNIA finale + paletta colori brand (M2.S6)

### Necessario M3
- [ ] Decisione prezzi annunci over-limit privati
- [ ] Validazione tono di voce
- [ ] Criteri **Agency Recommender** (algoritmo: quali 4 agenzie suggerire al privato venditore)
- [ ] Criteri "Immobili Segreti" (chi può accedere, costo accesso)

### Necessario M4
- [ ] Account Stripe + IBAN
- [ ] Tabella prezzi crediti + visibilità
- [ ] 1 agenzia pilota test
- [ ] Credenziali XML portali

### Necessario M5
- [ ] 30-50 FAQ chatbot
- [ ] 5 template contratti
- [ ] Account VisureItalia
- [ ] Partner mutui

### Necessario M6
- [ ] 1 corso pilota completo (script + slide + video)
- [ ] Eventuale accreditamento FIAIP/FIMAA

### Post-M6
- [ ] Namirial/Aruba (firma elettronica)
- [ ] WhatsApp Business
- [ ] Avvocato GDPR + contratti
- [ ] 2-3 agenzie pilota stabili

---

## 🚦 PARTE V — Sistema di emergenza (parole magiche)

| Parola magica | Cosa faccio io |
|---|---|
| **"Dove siamo"** | Stato attuale: M, sessione, %, prossimo step |
| **"Riassumi"** | Sunto di tutto fatto finora |
| **"Cambia piano"** | Rivediamo roadmap senza demolire |

---

## ⚠️ PARTE VI — Rischi e mitigazioni

| Rischio | Probabilità | Mitigazione |
|---|---|---|
| Scope creep | 🔴 Alta | Backlog Futuro, non in milestone in corso |
| Bloccato in attesa credenziali | 🟡 Media | Mock/sandbox e switch al live dopo |
| Burnout founder | 🟡 Media | Pause dopo M2 e M4 |
| Drift tecnico | 🟢 Bassa | INTERFACE_CONTRACT.md + monorepo |
| Competitor copia | 🟡 Media | M5 (AI) accelerato se serve |
| Costi infra | 🟢 Bassa | Monitoring + soft cap AI |

---

## 🎯 PARTE VII — Prossimo passo IMMEDIATO

**Stato al 18 Giugno 2026**: M1 ✅ · M2.S1→S5 ✅ DONE · M2.S6 + D-FUTURE-07 rimasti.

Quando rientri prossima sessione:

1. 🔴 **D-FUTURE-07 — AI Smart Import Clienti** (P0): sblocca adoption reale, pattern brand-extractor-style. Stimato 1 sessione.
2. 🟠 **M2.S6 — Custom Domain + DNS** (P1): chiusura white-label. Richiede decisione provider DNS prima di partire.
3. 🟡 **M3.S1 — ImmobilCloud B2C** (P1, dopo M2 completo): portale pubblico, home + search box.

Parole magiche per ripartire:
- *"Partiamo con AI Smart Import Clienti"* → D-FUTURE-07
- *"Partiamo con Custom Domain"* → M2.S6
- *"Partiamo con M3"* → ImmobilCloud B2C
- *"Dove siamo"* → riassunto stato

---

*Documento approvato v2.1: 18 Giugno 2026*
*Prossima revisione: alla fine di M2.S6 (completamento Milestone 2)*
