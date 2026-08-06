# 🔬 Aspetti da approfondire — OMNIA

> File di appoggio per **temi strategici/tecnici** che il Founder ha esplicitamente segnalato come "da rivedere più avanti", **senza essere ancora decisioni**. Ogni voce va promossa in `DECISIONS.md` o `ROADMAP.md` quando si decide di procedere.

**Ultimo aggiornamento**: 06 Agosto 2026

---

## 🟠 A-001 — BNPL B2B (Buy Now Pay Later) per contratti annuali OMNIA

**Data inserimento**: 05-Feb-2026
**Segnalato da**: Founder (Nicastro)
**Contesto**: Domanda spontanea del Founder — *"e se inserissimo oltre stripe anche una di quelle soluzioni che consentono il pagamento in tre/quattro mesi per i contratti annuali?"*

### Idea di fondo
Affiancare a **Stripe** una soluzione BNPL (rate senza interessi) per abbassare l'attrito d'acquisto sui **piani annuali OMNIA** (€1.490-3.600/anno). Il fornitore BNPL anticipa a OMNIA il 100% dell'importo (meno commissione ~3-6%) e si prende il rischio di credito.

### Perché ha senso (pro)
- **+30-50% conversion rate** stimato su piano annuale (dati aggregati Scalapay/Klarna B2B)
- **Cassa immediata annuale** vs. rischio churn mensile
- Difende il piano annuale dal churn (vincolo contrattuale)
- Segnale di maturità del brand vs. gestionali legacy (Findomestic/Compass sono standard nel settore)
- Psicologicamente il cliente percepisce "€124/mese × 12" invece dello shock di "€1.490 subito"

### Contro / rischi da studiare
- **Commissione 3-6%** → margine perso o da prezzare dentro
- **Complessità legale IT**: contratto tripartito, adempimenti Banca d'Italia B2B, GDPR condivisione dati con lender
- **Denial rate ~15-25%** → serve sempre Stripe come fallback visibile
- **Integrazione tecnica**: webhook stato rate, logica sospensione account su rata insoluta, coordinamento fatturazione IT (chi emette fattura, quando)

### Opzioni fornitori identificate (da valutare in profondità)
1. 🥇 **Scalapay B2B** — italiana, fino a 12 rate, commissione ~4-5%, adempimenti fiscali IT nativi, riconoscibile dai commercialisti agenzie *(da confermare copertura P.IVA)*
2. 🥈 **Klarna Business** — brand forte, fino a 24 rate, meno diffuso B2B IT, commissione più alta ~5-6%
3. 🥉 **Stripe Payment Plans / Capital** — rate integrate nel Payment Element esistente, un solo vendor, ~3-4%, meno brand awareness IT
4. 🏆 **Soisy / Findomestic Pay** — per contratti > €5K (franchise/LMS/multi-branch), istruttoria creditizia vera

### Strategia proposta (in bozza — NON ancora decisione)
- **Fase 1 (MVP)**: Stripe Payment Plans (zero nuovo vendor, riuso stack esistente)
- **Fase 2 (dopo 20-30 clienti)**: aggiungere Scalapay B2B se il segnale di conversione è forte
- **Fase 3 (enterprise)**: Soisy/Findomestic per contratti €10K+

### Timing consigliato (mia proposta)
**NON adesso**. Attivare **dopo M2.6b (Sync Engine)** e almeno insieme al primo push commerciale reale (verosimilmente dopo M2.5.4b Domain Checker come lead magnet). Il BNPL è ottimizzazione commerciale, non funzionalità core.

### Domande aperte per il Founder
1. Il target primario acquista già annuale cash, o vende principalmente mensile? *(se mensile → BNPL è killer feature)*
2. La commissione 4-5% va scaricata sul prezzo o assorbita?
3. Clausole di sospensione servizio se rata insoluta: come le vogliamo scritte nei ToS?
4. Timing lancio: prima del primo cliente enterprise, o dopo 10 clienti "normali" validati?

### Stato
🟠 **DA APPROFONDIRE** — Founder ha chiesto esplicitamente di memorizzare per rivederlo. Nessuna implementazione, nessuna decisione presa.

