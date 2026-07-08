# 📋 DECISIONS LOG — OMNIA

Registro di tutte le decisioni di business e tecniche prese durante il progetto.
**Una decisione qui = non si rimette in discussione senza buon motivo.**

---

## Decisioni prese

### D-001 — Architettura ecosistema a 3 pilastri
- **Data**: Gennaio 2026
- **Contesto**: Definizione visione iniziale
- **Decisione**: OMNIA è un ecosistema composto da 3 app: ImmobilCloud (B2C portale), ImmoWeb (B2B CRM agenzie), Omnia Academy (formazione)
- **Razionale**: Schema PDF "progetto Omnia" del Founder
- **Stato**: ✅ Confermata

### D-002 — Stack tecnologico base
- **Data**: Gennaio 2026
- **Decisione**: React (frontend) + FastAPI (backend) + MongoDB (DB) + Emergent Platform (hosting)
- **Razionale**: Coerenza con repo esistenti IMMOWEB e Immocloud-2.0, stack già rodato
- **Stato**: ✅ Confermata

### D-003 — Modello business
- **Data**: Gennaio 2026
- **Decisione**: SaaS multi-tenant con 3 piani agenzia (Founder €29, Pro €49, Agency €149) + sistema crediti pay-as-you-go + free tier B2C
- **Razionale**: Standard SaaS, già impostato in PRD esistenti, Stripe già integrato
- **Stato**: ✅ Confermata (prezzi da rifinire in M4.S3)

### D-004 — Programma operativo 6 milestone
- **Data**: Gennaio 2026
- **Decisione**: Accettato programma di 29 sessioni / 12-18 settimane, da M1 (Foundation) a M6 (Academy)
- **Razionale**: Risposta Founder "SI-SI-SI" su tempo, budget, agenzie pilota
- **Stato**: ✅ Confermata

### D-005 — Posizione documenti strategici
- **Data**: Gennaio 2026
- **Decisione**: Tutti i documenti strategici vivono in `/app/memory/` nel workspace attivo, non nei repo IMMOWEB o Immocloud-2.0 esistenti
- **Razionale**: I 2 repo esistenti sono boilerplate quasi vuoti; la nuova architettura monorepo (o decisione contraria in M1.S1) determinerà destinazione finale GitHub
- **Stato**: ✅ Confermata

### D-006 — Repository GitHub principale
- **Data**: 10 Giugno 2026
- **Decisione**: Nuovo repo pubblico `mcnicastro-netizen/OMNIA` come repository ufficiale del progetto
- **Razionale**: I repo IMMOWEB e Immocloud-2.0 sono boilerplate quasi vuoti e creavano confusione; il nuovo repo OMNIA è neutro e accoglierà il futuro monorepo
- **Stato**: ✅ Confermata e operativa

### D-007 — Dominio principale
- **Data**: Giugno 2026
- **Decisione**: `omniarealestateecosystem.it` come dominio principale
- **Razionale**: Domini brevi (omnia.realestate, omnia.casa) richiesti dai broker a €4.000+. Il nome lungo è disponibile a costo standard (~€10/anno) ed è descrittivo. Eventuale dominio corto rinviato a post-M4 quando ci sarà budget marketing.
- **Trade-off accettato**: URL lungo, ma SEO ottimo. Per uso commerciale si valuteranno alias brevi in futuro.
- **Stato**: ✅ Confermata

### D-008 — Credito Emergent LLM Key
- **Data**: Giugno 2026
- **Decisione**: Ricaricati 100 crediti sulla Universal Key
- **Razionale**: Budget sufficiente per M1-M2 (Gemini economico). Da monitorare ad ogni milestone.
- **Stato**: ✅ Confermata

### D-009 — Email transazionale: Resend
- **Data**: Giugno 2026
- **Decisione**: Resend.com come provider email (anziché SendGrid)
- **API Key**: `omnia-prod` (salvata lato user, da configurare in M1.S3)
- **Razionale**: Free tier 3.000 email/mese, API moderna, setup 3 minuti
- **Stato**: ✅ Confermata, chiave creata

### D-010 — Stripe: registrazione in attesa
- **Data**: Giugno 2026
- **Decisione**: Account Stripe registrato ma configurazione completa (IBAN, dati fiscali, attivazione live) rinviata a M4.S3
- **Razionale**: Non serve fino a M4 (sistema pagamenti); l'utente preferisce completare quando necessario con supporto guidato
- **Stato**: 🟡 Registrato, da completare in M4.S3

### D-011 — Architettura repository: MONOREPO ✅
- **Data**: 10 Giugno 2026 (M1.S1)
- **Decisione**: Monorepo Turborepo unico nel repo `OMNIA` con struttura:
  - `apps/immocloud/` — Portale B2C
  - `apps/immoweb/` — Gestionale agenzie B2B
  - `apps/academy/` — Piattaforma formazione
  - `apps/api/` — Backend FastAPI condiviso (single backend serve tutte le app)
  - `packages/shared/` — Modelli Pydantic + types + utils condivisi
  - `packages/ui/` — Component library shadcn condivisa
- **Razionale**: Elimina drift cross-app già vissuto in IMMOWEB vs Immocloud-2.0; semplifica sviluppo singolo developer; pattern standard 2026 SaaS multi-app
- **Tradeoff accettato**: Setup iniziale +1-2 ore in M1.S2
- **Stato**: ✅ Confermata

### D-012 — Schema sottodomini: SOTTODOMINI CORTI ✅
- **Data**: 10 Giugno 2026 (M1.S1)
- **Decisione**: Schema URL con sottodomini corti su `omniarealestateecosystem.it`:
  - `omniarealestateecosystem.it` → Landing page commerciale
  - `cloud.omniarealestateecosystem.it` → ImmobilCloud (B2C)
  - `app.omniarealestateecosystem.it` → ImmoWeb (B2B agenzie)
  - `learn.omniarealestateecosystem.it` → Omnia Academy
  - `api.omniarealestateecosystem.it` → Backend API condiviso
  - `{agency-slug}.omniarealestateecosystem.it` → White label agenzie (M2.S6)
- **Razionale**: SEO ottimale; standard SaaS multi-tenant per branding agenzie; isolamento auth/cookie tra app
- **Requisito tecnico**: Certificato SSL wildcard `*.omniarealestateecosystem.it`
- **Stato**: ✅ Confermata

### D-013 — Database architecture: SHARED SCHEMA multi-tenant ✅
- **Data**: 10 Giugno 2026 (M1.S1)
- **Decisione**: Singolo MongoDB cluster con shared schema multi-tenant
- **Pattern**:
  - Ogni collection (eccetto dati pubblici condivisi) ha campo OBBLIGATORIO `agency_id` (UUID)
  - Indice composto `(agency_id, ...campo_query)` su ogni collection tenant-aware
  - Middleware FastAPI auto-inietta `agency_id` da JWT su ogni query
  - Test automatici verificano isolamento tenant
- **Eccezioni** (no agency_id):
  - `omi_zones` (27.228 zone OMI, pubblico)
  - `comuni_italia` (7.884 comuni)
  - `users` (cross-agency, con `agency_ids: List[UUID]`)
  - `mls_network` (relazioni inter-agenzia)
- **Razionale**: Standard SaaS B2B 2026; costo basso; performance ottima fino a 1000+ tenant; MLS facile
- **Trigger migrazione DB-per-tenant**: cliente enterprise >1000 immobili o compliance specifica
- **Stato**: ✅ Confermata

### D-014 — Internazionalizzazione (i18n) NATIVA ✅
- **Data**: 10 Giugno 2026 (M1.S2)
- **Decisione**: i18n nativa integrata dall'inizio per supportare export internazionale
- **Lingue di partenza**: IT (default) + EN + ES
- **Lingue future**: DE, FR (espansione UE)
- **Stack tecnico**:
  - Frontend: `react-i18next` + `i18next-browser-languagedetector`
  - Backend: header `Accept-Language` per messaggi errore, JSON locales per email/PDF
- **Pattern URL**: Sottodirectory `/it/`, `/en/`, `/es/` (best practice SEO Google 2026)
- **Lingua default nuovi utenti**: Detection automatica via browser language, fallback IT
- **Schema DB**: Campi traducibili come dict `{lang_code: str}` (es. `title.it`, `title.en`)
- **Traduzione contenuti dinamici (annunci)**: Auto-traduzione via Gemini AI al salvataggio (con conferma agente) — implementata in M5.S1
- **SEO multilingua**: `<link rel="alternate" hreflang>` automatico per ogni pagina
- **Email/PDF/Documenti**: Template separati per lingua (`welcome.it.html`, `welcome.en.html`, `welcome.es.html`)
- **Razionale**: Aggiungere i18n dopo costerebbe 3-4 settimane di refactor; ora costa +30% setup ma zero costo futuro
- **Stato**: ✅ Confermata

