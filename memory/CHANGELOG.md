# OMNIA — Changelog

## 2026-02-XX (Feb 2026, sera) — 📖 TASK C · Cap. 6 · Portali / Publishing (Manuale + HAL YAML)

**Tipo**: Feature docs — sesto capitolo del Manuale Operativo + reindex HAL.
**Fonte**: Founder Feb 2026 · Post-TASK B-ter approvato.

### Cosa è cambiato
- **Nuovo capitolo** `memory/manuale/06-portali-publishing.md` (~9 sottocapitoli, profondità coerente con Cap. 5): panoramica Publishing Center, catalogo 8 portali del `CATALOG_SEED`, attivazione (form credenziali AES-256-GCM), sync automatico daily 06:00 UTC + sync manuale, Compliance HARD (5 regole D.Lgs 192/2005 + AGCM) + SOFT (4 warning), aprire modale Compliance, Universal Portal Wizard (M2.6d, 4 step), feed XML pubblico, log audit trail, errori comuni.
- **Nuovo YAML HAL** `memory/manuale/hal/06-portali-publishing.yaml` con **12 voci** strutturate (portali.a-cosa-serve, catalogo-portali, attivare-portale, disattivare-portale, sync-manuale, sync-automatico, compliance-hard, compliance-soft, aprire-compliance, wizard-custom-portal, feed-pubblico, log-sync).
- **`memory/manuale/hal/hal-index.json` rigenerato**: v0.2-cap6, ora **68 voci totali** (Cap. 1-6), 6 source files con md5 aggiornati, stats per capitolo/modulo/livello.
- **Micro-fix Cap. 1 v1.0.3**: HAL Knowledge non è più "in arrivo" nel manuale — il corpus RAG è indicizzato e funzionante. Aggiornati sia `01-primo-accesso.md` (tour barra sinistra) sia `01-primo-accesso.yaml` (voce `primo-accesso.tour-barra-sinistra`).
- **`screenshots-index.md`**: aggiunta sezione Cap. 6 con 6 nuove righe placeholder (5 essenziali + 1 utile). Totale screenshot catalogati: **34** (28 pre + 6 nuovi).
- **`GAP.md`**: aggiunta Sezione E per Cap. 6 con verifica onestà 1:1 al codice (`CATALOG_SEED`, `sync_engine.py`, `compliance.py`, `PortalWizardPage.jsx`); aggiornata Sezione A (HAL Knowledge da 🔴 P0 → 🟢 attivo).

### Onestà documentale (regola D-051 · no brand mentions competitor)
- Catalogo v1 documentato = **8 portali reali** in `CATALOG_SEED` (Subito, Bakeca, Kijiji, Wikicasa, FB Marketplace, Google Business, Attico, Case24). Nulla di inventato.
- **Idealista / Immobiliare.it / Casa.it**: menzionati esplicitamente come "NON nel catalogo v1, continua a usarli col loro pannello" — no claim di integrazione futura non confermata.
- **api_push simulato**: FB Marketplace + Google Business Profile sono chiaramente documentati come "integrazione live in arrivo, per ora `simulated_push` nel log". Il manuale non lascia intendere pubblicazione reale.
- **feed_pull**: chiarito che OMNIA non chiama nulla, sono i portali a scaricare (allineato a `sync_engine.py:157-161`).
- **UI log sync**: documentato che oggi in dashboard c'è solo timestamp/counter ma non pannello dedicato — pannello logs "in arrivo" (endpoint `GET /connections/{id}/logs` esiste ma no UI).

### Verifiche post-scrittura (istruzioni operative — NON eseguite in prod)
Il main agent NON esegue reindex né test live in questo commit. Istruzioni per l'operatore Founder dopo il push:
1. **Reindex forzato HAL**: `POST /api/app/hal/knowledge/reindex` con body `{"force": true}` (super_admin).
2. **3 query smoke test attese**:
   - *"Come attivo Subito.it?"* → top-1 atteso `06-portali-publishing.yaml::portali.attivare-portale`
   - *"Perché un annuncio è bloccato dalla compliance?"* → top-1 atteso `06-portali-publishing.yaml::portali.compliance-hard`
   - *"Come forzo un sync manuale su un portale?"* → top-1 atteso `06-portali-publishing.yaml::portali.sync-manuale`
3. Confidence attesa ≥ 0.15 su tutte e 3 (similarity range simile a Cap. 5).

### File modificati
- `memory/manuale/06-portali-publishing.md` (nuovo, +240 righe)
- `memory/manuale/hal/06-portali-publishing.yaml` (nuovo, +450 righe, 12 voci)
- `memory/manuale/hal/hal-index.json` (rigenerato, v0.2-cap6, 68 voci)
- `memory/manuale/hal/screenshots-index.md` (+ sezione Cap. 6 con 6 righe)
- `memory/manuale/01-primo-accesso.md` (v1.0.3 — HAL Knowledge fix)
- `memory/manuale/hal/01-primo-accesso.yaml` (v1.0.3 — voce tour-barra-sinistra)
- `memory/GAP.md` (aggiunta Sezione E Cap. 6 + aggiornamento Sezione A)
- `memory/CHANGELOG.md` (questo entry)

### Prossimi passi
- Cap. 7 · Match / o modulo successivo secondo indice (`memory/manuale/PIANO.md` da consultare)
- (Rimandato) TASK D · Screenshot kit reali
- (Backlog) B2C Checkout Stripe one-shot

**Progresso manuale**: 6/26 capitoli (23%). Totale voci HAL: **68**.

---

## 2026-08-06 (notte) — 🧹 TASK B-ter · HAL corpus cleanup (Opzione 1)

**Tipo**: Fix retrieval — rimozione file rumoroso dal corpus TF-IDF.
**Fonte**: Founder 6 Ago 2026 · Post-TASK B-bis test live.

### Cosa è cambiato
- **`hal_knowledge.py`**: rimosso `CHANGELOG.md` da `CORPUS_FILES`. Aggiunto commento inline che spiega il motivo (feedback loop dovuto a query test documentate nel CHANGELOG stesso).

### Motivo
Nel test live post-TASK B-bis, il top-1 di **tutte le 5 query** era `CHANGELOG.md::Query test cold start` — il CHANGELOG conteneva letteralmente le stesse query documentate come esempi, creando un feedback loop che disturbava le citazioni fonti (Gemini generava risposte corrette ma citava il changelog invece del manuale).

### Verifiche live (preview URL)
Eseguito su `https://omnia-real-estate-1.preview.emergentagent.com`:

1. **Purge chunk orfani** `CHANGELOG.md`: 137 chunk eliminati dal DB.
2. **Reindex** `force=true`: 17 file scanned (era 18), **472 chunks** totali, **56/56 YAML manuale**.
3. **5 query test rieseguite** — RISULTATO:

| Q | Top-1 (post-cleanup) | Sim | Conf | Top-1 OK? |
|:-:|-----|:-:|:-:|:-:|
| 1 | `PROGRAMMA_OMNIA.md::M2.S3.5 ✅ — Link Property↔Seller` | 0.259 | high | ✅ |
| 2 | **`03-immobili.yaml::Immobili`** 📚 | 0.241 | high | ✅ |
| 3 | **`04-clienti.yaml::Clienti`** 📚 | 0.189 | medium | ✅ |
| 4 | **`05-match.yaml::Match`** 📚 | 0.277 | high | ✅ |
| 5 | **`04-clienti.yaml::Clienti`** 📚 | 0.249 | high | ✅ |

- ✅ **0/5 top-1 = CHANGELOG** (target: 0/5) — feedback loop **eliminato**.
- ✅ **4/5 top-1 = chunk YAML manuale** (Q1 va su PROGRAMMA_OMNIA, comunque fonte legittima).
- ✅ **4/5 confidence ≥ 0.20 HIGH** (Q3 scende leggermente sotto in medium 0.189, ma comunque valida — non insufficient).
- ✅ **0/5 insufficient_context**.

### File modificati
```
♻️ backend/apps/immoweb/hal_knowledge.py       (rimosso CHANGELOG.md + commento)
♻️ memory/GAP.md                               (voce HAL Knowledge v0.3 - corpus cleanup)
♻️ memory/CHANGELOG.md                         (questo entry — che paradossalmente non è più nel corpus)
```

### Commit message
```
chore(hal-knowledge): exclude CHANGELOG from RAG corpus

Post-live-test finding: CHANGELOG.md contains query test examples
that create a TF-IDF feedback loop, forcing top-1 hits to point to
"Query test cold start" section instead of the manual's YAML chunks.

Fix:
- Remove CHANGELOG.md from CORPUS_FILES in hal_knowledge.py

Verified on preview (after purge + reindex force=true):
- 0/5 top-1 = CHANGELOG (target 0/5) - loop resolved
- 4/5 top-1 = manual YAML chunks (Q1 goes to PROGRAMMA_OMNIA, legit)
- 4/5 confidence >= 0.20 HIGH
- 0/5 insufficient_context
- total chunks: 472 (was 609 including CHANGELOG noise)
- manual_hal_indexed still 56
```

