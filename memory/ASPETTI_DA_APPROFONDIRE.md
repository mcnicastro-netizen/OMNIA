# 🔬 Aspetti da approfondire — OMNIA

> File di appoggio per **temi strategici/tecnici** che il Founder ha esplicitamente segnalato come "da rivedere più avanti", **senza essere ancora decisioni**. Ogni voce va promossa in `DECISIONS.md` o `ROADMAP.md` quando si decide di procedere.

**Ultimo aggiornamento**: 05 Febbraio 2026

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

<!-- Aggiungere qui nuovi aspetti da approfondire con progressivo A-003, A-004, ... -->
