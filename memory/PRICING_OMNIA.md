# 💰 OMNIA — Pricing Ufficiale v2.0

**v1.0 approvata dal founder**: 26 Giugno 2026 (Track A + crediti + B2C)
**v2.0**: 06 Luglio 2026 — aggiunto **listino Track B** (widget, API, feed) + benchmark documentali · **Stato v2.0**: 🟡 BOZZA in revisione Founder (deliverable M2.5.0/P0)
**Validità**: Fase 1 Founders 50 (lock-in 24 mesi) · Track B attivabile con M2.5

---

## 🎯 Filosofia di pricing

1. **Premium positioning, non penetration**: prezzi sopra Realgest (€16) e Gestim Pro (€47), in linea con Gestim Platinum (€125). OMNIA ha più valore (AI nativa + white-label + Valuator bank-grade + AL Legal anti-hallucination).
2. **Founders 50 = prezzo lock-in 24 mesi**, post-24m sconto 50% vita.
3. **Sistema crediti** (€0,30/cad) per servizi pay-per-use.
4. **Annunci agenzia gratis** sul portale ImmobilCloud (incentive parte del valore SaaS).
5. **MVP fase 1 manuale**: nessun algoritmo complesso, billing manuale per primi 30 Founders. Algoritmo "boost per ogni 10 annunci" → fase 2 quando 30+ clienti.
6. **[v2.0] Doppio Binario (D-041)**: ogni feature è vendibile anche via widget/API con wallet crediti (Track B). Regole d'oro dai benchmark: listino sempre pubblico · crediti chiari (mai coins opachi) · flat+overage (mai pay-per-call puro verso le agenzie) · badge "Powered by OMNIA" sul free tier = canale di acquisizione.
7. **[v2.0] Anti bait&switch**: nessuno sconto-esca. I competitor scontano il 50-69% l'anno 1 e raddoppiano al 13° mese (caso documentato: pack Idealista+Casa.it €194,50 → €389/mese, rinnovo automatico). Da noi il prezzo mostrato è il prezzo mantenuto.

---

## 🏢 ImmoWeb — Gestionale B2B (canone mensile)

| | **Starter** | **Pro** | **Agency** |
|---|---|---|---|
| **Founders 50 (24 mesi)** | **€39/mese** | **€99/mese** | **€249/mese** |
| **Standard post-Founders** | €59/mese | €179/mese | €349/mese |
| **Sconto vita post-Founders** | €44/mese | €124/mese | €274/mese |
| Utenti inclusi | 3 | 4-20 | 21+ |
| **Crediti inclusi/mese** | 20 (€6 val.) | 200 (€60 val.) | 600 (€180 val.) |
| Multiposting portali | 3 | 8 | Tutti + custom |
| White-label dominio | ❌ | ✅ | ✅ + SSO custom |
| Feature AI base (chatbot, lead scoring) | ✅ | ✅ | ✅ |
| AL Legal anti-hallucination | ✅ | ✅ | ✅ |
| AL Improve copywriter inline | ❌ | ✅ | ✅ |
| Valutatore Pro UNI 10750 | ✅ | ✅ | ✅ + API |
| Supporto | Email 48h | Email 24h + Chat | Dedicato 4h SLA |

### 📌 Note operative
- Pagamento mensile o annuale (10% sconto annuale)
- Nessuna penale di disdetta dopo lock-in 24 mesi (mensile = no lock-in)
- Carta di credito obbligatoria all'onboarding (Stripe)

---

## 💳 Sistema Crediti (€0,30/credito)

### Pricing servizi pay-per-use

| Servizio | Costo vivo OMNIA | Crediti consumati | Prezzo finale | Margine OMNIA |
|---|---|---|---|---|
| Virtual Staging (1 render, pipeline 3-stage) | €0,056 | **3 crediti** *(v2.0: era 1)* | **€0,90** | **94%** |
| Quotazione immobiliare base | €0,04 | 1 credito | €0,30 | **87%** |
| Quotazione avanzata UNI 10750 *(v2.0)* | €0,08 | 2 crediti | €0,60 | **87%** |
| Query HAL Legal *(v2.0)* | ~€0,03 | 2 crediti | €0,60 | **95%** |
| Micro-tour video 5s *(v2.0, da M5.S4.3)* | €0,30 | 12 crediti | €3,60 | **92%** |
| Visura catastale | €0,40 | 4 crediti | €1,20 | **67%** |
| Planimetria catastale | €6,90 | 30 crediti | €9,00 | **23%** |
| Ispezione ipotecaria | €23,70 | 100 crediti | €30,00 | **21%** |