### D-015 — Implementazione monorepo: LOGICAL MONOREPO (non Turborepo puro) ✅
- **Data**: 10 Giugno 2026 (M1.S2)
- **Decisione**: Implementazione monorepo come "Logical Monorepo" nei vincoli Emergent
- **Struttura**:
  - 1 backend FastAPI multi-app servito da `/app/backend/` con sottostruttura `apps/` + `shared/`
  - 1 frontend React multi-app servito da `/app/frontend/` con sottostruttura `apps/` + `shared/`
  - Routing per-app via sub-path (`/cloud/`, `/app/`, `/learn/`); in produzione Cloudflare/Nginx riscrive sottodomini → sub-path
- **Razionale**:
  - Turborepo puro richiede 4 processi separati incompatibili con supervisor Emergent
  - Logical Monorepo mantiene tutti i benefici (codice condiviso, modularità) senza il costo infrastrutturale
  - Stessa esperienza utente finale (sottodomini in produzione via reverse proxy)
- **Migrazione futura a Turborepo puro**: 1-2 giorni di lavoro pre-exit (anno 2-3, con revenue significativa)
- **Stato**: ✅ Confermata, è la materializzazione di D-011

### D-016 — Strategia migrazione "Sostituisci un pezzo alla volta" ✅
- **Data**: 12 Giugno 2026 (M2.S2bis review)
- **Contesto**: Il Founder paga €786/anno per il gestionale legacy (Agestanet) e il sito agenzia. Va capito come migrare le agenzie esistenti senza rischio.
- **Decisione**: Migrazione a 3 fasi non distruttive:
  - **Fase 1 — Parallel run** (1-2 mesi): OMNIA gira accanto al gestionale esistente, zero rischio. L'agente sperimenta in tranquillità.
  - **Fase 2 — Sostituzione gestionale**: quando OMNIA è validata, l'agenzia disdice Agestanet/simili. OMNIA prende il ruolo di CRM + publishing.
  - **Fase 3 (opzionale) — Sostituzione sito**: OMNIA genera anche il sito tramite template (vedi D-018).
- **Pricing target**: €19-29/mese piccole, €79-129/mese grandi (da rifinire in M4.S3)
- **Razionale**: Eliminare la friction del cambio: l'agente non perde nulla, prova, decide. Migration risk → 0.
- **Stato**: ✅ Confermata

### D-017 — Caso A: "Agenzia ha già il proprio sito" ✅
- **Data**: 12 Giugno 2026 (M2.S2bis review)
- **Decisione**: Se l'agenzia ha già un sito (caso A in Settings → "Sito web agenzia"), OMNIA fornisce un **feed XML compatibile** in uscita (M2.S5) che alimenta il sito esistente come fa oggi Agestanet.
- **Estensioni future** (post-M2): plugin WordPress dedicato + embed-code JavaScript per inserire il portafoglio in qualunque sito.
- **🔒 Idea segreta vincente del Founder**: il Founder ha un'idea aggiuntiva sul tema M2.S5 che condividerà a tempo debito. **L'agente DEVE chiedergliela quando si arriva all'implementazione di M2.S5**, prima di scrivere codice.
- **Razionale**: Massima compatibilità + sostituzione 1:1 di Agestanet senza forzare cambio di sito.
- **Stato**: ✅ Confermata, UI esposta in Settings dal 16 Giugno 2026 (D-020)

### D-018 — Caso B: "Voglio un sito creato da OMNIA" ✅
- **Data**: 12 Giugno 2026 (M2.S2bis review)
- **Decisione**: Se l'agenzia non ha un sito (o lo vuole rifare), OMNIA pubblica il sito generato dal template **sul dominio dell'agenzia** (es. `nicastroimmobiliare.it`), NON su un sottodominio OMNIA.
- **Modello operativo**:
  - L'agenzia possiede e rinnova il dominio in autonomia (come già fa con provider tipo Basic Soft)
  - OMNIA ospita il sito generato dal template
  - L'agenzia punta i DNS al nostro endpoint (CNAME / A record documentato)
- **Razionale**: Brand ownership al cliente (asset suo) → riduce churn percepito. Niente lock-in opaco su sottodomini white-label.
- **Differenza vs D-012**: i sottodomini `{agency-slug}.omniarealestateecosystem.it` restano disponibili come fallback / staging, ma il modello primario è custom domain.
- **Stato**: ✅ Confermata, materializzazione in M2.S6

### D-019 — Template strategy: "I migliori del mercato" ✅
- **Data**: 12 Giugno 2026 (M2.S2bis review)
- **Decisione**: I template per i siti agenzie (D-018) sono progettati **internamente** con `design_agent_full_stack`, non delegati a marketplace generici.
- **Quantità**: 5-10 template di altissima qualità, non un catalogo gonfio
- **Quality bar**: "i migliori del mercato real estate" — ammesso clonare/ispirarsi a siti esistenti specifici (anche di competitor o agenzie premium) per raggiungere il livello richiesto
- **Quando**: M2.S6 (preferito) oppure M3 (se serve più contesto sul portale B2C prima)
- **Razionale**: Il sito agenzia è il principale punto di contatto del cliente finale → la qualità visiva è una leva di conversione e di pricing power. Template generici farebbero perdere credibilità.
- **Stato**: ✅ Confermata, implementazione M2.S6

### D-020 — Settings UI: rimossi color picker e logo URL ✅
- **Data**: 16 Giugno 2026 (M2.S3 session)
- **Contesto**: Il Founder ha trovato confusi i campi "URL logo" + "Colore primario/d'accento" in Settings (target agenti non tecnici).
- **Decisione**: SettingsPage.jsx semplificata:
  - **Rimossi**: campo URL logo, color picker primario, color picker d'accento
  - **Mantenuti**: identità (nome commerciale, tagline), dati fiscali, indirizzo, contatti pubblici
  - **Aggiunti**: sezione "Sito web agenzia" con 2 card mutuamente esclusive (D-017 / D-018):
    - Opzione A "Ho già il mio sito" → URL + descrizione feed XML M2.S5
    - Opzione B "Voglio un sito creato da OMNIA" → galleria template placeholder M2.S6
- **Backend**: nuovo blocco `AgencyWebsite` (mode/external_url/template_id/custom_domain) su `AgencyInDB`
- **Razionale**: I non-grafici non devono prendere decisioni di branding visuale dentro al CRM. Il branding visuale arriva nei template (M2.S6) o non arriva affatto (caso A).
- **Stato**: ✅ Confermata e LIVE

### D-021 — CRM Clienti: preferenze ricerca rispecchiano filtri idealista ✅
- **Data**: 16 Giugno 2026 (M2.S3 session)
- **Contesto**: Per il Matching Engine M2.S4 servono preferenze ricerca cliente compatibili con i filtri usati realmente dai privati.
- **Decisione**: Il modello `SearchPreferences` replica i filtri idealista.it visti dal cliente finale:
  - operation, property_types[], cities[], zones[], price_min/max, surface_min/max, rooms_min/max, bedrooms_min, bathrooms_min, conditions[] (nuovo/buone/ristrutturato/da_ristrutturare), floor_preferences[] (terra/intermedi/ultimo), must_have_features[] (subset di PropertyFeatures), energy_min_class, needs_photos, needs_virtual_tour, notes
- **Razionale**: Le preferenze cliente devono essere già "matchabili" 1:1 con i criteri di ricerca del portale B2C M3 → il match engine M2.S4 sarà uno scoring diretto, senza traduzioni di campo.
- **Implicazione futura M2.S4**: lo score di match diventa visibile (es. "92% match — manca solo l'ascensore") sia nella scheda cliente che nella lista immobili.
- **Stato**: ✅ Confermata, implementata 16/06/2026

### D-022 — Architecture: HEADLESS OMNIA per 1000+ siti white-label ✅
- **Data**: 16 Giugno 2026 (post analisi competitiva)
- **Contesto**: Il Founder ha corretto la mia visione: non 50 siti agenzia (modello "tema") ma **1000+ siti** completamente unici. L'unica cosa comune è il backend OMNIA + le app integrate.
- **Decisione**: Architettura **Headless OMNIA**:
  - OMNIA Backend = unica source of truth (proprietà, leads, AI, pagamenti, MLS) esposto via API REST + GraphQL
  - Ogni agenzia ha il **suo bundle frontend** indipendente (Next.js static-rendered) deployato su infrastruttura OMNIA condivisa (CDN edge)
  - Il bundle può venire da: clone-from-URL (D-023), template gallery (D-019), oppure custom dev (premium service)
  - Routing: dominio agenzia → CNAME → infra OMNIA → bundle agenzia → API OMNIA
  - Theme registry per-agenzia che memorizza il bundle versioned in storage
