# OMNIA — Sprint Status (handoff agenti)
**Ultimo aggiornamento**: Feb 2026 (post-Cap. 10 HAL Agent CRM)  
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
| **G** Manuale Cap. 10 HAL Agent CRM | ✅ | `10-hal-agent-crm.md` + 13 voci YAML · index **117 voci** · copertura al_agent.py + AlChatWidget + AlImproveButton (5 tool CRM, chat SSE, improve 3 langs+3 toni, convenzione naming Fase 0 HAL/al_*) |
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
| Index | `hal-index.json` v0.6-cap10 |
| Live B-bis | `manual_hal_indexed: 56` ✅ |
| Post Cap. 6 | 68 voci ✅ reindex fatto |
| Post Cap. 7 | 80 voci ✅ reindex fatto (Feb 2026) |
| Post Cap. 8 | 92 voci ✅ reindex fatto (Feb 2026) |
| Post Cap. 9 | 104 voci ✅ reindex fatto (Feb 2026) |
| Post Cap. 10 | **Atteso 117** — reindex Founder da eseguire |
**Reindex** (super_admin): `POST /api/app/hal/knowledge/reindex?force=true`
**Smoke Cap. 10**:
1. *Cos'è HAL Agent in OMNIA?* → `hal.cos-e`
2. *A cosa serve il pulsante 'Migliora con HAL' nei form?* → `hal.improve-titolo-descrizione`
3. *Cosa NON può fare HAL Agent?* → `hal.limiti-cosa-non-fa`
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
| 1 | Reindex HAL post-Cap. 10 + smoke 3 query HAL Agent | 🔴 Founder |
| 2 | Cap. 11 manuale (candidati: HAL Legal · Mutui · Import XML · Team & Ruoli) | 🟢 |
| 3 | Decidere: rate limit chat+improve condivisi o separati (attualmente separati in codice) | 🟡 |
| 4 | Billing UI listino Founder | 🟡 |
| 5 | B2C Stripe checkout | 🟡 |
| 6 | Screenshot kit (TASK H) | 🟡 |
| 7 | Hard-gate crediti Virtual Staging (pre-check saldo) | 🟢 |
---
## Micro-fix aperti
_Tutti chiusi in TASK D (Feb 2026). Nessun micro-fix aperto post-Cap. 10._
_Nota: TASK G ha corretto onestamente il briefing Founder sui rate limit HAL (separati, non condivisi). Se il Founder preferisce condivisi va toccato al_agent.py._
---
## Handoff nuova sessione
