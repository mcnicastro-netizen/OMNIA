# OMNIA — Changelog

## 2026-06-25 — ✅ M3.S6-pro GIS Valuator Pro + CTA Lead Funnel DONE

**Valutatore immobiliare bank-grade nazionale + conversione automatica stima→lead.**

### Implementato
- 🇮🇹 **Copertura nazionale**: Nominatim live geocoding + fallback provinciale automatico per i comuni fuori dal dataset 161-city diretto (`/app/backend/apps/immocloud/anncsu.py`)
- 📐 **UNI 10750 superfici commerciali**: principale 100%, balcone 30%, terrazzo 30-50%, veranda 60%, cantina 25-35%, soffitta 15-25%, box 50%, posto auto scoperto 20%, giardini 5-10%, taverna 50%, mansarda abitabile 60-80% (`/app/backend/apps/immocloud/data/coefficients.py`)
- ⚖️ **Coefficienti di merito**: piano (-15% seminterrato → +15% attico panoramico), esposizione (-3% nord → +5% sud), affaccio (-5% interno → +12% mare), riscaldamento (-2% assente → +3% autonomo/pompa calore), ascensore, anno costruzione (deperimento + premio nuovo), vincoli (-10% storico/-7% paesaggistico), locazione (-8/-15%), nuda proprietà (-20%)
- 🗺️ **Coefficienti regionali**: 20 regioni IT con micro-adjustment (es. Lombardia +1.25%, Calabria -2%)
- 🧪 **Test**: 32 unit pytest + 5 live API pytest = **37/37 PASS** (`/app/backend/tests/test_m3s6_valuator_pro.py` + `test_m3s6_valuator_live_api.py`)
- 🎨 **Frontend Pro mode toggle** (`ValuatorPage.jsx`): checkbox "Modalità Pro" → mostra 11 input mq superfici + 6 select merit (piano, esposizione, affaccio, riscaldamento, ascensore, anno) + 5 checkbox vincoli/locazione
- 📊 **Risultato Pro**: hero stima + range, breakdown superficie commerciale UNI 10750, panel coefficienti merito applicati (verde/rosso), province-fallback notice per comuni piccoli
- 💎 **CTA "Confronta con immobili simili in vendita"** sul pannello risultato → deep-link a `/:lang/cloud/search?operation=sale&city=X&property_type=Y&price_min=AVG*0.8&price_max=AVG*1.2` con filtri precompilati → funnel **Valutazione → Annunci comparabili → Saved-search (lead email)**

### File modificati/creati
- `/app/backend/apps/immocloud/valuator.py` (refactor con nuova schema commercial_surfaces + merit)
- `/app/backend/apps/immocloud/data/coefficients.py` (NEW)
- `/app/backend/apps/immocloud/data/province_prices.py` (NEW)
- `/app/backend/apps/immocloud/anncsu.py` (NEW — fallback provinciale via Nominatim)
- `/app/backend/tests/test_m3s6_valuator_pro.py` (NEW — 32 cases)
- `/app/backend/tests/test_m3s6_valuator_live_api.py` (NEW — 5 cases)
- `/app/frontend/src/apps/immocloud/components/ValuatorPage.jsx` (Pro mode UI + CTA Compare)
- `/app/frontend/src/shared/i18n/locales/it.json` (+ key `r_compare_market`, `r_compare_market_hint`)

### Bug fix
- 🐛 **Bug fittizio**: la fork precedente segnalava un timeout Playwright su `/it/cloud/valuator` → in realtà la rotta italiana è `/it/cloud/valutatore`. Pagina sempre stata funzionante.
- 📝 Il 401 da `/api/auth/me` su rotte pubbliche B2C è un probe globale benigno, non blocca il rendering.

---


## 2026-06-24 — ✅ M5.S3 AL Legal DONE

**Assistente legale immobiliare con web search + anti-hallucination — killer feature vs Agestanet (zero AI).**

### Implementato
- 🧠 **5 sub-agenti specializzati** (general, proposta, locazioni, catasto, urbanistica) + `pdf_analysis`
- 🔍 **Tavily AI web search** live su 7 fonti normative IT (normattiva, gazzettaufficiale, AdE, notariato, cassazione, altalex, brocardi)
- ⚖️ **Anti-hallucination validator** (2° LLM call, confidence ∈ [0,1], soglia 0.85) → sotto soglia: CTA notaio
- 🧪 **Chain of Thought interno** + temperature 0.2 (D-029) — non leak nella risposta
- 📄 **Upload PDF** proposte/preliminari/locazioni (max 5MB / 60 pp / 40k char)
- 🚨 **Disclaimer L.247/2012** + checkbox first-visit + footer permanente
- 📜 **Audit log** `al_legal_audit` (retention 5 anni)
- 🎨 Pagina `/it/legal` con DisclaimerModal, ChatTab (sources panel), PdfTab, sidebar nav `⚖ AL Legal`
- 🧪 Test E2E iteration_20: **16/16 backend + 100% frontend**

### Integrazioni
- Tavily AI: TAVILY_API_KEY in `.env`, 1000 query/mese free
- Gemini 3 Flash (Emergent LLM key) per main + validator

---

## 2026-06-24 — ✅ M5.S1 AL for Agents DONE (chat + streaming + inline copywriter)

**Chatbot CRM con function calling + UX ChatGPT streaming + inline copywriter multilingua.**