- **Razionale**: A scala 1000+ siti, ogni tentativo di "tema unificato" diventa anti-pattern. La via giusta è isolamento totale per sito + backend condiviso. Pattern già validato da Shopify (themes), Webflow CMS, Vercel multi-tenant.
- **Implicazione tecnica**: server Node.js / edge runtime per CDN; storage S3 per bundles; CI per build automatico bundle al deploy theme.
- **Stato**: ✅ Confermata. Supersedes D-018 limitato (rimane valido il principio "dominio agenzia, non sottodominio OMNIA").

### D-023 — Migrazione "Clone-from-URL" (idea originale del Founder) ✅
- **Data**: 16 Giugno 2026 (rivelata dal Founder + validata)
- **Contesto**: Il Founder ha portato l'idea di permettere alle agenzie di fornire l'URL del loro sito attuale → OMNIA lo ricrea identico. Inizialmente avevo proposto una versione attenuata ("clone visivo + template OMNIA"), ma con D-022 (architettura headless) il clone pixel-perfect diventa fattibile e mantenibile a scala 1000+.
- **Decisione**: Implementare clone identico end-to-end:
  - Step 1: agenzia inserisce URL del proprio sito esistente
  - Step 2: Playwright headless crawla pagine chiave (home, lista immobili, scheda immobile, contatti) → screenshot + HTML/CSS estratti
  - Step 3: Gemini Vision (via Emergent LLM Key) analizza screenshot + estrae: palette, tipografia, struttura header/footer, stile card immobile, micro-componenti
  - Step 4: generazione bundle Next.js statico con look identico, ma alimentato dalle API OMNIA (proprietà, contatti, valutazione, ecc.)
  - Step 5: preview al cliente entro 60 secondi → "Ecco il tuo sito ricostruito"
  - Step 6: deploy automatico su dominio agenzia (CNAME)
- **Tiers di servizio**:
  - **Free**: clone automatico via AI (best-effort)
  - **Premium**: revisione designer in 2-3 giorni per pixel perfection (€XX una tantum)
- **Razionale**: Migration friction → ZERO. Demo killer in fase commerciale ("Inserisci URL → 60 sec → ecco il tuo sito dentro OMNIA"). Eradica completamente la resistenza al cambio gestionale.
- **Quando**: M2.S5 (anticipa la fase di multiposting con questa feature distintiva).
- **Stato**: ✅ Confermata.

### D-024 — Pricing aggressivo fase lancio + listino trasparente ✅
- **Data**: 16 Giugno 2026 (post analisi competitiva)
- **Contesto**: Idealista sta aumentando i prezzi del Founder da €149 a ~€200/anno e ha già tolto 2 annunci premium gratuiti su 15. Mercato è frustrato. Lo stack tradizionale agenzia media costa **€10.000-12.000/anno** (Immobiliare.it + Idealista + Getrix/Gestim). Tutti i competitor hanno pricing **opaco** ("Contattaci").
- **Decisione**:
  - **Listino PUBBLICO in homepage OMNIA** (anti-Idealista/Immobiliare)
  - **Fase lancio** (primi 12 mesi):
    - Starter (1 agente, 20 immobili): **GRATIS** primi 3 mesi, poi €19/mese
    - Pro (3 agenti, 100 immobili): **€29/mese**
    - Agency (illimitato + MLS + AI): **€79/mese**
    - Enterprise (network/franchising): da €299/mese
  - **Fase post-traction** (dopo 100 agenzie paganti):
    - Starter €19, Pro €49, Agency €149, Enterprise €299-499
  - **Zero setup fee. Zero formazione a pagamento. Zero vincoli contrattuali (mese per mese). Migrazione dati gratuita**.