> **Nota v2.0 — staging da 1 a 3 crediti**: a €0,30 eravamo sotto il minimo di mercato senza necessità (retail AI $0,53-2,67/foto; il più aggressivo, Stagently, sta a $0,20 con qualità inferiore alla pipeline 3-stage OMNIA). A €0,90 restiamo sotto il retail di qualità con margine 94%.

### Pacchetti top-up crediti (ricarica)

| Pacchetto | Crediti | Prezzo | €/credito | Sconto |
|---|---|---|---|---|
| Mini | 100 | €34,90 | €0,35 | base |
| **Standard** | 500 | €149 | €0,30 | 14% |
| Plus | 1.500 | €399 | €0,27 | 23% |
| Power | 5.000 | €1.199 | €0,24 | 31% |

### ⏳ Servizi RIMOSSI dalla suite v1.0
- ❌ **APE (certificato energetico)**: rimosso. Costi vivi €130-180/cad, margine troppo basso. Da reintrodurre in v2.0 con contratto enterprise APEFACILE/Whuis quando avremo volumi (>100 APE/mese).

---

## 🅱️ TRACK B — Listino Widget & API (v2.0, attivabile con M2.5)

> Per agenzie strutturate/franchising che mantengono il proprio CRM/sito e consumano feature OMNIA via widget e API (D-041). Benchmark completi in `COMPETITIVE_ANALYSIS_TRACK_B.md`.

### B1. Widget embeddabili (flat mensile per sito/filiale + overage a crediti)

| Widget | Prezzo | Incluse/mese | Benchmark concorrenti | Posizionamento |
|---|---|---|---|---|
| **Valuator** (UNI 10750, copertura nazionale ~7.900 comuni) | **€39/mese** · €79/mese con API + PDF brandizzato | 50 · 150 valutazioni | DomusReport €50/€100 · RealAdvisor €50-150 · Sprengnetter ~€45 | -22% sotto DomusReport con motore superiore (perizia-style vs solo-OMI) |
| **HAL Legal pubblico** | **€69/mese** | 100 query | Zero comparabili verticali; chatbot generici $99-399/mese | Prodotto hero, pricing power pieno |
| **Mutui** (rata + comparatore) | **€19/mese** | illimitato | Inesistente in white-label in Italia | Lead magnet; profit futuro: rev-share mediatore OAM (~€750/pratica) |
| **Virtual Staging demo** | solo in bundle | 10 render | Nessuno lo offre come widget | Differenziatore |
| **🎁 Bundle Widget Suite** (tutti e 4) | **€119/mese** | quote singole +20% | ~costo del solo DomusReport Premium + un chatbot generico | Anchor price |

Overage widget: a crediti, stessa tabella del Sistema Crediti (listino pubblico).

### B2. API server-to-server (wallet crediti)

- Stesso sistema crediti (€0,30/credito, pacchetti top-up con sconto fino a -31%) e stessa tabella servizi — **un solo listino, zero ambiguità**.
- Contabilità crediti **group vs branch** per reti multi-sede (holding paga o filiale paga, sceglibile per gruppo — schema dati in M2.5.1).
- Rate limit per tier, audit log, revoca API key da dashboard (M2.5.2).
- Benchmark: valutazione €0,30-0,60 vs Sprengnetter €0,80/call e €47,80/valutazione pro · staging €0,90 vs retail $0,53-2,67.

### B3. Feed & connettività

| Servizio | Prezzo | Note |
|---|---|---|
| Feed OSF outbound (portali/sito) | incluso in tutti i piani | già live (M2.S5) |
| **Feed inbound continuo** (dal gestionale cliente, sync 15-60 min) | **€49/mese per fonte** | deduplica + delta detection (M2.5.4) |
| Webhook lead → CRM cliente | incluso con feed o bundle | |
| **Free tier developer** | €0 — 25 azioni/mese | badge "Powered by OMNIA" obbligatorio (canale web agency) |
| Enterprise / casa madre franchising (multi-branch, rollup, SLA) | ⏸️ custom | rimandato con tier Enterprise (decisione Founder 26-Giu) — si riapre con M2.5.1 |

### B4. Benchmark documentale — il confronto che vende (Fronte 8)

Stack reale di un'agenzia media (contratti documentati, Nov 2025):