### Implementato
- 🤖 **POST `/api/app/al/chat`** — sync con 5 tool whitelistati + agency_id JWT injection
- ⚡ **POST `/api/app/al/chat/stream`** — SSE token-by-token live + Stop button + cursore lampeggiante
- ✨ **POST `/api/app/al/improve`** — inline copywriter (titolo/descrizione, IT/EN/ES) montato in PropertyForm + SellPage B2C
- 🅰️ Brand rename Al → **AL** ovunque
- 🌐 P2 fix Chrome auto-translate (lang/translate/notranslate meta)
- 🧪 Tests iteration_17/18/19 — **100%** in tutti i casi

---

## 2026-06-23 — ✅ M3.S7 Saved Searches + Alert Email Matching B2C DONE

**Il funnel B2C è ora completamente chiuso: cerca → salva → alert email automatici.**

- **Backend** `apps/immocloud/saved_searches.py` (NUOVO, ~245 righe):
  - Router `/api/cloud/me/saved-searches` (B2C auth) con POST/GET/PATCH/DELETE/run.
  - Schema `SearchFilters` Pydantic (operation, city, property_type, ranges prezzo/superficie/locali/camere/bagni, energy_class).
  - Free-tier limit: 10 saved searches/utente (409 `saved_searches_limit_reached`).
  - `run_all_active_saved_searches()` matching engine: per ogni ricerca attiva, `_build_mongo_filter()` riusa `_base_filter()` (esclude pending/rejected/non-listed) + filtro `created_at > last_run_at` → email digest Resend.
  - **Fix semantico post-test**: `last_run_at` ora aggiornato SEMPRE (anche quando skip per canale email disattivato) → previene replay di vecchi match quando l'utente riattiva il canale email.
- **Backend** `apps/immoweb/cron.py` (NUOVO): `POST /api/app/cron/saved-searches/run-all` (admin only) — callable da k8s CronJob / GitHub Actions.
- **Email** template `saved_search_alert.{it,en,es}.html` (NUOVI): branded digest con elenco fino a 6 immobili matching (titolo, città, zona, m², prezzo) + CTA "Vedi tutti i risultati".
- **Subject** in `shared/email/client.py`: 3 lingue per `saved_search_alert`.
- **Frontend** `components/AccountDashboard.jsx` (NUOVO, ~155 righe): `/it/cloud/account` — dashboard B2C con lista ricerche, controlli per riga (freq dropdown, toggle attiva, delete), empty state con CTA.
- **Frontend** `ImmocloudApp.jsx`: nuovo `SaveSearchButton` inline nella SearchPage — login-gated (B2C-only). Click senza B2C → redirect `/cloud/register?intent=get_alerts`. Form inline con name pre-compilato + frequency select. Done state con link diretto alla dashboard.
- **i18n** `it.json`: namespace `cloud.save_search.*` (10 chiavi) + `cloud.account.*` (12 chiavi).
- **Testing**:
  - **12/12 pytest backend** in `tests/test_m3s7_saved_searches.py`: auth guards, CRUD completo, limit 10, cron admin gating.
  - **11/11 Playwright frontend**: SaveSearchButton, login-gate redirect, save form, AccountDashboard, controlli per riga, empty state, access control.
  - **Email pipeline live**: `[EMAIL OK] template=saved_search_alert id=70f0c6c7-...` verificato in log Resend.
- **Note non bloccanti dal QA**:
  - UX: filter tags nella dashboard renderizzati come raw key:value (es. `city: Roma`). Da i18n-tradurre in v1.1.
  - Pre-esistente: warning React hydration `<span>` in `<option>` nel filtro "Locali minimi" — non causato da M3.S7, non rompe nulla.

### 🎯 Funnel B2C completo end-to-end
```
1. Utente arriva           → /cloud (home)
2. Cerca con filtri        → /cloud/search (Lista o Mappa)
3. SALVA LA RICERCA        → POST /cloud/me/saved-searches
4. Sistema cron periodico  → run_all_active_saved_searches()
5. Email digest automatico → Resend "🔔 N nuovi immobili per la tua ricerca"
6. Click su immobile       → /cloud/property/:id
7. Form contatto           → lead nel CRM agente + email instant
```

---

## 2026-06-22 (notte tarda) — ✅ M3.S6 Valutatore GIS pubblico DONE

**Il valutatore è una NOSTRA SKILL. Output realistici verificati su Italia intera.**

### Risultati congruenza verificati
| Zona | Output €/m² | Range mercato 2025 |
|---|---|---|
| Milano centro nuovo A | €13.682 | 9.000–13.000 (+nuovo/A premium) ✓ |
| Roma Trastevere (zona inferita) | €8.000 | 6.500–9.500 ✓ |
| Napoli Vomero da_ristrutturare | €3.375 | 3.500–5.500 × 0.75 = 2.625–4.125 ✓ |
| Cortina d'Ampezzo villa ottimo | €15.094 | 9.000–14.000 × 1.25 × 1.05 ✓ |
| Portofino centro | €20.000 | 15.000–25.000 ✓ |
| Crotone periferia | €575 | 450–700 ✓ |
| Palermo periferia monolocale | €978 | < periferia appartamento ✓ |