### Prossimo (attende Founder)
- Verifica risposte HAL live via UI — le citazioni dovrebbero puntare al manuale
- Se retrieval ancora migliorabile → TASK B-quater con Opzione 2 (boost YAML +0.15)
- Oppure: TASK C · Cap. 6 · Portali/Publishing

---

## 2026-08-06 (sera) — 🚀 TASK B-bis · HAL Knowledge ingest reale (Opzione A ATTIVA)

**Tipo**: Attivazione motore RAG sulle 56 voci YAML del manuale (Cap. 1-5).
**Fonte**: Founder 6 Ago 2026 (post TASK B) · Applica Opzione A di `IMPORT_HAL.md`.

### Cosa è stato costruito

#### Modifiche a `backend/apps/immoweb/hal_knowledge.py`
- **Import**: aggiunto `yaml` e `Union` per `chunk_id` polymorphic type.
- **Model `KnowledgeChunk`**: `chunk_id: Union[int, str]` (int per .md sequenziale, string stabile per voci YAML).
- **Costante nuova**: `HAL_YAML_DIR = MEMORY_ROOT / "manuale" / "hal"`.
- **Helper nuovo** `_render_voce_hal(v)`: serializza una voce HAL YAML in testo indicizzabile con schema `[TITOLO] [MODULO] [DOMANDA] [A COSA SERVE] [QUANDO SI USA] [PASSI] [ERRORI COMUNI] [PERMESSI] [TAGS]` come da `IMPORT_HAL.md`.
- **Helper nuovo** `_chunk_yaml_hal_file(file_name, raw_bytes)`: 1 voce = 1 chunk atomico; `chunk_id = v["id"]` (stringa stabile); metadata (id, modulo, livello, tags, correlati, domanda_naturale); `md5_source` = MD5 del file YAML.
- **Helper nuovo** `_list_hal_yaml_files()`: elenca i `.yaml` del manuale escludendo `hal-index*`.
- **`ingest_corpus(force=False)` esteso**: dopo il loop `.md`, esegue loop `.yaml` con stessa logica di idempotenza (skip se `md5_source` invariato · `force=True` per reindex completo).
- **Fix collaterale**: rimosso `MANUAL_DIR.glob("*.md")` dal path unico in `_list_corpus_files` per evitare doppio-caricamento; i `.yaml` restano gestiti dal nuovo helper dedicato.

#### Validazione in sandbox — reindex forzato
Eseguito `ingest_corpus(force=True)`:
- **Scanned**: 18 file (13 `.md` + 5 `.yaml`)
- **Total chunks**: **617** (561 markdown + 56 YAML atomici)
- **manual_hal_indexed = 56** (target raggiunto)
- Nessun errore, ingest idempotente (secondo run = 0 reingested).

#### 5 Query test — TUTTI CRITERI PASS ✅

| # | Query | Voce attesa | Top-3 match | Similarity | Conf ≥0.20 |
|---|-------|-------------|:-:|:-:|:-:|
| 1 | *Come cancello un cliente che ha immobili in carico?* | `clienti.archiviare-eliminare` | ✅ (pos 3) | 0.299 | ✅ |
| 2 | *Cosa vede un anonimo di un immobile marcato L3?* | `immobili.privacy-4-livelli-cosa-sono` | ✅ (pos 2) | 0.393 | ✅ |
| 3 | *Perché un cliente è marcato ROVENTE?* | `match.scala-temperature` / `clienti.temperatura-lead-scoring` | ✅ (pos 2 e 3) | 0.379 | ✅ |
| 4 | *Perché la pagina Match è vuota?* | `match.zero-match` | ✅ (pos 2) | 0.339 | ✅ |
| 5 | *Ho un file Excel disordinato del vecchio CRM, come lo importo?* | `clienti.smart-import-ai` | ✅ (pos 2) | 0.359 | ✅ |

**Criteri accettazione**:
- ✅ **5/5 top-3** (obiettivo era 5/5)
- ✅ **5/5 confidence ≥0.20** (obiettivo era ≥4/5)
- ✅ **0/5 insufficient_context** (obiettivo era 0/5)

**Osservazione tecnica**: il top-1 in tutte le query è sempre un chunk generalista da PRD/ROADMAP (chunk_id `4`) con similarity 0.30-0.39. Il chunk atomico HAL della voce specifica arriva al **2° o 3° posto** con similarity 0.15-0.27. Il retrieval passa tutti i top-K nel prompt di generation, quindi Gemini riceve sia il contesto generale sia la voce puntuale — comportamento atteso e non degradante.

### File modificati (per commit su GitHub)
```
♻️ backend/apps/immoweb/hal_knowledge.py       (+95 righe: yaml loader + helper + Union type)
♻️ memory/GAP.md                               (voce HAL Knowledge v0.2 ATTIVO)
♻️ memory/CHANGELOG.md                         (questo entry)
```

### Post-implementazione — istruzioni per produzione
Per attivare in prod dopo il push:
```
POST /api/app/hal/knowledge/reindex   (auth: super_admin)
  Body: {"force": true}
```
Risultato atteso in `/api/app/hal/knowledge/status`:
- `manual_hal_indexed: 56`
- Banner UI `hal-manual-indexing-banner` sparisce automaticamente.

### Commit message consigliato
```
feat(hal-knowledge): activate manual YAML ingest (Opzione A)

hal_knowledge.py:
- Add _render_voce_hal(v) helper (chunk text schema from IMPORT_HAL.md)
- Add _chunk_yaml_hal_file() for atomic 1-voce-per-chunk ingest
- Extend ingest_corpus() with YAML loop after .md loop
- KnowledgeChunk.chunk_id typed as Union[int, str] (int for md, str stable id for YAML)
- Idempotent: same md5 -> skip; force=true -> full reindex

Validation (sandbox reindex force=true):
- 56/56 voci indexed as atomic chunks
- 5/5 query test PASS (top-3 match)
- 5/5 confidence >= 0.20 (target was >=4/5)
- 0/5 insufficient_context

Prod activation: POST /api/app/hal/knowledge/reindex {force: true}
Banner UI "corpus manuale in indicizzazione" scompare automaticamente
quando manual_hal_indexed > 0 in /status.
```

### Non toccato in questo TASK
- TF-IDF vectorizer (invariato — D-061)
- Modello Gemini generation (invariato)
- Chunk strategy per .md (invariata)
- Nessuna nuova dipendenza LLM/embedding

### Prossimo (attende Founder)
- Eseguire reindex prod (super_admin)
- Verificare 5 query in UI live e la scomparsa del banner
- Poi opzioni: TASK C (Cap. 6 · Portali/Publishing) OR verifiche aggiuntive

---

## 2026-08-06 (pomeriggio) — 🧠 TASK B · HAL Knowledge v0 cold start

**Tipo**: Cold start RAG su manuale Cap. 1-5 (56 voci HAL YAML).
**Fonte**: Founder 6 Ago 2026 · Prossimo passo dopo TASK A-bis.

### Cosa è stato costruito

#### Deliverable 1 — `memory/manuale/hal/hal-index.json` (nuovo)
Catalogo statico di **56 voci HAL** con metadati per lookup rapido:
- `id`, `titolo`, `modulo`, `capitolo`, `source_file`
- `pubblico`, `livello`, `tags`, `correlati`, `domanda_naturale`
- `screenshot[]`, `counts` (passi + errori_comuni), `content_md5`
- Stats globali: per capitolo (10/8/15/12/11) · per livello (base 41 · intermedio 15) · per pubblico (titolare 56 · agente 51 · segreteria 45) · 120 tag unici · 135 correlati
- Fingerprint per invalidazione cache: `md5` per file sorgente + `content_md5` per voce
- Size: 47 KB

#### Deliverable 2 — `memory/manuale/hal/IMPORT_HAL.md` (nuovo)
Documento operativo per l'indicizzazione:
- Strategia chunk = **1 voce YAML atomica** (nessun re-split arbitrario)
- Struttura testo chunk (`[TITOLO]`, `[DOMANDA]`, `[PASSI]`, `[ERRORI COMUNI]`, ecc.)
- Metadati preservati per filtering/boosting
- 2 opzioni implementative (A: integrata in `hal_knowledge.py` · B: script standalone). Raccomandata Opzione A.
- Contesto tecnico: TF-IDF + cosine (D-061, no LLM cost per embedding)
- **5 query test** documentate con voce attesa e confidence minima
- Criteri accettazione cold start v0.1 (5/5 top-3, 4/5 confidence ≥0.20)

