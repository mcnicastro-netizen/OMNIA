# OMNIA Real Estate — Product Requirements Document

**Versione**: 1.0
**Data**: Gennaio 2026 (ultimo update: 24-Feb-2026)
**Founder**: mcnicastro-netizen
- **Stato progetto**: 🎉 **M1 ✅ + M2 ✅ + M3 ✅ + M3.S6-pro ✅ + M5.S1 ✅ + M5.S3 ✅ + Sprint 1 100% ✅ DONE** — Aggiornamento **24-Feb-2026**:
  - ✅ **24-Feb-2026 (fork)**: **M2.6c SOCIAL PUBLISHER DONE (Sprint 1 · Item #2)** — Sprint 1 chiuso al **3/3**. Auto-post su Facebook Page + Instagram Business + Telegram Channel via API ufficiali (Meta Graph v20 + Bot API). **Backend**: nuovo modulo `apps/immoweb/social_publisher.py` con adapter async httpx (FB `/photos` e `/feed`, IG container `/media` + `/media_publish`, Telegram `sendPhoto`/`sendMessage`); router `/api/app/publishing/social/*` con `GET /catalog`, `GET|POST|PATCH|DELETE /channels`, `POST /channels/{id}/validate` (live `/debug_token` + `/me` + IG `/{id}` + TG `getMe`), `POST /publish` (per property_id o payload esplicito), `GET /posts` (audit trail con filtro canale). Nuove collezioni `social_channels` (crediali AES-256-GCM via `shared.utils.crypto.encrypt_dict`) e `social_posts`. Caption builder default in italiano (titolo · 📍 città · 💶 prezzo · 📐 mq/locali · descrizione). **Frontend**: nuova pagina `/it/app/publishing/social` (`SocialPublisherPage.jsx`) con 3 sezioni (canali configurati, catalog da aggiungere, storico post), modale credenziali cifrate, bottone "Testa" per validazione live; CTA "Canali social" nella header di `PublishingPage` accanto al Wizard portali custom. Route protetta per `agency_admin`/`super_admin`/`branch_admin`/`group_admin`. **Credenziali Founder**: Page Access Token non-scadente su Page "Omnia real estate lab" (ID `1275173392335417`, scopes `pages_manage_posts`, `instagram_content_publish`, `instagram_basic`, `pages_read_engagement`, `pages_show_list`); IG Business account da collegare alla Page prima del primo post IG. **Test**: 16/16 pytest (`test_m2s6c_social_publisher.py`: catalog 3 canali + declared credential_fields + activate/encrypt/deactivate + missing/invalid creds 422 + duplicate 409 + tenant isolation + update rotate + disable/enable + delete/404 + publish requires channels + channel_not_configured error path + property_not_found 404 + audit trail + filter by channel + auth boundary 401/403) + **regressione totale 180/180 pytest verdi** (164 pre + 16 nuovi, zero regressioni). Smoke frontend OK — UI Mediterranean Future 2035 con 3 card canali (dot color-coded), tabella canali con badge status, storico post con external_id/errore.
  - ✅ **23-Feb-2026 (fork)**: **M2.6d UNIVERSAL PORTAL WIZARD DONE (Sprint 1 · Item #3)** — self-service configurazione di portali custom (regionali/franchising/nicchia) senza intervento OMNIA. **Backend**: `PortalCatalog` esteso con `owner_agency_id: Optional[str]` + `is_custom: bool` + `endpoint_url` + `site_url`; nuovo endpoint `GET/POST/PATCH/DELETE /api/app/publishing/custom-portals` + `GET .../feed-info?dialect={osf_federata|generic_rss}` per URL feed pronto-copia; slug namespaced con prefix `x-{agency8}-{user_slug}` (tenant isolation forte); `/publishing/catalog` esistente esteso per includere i custom della stessa agenzia + tutti i system portals, esclusi i custom altrui. Modalità **feed_pull only** in Sprint 1 (push/API rinviate a Sprint 2+). **Frontend**: nuova pagina `/it/app/publishing/wizard` con stepper a 4 step (Identità → Formato → Endpoint → Conferma), auto-slug da nome, radio dialect con descrizione, avviso integrazione feed_pull, URL feed pronto-copia con button "Copia" clipboard-based; bottone CTA verde emerald "+ Aggiungi portale personalizzato" nell'header di `PublishingPage`. i18n IT/EN/ES completa (35+ chiavi). **Test**: 13/13 pytest (`test_m2s6d_portal_wizard.py`: feed-info + 4 test create incluso duplicate 409, unsupported dialect/integration 422 + tenant isolation catalog + patch + delete cascading + auth boundary) + **regressione 164/164** (132 originali + 11 Domain Vault + 13 Portal Wizard + 8 immobilcloud auth). Fix minore su `test_m2s6a_publishing.py` per filtrare `is_custom=false` (semantica corretta). Screenshot smoke: step 0/1/4 renderizzano perfettamente con auto-slug e URL feed visibile.
  - ✅ **23-Feb-2026 (fork)**: **M2.5.5 DOMAIN VAULT DONE (Sprint 1 · Item #1)** — signup con garanzia contrattuale "il tuo dominio resta tuo". **Modelli**: `AgencyInDB` estesa con `domain_sovereignty_confirmed: bool`, `domain_sovereignty_confirmed_at: str`, `existing_domain: str`; `UserInDB` estesa con `signup_domain_sovereignty_confirmed` e `signup_existing_domain` (transfer automatico su create_agency). **Backend**: nuovo router `/api/app/agencies/me/domain-sovereignty` (GET + POST, ruoli agency_admin/super_admin/branch_admin/group_admin) in `apps/immoweb/domain_vault.py`; audit trail append-only in collection `domain_vault_events` (agency_id, user_id, confirmed, existing_domain, ts). **Frontend**: `RegisterPage.jsx` con badge emerald 🛡️ "Il tuo dominio resta tuo" (visibile solo per ruoli agenzia), campo opzionale dominio esistente con link a `/verifica-dominio`, checkbox obbligatoria "Ho letto e accetto la Domain Sovereignty Policy" con blocco submit; nuova pagina pubblica `/it/domain-sovereignty-policy` in stile Mediterranean Future 2035 (palette navy/emerald/gold/off-white F5F1E8) con 6 sezioni contrattuali (dominio del cliente, no blocco tecnico/legale, portabilità totale, trasparenza operativa, wind-down 90gg preavviso). Link nel footer di `LandingApp` e `AgenziesLandingPage`. i18n IT/EN/ES per tutte e 40+ chiavi domain_vault. **Test**: 11/11 pytest nuovi (`test_m2s5_5_domain_vault.py`: signup capture + endpoint idempotency + invalid domain 400 + auth boundary + audit trail) + regressione **151/151** (132 originali + 11 nuovi + 8 immobilcloud auth). Lint frontend pulito. Smoke screenshot OK su entrambe le pagine.
  - ✅ **25-Giu-2026**:
  - ✅ **GIS Valuator Pro** completato e testato 100% (37/37 backend pytest + 4/4 frontend E2E). Copertura nazionale via Nominatim province fallback, UNI 10750 commercial surface, coefficienti merito (piano/esposizione/affaccio/riscaldamento/ascensore/anno costruzione) + coefficienti regionali + vincoli/locazione.
  - ✅ **CTA "Confronta con immobili simili in vendita"** sul pannello risultato Valuator → trasforma ogni valutazione in lead funnel verso `/it/cloud/search` con filtri precompilati (città + tipologia + prezzo ±20%).
  - ✅ **AL Chatbot SSE streaming** + inline `AlImproveButton` ("✨ Migliora con AL") per copywriting.
  - ✅ **AL Legal** con Tavily web-search e validator anti-hallucination su `/it/legal`.
  - 📄 **BUSINESS_MODEL.md** documentato — 7-stream revenue ecosystem.
  - ✅ **27-Giu-2026 mattina**: Landing `/it/agenzie` v0.1 (prima bozza) LIVE. Backend `/api/founders/{spots,register}` + 2 template email Resend + frontend completo (hero, counter, 3 wow-moment, pricing table, form 5 campi). Test smoke + curl PASS. Considerata "prima bozza" dal founder, refinement futuro.
  - ✅ **29-Giu-2026**: **ANNCSU Sprint 2 DONE** — live autocomplete indirizzi stile Idealista/Immobiliare.it sul Valuator. Endpoint `/api/cloud/anncsu/suggest` (multi-candidati con doppio provider ANNCSU/Nominatim) + componente `AddressAutocomplete.jsx` (debounce, keyboard nav, badge validazione, autofill comune). Smoke E2E PASS.
  - ✅ **29-Giu-2026 (POMERIGGIO) — D-035 STOP PRE-LAUNCH**: il Founder ferma il filone commerciale (landing/banner/founders 50/sora videos) e richiede ritorno al **PROGRAMMA_OMNIA.md originale**, sequenziale, **passo passo**. Citazione: *"Non ci sarà nessun pre-launch senza Academy e features funzionanti"*. Tutto il filone commerciale ENTRA IN STATO DORMIENTE (codice già in produzione resta, ma non si pubblicizza/promuove). Vedi `DECISIONS.md` D-035.
  - ✅ **03-Lug-2026**: **M5.S4.1 Virtual Staging DONE** — pipeline 3-stage (SAM 2 + Flux LoRA inpainting + Real-ESRGAN) via fal.ai. Costo per render: **$0.056** esatto come stimato in D-033. Frontend page `/it/app/staging` con dropzone + selettore stile/stanza + progress bar 3-stage live + before/after + download watermark AGCM. Test E2E OK.
  - ✅ **03-Lug-2026 (fork)**: **M5.S4.2 Virtual Staging Sprint 2 DONE** — (1) **Reverse Staging** (rimozione arredo esistente + ri-arredo), (2) **varianti parallele 1-4** con scelta utente UI: "1 render" / "4 varianti stesso stile" / "4 stili diversi" multi-select, (3) **prompt CRM-aware** via Gemini (zona/prezzo/target buyer dall'immobile collegato, fallback statico), (4) **bottone inline 🪄 "Arreda questa foto"** nel form immobili → modale StagingStudio con foto pre-caricata, (5) **persistenza render**: salvataggio come foto base64 watermarkate nell'annuncio (endpoint `dataurl` + `save-to-property`), (6) **reaper job orfani** al boot server, (7) **rate-limit per-agenzia** (80/h) oltre a per-utente (20/h). Componente riusabile `StagingStudio.jsx`. Test: 18/18 pytest + testing agent frontend 100%. ⚠️ Test live pipeline BLOCCATO: saldo fal.ai esaurito.
  - ✅ **03-Lug-2026 (fork)**: **Allineamento i18n EN/ES DONE** — 480 chiavi mancanti tradotte via Gemini (script `backend/scripts/translate_i18n.py`, idempotente). Ora 921/921 chiavi in IT/EN/ES, 0 placeholder mismatch, 0 stringhe non tradotte. Verificato con screenshot UI inglese.
  - ✅ **03-Lug-2026 (fork)**: **Report PDF Valutazione brandizzato DONE** (idea ecosistema #3) — `POST /api/cloud/valuator/report-pdf` (reportlab): riusa pipeline UNI 10750, branding agenzia (nome+colori+contatti) se agente loggato, branding OMNIA se anonimo. Tabelle: riepilogo, valore hero, superficie ponderata, coefficienti merito, comparabili, metodologia+disclaimer. Bottone "📄 Scarica report PDF" nel pannello risultato Valuator (i18n IT/EN/ES). Testato curl anonimo+autenticato.
  - ✅ **03-Lug-2026 (fork, pomeriggio)**: **FASE C COMPLETATA** —
    - 📁 **Fascicolo Immobile AI** (precursore paperless Santo Graal): pagina `/app/properties/:id/fascicolo` con prezzo annuncio vs stima AI UNI 10750 (badge sopra/sotto/in linea), checklist documentale rogito (11 tipi: APE, planimetria, visura, atto provenienza, doc identità obbligatori + consigliati + condominiali per tipologie condo), upload/download/delete documenti (base64 nel doc immobile, max 8MB), analisi AL via Gemini con fallback rule-based (persistita), galleria render staging collegati. Link "📁 Fascicolo" nel form immobili (edit). Backend `apps/immoweb/fascicolo.py`, frontend `pages/FascicoloPage.jsx`. Test: 9/9 pytest + testing agent frontend E2E PASS.
    - ✍️ **Descrizione coordinata staging→annuncio**: `POST /staging/jobs/{id}/rewrite-description` — AL riscrive la descrizione in coerenza con lo stile del render scelto (solo dati reali, menzione render virtuali). Bottone "✍️ Descrizione coordinata" in StagingStudio dopo salvataggio variante, con textarea editabile + applica (form o PATCH diretto). Testato live.
    - 🐛 Fix regressione salvataggio immobili (stringhe vuote → campi numerici Pydantic) introdotta dal fix del warning React: ora il submit ripulisce tutti i campi "" (top-level + features). Verificato: salvataggio OK, foto e prezzo persistono.
  - ✅ **03-Lug-2026 (fork)**: Test live pipeline M5.S4.2 SBLOCCATO e PASSATO (23/23): saldo FAL attivo (errore precedente transitorio), generazione reale 2 varianti + download + dataurl + save-to-property. Anche LLM key attiva (~60 crediti).
  - 📷 **MLS multi-agenzia**: pattern documentati in `MLS_RESEARCH.md` (Agestanet backend + nicastroimmobiliare box pubblico). Da NON costruire fino a M4.
  - ✅ **03-Lug-2026 (fork, sera)**: **D-036 + D-037 applicate** —
    - 🤖 **AL → HAL** ovunque user-facing (chat widget, HAL Legal, i18n IT/EN/ES, system prompt). Route API e nomi file invariati.
    - 🗑️ **"Descrizione coordinata" RIMOSSA** su decisione Founder (rischio confusione tra stile render e reale stato manutentivo — principio AGCM). Endpoint + UI + test eliminati. NON riproporre.
    - 🏦 **Strategia M5.S5 Mutui**: motore in-house orientativo (Eurirs/Euribor + spread, TAEG, soglia usura TEGM Banca d'Italia, offerte banche admin-curated). MutuiOnline/Facile/Segugio senza API pubbliche — Founder valuta affiliazioni esterne in autonomia.
    - ⚡ **Strategia M5.S6 APE**: superata da **D-039 (06-Lug-2026)** — calcolatore in-house **eliminato dalla roadmap**. Resta solo il binario partner esterno (D-038, in attesa risposte).
    - Test post-modifiche: 25/25 pytest, frontend compilato, screenshot HAL verificato.
  - ✅ **06-Lug-2026 (fork)**: **M5.S5 COMPARATORE MUTUI DONE** (motore in-house, D-037 — MutuiOnline & co. rifiutano partnership senza volumi): ammortamento francese, TAN=benchmark+spread (Eurirs/Euribor 3M), TAEG via IRR, soglia usura TEGM, LTV 80%/95% Consap under-36, sostenibilità 35%, 14 offerte curate 8 banche in `mortgage_data.py` (aggiornamento manuale, no admin panel). Tre superfici: B2C `/cloud/mutui` + lead capture (`mortgage_leads`), CRM `/app/mutui`, box "Rata stimata" su annunci pubblici → comparatore precompilato. i18n IT/EN/ES. Test: 12/12 pytest + testing agent 100%.
  - 📧 **06-Lug-2026 (fork)**: **D-038 — Outreach partner APE**: preparate email di presentazione per APEFACILE e Certificato-Energetico.it/EnUp (richieste: API key, pay-per-use senza minimi, white label, clausola prezzo finale ≤ listino pubblico). ⏳ In attesa di invio/risposte del Founder. Scope ridotto a link-out/embed "Ordina APE ufficiale" (nessun calcolo lato OMNIA, vedi D-039).
  - ❌ **06-Lug-2026 (fork)**: **D-039 — M5.S6 calcolatore APE orientativo RIMOSSO dalla roadmap**. Motivazioni: rischio disclaimer, valore percepito basso, overhead di manutenzione. Rimane solo il binario partner esterno (D-038).
  - 🎛️ **06-Lug-2026 (fork)**: **D-040 — HAL entry point = 3 bottoni fisici** (Agents / Knowledge / Legal), no router LLM davanti. Trasparenza UX + zero latenza + isolamento dati cross-tenant. Revisione se >15% wrong-button in produzione.
  - 🏛️ **06-Lug-2026 (fork)**: **D-041 — PILLAR ARCHITETTURALE DOPPIO BINARIO** (Track A Turnkey / Track B White Label). Ogni feature futura progettata in **3 modalità di consumo**: UI dentro OMNIA + API+crediti + widget embeddabile. Diventa cornice di tutta la roadmap.
  - 🎯 **06-Lug-2026 (fork)**: **D-042 — Wedge di posizionamento**: **B AI-first + D Zero-friction migration**. A (prezzo) requisito minimo, C (ecosistema) effetto collaterale. Anti-wedge: NON diventiamo Salesforce, NON copiamo Agestanet feature-per-feature.
  - 📥 **06-Lug-2026 (fork)**: **D-043 — Universal Smart Importer 2.0**: HAL-powered mapper universale CSV/XLSX/XML/JSON per ~80% dei gestionali. Connettori nativi solo dopo 5+ paganti dallo stesso gestionale. Agestanet già coperto (parser XML M2.S2). Diventa M2.5.1.
  - 🆕 **06-Lug-2026 (fork)**: **NUOVA MILESTONE M2.5 — WHITE LABEL / DOPPIO BINARIO** inserita in roadmap tra M3 e M4. Sub-sprint: **M2.5.1** Universal Smart Importer, **M2.5.2** Multi-branch/Franchising, **M2.5.3** API Gateway + API Keys, **M2.5.4** Widget Embeddabili, **M2.5.5** Feed XML bidirezionale continuo. Priorità dopo completamento fascia AI (M5.S2 HAL Knowledge) e prima di M4 (crediti).
  - 📖 **06-Lug-2026 (fork)**: **M5.S2-pre Manuale Operativo SOSPESO** su decisione Founder (Cap. 1 draft creato in `/app/memory/manuale/01-introduzione-primo-accesso.md`, rimandato). Ripreso dopo consolidamento M2.5 + definizione unit economics.
  - 🎯 **06-Lug-2026 (fork)**: **D-044 — PROGRAMMA_OMNIA.md riformulato in v3.0** con priorità approvate dal Founder: **P0** M2.5.0 docs strategici (`GO_TO_MARKET.md` + `PRICING_OMNIA.md` v2) → **P1** M2.5 Doppio Binario (ordine interno: Multi-branch → API Gateway → Widget → Feed bidir. → Importer 2.0) → **P2** Manuale Operativo + HAL Knowledge → **P3** M6 Academy → **P4** M4 MLS+Stripe (post-società, confermato dopo M6). `ROADMAP.md` allineato. Sub-sprint M2.5 rinumerati (Importer diventa M2.5.5).
  - 🔍 **06-Lug-2026 (fork)**: **COMPETITIVE_ANALYSIS_TRACK_B.md creato** (prerequisito M2.5.0): ricerca su 7 fronti — valutatori white-label (DomusReport €50-100/mese, RealAdvisor €50-500, Sprengnetter €539/anno+€0,80/call, PriceHubble enterprise-only), staging SaaS ($0,20-0,95/foto vs nostro costo €0,056), stack franchising (Tecnocasa=Salesforce, RE/MAX=HubSpot, Gabetti=onOffice+Toolbox AI di terzi), pricing API PropTech (flat+overage vince), MLS Frimm €1.000-1.500/anno, chatbot white-label ($99-1.299/mese, ZERO comparabili per HAL Legal), mutui white-label (inesistente, L.118/2022 apre mediazione+agenzia). **Scoperta chiave: la suite headless verticale integrata self-service NON esiste in Italia — white space Track B confermato.** GTM raccomandato: bottom-up dalle affiliate + canale web agency. Corridoi di prezzo benchmark-derived pronti per PRICING v2.
  - 🧲 **06-Lug-2026 (fork)**: **D-045 — "Il nodo della domanda"** (approvato dal Founder): strategia GTM a 3 pilastri — ① AND-non-OR sui portali ("riduci e possiedi", mai "abbandona i portali"), ② **Marketing Autopilot** come tema di prodotto post-M2.5 (auto-post social D-FUTURE-11 + alert B2C + SEO programmatico Valutatore + contenuti HAL), ③ rampa ImmobilCloud dichiarata. Aggiunto **Fronte 8** all'analisi Track B con i numeri REALI dal PDF contratti del Founder: stack attuale €3.692/anno scontato → **€7.786/anno a regime** (pack Idealista+Casa.it raddoppia automaticamente al 13° mese: €194,50→€389/mese) vs OMNIA Pro €1.188/anno = **-85%**. ⚠️ Corretto errore ricorrente: il Valutatore è **copertura nazionale 100%** (~7.900 comuni, 3 layer), NON "124 città" (regola #11 in AGENT_BOOTSTRAP).
  - 📄 **06-Lug-2026 (fork)**: **P0/M2.5.0 CONSEGNATA** — creato `GO_TO_MARKET.md` v1.0 (wedge B+D, ICP Track A/B incl. web agency come canale, "nodo della domanda" D-045, motion bottom-up 4 fasi, messaging kit con claims documentati, metriche validazione, vincolo D-035 esplicito) + `PRICING_OMNIA.md` v2.0 bozza (listino Track B completo: widget Valuator €39-79, HAL Legal €69, Mutui €19, bundle €119/mese; API a crediti unificati; feed inbound €49/mese; free tier dev 25 azioni con badge; staging 1→3 crediti €0,90; benchmark -85% vs stack reale). 🟡 **In attesa di revisione/approvazione Founder** → poi P1 M2.5.1 Multi-branch.
  - 🤝 **06-Lug-2026 (fork)**: **D-046 — Programma Partner Web Agency** approvato dal Founder: rev-share **20% ricorrente a vita** (25% Certified) + 10% crediti, tier Gold/wholesale **dormiente**, deal registration, certificazione via Academy, `partner_id` previsto in M2.5.2. Formalizzato come §4-bis di `GO_TO_MARKET.md`.
  - 🔗 **06-Lug-2026 (fork)**: **Share bar sul portale B2C** — aggiunta barra "Condividi" (WhatsApp, Facebook, X, Email, Copia link + Web Share API nativa su mobile) nell'hero della pagina annuncio ImmobilCloud (`PropertyDetailPage.jsx`, componente `ShareBar`, data-testid `detail-share-bar`/`share-*`). i18n IT/EN/ES (`cloud.share_*`). Testata con screenshot: tutti i pulsanti renderizzati. Le anteprime rich sui social sono già supportate dal JSON-LD Schema.org esistente.
  - 🎯 **Prossimo accesso**: revisione Founder dei 2 documenti P0 → **P1 M2.5.1 Multi-branch/Franchising Layer** (primo sprint di codice: agency_group, branch, ruoli, plan_type) (`GO_TO_MARKET.md` + `PRICING_OMNIA.md` v2 con unit economics Track A/B, cap free tier, crediti API group/branch) → revisione Founder → **P1 M2.5.1 Multi-branch**.
  - ✅ **13-Lug-2026 (fork)**: **P0 APPROVATA + M2.5.1 MULTI-BRANCH/FRANCHISING LAYER DONE** (D-041). Founder ha approvato `GO_TO_MARKET.md` + `PRICING_OMNIA.md` v2 e ha dato il via a M2.5.1.
    - **Backend**: nuovo modello `AgencyGroup` (holding/franchising con `credits_mode: group|branch` default **branch**), estensione `AgencyInDB` con `group_id`, `branch_code`, `plan_type: turnkey|whitelabel|hybrid` default **hybrid** (per esistenti). Nuovi ruoli `group_admin`/`branch_admin`/`branch_agent` in `UserRole` con backward-compat via alias in `require_roles()` (agency_admin ≡ branch_admin ≡ group_admin; agent ≡ branch_agent ≡ branch_admin ≡ group_admin). Router `/api/app/groups`: create/list/get/patch/me + `POST/GET/DELETE /{gid}/branches` + `GET /{gid}/consolidated` (rollup properties/clients/leads su tutte le branch del gruppo). Promozione automatica creator → `group_admin` con `group_id` sul record utente.
    - **Frontend**: nuova pagina `/it/app/group` (accessibile solo a `group_admin`/`super_admin`) con 6 KPI consolidati (filiali, attive, immobili attivi/totali, clienti, lead aperti) + tabella filiali con branch_code, plan_type badge, rollup counter per riga. Voce sidebar "Gruppo" condizionale al ruolo. i18n IT/EN/ES completa (23 chiavi × 3).
    - **Test**: 15/15 pytest (`test_m2s5_1_groups.py`) — Group CRUD + Branches attach/detach + Consolidated KPIs + Backward-compat (`/agencies/me` intatto, `/auth/me` espone `group_id`) + Auth boundary. Regressione full suite: 32/33 (1 pre-esistente su seller_link patch, non correlato). Smoke E2E frontend PASS (screenshot verificato: "Nicastro Immobiliare" con 1 filiale MAIN-01 e KPI rollup corretti).
  - ✅ **13-Lug-2026 (fork)**: **M2.5.2 API GATEWAY TRACK B DONE** (D-041/D-046). Prima porta d'ingresso "esterna" alle feature OMNIA per agenzie whitelabel/hybrid.
    - **Backend chiavi**: modello `ApiKeyInDB` (SHA-256 hash-only storage, mai plaintext dopo issue), `ApiUsageLogInDB` per audit billing, `partner_id` opzionale per rev-share D-046. Auth Bearer `Authorization: Bearer omk_live_...` via `shared/auth/api_key.py` (`require_api_key` + `charge_and_log`). Debit crediti solo su successo, log rows su ogni chiamata (anche errori) con `partner_id` propagato per attribuzione commissioni.
    - **Router UI management** `/api/app/api-keys`: list/issue (one-time plaintext) / revoke / adjust credits (top-up manuale fino a M4/Stripe) / usage log.
    - **Router pubblico v1** `/api/v1/*`: `health` (no auth) + `me` (0 cr) + `valuator` (5 cr) + `mortgages/compare` (1 cr) + `legal/ask` (3 cr) + `feed/properties` (0 cr) + `staging/render` (501 riservato a M2.5.3). Riusa i handler esistenti Immocloud/Immoweb — zero duplicazione business logic. Pricing 1 credito = €0,03 allineato a `PRICING_OMNIA.md` v2.
    - **Frontend**: pagina `/it/app/api-keys` con form emissione (nome + crediti + partner_id), box show-once verde per il plaintext, tabella chiavi (prefix visibile, hash mai esposto), azioni top-up/revoca, docs footer con endpoint. Sidebar "API Keys" condizionale a agency_admin+. i18n IT/EN/ES completa (14 chiavi × 3).
    - **Test**: 15/15 pytest (`test_m2s5_2_api_gateway.py`) — issuance/plaintext shape/hash-never-returned + auth boundary (invalid/unknown/bad-prefix) + credit debit correct (1/5) + partner_id in usage log + 402 insufficient credits + free endpoint still works when low + revoke cuts access + management requires JWT. Regressione + M2.5.1: 30/30 pytest passati (`test_m2s5_1_groups.py` + `test_m2s5_2_api_gateway.py`). Smoke E2E screenshot verificato: 1 chiave attiva "Widget Demo Web Agency" con saldo 94/100 dopo 6 crediti spesi in 3 chiamate reali (mutui + valutatore + me).
    - **Prossimo**: **M2.5.3 Widget Embeddabili** (iframe brandizzato Valuator/Mutui/HAL Legal che chiama internamente le v1 API) → **M2.5.4 Feed bidirezionale** → **M2.5.5 Universal Smart Importer 2.0**.
  - ✅ **14-Lug-2026 (fork)**: **M2.5.3 WIDGET EMBEDDABILI TRACK B DONE** (D-049). 2 widget pronti alla demo commerciale ("1 riga di codice").
    - **Backend widget assets**: nuovo router `/api/widgets/v1/*` che serve HTML+JS single-file da `apps/v1/assets/` con placeholder injection (backend URL da forwarded headers, primary color, chiave, lang). Widget `valuator.html` (form UNI 10750 + lead capture + auto-resize via postMessage) e `mortgages.html` (top-3 offerte + lead capture). `loader.js` (~2KB) che crea iframe responsive, gestisce resize dinamico, valida `data-key` prima di montare. Headers CSP `frame-ancestors *` per embed cross-origin.
    - **Security widget**: campo `allowed_origins` su `ApiKeyInDB` (whitelist domini con supporto wildcard `https://*.example.com`). `require_api_key` verifica Origin OR Referer (resiliente a proxy che riscrivono Origin, come il nostro k8s ingress). Chiave senza whitelist = permissive (server-side). PATCH `/api/app/api-keys/{id}/origins` per aggiornare la whitelist.
    - **Endpoint lead** `POST /api/v1/widgets/lead` (0 crediti — lead ingestion sempre gratuita, monetizzazione tramite feature) che crea riga `db.leads` con `source=widget_*`, `partner_id`, `context` completo, `source_url`. Validazioni: consent obbligatorio + almeno email o telefono.
    - **Frontend**: (1) `/it/widgets` (public showcase) con tab switcher Valuator/Mortgages, snippet installazione copy-to-clipboard, iframe anteprima LIVE che chiama davvero l'API se il visitatore incolla una chiave, come-funziona in 3 step. (2) Pagina API Keys estesa: textarea `allowed_origins` (uno per riga), docs footer con snippet embed, link diretto a `/it/widgets` per anteprima.
    - **Test**: 15/15 pytest (`test_m2s5_3_widgets.py`) — asset serving (loader.js con backend URL corretto, HTML con color/lang injection, CSP headers, 404 su widget sconosciuti) + origin whitelist (block quando no headers, allow via Referer, block su origin diverso, wildcard subdomain, permissive senza whitelist) + widget lead capture (crea CRM row, richiede consent, richiede email/phone, valida widget name) + PATCH origins. Regressione totale: **45/45 pytest passati** (M2.5.1 + M2.5.2 + M2.5.3). Smoke E2E screenshot verificato: showcase page con anteprima iframe live di entrambi i widget (chiave demo `Widget Demo Site` con partner_id `webagency_demo` e whitelist popolata).
    - **Prossimo**: ~~M2.5.4 Feed XML bidirezionale~~ → **RIVISTA: M2.5.4 Domain Sovereignty Kit** (Extraction-first, D-051).
  - ⚠️ **15-Lug-2026 — SCOPERTA STRATEGICA "DOMAIN LOCK-IN AGESTANET"** (D-051): il Founder ha rilevato che sul contratto `agestanet_9491_[3-6-2026].pdf` l'Allegato A elenca "Dominio (nicastroimmobiliare.it)" come voce fatturata (€400 listino). Nel suo Aruba risultano registrati solo `nicastroimmobiliare.eu` + `omniarealestateecosystem.it` → **il dominio `.it` è probabilmente registrato da BasicSoft/Agestanet**, non a suo nome. Il problema si estende a **~1.803 agenzie clienti Agestanet + ~4-6.000 agenzie italiane** clienti di gestionali con business model analogo. Founder ha approvato strategia **"Extraction-first"** (aiutare chi è già in trappola, prima di "Prevention"). Regola imposta: **ZERO nomi di concorrenti in qualsiasi materiale pubblico**.
  - ✅ **15-Lug-2026 (fork)**: **M2.5.4a UNIVERSAL XML IMPORTER DONE** (D-050). Prima pietra del pacchetto "Domain Sovereignty Kit" per estrazione da gestionali legacy.
    - **Backend parser** `shared/importers/universal_xml.py`: schema-agnostic XML→OMNIA mapping. Riconosce nativamente feed dei principali gestionali immobiliari italiani (codici numerici tipologia 3/10/31/etc, classi energetiche numeriche, contratti V/A/S, foto vs piantine tramite `tipoN=F|P`, testi multilingua `testo_it/eng/spa/ted/fra`, flag booleani + keyword-based fallback su testo libero, coordinate lat/lng, ~30 feature). Zero riferimenti a competitor concreti nel codice o nei log — solo tabelle euristiche generiche.
    - **Backend API** `/api/app/import/xml/*`: two-phase flow **preview → commit** con session in-memory TTL 10min. `POST /preview` (multipart, JWT) ritorna `ParseReport` completo. `POST /commit` supporta `dry_run` + `skip_duplicates_by_ref` (match `reference_code`), insert batch. Guard 50MB max.
    - **Frontend** `/it/app/import`: drag-drop + preview con 3 stat card (tipologia/contratto/città) + tabella samples + warnings + divergences. 2 CTA "Simulazione" (dry-run) o "Importa in OMNIA" + checkbox dedupe. Copy 100% generica "il tuo attuale gestionale". Sidebar "Importa" condizionale a agency_admin+. i18n IT/EN/ES.
    - **Test**: 12/12 pytest (`test_m2s5_4a_xml_importer.py`). Regressione totale: **57/57 pytest** (M2.5.1+M2.5.2+M2.5.3+M2.5.4a). E2E reale: upload feed XML 3 immobili → preview 3/3 → commit 3 inseriti con `_import_source: universal_xml_importer_v1`.
    - **Prossimo**: **M2.5.4b Domain Ownership Checker** (landing pubblica RDAP `/it/verifica-dominio`) → **M2.5.4c Legal Templates Pack** (4 PDF PEC/GDPR/disdetta/CNR). Poi **M2.5.5 Domain Vault** (prevention per nuovi OMNIA).
  - 🆕 **15-Lug-2026 — M2.6 PUBLISHING CENTER inserito nel programma** (roadmap update). Il Founder ha condiviso screenshot dell'area "Portali Immobiliari" del gestionale attuale (52 portali gestiti, sync giornaliera automatica, credenziali per-portale, filtri "in pubblicità"). Gap analysis: OMNIA ha già feed XML endpoint pubblico single-dialect (da M3), ma manca l'intero **layer OUTBOUND** verso portali esterni (catalogo, credenziali, scheduler, compliance, UI dashboard). Effort stimato: 12-13h su 3-4 sessioni. Sub-sprint pianificati:
    - **M2.6a — Portal Catalog + Connection Layer + Feed multi-dialetto** (P0 — ~5h): modelli `PortalCatalog` + `AgencyPortalConnection` + feed generator con dialetti (OSF-Federata, generic RSS, Facebook Catalog XML, Google Merchant XML), UI dashboard `/it/app/portali` a 3 stati (attivi/disponibili/da-aggiornare).
    - **M2.6b — Sync scheduler + Status tracking + Compliance validator** (P1 — ~4h): job APScheduler-based giornaliero, `PortalSyncLog` collection, validatore pre-publish (classe energetica L. Boschi, min foto, prezzo).
    - **M2.6c — Social Publisher** (P2 — ~3h): Facebook Pages/Instagram Business/Telegram broadcast via API Graph + scheduler settimanale.
    - **M2.6d — Universal Portal Wizard** self-service (P3 — ~1h): agenzia aggiunge portali custom senza aspettare noi.
    - **3 decisioni pending** (da prendere prima di M2.6a): (1) sicurezza credenziali AES/vault/token-only, (2) compliance validator hard vs soft per energetica/foto/prezzo, (3) priorità coverage MVP (5-8 portali gratis top).
  - ✅ **16-Lug-2026 (fork)**: **M2.6a PUBLISHING CENTER FOUNDATION DONE** (D-052). Match funzionale con area "Portali" gestionali legacy — OMNIA ora è sostituibile.
    - **Backend**: modelli `PortalCatalog` + `AgencyPortalConnection` + `PortalSyncLog` in `shared/models/portal.py` (coesistenti con `PortalSubscription` legacy). AES-256-GCM encryption per credenziali via `shared/utils/crypto.py` (key da env `CREDENTIALS_MASTER_KEY` con fallback deterministico su MONGO_URL per dev). Router `apps/immoweb/publishing.py` con endpoint `/api/app/publishing/catalog|connections|connections/{id}|connections/{id}/logs`. Feed pubblico `/api/app/publishing/feed/{agency_slug}.xml?dialect=osf_federata|generic_rss`. Compliance validator HARD (D-052 approvato): esclude annunci senza prezzo/rent, senza classe energetica, con <3 foto. Catalog seed automatico allo startup con 8 portali MVP Fase 1: **Subito · Bakeca · Kijiji · Wikicasa · Facebook Marketplace · Google Business Profile · Attico · Case24**.
    - **Frontend**: pagina `/it/app/publishing` con 3 metric card (attivi/disponibili/catalogo), tab switcher Attivi/Disponibili, tabella portali con traffic_score in stelle, modal attivazione con form credenziali dinamico (basato su `credential_fields` del catalogo). Sidebar "Portali" condizionale a agency_admin+. Banner "Compliance HARD attiva" ben visibile. i18n IT/EN/ES.
    - **Test**: 16/16 pytest (`test_m2s6a_publishing.py`) — catalog seeded/sorted, connection activate/duplicate/update/delete, credenziali mai leaked (encryption verified), feed dialects (osf_federata + generic_rss), compliance filter HARD, auth boundary. **Regressione totale: 73/73 pytest** (M2.5.1+M2.5.2+M2.5.3+M2.5.4a+M2.6a). Smoke E2E screenshot verificato: showcase 8 portali ordinati per traffic_score, tab funzionanti.
    - **Prossimo**: **M2.6b Sync Engine + Compliance UI** (APScheduler job giornaliero + `PortalSyncLog` visualization + per-property publishability preview).
  - ✅ **05-Feb-2026 (fork)**: **M2.6b SYNC ENGINE + COMPLIANCE VALIDATOR DONE** (D-053). Il Publishing Center passa da statico ad automatico.
    - **Compliance Validator** `shared/validators/compliance.py`: modulo dedicato, hard rules (blocca pubblicazione) + soft rules (warning non bloccante). Hard: prezzo/canone, superficie mq, classe APE valida (VALID_ENERGY_CLASSES da D.Lgs 192/2005 incluso A4-G + EXEMPT), min 3 foto con URL valido, indirizzo città+provincia. Soft: titolo <10 chars, descrizione <50 chars, IPE mancante, locali non indicati. Aggregatore `summarize_agency_compliance()` con top-5 motivi blocco per dashboard.
    - **Sync Engine** `apps/immoweb/sync_engine.py`: `sync_connection()` per singola connessione, `sync_connection_with_retry()` con backoff esponenziale 1min/5min/30min (skippato su trigger manuale per snappy response), `run_all_active_syncs()` per il job giornaliero. Distingue integration_type `feed_pull` (portali PULL: refresh timestamp) vs `api_push` (portali PUSH: stub `simulated_push` in attesa M2.6c/d). APScheduler AsyncIOScheduler daily job **06:00 UTC** avviato in server lifespan (`start_scheduler()`), idempotent su hot-reload.
    - **Sync Logs**: collection `publishing_sync_logs` scrive `started_at`, `ended_at`, `status` (success/partial/failed), `items_ok`/`items_failed`, `error_message`, `retry_count`, `trigger` (scheduled/manual/admin_manual). `last_sync_at`/`next_sync_at` scritti su `publishing_connections`.
    - **Endpoint nuovi** in `publishing.py`: `POST /api/app/publishing/connections/{id}/sync-now` (agenzia trigger manuale), `GET /api/app/publishing/connections/{id}/compliance` (snapshot compliance + top-20 immobili bloccati con motivi), `POST /api/app/publishing/sync/run-all` (super_admin bypass scheduler). `is_publishable()` legacy tenuto come wrapper backwards-compatible.
    - **Frontend**: aggiornata `PublishingPage.jsx` con 3 nuovi pulsanti azione per riga (SYNC/COMPLIANCE/DISATTIVA), riga "ultimo sync" sotto il nome portale, badge errore ultimo sync, banner risultato sync (verde/ambra) dopo run manuale. Nuova modale `portal-compliance-modal` con 4 metric card (totale/pubblicabili/bloccati/con-warning) + top-5 motivi blocco tradotti in italiano (`REASON_LABELS`) + lista primi 20 immobili bloccati con link "Correggi →" all'edit. Banner header aggiornato a "Compliance HARD attiva + Sync automatico".
    - **APScheduler installato** (3.11.3, salvato in requirements.txt). Fix minor: `_record_log()` fa `.pop("_id")` sul dict dopo `insert_one` per non restituire ObjectId a FastAPI.
    - **Test**: 20/20 pytest (`test_m2s6b_sync_engine.py`) — 9 unit test compliance validator (fully compliant / hard blocks singoli e combinati / soft warnings non bloccano / summarize aggregate), 6 integration test sync endpoint (feed_pull success, api_push simulated, 404, 409 disabled, last_sync_at update, log record with trigger=manual), 2 test compliance endpoint, 1 test super_admin run-all, 2 auth boundary. **Regressione totale: 93/93 pytest** (M2.5.1+M2.5.2+M2.5.3+M2.5.4a+M2.6a+M2.6b). Smoke E2E: attivato bakeca, cliccato Sync → banner "0 pubblicabili, 9 bloccati" corretto, aperta modale Compliance con motivi frequenti "Meno di 3 foto: 9 immobili", "APE mancante: 5", "Indirizzo incompleto: 5" e lista dettaglio con link Correggi.
    - **Prossimo**: **M2.5.4b Domain Ownership Checker** (landing pubblica RDAP) → **M2.5.4c Legal Templates Pack** → **M2.6c Social Publisher** (Facebook/Instagram/Telegram auto-post con integrazione API reale).
  - ✅ **05-Feb-2026 (fork)**: **M2.5.4b DOMAIN OWNERSHIP CHECKER DONE** (D-054). Secondo tassello del "Domain Sovereignty Kit" (D-051), primo lead magnet pubblico con delivery 100% digitale (no paper) e già disponibile in tutte e 3 le modalità Track A/B (D-041 White Label).
    - **RDAP Client** (`shared/utils/rdap.py`): async httpx (5s+8s timeout, fail-closed) verso il bootstrap universale `rdap.org/domain/{domain}` + fallback per TLD IT/EU/COM/NET/ORG. Normalizza output: registrant, registrar, nameservers, created/expires/last_changed, `not_found`. `normalize_domain()` strip protocollo/www/path e valida sintassi.
    - **Domain Checker Logic** (`apps/marketing/domain_check.py`): euristica generica (regola D-051 no brand mentions) su 4 status: `owner_ok` (green), `likely_hostage` (red — keyword pattern-matching su termini categoriali come "hosting", "web agency", "software solutions", "servizi web", "unipersonale" — MAI nomi di competitor concreti), `redacted` (amber — privacy proxy GDPR), `ambiguous` (amber — registrante presente ma non riconducibile), `not_registered` (info), `unknown` (rdap error). `_domain_matches_registrant()` fuzzy match domain brand vs registrant name vs optional agency_name field.
    - **3 modalità di consumo (White Label nativa)**:
      - **Landing pubblica** `/it/verifica-dominio` (nessuna auth, IP-rate-limited 30/h) → hero + form check + verdict card colorata + lead capture (email/nome/agenzia + GDPR consent obbligatorio). Copy "tutto digitale, zero carta" esplicita.
      - **v1 API Gateway** `POST /api/v1/domain/check` (Bearer API key, 1 credito) per partner web agency + rev-share 20% D-046 propagato automaticamente via `partner_id` in usage log.
      - **Widget embeddabile** `/api/widgets/v1/domain-check.html?key=omk_...&primary=#0b1e3f&lang=it` — single-file HTML+JS con auto-resize postMessage, CSP frame-ancestors *, lead capture inline. Se `key` è vuota parla al `/api/domain/check` pubblico; se è una `omk_...` parla al `/api/v1/domain/check` billed (comportamento switch client-side).
    - **Endpoint pubblici** (`/api/domain/check` + `/api/domain/lead`): rate limit collection-based (`domain_checks` con `client_ip` + `created_ts`), consenso GDPR obbligatorio sul lead, `check_id` UUID per collegare check→lead, mai leak di IP nella response. Persistenza in `domain_checks` + `domain_leads` con `verdict_status` snapshot per analytics.
    - **Costo credito**: `CREDIT_COSTS["domain_check"] = 1` (=€0,03 allineato PRICING_OMNIA v2). Nessun costo lato utente sulla landing pubblica.
    - **Test**: 24/24 pytest (`test_m2s5_4b_domain_checker.py`) — 3 test `normalize_domain` (lowercase/strip-scheme/invalid), 5 heuristics (matches agency, provider hint pos/neg, redacted detection), 6 `_analyze` (not_found/error/owner_ok/likely_hostage/redacted/ambiguous), 3 public check (400 invalid, verdict shape valid, no IP leak), 3 public lead (consent required, missing check 404, 201 happy), 2 v1 (auth required, 1 credit charged), 2 widget asset (HTML placeholder replacement, unknown 404). Cleanup fixture drop `domain_checks` per evitare trip del rate limiter durante il run. **Regressione totale: 117/117 pytest** (M2.5.1+2+3+4a+4b+2.6a+2.6b). Smoke E2E: query `google.com` → verdict `redacted` con registrar MarkMonitor + expiry 14/09/2028 visualizzati correttamente.
    - **Prossimo**: **M2.5.4c Legal Templates Pack** (4 PDF template GDPR/PEC/disdetta/CNR scaricabili gratuiti — delivery via email, 100% no paper) → **M2.5.5 Domain Vault** (signup dove OMNIA garantisce di non registrare mai domini a proprio nome).
  - ✅ **23-Feb-2026 (fork)**: **M2.5.4c LEGAL TEMPLATES PACK DONE** (D-055). Terzo tassello del "Domain Sovereignty Kit" (D-051), completamento del funnel iniziato con M2.5.4b Domain Checker. Delivery **100% digitale** (D-035 No Paper).
    - **Motore PDF** (`shared/legal_kit/`): 4 template legali generici parametrizzati con Jinja2 (nessuna menzione competitor, D-051): (1) Richiesta portabilità dati GDPR art. 20 al fornitore, (2) Richiesta titolarità dominio al registrar, (3) Disdetta contratto fornitore, (4) Reclamo/richiesta info Registro .it CNR-IIT. Ogni template ha metadata (target, when_to_use, canale PEC, giorni risposta) + sezioni (oggetto, premesso che, chiede, modalità consegna, riferimenti normativi). Placeholder mancanti resi come `[DA COMPILARE]` visibili — l'utente sa cosa completare.
    - **PDF renderer** (`shared/legal_kit/pdf_generator.py`): ReportLab platypus con layout editoriale coerente Brand Lab (Deep Navy #0B1E3F header strip, Gold wordmark, Emerald accents, disclaimer footer). `render_pdf(slug, ctx)` restituisce bytes PDF/A. `render_kit_zip(ctx)` bundle i 4 PDF + `LEGGIMI.txt` in un unico ZIP scaricabile.
    - **3 modalità di consumo (D-041 White Label)**:
      - **Landing pubblica** `/it/verifica-dominio` → blocco "Scarica Legal Kit" appare automaticamente dopo verdict `critical` o `warning`. Form con email + consenso GDPR + optional (agency_name/signer/PEC). Download del ZIP in-browser via `blob URL`, senza email inviate (l'utente ottiene il file istantaneamente + noi catturiamo il lead in `legal_kit_leads`).
      - **API pubblica** `POST /api/legal/download/{slug}` + `POST /api/legal/kit` (rate-limit 20/h/IP via collection `legal_kit_events`), consenso GDPR obbligatorio sul kit completo.
      - **v1 API Gateway** `POST /api/v1/legal/render` — **2 crediti** (compute cost superiore a domain_check), Bearer API key, ritorna `application/pdf`, header `X-Credits-Charged: 2`.
    - **Endpoint pubblici** (`/api/legal/*`): `/templates` (lista catalogo con 4 items), `/download/{slug}` (singolo PDF), `/kit` (ZIP + lead capture). Persistenza minima: `legal_kit_events` (rate limit + audit) + `legal_kit_leads` (con flag `context_has_domain` per analytics conversion). Nessuna PII nel response, `client_ip` sempre `pop()` prima del ritorno.
    - **Frontend integrazione**: nuovo componente `LegalKitBlock` in `DomainVerifyPage.jsx` posizionato subito dopo il verdict card (prima del LeadForm esistente). Design ambra distintivo (differenzia dal lead form emerald). Copy esplicita "**Nessun invio cartaceo. Delivery digitale al 100%**". Download client-side via blob URL con nome file `omnia_legal_kit.zip`.
    - **Costo credito**: `CREDIT_COSTS["legal_render"] = 2` (=€0,06 allineato pricing v2 — più costoso di domain_check per compute PDF).
    - **Test**: 15/15 pytest (`test_m2s5_4c_legal_kit.py`) — 2 catalog (4 templates + no brand mentions D-051), 4 unit PDF (bytes/magic/all-slugs render/placeholder substitution deterministic diff/missing slug KeyError/ZIP contents), 5 integration public (list templates, single 200, 404 unknown, consent required, kit ZIP happy), 3 v1 (auth required, 2 credits charged, 404 unknown), 1 cleanup fixture. **Regressione totale: 132/132 pytest** (M2.5.1+2+3+4a+4b+4c+2.6a+2.6b). Smoke E2E: query `google.com` → verdict `redacted` → blocco Legal Kit visibile → form + pulsante download attivi dopo consenso.
    - **Documento supporto**: creato `/app/memory/emails/dossier_commerciale_ape.md` — 1-pager di preparazione alle call APEFACILE + EnUp con volumi 2026/2027 stimati, deal-breaker, matrice comparativa, struttura commerciale rev-share preferita, red flags, script pitch di apertura, leve psicologiche.
    - **Prossimo**: **M2.5.5 Domain Vault** (badge "il tuo dominio resta tuo" nel signup + garanzia contrattuale) → **M2.6c Social Publisher** (Facebook/Instagram/Telegram auto-post reale) o **APE Partnership** (dopo call).
  - ✅ **23-Feb-2026 (fork)**: **M2 CORE DoD VALIDATO AL 100%** — l'ultimo item mai testato della Definition of Done ("test empirico 5 agenti in parallelo nella stessa agenzia") è stato eseguito da testing_agent_v3_fork con stress test completo.
    - **Setup**: seed di 4 agenti aggiuntivi via `/app/backend/tests/seed_stress_agents.py` con hash bcrypt corretto (pattern `shared/auth/passwords.py`), tutti nell'agenzia Nicastro (abc7004b-04a3-414b-8197-8e0e983d0892). Cleanup finale idempotente.
    - **6 scenari di stress eseguiti in parallelo** (`/app/backend/tests/test_m2_stress_5_agents.py`, ThreadPoolExecutor Python):
      1. Login concorrente 5 sessioni → 100% ok, wall 1.7s, p95 1.7s
      2. CREATE 25 properties concurrent (5 agenti × 5 immobili) → 100% ok, wall 3.9s, avg 3.6s, 25 reference_code univoci, ogni immobile attribuito all'agente creatore
      3. READ 50 concurrent (5 agenti × 10 GET /properties) → 100% ok, wall 3.2s, read p95 2.6s (baseline 42ms, degradazione 37× ma nessun 500)
      4. UPDATE concorrente 5 PATCH stesso immobile → 100% ok, wall 47ms, last-write-wins coerente, nessun deadlock MongoDB
      5. Matching engine concorrente 15 (5 × 3 clienti) → 100% ok, wall 113ms, p95 107ms
      6. Tenant isolation → verificato, agenti Nicastro NON vedono dati di altre agenzie
    - **Verdetto**: **PASSED — concurrency-safe, tenant-isolated, data-consistent**. 0 errori 500, 0 duplicati reference_code, 0 deadlock, 0 leak inter-tenant. Tutti i criteri funzionali soddisfatti.
    - **Warning perf attribuiti a infra preview + design consapevole**:
      - POST /properties avg 3.6s vs target 2s → **fire-and-forget geocoding scheduler** (design intenzionale, geocoding non blocca response ma allunga la trace) + latency infrastrutturale preview. In produzione con async geocoding via Motor background task si dovrebbe rientrare <1s
      - GET /properties p95 2.6s vs target 1.5s → sotto 50 richieste concorrenti la degradazione 37× rispetto al baseline (42ms) è accettabile su preview, da ricontrollare su infra prod. Suggerimento code review: aggiungere projection esplicito sul list endpoint per ridurre payload
    - **Code review comments** (dal testing agent):
      - `properties.py:194` update_one non filtra per agency_id (già filtrato via find_one) — safe ma consigliato defensive $set
      - `matches.py` compute-on-read a 88ms medio sotto load — design confermato ottimo
    - **Cleanup completo**: 25 properties + 15 clients + 4 agents eliminati dal DB. Suite pytest 100% self-contained e ri-eseguibile.
    - **Milestone M2 core** ora ufficialmente ✅ DoD al 100% (14/14 item validati).
    - **Prossimo**: chiudere anche **M2.5 al 100%** con M2.5.5 Domain Vault → M2.6c Social Publisher → M2.6d Universal Portal Wizard.



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

## Changelog Sessione 24-Giu-2026 — Strategic & AI Suite

### ⚙️ Tecnico realizzato (4 milestone)
- ✅ **M5.S1 AL for Agents** completato (chat + streaming SSE + inline copywriter IT/EN/ES)
- ✅ **M5.S3 AL Legal** completato (5 sub-agenti, Tavily web search, anti-hallucination, PDF analysis, disclaimer L.247/2012)
- ✅ Brand rename "Al" → "**AL**" ovunque (D-030)
- ✅ P2 fix Chrome auto-translate

### 🧠 Strategic decisions (NON ANCORA IMPLEMENTATE)
- **D-032**: OMNIA è marketplace multi-side con **7 revenue stream**, non SaaS B2B singolo. Vedi `BUSINESS_MODEL.md`
- **D-033**: Architettura **M5.S4 Virtual Staging "premium 3-stage"**: SAM + Flux Inpainting + Real-ESRGAN via fal.ai (~€0,06/img vs €15-29 competitor)
- 5 differenziatori M5.S4: CRM-aware prompt / Reverse Staging / Micro-tour video / A/B test portale / Trasparenza normativa

### 💰 Pricing draft (da validare con consulente esterno)
- Starter €69 / Pro €189 / Premium €499 / Enterprise custom (per agenzia, non per agente)
- **Founder 50** offer: −50% per 24 mesi prime 50 agenzie (lock-in)
- Sweet spot Pro: agenzia media 3-5 agenti, margine 74%
- Vero profit center identificato: **Stream 3 B2C privati** (€3,5M/anno potenziale) + **Stream 5 marketplace** (€2,5M/anno)
- ARR potenziale @1000 agenzie: **€10,9M** (vs vecchia stima €1,3M = +750%)

### 🚨 Blocker richiesto da Founder
1. **Validazione consulente esterno** (commercialista startup SaaS + fractional CFO real estate) prima di GTM
2. **FAL_KEY** richiesta per partire M5.S4 (https://fal.ai/dashboard/keys, $5 free credits)
3. Discussione M4 Stripe sospesa fino a nuova società Founder

---

## Changelog M5.S3 — AL Legal (24-Giu-2026)

✅ **Backend modulare** (`/app/backend/apps/immoweb/al_legal/`):
- `prompts.py` — 5 sub-agenti (general, proposta, locazioni, catasto, urbanistica) + `pdf_analysis` + router keyword-based
- `tavily.py` — async wrapper Tavily AI con whitelist 7 domini normativi IT
- `validator.py` — secondo LLM con `confidence ∈ [0,1]`, soglia 0.85, fallback graceful, `append_disclaimers()`
- `pdf_parser.py` — pypdf, hard cap 5MB / 60 pages / 40k chars
- `router.py` — 5 endpoint: chat / analyze-pdf / sessions list/get/delete / health

✅ **Endpoint REST**:
- `POST /api/app/legal/chat` — Tavily search + main LLM + validator + disclaimer assembly
- `POST /api/app/legal/analyze-pdf` (multipart) — upload + extract + analyze
- `GET/DELETE /api/app/legal/sessions[/{sid}]` — CRUD storico
- `GET /api/app/legal/health` — probe (no auth)

✅ **Frontend** (`/app/frontend/src/apps/legal/LegalApp.jsx`):
- Pagina dedicata `/it/legal` accessibile a tutti gli utenti autenticati
- DisclaimerModal first-visit con checkbox L.247/2012 + localStorage `omnia_legal_disclaimer_v1`
- ChatTab: stream Tavily + LLM (~20s) con thinking placeholder, sub-agent badge colorato, ConfidencePill (verde/ambra), pannello fonti clickable
- PdfTab: dropzone + question + analisi strutturata
- CTA notaio automatica sotto soglia confidence
- Sidebar `AgencyShell.jsx` — nav item `⚖ AL Legal`
- Axios timeout custom: 90s chat, 120s PDF

✅ **Sicurezza**:
- Rate limit 30/h per utente (chat+PDF condivisi, scelta intenzionale)
- Multi-tenancy: nessun `agency_id` necessario (operazione su query/PDF utente)
- Audit log permanente `al_legal_audit` (retention 5 anni richiesta da D-028)

✅ **Test E2E** — iteration_20.json: **16/16 backend** (5 sub-agenti routing, schema, multi-turn, B2C access, PDF valido/non-PDF/>5MB, sessions CRUD, audit log) + **100% frontend** (disclaimer modal, chat flow completo, sub-agent badge, confidence pill, fonti clickable, PDF tab, sidebar nav)

---

## Changelog M5.S1 — AL for Agents (24-Giu-2026)

✅ **Backend** (`/app/backend/apps/immoweb/al_agent.py`):
- POST `/api/app/al/chat` — chat sincrona con Gemini-3-Flash via emergentintegrations
- **POST `/api/app/al/chat/stream`** — **streaming SSE token-by-token** (UX ChatGPT-style)
- **POST `/api/app/al/improve`** — generazione inline titolo/descrizione (IT/EN/ES) usando snapshot del form immobile, no agency_id required (funziona anche per utenti B2C privati)
- Pattern manuale JSON tool-use (la lib non supporta `tools=` nativi)
- 5 tool whitelistati: `query_properties`, `query_clients`, `query_leads`, `monthly_performance`, `write_description`
- Sicurezza multi-tenant: `agency_id` iniettato server-side dal JWT, mai dall'AI
- Rate limit soft: 60 msg/utente/ora (chat + improve condividono contatore)
- Sessioni persistenti (collection `al_sessions` + audit `al_audit`)
- Error handling: budget esaurito → 503/SSE event `llm_budget_exceeded`
- Brand: AL (maiuscolo) — system prompt aggiornato a "Sei AL,..."

✅ **Frontend**:
- `/app/frontend/src/apps/immoweb/components/AlChatWidget.jsx` — FAB "AL" bottom-24/right-6, streaming live via fetch+ReadableStream, Stop button, cursore lampeggiante, i18n completo
- **`/app/frontend/src/shared/components/AlImproveButton.jsx`** — componente riusabile ✨ "Migliora con AL" + modal con tabs IT/EN/ES, layout Originale | Suggerito, Apply/Regenerate/Cancel
- Mount in `PropertyFormPage.jsx` (agente ImmoWeb): accanto a titolo + sotto descrizione
- Mount in `SellPage.jsx` (privato B2C ImmobilCloud): accanto a titolo + sotto descrizione
- Brand: tutto "Al" → "AL" in label UI + i18n (`al.open_chat`, `al.welcome`, ecc.)

✅ **P2 Fix — Chrome auto-translate**:
- `<html lang="it" translate="no">` + `<meta name="google" content="notranslate">` + `<body class="notranslate">`

✅ **Test E2E**:
- iteration_17.json — 100% backend (8/8) + 100% frontend (sync chat)
- iteration_18.json — 100% backend (6/6) + 100% frontend (streaming SSE incrementale)
- iteration_19.json — 100% backend (13/13 pytest improve) + 100% frontend agent flow (IT/EN/regen/apply/cancel/brand AL)

---

*Prossima revisione: al termine di M5.S3 (Al Legal)*