### Implementazione
- **Backend** `apps/immocloud/data/italy_real_estate_prices_2025.py` (NUOVO, 380+ righe): dataset curato `CITY_PRICES` con **124 città italiane** in **20 regioni**, organizzate per zona tier (centro/semicentro/periferia). Fonti: Borsino Immobiliare 2025-Q1, OMI Agenzia Entrate, Tecnocasa report 2024, Idealista. Include città ultra-premium (Portofino, Capri, Porto Cervo, Cortina, Sanremo, Forte dei Marmi, Sorrento, Positano, Taormina) e turistiche (Olbia, Tropea, Ostuni).
- **Backend** `apps/immocloud/valuator.py` (NUOVO, ~230 righe):
  - `POST /api/cloud/valuator` (pubblico, no-auth) — payload `{city, zone?, address?, property_type, surface_sqm, condition?, energy_class?, floor?, name?, email?}`.
  - Pipeline: normalize city → resolve canonical key (gestisce sinonimi EN come "Milan"/"Rome"/"Florence") → infer zone_tier da keywords address ("Trastevere", "Vomero", "Chiaia", "Navigli"...) → multipliers (property_type × condition × energy_class × floor) → comparables query db.properties → optional lead capture in db.valuation_leads.
  - `GET /api/cloud/valuator/coverage` — public meta endpoint.
  - Risposta include: price_per_sqm{min,avg,max}, estimated_value{min,avg,max}, multipliers_applied (audit trail), confidence (high/medium/low + score 0-100), methodology + data_source, comparables, disclaimer.
- **Frontend** `apps/immocloud/components/ValuatorPage.jsx` (NUOVO, ~310 righe): pagina `/it/cloud/valutatore` con form 3-sezioni (location/property/contact opzionale) + risultato hero in dark gradient + grid dettagli + comparables clickabili + collapsible methodology + disclaimer.
- **Frontend** `ImmocloudApp.jsx`: route + link in CloudTopNav "Valuta gratis".
- **i18n**: namespace `valuator.*` con 40+ chiavi italiane.
- **Testing**:
  - **50 pytest di congruenza** in `tests/test_m3s6_valuator.py`: 25 city×zone realistic ranges (Portofino → Crotone), 12 monotonicity tests (centro > semicentro > periferia), 1 inter-city ranking (Milano > Roma > Bologna > Napoli > Palermo > Crotone), 5 multiplier tests (villa/garage/condition/energy/floor), 7 resilience (synonyms EN, unknown city, zone inference).
  - Iteration_15: **50/50 pytest + 12/12 manual curl backend + 4/4 frontend Playwright + nav link + 11/11 field testids PASS**. Zero bug.
- **Lead capture**: nuova collection `valuation_leads` (high-intent: chi cerca stima ha venduta decisione).
- **Fix non-bloccanti applicati post-test**: aggiunto `tests/conftest.py` per portabilità pytest in CI; aggiunto `data-testid="r-confidence"` per regression UI cheap.

---

## 2026-06-22 (notte) — ✅ M3.S5 v2 Pubblicazione annunci privati B2C + Moderazione admin DONE

**Il portale B2C ora consente ai privati di pubblicare gratuitamente un annuncio (free-tier 1 attivo), con workflow di moderazione admin.**

- **Backend**:
  - `apps/immocloud/private_listings.py` (NUOVO, ~205 righe): router `/api/cloud/me/properties` (B2C auth required) con POST/GET/PATCH/DELETE/submit. Sentinel `agency_id="_private_listings"` per evitare schema breaking. Free-tier limit: 1 listing in `status ∈ {draft, active}` per `owner_user_id`. PATCH sostantivo (title/price/address) su listing `approved`/`rejected` → reset a `pending`+`draft`.
  - `apps/immoweb/moderation.py` (NUOVO, ~110 righe): router `/api/app/moderation` (admin only — `super_admin`/`platform_admin`/`admin`) con queue/approve/reject. `approve` setta `status="active"`, `moderation_status="approved"`. `reject` con `notes ≥3 char` (dopo strip) setta `status="draft"`, salva motivo visibile all'utente.
  - `shared/models/property.py`: PropertyInDB ora ha `is_private_listing`, `owner_user_id`, `moderation_status: Literal[approved,pending,rejected]`, `moderation_notes`, `moderation_reviewed_at`, `moderation_reviewed_by`.
  - `apps/immocloud/public_portal.py:_base_filter()`: aggiunto filtro `moderation_status: {$nin: [pending, rejected]}` — i pending non appaiono mai pubblicamente.
  - **BUG FIX (HIGH)** `apps/core/auth.py:_public()`: ora restituisce `account_type`, `intents`, `notification_channels`, `phone`. Risolto loop di redirect SellPage per utenti B2C (causa: AuthContext rifetcha `/api/auth/me` al boot, perdeva `account_type`).
  - **Minor fix** `moderation.py:reject_listing`: notes ora validate dopo `.strip()` (422 `notes_too_short` se solo whitespace).
- **Frontend**:
  - `apps/immocloud/components/SellPage.jsx` (NUOVO, ~360 righe): pagina B2C `/it/cloud/account/sell`. Redirect a registrazione se non B2C. Lista annunci con badge status, form crea/modifica/elimina, submit-for-review, riapertura post-rejection con notes visibili.
  - `apps/immoweb/ModerationPage.jsx` (NUOVO, ~215 righe): pagina admin `/it/app/moderation`. Tabs pending/approved/rejected. Card con foto, info, owner, bottoni approve (one-click) + reject (con textarea inline per notes).
  - Routing: `/cloud/account/sell` (B2C public), `/app/moderation` (ProtectedRoute super_admin/platform_admin/admin).
  - `apps/immocloud/ImmocloudApp.jsx`: route SellPage aggiunta.
  - i18n `it.json`: nuovi namespace `cloud.sell.*` (30 chiavi) e `moderation.*` (16 chiavi).