#### Deliverable 3 — Banner "corpus manuale in indicizzazione"
- Frontend `HalKnowledgePage.jsx`: banner ambra data-testid `hal-manual-indexing-banner` mostrato quando `status.manual_hal_indexed === 0`.
- Backend `hal_knowledge.py`: aggiunto campo `manual_hal_indexed` in `GET /status` (count di chunk con `file` che finisce in `.yaml`).
- Il banner scompare automaticamente non appena l'ingestion delle voci YAML è completata.

#### Query test cold start (5 documentate)
1. *"Come cancello un cliente che ha immobili in carico?"* → `clienti.archiviare-eliminare`
2. *"Cosa vede un anonimo di un immobile marcato L3?"* → `immobili.privacy-4-livelli-cosa-sono`
3. *"Perché un cliente è marcato ROVENTE?"* → `match.scala-temperature`
4. *"Perché la pagina Match è vuota?"* → `match.zero-match`
5. *"Ho un file Excel disordinato del vecchio CRM, come lo importo?"* → `clienti.smart-import-ai`

### File modificati (per commit su GitHub)
```
✨ NEW    memory/manuale/hal/hal-index.json       (56 voci · 47 KB)
✨ NEW    memory/manuale/hal/IMPORT_HAL.md        (guida operativa + 5 query test)
♻️ MOD    backend/apps/immoweb/hal_knowledge.py   (+3 righe: manual_hal_indexed in /status)
♻️ MOD    frontend/src/apps/immoweb/pages/HalKnowledgePage.jsx  (+9 righe: banner "in indicizzazione")
♻️ MOD    memory/GAP.md                          (voce HAL Knowledge v0.1 in Sezione E)
♻️ MOD    memory/CHANGELOG.md                    (questo entry)
```

### Commit message consigliato
```
feat(hal-knowledge): cold start v0.1 — index + docs + banner

Deliverable:
- memory/manuale/hal/hal-index.json (56 voci Cap. 1-5, metadati + MD5)
- memory/manuale/hal/IMPORT_HAL.md (guida chunk-strategy + 5 query test)

Backend:
- hal_knowledge.py: /status ora espone manual_hal_indexed (chunk YAML count)

Frontend:
- HalKnowledgePage.jsx: banner "corpus manuale in indicizzazione"
  visibile fino al primo ingest delle 56 voci YAML

Non incluso in questo commit (arriva con il ingest reale):
- Loader YAML dentro ingest_corpus() (Opzione A documentata in IMPORT_HAL.md)
- Reindex prod + validazione 5 query test
```

### Note operative
- **Nessun costo LLM speso** in questo TASK B (solo generazione index e docs).
- **Nessuna modifica al motore TF-IDF** esistente (D-061 confermato).
- Il vero ingest delle 56 voci si attiva quando il Founder darà OK per applicare l'Opzione A documentata (piccolo add-on `~30 righe` in `ingest_corpus`).

### Prossimo (attende approvazione Founder)
- Implementare Opzione A (loader YAML in `ingest_corpus`)
- Eseguire reindex e verificare 5 query test
- Oppure: proseguire con TASK C · Cap. 6 · Portali/Publishing

---

## 2026-08-06 — 🟢 TASK A-bis · Pricing B2C (ImmobilCloud privati)

**Tipo**: Nuovo listino B2C separato + stub backend prodotti one-shot.
**Fonte**: Founder 6 Agosto 2026 · Rail SEPARATO da B2B (crediti restano solo agenzie).

### Cosa è stato costruito

#### Nuovo listino ImmobilCloud B2C
- **Rail** = Stripe carta one-shot. Zero crediti. Zero pacchetti minimi.
- **Annunci privati** (ripristinati da v2.0 archivio git):
  - 2 annunci attivi GRATIS
  - Extra 90gg: €14,90 · Nascondi indirizzo: €5,90 · Foto extra pack 10: €3,90
  - Premium >€1M / Affitti alti: €19,90
  - Boost: Premium 30/90/180gg = €19,90/49,90/89,90 · TOP 30/90/180gg = €29,90/79,90/149,90
- **Strumenti self-service `/cloud`**:
  - **Valutatore base**: GRATIS 1×/12 mesi con email verificata (lead magnet)
  - **Valutatore UNI 10750 + PDF**: **€2,99** (retail 5× vs B2B €0,60)
  - **Comparatore mutui**: GRATIS illimitato (lead magnet → mediatore)
  - **Virtual Staging**: €0,90/foto max 3 per annuncio UGC
  - **HAL Legal**: €1,00/query con disclaimer obbligatorio
  - 🔒 **Visura catastale**: "in arrivo" — non implementare checkout
  - 🔒 **Planimetria catastale**: "in arrivo" — non implementare checkout (margine 20% troppo basso, validare fase 2)

#### Regole operative documentate
- ❌ **Nessun servizio B2C sotto €0,99** (tranne lead magnet espliciti gratuiti)
- ❌ **Esclusi dal B2C**: crediti, pacchetti ricarica, widget & API mensili, multiposting, CRM, Match, MLS
- ✅ **Anti-abuso**: email verify + cap annuali per lead magnet, rate limit 20 query/ora per IP su HAL Legal

#### Documentazione margini (interno)
Sezione dedicata in `PRICING_B2C.md` con costi vivi + Stripe fees ~1,4% + €0,25:
- UNI 10750: €2,99 → **€2,55 netto (85%)**
- HAL Legal: €1,00 → **€0,70 netto (70%)**
- Virtual Staging: €0,90 → **€0,58 netto (65%)** ⚠️ borderline (funnel verso agenzia)

#### Backend stub
- ✨ NEW `backend/apps/billing/b2c_products.py` (156 righe):
  - `B2C_ONE_SHOT_PRODUCTS` (3 prodotti attivi con `stripe_lookup_key`)
  - `B2C_FREE_LEAD_MAGNETS` (2 gratuiti documentati)
  - `B2C_COMING_SOON` (2 in arrivo: visura, planimetria — con `cost_ref_eur` per traccia)
  - Helper: `get_b2c_product()`, `is_b2c_free()`, `is_b2c_coming_soon()`
- 🚫 **Checkout Stripe B2C one-shot** NON implementato in questo sprint (endpoint `POST /api/billing/b2c/checkout` da fare nello sprint successivo)

#### File modificati
- ✨ NEW `memory/PRICING_B2C.md` (v1.0 · 7 sezioni · 220+ righe)
- ✨ NEW `backend/apps/billing/b2c_products.py` (stub 156 righe)
- ♻️ MOD `memory/PRICING_OMNIA.md` (v3.0 → titolo "B2B agenzie" + cross-link a PRICING_B2C.md)
- ♻️ MOD `memory/GAP.md` (voce Pricing B2C 6-Ago-2026 in Sezione E)
- ♻️ MOD `memory/CHANGELOG.md` (questo entry)

### Commit message consigliato
```
feat(pricing): B2C catalog v1.0 + stub b2c_products

Docs:
- memory/PRICING_B2C.md v1.0 (ImmobilCloud privati)
  - Annunci privati: 2 gratis, extra 14.90, Premium/TOP 30/90/180gg
  - Strumenti self-service: UNI+PDF 2.99, staging 0.90, HAL Legal 1.00
  - Lead magnet gratuiti: Valuator base 1×/12m, Mortgage compare
  - Coming soon: visura, planimetria (fase 2)
- PRICING_OMNIA.md v3.0 -> titolo "B2B agenzie" + cross-link a B2C

Backend:
- b2c_products.py stub (products, free lead magnets, coming soon)
- Checkout Stripe B2C one-shot: sprint successivo

Docs collaterali:
- GAP.md: voce Pricing B2C 6-Ago-2026
- CHANGELOG.md: TASK A-bis
```

### Prossimo (a discrezione Founder)
- TASK B · HAL Knowledge v0 (cold start RAG su 56 voci) — attende "vai"

---

## 2026-08-05 (micro-fix) — 🩹 Pricing valuator crediti

**Tipo**: Micro-fix listino post-TASK A (richiesta Founder subito dopo push).

### Cosa è cambiato
- `valuator_base`: **20 → 6 crediti** (€1,00 → **€0,30**)
- `valuator_uni_pdf`: **40 → 12 crediti** (€2,00 → **€0,60**)

Motivo: allineare il valutatore alla logica "strumento di acquisizione mandato" — deve costare pochissimo per essere usato con generosità dagli agenti in fase di acquisizione.

### File modificati
```
♻️ backend/apps/billing/plans.py           (CREDIT_COSTS: valuator 6 / valuator_uni 12)
♻️ memory/PRICING_OMNIA.md                 (tabella consumo riordinata per crediti crescenti)
♻️ memory/CHANGELOG.md                     (questo entry)
```

