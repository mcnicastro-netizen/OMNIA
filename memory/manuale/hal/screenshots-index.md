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

## Capitolo 3 · Immobili

| # | ID | Cosa mostrare | Priorità | Note | Fatto |
|---|----|---------------|:-:|------|:-:|
| 1 | `cap3-property-form-nuovo` | Form completo *"+ Nuovo immobile"* con i campi principali visibili (Titolo, Tipologia, Operazione, Indirizzo, Prezzo, Superficie), tab Foto in fondo. | 🔴 | Campi vuoti o con dati demo *Immobiliare Rossi*. Sezione "Privacy" visibile in basso. | — |
| 2 | `cap3-import-csv-flow` | Pagina Importa scheda **📋 Template CSV**: dropzone tratteggiata + link "Scarica template" + preview tabella prime 5 righe. | 🔴 | Consigliato: mostrare fase 3 con tabella già popolata (dati demo). | — |
| 3 | `cap3-xml-import-preview` | Pagina **Importa** (`/app/import`) dopo click "Analizza contenuto": report analisi con ripartizioni per tipologia/città e warning. | 🟡 | Usare un feed XML demo con ~50 immobili. | — |
| 4 | `cap3-photos-dropzone-cover` | Sezione Fotografie in form immobile: dropzone + 4-6 miniature con badge ⭐ Copertina sulla prima. | 🔴 | Foto demo interni case (senza persone). | — |
| 5 | `cap3-privacy-selector` | Menu/riquadro privacy con L1/L2/L3/L4 e descrizione a lato di ciascuno. | 🔴 | Selezionato L2 con etichetta *"Consigliato per la maggior parte degli annunci"*. | — |
| 6 | `cap3-state-select` | Menu Stato aperto: Bozza · Pubblicato · Prenotato · Venduto · Affittato · Ritirato. | 🟡 | Ricorda evidenziare "Pubblicato" con checkmark. | — |
| 7 | `cap3-fascicolo-checklist` | Vista Fascicolo con checklist 10 documenti: alcuni ✅ (APE, Visura), alcuni ⚠️ (Planimetria, Atto), alcuni ⬜ (facoltativi). | 🔴 | Immobile demo tipologia *Appartamento* (mostra anche righe condominio). | — |

**Totale Cap. 3**: 7 screenshot (5 essenziali, 2 utili).

---

## Capitolo 4 · Clienti

| # | ID | Cosa mostrare | Priorità | Note | Fatto |
|---|----|---------------|:-:|------|:-:|
| 1 | `cap4-client-form-nuovo` | Form completo *"+ Nuovo cliente"*: sezione **Anagrafica** compilata con dati demo, sezione **Preferenze di ricerca** con campi visibili, spunta GDPR attiva. | 🔴 | Dati demo: cliente *Anna Verdi · anna.verdi@example.it · +39 333 000 0001 · Acquirente · Nuovo · Origine: Idealista*. | — |
| 2 | `cap4-preferences-form` | Solo sezione **Preferenze di ricerca** con multi-select tipologie + città + range prezzo/superficie compilati. | 🔴 | Preferenze demo: Appartamento + Attico, Belpasso, €150k-€250k, 80-120 m², 3 locali min. | — |
| 3 | `cap4-import-csv-flow` | Pagina **Importa clienti** scheda **📋 Template CSV** dopo caricamento file demo: dropzone + preview tabella prime 5 righe. | 🔴 | 5 righe demo con nomi variegati (Rossi, Bianchi, ecc.). | — |
| 4 | `cap4-smart-import-ai-preview` | Scheda **⚡ Import AI** dopo caricamento file "brutto" (Excel vecchio): tabella preview con badge confidenza per riga. | 🔴 | Includere 1-2 righe evidenziate in giallo *"sotto soglia confidenza"*. | — |
| 5 | `cap4-property-seller-link` | Form immobile con campo *"Cliente venditore / proprietario"* aperto: risultati ricerca (dropdown con 3-4 clienti trovati) o messaggio *"Nessun cliente venditore trovato"*. | 🟡 | Mostra sia lo stato "collegato" sia lo stato "vuoto con suggerimento crea". | — |
| 6 | `cap4-smart-sorting-buckets` | Vista lista Clienti con **linguette bucket** attive in alto: *Tutti · Da chiamare oggi · Roventi 🔥 · Caldi 🌶️ · Tiepidi ☀️ · Freddi ❄️ · Acquirenti · Venditori*. Selezionato "Roventi". Tabella sotto con 5-6 clienti + badge temperatura + numero match + azioni rapide (Chiama, WhatsApp). | 🔴 | Il più importante di questo capitolo. | — |

