# 📋 DECISIONS LOG — OMNIA

Registro di tutte le decisioni di business e tecniche prese durante il progetto.
**Una decisione qui = non si rimette in discussione senza buon motivo.**

---

## Decisioni prese

### D-001 — Architettura ecosistema a 3 pilastri
- **Data**: Gennaio 2026
- **Contesto**: Definizione visione iniziale
- **Decisione**: OMNIA è un ecosistema composto da 3 app: ImmobilCloud (B2C portale), ImmoWeb (B2B CRM agenzie), Omnia Academy (formazione)
- **Razionale**: Schema PDF "progetto Omnia" del Founder
- **Stato**: ✅ Confermata

### D-002 — Stack tecnologico base
- **Data**: Gennaio 2026
- **Decisione**: React (frontend) + FastAPI (backend) + MongoDB (DB) + Emergent Platform (hosting)
- **Razionale**: Coerenza con repo esistenti IMMOWEB e Immocloud-2.0, stack già rodato
- **Stato**: ✅ Confermata

### D-003 — Modello business
- **Data**: Gennaio 2026
- **Decisione**: SaaS multi-tenant con 3 piani agenzia (Founder €29, Pro €49, Agency €149) + sistema crediti pay-as-you-go + free tier B2C
- **Razionale**: Standard SaaS, già impostato in PRD esistenti, Stripe già integrato
- **Stato**: ✅ Confermata (prezzi da rifinire in M4.S3)

### D-004 — Programma operativo 6 milestone
- **Data**: Gennaio 2026
- **Decisione**: Accettato programma di 29 sessioni / 12-18 settimane, da M1 (Foundation) a M6 (Academy)
- **Razionale**: Risposta Founder "SI-SI-SI" su tempo, budget, agenzie pilota
- **Stato**: ✅ Confermata

### D-005 — Posizione documenti strategici
- **Data**: Gennaio 2026
- **Decisione**: Tutti i documenti strategici vivono in `/app/memory/` nel workspace attivo, non nei repo IMMOWEB o Immocloud-2.0 esistenti
- **Razionale**: I 2 repo esistenti sono boilerplate quasi vuoti; la nuova architettura monorepo (o decisione contraria in M1.S1) determinerà destinazione finale GitHub
- **Stato**: ✅ Confermata

---

## Decisioni pendenti (da risolvere in M1.S1)

### D-006 — Monorepo vs multi-repo
- **Quando**: M1.S1
- **Opzioni**:
  - A) Monorepo Turborepo unico `omnia` con apps/immocloud, apps/immoweb, apps/academy, packages/shared
  - B) 3 repo separati con shared package npm
- **Raccomandazione E1**: Opzione A (monorepo)
- **Stato**: ⏸️ Pending

### D-007 — Nome dominio principale
- **Quando**: M1.S1
- **Opzioni**: omnia.realestate, omnia.immobili, omnia-re.it, altro
- **Stato**: ⏸️ Pending

### D-008 — Schema sottodomini
- **Quando**: M1.S1
- **Opzioni**:
  - A) immocloud.omnia.xx / app.omnia.xx / academy.omnia.xx
  - B) Path-based: omnia.xx/portale, omnia.xx/app, omnia.xx/academy
  - C) Domini separati: immocloud.xx, immoweb.xx, academy.xx
- **Stato**: ⏸️ Pending

### D-009 — Database multi-tenant
- **Quando**: M1.S1
- **Opzioni**:
  - A) Singolo MongoDB con campo `agency_id` su ogni collection (shared schema)
  - B) Database separato per ogni agenzia (isolated)
  - C) Singolo DB ma collection separate per agenzia (hybrid)
- **Raccomandazione E1**: Opzione A all'inizio, migrazione a B se servisse per enterprise
- **Stato**: ⏸️ Pending

---

## Decisioni rinviate (da risolvere più avanti)

### D-FUTURE-01 — Tabella prezzi crediti
- **Quando**: M4.S4
- **Note**: Definire quanti crediti per visura, valutazione, Top visibility, SMS, ecc.

### D-FUTURE-02 — Regole MLS inter-agenzia
- **Quando**: M4.S1
- **Note**: Split commissioni, durata esclusiva, escalation conflitti

### D-FUTURE-03 — Accreditamento FIAIP/FIMAA Academy
- **Quando**: M6.S5
- **Note**: Contattare ordini professionali, capire requisiti