### Verifiche
- Pytest billing 10/10 ✅
- API `/api/billing/plans`: valuator_base=6 (€0,30), valuator_uni_pdf=12 (€0,60) ✅
- Nessun cambio Stripe catalog (i consumi crediti sono lato server, non prezzi Stripe)

### Commit message consigliato
```
fix(pricing): valuator credits — base 6cr (€0,30), UNI+PDF 12cr (€0,60)

Valuator è strumento di acquisizione mandato: deve essere economico
per essere usato senza remore in fase di acquisizione.
Founder decision post-TASK A push.
```

---

## 2026-08-05 — 🟢 TASK A · Pricing Sync (Listino Founder ufficiale)

**Tipo**: Aggiornamento listino ufficiale + rigenerazione catalog Stripe sandbox.
**Fonte**: Founder 5 Agosto 2026 · Sovrascrive PRICING_OMNIA v2.0 (bozza)

### Cosa è stato costruito

#### Nuovo listino Founders 12 mesi
- **Starter** €49/mese · **Pro** €99/mese · **Agency** €249/mese
- Crediti inclusi/mese: **120 · 1.200 · 3.600**
- Max utenti: **3 · 10 · illimitati**
- Max immobili: **30 · 200 · illimitati**
- **Multiposting standard + Portal Wizard custom su tutti i piani** (D-041)

#### Listino Standard (dopo 12 mesi Founders)
- Starter €79 · Pro €179 · Agency €349

#### Pacchetti crediti (ratio fisso 20 cr/€)
- Mini €20→400 · Small €50→1.000 · Standard €100→2.000
- Plus €250→5.000 · Power €500→10.000 · Enterprise €1.000→20.000

#### Consumo crediti (valore 1 credito = €0,05)
- SMS 4 · HAL Agents 4 · HAL Legal 12 · Virtual Staging 18
- Valuator base 20 · Visura catastale 24 · Valuator UNI+PDF 40
- APE search 60 · Micro-tour video 60
- TOP 400 · Premium 1.000 · In Evidenza 2.000
- **RIMOSSI**: planimetria catastale, ispezione ipotecaria (margini troppo bassi in v1)

#### Sincronizzazione tecnica
- ♻️ MOD `backend/apps/billing/plans.py` — riscritto (LAUNCH_PLANS + POST_TRACTION_PLANS + CREDIT_PACKAGES + CREDIT_COSTS + nuovo campo `credits_included_monthly`)
- ✅ **Catalog Stripe sandbox rigenerato** con `python -m apps.billing.setup_stripe`:
  - 4 Product+Price abbonamenti (starter/pro/agency/enterprise × monthly+yearly)
  - 6 Product+Price pacchetti crediti (pkg_400/1000/2000/5000/10000/20000)
  - Vecchi prezzi disattivati (idempotenza garantita)
- ✅ API `/api/billing/plans` verificata: risponde con listino corretto + credits_included_monthly

#### Documentazione
- ♻️ RESCRITTO `memory/PRICING_OMNIA.md` v3.0 (listino ufficiale, sostituisce v2.0)
  - Filosofia (7 regole), tabelle Founders/Standard, sistema crediti, break-even aggiornato, trigger operativi, sincronizzazione tecnica, storico versioni.
- ♻️ MOD `memory/CHANGELOG.md` (questo entry)
- ♻️ MOD `memory/PRD.md` (status update)
- ♻️ MOD `memory/ROADMAP.md` (task A ✅)

### Note importanti
- **Enterprise resta nel catalogo** con prezzi legacy (€299/2990) per non rompere il modello dati — posizionamento e Custom API pricing rivisti in sessione dedicata.
- **Break-even aggiornato**: 10 agency mix realistico → ≈€250 margine netto/mese (era break-even). 50 Founders pieno → ~€48k/anno (era ~€29k con listino €39/99/249).

### File modificati (per commit su GitHub)
```
♻️ backend/apps/billing/plans.py           (listino sync)
✨ memory/PRICING_OMNIA.md                 (v3.0 riscrittura completa)
♻️ memory/CHANGELOG.md                     (questo entry)
♻️ memory/PRD.md                            (status update)
♻️ memory/ROADMAP.md                        (task A ✅)
```

**Commit message suggerito**:
```
feat(pricing): sync to Founder catalog 5-Aug-2026

- Founders 12m: Starter €49, Pro €99, Agency €249
- Standard: €79/179/349 · Credits included: 120/1200/3600
- Credit packages: 6 tiers, fixed 20 cr/€ ratio
- Credit costs: staging 18, legal 12, visura 24 (planim/ipoteca removed)
- Regenerate Stripe sandbox catalog (idempotent)
- Rewrite memory/PRICING_OMNIA.md v3.0
```

### Prossimi task
- TASK B: HAL Knowledge v0 cold start su 56 voci (5 capitoli manuale)
- TASK C: Cap. 6 · Portali/Publishing

---

## 2026-02-27 (notte) — 🟢 Manuale Cap. 5 · Match + 3 fix v1.0.1 su Cap. 4

**Tipo**: Documentazione manuale utente (Fase 2, iterazione 3) + fix redazionali basati su verifica codice.

### Cosa è stato costruito

#### 3 Fix Cap. 4 · Clienti v1.0.1
Verificati direttamente sul backend prima della correzione:
- **Bucket Venditori** — codice `clients_smart.py`: filtro è `client_type not in SEARCHER_TYPES`, quindi contiene tutti i clienti Venditore/Proprietario/Investitore **indipendentemente** da immobili collegati. Corretto errore precedente ("con almeno un immobile collegato").
- **Delete client con immobili collegati** — codice `clients.py:135-180`: il backend risponde 409 con detail *"client_has_linked_properties"*. Nel manuale documentato che il sistema **blocca l'eliminazione** e richiede riassegnazione/rimozione preventiva dai singoli immobili.
- **Visibilità agente** — codice `clients.py:29-75`: `list_clients` filtra solo per `agency_id`. Corretto: **tutti (titolare/agente/segreteria) vedono l'intera anagrafica clienti dell'agenzia**. Il campo *"agente assegnato"* serve per statistiche, non per limitare la vista.

