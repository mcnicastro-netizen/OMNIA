# 📘 PROGRAMMA OPERATIVO — Progetto OMNIA
## Dal MVP all'ecosistema completo · 6 Milestone · ~30 sessioni · 3-6 mesi

**Versione**: 2.1
**Data creazione**: Gennaio 2026
**Ultimo aggiornamento**: 18 Giugno 2026 (post M2.S5 completo + D-FUTURE-04 Smart Clients + nuova priorità AI Smart Import D-FUTURE-07)
**Founder / Product Owner**: mcnicastro-netizen
**Lead Developer**: E1 (Emergent Agent)
**Stato**: M1 ✅ DONE · **M2.S1→S5 ✅ DONE** · M2.S6 ⏳ + D-FUTURE-07 🔴 NUOVA PRIORITÀ

---

## 🔥 Cambiamenti strategici v2.1 (rispetto a v2.0)

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

# 🌐 MILESTONE 3 — IMMOBILCLOUD MVP (Portale B2C)
**Durata**: 2-3 settimane · **Sessioni**: 5

### M3.S1 — Home pubblica + design system
- Hero search box
- Sezioni: immobili in evidenza, città popolari, valutatore CTA
- Mobile-first responsive
- **Tuo compito**: paletta colori OMNIA + tono di voce

### M3.S2 — Ricerca + Mappa + Filtri 🔥 (feature parity con Idealista + Immobiliare.it)
- Ricerca testuale con autocomplete (7.884 comuni)
- Mappa interattiva (OpenStreetMap/Leaflet)
- Filtri completi (replica idealista, già coerenti con `SearchPreferences` cliente)
- 🆕 **Multi-zone selection sulla mappa** (Idealista best practice)
- 🆕 **Disegna su mappa** (Immobiliare.it best practice)
- 🆕 **Cerca vicino a te** / tempo percorrenza in auto/bici/piedi (Immobiliare.it)
- 🆕 **Confronta prezzi di mercato** per zona (Immobiliare.it)
- Salva ricerca + alert email

### M3.S3 — Scheda immobile + Contatto agente
- Layout completo (foto galleria, mappa, planimetria, features)
- Privacy 4 livelli applicata
- Form contatto → lead in ImmoWeb
- Chat in-app o WhatsApp link

### M3.S4 — Valutatore GIS pubblico
- Form valutazione: indirizzo + dati
- Geocoding Nominatim + OMI (27.228 zone) + FOI
- Report PDF brandizzato
- Cattura lead privato

### M3.S5 — Pubblicazione annuncio privato venditore 🆕 (era già pianificata, ora prioritizzata)
- Auth privato separata da auth agenzia
- Form "Vendi casa" privati con mini-wizard (foto + dati + prezzo)
- Limite gratuito (2 annunci, soglie < €1M vendita / €2.500/mo affitto — copia Idealista)
- Annunci a pagamento oltre soglia (sistema crediti D-024)
- Agenzia partecipante può "prendere in carico" l'annuncio del privato → lead caldo nel CRM agenzia
- 🆕 **Privacy 4 livelli** applicata (PUBLIC/MLS_MEMBER/ACCEPTED/OWNER) — unico nel mercato IT
- 🆕 **"Immobili Segreti"** equivalente (off-market premium, copia Immobiliare.it)
- 🆕 **Agency Recommender** (Idealista feature: matching privato venditore ↔ migliori 4 agenzie zona)
- **Tuo compito**: definire prezzi annuncio over-limit + criteri agency recommender

### ✅ Definition of Done M3
- [ ] Portale pubblico online con SEO base
- [ ] 50 immobili pubblicati ricercabili
- [ ] Valutatore funzionante
- [ ] **Privato carica annuncio** in autonomia
- [ ] Lead arrivano in ImmoWeb
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
**Durata**: 1-2 settimane · **Sessioni**: 4

### M5.S1 — AI Copywriter annunci
- Descrizione da foto + dati (Gemini)
- 3 toni: standard / lusso / giovane
- Multi-lingua IT/EN
- Costo in crediti
- **Tuo compito**: validare qualità su 20 esempi

### M5.S2 — Chatbot "Al" pubblico (ImmobilCloud)
- Assistente 24/7 portale
- RAG su FAQ + database immobili
- Lead capture conversazionale
- Handoff agente reale
- **Tuo compito**: 30-50 FAQ + tono di voce

### M5.S3 — Comparatore mutui
- Form richiesta mutuo
- Lookup tassi (mock o partner affiliate)
- Genera lead partner finanziari
- Tracciamento conversion
- **Tuo compito**: 1-2 partner mutui

### M5.S4 — Modulistica AI + Reperimento documenti
- Template contratti (proposta, mandato, preliminare)
- Auto-compilazione
- Lookup visure (VisureItalia API)
- Storage documenti
- **Tuo compito**: VisureItalia account + 5 template legali

### ✅ Definition of Done M5
- [ ] Copywriter produce descrizioni vendibili
- [ ] Chatbot risponde a 80% domande
- [ ] Comparatore mutui genera primi lead
- [ ] Modulistica salva 50% tempo agente

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
