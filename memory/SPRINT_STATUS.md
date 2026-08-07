# OMNIA — Sprint Status (handoff agenti)
**Ultimo aggiornamento**: Feb 2026 (post-Cap. 10 HAL Agent CRM + G-bis retrieval fix)  
**Branch di riferimento**: `main`  
**Repo**: https://github.com/mcnicastro-netizen/OMNIA  
**Preview Emergent**: https://omnia-crm-docs.preview.emergentagent.com  
**Founder**: Marco Nicastro · credenziali test in `/app/memory/test_credentials.md` (non in GitHub)
---
## Regole operative (non negoziabili)
1. **Onestà documentale (D-051)**: documentare SOLO ciò che esiste nel codice/UI oggi. Zero invenzioni.
2. **Push GitHub**: l'agente modifica file locali; il **Founder** esegue **Save to GitHub**. Non assumere push automatico.
3. **STOP dopo ogni task**: report + commit message suggerito → attendere **"vai"** esplicito del Founder.
4. **Academy (M6)**: congelata.
5. **MLS network**: 0% — solo placeholder Cap. 27.
6. **Immobili Segreti**: rimosso dal prodotto.
7. **Entità legale**: ditta individuale esistente (no nuova SRL).
8. **Naming**: ImmoWeb (B2B CRM) · ImmobilCloud (B2C) · HAL · segreteria = concetto operativo, non ruolo backend.
---
## Completato in questo sprint (Feb 2026 · post-fork)
| Task | Stato | Note chiave |
|------|:-----:|-------------|
| **A-bis** Pricing B2C | ✅ | `PRICING_B2C.md` v1.0 + `b2c_products.py` stub · checkout Stripe = sprint dopo |
| **A** Pricing B2B sync | ✅ | `PRICING_OMNIA.md` v3.0 + `plans.py` · valuator 6/12 cr |
| **B** HAL cold start | ✅ | `hal-index.json` + `IMPORT_HAL.md` + banner UI |
| **B-bis** HAL YAML ingest | ✅ | Opzione A in `hal_knowledge.py` · 56 voci Cap. 1-5 · live reindex OK |
| **B-ter** HAL corpus cleanup | ✅ | `CHANGELOG.md` **escluso** da `CORPUS_FILES` · feedback loop risolto |
| **C** Manuale Cap. 6 Portali | ✅ | `06-portali-publishing.md` + 12 voci YAML · index **68 voci** |
| **D** Manuale Cap. 7 Fascicolo + micro-fix | ✅ | `07-fascicolo-immobile.md` + 12 voci YAML · index **80 voci** · 4 micro-fix chiusi (Cap. 1 §1.4, CHANGELOG typo, IMPORT_HAL a 80, Cap. 3 cross-ref §3.6/§3.7 + APE partner "in valutazione") |
| **E** Manuale Cap. 8 Sito web | ✅ | `08-sito-web.md` + 12 voci YAML · index **92 voci** · copertura site.py + themes.py + brand_extractor.py + custom_domain.py |
| **F** Manuale Cap. 9 Virtual Staging | ✅ | `09-virtual-staging.md` + 12 voci YAML · index **104 voci** · copertura virtual_staging.py (SAM2+Flux+ESRGAN, 5 stili, 6 stanze, reverse mode, watermark AGCM) |
| **G** Manuale Cap. 10 HAL Agent CRM | ✅ | `10-hal-agent-crm.md` + 13 voci YAML · index **117 voci** · reindex + smoke 3/3 PASS · convenzione naming Fase 0 HAL/al_* |
| **G-bis** Micro-fix retrieval Cap. 9 `staging.crediti-costo` | ✅ | tags 6→14 · +correlato `staging.cos-e` · domanda_naturale doppia · a_cosa_serve arricchito (prezzo/listino/quanto costa) · index v0.6.1-cap10-gbis · totale 117 voci invariato |
---
## Manuale operativo — progresso
| Cap | Modulo | Voci HAL | Stato |
|-----|--------|:--------:|:-----:|
| 1 | Primo accesso | 10 | ✅ v1.0.4 (portali v1 aggiornati) |
| 2 | Dashboard | 8 | ✅ |
| 3 | Immobili | 15 | ✅ v1.0.2 (cross-ref Cap. 6/7 + APE partner "in valutazione") |
| 4 | Clienti | 12 | ✅ |
| 5 | Match | 11 | ✅ |
| 6 | Portali / Publishing | 12 | ✅ |
| 7 | Fascicolo Immobile | 12 | ✅ v1.0 (esteso oltre §3.6) |
| 8 | Sito web agenzia | 12 | ✅ v1.0 (site + themes + brand extractor + custom domain) |
| 9 | Virtual Staging | 12 | ✅ v1.0 (pipeline SAM2+Flux+ESRGAN, 5 stili, 6 stanze, reverse mode, watermark AGCM) |
| 10 | HAL Agent CRM | 13 | ✅ v1.0 (chat + 5 tool CRM, streaming SSE, Migliora con HAL 3 langs+3 toni, naming Fase 0) |
| 11–26 | — | — | ⏳ |
| 27 | MLS Network | — | 🔒 placeholder |
| 28 | Academy | — | 🔒 frozen |
**Totale**: **10/26 capitoli (38%)** · **117 voci HAL** · **54 screenshot placeholder** in `screenshots-index.md`
**Convenzioni**: `[SCREEN: id]` · aggiornare GAP.md + CHANGELOG · YAML = 1 voce = 1 chunk RAG.
---
## HAL Knowledge — stato tecnico
| Componente | Stato |
|------------|:-----:|
| Motore | TF-IDF + Gemini (`hal_knowledge.py`, D-061) |
| YAML ingest | ✅ attivo |
| Corpus .md | PRD, ROADMAP, DECISIONS, AUDIT_M2, PROGRAMMA, ASPETTI, BUSINESS_MODEL |
| **Escluso** | ~~CHANGELOG.md~~ (B-ter) |
| Index | `hal-index.json` v0.6.1-cap10-gbis |
| Live B-bis | `manual_hal_indexed: 56` ✅ |
| Post Cap. 6 | 68 voci ✅ reindex fatto |
| Post Cap. 7 | 80 voci ✅ reindex fatto (Feb 2026) |
| Post Cap. 8 | 92 voci ✅ reindex fatto (Feb 2026) |
| Post Cap. 9 | 104 voci ✅ reindex fatto (Feb 2026, insieme Cap. 10) |
| Post Cap. 10 | **117 voci ✅ reindex + smoke 3/3 PASS** (Feb 2026) |
| Post G-bis | Reindex Founder da eseguire (voci invariate 117, ma content_md5 `staging.crediti-costo` cambiato + md5 file Cap. 9 cambiato) |
**Reindex** (super_admin): `POST /api/app/hal/knowledge/reindex?force=true`
**Smoke G-bis (verifica retrieval)**:
- *Quanto costa un render Virtual Staging?* → atteso top-1 `09-virtual-staging.yaml::staging.crediti-costo`, confidence ≥ 0.20
---
## Pricing (Founder approvato)
- **B2B** v3.0: Founders €49/€99/€249 · standard €79/€179/€349 · 1 cr = €0.05
- **B2C** v1.0: rail carta · UNI €2.99 · staging €0.90 · Legal €1.00 · visura/planimetria fase 2
---
## Cap. 6 — onestà codice
- **8 portali** `CATALOG_SEED` (Subito, Bakeca, Kijiji, Wikicasa, FB, Google, Attico, Case24)
- **NON v1**: Idealista, Immobiliare.it, Casa.it
- **feed_pull** = portali scaricano feed · **api_push** = simulated_push v1
- Sync 06:00 UTC · Compliance 5 HARD + 4 SOFT · Wizard M2.6d
---
## Prossimi task (ordine Founder)
| # | Task | Priorità |
|---|------|:--------:|
| 1 | Reindex HAL post-G-bis + 1 smoke costo staging | 🔴 Founder |
| 2 | **Cap. 11 Mutui** (prossimo capitolo manuale) | 🟢 |
| 3 | Billing UI listino Founder | 🟡 |
| 4 | B2C Stripe checkout | 🟡 |
| 5 | Screenshot kit (TASK H) | 🟡 |
| 6 | Hard-gate crediti Virtual Staging (pre-check saldo) | 🟢 |
| 7 | Sito Web v2 · scope da definire (P0 Hero+Chi Siamo+Contatti+Footer + extractor esteso) | 🟠 aperta |
---
## Micro-fix aperti
_Tutti chiusi. G-bis retrieval Cap. 9 applicato (Feb 2026)._
_**Rate limit HAL chat vs improve = SEPARATI CONFERMATO** (60/h ciascuno, no change al_agent.py — decisione Founder Feb 2026)._
---
## Handoff nuova sessione