- **Razionale**: Aggressivo abbastanza per spostare il mercato, sostenibile abbastanza per non bruciare cassa (con Emergent LLM Key + infra Emergent il costo per agenzia è < €5/mese all'inizio).
- **Messaging killer**: *"Risparmia il 95%. Da €12.000/anno a €348/anno per la maggior parte delle agenzie."*
- **Stato**: ✅ Confermata. Supersedes D-003 (vecchio pricing €29/€49/€149 ancora valido ma diventa "target post-traction").

### D-025 — M2.S4: Matching Engine include Lead Scoring AI ✅
- **Data**: 16 Giugno 2026 (post analisi competitiva)
- **Contesto**: La lamentela #1 degli agenti nel mercato italiano è **"lead poco qualificati"** (cliccano e spariscono). Idealista/Immobiliare.it riempiono di lead, ma nessuno aiuta a capire QUALI sono caldi.
- **Decisione**: Il Matching Engine M2.S4 esce DOPPIO:
  1. **Property↔Client match score** (es. 92% match — algoritmo punteggio su preferenze)
  2. **Lead Score AI** (0-100, classifica freddo/tiepido/caldo/rovente) basato su:
     - Engagement (visite scheda, contatti diretti, ritorni)
     - Coerenza budget vs immobile (verifica realistica)
     - Storico interazioni con l'agenzia
     - Velocità risposta alle proposte
     - Completezza profilo (telefono verificato, etc.)
  3. Score visibili sia in scheda cliente che in scheda immobile e in lista
- **Stack AI**: Gemini-3 Flash via Emergent LLM Key per scoring (economico, fast)
- **Razionale**: Risolve direttamente la frustrazione #1 del mercato. Diventa l'argomento commerciale principale: *"Smetti di rincorrere lead morti. OMNIA ti dice chi vale la pena chiamare oggi"*.
- **Stato**: ✅ Confermata. Da implementare in M2.S4.

### D-026 — Property.seller_client_id: link bidirezionale Property↔Client venditore ✅
- **Data**: 16 Giugno 2026
- **Contesto**: Il Founder ha individuato un gap critico: oggi `Property` non sa chi è il proprietario/venditore. Senza questo collegamento il CRM è zoppo.
- **Decisione**: Aggiungere `Property.seller_client_id: Optional[str]` (FK al modello Client). UI:
  - In form immobile: dropdown "Proprietario / Venditore" (autocomplete da clienti con `client_type ∈ {seller, landlord}`)
  - In scheda cliente seller: tab "Immobili in carico" che lista i suoi immobili
  - In scheda immobile: pannello "Contatti proprietario" con link al Client
- **Quando**: M2.S3.5 (mini-sprint, mezza giornata) **PRIMA** di M2.S4
- **Razionale**: Il Matching Engine M2.S4 ha senso solo se Property ha un proprietario tracciato. È prerequisito.
- **Stato**: ✅ Confermata. NEXT TASK.

---

## Decisioni rinviate (da risolvere più avanti)

### D-FUTURE-01 — Tabella prezzi crediti
- **Quando**: M4.S4
- **Note**: Definire quanti crediti per visura, valutazione, Top visibility, SMS, ecc.

### D-FUTURE-02 — Regole MLS inter-agenzia
- **Quando**: M4.S1
- **Note**: Split commissioni, durata esclusiva, escalation conflitti

### D-FUTURE-03 — Accreditamento FIAIP/FIMAA Academy
- **Quando**: M6.S5
- **Note**: Contattare ordini professionali, capire requisiti

### D-FUTURE-04 — Smart Clients List ✅ DONE (18 Giu 2026)
- **Idea del Founder** (17 Giu 2026)
- **Cosa**: trasformare la lista clienti da "rubrica" a *cruscotto azione*:
  - Ordinamento default per **lead score** (più caldo in alto)
  - Micro-indicatori inline: "🔥 3 match attivi", "⚠️ inattivo da 14 giorni"
  - Filtro rapido bucket pills
  - Quick action su row: 📞 chiama / 💬 WhatsApp deep-link con messaggio AI-precompilato
- **Variante scelta**: editorial-sober (option C) — palette stone-only, temperature solo testo, no colori vivi.
- **Implementato**:
  - Backend `apps/immoweb/clients_smart.py`: `GET /smart` enriched + bucket filters + `POST /smart/refresh` batch AI parallel.
  - Frontend `ClientsPage.jsx` riscritto con ScoreBox Fraunces serif, TempPill monocroma, MatchesPill, inline 📞/💬 buttons.
- **Test**: 10/10 pytest passed (`test_clients_smart.py`)
- **Stato**: ✅ DONE

### D-FUTURE-05 — Marketing Showcase Screenshot (post-traction) ⏳
- **Idea del Founder** (17 Giu 2026, post M2.S4)
- **Cosa**: usare il Lead Score AI live come asse principale di posizionamento commerciale OMNIA.
  - Messaging: *"L'unico CRM italiano che ti dice quale lead chiamare PRIMA, non DOPO"*
  - Preparare uno screenshot showcase in layout marketing (mobile + desktop) della MatchLeadScorePage, da usare in pitch/demo con agenzie e nella landing page commerciale
- **Quando**: post-M2.S5 o quando partiamo con la fase di acquisition (M4)
- **Stato**: in memoria, da fare dopo

### D-027 — Modello commerciale a 3 tier: Base / Pro / Enterprise ✅
- **Data**: 18 Giugno 2026 (post analisi Agestanet)
- **Decisione**: nomi commerciali OMNIA = **Base · Pro · Enterprise** (sostituisce le precedenti Starter/Pro/Agency/Enterprise).
  - **Base**: portale pubblicitario OMNIA + clone-from-URL del sito + multiposting top portali + tools privati base
  - **Pro**: Base + CRM completo + Matching + Lead Scoring AI + crediti AI + MLS OMNIA
  - **Enterprise**: Pro + multi-sede + subagenzie + Academy + analytics avanzate + dedicated success manager
- **Prezzi**: il Founder li deciderà a prodotto ultimato. D-024 resta come "riferimento massimo" non vincolante.
- **Razionale**: 3 tier sono più memorizzabili, e non confondono con "Listing" che è in realtà incluso in Base.
- **Stato**: ✅ confermata

### D-028 — XML Feed schema: OMNIA Standard Feed (OSF), schema proprio non Agestanet-clone ✅
- **Data**: 18 Giugno 2026
- **Decisione**: NON copiare lo schema Agestanet 1:1. Creiamo **OMNIA Standard Feed (OSF)** con DNA distintivo:
  - **Dual format**: XML (compat portali legacy) + JSON (compat portali moderni / API)
  - **Schema pulito**: stringhe leggibili invece di codici numerici (es. `<property_type>appartamento</property_type>` non `<cod_tipologia>3</cod_tipologia>`)
  - **AI-extended namespace** (opzionale): `<omnia:lead_score>`, `<omnia:ai_description>`, `<omnia:virtual_tour_url>`, `<omnia:match_count>` — questi tag valorizzano l'integrazione OMNIA presso i portali che li supportano
  - **Versionato**: `<feed version="1.0">` con backward-compat su future versioni
  - **JSON Schema pubblico**: pubblichiamo `omniarealestateecosystem.it/schema/osf-v1.json` → diventa standard adottabile da chiunque (mossa di "OMNIA = standard di settore")
  - **3 lingue native**: IT/EN/ES (estensibile su richiesta a DE/FR/RU/PT)
- **Endpoint pubblici per-agenzia**:
  - XML: `https://feed.omniarealestateecosystem.it/{agency-slug}.xml`
  - JSON: `https://feed.omniarealestateecosystem.it/{agency-slug}.json`
- **Razionale del Founder**: *"creiamo una nostra skill, quella che ti viene più semplice ma ci renda unici"*. OSF è la nostra "USP tecnica" — i portali che vogliono integrarsi con OMNIA-powered agencies hanno una sola spec pulita da implementare. Lo schema pulito è ANCHE più veloce da implementare di un clone Agestanet (che ha 100+ campi disordinati).
- **Stato**: ✅ confermata

### D-029 — Portali da supportare in fase 1 (Layer A) ✅
- **Data**: 18 Giugno 2026
- **Decisione**: M2.S5 Layer A parte con **7 portali catalogati**, architettura predisposta per espansione fino a 92 (Agestanet parity):
  1. **Idealista** (pull XML da URL)
  2. **Immobiliare.it** (modello "Pro" + ImmobiliarePro/Getrix, pull XML)
  3. **Casa.it** (pull XML)
  4. **Wikicasa** (pull XML)
  5. **Subito.it** (push XML/API)
  6. **Facebook Catalog** (push via Marketing API)
  7. **LinkedIn** ← *aggiunto dal Founder* (Showcase Pages / posts automatici tramite LinkedIn Marketing API)
- **Modello**: ogni portale è un "PortalAdapter" registrato a backend. Aggiungere il 92esimo = creare nuovo adapter, no schema migration.
- **MLS Bridge Agestanet**: ❌ NON facciamo bridge. OMNIA avrà **il proprio MLS** in M4 (D-001).
- **Stato**: ✅ confermata

### D-FUTURE-06 — Demo Flow Guidato pubblico (/it/demo) ⏳
- **Idea agent + Founder** (18 Giu 2026, post M2.S5 Layer A)
- **Cosa**: pagina pubblica `/it/demo` (senza login) che simula in 60 secondi l'esperienza killer OMNIA con dati fittizi:
  1. Step 1 — "Inserisci un immobile" (form compatto, 5 campi: titolo, città, prezzo, mq, tipologia)
  2. Step 2 — "Lo pubblico su 7 portali" (animazione live: Idealista ✓, Immobiliare.it ✓, Casa.it ✓, …)
  3. Step 3 — "Ti mostro chi è il lead più caldo nei tuoi clienti CRM" (3-5 lead fittizi pre-popolati, Lead Score AI calcolato live via Gemini)
  4. Step 4 — Call-to-action: "Vuoi tutto questo per la tua agenzia? Inizia con OMNIA" → registrazione
- **Razionale**: strumento principale per chiudere abbonamenti con poco sforzo commerciale. Trasforma il sito da brochure a esperienza interattiva. Conversion rate atteso 5-15× rispetto a una landing tradizionale.
- **Quando**: post-M2.S5 completo (Layer B/C/D) o anche prima se serve materiale commerciale. Idealmente prima del lancio commerciale M4.
- **Stack**: usa Lead Scoring AI già live (M2.S4) con session anonima + dati seed pre-caricati in memoria (no scrittura DB).
- **Stato**: in memoria, da fare quando arriva il momento commerciale. **NOTA Founder (18 Giu)**: "no pitch parziale" — rinviato a dopo il completamento di tutta la Milestone 2 + AI Smart Import.

### D-FUTURE-07 — AI Smart Import Clienti ✅ DONE (19 Giu 2026)
- **Osservazione del Founder** (18 Giu 2026): «Una agenzia con oltre 100 clienti, quanto tempo impiegherebbe a compilare il template? Non si può utilizzare un sistema simile a quello pensato per foto e descrizioni del portafoglio immobili?»
- **Problema**: il CSV template ha 18 colonne, compilare 100 clienti manualmente richiede 5-13 ore. Nessun agente lo farà → la Smart Clients List (M2.S4 + D-FUTURE-04) resta vuota → tutto il lavoro AI Lead Scoring vale zero per mancanza di dati.
- **Cosa**: applicato il **pattern del Brand Extractor** (input non strutturato + Gemini → schema OMNIA) alla migrazione clienti.
- **Implementato (v1 — formati testuali)**:
  - 4 endpoint sotto `/api/app/clients/import/ai`: upload+parse / get draft / patch row / commit
  - Pre-parser per `.csv` `.xlsx` `.vcf` `.txt` con format auto-detection
  - Gemini-3-flash con system prompt strutturato + esempi d'interpretazione domain-specific (italiano immobiliare)
  - Defensive normalization layer + confidence score per riga + warnings
  - Draft TTL 1h via Mongo TTL index
  - Frontend dual-tab UI (AI default + Template CSV legacy)
- **Test**: 12/12 pytest backend + frontend full flow validato. Caricato CSV reale messy → 4/5 clienti estratti correttamente, mappati buyer/seller/investor, "trilocale"→rooms_min:3, "Roma EUR"→city+zone.
- **v2 prevista in D-FUTURE-09**: PDF + screenshot Vision (opzione c scelta dall'utente per future memory).
- **Stato**: ✅ DONE

### D-FUTURE-09 — AI Smart Import v2: PDF + Screenshot tramite Gemini Vision ⏳ (18 Giu 2026)
- **Origine**: opzione (c) della scelta scope D-FUTURE-07 — Founder ha scelto (a) per la prima sessione e ha chiesto di memorizzare (c) come decisione futura.
- **Cosa**: estendere il pipeline AI Smart Import oltre formati testuali (CSV/Excel/vCard/TXT) per accettare:
  - **PDF**: estrazione testo via `pdfminer.six` per tabelle Excel esportate come PDF (caso comune)
  - **Screenshot/foto tabelle**: Gemini Vision (multimodal) su immagini di liste clienti (foto fatte al monitor del vecchio gestionale, screenshot di Excel inviati via WhatsApp dal collega, ecc.)
- **Razionale**: completa il pattern "qualsiasi file → clienti OMNIA" coprendo i casi davvero disordinati che (a) non gestisce. È il **vero killer** per l'agente che migra senza accesso ai file sorgente del vecchio CRM.
- **Costo Gemini**: leggermente più alto (input tokens per PDF lungo, image tokens per screenshot) ma sempre <€0.20 per file. Trascurabile.
- **Quando**: dopo la validazione di D-FUTURE-07 v1 (formati testuali), idealmente quando avremo file reali di test dei Founder/early adopters per capire le casistiche più frequenti.
- **Dipende da**: D-FUTURE-07 ✅ (deve essere completa e testata in produzione prima)
- **Stato**: in memoria, da fare in seconda sessione AI Smart Import.

### D-FUTURE-08 — Social Share su property pubblica ✅ DONE (18 Giu 2026)
- **Idea agent + Founder** (18 Giu 2026, post M2.S5 Layer D Phase 2)
- **Cosa**: 4 pulsanti share sotto ogni immobile pubblico (`/api/p/{slug}/{pid}`): WhatsApp, Facebook, Email, Copy Link.
- **Decisione critica scartata** (con spirito critico del Founder): LinkedIn, Telegram, X — ROI quasi nullo su residenziale IT. Solo i 4 core, no menu "altri canali".
- **Razionale**: WhatsApp #1 in IT per immobiliare residenziale, Facebook ottimo per gruppi locali + Marketplace, Email/Copy fallback essenziali.
- **Implementato**: `_share_block()` in `themes.py` + absolute URLs (FRONTEND_URL env) + JS inline copy-to-clipboard, no librerie esterne.
- **Test**: 2 pytest dedicati (`test_themes.py::TestSocialShare`)
- **Stato**: ✅ DONE

### D-FUTURE-10 — AI Smart Import Immobili (pattern simmetrico a D-FUTURE-07) ⏳ (19 Giu 2026)
- **Origine**: dopo aver completato D-FUTURE-07 AI Smart Import Clienti, applicare lo stesso pattern al lato immobili — l'agente trascina Excel listino immobili (con colonne arbitrarie) → Gemini-3-flash mappa al schema Property OMNIA con confidence per riga.
- **Pattern**: identico a clients_ai_import (4 endpoint upload+parse, draft TTL 1h, patch, commit).
- **Differenza chiave**: lo schema Property ha 30+ campi e media (foto), quindi parser pre-Gemini più complesso per supportare:
  - Excel con colonne arbitrarie + URL/path foto separati
  - XML legacy non-Agestanet (es. Getrix, Wikicasa) tramite Gemini
  - Riconoscimento automatico tipologia da descrizione free-text
- **Quando**: P1 quando avremo i primi early-adopter agenti che vogliono migrare il portafoglio. Pattern coerente con D-FUTURE-07.
- **Stato**: in memoria.

### D-FUTURE-11 — Auto-post su Facebook Page + Instagram (M3.S2 extension) ⏳ (19 Giu 2026)
- **Origine**: osservazione del Founder durante il pianning di M3.S2 Publishing Center («l'agente in fase di caricamento dovrebbe poter decidere dove pubblicare e come condividere — pagina facebook, profilo facebook, instagram»).
- **Cosa**: estendere Publishing Center con auto-posting verso:
  - **Pagina Facebook agenzia** (via Meta Business Graph API + Pages access token)
  - **Profilo personale Facebook agente** ❌ NON FATTIBILE — Meta ha rimosso le permission `publish_actions` per i profili personali nel 2018. Resta solo deep-link share manuale (già presente nel Social Share su property pubblica).
  - **Instagram Business** (via Instagram Graph API, richiede account Business collegato a Page)
- **Pre-requisiti tecnici**:
  - Meta App registrata con review approvata (`pages_manage_posts`, `pages_read_engagement`, `instagram_content_publish`)
  - OAuth flow per autenticare l'agente e ottenere Pages token (long-lived ~60gg, refresh automatico)
  - Token management cifrato in MongoDB (riusiamo Fernet già usato per Portal Manager)
  - Instagram: solo foto con aspect ratio 4:5 / 1:1 / 1.91:1 → serve cropping client-side prima del post
- **Costo**: nessun costo Meta API (gratis per Pages business). Solo costo review Meta App (1-tantum).
- **Quando**: dopo M3.S2 Publishing Center base (toggle multi-portale + share manuali). Probabilmente sessione dedicata.
- **Stato**: in memoria, da fare dopo M3.S2.


### D-FUTURE-12 — Pagina dettaglio proprietà pubblica B2C come prossimo step (M3.S4) ⏳ (19 Giu 2026)
- **Origine**: suggerimento dell'agente al termine di M3.S2. Oggi l'agente può condividere un immobile via WhatsApp/FB/Email/Copy-Link dal Centro Pubblicazione, ma chi clicca atterra sulla pagina themed del backend (`/api/p/{slug}/{pid}`), che è renderizzata server-side e non ha form di contatto né lead capture nativo.
- **Cosa**: costruire una landing dedicata B2C su `/it/cloud/property/{pid}` con:
  - Gallery foto (carousel responsive)
  - Sezione info + features + classe energetica
  - Form contatto agenzia che crea un lead nel CRM dell'agente proprietario (riutilizza il modello `Lead` esistente)
  - Pulsanti share (riusa logica `PublishingCenter`)
  - Schema.org `RealEstateListing` per SEO
  - Tracking view_count (incremento server-side al GET)
- **Perché ha senso ora**:
  - Chiude il funnel acquisizione lead per l'agente (oggi il share è "monco" senza CTA conversione)
  - Sblocca M3.S7 (alerts B2C) perché serve la pagina di destinazione dei click sugli alert email
  - È il complemento naturale di M3.S2 (share genera link → link porta a landing → landing genera lead)
- **Costo**: ~1 sessione media. Nessun integrazione 3rd party necessaria.
- **Stato**: in attesa di approvazione Founder per priorizzazione vs M3.S3 (mappa).

### D-027 — Valutatore GIS pubblico: dataset curato vs OMI ufficiale (22 Giu 2026)
- **Contesto**: M3.S6 doveva integrare OMI ufficiale 27k zone, ma il dump non era ancora caricato in DB e l'ingestion ufficiale (Agenzia Entrate) richiede parsing complesso (semestri, codici comuni ISTAT, conversioni di valuta).
- **Decisione**: lanciare il valutatore con **dataset curato di 124 città italiane × 3 zone tier** (€/m² 2025 da fonti incrociate: Borsino Immobiliare, OMI semestre disponibile, Tecnocasa, Idealista, Casa.it heatmaps). Hard-coded in `apps/immocloud/data/italy_real_estate_prices_2025.py`, versionato e auditabile.
- **Razionale**:
  1. Time-to-market: 1 sessione vs 3-4 sessioni con ingestion OMI completa
  2. Qualità output: i 124 city benchmarks coprono 90%+ delle ricerche reali (capoluoghi + città medie + 9 ultra-premium)
  3. **Auditabilità**: ogni numero è ispezionabile e modificabile, vs un DB OMI opaco
  4. 50 pytest di congruenza assicurano che cambiamenti futuri al dataset non rompano output realistici
- **Future**: M3.S6.1 (backlog) caricare OMI 27k zone come **layer di override** sotto-comune (es. quartieri specifici di Milano/Roma). Il dataset curato resta fallback robusto.
- **Stato**: ✅ Implementato e testato (iter_15: 50/50 pytest + 12 curl + 4 frontend PASS).


### D-028 — Chatbot "Al" (M5.S1-S3): architettura e roadmap (23 Giu 2026)
- **Contesto**: discussione tecnica approfondita con Founder sull'architettura del chatbot AI di OMNIA. Founder vuole un assistente all'avanguardia che copra: codice OMNIA, manuale app, supporto utenti 24h, **anche aspetto giuridico/notarile**.

- **Decisione architetturale finale**: split in **3 chatbot specializzati sequenziali**, non un unico "tuttofare":
  1. **Al for Agents** (M5.S1) — assistente CRM interno IMMOWEB con function calling (query Mongo live, lead score, scrittura annunci, descrizioni, email follow-up)
  2. **Al Knowledge** (M5.S2) — supporto how-to della piattaforma via RAG su manuale curato (il manuale **sarà scritto da E1 a progetto ultimato** prima di M5.S2)
  3. **Al Legal** (M5.S3) — assistenza giuridica/notarile con architettura **web-search-first + anti-hallucination + escalate-to-specialist**

- **Architettura Al Legal definita (importante)**:
  - **Web search live** su fonti normative ufficiali italiane (normattiva.it, gazzettaufficiale.it, agenziaentrate.gov.it, notariato.it, cassazione.it)
  - Risposte con **citazioni inline obbligatorie** (artt. di legge, sentenze, circolari)
  - **Anti-hallucination layer**: secondo LLM verifica che ogni claim abbia fonte tracciabile + confidence scoring (soglia ≥0.85)
  - Sotto soglia confidence → "Non sono certo. Parla con un notaio →" (escalation CTA)
  - **Termini d'uso espliciti** + checkbox accettazione: "informazioni orientative, non parere legale ai sensi L.247/2012"
  - **Audit log completo** (5 anni retention) di ogni query + fonti citate + confidence + risposta
  - **NON serve** studio legale convenzionato per il lancio (la validazione la fanno le fonti pubbliche autoritative)

- **Stack tecnico**:
  - Modello primario: **Gemini 3 Flash** via Emergent LLM Key (costo trascurabile: ~€2/mese a 10 agenzie, ~€760/mese a 1000 agenzie)
  - Web search: **API gratuita in fase di lancio** (Brave Search API free-tier 2000 query/mese OR alternative gratis da valutare al momento implementazione)
  - Vector DB per RAG: Mongo Atlas vector search
  - Embeddings: Google text-embedding-004 (quasi gratis)
  - Ottimizzazioni standard: caching risposte frequenti, router cheap (regex), context window minimale, streaming responses

- **Razionale errori di stima precedenti corretti**:
  - Costi LLM inizialmente sovrastimati ×10 (avevo pensato a Claude Sonnet). Con Gemini Flash sono trascurabili → cost-control B2C non più urgente, possiamo offrire 24/7 illimitato in free-tier inizialmente
  - Al Legal inizialmente proposto come "post-monetizzazione + studio legale convenzionato" → ridimensionato a M5.S3 con architettura web-search che elimina necessità di KB curato e quindi di validazione legale dei contenuti

- **Sequenza definitiva concordata**:
  M5.S1 (Agents) → M5.S2 (Knowledge, dopo manuale scritto) → M5.S3 (Legal) → M5.S4-S6 (virtual staging, mutui, modulistica, APE) → M5.S7-S8 (visure, firma elettronica — questi sì post-società per account paid)

- **Stato**: in attesa. M5.S1 partirà nella prossima sessione operativa.

### D-029 — Al Legal: upgrade architetturale post-input Founder (24 Giu 2026)
- **Contesto**: Founder ha condiviso documento "chatbot legale" con prompt-engineering guide.
- **Adozioni nuove** (oltre architettura D-028):
  1. **Chain of Thought interno** prima di ogni risposta (riduce allucinazioni 30-40%)
  2. **Sub-agenti specializzati** (non più 1 bot generico):
     - Al-Legal-General · Al-Legal-Proposta · Al-Legal-Locazioni · Al-Legal-Catasto · Al-Legal-Urbanistica
  3. **Temperature 0.2** esplicito sul modello
  4. **Multi-Agent Validation** (riconferma D-028 hallucination check)
  5. **Upload PDF utente** per analisi proposte d'acquisto / compromessi (killer feature commerciale)
- **Architettura ibrida fonti**:
  - KB locale RAG: modelli contrattuali OMNIA, best practices interne, glossario settore
  - Web search live: CC, TU Edilizia, sentenze Cassazione, circolari AdE, DL recenti
- **Riformulazione prompt obbligatoria** per rischio legale:
  - "Agisci come **assistente informativo specializzato**" (NON "consulente legale senior")
  - Evita "pareri legali", parla di "informazioni orientative basate su fonti normative"
  - Riduce esposizione art. 348 c.p. (esercizio abusivo professione)
- **Graph-RAG rimandato** a M5.S3.5 / post-lancio (setup complesso, benefici reali solo con 100+ agenzie attive)
- **Impatto su roadmap**: M5.S3 passa da 1 sessione a 1.5-2 sessioni, valore commerciale 3-4× superiore
- **Stato**: piano architetturale aggiornato, attesa avvio M5.S1

---

### D-030 — Brand AI: "AL" (maiuscolo) come naming definitivo (24-Giu-2026)

- **Decisione**: il brand di tutti gli assistenti AI di OMNIA si scrive **"AL"** in maiuscolo (acronimo, non nome proprio "Al")
- **Razionale**: maggiore riconoscibilità visiva, lettura inequivoca ("AL Legal" vs "Al Legal"), allineamento con la nomenclatura IA italiana
- **Applicato a**: FAB chatbot, AL Chatbot CRM, AL Copywriter inline, AL Legal, SYSTEM_PROMPT backend, tutte le i18n keys, documentazione
- **Eccezione**: i routing path internal (`/api/app/al/...`) restano lowercase (non visibili all'utente)

---

### D-031 — Integrazione Tavily AI per ricerca normativa (24-Giu-2026)

- **Decisione**: AL Legal usa **Tavily AI** come web-search provider per fonti normative italiane
- **Razionale**: 1000 query/mese free, supporto `include_domains` per whitelist autoritative, latenza <2s, async-native compatibile con FastAPI
- **Domini whitelistati**: `normattiva.it`, `gazzettaufficiale.it`, `agenziaentrate.gov.it`, `notariato.it`, `cassazione.it`, `altalex.com`, `brocardi.it`
- **API key salvata**: `TAVILY_API_KEY` in `/app/backend/.env` (free dev key, da upgradare a paid quando query/mese supereranno 1000)
- **Alternative valutate e scartate**: Brave Search (generico, no whitelist fine-grained), Bing Search API (caro), Google Custom Search (limite 100/giorno free)

---

### D-032 — REVISIONE STRATEGICA: OMNIA è marketplace multi-side, non SaaS B2B (24-Giu-2026)

- **Trigger**: domanda critica del Founder *"i ricavi da crediti e annunci B2C dove sono nell'analisi?"*
- **Errore identificato**: nelle prime modellazioni economiche avevo considerato SOLO lo stream subscription B2B agenzie, sottostimando i ricavi totali di **~88%** (€1,3M annui vs €10,9M annui a 1000 agenzie)
- **Mappatura corretta — 7 revenue stream**:
  1. **Subscription B2B agenzie** (Starter €69 / Pro €189 / Premium €499 / Enterprise custom) — 19% del totale
  2. **Overage/credits B2B** (extra staging €0,90/img · video €3,90 · query AL Legal €0,60 · highlights portale €19-99 · ecc.) — 6%
  3. **B2C annunci privati** (Free / Vetrina €19 / Premium €49 / Top €99 / Pacchetto vendi-casa €299) — **32% del totale** (stream più grande, prima ignorato)
  4. **Lead-gen premium** per agenzie (lead qualificati €15-25, esclusivi €39-59) — 15%
  5. **Marketplace partner commissions** (mutui €750/pratica, APE €15-30, notai €30-100, assicurazioni 10-15% premio, fotografia 25%, cleaning/staging fisico 20%) — 23%
  6. **Data insights B2B** (report annuali a banche/sviluppatori) — 2% long-term
  7. **Omnia Academy** (corsi paid + subscription) — 3%
- **Implicazioni strategiche**:
  - Le agenzie sono il **funnel di acquisizione qualità annunci**, NON il profit center primario
  - Il vero profit center è il **consumatore privato B2C** + **commissioni partner**
  - Pricing aggressivo per agenzie (anche tier Starter quasi a costo) è giustificato dal cross-stream
  - **Founder 50 a −50% lock-in 24 mesi** è il GTM raccomandato
- **Stato**: analisi salvata in `BUSINESS_MODEL.md` (creato), pricing draft in `PRICING_DRAFT.md` (da creare), validazione finale richiesta da **commercialista / fractional CFO esperto real estate**

---

### D-034 — Valutatore GIS Pro: copertura nazionale + UNI 10750 + merito + regionali (25-Giu-2026)

- **Trigger**: Founder ricorda che nei vecchi repo (IMMOWEB + Immocloud-2.0, pre-monorepo) c'era già la decisione di un valutatore "stile perizia bancaria" con copertura nazionale completa, leggero per il deploy
- **Recupero**: ricostruita la decisione leggendo `https://github.com/mcnicastro-netizen/Immocloud-2.0/docs/architecture/ROADMAP_AND_KEYS.md` → "Zone OMI 27.228 + ISTAT FOI + 7.884 comuni"
- **Implementazione M3.S6-pro (25 Giu)**:
  1. **Estensione copertura nazionale leggera**: 124 città curate + 107 province IT con prezzi €/m² × 3 tier zona (centro/semicentro/periferia) + fallback regionale 20 regioni. Lookup via Nominatim (già nello stack) per comuni non in dataset → matcha provincia → applica prezzi province + sconto small-town -12%
  2. **Superficie commerciale UNI 10750 / DPR 138/1998**: ponderazione progressiva di principale (100%), verande (60%), terrazzi/balconi (30%→10% oltre 25mq), cantine/soffitte (25%), box (50%), giardino villa (10%→5%→2%), taverna (60%), mansarda (80%). Implementazione in `data/coefficients.py:compute_commercial_surface()`
  3. **Coefficienti di merito**: piano (classe), esposizione (sud/nord/cieca/...), affaccio (mare/panoramico/verde/cortile), riscaldamento (autonomo/centralizzato/pompa), ascensore vs piano, età immobile (decay -0,5%/anno oltre 30 anni capped -20%), vincoli (storico -10%, paesaggistico -5%), locazione in essere (-5/-15%), nuda proprietà (-30%). Cap totale: -40%/+30%
  4. **Coefficienti regionali**: liquidità di mercato (months time-to-sell × discount factor: Lombardia 0% → Calabria -8%) + trend YoY 2024-25 per regione (Lombardia +2.5% → Calabria -1%)
  5. **FOI ISTAT cumulato** per rivalutazione: pronto in `foi_revaluation(year_from, year_to)`, da attivare quando avremo prezzi storici
- **Files creati**:
  - `/app/backend/apps/immocloud/data/coefficients.py` (UNI 10750 + merito + regionali + FOI)
  - `/app/backend/apps/immocloud/data/province_prices.py` (107 province + nomi)
- **Files refactorati**:
  - `/app/backend/apps/immocloud/valuator.py` (pipeline 5-stage + Nominatim province fallback + new payload fields `commercial_surfaces` e `merit`)
- **Backwards-compat**: nuovi campi tutti OPTIONAL, vecchi client funzionano invariati
- **Test smoke**:
  - Saronno (non in dataset) → Nominatim → VA Varese, €1.782/m², €151k ✅
  - Pisa con UNI 10750 completo → 90mq calpestabile → 103,1mq commerciali, merit +15%, estimated €353-484k ✅
- **Coverage finale**: 100% IT, 3 layer fallback (city→province→region), endpoint `/api/cloud/valuator/coverage` documenta tutto
- **Stato**: backend operativo. Frontend `ValuatorPage.jsx` da estendere (form pro con UNI 10750 fields) — task next session

---

### D-033 — Architettura M5.S4 Virtual Staging "premium 3-stage" (24-Giu-2026)

- **Trigger**: rifiuto del Founder di una pipeline "basic single-pass" tipica dei competitor (Virtual Staging AI, Remodel AI, DecorCopilot, MyArchitectAI, ecc.). Richiesta esplicita: *"non possiamo parlare di ecosistema innovativo e poi offrire un sistema basic"*
- **Decisione**: pipeline a 3 stadi specializzati invece di img2img singolo
- **Stack tecnico**:
  - Stage 1: **SAM 2** (Segment Anything Model 2) via `fal-ai/segment-anything-2` per maschera pavimento/pareti/soffitto (~€0,001/img)
  - Stage 2: **Flux.1 [dev] Inpainting + Depth ControlNet** via `fal-ai/flux-general/inpainting` (~€0,05/img × 4 varianti parallele)
  - Stage 3: **Real-ESRGAN 4x** upscale via `fal-ai/real-esrgan` (~€0,005/img) + watermark "Render virtuale OMNIA"
- **Costo totale per render**: ~**€0,056/img** vs competitor che vendono €15-29/img (margine ~99,6%)
- **Provider unico**: fal.ai (1 API key per tutti i modelli)
- **5 differenziatori vs competitor** approvati:
  - A) **Prompt contestuale CRM-aware** (AL legge zona/prezzo/buyer persona e genera prompt ottimale)
  - B) **Reverse Staging** (rimuove arredo esistente e ri-arreda con stile diverso) — feature unica di mercato
  - C) **Micro-tour video 5s** via `fal-ai/kling-video/v1.6` o `cogvideox-5b` (~€0,30/clip)
  - D) **A/B test automatico sul portale B2C** (data-driven scelta stile vincente)
  - E) **Trasparenza normativa** (watermark obbligatorio + toggle "foto reale/render virtuale" — conformità AGCM 2024 + Codice Consumo art. 21)
