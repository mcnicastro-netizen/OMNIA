# 📘 PROGRAMMA OPERATIVO — Progetto OMNIA
## Dal MVP all'ecosistema completo · 6 Milestone · ~30 sessioni · 3-6 mesi

**Versione**: 1.1
**Data creazione**: Gennaio 2026
**Ultimo aggiornamento**: 10 Giugno 2026 (post M1.S1)
**Founder / Product Owner**: mcnicastro-netizen
**Lead Developer**: E1 (Emergent Agent)
**Stato**: M1 in corso · M1.S1 ✅ completata

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

# 🏗️ MILESTONE 1 — FOUNDATION & ARCHITETTURA
**Durata**: 1-2 settimane · **Sessioni**: 4

### M1.S1 — Decisioni architetturali (NO codice)
- Decisione 1: Monorepo (Turborepo) vs 3 repo separati → raccomando monorepo
- Decisione 2: Nome dominio principale (es. omnia.realestate)
- Decisione 3: Schema URL sottodomini
- Decisione 4: Database singolo MongoDB con tenant-id o cluster separati
- **Output**: ARCHITECTURE.md firmato
- **Tuo compito**: rispondere alle 4 domande

### M1.S2 — Setup monorepo + struttura base
- Setup Turborepo: apps/immocloud, apps/immoweb, apps/academy, packages/shared
- Modelli dati canonici condivisi
- Backend FastAPI con multi-tenant pattern
- Frontend React shell per le 3 app
- **Output**: 3 app vuote che girano + endpoint /api/health
- **Tuo compito**: vedere le 3 home pages caricarsi

### M1.S3 — Auth JWT + Ruoli + Multi-tenant
- Sistema auth condiviso (login/register/reset password)
- Ruoli: super_admin, agency_admin, agent, client, student
- Multi-tenant: ogni utente appartiene a agency_id
- Email transazionali (SendGrid) placeholder
- **Output**: account, login, ruolo funzionanti
- **Tuo compito**: ottenere API key SendGrid

### M1.S4 — Deploy preview + dominio
- Deploy le 3 app su Emergent platform
- Configurazione sottodomini DNS
- HTTPS automatico
- Pagina "Coming Soon" pubblica
- **Output**: 3 URL pubblici raggiungibili
- **Tuo compito**: acquistare dominio

### ✅ Definition of Done M1
- [ ] 3 app deployabili e raggiungibili online
- [ ] Login/logout funzionante con ruoli
- [ ] Tenant isolation testato
- [ ] PRD.md e ROADMAP.md aggiornati

---

# 🏢 MILESTONE 2 — IMMOWEB MVP (Gestionale Agenzia)
**Durata**: 3-4 settimane · **Sessioni**: 6

### M2.S1 — Dashboard agenzia + onboarding
- Wizard setup agenzia (logo, colori, dati fiscali)
- Dashboard con KPI base
- Gestione collaboratori (invita agente via email)
- **Tuo compito**: definire KPI home

### M2.S2 — CRUD Immobili completo
- Form pubblicazione immobile (16 tipologie)
- Upload foto multiple (Emergent Object Storage)
- Campi: dati base, energetici, features (25), owner, privacy
- Stati: draft / active / reserved / sold / rented / withdrawn
- **Tuo compito**: 10 immobili reali per test

### M2.S3 — CRM clienti + Richieste
- Anagrafica clienti
- Richieste di ricerca
- Storico interazioni
- Tag e segmenti
- **Tuo compito**: 20 clienti test inseriti

### M2.S4 — Matching engine
- Algoritmo (City 20 + Zone 10 + Type 15 + Op 15 + Price 20 + Surface 10 + Rooms 5 + Beds 5)
- Vista Match per immobile e per cliente
- Notifica email su nuovo match
- **Tuo compito**: validare match con criterio umano

### M2.S5 — Multiposting XML portali
- Feed XML per Immobiliare.it, Idealista, Casa.it
- Configurazione credenziali per-agenzia
- Cron job pubblicazione automatica
- **Tuo compito**: ottenere credenziali API/FTP portali

### M2.S6 — White Label base
- Personalizzazione: logo, colori, font
- Mini-sito vetrina agenzia (/agency/{slug})
- Sottodominio dedicato premium
- **Tuo compito**: logo + paletta colori

### ✅ Definition of Done M2
- [ ] Agenzia: registra, carica 10 immobili, gestisce 20 clienti, vede match
- [ ] Multiposting esporta feed validi
- [ ] White label con sottodominio
- [ ] 5 agenti in parallelo nella stessa agenzia

---

# 🌐 MILESTONE 3 — IMMOBILCLOUD MVP (Portale B2C)
**Durata**: 2-3 settimane · **Sessioni**: 5

### M3.S1 — Home pubblica + design system
- Hero search box
- Sezioni: immobili in evidenza, città popolari, valutatore CTA
- Mobile-first responsive
- **Tuo compito**: paletta colori OMNIA + tono di voce

### M3.S2 — Ricerca + Mappa + Filtri
- Ricerca testuale con autocomplete (7.884 comuni)
- Mappa interattiva (OpenStreetMap/Leaflet)
- Filtri completi
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

### M3.S5 — Pubblicazione annuncio privato
- Form "Vendi casa" privati
- Limite gratuito (max 2, soglie < €1M)
- Annunci a pagamento oltre soglia
- **Tuo compito**: definire prezzi annuncio over-limit

### ✅ Definition of Done M3
- [ ] Portale pubblico online con SEO base
- [ ] 50 immobili pubblicati ricercabili
- [ ] Valutatore funzionante
- [ ] Lead arrivano in ImmoWeb
- [ ] Privacy 4 livelli rispettata

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

### M4.S3 — Stripe abbonamenti
- 3 piani: Founder €29, Pro €49, Agency €149
- Trial 14 giorni
- Limiti per piano
- Customer Portal Stripe
- **Tuo compito**: account Stripe attivo + IBAN

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
| **M1** | Foundation | 4 | 1-2 | €0-50 | Auth + multi-tenant |
| **M2** | ImmoWeb | 6 | 3-4 | €50-150 | CRM agenzia |
| **M3** | ImmobilCloud | 5 | 2-3 | €100-250 | Portale pubblico |
| **M4** | MLS + Stripe | 5 | 3-4 | €150-350 | 🎉 Vendibile |
| **M5** | AI Suite | 4 | 1-2 | €200-500 | Differenziale AI |
| **M6** | Academy | 5 | 2-3 | €250-600 | 🏆 Ecosistema |
| | **TOT** | **29** | **12-18 sett.** | | |

---

## 📝 PARTE IV — Checklist per il Founder

### Necessario adesso (prima di M1)
- [ ] Dominio principale (suggerito: omnia.realestate)
- [ ] Account Emergent attivo con Universal LLM Key
- [ ] Account GitHub

### Necessario M1-M2
- [ ] API Key SendGrid (free 100/giorno)
- [ ] Logo OMNIA + paletta colori
- [ ] 10 immobili reali per test
- [ ] 20 clienti test

### Necessario M3
- [ ] Decisione prezzi annunci over-limit
- [ ] Validazione tono di voce

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

## 🎯 PARTE VII — Prossimo passo

Per partire con M1.S1:

1. Salvarsi questo programma (✅ fatto, è qui)
2. Pensare alle 4 decisioni di M1.S1:
   - Monorepo o multi-repo?
   - Nome dominio?
   - Schema sottodomini?
   - Database singolo o cluster?
3. Quando pronto: scrivere "Partiamo con M1.S1"

---

*Documento approvato: Gennaio 2026*
*Prossima revisione: alla fine di ogni milestone*