### Trigger di ripresa
- Definizione pricing definitivo v2 (M2.5.0)
- Primo cliente enterprise in pipeline
- Segnale espressivo di friction sul checkout Stripe annuale

---

## 🟠 A-002 — NVIDIA API Catalog (build.nvidia.com) come provider LLM complementare

**Data inserimento**: 05-Feb-2026
**Segnalato da**: Founder (Nicastro) — domanda spontanea *"nvidia ha aperto una porta tramite APIKEY per l'utilizzo di tutte le ia che la utilizzano?"*
**Contesto**: NVIDIA ha reso disponibile su `build.nvidia.com` un catalogo unificato con **1 API key (`nvapi-...`)** che sblocca 100-160+ modelli IA, endpoint OpenAI-compatible (`https://integrate.api.nvidia.com/v1`). Free tier: **1.000 crediti** senza CC (estendibili a 5.000), **nessuna scadenza**, rate limit 40 RPM. Uso produzione richiede licenza NVIDIA AI Enterprise (trial 90gg gratis).

### Perché è potenzialmente utile per OMNIA
Non è "sostituto" dell'Emergent LLM Key: è **complementare**. Ogni provider farebbe quello che sa fare meglio, al costo migliore. Architettura target:

```
HAL Chatbot (conversazioni utente)      → Gemini (Emergent LLM Key) — attuale
Analisi foto immobili (batch)           → Llama Vision (NVIDIA) — NEW
Embedding RAG manuale/Academy           → nv-embed-v2 (NVIDIA) — NEW
Parser XML legacy sporchi (M2.5.4a)     → DeepSeek V4 (NVIDIA) — opzionale
Contenuti creativi (annunci, email)     → Claude (Emergent LLM Key) — attuale
```

### 🎯 Use case #1 — Vision Auto-tagging foto immobili ⭐⭐⭐ (KILLER FEATURE candidata)
**Modello target**: Llama 3.2 Vision 90B (o equivalente vision-instruct del catalogo)
**Cosa fa**: L'agente carica 15 foto immobile → il sistema analizza automaticamente e produce:
- **Tag automatici**: "cucina moderna, parquet, doppia esposizione, terrazzo, ristrutturato"
- **Auto-compilazione descrizione base** dell'annuncio
- **Estrazione feature strutturate**: elettrodomestici incassati, isola centrale, tipo pavimento, esposizione stimata
- **Suggerimento stile Virtual Staging** più adatto (moderno/classico/scandinavo)
- **Compliance check foto** (utile a M2.6b Compliance Validator):
  - Foto duplicate/ripetute
  - Foto sfocate o sotto risoluzione minima
  - Watermark di altri portali visibili (rischio legale)
  - Presenza persone identificabili (GDPR)

**Perché NVIDIA e non Gemini Vision (già in casa)?**
- Gemini Vision consuma budget Emergent LLM Key
- Llama 3.2 Vision 90B via NVIDIA = **gratis** nei primi 1000 crediti, poi ~1/5 del costo Gemini
- Task batch: 100 foto × 50 immobili nuovi/mese = 5.000 chiamate/mese → risparmio sostanziale

**Timing consigliato**: candidato feature per **M2.7 (Post-Publishing Center)** o **M3.S8 (Property Enrichment)** — vedi ROADMAP quando definiremo il modulo.

**Effetto competitivo**: nessun gestionale italiano oggi ha auto-tagging AI delle foto → forte differenziatore in demo commerciale.

### 🎯 Use case #2 — Embedding gratuiti per HAL Knowledge (RAG) ⭐⭐⭐
**Modelli target**: `nv-embed-v2`, `nvidia/embed-qa-4` (embedding di livello SOTA)
**Cosa fa**: Quando arriveremo a **M5.S2 HAL Knowledge** (chatbot che consulta manuale operativo OMNIA + Academy) servirà una pipeline RAG con embedding vettoriali.

**Scala stimata**:
- Manuale Operativo: ~20 capitoli × ~500 chunk = ~10.000 embedding
- Omnia Academy (M6): ~500 lezioni × ~20 chunk = ~10.000 embedding
- Re-index periodici quando cambiano contenuti

