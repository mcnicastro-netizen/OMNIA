# 🕳️ GAP.md — Discrepanze codice ↔ UI ↔ Manuale

**Ultimo aggiornamento**: Feb 2026 (post-Cap. 7 Fascicolo Immobile · aggiunta Sezione E Cap. 7 · micro-fix cross-ref Cap. 3 §3.6/§3.7 · fix Cap. 1 §1.4 portali v1)
**Scope**: elenco funzioni backend senza UI, moduli deprecati/in transizione, duplicati da consolidare, elementi esclusi dal manuale per scelta.
**Come si aggiorna**: ogni volta che scrivi un nuovo capitolo del manuale, aggiungi qui i gap intercettati. Il file cresce col progetto e serve come "verità operativa" per il prossimo agente.

---

## 📚 Legenda

| Stato | Significato |
|:-:|-------------|
| 🔴 **P0** | Da risolvere prima del lancio commerciale |
| 🟠 **P1** | Nice to have per esperienza utente coerente |
| 🟢 **P2** | Trascurabile / scelta consapevole |
| 📖 **Manuale** | Impatta solo la documentazione |
| 🔧 **Code** | Impatta il codice |
| 🎨 **UX** | Impatta la user experience |

---

## Sezione A · Funzioni backend SENZA UI CRM

Endpoint esistenti e testati, ma non esposti nell'interfaccia. Non sono bug: sono lavori "sotto il pelo dell'acqua" che nessun utente clicca oggi.

| Funzione | Backend | Cosa manca lato UI | Priorità | Nota manuale |
|----------|---------|--------------------|:-:|--------------|
| **Preview privacy `?viewer=L1\|L2...`** | `property_privacy.py` `GET /preview` | Nessuna vista "come lo vede un anonimo / un lead qualificato". Utile per rassicurare il titolare curioso. | 🟠 UX | Non nel manuale v1. Se aggiunto → paragrafo "Anteprima privacy" in Cap. 3. |
| **A/B testing analytics** | `analytics_ab.py` `POST /ab-test` + `GET /agency/overview` | Zero dashboard. L'endpoint c'è ma nessuna schermata visualizza i risultati. | 🟠 UX | Blocca Cap. 13.4 A/B testing portale (M5.S4.4). |
| **Cron system introspection** | `cron.py` | Nessun pannello per elencare job attivi. Solo super_admin via CLI. | 🟢 Code | Fuori scope manuale. |
| **Privacy audit trail completo** | `property_privacy.py` `GET /privacy` (con `audit_events`) | UI mostra solo il livello attuale, non lo storico "chi ha cambiato cosa e quando". | 🟠 UX | Menzionato brevemente in Cap. 3.4 (frase "ogni modifica lascia un registro"). |
| **Micro-tour video Kling / Sora 2** | `micro_tour_video.py` — `POST /kling/property/{pid}` (202) e `POST /sora2/property/{pid}` | 501 su `/kenburns/property/{pid}` è placeholder documentato. UI Ken Burns non esiste. | 🟢 Code | Cap. 13.3 in Sprint 3 (M5.S4.3). Placeholder "In arrivo" oggi. |
| **HAL Knowledge corpus** | `hal_knowledge.py` | ✅ Attivo — corpus manuale (Cap. 1-7) indicizzato con **80 voci**. Cap. 12 nel manuale è ancora da scrivere ma non serve annotazione "in arrivo" in UI. | 🟢 | Menzionare normalmente nella sidebar (fix Cap. 1 v1.0.3, Feb 2026). |
| **AI Smart Import Clienti** | `clients_ai_import.py` | UI esiste dentro Import clienti ma non è "in primo piano" (scheda dedicata). | 🟢 UX | Da coprire in Cap. 4 · Clienti se rimane nascosta, altrimenti valorizzarla nel manuale come "AI Smart Import". |
| **Analisi AI Fascicolo** | `fascicolo.py` `POST /fascicolo/{id}/analyze` | Ok — invocato da UI del Fascicolo. Non è un vero gap. | 🟢 | ✅ Coperto in Cap. 7 · Fascicolo Immobile §7.5. |
| **`POST /photos/upload-tmp`** | `properties.py:329` | Usato dietro le quinte quando crei un immobile e carichi foto prima di salvare. Utente non lo sa. | 🟢 Code | Trasparente. Nessuna menzione manuale. |

