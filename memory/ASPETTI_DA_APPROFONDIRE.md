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

<!-- Aggiungere qui nuovi aspetti da approfondire con progressivo A-002, A-003, ... -->
