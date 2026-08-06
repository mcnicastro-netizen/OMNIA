# OMNIA — Sprint Status (handoff agenti)
**Ultimo aggiornamento**: 6 Agosto 2026  
**Branch di riferimento**: `main`  
**Repo**: https://github.com/mcnicastro-netizen/OMNIA  
**Preview Emergent**: https://omnia-real-estate-1.preview.emergentagent.com  
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
## Completato in questo sprint (6 Ago 2026)
| Task | Stato | Note chiave |
|------|:-----:|-------------|
| **A-bis** Pricing B2C | ✅ | `PRICING_B2C.md` v1.0 + `b2c_products.py` stub · checkout Stripe = sprint dopo |
| **A** Pricing B2B sync | ✅ | `PRICING_OMNIA.md` v3.0 + `plans.py` · valuator 6/12 cr |
| **B** HAL cold start | ✅ | `hal-index.json` + `IMPORT_HAL.md` + banner UI |
| **B-bis** HAL YAML ingest | ✅ | Opzione A in `hal_knowledge.py` · 56 voci Cap. 1-5 · live reindex OK |
| **B-ter** HAL corpus cleanup | ✅ | `CHANGELOG.md` **escluso** da `CORPUS_FILES` · feedback loop risolto |
| **C** Manuale Cap. 6 Portali | ✅ | `06-portali-publishing.md` + 12 voci YAML · index **68 voci** |
---
## Manuale operativo — progresso
| Cap | Modulo | Voci HAL | Stato |
|-----|--------|:--------:|:-----:|
| 1 | Primo accesso | 10 | ✅ v1.0.3 (HAL Knowledge non più "in arrivo") |
| 2 | Dashboard | 8 | ✅ |
| 3 | Immobili | 15 | ✅ |
| 4 | Clienti | 12 | ✅ |
| 5 | Match | 11 | ✅ |
| 6 | Portali / Publishing | 12 | ✅ |
| 7–26 | — | — | ⏳ |
| 27 | MLS Network | — | 🔒 placeholder |
| 28 | Academy | — | 🔒 frozen |
**Totale**: **6/26 capitoli (23%)** · **68 voci HAL** · **34 screenshot placeholder** in `screenshots-index.md`
**Convenzioni**: `[SCREEN: id]` · aggiornare GAP.md + CHANGELOG · YAML = 1 voce = 1 chunk RAG.
---
## HAL Knowledge — stato tecnico
| Componente | Stato |
|------------|:-----:|
| Motore | TF-IDF + Gemini (`hal_knowledge.py`, D-061) |
| YAML ingest | ✅ attivo |
| Corpus .md | PRD, ROADMAP, DECISIONS, AUDIT_M2, PROGRAMMA, ASPETTI, BUSINESS_MODEL |
| **Escluso** | ~~CHANGELOG.md~~ (B-ter) |
| Index | `hal-index.json` v0.2-cap6 |
| Live B-bis | `manual_hal_indexed: 56` ✅ |
| Post Cap. 6 | **Atteso 68** — reindex Founder da verificare |
**Reindex** (super_admin): `POST /api/app/hal/knowledge/reindex?force=true`
**Smoke Cap. 6**:
1. *Come attivo Subito.it?* → `portali.attivare-portale`
2. *Perché un annuncio è bloccato dalla compliance?* → `portali.compliance-hard`
3. *Come forzo un sync manuale?* → `portali.sync-manuale`
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
| 1 | Reindex HAL + smoke Cap. 6 | 🔴 Founder |
| 2 | Cap. 7 manuale (NON Match) | 🟢 |
| 3 | Billing UI listino Founder | 🟡 |
| 4 | B2C Stripe checkout | 🟡 |
| 5 | Screenshot kit (TASK D) | 🟡 |
---
## Micro-fix aperti
1. Cap. 1 §1.4 Portali: allineare testo a Cap. 6 (8 portali, non "Idealista integrato")
2. CHANGELOG TASK C: typo "Cap. 7 Match" → Match è Cap. 5
---
## Handoff nuova sessione