**Totale Cap. 4**: 6 screenshot (5 essenziali, 1 utile).

---

## Capitolo 5 · Match

| # | ID | Cosa mostrare | Priorità | Note | Fatto |
|---|----|---------------|:-:|------|:-:|
| 1 | `cap5-matches-lista` | Vista principale **Match** con filtro Score minimo `50+ buoni` (default). Elenco 6-8 righe con badge temperatura colorati (rovente/caldo/tiepido/freddo). | 🔴 | Mix di temperature per illustrare la scala visivamente. | — |
| 2 | `cap5-temperature-legenda` | Focus/zoom sui 4 badge temperatura affiancati con range punti sotto ciascuno (`85-100`, `65-84`, `40-64`, `<40`). Può essere anche un banner tabellare. | 🔴 | Utile come "focus" nel manuale. | — |
| 3 | `cap5-scoring-breakdown` | Dettaglio match aperto: sezione **Breakdown** con barre orizzontali per ciascuno dei 14 criteri + punti (es. `Prezzo 15/17`, `Città 12/12`, `Zona 2/5`). Sezione **Cosa manca** con 2-3 righe testuali (es. *"Zona non tra le preferite"*). | 🔴 | Il più importante di Cap. 5. Serve al titolare per capire come è composto lo score. | — |
| 4 | `cap5-lista-filtri` | Vista Match con menu filtro Score minimo aperto (dropdown con le 4 opzioni: 40+/50+/65+/85+). | 🟡 | Frame catturato con dropdown espanso. | — |
| 5 | `cap5-lead-scoring-ai` | Lista Clienti con bottone **⚡ Aggiorna AI (N)** in alto e alcuni clienti con badge temperatura misti. | 🟡 | Riusabile anche in Cap. 4 (già catalogato lì). Duplicare solo se si vuole enfasi. | — |

**Totale Cap. 5**: 5 screenshot (3 essenziali, 2 utili).

---

## Capitolo 6 · Portali / Publishing

| # | ID | Cosa mostrare | Priorità | Note | Fatto |
|---|----|---------------|:-:|------|:-:|
| 1 | `cap6-portali-panoramica` | Pagina **Portali** con hero + 3 metric card in alto (Portali attivi, Disponibili, Catalogo totale) + banner ambra "Compliance HARD attiva + Sync automatico" + tab switcher Attivi/Disponibili sotto. | 🔴 | Agenzia demo *Immobiliare Rossi* con 2 portali attivi (Subito + Bakeca) e 6 disponibili. | — |
| 2 | `cap6-catalog-disponibili` | Scheda **Disponibili** aperta: tabella con 6-8 portali, colonna "Traffico" con stelle, colonna "Modalità" (feed_pull / api_push), bottone verde **Attiva** a destra su ogni riga. | 🔴 | Ordinamento traffic_score decrescente (Subito in cima con ★★★★★). | — |
| 3 | `cap6-modale-attivazione` | Modale **Attiva [portale]**: nome portale in header, note descrittive, form credenziali (es. campo Username per Subito), bottoni "Annulla" (grigio) + "Attiva portale" (verde). | 🔴 | Portale scelto: Wikicasa con campo "API Key" visibile. | — |
| 4 | `cap6-sync-manuale-esito` | Scheda **Attivi** con banner **emerald** sopra la tabella: "Sync subito — 8 immobili pubblicabili, 2 bloccati dal validatore compliance". Riga portale Subito con "Ultimo sync: oggi 14:23 · 8 pubblicati · 2 bloccati". | 🔴 | Banner ha ✕ chiudibile a destra. Nella riga si vedono 3 azioni: Sync, Compliance, Disattiva. | — |
| 5 | `cap6-modale-compliance` | Modale **Compliance Subito.it**: 4 metric card in griglia (Totale 10, Pubblicabili 8, Bloccati 2, Con warning 3) + sezione "Motivi blocco più frequenti" con 3 righe rosse (es. "Meno di 3 foto: 9 immobili") + lista "Immobili bloccati (primi 20)" con titolo + motivi + link "Correggi →". | 🔴 | Il più importante del capitolo. Serve al titolare per capire l'operatività. | — |
| 6 | `cap6-wizard-step4-conferma` | Step 4 del **Wizard Custom Portal**: box con URL feed OMNIA della tua agenzia (es. `.../api/publishing/feed/immobiliare-rossi.xml?dialect=osf_federata`) + bottone **Copia** a destra (dopo il click mostra "Copiato ✓"). | 🟡 | Portale demo custom: "Portale AgenziaLiguria" con dialect osf_federata. | — |