**Perché NVIDIA**: su Emergent LLM Key gli embedding contano come chiamate. Su NVIDIA sono gratis nei 1000 crediti iniziali → risparmio silenzioso ma sostanziale su scala 20K+ embedding.

**Timing**: **prerequisito M5.S2 HAL Knowledge** (fase P2 del PROGRAMMA_OMNIA v3.0).

### ❌ Cose del catalogo NVIDIA che NON ci servono (evitare distrazioni)
- Modelli reasoning generici (GLM, Kimi K2, Nemotron 550B) → HAL usa già Gemini
- Modelli coding → il codice lo scriviamo noi
- Speech/TTS → fuori roadmap OMNIA
- Modelli biologia/scientifici → fuori dominio
- Modelli 3D/simulazione → Virtual Staging usa fal.ai specializzato

### ⚠️ Contro / rischi da considerare
- Rate limit 40 RPM → OK dev, non produzione con 100+ agenzie concorrenti
- Free tier "development only" ufficialmente → uso produzione richiede AI Enterprise license
- 2 sistemi di key management → un pizzico di complessità operativa in più
- Dipendenza da un ulteriore vendor esterno

### Strategia proposta (in bozza)
1. **Fase esplorativa** (30 minuti, gratuito): registrare account, ottenere `nvapi-...`, salvare in variabile env `NVIDIA_API_KEY` — chiave nel cassetto pronta all'uso
2. **Fase POC Vision** (~4 ore): prototipo di auto-tagging foto su 20 immobili demo, valutare qualità output vs Gemini Vision
3. **Fase decisione**: se qualità ≥ Gemini e costo < Gemini → promuovere ad architettura ufficiale in M2.7 / M3.S8
4. **Fase produzione**: valutare se serve licenza AI Enterprise o se restiamo self-hosted con NIM container

### Domande aperte per il Founder
1. Vogliamo che OMNIA offra auto-tagging AI delle foto come **feature commerciale visibile** (differenziatore vs competitor) o come feature interna (miglior UX agente)?
2. In caso di uso produzione: preferiamo licenza AI Enterprise (SaaS pronto) o self-hosting NIM (sovranità dati per clienti enterprise/GDPR-sensibili)?
3. Timing: aspettiamo M5.S2 HAL Knowledge per attivarlo su embedding, o partiamo prima con la POC Vision?

### Stato
🟠 **DA APPROFONDIRE** — Founder ha confermato interesse (opzione "a" del 05-Feb-2026). Nessuna implementazione avviata, nessuna chiave ancora generata.

### Trigger di ripresa
- Definizione modulo M2.7 (post-Publishing Center) o M3.S8 (Property Enrichment)
- Avvio pianificazione M5.S2 HAL Knowledge (embedding RAG)
- Richiesta esplicita cliente enterprise di sovranità dati AI (self-hosted NIM)

---

## 🟠 A-003 — AI Creative Studio (Brand Analysis + Multi-format Generation + Editor Integrato)

**Data inserimento**: 20-Feb-2026
**Segnalato da**: Founder (Nicastro)
**Contesto**: Il Founder ha condiviso la specifica di un "AI Creative Studio" per agenzie immobiliari — evoluzione naturale del Marketing Autopilot già previsto nel pilastro D-045.

### 🎯 Cosa fa
Un modulo che permette a un'agenzia (o a un privato B2C su ImmobilCloud) di generare in automatico tutti i materiali marketing di una campagna partendo dal proprio sito web.

### 🧩 Le 3 componenti chiave

**1️⃣ Analisi del Brand automatica**
- Input: URL del sito web dell'agenzia
- L'AI estrae automaticamente:
  - 🎨 **Identità visiva** — palette colori, font, stile grafico
  - ✍️ **Tono di voce** — formale/informale, tecnico/emotivo, tagline ricorrenti
  - 🏷️ **Elementi brand** — logo, valori, target implicito

