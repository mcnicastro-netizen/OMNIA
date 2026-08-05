# 📸 Screenshots Index — Manuale OMNIA

Questo file elenca i placeholder `[SCREEN: id]` presenti nel manuale e nelle voci HAL.
Ogni id è unico e riutilizzabile: se lo screenshot è già stato prodotto, riferirsi allo stesso id nei capitoli successivi.

**Convenzione**
- ID in `kebab-case`, con prefisso capitolo (es. `cap1-...`).
- Descrizione = cosa deve mostrare l'immagine (per chi la scatterà: te, uno stagista, o Playwright automation futura).
- Priorità: 🔴 essenziale · 🟡 utile · 🟢 nice-to-have.
- Note: eventuali dati sensibili da mascherare / cornici / annotazioni.

**Come usarlo**
1. Quando produci lo screenshot, aggiungi la data nella colonna **Fatto**.
2. Se cambi qualcosa nell'UI (rename, redesign), rimuovi la data → l'immagine va rifatta.
3. Nome file consigliato: `<id>.png` (es. `cap1-login-form.png`) in `/app/memory/manuale/screenshots/`.

---

## Capitolo 1 · Primo accesso

| # | ID | Cosa mostrare | Priorità | Note | Fatto |
|---|----|---------------|:-:|------|:-:|
| 1 | `cap1-orientamento-generale` | Schermata iniziale ImmoWeb con la barra a sinistra visibile, TopNav in alto e HAL button in evidenza (freccia o riquadro rosso). Usa una demo agency di prova. | 🔴 | Nascondere email reali. Preferibile viewport 1440×900. | — |
| 2 | `cap1-login-form` | Pagina di login (`/it/login`) con campi email/password vuoti. Focus sul pulsante "Accedi". | 🔴 | Nessun dato precompilato. Vuoto pulito. | — |
| 3 | `cap1-forgot-password` | Pagina "Password dimenticata" (`/it/forgot-password`) con campo email + pulsante "Invia link di recupero". | 🟡 | Vuoto pulito. | — |
| 4 | `cap1-onboarding-step4-conferma` | Ultimo passo dell'onboarding wizard: anteprima colori (primario + accento), tagline, tasto **Crea agenzia** in evidenza. | 🔴 | Usa colori demo (blu/oro tipico agenzia). Tagline esempio: *"Casa tua, dal 1985."*. | — |
| 5 | `cap1-sidebar-completa` | Barra a sinistra completa con tutte le voci visibili al ruolo **titolare** (Dashboard, Gruppo, API Keys, Importa, Portali, Immobili, Clienti, Match, Sito web, Virtual Staging, Mutui, HAL Legal, HAL Knowledge, Collaboratori, Piano & Crediti, Impostazioni). | 🔴 | Login come utente demo *agency_admin* attivo su agenzia demo. | — |
| 6 | `cap1-language-switcher` | Menu a tendina della lingua aperto in alto a destra, con IT/EN/ES visibili. Sfondo: dashboard sfocato. | 🟢 | Cattura in modalità *hover/open* del menu. | — |
| 7 | `cap1-selettore-agenzia` | Selettore agenzia aperto in alto a sinistra (utente attivo in 2 o più agenzie demo). | 🟡 | Serve creare un utente demo membro di 2 agenzie. Se costoso da preparare, rimuovere. | — |
| 8 | `cap1-profilo-utente` | Pagina Profilo utente con campi nome/cognome/foto/telefono + sezione **Sicurezza** con pulsante *Cambia password*. | 🟢 | Dati profilo demo, nessun contatto reale. | — |

**Totale Cap. 1**: 8 screenshot (5 essenziali, 2 utili, 1 nice-to-have).

---

## Capitolo 2 · Dashboard

| # | ID | Cosa mostrare | Priorità | Note | Fatto |
|---|----|---------------|:-:|------|:-:|
| 1 | `cap2-dashboard-panoramica` | Vista completa Dashboard subito dopo login: saluto in alto, griglia 6 KPI card, nota in fondo. | 🔴 | Usare agenzia demo *Immobiliare Rossi* con numeri realistici (non tutti 0, non tutti fittizi-perfetti). Consigliato: 12 immobili, 8 lead, 4 match, 2 visite, 3 collab, 1 invito. | — |
| 2 | `cap2-dashboard-kpi-6cards` | Solo la griglia dei 6 riquadri KPI in primo piano (senza header). Utile come "focus" nel manuale. | 🟡 | Stessi dati demo di sopra. Serve per legenda contatori. | — |

**Totale Cap. 2**: 2 screenshot (1 essenziale, 1 utile).

---

## Regole generali

**Ambiente**
- Ambito consigliato: preview URL (`REACT_APP_BACKEND_URL`) su viewport `1440×900`.
- Login come utente demo dedicato (mai founder / mai account reale).
- Nessun cliente reale, mai indirizzi reali, mai dati fiscali reali.

**Dati fittizi standardizzati**
Usa sempre gli stessi dati demo su tutto il manuale per coerenza:
- Agenzia: *Immobiliare Rossi S.r.l.*
- Titolare: *Marco Rossi · marco.rossi@immobiliarerossi.demo*
- Agente: *Anna Bianchi · anna.bianchi@immobiliarerossi.demo*
- Colori: primario `#1E40AF` · accento `#D97706`
- Città demo: *Belpasso (CT)*

**Formati**
- Formato: PNG.
- Peso: max 300 KB per screenshot (usa TinyPNG o `pngquant` se necessario).
- Aspect ratio: mantieni le proporzioni originali della viewport.

**Nomenclatura file**
`<id>.png` → esempio `cap1-login-form.png`

**Cartella**
Da creare al momento del primo screenshot: `/app/memory/manuale/screenshots/`.

---

## Storico modifiche

| Data | Note |
|------|------|
| Feb 2026 | Prima stesura index (Cap. 1) |
