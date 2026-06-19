# OMNIA — Changelog

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
