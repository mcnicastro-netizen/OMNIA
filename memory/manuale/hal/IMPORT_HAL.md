# 📚 HAL Knowledge — Import & Cold Start (v0.8)

**Ultimo aggiornamento**: Feb 2026 (post-Cap. 12 · HAL Knowledge come meta-capitolo del RAG)
**Corpus attuale**: **142 voci HAL YAML** su **12 capitoli** (Cap. 1-12)
**Motore**: `hal_knowledge.py` con loader YAML **attivo** (Opzione A applicata in TASK B-bis · 6 Ago 2026)
**Prossimo passo**: reindex live post-Cap. 12 e verifica 3 query smoke (vedi §"Smoke Cap. 12").

---

## 🎯 Cosa fa questo documento

- Descrive **come indicizzare** le 56 voci HAL nel motore già esistente `hal_knowledge.py`.
- Definisce la **strategia di chunking** (chunk = 1 voce YAML atomica, non arbitrary split).
- Fornisce le **5 query test di controllo** per validare il retrieval prima del rilascio.
- Documenta i **limiti attuali** (v0.1 è un cold start: il vero rilascio è dopo Cap. 5+).

---

## 🧠 Come funziona il retrieval in OMNIA (contesto tecnico)

**Motore**: `/app/backend/apps/immoweb/hal_knowledge.py` (già live).

**Approccio (D-061)**:
- **Retrieval**: **TF-IDF + cosine similarity** — no chiamate LLM sull'embedding.
  - Corpus attuale piccolo (~56 voci + docs interni) → TF-IDF batte in latenza gli embeddings neurali senza degradare la qualità per domande italiane.
- **Generation**: Gemini 3 Flash Preview via Emergent LLM Key (streaming SSE).
- **Confidence gate**:
  - `< 0.08` → risposta "insufficient_context" (rifiuta di rispondere).
  - `>= 0.08 && < 0.20` → risposta "medium" (con caveat).
  - `>= 0.20` → risposta "high-confidence".
- **Idempotenza**: chunk indicizzato con MD5 del contenuto sorgente, re-ingest solo se cambiato.

**Collezioni Mongo**:
- `hal_knowledge_chunks`: chunk indicizzati
- `hal_knowledge_meta`: matrice TF-IDF + vocab
- `hal_knowledge_sessions`: storico Q&A

**Rotte**:
- `GET /api/app/hal/knowledge/status` → stato indice
- `POST /api/app/hal/knowledge/reindex` → forza reingest
- `POST /api/app/hal/knowledge/ask` → domanda (streaming SSE)
- `GET /api/app/hal/knowledge/history` → storico sessioni utente

---

## 🧩 Strategia di chunking per il manuale (v0.1)

**Regola cardine**: **1 voce HAL YAML = 1 chunk indipendente**.

Motivi:
1. Ogni voce è **già atomica** (domanda naturale + a_cosa_serve + quando_si_usa + passi + errori_comuni + permessi).
2. Ogni voce è **già ottimizzata per query semantica** (`domanda_naturale` è la classe di query attesa).
3. Un chunk = una risposta completa → nessun rischio di "risposta tagliata a metà".
4. Chunk piccoli (media ~1.5 KB) → matrice TF-IDF sparsa, retrieval veloce.