- **Sequenza sprint M5.S4**:
  - S4.1 — Pipeline 3-stage + endpoint + frontend dropzone + watermark + i18n (1 sessione) ✅ DONE 03-Lug-2026
  - S4.2 — Reverse Staging + 4-varianti parallele + prompt CRM-aware **+ inline "Arreda questa foto" nel form immobili** (1 sessione, sub-task aggiunto 03-Lug-2026 su idea Founder: bottone accanto a ogni foto listing → modale VS pre-caricato con URL foto → salva risultato come nuova foto annuncio senza uscire dal flusso di caricamento. Obiettivo: trasformare VS da "usato occasionalmente" a "usato ogni giorno")
  - S4.3 — Micro-tour video + embed listing B2C + export Reels 9:16 (1 sessione)
  - S4.4 — A/B testing portale + dashboard analytics (~0,5 sessione)
- **API key richiesta**: `FAL_KEY` ✅ ATTIVA su account Founder (top-up eseguito 03-Lug-2026)
- **Stato**: S4.1 ✅ DONE, S4.2 next


### D-035 — STOP PRE-LAUNCH: ritorno al PROGRAMMA OPERATIVO originale (29-Giu-2026) 🛑

- **Trigger**: il Founder constata che la traiettoria delle ultime 3-4 sessioni (Pricing v1.0 → Resend domain → Landing `/it/agenzie` → Sora 2 videos → Banner CTA proposto → ANNCSU autocomplete) ha **deviato dal programma operativo originale** in favore di una pre-launch commerciale **mai richiesta esplicitamente** dal Founder. Citazione: *"abbiamo perso il filo inseguendo un pre-launch che a me non interessa per ora"*.
- **Decisione vincolante**:
  1. ❌ **NESSUN pre-launch** finché:
     - Tutte le **feature del Santo Graal** sono complete e funzionanti
     - **Omnia Academy (M6)** è strutturata e operativa
  2. ✅ **Si riprende il PROGRAMMA OPERATIVO originale** (`PROGRAMMA_OMNIA.md` v2.4) **passo passo, sequenziale, senza scorciatoie**
  3. ✅ **Recupero dei lavori saltati o parziali**, in particolare:
     - **MLS multi-agenzia** (M4.S1+S2) — Founder aveva fornito due materiali di riferimento ora da rianalizzare:
       - **Screenshots Agestanet** (gestionale di riferimento) per studiare l'UX del modulo MLS
       - **Screenshot box MLS di nicastroimmobiliare.it** per replicare la logica già in produzione su quel sito
     - Altri lavori parziali da identificare al prossimo accesso (audit completo dei TODO non chiusi nei `M*.S*` originali)
  4. ⏸️ **Tutto il filone commerciale è congelato**: Landing `/it/agenzie`, Banner CTA, warm-up Resend, outreach Founders 50, Sora 2 demo videos, pricing publishing → **restano in stato dormiente** finché Founder non riapre esplicitamente quel filone (dopo completamento M6)
