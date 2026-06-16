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