---

## Sezione B · Moduli deprecati o "in transizione"

| Cosa | Stato | Nota |
|------|-------|------|
| **Modulo backend `mls_box`** | ✅ funzionante | Confonde nome con MLS network M4. **Nel manuale rinominato "Vetrina Immobili"** (Cap. 17). Valutare rename modulo backend in una futura sessione dedicata (comporta migrazione URL). |
| **Endpoint `POST /kenburns/property/{pid}`** | 501 by design | Placeholder documentato per M2.5.3 async pipeline. Appare come bug per un tester esterno. Non toccato in questa sessione. |
| **`stripe_price_id_env` in `plans.py`** | ✅ Rimosso (27-Feb-2026) | Era dead metadata esposto via API pubblica con valori errati per Pro/Agency. Il checkout usa `lookup_key` dinamico. |
| **Vecchio Cap. 1 manuale** `01-introduzione-primo-accesso.md` | ✅ Rimosso (27-Feb-2026) | Sostituito da `01-primo-accesso.md` con schema HAL. |

---

## Sezione C · Duplicati da consolidare (lato codice)

| Duplicato | File coinvolti | Note operative |
|-----------|----------------|----------------|
| **Clienti — 3 file separati** | `clients.py` + `clients_smart.py` + `clients_ai_import.py` | Funzionalità distinte (CRUD anagrafica / smart buckets / AI import) ma nel manuale l'utente le tratta come **un unico modulo Clienti**. Non far trapelare la separazione. |
| **Health endpoints multipli** | `/core/health`, `/cloud/health`, `/app/health`, `/academy/health`, `/v1/health` | Corretto architetturalmente. Non menzionato nel manuale. |
| **`/verifica-dominio` (pubblica) + widget `/api/v1/domain-check.html`** | Stessa funzione, target diverso (privato vs embed pubblico) | Nel manuale entrambi. Widget in Cap. 16, tool pubblico in Cap. 24 (Impostazioni → Domain Vault). |
| **Settings + sotto-pagine (Billing, Domain Vault, Members)** | Rotte diverse, unico "posto mentale" per l'utente | Cap. 24 Impostazioni li tratta come un capitolo unificato con sottosezioni. |

---

## Sezione D · Roba da NON documentare (per scelta)

Elementi che ESISTONO ma per decisione del Founder o per regola redazionale NON entrano nel manuale.

| Cosa | Motivo |
|------|--------|
| **Immobili Segreti** | ❌ Rimosso definitivamente dal roadmap. Mai citare. |
| **Academy M6** | Placeholder route `/:lang/learn/*`. Solo 3-bullet placeholder in Cap. 28 "in arrivo". |
| **MLS Network M4** | Solo design in `MLS_RESEARCH.md`. Placeholder 3-bullet in Cap. 27 "in arrivo". |
| **API/JSON/endpoint/webhook/middleware** | Regola redazionale: mai jargon nel manuale. |
| **Brand Lab** (`/app/brand-lab`) | Super_admin only, "internal creative repository". Non è funzione per agenzie. |
| **Termini d'uso legali HAL Legal** | Legale una tantum (~€200) è pre-lancio commerciale. **Silente** nel manuale v1 (Founder). |
| **PROTECTED_VARIABLES env** (MONGO_URL, DB_NAME, REACT_APP_BACKEND_URL) | Configurazione piattaforma. L'agenzia non le tocca mai. |

---

## Sezione E · Gap intercettati per capitolo (traccia progressiva)