- **Implicazioni operative**:
  - La **ROADMAP.md** torna a essere guidata dal sequencer originale M2 → M3 → M4 → M5 → M6 (con le decisioni intermedie ancora valide su sequenza M5 prima di M4 — D-032)
  - Lo schema "Santo Graal" (ChatGPT Image 15 apr 2026) torna ad essere la **unica north-star** di prodotto
  - Il **PRD.md** evidenzierà chiaramente l'inversione di rotta e gli item da recuperare
- **Cosa NON cambia**:
  - Tutto il lavoro tecnico già consegnato (M1 ✅ · M2 ✅ · M3 ✅ · M5.S1 ✅ · M5.S3 ✅ · M3.S6-pro ✅ · ANNCSU autocomplete ✅) **resta in produzione** — niente roll-back
  - I documenti strategici (`PRICING_OMNIA.md`, `BUSINESS_MODEL.md`, `PROGRAMMA_OMNIA.md`) **restano validi come riferimento**, ma il loro contenuto NON guida le prossime sessioni finché Founder non riapre il filone commerciale
- **Stato**: decisione vincolante, applicata a partire dalla prossima sessione
- **Riferimento materiali Founder da recuperare**:
  - Screenshots Agestanet (UX modulo MLS) — da rilocalizzare nella prossima sessione tra gli artifact del job
  - Screenshot box MLS `nicastroimmobiliare.it` — da rilocalizzare o richiedere nuovo upload