**Totale Cap. 6**: 6 screenshot (5 essenziali, 1 utile).

---

## Capitolo 7 · Fascicolo Immobile

| # | ID | Cosa mostrare | Priorità | Note | Fatto |
|---|----|---------------|:-:|------|:-:|
| 1 | `cap7-fascicolo-panoramica` | Vista d'insieme pagina Fascicolo: hero immobile (titolo/città/tipologia/superficie) + card Prezzo annuncio + card Stima AI + badge coerenza. Poi checklist + sezione Analisi HAL sotto. | 🔴 | Agenzia demo *Immobiliare Rossi*, immobile appartamento Belpasso 95 m². | — |
| 2 | `cap7-fascicolo-stima-badge` | Focus/zoom sulle 3 card in alto: Prezzo annuncio (es. € 195.000) + Stima AI (media + banda min-max, es. € 178.000 · 165k-195k) + badge celeste *In linea con la stima AI*. | 🔴 | Serve come esempio didattico dei 3 stati badge (verde/celeste/ambra). Preparare 3 varianti se possibile. | — |
| 3 | `cap7-checklist-vista` | Vista completa checklist documentale: 5 righe obbligatorie (3 verdi ✅ + 2 rosse 🔴 mancanti), 3 righe consigliate grigie ⚪, 2 righe condominio grigie. Barra progresso in alto `3/5 obbligatori` in ambra. | 🔴 | Il più importante del capitolo. Includere nota inline "APE non caricato ma classe A dichiarata" sulla riga rossa APE. | — |
| 4 | `cap7-upload-flow` | Modale/riga di upload documento: bottone **⬆ Carica** in stato *"..."* (loading) su una riga rossa (es. Planimetria catastale). Sotto la riga, tag documento caricato in verde con nome file (`planimetria-2025.pdf`) + ✕ elimina. | 🟡 | Se lo scatto in loading è complicato, spezza in due immagini (before/after). | — |
| 5 | `cap7-analisi-hal` | Sezione Analisi HAL espansa con report generato: 4-5 bullet con emoji (⚠️ documenti mancanti, ✅ prontezza, 🚨 rischi), timestamp e nota "Analisi HAL (Gemini)" in fondo. | 🔴 | Il testo può essere fittizio ma realistico (es. "Mancano APE e visura, notaio blocca la firma"). | — |

**Totale Cap. 7**: 5 screenshot (4 essenziali, 1 utile).

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
| Ago 2026 | Aggiunte 5 righe Cap. 5 · Match |
| Feb 2026 (Cap. 6) | Aggiunte 6 righe Cap. 6 · Portali / Publishing (5 essenziali, 1 utile) |
| Feb 2026 (Cap. 7) | Aggiunte 5 righe Cap. 7 · Fascicolo Immobile (4 essenziali, 1 utile). Totale index = **39 screenshot** catalogati. |
