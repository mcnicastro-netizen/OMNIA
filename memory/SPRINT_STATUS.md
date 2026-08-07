# OMNIA — Sprint Status (handoff agenti)
**Ultimo aggiornamento**: Feb 2026 (post-Cap. 11 H-bis · fix onestà 8 banche/9 Consap)  
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
| **G-bis** Micro-fix retrieval Cap. 9 `staging.crediti-costo` | ✅ | tags 6→14 · +correlato `staging.cos-e` · domanda_naturale doppia · a_cosa_serve arricchito · index v0.6.1-cap10-gbis · retrieval fix validated by testing_agent (top-1 sim 0.379 vs 0.334 fascicolo #2) |
| **H** Manuale Cap. 11 Mutui comparatore | ✅ | `11-mutui-comparatore.md` + 12 voci YAML · index **129 voci** · copertura mutui.py + mortgage_data.py (14 offerte 9 banche, TAEG IRR, Consap under-36, disclaimer 128-sexies TUB) |
| **H-bis** Allineamento D-051 Cap. 11 al codice | ✅ | Fix onestà: 9→**8 banche distinte** (banks_count=8), 11→**9 offerte Consap**, ING interamente fuori Consap. Voce YAML rinominata `mutui.offerte-14-banche-9` → `-banche-8`. Index v0.7.1-cap11-hbis. |
| **I** Manuale Cap. 12 HAL Knowledge | ✅ | `12-hal-knowledge.md` + 13 voci YAML · index **142 voci** · v0.8-cap12 · meta-doc RAG (motore TF-IDF+Gemini, corpus 7 file, soglie confidence 0.08/0.20, distinzione D-040 tre HAL, limiti v1). Copertura `hal_knowledge.py` 617 righe + `HalKnowledgePage.jsx` 307 righe. |
| **J** Manuale Cap. 13 Team & Ruoli (Collaboratori) | ✅ | `13-team-ruoli.md` + 13 voci YAML · index **155 voci** · v0.9-cap13 · magic-link invite 7gg, ruoli `agency_admin`/`agent` (segreteria = concetto operativo), 4 stati invito (pending/accepted/revoked/expired), upgrade role solo se client, token nel fragment (L5). Copertura `invites.py` + `agencies.py` + `MembersPage.jsx` + `InviteMemberModal.jsx` + `AcceptInvitePage.jsx`. |
| **K** Manuale Cap. 14 Import XML (Migrazione) | ✅ | `14-import-xml.md` + 13 voci YAML · index **168 voci** · v0.10-cap14 · flusso Preview→Commit, session TTL 10min in-memory, dedupe per reference_code, dry-run, tabelle mapping (18 tipi + 19 energetiche + 6 contratti + 25 features), zero riferimenti competitor. Copertura `xml_import.py` (192 righe) + `universal_xml.py` (546 righe) + `ImportXmlPage.jsx` (341 righe). |
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
| 11 | Mutui comparatore | 12 | ✅ v1.0.1 (H-bis: 8 banche, 9 Consap, ING interamente fuori Consap, disclaimer TUB 128-sexies) |
| 12 | HAL Knowledge | 13 | ✅ v1.0 (motore TF-IDF+Gemini 3 Flash, corpus 7 file + Cap. 1-11, soglie confidence, distinzione D-040 tre HAL, limiti v1) |
| 13 | Team & Ruoli (Collaboratori) | 13 | ✅ v1.0 (magic-link 7gg, ruoli agency_admin/agent, 4 stati invito, upgrade role solo se client, segreteria = concetto operativo) |
| 14 | Import XML (Migrazione) | 13 | ✅ v1.0 (flusso Preview→Commit, session 10min, dedupe reference_code, dry-run, tabelle mapping 18 tipi/19 energetiche/6 contratti/25 features, zero riferimenti competitor) |
| 15–26 | — | — | ⏳ |
| 27 | MLS Network | — | 🔒 placeholder |
| 28 | Academy | — | 🔒 frozen |
**Totale**: **14/26 capitoli (54%)** · **168 voci HAL** · **66 screenshot placeholder** in `screenshots-index.md`
**Convenzioni**: `[SCREEN: id]` · aggiornare GAP.md + CHANGELOG · YAML = 1 voce = 1 chunk RAG.
---
## HAL Knowledge — stato tecnico
| Componente | Stato |
|------------|:-----:|
| Motore | TF-IDF + Gemini (`hal_knowledge.py`, D-061) |
| YAML ingest | ✅ attivo |
| Corpus .md | PRD, ROADMAP, DECISIONS, AUDIT_M2, PROGRAMMA, ASPETTI, BUSINESS_MODEL |
| **Escluso** | ~~CHANGELOG.md~~ (B-ter) |
| Index | `hal-index.json` v0.10-cap14 |
| Live B-bis | `manual_hal_indexed: 56` ✅ |
| Post Cap. 10 | 117 voci ✅ reindex + smoke 3/3 PASS |
| Post G-bis | 117 voci ✅ reindex + smoke retrieval fix validato (testing_agent) |
| Post Cap. 11 | 129 voci ✅ reindex + smoke 3/3 PASS |
| Post H-bis | 129 voci ✅ reindex live (id voce rinominato + md5 cambiati) |
| Post Cap. 12 | 142 voci ✅ reindex live + smoke 3/3 PASS (high: 0.293/0.217/0.478) |
| Post Cap. 13 | 155 voci ⏳ reindex live pending (super_admin) |
| Post Cap. 14 | **168 voci** ⏳ reindex live pending (super_admin) |
**Reindex** (super_admin): `POST /api/app/hal/knowledge/reindex?force=true`
**Smoke Cap. 14**:
1. *Come importo il portafoglio da un altro gestionale?* → `import.cos-e` (o `import.checklist-migrazione`)
2. *Cosa succede se importo due volte lo stesso file XML?* → `import.dedupe`
3. *Posso importare i clienti da XML?* → `import.limitazioni-v1` (risposta onesta: **no**, solo immobili)
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
| 1 | Billing UI listino Founder | 🟡 |
| 2 | B2C Stripe checkout | 🟡 |
| 3 | Screenshot kit (TASK I) | 🟡 |
| 4 | Hard-gate crediti Virtual Staging (pre-check saldo) | 🟢 |
| 5 | Sito Web v2 · scope da definire (P0 Hero+Chi Siamo+Contatti+Footer + extractor esteso) | 🟠 aperta |
| 6 | Cap. 13+ manuale (candidati: HAL Legal · Team & Ruoli · Impostazioni · Domain Vault) | 🟢 |
---
## Micro-fix aperti
_Tutti chiusi. G-bis retrieval Cap. 9 applicato (Feb 2026)._
_**Rate limit HAL chat vs improve = SEPARATI CONFERMATO** (60/h ciascuno, no change al_agent.py — decisione Founder Feb 2026)._
---
## Handoff nuova sessione