### D-036 — Rebranding assistente AI: AL → HAL (03-Lug-2026) 🤖

- **Trigger**: richiesta esplicita del Founder — *"correggi Al in Hal (il ns. chatbot non sarà da meno)"* — omaggio a HAL 9000 di "2001: Odissea nello spazio".
- **Decisione**: tutte le occorrenze **user-facing** di "AL" diventano **"HAL"**: chat widget flottante, "HAL Legal", "Migliora con HAL", chiavi i18n IT/EN/ES (~14 per lingua), system prompt LLM ("Sei HAL..."), disclaimer legali.
- **Cosa NON cambia (scelta tecnica)**: route API interne (`/api/app/al/...`), nomi file (`al_agent.py`, `AlChatWidget.jsx`), data-testid — zero rischio di regressione, il cambio è puramente di brand.
- **Attenzione**: "AL" resta valido in `province_prices.py` (sigla provincia Alessandria) — NON toccare.
- **Stato**: ✅ APPLICATA e verificata (screenshot dashboard: bottone HAL, menu HAL Legal, zero residui).

### D-037 — Rimozione "Descrizione coordinata" staging + strategia Mutui/APE (03-Lug-2026) 🛡️

- **Parte 1 — Descrizione coordinata RIMOSSA**: il Founder ha bocciato la feature "staging → descrizione annuncio coordinata con lo stile del render" perché *"l'annuncio dell'immobile renderizzato potrebbe creare confusione con la reale situazione manutentiva dell'originale"* — stesso principio AGCM che impone il watermark sui render. Rimossi: endpoint `POST /staging/jobs/{id}/rewrite-description`, bottone e pannello in `StagingStudio.jsx`, test relativi. **NON riproporre feature che descrivono l'immobile secondo lo stile del virtual staging.**
- **Parte 2 — Comparatore Mutui (M5.S5), strategia decisa dopo ricerca**:
  - MutuiOnline, Facile.it/Mutui.it, Segugio NON hanno API pubbliche → solo accordi di affiliazione commerciale (il Founder valuta in autonomia; sta guardando MutuiOnline)
  - Approccio approvato in attesa: **motore in-house orientativo** — rata (ammortamento francese), TAN = benchmark + spread (Eurirs ~2,75-3,17% fisso, Euribor variabile), TAEG con spese, confronto fisso/variabile multi-durata, controllo soglia usura via TEGM Banca d'Italia (CSV open data `TEGM_SERIE_STORICA.CSV`), tabella offerte banche curata dall'admin. Informativo con disclaimer → nessuna licenza di mediazione creditizia. Predisposto per link-out affiliato futuro.