| | Anno 1 (scontato) | Anno 2+ (a regime) |
|---|---|---|
| Agestanet (gestionale+sito+WebMLS) | €650 | €850 |
| Immobiliare.it (10 annunci) | €708 | €2.268 (listino) |
| Pack Idealista+Casa.it (15 annunci, rinnovo automatico) | €2.334 | €4.668 (**+100% al 13° mese**) |
| **Totale stack tradizionale** | **€3.692/anno** | **€7.786/anno** |
| **OMNIA Pro Founders 50** | **€1.188/anno** | **€1.188/anno** (lock 24m → €124/mese a vita) |
| **Risparmio** | **-68%** | **-85% (~€6.600/anno)** |

Stack equivalente a OMNIA Pro comprato à la carte dai concorrenti: gestionale €47-150 + valutatore white-label €45-150 + staging €18-73 + chatbot €280+ + MLS €83-125 = **€473-878/mese** vs €99.

⚠️ **Regola di messaging (D-045)**: il confronto NON promette l'abbandono dei portali — pitch "riduci e possiedi" (OMNIA + i soli portali che servono).

---

## 🌐 ImmobilCloud — Portale B2C (privati)


### Pubblicazione annunci privati

| Servizio | Prezzo OMNIA | Note |
|---|---|---|
| Primi 2 annunci attivi | **GRATIS** | Allineato Idealista/Immobiliare.it |
| Annuncio extra (dal 3°, 90gg visibilità) | **€14,90** | -25% vs Idealista |
| Immobili >€1M / Affitti >€2.500/mese | **€19,90** | Tariffa speciale |
| Nascondi indirizzo | **€5,90** | -40% vs Idealista (€9,90) |
| Foto extra (pacchetto 10 foto) | **€3,90** | n/a |

### Boost visibilità privati

| Boost | Durata | Prezzo OMNIA | vs Idealista | vs Immobiliare.it |
|---|---|---|---|---|
| Premium | 30gg | **€19,90** | -33% vs €29,90 | -41% vs €34 medio |
| Premium | 90gg | **€49,90** | n/a | -38% vs €79 medio |
| Premium | 180gg | **€89,90** | n/a | -35% vs €139 medio |
| TOP | 30gg | **€29,90** | -19% vs €36,90 | -45% vs €54 medio |
| TOP | 90gg | **€79,90** | n/a | -27% vs €109 medio |
| TOP | 180gg | **€149,90** | n/a | -22% vs €189 medio |

**Strategia**: sconto aggressivo 25-45% sotto Idealista per Fase 1 (acquisition). Da Fase 2 (12+ mesi) riallinearci al -15%.

---

## 🌐 ImmobilCloud — Annunci Agency (B2B)

### Annunci INCLUSI nel canone gestionale

Ogni agenzia ImmoWeb ha annunci portale gratis per tier:
- **Starter**: 15 annunci attivi
- **Pro**: 50 annunci attivi
- **Agency**: 70 annunci attivi

### Pacchetti annunci EXTRA (oltre limite incluso)

| Pacchetto | Annunci | Prezzo | €/annuncio | Validità |
|---|---|---|---|---|
| Small | 10 | **€69** | €6,90 | 90 giorni |
| Medium | 30 | **€179** | €5,97 | 90 giorni |
| Large | 100 | **€499** | €4,99 | 90 giorni |

### Boost gratuiti inclusi (logica MVP fase 1)

⚠️ **Fase 1 (Founders 50)**: boost fissi mensili, gestione manuale. Algoritmo "per ogni 10 annunci" → Fase 2.

| Tier | Premium gratis/mese | TOP gratis/mese |
|---|---|---|
| **Starter** | 5 Premium | 0 TOP |
| **Pro** | 15 Premium | 5 TOP |
| **Agency** | Premium illimitati* | TOP illimitati* |

*Fair use cap nascosto: max 50 Premium + 30 TOP simultaneamente attivi per Agency.*

### Boost EXTRA agency (oltre quote gratis)

| Tier | Premium oltre quota | TOP oltre quota |
|---|---|---|
| Starter | **€11,90** | **€17,90** |
| Pro | **€11,90** | **€17,90** |
| Agency | **€19,90** (>100 annunci totali) | Cap fair-use (no extra charge) |

### 📐 Algoritmo Boost Allocation (Fase 2, da costruire a 30+ clienti)

**Logica futura granulare**:
- Starter: 2 Premium gratis per ogni 10 annunci pubblicati nel mese
- Pro: 3 Premium + 1 TOP gratis per ogni 10 annunci nel mese
- Agency: illimitati con fair-use cap

**Implementazione tecnica (~2-3 giorni)**:
- Nuova collection MongoDB `agency_billing_periods`
- Funzione `evaluate_boost_request(agency_id, boost_type) → (is_free, charge)`
- Cron job mensile chiusura periodo + apertura nuovo
- Algoritmo ranking TOP: 70% quality score + 30% round-robin