- **Testing**:
  - Iteration_13: **19/19 backend PASS** + Moderation page UI PASS. Trovato bug HIGH (`_public()`) → SellPage in loop.
  - **Bug fixato**. Iteration_14: **100% backend retest PASS + 100% frontend PASS** (12/12 step E2E: register B2C → publish draft → admin reject with notes → B2C sees rejection notes → resubmit button). Tutti i flussi sono GREEN end-to-end.
  - Cleanup: tutti gli utenti `b2cseller_*`/`b2csellretest_*` eliminati, nessun residuo DB.

**Note prodotto (segnalate da QA — non bloccanti, da rivedere)**:
- Free-tier counter conta solo `status ∈ {draft, active}` → un listing `rejected` non blocca la creazione di un nuovo annuncio. Potenzialmente confondente: l'utente potrebbe pensare di dover prima cancellare il rejected.
- B2C login: usa `/api/auth/login` come gli agenti (non esiste `/api/cloud/auth/login`). Da documentare nei DECISIONS.

---

## 2026-06-22 (sera) — ✅ M3.S4.1 Notifica email istantanea al lead DONE

**Quando arriva un lead dal portale B2C, l'agente lo riceve via email entro 2 secondi.**

- **Backend** `apps/immocloud/public_portal.py`:
  - Aggiunto helper `_schedule_lead_email()` fire-and-forget (asyncio.create_task) chiamato in coda al flusso `POST /property/{pid}/contact`.
  - **Destinatario smart**: prima cerca `listing_agent_id.email` su `users`, fallback su `agency.email`. Lang dedotta dal user/agency.
  - Variabili template: `property_title`, `lead_name`, `lead_email`, `lead_phone_block` (condizionale), `lead_message`, `crm_url` (deep link `/{lang}/app/properties/{pid}`).
- **Email** `shared/email/templates/lead_notification.{it,en,es}.html`: nuovo template OMNIA-styled con badge "🔔 Nuovo lead", contatto evidenziato, messaggio, CTA "Apri nel CRM".
- **Subject** in `client.py` SUBJECTS: aggiunte 3 lingue per `lead_notification`.
- **Test live**: contact API → Resend conferma `[EMAIL OK] template=lead_notification id=6562de46-...` in <1s. Lead creato in CRM, email recapitata.
- **Comportamento mock-safe**: senza `RESEND_API_KEY` cade in log mock come per ogni altro template.

---

## 2026-06-22 (pomeriggio) — ✅ M3.S4 Pagina dettaglio pubblica + Form contatto DONE

**Funnel B2C → CRM agenzia: lead automatici dalla landing pubblica dell'immobile.**

- **Backend** `apps/immocloud/public_portal.py`:
  - Nuovo endpoint `POST /api/cloud/property/{pid}/contact` (no-auth pubblico):
    - Validazione Pydantic: `PropertyContactPayload` (name, email EmailStr, phone, message min_length=10, gdpr_consent, visit_requested).
    - 400 se `gdpr_consent=false`, 404 se property non pubblica, 422 per email invalida o message <10 char.
    - **Find-or-create client** su `(agency_id, email.lower())` → idempotente, no duplicati.
    - Crea `lead` con `source='ImmobilCloud'`, status='new', notes=messaggio + "[richiesta visita immobile]" se flag.
    - Bump `property.lead_count` (best-effort).
  - `GET /property/{pid}` già esistente — riusato. Restituisce property + photos + agency card, nasconde campi privati (owner, seller_client_id, commission_pct, etc.) e incrementa `view_count`.
- **Frontend** `apps/immocloud/components/PropertyDetailPage.jsx` (nuovo, ~340 righe):
  - Hero con titolo, breadcrumb, prezzo, operation badge.
  - Photo gallery con thumbnails cliccabili.
  - Card info griglia (8 celle): superficie, locali, camere, bagni, piano, anno, classe energetica, riferimento.
  - Descrizione + features list con check verde.
  - Mini-mappa Leaflet centrata sull'immobile (se lat/lng).
  - Card agenzia (logo/iniziale, telefono `tel:`, email `mailto:`).
  - Form contatto con messaggio precompilato i18n, GDPR, opzione "Vorrei prenotare una visita".
  - **Schema.org JSON-LD** `RealEstateListing` per SEO (URL, address, geo, offer, floorSize).
- **Frontend** `apps/immocloud/ImmocloudApp.jsx`: route `property/:pid` aggiunta.
- **i18n** `it.json`: ~30 nuove chiavi (`cloud.detail_*`, `info_*`, `contact_*`).
- **Testing**: 10/10 backend pytest (`test_immobilcloud_m3s4_contact.py`) + Playwright E2E PASS (iteration_12). Zero bug bloccanti. Coperti: happy path lead creation, dedup client su stessa email, 400 gdpr, 422 email/msg, 404 not-found/private, view_count++.
- **Fix UX post-test**: submit button ora sempre abilitato; la guard onSubmit mostra `contact-error` se GDPR non spuntato (feedback inline invece di bottone muto).

**Follow-up suggeriti (non bloccanti)**:
- Rate limiting + honeypot anti-spam su endpoint contatto pubblico (security hardening).
- Schema.org: omettere campi null (description) per cleanliness SEO.
- Modularizzare `PropertyDetailPage.jsx` (Gallery, AgencyCard, ContactForm in file separati).