**2️⃣ Generazione Multiformato**
Da un singolo brief l'AI produce contemporaneamente:
- 📸 **Inserzioni pubblicitarie statiche** (Facebook Ads, Instagram Feed, Instagram Stories)
- 📱 **Post social media** (formato quadrato, verticale 9:16, carosello)
- ✉️ **Sequenze email** (welcome, nurturing, follow-up post-visita)
- 🎬 **Script video UGC** (User-Generated Content style, ottimizzati per TikTok/Reels)
- Ogni asset è ottimizzato per la piattaforma target (dimensioni, hook, CTA, copy length)

**3️⃣ Editor integrato**
- 🔀 **Browser proposte** — sfogliare varianti grafiche multiple per lo stesso brief
- 💬 **Chat di personalizzazione** — modificare hook, tagline, CTA via conversazione naturale con HAL
- ✂️ **Rifinitura pre-export** — micro-editing su testi, colori, immagini prima di scaricare/pubblicare

### 🏗️ Base già disponibile in OMNIA (precursore in casa)
Il **Brand Profile Extractor** (M2.S5 Layer D Phase 1, D-023) fa già il 60% del punto 1️⃣:
- `POST /api/app/website/extract-from-url` accetta un URL
- Usa BeautifulSoup + Gemini via Emergent LLM Key
- Restituisce: palette (4 hex), typography (family+scale), structure, voice (tone+tagline), logo_hint, confidence 0-100
- Persistito in `agency.website.extracted_profile`
- Testato su tecnocasa.it con confidence 95

Quando svilupperemo A-003 ripartiremo da QUESTO endpoint estendendolo, non da zero.