**Struttura testo del chunk** (concatenazione predefinita per l'ingestion):

```
[TITOLO] {titolo}
[MODULO] {modulo}
[DOMANDA] {domanda_naturale}
[A COSA SERVE] {a_cosa_serve}
[QUANDO SI USA] {quando_si_usa}
[PASSI]
- {passo_1}
- {passo_2}
...
[ERRORI COMUNI]
- {problema_1} → {soluzione_1}
...
[PERMESSI]
- {permesso_1}
- {permesso_2}
...
[TAGS] {tag1, tag2, ...}
```

**Metadati preservati** (per filtering/boosting):
- `id`, `modulo`, `capitolo`, `livello`, `pubblico`, `tags`, `correlati`

---

## 📇 Index statico — `hal-index.json`

**Cos'è**: catalogo delle 56 voci con metadati e MD5 (no contenuto full).
**A cosa serve**:
- Lookup rapido lato frontend (autocomplete, "voci correlate").
- Fingerprint per invalidazione cache (`content_md5` per voce, `md5` per file).
- Base per lo script di ingestion (itera l'index, carica la voce completa dal `.yaml` sorgente).

**Snapshot corrente** (`generated_at` nel file):

```json
{
  "version": "v0.6-cap10",
  "stats": {
    "totale_voci": 117,
    "per_capitolo": {"01": 10, "02": 8, "03": 15, "04": 12, "05": 11, "06": 12, "07": 12, "08": 12, "09": 12, "10": 13},
    "per_modulo":   {"Primo accesso": 10, "Dashboard": 8, "Immobili": 15, "Clienti": 12, "Match": 11, "Portali": 12, "Fascicolo": 12, "Sito web": 12, "Virtual Staging": 12, "HAL Agent": 13},
    "per_livello":  {"base": 83, "intermedio": 34},
    "per_pubblico": {"titolare": 117, "agente": 102, "segreteria": 68},
    "totale_correlati": 274,
    "totale_tags_unici": 289
  }
}
```

**Regenerazione dell'index** (ogni volta che aggiungi/modifichi voci):

```bash
cd /app && python3 -c "
import yaml, json, hashlib, os
from datetime import datetime, timezone

HAL_DIR = '/app/memory/manuale/hal'
files = sorted(f for f in os.listdir(HAL_DIR) if f.endswith('.yaml') and f[0].isdigit())
corpus = {
    'generated_at': datetime.now(timezone.utc).isoformat(),
    'version': 'v0.1-cold-start',
    'source_files': [], 'voci': [],
    'stats': {'totale_voci': 0, 'per_capitolo': {}, 'per_modulo': {},
              'per_livello': {}, 'per_pubblico': {}},
}
# ... (vedi script inline in b2c CHANGELOG 2026-08-06)
"
```

*(Lo script completo è nella pipeline di sviluppo interno; lo esegue il main agent al momento della creazione dell'index.)*

---

## 🚀 Come indicizzare le voci nel motore RAG

### Opzione A (raccomandata) — Aggiungere il loader YAML in `hal_knowledge.py`

`hal_knowledge.py` attualmente indicizza solo file `.md` in `memory/`. Per includere le voci del manuale serve un piccolo add-on nella funzione `ingest_corpus`:

```python
# In hal_knowledge.py, dentro ingest_corpus():
# ... dopo aver processato i file .md ...

# --- NEW: manuale HAL YAML (chunk = 1 voce atomica) --------------------
HAL_YAML_DIR = MEMORY_ROOT / "manuale" / "hal"
for yaml_file in sorted(HAL_YAML_DIR.glob("*.yaml")):
    if yaml_file.name.startswith("hal-index"):
        continue
    with yaml_file.open("rb") as f:
        raw = f.read()
    file_md5 = hashlib.md5(raw).hexdigest()
    data = yaml.safe_load(raw.decode("utf-8"))
    for v in data.get("voci", []):
        chunk_text = _render_voce_hal(v)   # helper dedicato
        chunks.append({
            "file": yaml_file.name,
            "section": v["modulo"],
            "chunk_id": v["id"],
            "text": chunk_text,
            "md5_source": file_md5,
            "metadata": {
                "id": v["id"],
                "modulo": v["modulo"],
                "livello": v["livello"],
                "tags": v["tags"],
                "correlati": v.get("correlati", []),
                "domanda_naturale": v["domanda_naturale"],
            },
        })
```

**Helper `_render_voce_hal(v)`**: produce il testo di chunk secondo la struttura documentata sopra (vedi "Struttura testo del chunk").

**Impatto**:
- 56 chunk aggiuntivi → matrice TF-IDF cresce ma resta sotto i 200 chunks totali (attualmente ~80 con solo i `.md`).
- Nessuna nuova dipendenza (`yaml` è già usato altrove).
- Idempotenza garantita da `md5_source` per file + `chunk_id` per voce.

### Opzione B (script standalone) — Se non vuoi toccare `hal_knowledge.py`

Uno script `scripts/ingest_manual_hal.py` che:
1. Legge i YAML manuale.
2. Chiama `POST /api/app/hal/knowledge/reindex?include_manual=true` (previa piccola modifica endpoint).
3. Riporta il risultato.

**Preferenza raccomandata**: Opzione A (integrata, unica sorgente di verità).

---

## 🚦 Stato UI HAL Knowledge

**Pagina attuale** (`HalKnowledgePage.jsx`): funzionante per admin/agente. Corpus attuale = solo file `.md` in `memory/` (PRD, ROADMAP, DECISIONS, CHANGELOG, ecc.).

**Banner aggiunto in questo TASK**:
- Se il corpus manuale HAL YAML **non è ancora indicizzato** (nessun chunk con `file` che finisce in `.yaml`), la pagina mostra in alto:
  > 📖 **Corpus manuale in indicizzazione** — Le 56 voci del Manuale Operativo (Cap. 1-5) saranno disponibili a breve. Nel frattempo HAL Knowledge risponde già su PRD, ROADMAP, DECISIONS e altri documenti tecnici.
- Il banner scompare automaticamente non appena l'ingestion delle voci YAML è completata (verifica lato server nell'endpoint `/status`).

---

## ✅ 5 Query di test (per validare il retrieval)

Prima di dichiarare il cold start "attivo", eseguire manualmente queste 5 query dalla pagina HAL Knowledge (o via `POST /api/app/hal/knowledge/ask`) e verificare che il chunk **top-1** ritornato corrisponda all'`id` atteso.

### Query 1 · Eliminazione cliente con vincoli

- **Domanda**: *"Come cancello un cliente che ha immobili in carico?"*
- **Voce attesa (top-1)**: `clienti.archiviare-eliminare`
- **Contesto attivato**: passi "il sistema blocca l'eliminazione con il messaggio 'Impossibile eliminare: N immobile/i in carico'" + soluzione riassegna/rimuovi collegamento.
- **Confidence attesa**: ≥ 0.20 (high)

### Query 2 · Privacy avanzata

- **Domanda**: *"Cosa vede un anonimo di un immobile marcato L3?"*
- **Voce attesa (top-1)**: `immobili.privacy-4-livelli-cosa-sono` o `immobili.privacy-scegliere-livello`
- **Contesto attivato**: matrice L1/L2/L3/L4 + soglia minima.
- **Confidence attesa**: ≥ 0.20 (high)

### Query 3 · Interpretazione temperatura

- **Domanda**: *"Perché un cliente è marcato ROVENTE?"*
- **Voce attesa (top-1)**: `match.scala-temperature` o `clienti.temperatura-lead-scoring`
- **Contesto attivato**: range 85-100 punti + significato + azione tipica ("chiama entro 24 ore").
- **Confidence attesa**: ≥ 0.20 (high)

### Query 4 · Troubleshooting operativo

- **Domanda**: *"Perché la pagina Match è vuota?"*
- **Voce attesa (top-1)**: `match.zero-match`
- **Contesto attivato**: checklist 5 punti (bozze, preferenze, filtro score, tipi cliente, coerenza portafoglio).
- **Confidence attesa**: ≥ 0.20 (high)

### Query 5 · Import complesso

- **Domanda**: *"Ho un file Excel disordinato del vecchio CRM, come lo importo?"*
- **Voce attesa (top-1)**: `clienti.smart-import-ai`
- **Contesto attivato**: formati supportati (.csv/.xlsx/.vcf/.txt) + limiti (5 MB, 500 righe) + passi confidenza.
- **Confidence attesa**: ≥ 0.20 (high)

### Criteri di accettazione cold start v0.1

- **5/5** query devono avere la voce attesa nel **top-3** (non richiesto top-1 stretto).
- Almeno **4/5** devono superare confidence 0.20 (high).
- **0/5** deve ritornare "insufficient_context".
- Se ≥2 query falliscono → analizzare TF-IDF vocab (probabilmente serve espandere stopword italiane o preprocess).

---

## 🚫 Cosa NON è in scope di questo TASK B

- ❌ Chiamare LLM per generare embeddings (TF-IDF resta la scelta).
- ❌ Modificare il chunk strategy per i `.md` esistenti.
- ❌ Reindex globale in produzione (l'attivazione va confermata dal Founder).
- ❌ Aggiungere Cap. 6+ al corpus (arriveranno con l'avanzamento del manuale).

---

## 📅 Prossimo giro

1. **Verifica**: Founder approva strategia sopra.
2. **Implementazione Opzione A** in `hal_knowledge.py` (piccolo commit di ~30 righe).
3. **Rigenerazione index** + **reindex manuale** → verifica delle 5 query test.
4. **Rimozione banner** "corpus in indicizzazione" quando `hal_knowledge_chunks` contiene ≥ 56 voci con `file` YAML.
5. Ogni nuovo capitolo del manuale → **rigenera index** + **reindex incrementale** (idempotente per MD5).

---

## 🗓️ Storico versioni

| Data | Versione | Note |
|------|:-:|------|
| 06-Ago-2026 | **v0.1-cold-start** | Prima stesura. hal-index.json generato su 56 voci Cap. 1-5. Strategia chunk = 1 voce YAML atomica. 5 query test documentate. |
| 06-Ago-2026 (sera) | **v0.2-attivato** | Opzione A applicata in `hal_knowledge.py` (loader YAML in `ingest_corpus`). 56 voci indicizzate come chunk atomici, 5/5 query PASS. |
| 06-Ago-2026 (notte) | **v0.2-cleanup** | CHANGELOG.md rimosso dal corpus (`hal_knowledge.py:CORPUS_FILES`) per rompere feedback loop TF-IDF. |
| 06-Ago-2026 (Cap. 6) | **v0.2-cap6** | Cap. 6 Portali/Publishing aggiunto (+12 voci → 68). |
| Feb-2026 (Cap. 7) | **v0.3-cap7** | Cap. 7 Fascicolo Immobile aggiunto (+12 voci → 80). Reindex live post-push. |
| Feb-2026 (Cap. 8) | **v0.4-cap8** | Cap. 8 Sito web agenzia aggiunto (+12 voci → 92). Reindex live post-push. |
| Feb-2026 (Cap. 9) | **v0.5-cap9** | Cap. 9 Virtual Staging aggiunto (+12 voci → 104). Reindex live post-push. |
| Feb-2026 (Cap. 10) | **v0.6-cap10** | Cap. 10 HAL Agent CRM aggiunto (+13 voci → 117). Convenzione naming Fase 0: HAL nel manuale, `al_*` nel codice invariato. |
| Feb-2026 (G-bis) | **v0.6.1-cap10-gbis** | Micro-fix retrieval Cap. 9 `staging.crediti-costo` (+8 tag, +1 correlato, domanda_naturale estesa, a_cosa_serve arricchito con "prezzo render"). Nessun voce aggiunta, totale resta 117. |
| Feb-2026 (Cap. 11) | **v0.7-cap11** | Cap. 11 Mutui comparatore aggiunto (+12 voci → 129). Reindex live post-push. |
| Feb-2026 (H-bis) | **v0.7.1-cap11-hbis** | Fix onestà D-051 Cap. 11: 9→**8 banche distinte** (banks_count=8 in /mutui/config), 11→**9 offerte Consap**, ING NON Consap (né Fisso né Variabile). Voce rinominata `mutui.offerte-14-banche-9` → `mutui.offerte-14-banche-8`. |
| Feb-2026 (Cap. 12) | **v0.8-cap12** | Cap. 12 HAL Knowledge (meta-doc del RAG stesso) aggiunto (+13 voci → 142). Copertura hal_knowledge.py (617 righe) + HalKnowledgePage.jsx (307 righe): TF-IDF + Gemini 3 Flash Preview, corpus 7 file + Cap. 1-11, CHANGELOG.md escluso (B-ter), soglie confidence 0.08/0.20, storico per-utente, reindex super_admin idempotente. Distinzione D-040 fra HAL Knowledge / HAL Agent CRM / HAL Legal. |

---

## 🚦 Smoke Cap. 12 — 3 query attese dopo reindex

1. **"Cos'è HAL Knowledge e a cosa serve?"** → top-1 atteso `12-hal-knowledge.yaml::halk.cos-e`
2. **"Cosa significa 'alta confidence' sulla risposta di HAL?"** → top-1 atteso `12-hal-knowledge.yaml::halk.badge-confidence`
3. **"Qual è la differenza fra HAL Knowledge e HAL Agent CRM?"** → top-1 atteso `12-hal-knowledge.yaml::halk.distinzione-tre-hal`

Confidence attesa ≥ 0.15 su tutte e 3.

---

## 🚦 Smoke Cap. 11 — 3 query attese dopo reindex

1. **"Cos'è il Comparatore Mutui di OMNIA?"** → top-1 atteso `11-mutui-comparatore.yaml::mutui.cos-e`
2. **"Come viene calcolato il TAEG del mutuo?"** → top-1 atteso `11-mutui-comparatore.yaml::mutui.motore`
3. **"OMNIA è mediatore creditizio?"** → top-1 atteso `11-mutui-comparatore.yaml::mutui.disclaimer-tub` (risposta: **no**, art. 128-sexies TUB)

---

## 🚦 Smoke Cap. 9 — 1 query di verifica G-bis

Da eseguire dopo reindex per verificare la fix retrieval:

- **"Quanto costa un render Virtual Staging?"** → top-1 atteso **`09-virtual-staging.yaml::staging.crediti-costo`** (era `07-fascicolo-immobile.yaml::fascicolo.staging-nel-fascicolo` a sim 0.334 pre-fix). Confidence attesa ≥ 0.20.

---

## 🚦 Smoke Cap. 10 — 3 query attese dopo reindex

1. **"Cos'è HAL Agent in OMNIA?"** → top-1 atteso `10-hal-agent-crm.yaml::hal.cos-e`
2. **"A cosa serve il pulsante 'Migliora con HAL' nei form?"** → top-1 atteso `10-hal-agent-crm.yaml::hal.improve-titolo-descrizione`
3. **"Cosa NON può fare HAL Agent?"** → top-1 atteso `10-hal-agent-crm.yaml::hal.limiti-cosa-non-fa` (risposta: sola lettura, no legale, no web, no memoria fra sessioni, no foto)

Confidence attesa ≥ 0.15 su tutte e 3.

---

## 🚦 Smoke Cap. 9 — 3 query attese dopo reindex

1. **"Come faccio un render Virtual Staging?"** → top-1 atteso `09-virtual-staging.yaml::staging.lanciare-render` (o `staging.cos-e`)
2. **"Quanto costa un render Virtual Staging?"** → top-1 atteso `09-virtual-staging.yaml::staging.crediti-costo`
3. **"Posso rimuovere il watermark 'Render virtuale OMNIA'?"** → top-1 atteso `09-virtual-staging.yaml::staging.watermark` (risposta: **no**, obbligatorio AGCM + Art. 21)

Confidence attesa ≥ 0.15 su tutte e 3.

---

## 🚦 Smoke Cap. 8 — 3 query attese dopo reindex

Da eseguire dalla UI HAL Knowledge (o via `POST /api/app/hal/knowledge/ask`) subito dopo il reindex forzato successivo al deploy del Cap. 8:

1. **"Come collego il mio dominio al sito OMNIA?"** → top-1 atteso `08-sito-web.yaml::sito.custom-domain`
2. **"Come estraggo il brand dal mio sito esistente?"** → top-1 atteso `08-sito-web.yaml::sito.brand-extractor`
3. **"Quali temi posso scegliere per il sito?"** → top-1 atteso `08-sito-web.yaml::sito.temi-disponibili`

Confidence attesa ≥ 0.15 su tutte e 3.

---

## 🚦 Smoke Cap. 7 — 3 query attese dopo reindex

Da eseguire dalla UI HAL Knowledge (o via `POST /api/app/hal/knowledge/ask`) subito dopo il reindex forzato successivo al deploy del Cap. 7:

1. **"Quali documenti servono per portare un immobile a rogito?"** → top-1 atteso `07-fascicolo-immobile.yaml::fascicolo.checklist-rogito`
2. **"Come funziona la stima AI mostrata nel Fascicolo?"** → top-1 atteso `07-fascicolo-immobile.yaml::fascicolo.stima-ai`
3. **"Il Fascicolo mi ordina l'APE se non ce l'ho?"** → top-1 atteso `07-fascicolo-immobile.yaml::fascicolo.ape-partner` (risposta chiara: **no**, partner "in valutazione").

Confidence attesa ≥ 0.15 su tutte e 3 (similarity range simile a Cap. 5/6).