### Cap. 1 · Primo Accesso — Feb 2026
- Nessun gap significativo. UI login/onboarding/tour barra sinistra ricalca 1:1 il manuale.
- Fix v1.0.1 applicato: rimossa dicitura "attività recenti" (non esiste UI).

### Cap. 2 · Dashboard — Feb 2026
- Rimosso dalla bozza indice: "Attività recenti" + "Notifiche" (non esistono nell'UI attuale).
- Dashboard è un cruscotto di stato, non un feed. Documentato onestamente.

### Cap. 3 · Immobili — Feb 2026
- **L4 privacy**: corretto v1.0.1 → rimosso "e le agenzie in rete" (non c'è ancora MLS network M4). L4 = solo team di agenzia.
- **Preview privacy** (`/preview`) — non nel manuale v1 (backend-only).
- **Analytics A/B** — non menzionato (nessuna UI).
- **Micro-tour Kling/Sora** — placeholder "in arrivo" in Cap. 3.6/3.7? No, in Cap. 13 (Virtual Staging). Cap. 3 non lo menziona.

### Cap. 6 · Portali / Publishing — Feb 2026
- **Catalogo 8 portali documentati** (Subito, Bakeca, Kijiji, Wikicasa, Facebook Marketplace, Google Business Profile, Attico, Case24): coincide 1:1 con `CATALOG_SEED` in `apps/immoweb/publishing.py`.
- **Portali NON nel catalogo v1** documentati esplicitamente: Idealista, Immobiliare.it, Casa.it richiedono accordi commerciali diretti agenzia ↔ portale. Il manuale invita a continuare a usarli col loro pannello. Nessun claim di integrazione futura.
- **api_push = SIMULATO in v1** (Facebook Marketplace + Google Business Profile): documentato onestamente. Il codice in `sync_engine.py:162-165` restituisce `action_status="simulated_push"` — nessuna chiamata reale a Meta Graph API o Google Business Profile API. Da promuovere a "live" solo quando M2.6c completa l'integrazione.
- **feed_pull = pulling, no external call**: il manuale spiega che OMNIA non chiama nulla per feed_pull, sono i portali a scaricare (`sync_engine.py:157-161` conferma).
- **APScheduler daily job 06:00 UTC** documentato esattamente come da `sync_engine.py:35-36` (`DAILY_SYNC_HOUR_UTC=6`).
- **Retry backoff 60/300/1800 sec** documentato come 1min/5min/30min (`sync_engine.py:39`).
- **Regole HARD compliance**: 5 regole documentate 1:1 dal codice (`shared/validators/compliance.py:99-111`).
- **Classi APE ammesse**: lista completa dal codice (`compliance.py:20-24`) — inclusi EXEMPT_IN_PROGRESS/EXEMPT_NOT_APPLICABLE.
- **Universal Portal Wizard (M2.6d)**: 4 step documentati come da `PortalWizardPage.jsx:21` (STEPS array) + solo feed_pull come da `publishing.py:320` (_SUPPORTED_INTEGRATIONS).
- **Log sync in UI**: attualmente in dashboard si vedono solo timestamp ultimo sync + counter items_published/items_failed + last_error badge (`PublishingPage.jsx:198-218`). Endpoint `GET /connections/{id}/logs` esiste ma **nessuna UI dedicata**. Documentato onestamente come "in arrivo".
- **Sospensione via PATCH `status=disabled`**: endpoint esiste (`publishing.py:182-183`) ma **nessun bottone "Sospendi temporaneamente"** in UI (solo "Disattiva" = DELETE). Documentato come cosa esistente lato API senza inventare UI.
- **Nome route sidebar**: la sidebar mostra "Portali" (label in italiano) — `AgencyShell.jsx` menu key `publishing`. Corretto nel manuale.

### Cap. 7 · Fascicolo Immobile — Feb 2026
- **10 tipi documento (5 obbligatori + 5 consigliati + 2 solo-condominio + "altro")** documentati 1:1 da `fascicolo.py:DOC_TYPES` (lines 28-40). Zero invenzioni.
- **`CONDO_TYPES` = {appartamento, attico, loft, monolocale}**: il manuale spiega esplicitamente che le righe *Regolamento condominio* + *Attestazione spese* compaiono solo per queste 4 tipologie (verificato in `fascicolo.py:26`).
- **Peso max upload 8 MB** documentato onestamente (backend `MAX_DOC_MB=8`).
- **Storage**: il capitolo dichiara che i documenti vanno su Object Storage cifrato (path `omnia/fascicolo/{property_id}/{doc_id}`) via `put_object`, non in base64 nel DB (backend `fascicolo.py:248-253`). Legacy base64 records ancora leggibili in download (`fascicolo.py:285`).
- **Endpoint attivi documentati**: `GET /fascicolo/{id}` (dettaglio), `POST /fascicolo/{id}/documents/upload` (multipart M24), `GET /fascicolo/{id}/documents/{doc_id}/download`, `DELETE /fascicolo/{id}/documents/{doc_id}`, `POST /fascicolo/{id}/analyze`. Non menzionato l'endpoint legacy `POST /fascicolo/{id}/documents` (JSON base64) — mantenuto solo per retrocompatibilità.
- **Analisi HAL (POST /analyze)**: usa Gemini 3 Flash via `EMERGENT_LLM_KEY` con fallback rule-based se il LLM fallisce (`fascicolo.py:314-355`). System prompt esplicito: no consulenza legale vincolante, no invenzione documenti. Salvato in `fascicolo_analysis` sul documento immobile.
- **Stima AI (`_compute_valuation`)**: al load pagina, chiama `apps.immocloud.valuator.estimate_value` con mapping *ottime→ottimo* / *buone→buono* per il campo `condition` (`fascicolo.py:42, 111`). Fallisce silenziosamente se manca città o superficie.
- **APE partner "in valutazione" (D-051 onestà)**: il capitolo dichiara esplicitamente che **non c'è alcun bottone "Ordina APE ufficiale" in UI oggi** (verificato: nessun endpoint `order_ape` nel backend, nessun componente frontend). Il claim precedente in Cap. 3.6 v1.0.0 ("nel Fascicolo trovi (se attivo) un bottone Ordina APE ufficiale") era **misleading**: sistemato in questo TASK D con correzione contestuale sia in `03-immobili.md` §3.6 sia nella voce YAML `immobili.classe-energetica`.
- **Cross-ref sistemata anche in Cap. 3**: rimosso link errato "Cap. 8 · Portali" (portali è Cap. 6), rimossa citazione "Immobiliare.it" in tabella errori comuni §3.7 (allineamento a v1 8-portali).
- **Voce eliminazione documento** (`fascicolo.eliminare-documento`): il backend `DELETE` non discrimina il ruolo (segreteria può eliminare tecnicamente). Il manuale lo documenta come vincolo procedurale/policy: segreteria "usa con cura", non "non può". Onestà.
- **Render Virtual Staging embedded** (`fascicolo.staging-nel-fascicolo`): il Fascicolo mostra fino a 12 render con status=done presi da `virtual_staging_jobs` (`fascicolo.py:153-156`). Il capitolo chiarisce che il Fascicolo non lancia nuovi render (rimando al modulo dedicato).

### Pricing B2C — 6-Ago-2026
- **Listino B2C separato creato** (`memory/PRICING_B2C.md` v1.0) su rail carta one-shot.
- **Backend stub** in `backend/apps/billing/b2c_products.py` — 3 prodotti attivi (Valutatore UNI+PDF €2,99 · Virtual Staging €0,90 · HAL Legal €1,00), 2 lead magnet gratuiti (Valutatore base 1×/12m · Comparatore mutui), 2 "in arrivo" (Visura ~€0,40 costo, Planimetria ~€6,90 costo — sospesi in attesa validazione margini fase 2).
- **Checkout Stripe B2C one-shot** = sprint successivo (endpoint `POST /api/billing/b2c/checkout` da implementare).
- **Regola operativa cardine**: nessun servizio B2C sotto €0,99 (tranne lead magnet espliciti).
- **B2B esclusivo** (non esposto lato /cloud): crediti, pacchetti ricarica, widget & API mensili, multiposting, CRM, Match, MLS.

### HAL Knowledge v0.1 cold start — 6-Ago-2026
- **`hal-index.json`** generato programmaticamente dai 5 YAML manuale (56 voci · 47 KB · MD5 per voce e per file).
- **`IMPORT_HAL.md`** documentazione operativa: strategia chunk (1 voce YAML = 1 chunk atomico), rendering testo chunk, 2 opzioni implementative (Opzione A raccomandata: loader YAML in `ingest_corpus`), 5 query test con voce attesa.
- **Banner UI** aggiunto in `HalKnowledgePage.jsx`: mostra "corpus manuale in indicizzazione" finché `status.manual_hal_indexed === 0`.
- **Backend `/status` endpoint**: aggiunto campo `manual_hal_indexed` che conta chunk con `file` `.yaml`.
- **Non implementato in questo TASK B**: l'ingest reale delle 56 voci (Opzione A da applicare in commit separato). Motore TF-IDF resta invariato (D-061).

### HAL Knowledge v0.2 ATTIVO — 6-Ago-2026 sera
- **Opzione A applicata** in `hal_knowledge.py`: helper `_render_voce_hal(v)` + `_chunk_yaml_hal_file()` + loop YAML in `ingest_corpus()` + `chunk_id: Union[int, str]`.
- **Reindex sandbox** con `force=True`: 56/56 voci YAML indicizzate come chunk atomici. Totale chunks = 617 (561 md + 56 yaml).
- **5 query test — TUTTI PASS**: 5/5 top-3 · 5/5 confidence ≥0.20 · 0/5 insufficient_context. Similarity top-1 range 0.30-0.39, voce specifica sempre in pos 2 o 3 con similarity 0.15-0.27.
- **Osservazione**: top-1 spesso è chunk generalista PRD/ROADMAP; il chunk atomico HAL della voce specifica arriva in pos 2 o 3 con similarity buona. Retrieval passa tutti i top-K a Gemini, quindi non è un problema.
- **Prod activation**: `POST /api/app/hal/knowledge/reindex {force: true}` da super_admin dopo push.

---

## Sezione F · Azioni prossime (traccia in coda)

Da rivedere alla fine di Sprint 2:

- [ ] Fix R8 · Moderation access → Founder deciderà se aprire a `group_admin`
- [ ] Fix R12 · Endpoint 501 v1 staging → resta intenzionale (documentare in Cap. 16 "in arrivo")
- [ ] Aggiungere Sezione E per Cap. 4, 5, 6, ... man mano che vengono scritti
- [ ] A fine manuale, rivedere Sezione A per verificare quanti gap sono chiusi

---

## 📝 Come contribuire al file

**Se scrivi un capitolo del manuale e trovi qualcosa che non torna**:
1. Aggiungi la voce nella sezione appropriata (A, B, C, D o E).
2. Metti la priorità (🔴 P0 / 🟠 P1 / 🟢 P2).
3. Annota se impatta Manuale (📖), Codice (🔧) o UX (🎨).
4. Se il gap è chiuso in una sessione successiva, non cancellarlo: aggiungi ✅ e la data (per storico).

**Se NON sei sicuro se un gap va documentato**:
- Backend endpoint non usato mai? → Sezione A
- Deprecato/duplicato? → Sezione B o C
- Esiste ma per scelta non entra nel manuale? → Sezione D
- Osservato durante la scrittura di un capitolo? → Sezione E