---

## 2026-06-22 (mattino) — ✅ M3.S3 Mappa interattiva + Filtri avanzati DONE

**Portale B2C ImmobilCloud — toggle Lista/Mappa, marker Leaflet, geocoding automatico.**

- **Backend**:
  - `apps/immocloud/geocoding.py` (nuovo): helper Nominatim/OSM + `schedule_geocode()` fire-and-forget (asyncio.create_task). User-Agent custom, fallback su city-only se l'address full non risolve.
  - `apps/immoweb/properties.py`: chiama `schedule_geocode` su POST (se lat/lng assenti) e PATCH (se address/city/province/postal_code cambiano).
  - `apps/immocloud/public_portal.py`:
    - Nuovo endpoint `GET /api/cloud/map` — marker leggeri (id, lat, lng, price, operation, property_type, city, title) con filtri operation/city/property_type/price/rooms_min/bedrooms_min/energy_class e **bbox** (south,west,north,east).
    - Filtri avanzati su `GET /api/cloud/search`: `bedrooms_min`, `bathrooms_min`, `energy_class` (regex Pydantic A4..G).
    - `lat`/`lng` ora restituiti in `LIST_FIELDS` e in `_to_card`.
- **Frontend**:
  - Installate dipendenze: `leaflet@1.9.4` + `react-leaflet@5.0.0`.
  - Nuovo componente `apps/immocloud/components/PropertyMapView.jsx` (~110 righe): MapContainer + TileLayer OSM + Marker con Popup (titolo, città, prezzo, link "Vedi dettaglio →"). FitBounds automatico, fallback Roma. Icone marker da CDN unpkg (workaround Webpack).
  - `apps/immocloud/ImmocloudApp.jsx` SearchPage: stato `viewMode` (list/map), fetch `/api/cloud/map` quando in mappa, toggle button Lista/Mappa, nuovi filtri sidebar `bedrooms_min` e `energy_class`.
- **i18n** `it.json`: 7 nuove chiavi (`cloud.f_bedrooms_min`, `f_energy_class`, `view_list`, `view_map`, `view_detail`, `map_empty`, +1 di consistenza).
- **Testing**: 14/14 backend pytest (`test_immobilcloud_m3s3_map.py`) + 18/18 frontend Playwright PASS (iteration_11). Endpoint `/map` validato con bbox in/out, 400 su bbox malformato, 422 su energy_class invalida, geocoding Nominatim live, toggle UI list↔map, popup marker, link detail.
- **Backfill manuale**: aggiunti lat/lng a una property "Roma" esistente per smoke test (10 città italiane mappate via script Python ad-hoc).

**Non bloccanti (follow-up)**:
- bbox map non valida `lat∈[-90,90]` / `lng∈[-180,180]` lato server (yield empty silently). Da aggiungere come Pydantic validator.

---

## 2026-06-19 (mattino) — ✅ M3.S2 Publishing Center DONE

**Centro Pubblicazione integrato nel form proprietà dell'agente.**

- **Backend** `shared/models/property.py`:
  - Aggiunto `is_listed_on_immobilcloud: bool = True` a `PropertyCreate`
  - Aggiunto `is_listed_on_immobilcloud: Optional[bool] = None` a `PropertyUpdate`
  - Già presente in `PropertyInDB` (default True). Filtro `/api/cloud/search` già attivo (`{"$ne": False}`).
- **Frontend** `apps/immoweb/components/PublishingCenter.jsx` (nuovo, ~155 righe):
  - Toggle "Pubblica su ImmobilCloud™" (verde quando ON, default ON)
  - Pulsanti share: WhatsApp (wa.me), Facebook (sharer.php), Email (mailto:), Copy Link
  - Genera URL pubblico `{BACKEND_URL}/api/p/{agency_slug}/{property_id}` (rotta themed esistente)
  - Hint "Salva prima l'immobile..." in modalità create
  - Nota visibile quando toggle OFF: "l'immobile non è pubblicato su ImmobilCloud"
- **Frontend** `apps/immoweb/PropertyFormPage.jsx`:
  - Fetch `/app/agencies/me` per ottenere slug dell'agenzia
  - Sezione "Centro pubblicazione" inserita dopo Photos
- **i18n** `it.json`: aggiunti 8 stringhe (`section_publishing`, `publish_immobilcloud_*`, `share_*`).
- **Testing**: 4/4 backend pytest + 14/14 frontend Playwright PASS (iteration_10). Toggle persiste via POST/PATCH, `/api/cloud/search` filtra correttamente quando OFF, share URL generati correttamente con encoding.

---

## 🔴 PROSSIMA SESSIONE (P0) — M3.S1.1 + M3.S5 v1 (basata su 6 osservazioni Founder 19 Giu sera)

Scope vincolato dalle osservazioni del Founder dopo screenshot M3.S1:

**M3.S1.1 — Mini-fix grafico ImmobilCloud**:
1. Aggiungere simbolo **™** accanto al brand "ImmobilCloud" (NON ® finché non c'è registrazione UIBM/EUIPO confermata, ® falso = illecito).
2. Custom TopNav per route `/cloud`: 3 link **"Cerca casa · Vendi casa · Area riservata"**. RIMUOVERE link "Formazione" (Academy non riguarda B2C end users).
3. Sostituire il toggle "Compra/Affitta" con **3 card grandi** sotto l'hero: 🔍 Cerca · 🏷️ Vendi · 🔑 Affitta. Pattern Idealista/Immobiliare.it. Equipara le 3 azioni (oggi "vendi" mancava completamente come CTA esplicito).
4. Hero split-layout: testo a sinistra + **immagine Unsplash** a destra (es. skyline italiano / interno luxury). Niente hero text-only. Migliora drammaticamente percezione B2C.

**M3.S5 v1 — Registrazione segmentata B2C**:
5. Estendere modello `User` con `account_type: "b2c"` + `intents: ["sell" | "rent_out" | "get_alerts"]` + `notification_channels: ["email" | "push"]` (push browser inviato a sessione successiva — richiede service worker + VAPID keys).
6. Backend `POST /api/cloud/auth/register` con verifica email via Resend.
7. Frontend `/it/cloud/register` — form con scelta intenti (checkbox multi) + canale notifiche.
8. Bottone "Area riservata" in TopNav apre login/registrazione.

**Rinviato (next-next session)**:
- Push browser notifications (VAPID, service worker, subscribe API)
- WhatsApp/SMS canali (costi: Twilio €0.04/SMS, WA Business conversazione)
- B2C Profile page completa con saved searches + cronologia
- Flusso "Pubblica annuncio privato" dopo registrazione (verrà in M3.S5 v2)

## 2026-06-19 (notte) — 🎉 M3.S1 ImmobilCloud B2C Public Portal ✅ DONE

**Inizio della Milestone 3 — Portale B2C pubblico.**

- **Backend** `apps/immocloud/public_portal.py` (~295 righe, single module pulito):
  - 4 endpoint PUBBLICI no-auth: `GET /api/cloud/{search,facets,property/{id},agency/{slug}}`
  - `_base_filter()` applica visibility=public + status=active + is_listed_on_immobilcloud != false (opt-out default ON, scelta b3 del Founder)
  - Privacy: `PUBLIC_FIELDS` projection esclude `owner`, `seller_client_id`, `commission_pct`, `listing_agent_id`, `lead_count` dai detail
  - Search con filtri: city (prefix-match case-insensitive), property_type, operation (sale/rent), price range (auto-switch tra `price` e `rent_monthly`), surface, rooms_min, full-text q, sort recent/price/surface, paginazione page+page_size
  - Facets aggregati top 20 città + tipologie con conteggi
  - View counter best-effort sui detail
  - Batch-resolve agenzie via `$in` per evitare N+1
- **Modello** `Property` esteso con `is_listed_on_immobilcloud: bool = True` (default opt-out)
- **Frontend** `ImmocloudApp.jsx` (~445 righe) full rewrite — design B2C cream/navy/gold (distinto dal stone-only di B2B):
  - HomePage: hero serif "Trova la casa dei tuoi sogni", toggle Compra/Affitta (gold per affitto, navy per acquisto), search box city autocomplete + facets, pillole top città, sezione "Ultimi inserimenti" 6-card
  - SearchPage: sidebar filtri (city/type/price range/surface/rooms) + risultati card photo-driven + sort selector + paginazione
  - PropertyCard B2C: aspect-ratio 4:3 con cover, badge gold "Affitta" se rent, classe energetica top-right, prezzo serif Fraunces navy, agenzia attribution
- **Routing**: `/it/cloud` (Home), `/it/cloud/search?...` (lista filtri+pagina). Sottodominio target: `cloud.omniarealestateecosystem.it`
- **i18n** namespace `cloud` IT/EN/ES (~28 stringhe ciascuno)
- **Test**: 13/13 backend pytest + 17/17 criteri frontend + zero regressioni su M2 (41/42 incluso 1 expected skip).

**Decisioni Founder applicate**:
- (a2) Sottodominio dedicato cloud.omniarealestateecosystem.it ✅
- (b3) Opt-out di default ON (campo is_listed_on_immobilcloud) ✅
- (c1) OpenStreetMap+Leaflet — deferito a M3.S3 (mappa)
- 🆕 Roadmap M3 estesa da 5 a 7 sub-sessioni per accogliere Publishing Center (M3.S2) e Privato pubblica (M3.S5)

## 2026-06-19 (sera) — M2.S6 Custom Domain ✅ DONE (D-022)

**Milestone 2 chiusa al 100% 🎉**

- **Backend** `apps/immoweb/custom_domain.py` (455 righe, clean single-module):
  - 5 endpoints: `POST /domain/request` (genera TXT token cryptographically strong via `secrets.token_urlsafe(24)`), `POST /domain/verify` (DNS resolver `dnspython` con 1.1.1.1+8.8.8.8 + fallback A-record per apex flattening), `GET /domain`, `DELETE /domain`, `GET /domain/admin/pending` (super_admin only).
  - Validation: regex domain, lunghezza ≤120, RESERVED_SUFFIXES blocca self-claim (omniarealestateecosystem.it / emergent.host / emergentagent.com), 409 conflict se altra agenzia ha già claimato il dominio.
  - Email fire-and-forget al super_admin via Resend con istruzioni operative (aggiungere dominio su pannello Emergent).
- **Backend** `apps/immoweb/host_routing.py`:
  - HostRoutingMiddleware in Starlette: dato `Host: www.nicastroimmobiliare.it` (verificato) → riscrive path a `/api/p/{slug}/...` per servire il sito brandizzato.
  - Cache in-process 60s per evitare round-trip MongoDB su ogni request.
  - Internal hosts (emergentagent.com / emergent.host / omniarealestateecosystem.it) bypassano la riscrittura.
- **Modello** `AgencyWebsite` esteso con `custom_domain_status` (pending/verified/error), `custom_domain_token`, `custom_domain_requested_at`, `custom_domain_verified_at`, `custom_domain_last_error`.
- **Frontend** `WebsitePage.jsx` — nuova sezione **"4. Custom Domain (il tuo dominio)"** editorial-sober:
  - Input dominio + bottone "Richiedi attivazione"
  - Box con 2 record DNS da copiare (TXT `_omnia-challenge.*` + CNAME → `agencies.omniarealestateecosystem.it`) con bottoni "Copia"
  - Status badge (In attesa DNS / Verificato / Errore)
  - Bottoni "Verifica DNS" + "Rimuovi dominio"
  - Messaggio chiaro post-verify: "L'admin OMNIA attiverà l'SSL (Let's Encrypt) entro 24h"
- **i18n** namespace `website` esteso con 13 nuove stringhe `cd_*` IT/EN/ES.
- **Decisioni utente**: (1a) CNAME target = `agencies.omniarealestateecosystem.it` · (3a) Custom domain GRATIS in tutti i piani.
- **Vincolo Emergent**: l'aggiunta del dominio sul pannello Emergent è manuale per ora (no API). L'admin riceve email + ha dashboard pending in `/domain/admin/pending`.
- **Test**: 12/12 pytest passati (`test_custom_domain.py`) + frontend full flow validato (15/15 criteri di accettazione) + zero regressioni su themes/clients_smart/ai_import/csv_import.

## 2026-06-19 — D-FUTURE-07 AI Smart Import Clienti v1 ✅

- **Backend** `apps/immoweb/clients_ai_import.py` — pipeline `file → pre-parser → Gemini-3-flash → draft TTL 1h → commit`:
  - 4 endpoints: `POST /clients/import/ai` (upload+parse), `GET /draft/{id}` (reload), `PATCH /draft/{id}/row/{idx}` (edit/drop), `POST /draft/{id}/commit`.
  - Pre-parser per **CSV / Excel (.xlsx) / vCard / TXT**: detect format via estensione + content sniff.
  - System prompt Gemini con schema OMNIA + esempi d'interpretazione (es. "trilocale" → rooms_min:3, "venditore" → client_type:seller).
  - Defensive normalization layer (sanitize email/phone, coerce enums, parse int da formati misti).
  - Batch Gemini in chunk da 25 righe in parallelo (asyncio.gather).
  - Limiti: 5MB file, 500 righe max, TTL 1h sui draft via Mongo TTL index.
  - Source nei clienti importati: `"ai_import"`.
- **Frontend** `ClientImportPage.jsx` riscritta con 2 tab:
  - **Tab A "⚡ Import AI"** (default, badge "novità"): dropzone → loading → preview con confidence badge (★ verde / ⚠ ambra / ! rosso) → slider min-confidence + GDPR checkbox → commit.
  - **Tab B "📋 Template CSV"**: flusso legacy preservato (template+upload+preview).
  - Inline row edit (name, surname, email, phone, client_type) + drop/restore.
  - Editorial-sober palette stone-only + emerald/amber/red minimal solo per i badge confidence.
- **i18n** namespace `client_import` esteso IT/EN/ES + titolo H1 generico ("Importa clienti" invece di "...da CSV").
- **Test**: 12/12 backend pytest passati (`test_clients_ai_import.py`, ~47s con chiamate Gemini reali) + frontend full flow.
- **Deps**: aggiunte `openpyxl==3.1.5` e `vobject==0.9.9` in `requirements.txt`.

**Verifica reale (test agent + manual)**: caricato CSV messy 5 righe con colonne italiane arbitrarie (`nome cliente; telefono; mail; cerca; budget max; città`) → Gemini ha estratto 4 clienti (saltata 1 riga vuota), riconosciuto Mario/Lucia come buyer, Giuseppe come **seller** (parola "venditore" + "ha incarico"), Anna come **investor**, mappato "trilocale"→rooms_min:3, "Roma EUR"→city+zone, confidence 92-100/100. Commit ha inserito 4 clienti con source="ai_import".

## 2026-06-18 — Quick-Win Wrap-up ✅ (Click-to-Call/WA + CSV Client Import UI)

- **Frontend Smart Clients List**: bottoni inline **📞 tel:** e **💬 WhatsApp** su ogni row.
  - Click sui bottoni NON apre la scheda (stopPropagation).
  - Numeri puliti (`/[^\d+]/g`) per `tel:` href; `wa.me` URL senza il `+`.
  - Messaggio WhatsApp precompilato con `action_hint` dell'AI (`Buongiorno {nome}, {hint}`).
  - Outlined disabled state se phone/whatsapp mancante.
- **Frontend Client Import Page** (`/it/app/clients/import`): nuova pagina UI editorial-sober,
  3 step (Template → Drop CSV → Preview & Import), banner ◆, gestione errori.
  - Backend endpoints già esistenti (`GET /clients/_template/csv` + `POST /clients/import/csv`).
- **Bottone "⬆ Importa CSV"** aggiunto sul header della Smart Clients List.
- **Test**: 4 nuovi backend pytest (`test_client_csv_import.py`) — template + import + reject missing name.
  Totale 30/30 tests passati nella suite OMNIA.

## 2026-06-18 — D-FUTURE-04 Smart Clients List ✅ (editorial sober variant)

- **Backend** `apps/immoweb/clients_smart.py`:
  - `GET /api/app/clients/smart` — lista clienti arricchita con `lead_score`, `temperature`,
    `matches_count`, `best_match_score`, `top_property`, `action_hint`, `ai_cached`.
    Ordinamento default `score_desc`. Filtri `bucket` (all/to_call_today/rovente/caldo/tiepido/freddo/
    searchers/sellers) + `q` search + `sort` (score_desc/asc, created_desc, name_asc).
  - `POST /api/app/clients/smart/refresh` — batch AI scoring in parallelo (asyncio.gather)
    via Gemini-3-flash + 24h cache, fino a 10 clienti uncached per chiamata, idempotente.
  - Route ordering fix: `clients_smart_router` montato **prima** di `clients_router`
    in `routes.py` per evitare collision con `/clients/{cid}` dinamico.
- **Frontend** `ClientsPage.jsx` riscritto editorial-sober:
  - ScoreBox in Fraunces serif, TempPill monocroma (puntino stone-900/700/400/300 + label),
    MatchesPill stone-100, action hint italic stone-500, banner stone-100, filter pills stone-only.
  - Sort dropdown, search input, bucket filters, refresh-AI button condizionato a uncached>0.
  - 23+ data-testids su tutti gli elementi interattivi.
- **i18n** namespace `clients_smart` per IT/EN/ES.
- **Testing** 10/10 pytest passati (`/app/backend/tests/test_clients_smart.py`) + frontend full pass.
  Regressione vanilla GET /clients OK.

## 2026-06-18 — Social Share su property pubblica ✅ (Layer D Enhancement)

- **Backend** `themes.py` — aggiunto `_share_block()` con 4 pulsanti (WhatsApp · Facebook · Email · Copy Link)
  iniettati dentro `render_property()` di tutti e 4 i temi.
- **Absolute URLs** — `render_index` e `render_property` ora costruiscono canonical/OG/share URL
  partendo da `FRONTEND_URL` env, così i meta-tag Open Graph + i link di share funzionano correttamente
  quando l'URL viene incollato su WA/FB/Email.
- **JS inline minimal** per copy-to-clipboard (no librerie esterne, no tracking).
- **CSS** brand-color per WA (#25D366) e FB (#1877F2); Email button usa `--o-primary` del tema attivo.
- **Test** `/app/backend/tests/test_themes.py` — 2 nuovi test (share buttons presenti, URL absolute,
  share-block solo su property non sull'index). Totale 16/16 passati.
- **Test credentials** — aggiunto URL ufficiale sito Founder (https://www.nicastroimmobiliare.it/web/)
  da usare in tutti i test futuri al posto di Tecnocasa.

## 2026-06-18 — M2.S5 Layer D Phase 2 ✅ Theme Registry & Site Generation

- **Backend** `apps/immoweb/themes.py` — 4 temi headless (`minimal`, `classic`, `bold`, `luxury`)
  consumano il `brand_profile` estratto in Phase 1 e renderizzano il sito pubblico con la brand identity dell'agenzia.
- **Endpoints** sotto `/api/app/website/`:
  - `GET /themes` — catalogo 4 temi
  - `GET /theme` — config corrente + extracted_profile + resolved + public_url
  - `POST /theme/apply` — applica tema + overrides palette/typography/logo/tagline
  - `POST /theme/auto-configure` — auto-mapping da brand_profile (`auto_pick_theme` heuristica) + applica palette estratta
  - `GET /preview/{theme_id}` — render transient (no persist) per anteprima
- **Modello** `AgencyWebsite` ora ha `extracted_profile` e `theme_config`.
- **Refactor** `site.py` ora delega l'HTML a `themes.render_index` / `themes.render_property`.
  Il sito pubblico `/api/p/{slug}/` riflette il tema salvato (CSS variables + struttura).
- **Frontend** `WebsitePage.jsx` — nuova pagina `/it/app/website` con:
  - Brand Extractor (input URL → IA estrae palette/tono/struttura)
  - Theme Picker 4 card con palette preview
  - Bottone "Configura sito automaticamente" (auto-mapping)
  - Iframe Live Preview del sito pubblico con cache-busting
- **Sidebar** aggiunta voce "Sito web" 🎨
- **i18n** namespace `website` per IT/EN/ES
- **Testing** 14/14 backend tests passed (`/app/backend/tests/test_themes.py`), tutti i flow frontend OK
- Fix lint `E741` in `brand_extractor.py` (rename `l` → `link`)

## 2026-06-18 — M2.S5 Layer D Phase 1 ✅ Brand Profile Extractor
- BeautifulSoup + Gemini-3-flash extraction da URL → JSON brand_profile

## 2026-06-17 — M2.S5 Layer A/B/C ✅
- Portal Manager (AES-256 Fernet encryption)
- XML/JSON OSF Public Feed `/api/feed/{slug}.xml`
- Public SEO HTML pages `/api/p/{slug}/` con schema.org JSON-LD

## Pre-2026-06-17
- M1 (Architecture/Core auth/i18n/multi-tenancy), M2.S1 (Onboarding), M2.S2 (Property CRUD + XML import)
- M2.S3 (CRM Clienti + Search Preferences), M2.S3.5 (Property↔Seller linking)
- M2.S4 (Matching Engine + Gemini AI Lead Scoring + 24h cache)