**Dashboard agente**:
- Card "Hai usato X/Y Premium gratis questo mese"
- Card "Hai usato Z/W TOP gratis questo mese"
- Upsell automatico: *"Sei vicino al limite — passa a Pro per più boost gratis"*

---

## 📈 Break-even & Proiezioni (numeri REALI — aggiornato 26-Giu-2026)

### ⚠️ Premessa onestà
Il primo calcolo presentato al founder considerava solo i costi tecnici (€220/mese → break-even 8-10 agenzie). Questo era **incompleto**. Il calcolo definitivo include TUTTI i costi reali di gestione società.

### Costi fissi mensili TOTALI (no stipendi, no costo founder)

#### Costi tecnici
| Voce | €/mese |
|---|---|
| Server Emergent (preview + scale) | 60 |
| Resend (>3k mail piano paid) | 20 |
| Tavily API (AL Legal) | 30 |
| Emergent LLM key (Gemini/Claude) | 40 |
| OpenAPI visure (abbonamento base) | 30 |
| fal.ai virtual staging (anticipo) | 40 |
| Dominio Aruba + Cloudflare Free | 1 |
| **Subtotale tecnici** | **€220** |

#### Costi business / società
| Voce | €/mese |
|---|---|
| Commercialista mensile (SRL semplificata) | 150 |
| Conto corrente business (Fineco/Hype Business) | 15 |
| LinkedIn Sales Navigator (per outreach Founders 50) | 80 |
| Calendly Pro + tools accessori | 20 |
| Assicurazione professionale (cyber + RC) | 50 |
| **Subtotale business** | **€315** |

#### Apertura società una-tantum (ammortizzata 24 mesi)
| Voce | Totale | €/mese (su 24m) |
|---|---|---|
| Apertura SRL semplificata (notaio + bolli + setup) | 2.000 | 85 |
| **Subtotale ammortamento** | | **€85** |

#### Stripe fees (variabile, scala con MRR)
| Scenario | MRR | Fee Stripe (~2,5%) |
|---|---|---|
| 10 agency mix | €700 | €20 |
| 25 agency mix | €1.800 | €50 |
| 50 agency (Founders 50 pieno) | €3.900 | €100 |

### 🧮 TOTALE costi fissi mensili

| Scaling | Tecnici | Business | Ammortam. | Stripe | **TOTALE** |
|---|---|---|---|---|---|
| 10 agency | €220 | €315 | €85 | €20 | **€640** |
| 25 agency | €220 | €315 | €85 | €50 | **€670** |
| 50 agency | €220 | €315 | €85 | €100 | **€720** |

---

### Margine netto per agenzia (Founders 50, costi vivi inclusi)

Ogni agenzia consuma anche **crediti inclusi** nel canone (costi vivi OMNIA):

| Tier | Canone Founders | Costi vivi medi | **Margine netto/mese** |
|---|---|---|---|
| Starter (€39) | €39 | €5 (1 visura + 5 staging) | **€34** |
| Pro (€99) | €99 | €20 (5 visure + 30 staging) | **€79** |
| Agency (€249) | €249 | €55 (15 visure + 1 planimetria + boost) | **€194** |

---

### Scenari break-even REALI

#### Scenario PEGGIORE (tutte Starter)
- Coprire €640 con margine €34/Starter → **19 Starter** richieste
- MRR break-even: €741

#### Scenario REALISTICO (mix 60/30/10)
- 6 Starter + 3 Pro + 1 Agency = **10 agency totali**
- MRR: 6×39 + 3×99 + 1×249 = €780
- Margine netto: 6×34 + 3×79 + 1×194 = **€633/mese** ≈ break-even ✅

#### Scenario MIGLIORE (più tier Pro/Agency)
- 4 Pro + 2 Agency = **6 agency totali**
- MRR: 4×99 + 2×249 = €894
- Margine netto: 4×79 + 2×194 = €704 ✅ (sopra €640)

#### Scenario Founders 50 PIENO
- 30 Starter + 15 Pro + 5 Agency = **50 agency**
- MRR: €3.900
- Margine netto: 30×34 + 15×79 + 5×194 = **€3.175/mese**
- Costi: €720
- **Profitto netto: €2.455/mese = €29.460/anno**

---

### 🎯 Numeri chiave da ricordare