Fix applicati sia a `04-clienti.md` che a `hal/04-clienti.yaml` (nuova voce di errore comune sull'eliminazione bloccata + 2 passi aggiuntivi).

#### Cap. 5 · Match (11 voci HAL)
- **11 sottocapitoli** (`/app/memory/manuale/05-match.md`, ~350 righe):
  - 5.1 Come funziona il motore (compatibilità, non previsione)
  - 5.2 Scala temperature: 🔥 **85-100** · 🌶️ **65-84** · ☀️ **40-64** · ❄️ **<40** (soglie verificate dal codice `lead_scoring.py` — 85/65/40)
  - 5.3 **I 14 criteri di scoring con pesi esatti dal codice `matching.py`**: Prezzo 17 · Operazione 14 · Città 12 · Tipologia 11 · Superficie 7 · Features 6 · Zona 5 · Locali 5 · Camere 4 · Bagni 4 · Condizione 4 · Energia 4 · Multimedia 4 · Piano 3 = **100**
  - 5.4 Pagina Match e filtro Score min (40+/50+/65+/85+ verificati da `MatchesPage.jsx`, default 50)
  - 5.5 Match per immobile ("chi vuole questo?")
  - 5.6 Match per cliente ("cosa gli consiglio?")
  - 5.7 Lead Scoring AI (differenza dal deterministic, costo crediti Emergent LLM)
  - 5.8 Filtri e ricerca
  - 5.9 Workflow operativo "giornata tipo" con power hour ROVENTI 09:00-09:30 + regola 80/20
  - 5.10 Zero match troubleshooting (checklist 5 punti)
  - 5.11 Errori comuni
- **11 voci HAL YAML** validate in `/app/memory/manuale/hal/05-match.yaml` (~430 righe): `come-funziona`, `scala-temperature`, `14-criteri`, `lista-e-filtro`, `breakdown-dettaglio`, `match-per-immobile`, `match-per-cliente`, `lead-scoring-ai`, `workflow-giornata`, `zero-match`, `ricalcolo-manuale`.
- Operazione incompatibile documentata come **score 0 secco** (hard incompatibility).

#### Screenshots Index aggiornato
- 5 nuovi screenshot Cap. 5 (`cap5-matches-lista`, `temperature-legenda`, `scoring-breakdown`, `lista-filtri`, `lead-scoring-ai`).
- **Totale index: 28 placeholder screenshot** (Cap. 1: 8, Cap. 2: 2, Cap. 3: 7, Cap. 4: 6, Cap. 5: 5).

### File creati/modificati
- ✨ NEW `/app/memory/manuale/05-match.md` (~350 righe)
- ✨ NEW `/app/memory/manuale/hal/05-match.yaml` (11 voci, ~430 righe)
- ♻️ MOD `/app/memory/manuale/04-clienti.md` (3 fix)
- ♻️ MOD `/app/memory/manuale/hal/04-clienti.yaml` (3 fix)
- ♻️ MOD `/app/memory/manuale/hal/screenshots-index.md` (Cap. 5 sezione, +5 screenshot)

### Numeri aggiornati
- **56 voci HAL** validate su 5 capitoli (di 26 previsti — **19% del manuale**)
- **28 screenshot** placeholder catalogati
- **5/26 capitoli** completi

### Prossime decisioni Founder
- **A**: Approvare Cap. 5 e procedere con cold start HAL Knowledge (RAG su 56 voci — verifica pipeline embeddings + retrieval + test query semantiche)
- **B**: Approvare Cap. 5 e proseguire con Cap. 6 · Fascicolo (dedicato)
- Raccomandazione: opzione A prima di ingoiare tutti i 26 capitoli in un colpo solo.

---

## 2026-02-27 (sera) — 🟢 Manuale Cap. 4 · Clienti + fix v1.0.1/v1.0.2 + GAP.md formale

**Tipo**: Documentazione manuale utente (Fase 2 iterazione) + fix redazionali.

### Cosa è stato costruito

#### 3 Fix applicati sui capitoli già consegnati
- **Cap. 3 · Immobili v1.0.1** — L4 privacy: rimosso "e le agenzie in rete" da tabella matrice + descrizione + voce HAL `privacy-4-livelli-cosa-sono`. Ora L4 = "solo tu e il tuo team di agenzia" (allineato al fatto che MLS network M4 non è ancora implementato).
- **Cap. 1 · Primo Accesso v1.0.2** — rimossa dicitura "attività recenti" dalla tabella Tour barra sinistra e dalla voce HAL `tour-barra-sinistra`. Sostituita con l'elenco dei 6 numeri chiave reali della Dashboard.
- **`/app/memory/GAP.md`** creato (119 righe, 6 sezioni): A funzioni backend senza UI · B moduli deprecati/transizione · C duplicati da consolidare · D roba da NON documentare · E gap intercettati per capitolo · F azioni prossime + regole di contributo per il prossimo agente.

#### Cap. 4 · Clienti (12 voci HAL)
- **7 sottocapitoli** (`/app/memory/manuale/04-clienti.md`, ~360 righe):
  - 4.1 Anagrafica: 5 tipi cliente (Acquirente/Venditore/Affittuario/Proprietario/Investitore), 7 stati CRM (Nuovo → Contattato → Qualificato → Trattativa → Chiuso vinto/perso → Archiviato), consenso GDPR.
  - 4.2 Preferenze di ricerca: 14 campi con regola "meglio 3 chiari che 10 vaghi".
  - 4.3 Import CSV con template (separatore `;`, UTF-8, preview 5 righe).
  - 4.4 Smart Import AI: formati `.csv .xlsx .vcf .txt`, max 5 MB, 500 righe, powered by Gemini (verificato in `clients_ai_import.py`).
  - 4.5 Collegamento property-seller: 2 flussi (dal form immobile + dalla scheda cliente).
  - 4.6 Smart Sorting + Lead Scoring intro: bucket Roventi 🔥 / Caldi 🌶️ / Tiepidi ☀️ / Freddi ❄️, badge "⚡ Aggiorna AI", azioni rapide Chiama + WhatsApp. Dettaglio rinviato a Cap. 5.
  - 4.7 Modificare / archiviare / eliminare (segreteria+agente NON possono eliminare, solo titolare).
- **12 voci HAL YAML** validate in `/app/memory/manuale/hal/04-clienti.yaml` (~470 righe): `creare-nuovo`, `tipi-cliente`, `stato-crm`, `preferenze-ricerca`, `gdpr-consenso`, `import-csv-template`, `smart-import-ai`, `collegare-immobile-venditore`, `smart-sorting-buckets`, `temperatura-lead-scoring`, `azioni-rapide`, `archiviare-eliminare`.

#### Screenshots Index aggiornato
- 6 nuovi screenshot Cap. 4 catalogati (`cap4-client-form-nuovo`, `preferences-form`, `import-csv-flow`, `smart-import-ai-preview`, `property-seller-link`, `smart-sorting-buckets`).
- **Totale index: 23 placeholder screenshot** (Cap. 1: 8, Cap. 2: 2, Cap. 3: 7, Cap. 4: 6).

### File creati/modificati
- ✨ NEW `/app/memory/GAP.md` (119 righe)
- ✨ NEW `/app/memory/manuale/04-clienti.md` (~360 righe)
- ✨ NEW `/app/memory/manuale/hal/04-clienti.yaml` (12 voci, ~470 righe)
- ♻️ MOD `/app/memory/manuale/03-immobili.md` (L4 privacy fix)
- ♻️ MOD `/app/memory/manuale/hal/03-immobili.yaml` (L4 privacy fix voce HAL)
- ♻️ MOD `/app/memory/manuale/01-primo-accesso.md` (tabella Dashboard fix)
- ♻️ MOD `/app/memory/manuale/hal/01-primo-accesso.yaml` (voce tour-barra-sinistra fix)
- ♻️ MOD `/app/memory/manuale/hal/screenshots-index.md` (Cap. 4 sezione, +6 screenshot)

### Numeri aggiornati
- **45 voci HAL** validate su 4 capitoli (di 26 previsti — 15% del manuale)
- **23 screenshot** placeholder catalogati
- **4/26 capitoli** completi

### Prossime azioni
- Cap. 5 · Match (Lead Scoring dettagliato, azioni sui match)
- Poi Cap. 6 · Fascicolo (già toccato in Cap. 3.6 — capitolo dedicato con analisi AI documenti)
- Ingestion HAL Knowledge RAG partirà dopo Cap. 5 (corpus di 5 capitoli sufficiente per cold start)

---

## 2026-02-27 — 🟢 Manuale Operativo · Sprint 2 avvio (Cap. 1-3) + micro-cleanup

**Tipo**: Documentazione manuale utente (Fase 1-3 di 26 capitoli) + 2 micro-fix codice.

### Cosa è stato costruito

#### Manuale Operativo OMNIA — nuovo formato con schema HAL
- **Fase 0 (Piano approvato dal Founder)**: mappa completa moduli/widget/B2C, indice 26 capitoli operativi + 2 placeholder (Academy M6 + MLS Network M4), sequenza fasi (F0→F10, ~10-11 sessioni per completamento manuale), 10 domande di convenzione redazionale chiuse.
- **Convenzioni redazionali locked (approvate dal Founder)**:
  - Nome CRM in-app = "**ImmoWeb**"
  - Assistente AI = "**HAL**" nel manuale (codice invariato "AL")
  - `mls_box` = rinominato "**Vetrina Immobili**" (evita confusione con MLS network M4)
  - **Segreteria** = concetto operativo (agente con permessi ridotti), non ruolo backend
  - **Gruppi/Filiali** = riservato tier Agency (nota esplicita nel manuale)
  - **Moderazione** = solo super_admin nel manuale v1
  - **Legale HAL Legal** = silente (nessuna menzione lancio commerciale)
  - **Screenshot** = solo placeholder `[SCREEN: id-voce]`, mai generati automaticamente
  - **HAL Knowledge** = indicizzazione RAG incrementale (un capitolo alla volta)
  - **Placeholder Academy/MLS** = "ricco ma corto" (3 bullet, nessuna waitlist)
  - **NO Immobili Segreti** (rimosso definitivamente)

- **Cap. 1 · Primo Accesso** (`/app/memory/manuale/01-primo-accesso.md` + `hal/01-primo-accesso.yaml`):
  - 5 sottocapitoli: Cos'è OMNIA · Login e cambio password · Onboarding agenzia (wizard 4 passi) · Tour della barra a sinistra · Cambio lingua e profilo
  - **10 voci HAL YAML** validate (schema completo)
  - Rimosso vecchio `01-introduzione-primo-accesso.md`
  - Micro-fix v1.0.1 applicati: HAL Knowledge marcata "in arrivo", nota agenti invitati, selettore agenzia chiarito, tier Agency esplicitato per Gruppi

- **Cap. 2 · Dashboard** (`02-dashboard.md` + `hal/02-dashboard.yaml`):
  - 5 sottocapitoli: Cosa mi dice il pannello · I 6 contatori · Come leggerli in pratica · Dove vado dopo · Errori comuni
  - **8 voci HAL YAML** validate
  - Allineato all'UI reale (rimosse "Attività recenti"/"Notifiche" che non esistono)

- **Cap. 3 · Immobili** (`03-immobili.md` + `hal/03-immobili.yaml`):
  - 7 sottocapitoli: Creare a mano · Import CSV/XML/XML-universale · Foto e ordinamento · Privacy 4 livelli · Stato/ciclo di vita · Fascicolo · Errori comuni
  - **15 voci HAL YAML** validate (81 passi totali, 21 errori comuni documentati)
  - Privacy matrix L1-L4 spiegata in linguaggio agenzia (chi vede cosa)
  - Distinzione titolare/agente/segreteria in ogni voce "Chi può farlo"

- **Screenshots Index** (`hal/screenshots-index.md`):
  - 17 screenshot totali catalogati (8 Cap.1 + 2 Cap.2 + 7 Cap.3)
  - Convenzioni: viewport 1440×900, dati demo standardizzati (*Immobiliare Rossi*, Belpasso CT), formato PNG max 300 KB
  - Priorità per screenshot (🔴 essenziale · 🟡 utile · 🟢 nice-to-have)

#### Micro-cleanup codice (dead code + info-leak)
- **`apps/billing/plans.py`**: rimosso campo `stripe_price_id_env` (dead metadata esposto pubblicamente via `/api/billing/plans` con valori errati per Pro/Agency). Il checkout usa `lookup_key` dinamico (`{tier}_{cycle}`), quindi il campo non serviva. 10/10 pytest billing verdi post-fix.
- **`apps/core/routes.py`** (R9 audit): `/api/core/health` non espone più raw exception detail (info-disclosure). Errore DB → generic `"error"` in response, dettagli via `logger.exception()`.
- **R10 PostHog** — verificato già dietro guard (`if PH_KEY && startsWith("phc_")`), falso positivo audit.
- **R13 LLM budget** — verificato già 503 `llm_budget_exceeded` in `al_legal` + `al_agent`, falso positivo audit.

### File creati/modificati
- ✨ NEW `/app/memory/manuale/01-primo-accesso.md` (200 righe)
- ✨ NEW `/app/memory/manuale/02-dashboard.md` (~180 righe)
- ✨ NEW `/app/memory/manuale/03-immobili.md` (~330 righe)
- ✨ NEW `/app/memory/manuale/hal/01-primo-accesso.yaml` (10 voci, 405 righe)
- ✨ NEW `/app/memory/manuale/hal/02-dashboard.yaml` (8 voci, ~260 righe)
- ✨ NEW `/app/memory/manuale/hal/03-immobili.yaml` (15 voci, ~450 righe)
- ✨ NEW `/app/memory/manuale/hal/screenshots-index.md` (17 screenshot catalogati)
- ❌ RIMOSSO `/app/memory/manuale/01-introduzione-primo-accesso.md` (vecchio formato discorsivo)
- ♻️ MOD `/app/backend/apps/billing/plans.py` (Plan + CreditPackage senza `stripe_price_id_env`)
- ♻️ MOD `/app/backend/apps/core/routes.py` (health R9)
- ♻️ MOD `/app/memory/PRD.md` (append status update Feb 2026)

### Numeri
- **33 voci HAL** validate su 3 capitoli (di 26 previsti — 12% del manuale)
- **17 screenshot** catalogati (di ~80 stimati totali per l'intero manuale)
- **10 pytest billing** verdi post-cleanup
- **Health endpoint** non espone più dettagli DB (info-disclosure sanato)

### Prossime azioni
- Cap. 4 · Clienti (~6 sottocap, 10-13 voci HAL)
- Poi Cap. 5 (Match) e Cap. 6 (Fascicolo dedicato)
- Ingestion HAL Knowledge partirà dopo Cap. 5-6 (corpus sufficiente per cold start RAG)

---


## 2026-07-03 — ✅ M5.S4.1 Virtual Staging (Sprint 1) DONE

**Tipo**: Feature completa, testata e navigabile.

### Cosa è stato costruito
- **Backend** `/app/backend/apps/immoweb/virtual_staging.py` (~420 righe)
  - Router `/api/app/staging` con 6 endpoint: `/styles`, `/upload`, `/generate`, `/jobs/{id}`, `/jobs/{id}/download`, `/history`, `/jobs/{id}` (DELETE)
  - Pipeline 3-stage async in background:
    - Stage 1: SAM 2 (`fal-ai/sam2/auto-segment`) → maschera stanza (~5-10s, $0.001)
    - Stage 2: Flux LoRA inpainting (`fal-ai/flux-lora/inpainting`) → arredamento (~4-8s, $0.05)
    - Stage 3: Real-ESRGAN 4x (`fal-ai/esrgan`) → upscale (~5s, $0.005)
  - Catalog stili (5: modern, classic, scandi, industrial, luxury) + tipi stanza (6: living, bedroom, kitchen, dining, bathroom, office)
  - Prompt engineering CRM-aware baseline (S4.2 aggiungerà buyer persona)
  - Watermark "Render virtuale OMNIA" applicato server-side via Pillow su download (conformità AGCM 2024 + Art. 21 Codice Consumo)
  - Rate limit 20 render/ora/user
- **Frontend** `/app/frontend/src/apps/immoweb/pages/VirtualStagingPage.jsx` (~380 righe)
  - Dropzone drag&drop con validazione MIME + size (max 12 MB)
  - Upload immediato preview locale + upload al fal storage
  - Selettori stile + tipo stanza a pillole
  - Progress bar 3-stage con status live, durata, costo
  - Before/After side-by-side + bottone "Scarica con watermark"
  - Cronologia render con thumbnails
  - Integrato in AgencyShell (nav sinistra CRM)
- **Route** `/it/app/staging` (protetta: super_admin/agency_admin/agent)
- **Dependencies** aggiunte: `fal-client==1.0.0` + transitive (aiofiles, msgpack, httpx-sse, asyncstdlib)

### Test eseguiti
- Curl end-to-end: enqueue → polling → done → download watermark → 4K image OK
- **Costo reale per render**: **$0.056** (esatto come stimato in D-033)
- **Tempo reale**: ~19 secondi totali (SAM 5.7s + Flux 4.1s + ESRGAN 5s + orchestration overhead)
- Screenshot UI live: nav + dropzone + history OK

### Deviazioni tecniche da D-033
- Cambiato `fal-ai/flux-general/inpainting` (D-033 originale) → `fal-ai/flux-lora/inpainting` perché il primo aveva coda >10 minuti su fal. Costo e qualità equivalenti, velocità 15-30x superiore.
- Cambiato `fal-ai/real-esrgan` → `fal-ai/esrgan` (nome endpoint corretto dopo verifica docs fal).

### File modificati
- `/app/backend/apps/immoweb/virtual_staging.py` (NEW)
- `/app/backend/apps/immoweb/routes.py` (mount router)
- `/app/backend/requirements.txt` (fal-client + deps)
- `/app/backend/.env` (FAL_KEY salvata)
- `/app/frontend/src/apps/immoweb/pages/VirtualStagingPage.jsx` (NEW)
- `/app/frontend/src/App.js` (nuova route)
- `/app/frontend/src/apps/immoweb/components/AgencyShell.jsx` (nav item)

### Prossimo sprint M5.S4.2 (D-033)
- Reverse Staging (rimuovi + ri-arreda con stile diverso)
- 4 varianti parallele in una singola generation
- Prompt CRM-aware (legge zona/prezzo/buyer persona da CRM per prompt ottimale)

---


## 2026-06-29 (sera) — 🔍 Audit open-source GitHub per OMNIA

**Tipo**: Ricerca strategica (no codice)

Founder ha chiesto se su GitHub ci sono progetti utili a OMNIA che non richiedano GPU pesanti. Ricerca completata e memorizzata in **`/app/memory/OPEN_SOURCE_FINDINGS.md`**.

### Highlights
- 🟢 **3 game-changer** identificati: `zornade/visura-api` (sostituisce VisureItalia), Zornade platform (85M particelle catastali + OMI), `ondata/dati_catastali` (dati catastali ufficiali 2025 via DuckDB)
- 🟡 **4 strong-add**: `SenatoDellaRepubblica/PArSe` (parser normativo per AL Legal), `italia/awesome-italian-public-datasets`, `AgID/cruscotto-italia`, `opendataloader-pdf`
- 🔵 4 backlog interessanti
- ❌ 5 esclusi (Stable Diffusion CPU = 30-90s/img, troppo lento; HouseCrafter/LayoutGMN richiedono GPU)

### Risparmio potenziale a regime (50 agenzie)
**€5.000-19.000/anno** + qualità prodotto significativamente superiore.

### Ordine di integrazione (rispetta D-035 + D-032)
1. Durante M5.S3 v2 (enhancement AL Legal): `PArSe` + `opendataloader-pdf`
2. Durante M5.S6 APE: `ondata/dati_catastali` + `cruscotto-italia`
3. Durante M5.S8 post-SRL: `zornade/visura-api`
4. Continuo: lookup su `awesome-italian-public-datasets` per Valuator/Search

### Action item Founder
- Revisione legale `visura-api` (Playwright headless su SISTER è grey-area) insieme a T&C AL Legal
- Account SISTER ufficiale (post-SRL)
- Decisione fork in-house Zornade vs API dipendente

---


## 2026-06-29 (pomeriggio) — 🛑 D-035: STOP PRE-LAUNCH, ritorno al PROGRAMMA OPERATIVO originale

**Tipo**: Decisione strategica vincolante del Founder (non implementazione)

### Trigger
Il Founder constata che le ultime 3-4 sessioni hanno deviato dal `PROGRAMMA_OMNIA.md` originale per inseguire un filone commerciale (Pricing v1.0 → Resend domain → Landing `/it/agenzie` → Sora 2 videos → Banner CTA proposto → ANNCSU autocomplete) **mai esplicitamente richiesto**. Citazione testuale: *"abbiamo perso il filo inseguendo un pre-launch che a me non interessa per ora. Non ci sarà nessun pre-launch senza Academy e features funzionanti"*.

### Decisione
1. ❌ **NESSUN pre-launch** finché Academy (M6) + tutte le features del Santo Graal non sono complete
2. ✅ **Ritorno al `PROGRAMMA_OMNIA.md` v2.4** come **unica north-star di sviluppo**
3. ✅ Sequenza obbligata D-032 confermata: **M5.S4 → M5.S5 → M5.S6 → M5.S2 → M6 → M4** (Stripe e MLS finali, post-SRL)
4. ⏸️ Filone commerciale **CONGELATO** (codice in produzione resta, ma niente promozione)
5. 🔍 Audit completo da fare al prossimo accesso: identificare i TODO **saltati o fatti parzialmente** dentro M2/M3/M5 chiusi

### MLS multi-agenzia — recupero materiali Founder
Il Founder ricorda di aver fornito in sessioni precedenti:
- **Screenshots Agestanet** per studiare UX modulo MLS
- **Screenshot box MLS di nicastroimmobiliare.it** per replicare la logica già in produzione

Da rilocalizzare negli asset del job al prossimo accesso, o richiedere nuovo upload. Stato attuale codice MLS: **inesistente** (solo campo `privacy_level` sul modello Property, mai utilizzato).

### Cosa NON cambia
- Tutto il codice già consegnato (M1/M2/M3/M5.S1/M5.S3/M3.S6-pro/ANNCSU autocomplete) **resta in produzione**
- I documenti `PRICING_OMNIA.md`, `BUSINESS_MODEL.md`, `RESEND_DOMAIN_GUIDE.md` **restano validi come riferimento**, ma non guidano sviluppo finché commercial filone non riapre

### File aggiornati
- `/app/memory/DECISIONS.md` (aggiunta D-035)
- `/app/memory/ROADMAP.md` (riallineato a D-035)
- `/app/memory/PRD.md` (riallineato a D-035)
- `/app/memory/CHANGELOG.md` (questa entry)

---


## 2026-06-29 — ✅ ANNCSU Autocomplete Indirizzi Valuator (Sprint 2)

Wire frontend del lookup ANNCSU (già esistente backend) con UX live autocomplete in stile Idealista/Immobiliare.it.

### ✅ Implementato
- **Backend** `/app/backend/apps/immocloud/anncsu.py`:
  - Nuovo endpoint `GET /api/cloud/anncsu/suggest?q=...&limit=5` (multi-candidati)
  - Doppio provider: ANNCSU ArcGIS (ISTAT) primary → Nominatim OSM fallback
  - Restituisce `{ok, candidates: [{normalized, comune, provincia_sigla, regione, cap, lat, lon, source}], input}`
- **Frontend** nuovo componente `/app/frontend/src/apps/immocloud/components/AddressAutocomplete.jsx`:
  - Debounce 350ms, min 3 caratteri, abort delle richieste in volo
  - Navigazione tastiera (↑ ↓ Enter Esc)
  - Badge verde "✓ Comune (PR) · CAP · Regione" dopo selezione
  - Etichetta provider (ANNCSU/OSM) per trasparenza
- **ValuatorPage** wire del componente sul campo indirizzo:
  - On select → auto-fill `city` (Comune)
  - Stora `_cap/_lat/_lon/_provincia` come metadata interna (strippati prima del POST)
- Aggiunto strip dei campi `_*` (underscore-prefixed) prima dell'invio al `/api/cloud/valuator`

### 🧪 Test eseguiti
- Backend curl `/api/cloud/anncsu/suggest?q=Via Roma 12 Milano` → 6 candidati restituiti ✅
- Screenshot E2E Playwright: dropdown live, click selezione, autofill città, badge validazione ✅

### ⚠️ Note tecniche
- L'host `geoservizi.istat.it` (ANNCSU primary) attualmente non risolve dal container preview Emergent
- Il fallback Nominatim OSM serve già tutto correttamente; quando ISTAT torna accessibile, primary parte automatico

---


## 2026-06-27 (mattina) — 🚀 Landing `/it/agenzie` v0.1 (prima bozza) LIVE

Fase 1 del programma operativo: landing Founders 50 + backend lead capture.

### ✅ Implementato
- **Backend `/api/founders`** in `/app/backend/apps/marketing/founders.py`:
  - `GET /api/founders/spots` — counter posti rimanenti (real-time da MongoDB)
  - `POST /api/founders/register` — lead capture con email validation, deduplication, dual email (founder welcome + admin notification)
  - Collection MongoDB: `founders_50_leads`
  - Costanti: FOUNDERS_TOTAL_SPOTS=50, ADMIN_NOTIFICATION_EMAIL=mcnicastro@gmail.com
- **Template email Resend** (italiano):
  - `/app/backend/shared/email/templates/founders_welcome.it.html` — mail benvenuto al lead con posizione #X/50
  - `/app/backend/shared/email/templates/founders_admin_notification.it.html` — mail notifica admin con tutti i dati lead
- **Frontend** in `/app/frontend/src/apps/landing/AgenziesLandingPage.jsx`:
  - Hero scuro con titolo "50 strumenti AI per la tua agenzia. 6 mesi di vantaggio per i primi 50."
  - Counter real-time 50/50
  - 3 wow-moment statici (AI Lead Scoring · AL Legal · Valutatore Pro)
  - Tabella pricing Founders 50 (€39 / €99 / €249) con Pro evidenziato
  - Form 5 campi obbligatori (email, nome, agenzia, città, n° agenti) + tier interesse + note opzionali
- **Route** registrata in `/app/frontend/src/App.js` come `/it/agenzie`, `/en/agenzie`, `/es/agenzie` (per ora copy solo IT)
- **Server.py**: incluso `founders_router` nell'api_router

### 🧪 Test eseguiti
- `GET /spots` → 200 OK ✓
- `POST /register` con payload valido → 200, posizione assegnata, email triggered ✓
- Spots counter aggiornato real-time dopo registrazione ✓
- Smoke test screenshot landing UI → hero/counter/wow/pricing/form tutti renderizzati ✓
- Lead di test pulito dal DB ✓

### Status founder
- **v0.1 considerata "prima bozza"** — ritorneremo per refinement
- Banner CTA sui pubblici Valuator + AL Legal → **rinviato** alla prossima sessione
- i18n EN/ES → rinviato
- Test reale end-to-end (mail in inbox) → rinviato

### Sessione chiusa il 27-Giu-2026 mattina

---


## 2026-06-26 (sera tardi) — 🎬 Concept reel Sora 2 — 3 clip pilota

Founder ha voluto vedere "come sarebbe venuta fuori l'idea di ecosistema" tramite mini-video AI senza testo parlato. Generate 3/4 clip cinematic con Sora 2 (modello sora-2, 1280×720 HD landscape, 8 secondi cadauna).

### Output
- Scene generate: skyline futuristico OMNIA, mappa olografica 3D, agente con AI assistant
- Scena 4 (famiglia smart keys) NON generata — budget Emergent LLM esaurito ($4.18 spesi vs $3.40 limit)
- File salvati in `/app/demo_videos/scene_*.mp4` (file master)
- Copia accessibile via URL private (security-by-token): `/app/frontend/public/_omnia_private_AklxeXExFYM04JpBS5D5_RixD-k3lvVz/`

### Costo Sora 2 misurato
- ~$1.40 a clip da 8 secondi 1280×720 con sora-2 standard
- Per concept reel da 4-6 clip considera budget $6-10

### Decisione founder
- Resta a 3 clip "concept v0.1", non rigeneriamo scena 4
- Domani: ripresa dal **programma operativo** (NON dai video)

### Note per agente futuro
- I 3 video sono asset disponibili per ispirare Landing `/it/agenzie` o demo letale futura
- Token URL private salvato in CHANGELOG (qui sopra) e NEXT_SESSION_TIPS — recuperabile se serve
- Script di generazione: `/app/demo_videos/_generate_omnia_concept.py` — riutilizzabile

---


## 2026-06-26 (sera) — 📋 Programma operativo aggiornato + decisioni rimandate

### Aggiornamento programma OMNIA
Definita la sequenza operativa post-Pricing v1.0 in `/app/memory/ROADMAP.md`:
- **Fase 1**: Landing `/it/agenzie` + Banner CTA (2-4 sett.)
- **Fase 2**: Demo letale 3 minuti cavallo di Troia (3-5 sett.)
- **Fase 3**: Completamento features in parallelo (M5.S2 AL Knowledge, Manuale, ANNCSU, Code Review, M5.S4, M6)
- **Fase 4**: Outreach Founders 50 — trigger go-live 15 paganti
- **Fase 5**: Internazionalizzazione (Spagna→Portogallo→FR/DE→USA via partner)

### ⏸️ Decisioni esplicitamente RIMANDATE (sessione separata futura)
- **Tier Enterprise** (>20 utenti, multi-sede, SLA dedicato): founder vuole ragionarci ancora
- **Custom API per clienti Enterprise**: modelli da valutare (per-call / flat contract / revenue share)

Entrambe memorizzate nel pricing v1.0 come `⏸️ RIMANDATO` per non perdere il riferimento.

### File aggiornati
- `/app/memory/ROADMAP.md` — programma operativo aggiornato con sequenza 5 fasi
- `/app/memory/PRICING_OMNIA.md` — Enterprise tier + Custom API marcati esplicitamente come rimandati
- `/app/memory/PRD.md` — stato corrente + prossimi step
- `/app/memory/CHANGELOG.md` — questa entry

---


## 2026-06-26 (pomeriggio) — 💰 Pricing OMNIA v1.0 DEFINITIVO

Sessione di calibrazione pricing con founder. Approvato dopo confronto coi competitor di mercato (Idealista, Immobiliare.it, Realgest, Gestim, fal.ai, APEFACILE, OpenAPI).

### Decisioni
- 🎯 **Founders 50 (lock-in 24m)**: Starter €39 / Pro €99 / Agency €249
- 📈 **Standard post-Founders**: Starter €59 / Pro €179 / Agency €349 (sconto 50% vita per Founders post-24m)
- 💳 **Sistema crediti**: 1 credito = €0,30. Pacchetti top-up 100/500/1500/5000 crediti
- 🌐 **Boost portale privati**: Premium 30gg €19,90 (-33% vs Idealista) / TOP €29,90 (-19%)
- 🏢 **Annunci agency**: tier inclusi gratis (15/50/70), pacchetti extra 10/€69, 30/€179, 100/€499
- 🚀 **Boost agency fase 1 MVP**: 5 Premium Starter / 15+5 Pro / illimitati (fair-use cap) Agency. Algoritmo granulare "ogni 10 annunci" → fase 2 a 30+ clienti
- ❌ **APE rimosso v1.0**: margine troppo basso (€130-180 costo vivo), ricomporre v2.0 con contratto enterprise
- ❌ **No referral program** (founder valuterà dopo)
- ⏸️ **Enterprise tier**: sessione separata futura

### Insight di mercato emersi
- Mercato gestionale italiano è BASSO (Realgest €16, Gestim Pro €47) → OMNIA premium positioning corretto
- Virtual Staging fal.ai costa $0,021/img → margine 93% possibile
- APE realistico €130-180/cad nazionale, non €100 come pensava founder
- Idealista/Immobiliare.it boost €29-59/mese → spazio per OMNIA al -25/45%

### File creato
- `/app/memory/PRICING_OMNIA.md` — riferimento ufficiale per landing/banner/demo/onboarding

### Break-even (REVISIONE CRITICA)
- ⚠️ Prima stima fornita al founder (€220 fissi → 8-10 agency) era INCOMPLETA
- Costi fissi reali = €640-720/mese (tecnici + commercialista SRL + banking + LinkedIn Sales Nav + assicurazione + ammortamento apertura SRL + Stripe fee)
- **Break-even reale**: **10-12 agenzie attive** (mix realistico 60/30/10)
- Trigger go-live commerciale: **15 Founders firmati & paganti**
- Founders 50 pieno = **€29.460/anno netti** (revised down da stima ottimistica precedente di €40.800)
- Listino sostenibile confermato dopo verifica onesta tutti i costi

---


## 2026-06-26 (mattina) — ✅ Resend Domain VERIFIED + primo invio ufficiale

- ✅ NS Cloudflare propagati overnight (~10 ore): `brit.ns.cloudflare.com` + `jose.ns.cloudflare.com` attivi
- ✅ Tutti i 4 record DNS Resend propagati (DKIM, SPF TXT, MX feedback, DMARC) verificati via Google DNS + Cloudflare DNS 1.1.1.1
- ✅ Resend domain `omniarealestateecosystem.it` status: **VERIFIED** (DKIM + SPF MX + SPF TXT tutti `verified`)
- ✅ Primo invio ufficiale: email ID `17d98551-c039-409d-bdc8-3210db6389e2` da `OMNIA <info@omniarealestateecosystem.it>` a `mcnicastro@gmail.com`
- ⏳ Attesa conferma founder su placement (inbox vs promo vs spam)

---


## 2026-06-25 (sera) — 🌐 Migrazione DNS → Cloudflare + Setup Resend con dominio verificato

**Obiettivo**: sbloccare la verifica del dominio Resend (richiede MX custom che Aruba non supporta).

### Completato
- ✅ **AL Legal**: rimosso `brocardi.it` dalle fonti per decisione founder (non sempre attendibile). Riordinate `LEGAL_DOMAINS` in 3 tier (PRIMARIE/ISTITUZIONALI/SECONDARIE) con priorità a `normattiva.it`.
- ✅ **Prompt AL Legal**: aggiunta regola esplicita *"Se una norma è citata sia da normattiva.it che da una fonte secondaria, USA E CITA SOLO normattiva.it"*.
- ✅ **Resend Domain**: aggiunto `omniarealestateecosystem.it` su Resend (region eu-west-1). Domain ID `37e0ca6a-2b7e-4b9d-85c6-cd3406d1c5b4`.
- ✅ **DNS Aruba → Cloudflare migration** (D-029):
  - Account Cloudflare creato con `info@omniarealestateecosystem.it` (piano Free)
  - Importati tutti i record Aruba in automatico (A radice, 7×A mx, MX @, CNAME app/cloud/admin/www/_domainconnect, 3×TXT Resend)
  - Aggiunto record MX `send` → `feedback-smtp.eu-west-1.amazonses.com` priorità 10 (quello bloccato da Aruba)
  - Proxy correttamente impostati: 🟠 Proxy su sito web e radice, ☁️ DNS only su tutti gli `mx`, sui CNAME Emergent (`app`, `cloud`) e su tutti i record email
  - Cambiati nameserver su Aruba: `brit.ns.cloudflare.com` + `jose.ns.cloudflare.com`
- ✅ **SENDER_EMAIL** in `/app/backend/.env`: cambiato da `onboarding@resend.dev` → `OMNIA <info@omniarealestateecosystem.it>`
- ✅ Backend riavviato

### In attesa (al prossimo accesso)
- ⏳ Propagazione nameserver Cloudflare (1-4 ore, max 24h)
- ⏳ Verifica dominio Resend (`status: verified` su DKIM + SPF TXT + SPF MX)
- ⏳ Test invio email live (controllo arrivo in INBOX, non spam)

### File modificati
- `/app/backend/apps/immoweb/al_legal/tavily.py` — rimosso brocardi.it, riordinate fonti
- `/app/backend/apps/immoweb/al_legal/prompts.py` — regola priorità fonti
- `/app/backend/.env` — SENDER_EMAIL
- `/app/memory/RESEND_DOMAIN_GUIDE.md` — riscritto con stato migrazione completa

### Note operative
- ⚠️ Backend CORS si aspetta `learn.omniarealestateecosystem.it` ma su Cloudflare il CNAME è `cloud` (non `learn`). Da sistemare al prossimo accesso (aggiungere CNAME `learn` o modificare CORS).
- 🛡️ DMARC in modalità `p=none` (monitor only). Da alzare a `p=quarantine` dopo 2 settimane senza problemi.
- 📊 Bonus Cloudflare: CDN, SSL universale, anti-DDoS, propagazione veloce — tutto gratis incluso piano Free.

### Decisioni
- **D-028** (consolidata): Brocardi rimosso dalle fonti AL Legal.
- **D-029**: DNS del dominio delegati a Cloudflare. Aruba resta registrar.

---


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