- **Parte 3 — APE (M5.S6), strategia decisa dopo ricerca**:
  - L'APE ufficiale richiede per legge tecnico abilitato ENEA + sopralluogo: APEFACILE/Apeadesso/VisureItalia sono solo piattaforme di ordine (€49-75, 48-72h), nessuna API pubblica. Il Founder valuta APEFACILE come partner esterno.
  - M5.S6 resta **calcolatore orientativo in-house** (classe stimata da anno costruzione, impianti, infissi, isolamento) con disclaimer "non sostituisce l'APE ufficiale" + eventuale link-out per l'ordine ufficiale.
- **Stato**: Parte 1 ✅ APPLICATA (25/25 test passati). Parti 2-3 = linee guida per M5.S5/M5.S6, in attesa di eventuale decisione Founder su affiliazioni esterne.

### D-038 — Outreach partner APE: APEFACILE + Certificato-Energetico.it (06-Lug-2026) 📧

- **Contesto**: per M5.S6, oltre al calcolatore orientativo in-house (D-037), il Founder vuole integrare l'ordine dell'APE ufficiale tramite partner esterno. MutuiOnline aveva rifiutato partnership senza volumi → approccio diverso: per i fornitori APE ogni ordine è fatturato immediato, quindi pay-per-use senza minimi è richiesta ragionevole.
- **Azione**: preparate (analisi siti inclusa) due email di presentazione firmate Marco Nicastro:
  1. **APEFACILE** (apefacile.it) — servizio diretto, consegna 24-48h, video-rilievo, già partner Immobiliare.it. Richieste: API con API key, listino B2B pay-per-use senza minimi/canoni, white label, SLA canale partner.
  2. **Certificato-Energetico.it / EnUp S.r.l.** — marketplace tecnici certificatori, consegna 3-5gg, ha già programma "Collabora — Agenzie Immobiliari" con form embeddabile + APE digitale interattivo con confronto SIAPE (enHub). Richieste: API oltre il form, listino B2B, white label/co-branding, esposizione APE interattivo nel Fascicolo OMNIA.
- **Clausola vincolante Founder (in entrambe)**: il prezzo al cliente finale NON dovrà mai superare il listino pubblico del fornitore; eventuali costi di integrazione assorbiti nel rapporto B2B. Leva negoziale: "stiamo selezionando un partner unico" in entrambe le email.
- **Stato**: ⏳ IN ATTESA — email consegnate al Founder il 06-Lug-2026 per l'invio. Quando arrivano le risposte, impostare M5.S6 di conseguenza: calcolatore orientativo in-house + bottone "Ordina APE ufficiale" col partner scelto (idealmente dal Fascicolo Immobile e dalla scheda immobile CRM).
- **Nota per M5.S6**: NON bloccare lo sviluppo del calcolatore orientativo in attesa dei partner — sono due binari indipendenti.


### D-039 — Rimozione calcolatore APE orientativo da M5.S6 (06-Lug-2026) ❌

- **Contesto**: la strategia originaria di M5.S6 (D-037 parte 3) prevedeva un calcolatore APE orientativo in-house da affiancare al binario partner esterno (D-038). Il Founder ha rivalutato costi/benefici.
- **Decisione**: **eliminato dalla roadmap** il calcolatore APE orientativo in-house. Motivazioni:
  1. Rischio disclaimer/reputazionale: qualsiasi output OMNIA verrebbe confuso con l'APE ufficiale (che per legge richiede tecnico abilitato ENEA + sopralluogo).
  2. Valore percepito basso: un numero "indicativo" non guida decisioni di acquisto/locazione.
  3. Overhead di manutenzione (formule, tabelle DPR 412/93, verifica con certificatore) non giustificato.
- **Cosa rimane in vita**: **binario partner esterno D-038** (APEFACILE + Certificato-Energetico.it/EnUp). Se un partner risponde positivamente, si integrerà **solo** un bottone "Ordina APE ufficiale" nel Fascicolo Immobile e nella scheda CRM immobile — nessun calcolo lato OMNIA. Nessun blocco della roadmap in attesa di risposte.
- **Effetto sequenza (D-032 aggiornata)**: M5.S5 ✅ → **M5.S2-pre Manuale Operativo** → M5.S2 HAL Knowledge → M6 Omnia Academy → M4 (post-società). M5.S7/S8 (Modulistica, Firma, Visure) restano post-società.
- **Stato D-037 parte 3**: superata da D-039. La parte 1 (rimozione descrizione coordinata staging) e parte 2 (strategia Mutui) restano valide.
- **Stato D-038**: rimane ⏳ in attesa risposte partner, con scope ridotto a "ordine APE ufficiale via link-out/embed", non più abbinato a un calcolatore in-house.
- **Stato**: ✅ APPLICATA. `PROGRAMMA_OMNIA.md` e `PRD.md` aggiornati.

### D-040 — HAL entry point: 3 bottoni fisici, no router LLM (06-Lug-2026) 🎛️

- **Contesto**: HAL è splittato in 3 sub-chatbot (Agents, Legal, Knowledge — vedi D-028). Domanda architetturale aperta per M5.S2: unificare in un HAL Home con router LLM davanti oppure tenere 3 entry point espliciti.
- **Analisi costo/beneficio del router LLM (Gemini 3 Flash)**:
  - ~350 token input + ~15 token output per classificazione → ~$0.00003/call
  - A 100k routes/mese → **~$0.30/mese** (rumore statistico vs. gli altri costi Emergent LLM Key).
  - Latenza aggiunta: **+200-400ms** prima del primo token → percettibile.
  - Accuratezza attesa: ~97% (vs. ~85% regole keyword, ~92% embeddings, 100% bottoni fisici).
- **Decisione**: **3 bottoni fisici** ("Chiedi ai tuoi dati" / "Chiedi al manuale" / "Chiedi al legale"), nessun router LLM davanti.
- **Motivazione**:
  1. Trasparenza UX: l'utente sa sempre quale HAL sta parlando e con quali dati/regole (importante per la fiducia, soprattutto lato Legal).
  2. Zero latenza router, zero costo router.
  3. Isolamento dati: rende impossibile un HAL Knowledge che "per sbaglio" chiama un tool di HAL Agents leakando dati CRM cross-tenant.
- **Revisione futura**: se dopo 2-3 mesi di M5.S2 in produzione vediamo >15% "wrong button" (utenti che scrivono domande legali dentro HAL Knowledge o viceversa), riapriamo il tema con **regole keyword + fallback LLM solo su mismatch** (accuratezza ~94%, costo ~zero).
- **Effetto UI**: entry point HAL nell'header/sidebar mostrerà 3 bottoni distinti con icone e tooltip che spiegano cosa fa ciascuno. Nessun widget flottante "HAL Home" unificato.
- **Stato**: ✅ APPLICATA. Implementazione contestuale a M5.S2 (HAL Knowledge). Fino ad allora, gli entry point esistenti (CRM per Agents, `/legal` per Legal) restano invariati.

