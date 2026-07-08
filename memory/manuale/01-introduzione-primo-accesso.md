# Capitolo 1 — Introduzione & Primo Accesso

## A cosa serve

Questo capitolo ti accompagna dalla prima volta che apri OMNIA fino al momento in cui vedi la **tua dashboard operativa**. Ti spiega **chi sei** dentro la piattaforma (che ruolo hai), **da quale porta entri** (agenzia o privato), come **scegli la lingua** e cosa aspettarti dopo il primo login.

Se ti stai chiedendo "sono nel posto giusto?" o "come inizio davvero?", questo è il capitolo giusto.

## Prerequisiti

- Un indirizzo email valido (verrà usato come identificativo di accesso).
- Un dispositivo con browser aggiornato (Chrome, Firefox, Safari, Edge — versioni degli ultimi 12 mesi).
- Connessione internet stabile (OMNIA non funziona offline).
- Se sei un **collaboratore di un'agenzia**, devi aver ricevuto una **email di invito** dal titolare/broker della tua agenzia. Se non l'hai ricevuta, contatta prima il titolare — non registrarti da solo.

## Chi sei dentro OMNIA (i 4 ruoli)

OMNIA riconosce **4 ruoli** utente. Il tuo ruolo determina cosa vedi e cosa puoi fare.

| Ruolo | Chi è | Cosa vede |
|---|---|---|
| **Privato (client)** | Un utente B2C che vuole vendere, comprare, affittare casa senza passare da un'agenzia | Il portale pubblico `omniarealestateecosystem.it` (annunci, valutazione gratuita, mutui, HAL Legal) |
| **Agente (agent)** | Un collaboratore di un'agenzia esistente su OMNIA | Il CRM dell'agenzia con permessi limitati (i propri immobili e clienti) |
| **Titolare agenzia (agency_admin)** | Il broker/titolare che ha aperto l'account agenzia | Tutto il CRM della propria agenzia, gestione collaboratori, impostazioni, portali, sito web |
| **Super Admin (super_admin)** | Il team OMNIA | Vista trasversale multi-agenzia per supporto (non è un ruolo che puoi ottenere: solo staff interno) |

Il tuo ruolo viene **assegnato al momento della registrazione o dell'invito** e **non è modificabile** dall'utente. Se pensi di avere il ruolo sbagliato, contatta il titolare della tua agenzia (o il supporto OMNIA se sei tu il titolare).

## Da dove si entra: due porte diverse

OMNIA ha **due entry point distinti**. Sbagliare porta non è grave (verrai reindirizzato), ma è utile saperlo per non confonderti.

- **Porta B2C — Privati**: `omniarealestateecosystem.it` (homepage pubblica). Da qui accedono i privati che vogliono cercare casa, farsi una stima gratuita, confrontare mutui o parlare con HAL Legal. Non serve essere un'agenzia.
- **Porta B2B — Agenzie**: `omniarealestateecosystem.it/it/agenzie` (o dopo login `/it/app`). Da qui accedono i titolari agenzia e i loro collaboratori per gestire il CRM (immobili, clienti, portali, sito, valuator, mutui).

Se stai leggendo questo manuale come agente/broker, la porta giusta è la **B2B**.

## Flusso passo-passo — Primo accesso

### Caso A — Sei un titolare agenzia che si registra per la prima volta