| Metrica | Valore |
|---|---|
| **Soglia "no-loss" minima** | **10-12 agenzie attive** (mix realistico) |
| **Soglia per profitto serio** | 15+ agenzie attive |
| **MRR break-even** | ~€700/mese |
| **Trigger go-live commerciale** | 15 Founders firmati & paganti |
| **Profitto Founders 50 pieno** | €29.460/anno netti (escluso crediti, boost extra, pacchetti annunci) |
| **Revenue extra potenziale** (crediti, boost, annunci agency, privati B2C, perizie ufficiali se reintrodotte) | +30-60% sopra MRR base |

---

### 📌 Condizione attivazione sistema (decisa dal founder)

> *"L'ecosistema entrerà in funzione solo quando avranno aderito il numero minimo necessario per non generare perdite."*

**Numero magico**: **15 agenzie Founders firmate e paganti** (Stripe attivo, carta caricata, primo mese pagato).

A 15 paganti: copri tutti i costi + generi €300-600/mese di buffer → go-live commerciale ufficiale.

Sotto 15 paganti: continua il warm-up/beta privata con i Founders pilota, niente lancio massiccio.

---

## 🚫 Decisioni esplicite del founder

| Topic | Decisione | Motivazione |
|---|---|---|
| Referral program | ❌ NO (per ora) | Founder vuole valutare dopo |
| APE come servizio | ❌ Rimosso v1.0 | Margine troppo basso, ricomporre v2.0 con contratto enterprise |
| Pricing a vita lock-in | ❌ NO | Solo lock-in 24 mesi + sconto 50% vita post-Founders |
| **Enterprise tier (>20 utenti, multi-sede, SLA dedicato)** | ⏸️ **RIMANDATO a sessione separata futura** | *"Voglio ragionarci ancora"* (founder 26-Giu-2026) |
| **Custom API per clienti Enterprise** | ⏸️ **RIMANDATO insieme a Enterprise tier** | Da definire insieme al pricing Enterprise — possibili modelli: per-call pricing, flat enterprise contract, revenue share |
| Algoritmo boost granulare | ⏸️ Fase 2 (post 30 clienti) | YC principle: "do things that don't scale" |
| Privati 1° annuncio | ❌ NO charge | 2 annunci gratis allineati Idealista/Immobiliare.it |

---

## 🌐 Mercati internazionali (visione pricing)

### Italia (Fase 1)
Pricing sopra in EUR. Founders 50 sul territorio nazionale.

### Spagna (Fase 2, da 12+ mesi)
- Stessa struttura, conversione EUR (mercato Eurozona)
- Posizionamento sotto Idealista ES e Fotocasa
- Sender mail: `info@omniarealestateecosystem.es` (nuovo dominio da registrare quando si arriverà)

### Portogallo (Fase 2.5)
- Lingua PT da aggiungere a i18n
- Pricing -10% vs Italia (mercato più piccolo)

### Francia + Germania (Fase 3, 24+ mesi)
- Pricing +15% vs Italia (mercati premium)
- Localizzazione legale necessaria

### USA (Fase 4, 36+ mesi)
- Solo via partnership con MLS regionali
- Modello B2B2C, OMNIA come SaaS licensed a partner USA
- Pricing in USD, premium positioning (Starter $79 / Pro $199 / Agency $499)

### Cina + Paesi Arabi (Fase 5+)
- Licensing model, non SaaS diretto
- Royalty 15% su fatturato locale
- Necessitano CEO locali + partner strategici

---

## 📋 Changelog pricing

| Data | Versione | Modifiche |
|---|---|---|
| 06-Lug-2026 | **v2.0** 🟡 bozza | Aggiunto listino **Track B** (widget €19-119/mese, API a crediti, feed inbound €49/mese, free tier dev 25 azioni). Staging 1→3 crediti (€0,90). Nuovi servizi a crediti: quotazione UNI 10750, query HAL Legal, micro-tour video. Benchmark documentale Fronte 8 (stack reale €7.786/anno a regime vs OMNIA -85%). Regole messaging D-045 |
| 26-Giu-2026 | v1.0 | Pricing definitivo Founders 50 approvato dal founder |
| 25-Giu-2026 | v0.9 (draft) | Prima proposta €29/€79/€199 |

---

## 🔄 Riferimenti per implementazione

Quando si arriverà a costruire:
- **Landing `/it/agenzie`**: usa colonna "Founders 50" delle tabelle sopra
- **Banner CTA**: messaggio "50 strumenti come questo nella suite OMNIA — Founders 50, prezzo bloccato 24 mesi"
- **Onboarding Stripe**: Founders 50 tier in `stripe_products.json`
- **Dashboard agency**: mostra crediti residui, boost gratis residui, fattura corrente
- **Demo letale 3 min**: chiudere con CTA "Founders 50 — solo X/50 posti rimasti"