### 🎯 Modalità di consumo (D-041 White Label — 3 modalità obbligatorie)
- **UI OMNIA** — sezione "Studio Creativo" dentro CRM agenzia con wizard 3-step (Brand → Brief → Editor)
- **API v1 pubblica** — `POST /api/v1/creative/generate` con crediti (verosimilmente 10-25 per generazione full-set)
- **Widget embeddabile** — "Studio Creativo mini" per privati sul portale ImmobilCloud (generazione post social per l'annuncio del proprio immobile)

### 📄 No Paper (D-035) — implicito
Delivery 100% digitale: file scaricabili (PNG/MP4/PDF email), pubblicazione diretta su FB/IG/Telegram via M2.6c Social Publisher (quando pronto), zero output cartaceo.

### 🤖 Stack AI candidato (da valutare al momento dello sviluppo)
- **Estrazione brand**: Emergent LLM Key (Gemini) — già in uso
- **Copy generation** (annunci, post, email): Claude Sonnet via Emergent (miglior naming/tono in italiano)
- **Immagini/creativity**: 
  - Nano Banana (Gemini image gen) per varianti rapide
  - GPT Image 1 per output pubblicitario più curato
  - fal.ai (già in casa per Virtual Staging) per composizioni immobile+creativo
- **Script video UGC**: Claude per lo storyboard + Sora 2 per la generazione video (opzionale, alto costo)

### 🔗 Sinergie forti con moduli esistenti/pianificati
- 🧠 **HAL Copywriter** (M5.S1) — già scrive titolo/descrizione immobili → estenderlo a copy adv
- 🎨 **Virtual Staging** (M5.S4) — già genera visual immobili → riusare come "base immagine" per ads
- 📤 **M2.6c Social Publisher** — quando pronto, publish diretto dagli asset generati qui
- 🏢 **Multi-branch/Franchise** (M2.5.1) — asset con brand della singola filiale, non del gruppo (co-branding)
- 🤝 **Partner Web Agency** (D-046) — potente killer widget per la loro offerta ai clienti finali

### ⚠️ Contro / rischi da studiare
- **Costo compute alto** su generazione video (Sora 2 = €0,50-1,50/clip) → serve pricing "à la carte"
- **Qualità output pubblicitario** vs strumenti dedicati (Canva Magic Studio, AdCreative.ai) → dobbiamo essere "buoni abbastanza" non "i migliori", vantaggio è integrazione con il CRM immobiliare
- **Rights management immagini** — le foto dell'immobile sono dell'agenzia, ma se rigeneriamo con AI (stile, mix) chi le possiede? Serve TOS chiaro
- **AGCM/pubblicità comparativa** — attenzione a claim generati automaticamente ("il migliore", "il più", ecc.) che potrebbero violare regole pubblicità immobiliare

### Domande aperte per il Founder
1. Target primario: **agente professionista** (uso quotidiano nel CRM) o **privato B2C** (uso occasionale sul portale)? Cambia sostanzialmente le UX e il pricing.
2. Formato prioritario di lancio: **statici Facebook/Instagram** (più semplice, valore immediato) o **video UGC TikTok/Reels** (più wow, più costoso)?
3. Vogliamo pubblicare direttamente sui social (richiede token FB/IG dell'utente) o solo generare + scaricare per pubblicazione manuale?
4. Pricing: pay-per-generation (crediti) o piano mensile "creative studio" separato?

### Timing consigliato
**NON ora**. Prerequisiti tecnici e strategici:
- ✅ M2.5.4c Legal Templates (in coda)
- ✅ M2.5.5 Domain Vault (in coda)
- 🎯 **M2.6c Social Publisher** — auto-post FB/IG/Telegram (dà il canale di delivery)
- 🎯 **M5.S2 HAL Knowledge** — HAL deve conoscere la voice della singola agenzia via RAG
- Idealmente: dopo aver definito pricing v3 (unit economics stabili) e aver validato i primi 20 clienti Track A

### Stato
🟠 **DA APPROFONDIRE** — Founder ha esplicitamente chiesto di memorizzare per svilupparlo più avanti. Nessuna implementazione avviata.

### Trigger di ripresa
- Completamento M2.6c Social Publisher (dà il canale di distribuzione)
- Feedback dai primi clienti su carenza di materiale creativo
- Feedback da web agency partner interessate a rivendere il modulo
- Definizione pricing v3 con "creative credits" separati dal wallet API

---

<!-- Aggiungere qui nuovi aspetti da approfondire con progressivo A-004, A-005, ... -->

---

## A-004 — Landing `/it/agenzie` con demo widget live embeddati (24-Feb-2026)

### Contesto
Con la chiusura di Sprint 1.5 recovery (D-059) i 4 widget di M2.5.3 sono tutti live e serviti pubblicamente dal loader `/api/widgets/v1/loader.js`:
- Valuator (UNI 10750)
- Mortgages Compare
- Virtual Staging demo
- HAL Legal Q&A

Oggi il pubblico esterno non li vede: sono strumento tecnico per web agency partner Track B. La landing `/it/agenzie` (target: gestionali italiani legacy da aggredire con il pivot Doppio Binario) è oggi puramente **brochure/testuale**.

### Idea
Trasformare la landing da "brochure che racconta" a **demo interattiva che dimostra**: 4 widget embeddati dentro la pagina stessa via lo snippet 1-line ufficiale (dogfooding). Il visitatore Trackk B non deve immaginare cosa può integrare — lo tocca sulla pagina di vendita.

### Perché ha valore
- **Prova live** = conversione superiore rispetto a screenshot statici (pattern Stripe / Cal.com / Linear).
- **Dogfooding**: se il nostro widget non regge il carico sulla landing di vendita, la scopriamo prima del cliente.
- **SEO**: pagina interattiva riduce bounce rate, aumenta dwell time — segnali positivi per search.
- **Zero maintenance**: usa esattamente lo stesso loader.js dei partner, nessuna forkatura di codice.

### Elementi tecnici
- 4 sezioni della landing, ognuna con un widget embeddato via `<div data-widget="staging"><script src=".../loader.js" data-key="omk_demo_..."></script>`.
- API key dedicata `omk_demo_*` con **rate-limit stretto** (5 req/min per IP) e credit balance dedicato + eventualmente allowed_origins = solo `omniarealestateecosystem.it`.
- Copy affiancato ad ogni widget che descrive il caso d'uso.

### Vincoli / rischi
- **Zero brand mentions** dei competitor (vincolo assoluto Founder).
- **Abusi**: la landing è pubblica → serve rate-limit robusto per prevenire quota-exhaustion via demo.
- **AGCM / pubblicità immobiliare**: dimostrare Virtual Staging pubblicamente OK, ma la valuazione UNI 10750 sul widget demo deve avere disclaimer chiaro "valore orientativo" (già presente nel widget stesso).

### Timing consigliato
**Congelato fino a M6 chiuso (D-035)**. Nessun pre-launch commerciale prima dell'Academy. Riprendere dopo Sprint 4 (perf hardening) e prima del go-live commerciale.

### Stato
🟠 **DA APPROFONDIRE post-M6** — Idea generata dall'agente durante Sprint 1.5 recovery, memorizzata su richiesta del Founder ("memorizzalo e metti in coda al fine programma").

### Trigger di ripresa
- Chiusura M6 Omnia Academy (unlock pre-launch commerciale, D-035)
- Rilascio pubblico di `/it/agenzie` come landing di conversione Track B
- Sopravvivenza dei 4 widget a stress test 5 agenti paralleli (GAP #2 audit M2, Sprint 4)

---

## 🟠 A-005 — HAL Assist · supporto ticket con remediation guidata (e remote assist futuro)

**Data inserimento**: 06-Ago-2026
**Segnalato da**: Founder (Nicastro)
**Contesto**: Durante la stesura del Manuale Operativo (Cap. 7–9) e HAL Knowledge RAG, il Founder ha immaginato un upgrade futuro: **HAL sul gestionale conosce abbastanza prodotto/codice da intervenire quando un cliente apre un ticket** — idealmente con **autorizzazione esplicita del titolare**, in stile assistenza remota (AnyDesk / TeamViewer / co-browsing).

> **Nota di scope**: questa idea è **indipendente** da altri progetti esterni (es. repo open source di social listening). Resta **interna all'ecosistema OMNIA / ImmoWeb**.

### 🎯 Visione Founder (north star)
Dopo consenso del cliente, HAL **non solo spiega** ma **risolve** il problema (sync portali, compliance, configurazione, HAL reindex, ecc.) — riducendo carico L1/L2 umano e tempi di risoluzione.

### Cosa esiste già (base da non rifare)
| Modulo HAL attuale | Ruolo |
|--------------------|--------|
| **HAL Knowledge** | How-to utente (manuale YAML + GAP + doc interni) |
| **HAL Agent CRM** | Chat + tool CRM read-only + *Migliora con HAL* su annunci |
| **HAL Legal** | Q&A giuridico con citazioni (dominio separato) |

A-005 è un **quarto pilastro**: **HAL Assist** orientato a **ticket + remediation**, non sostituto degli altri.

### Architettura proposta (fasi — dalla più realistica alla più ambiziosa)

**Fase 1 — Ticket intelligence (MVP)** 🟢 fattibile
- Classificazione automatica ticket (Portali / Fascicolo / Billing / HAL / Import…)
- RAG su: manuale + GAP + CHANGELOG + DECISIONS + **playbook per categoria** (10–15 scenari ricorrenti)
- Output: diagnosi probabile + checklist verifica + bozza risposta al cliente
- Escalation umana sotto soglia confidence (allineato D-051)

**Fase 2 — Fix in-app con consenso** 🟢 fattibile (core OMNIA)
- Azioni **whitelist server-side** eseguibili solo dopo click *"Autorizzo HAL Assist"* del **titolare** (`agency_admin`)
- Esempi candidati: sync manuale portale, reindex HAL agenzia, reset flag compliance preview, riapertura wizard dominio
- **Audit log immutabile** (chi, quando, cosa, esito) — prerequisito legale

**Fase 3 — Guida in-app / co-browsing** 🟡 medio termine
- HAL evidenzia passi nell'UI ImmoWeb (tooltip, tour contestuale sul ticket)
- Opzionale: session replay / screen share **solo dentro l'app** (no desktop intero)
- Utente conferma ogni step sensibile

**Fase 4 — Supporto umano + HAL copilot** 🟡 medio termine
- Operatore OMNIA in sessione remota (AnyDesk/TeamViewer) **solo su escalation**
- HAL prepara diagnosi, script e monitora — **umano al mouse**, HAL in cuffia
- Durata limitata (es. 30 min), consenso scritto, registrazione opzionale

**Fase 5 — Remote unattended (HAL risolve da solo sul PC cliente)** 🔴 R&D / long-term
- Tecnologia emergente (*computer use*, vision + automazione desktop)
- **Non raccomandato** come target produzione B2B immobiliare nei prossimi 1–2 anni: GDPR, responsabilità civile, affidabilità click, variabilità PC cliente
- Per un CRM **cloud** la maggior parte dei fix **non richiede** accesso al desktop

### Corpus tecnico (cosa indicizzare — NON "tutto GitHub")
- ❌ Indicizzare l'intero repo grezzo → rumoroso, costoso, rischio allucinazioni
- ✅ Sottoinsieme curato:
  - Playbook ticket + messaggi errore HTTP (`detail=...`) mappati a cause
  - Router/moduli per area ad alto volume ticket (publishing, fascicolo, staging, billing, hal_knowledge)
  - GAP.md, DECISIONS.md, runbook operativi Founder
  - Test pytest come "specifica comportamentale" (estratti, non raw)

### Perché AnyDesk non è il primo passo
ImmoWeb è **SaaS browser-based**. I ticket tipici si risolvono **in cloud** (sync, compliance, crediti, permessi). AnyDesk serve solo per edge case locali (cache browser, antivirus, file Excel import sul PC) — **minoranza** del volume.

### ⚠️ Rischi / vincoli (da risolvere prima di promuovere a DECISIONS)
- **D-051 onestà**: HAL non deve promettere fix o UI inesistenti
- **Multi-tenant**: zero leak dati tra agenzie nel contesto ticket
- **GDPR / consenso**: remediation = trattamento dati; serve base giuridica + ToS + log
- **Responsabilità**: azioni su annunci/portali/prezzi → serve human-in-the-loop o whitelist stretta
- **Costo LLM**: ogni ticket con retrieval largo va budgettato (crediti supporto o piano Agency)
- **Manutenzione**: reindex corpus tecnico ad ogni release, altrimenti HAL "conosce il codice di ieri"

### Relazione con altri HAL (naming)
- Brand utente sempre **HAL** (mai "AL" nel prodotto/supporto)
- Proposta nome modulo: **HAL Assist** o **HAL Support**
- Distinto da HAL Knowledge (FAQ) e HAL Legal (normativa)

### Timing consigliato
**NON ora** — dopo:
- Manuale operativo ≥ **50%** (Cap. ~13+) o catalogo **15+ playbook ticket** ricorrenti osservati in preview/pilot
- Sistema ticket formalizzato in ImmoWeb (anche minimale: form + stato + assegnazione)
- HAL Knowledge stabile su corpus manuale (≥ 100 voci, smoke test routine)

**Ordine suggerito**: Fase 1 → Fase 2 → Fase 3/4 → valutare Fase 5 solo se volume supporto lo giustifica.

### Domande aperte per il Founder
1. Ticket system: **interno ImmoWeb** o integrazione esterna (Zendesk, Freshdesk, email)?
2. Chi può autorizzare remediation: **solo titolare** o anche agente senior?
3. Fix automatici ammessi in v1: quali 5 azioni whitelist sono accettabili legalmente?
4. Remote desktop: **mai**, **solo escalation umana**, o **pilota HAL+umano**?
5. Pricing: HAL Assist incluso in Agency o add-on support premium?

### Stato
🟠 **DA APPROFONDIRE** — Founder ha chiesto esplicitamente di annotare come possibile future upgrade (06-Ago-2026). Nessuna implementazione, nessuna decisione presa.

### Trigger di ripresa
- Primi **10+ ticket ricorrenti** catalogati con causa root nota
- Apertura canale supporto ufficiale (post-M6 o post-primi Founders)
- Manuale + GAP coprono moduli ad alto volume ticket (Portali, Fascicolo, Staging, Billing)
- Richiesta esplicita cliente Agency di SLA / assistenza proattiva