1. Vai su `omniarealestateecosystem.it/it/agenzie`.
2. Clicca il bottone **"Registrati"** in alto a destra (o il CTA principale al centro della pagina).
3. Si apre la pagina `/it/register`. Compila:
   - **Nome completo** (il tuo nome, non quello dell'agenzia)
   - **Email** (sarà il tuo login futuro — scegli un indirizzo che controlli davvero)
   - **Password** (minimo 8 caratteri, ti consigliamo lettere + numeri + un simbolo)
   - **Nome agenzia** (verrà usato per il sottodominio automatico, es. `nomeagenzia.omniarealestateecosystem.it`)
4. Clicca **"Crea account"**.
5. Riceverai una email di benvenuto (mittente `no-reply@omniarealestateecosystem.it`). Non è necessaria una verifica email per accedere subito, ma controlla che sia arrivata.
6. Al primo login vieni reindirizzato automaticamente all'**Onboarding Wizard** (`/it/app/onboarding`), che ti guida in 4-5 passaggi a configurare l'agenzia (dati fiscali, logo, colori, portali, primo collaboratore). L'Onboarding può essere saltato e ripreso in qualsiasi momento.
7. Al termine (o se salti), arrivi alla **Dashboard** (`/it/app/dashboard`).

### Caso B — Sei un collaboratore invitato dal titolare

1. Il titolare della tua agenzia ti invia un invito dal CRM. Ricevi una email con oggetto simile a "Sei stato invitato a collaborare su OMNIA".
2. Clicca il bottone **"Accetta invito"** dentro l'email. Ti porta a `/it/app/accept-invite?token=...`.
3. Compila:
   - **Nome completo**
   - **Password** (crea la tua — l'invito è legato all'email, non alla password)
4. Clicca **"Attiva account"**.
5. Vieni reindirizzato direttamente alla **Dashboard** dell'agenzia con ruolo **agente**. Non passi dall'Onboarding Wizard (è riservato al titolare).

### Caso C — Sei un privato B2C

1. Vai su `omniarealestateecosystem.it` (homepage principale).
2. Puoi **navigare senza registrarti** per vedere annunci, provare la valutazione gratuita, confrontare mutui e parlare con HAL Legal.
3. Per **salvare ricerche, pubblicare un annuncio da privato o richiedere una stima brandizzata**, clicca **"Accedi"** in alto a destra → **"Registrati"**.
4. Compila email + password + nome. Non serve nome agenzia (sei privato).
5. Vieni reindirizzato a `/it/cloud` (l'area riservata privati B2C).

### Caso D — Sei già registrato e devi solo rifare login

1. Vai su `omniarealestateecosystem.it/it/login`.
2. Inserisci **email** e **password**.
3. Se sei un agente/titolare atterri su `/it/app/dashboard`. Se sei un privato atterri su `/it/cloud`.
4. Se hai dimenticato la password, clicca **"Password dimenticata?"** sotto il form. Riceverai una email con un link temporaneo (valido 1 ora) per reimpostarla.

## Scegliere la lingua

OMNIA parla **3 lingue**: **Italiano 🇮🇹, Inglese 🇬🇧, Spagnolo 🇪🇸**.

- La lingua è visibile nell'URL: `/it/...`, `/en/...`, `/es/...`.
- Cambio rapido: **selettore lingua in alto a destra** su ogni pagina (icona con la sigla della lingua corrente, es. `IT`). Cliccalo e scegli.
- La lingua è **personale per utente** e viene ricordata al prossimo login.
- Ogni contenuto della piattaforma (menu, bottoni, messaggi di errore, email transazionali, HAL) segue la lingua scelta. **I contenuti che scrivi tu** (descrizioni immobili, note clienti) NON vengono tradotti automaticamente — restano nella lingua in cui li hai scritti.

## Screenshot descritti

### Homepage `omniarealestateecosystem.it`
In alto a sinistra c'è il **logo OMNIA** (torna sempre alla homepage). In alto a destra ci sono, nell'ordine: **selettore lingua** (sigla IT/EN/ES), **link "Agenzie"** (porta B2B), **bottone "Accedi"** scuro. Il body della pagina mostra un hero con headline e il CTA principale **"Trova casa"** / **"Vendi casa"** / **"Fatti valutare"**.

### Pagina `/it/register` (registrazione titolare agenzia)
Layout a due colonne: a sinistra un pannello scuro con **logo OMNIA e claim del prodotto**; a destra il form bianco con 4 campi (Nome, Email, Password, Nome agenzia), un checkbox **"Accetto termini e privacy"** e il bottone verde **"Crea account"** in fondo. Sotto il form: link "Hai già un account? Accedi".

### Onboarding Wizard `/it/app/onboarding`
In alto una **barra progresso a step** (4-5 pallini numerati con il titolo del passo attivo). Sotto, un card centrale con il form del passo corrente e in basso 2 bottoni: **"Indietro"** (grigio, disabilitato al primo step) e **"Avanti"** / **"Salta"** (verde). L'ultimo step ha il bottone **"Vai alla dashboard"**.

### Dashboard `/it/app/dashboard`
Layout con **sidebar a sinistra** (voci: Dashboard, Immobili, Clienti, Match, Portali, Mutui, HAL, Impostazioni). In alto **topbar** con avatar utente e selettore lingua. Corpo centrale con **4 card KPI** in griglia (Immobili attivi, Clienti, Lead nuovi, Match della settimana) e sotto una tabella "Attività recenti".

## Casi particolari / edge cases

- **Email già registrata**: se provi a registrarti con un'email già in uso, ricevi errore "Email già registrata". Non c'è un "unisciti a un'agenzia": se sei un collaboratore devi essere invitato dal titolare, non registrarti da solo.
- **Password dimenticata di un collaboratore**: funziona come per il titolare. Il reset **non richiede l'intervento del titolare**.
- **Invito scaduto** (>7 giorni): il link "Accetta invito" mostra un errore. Chiedi al titolare di rispedirlo dal CRM (`/it/app/members`).
- **Cambio ruolo**: un titolare può **promuovere/degradare** un agente dalla sezione Collaboratori (Cap. 13), ma un privato B2C **non può** diventare agente della stessa email — dovrà registrarsi con un'email diversa da un'agenzia.
- **Cambio email**: al momento **non modificabile** dall'utente. Serve richiesta al supporto. Se stai spostando l'account, il modo pulito è: farti invitare al nuovo indirizzo, trasferire i dati, disattivare il vecchio.
- **Doppio ruolo (agente + privato B2C con stessa email)**: non supportato. Se sei entrambi, tieni le due identità su email diverse.

## Errori comuni & come risolverli

| Errore | Cosa vedi | Come risolvere |
|---|---|---|
| Non arriva l'email di benvenuto | Casella vuota dopo 5 minuti | Controlla **Spam / Promozioni** (mittente `no-reply@omniarealestateecosystem.it`). Se non c'è nemmeno lì, l'email potrebbe essere digitata sbagliata: riprova la registrazione. |
| "Credenziali non valide" al login | Toast rosso in cima al form | Verifica **maiuscole/minuscole** della password. Se corretta, usa **"Password dimenticata?"** per reimpostare. Non provare più di 5 volte di seguito: OMNIA blocca temporaneamente per 15 minuti dopo troppi tentativi falliti. |
| "Invito non valido o scaduto" | Errore sulla pagina accept-invite | L'invito ha una scadenza di 7 giorni. Chiedi al titolare di rispedire l'invito da Collaboratori. |
| Reindirizzato sempre a `/cloud` invece che a `/app` | Vedi il portale privati anche se sei un agente | Il tuo account è stato creato come **privato**, non come agente. Serve un nuovo account con invito del titolare, oppure — se sei tu il titolare — un account nuovo aperto dalla pagina `/agenzie`. |
| Selettore lingua non appare | Vedi il layout in inglese ma non trovi come cambiare | Su schermi piccoli il selettore lingua è dentro il **menu hamburger** (icona ☰ in alto a destra). Aprilo. |
| Loop di login (rientri alla pagina login dopo aver inserito credenziali) | Il browser non conserva la sessione | Verifica di **non essere in modalità incognito con cookie disabilitati**, oppure che estensioni tipo "cookie blocker" stiano bloccando `omniarealestateecosystem.it`. |

## FAQ

**Q: Posso provare OMNIA senza registrarmi?**
Sì, come **privato**: navigazione annunci, valutazione gratuita, comparatore mutui e HAL Legal sono accessibili senza login. Come **agente/agenzia** invece serve la registrazione — non c'è modalità "demo/anonima" del CRM.

**Q: Quanto costa registrare un'agenzia?**
Al momento la registrazione è gratuita durante la fase di lancio della piattaforma. Il piano a crediti (per pubblicazione portali, virtual staging, ecc.) verrà attivato in una fase successiva (Milestone 4) e sarà comunicato con largo anticipo agli utenti già iscritti.

**Q: I miei dati sono al sicuro? Chi vede gli immobili e i clienti della mia agenzia?**
I dati sono **isolati per agenzia**: nessuna altra agenzia può vedere i tuoi immobili o clienti. Solo tu (titolare) e i collaboratori che inviti hanno accesso. Il team OMNIA (super_admin) può accedere in modalità supporto **solo se autorizzato da te via ticket** — non è un accesso passivo. Backup giornalieri, hosting UE.

**Q: Se cancello un collaboratore, cosa succede ai suoi immobili e clienti?**
Restano dell'agenzia: vengono **riassegnati al titolare** in automatico. Il collaboratore rimosso non può più accedere né vedere nulla.

**Q: Posso avere più agenzie sotto lo stesso account?**
Al momento no: un account = un'agenzia. Se gestisci più agenzie devi aprire account separati con email diverse. Feature "multi-agenzia" è nel backlog ma non è pianificata.

**Q: Cosa succede se resto inattivo a lungo?**
La sessione di login scade dopo un periodo di inattività (per motivi di sicurezza). Ti verrà chiesto di rifare login. I tuoi dati non vengono cancellati per inattività dell'account.

## Link ad altri capitoli correlati

- **Cap. 2 — Dashboard**: cosa vedi subito dopo il primo login, quali KPI leggere per primi.
- **Cap. 13 — Collaboratori & Impostazioni**: come invitare/rimuovere agenti, come rifinire il profilo agenzia dopo l'Onboarding.
- **Cap. 12 — HAL Legal**: se hai dubbi giuridici già al primo giorno, HAL Legal è disponibile immediatamente per tutti gli utenti autenticati (agenti e privati).
