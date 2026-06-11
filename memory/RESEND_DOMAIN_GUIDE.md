# 📧 GUIDA RESEND DOMAIN VERIFICATION

> **Obiettivo**: Verificare il dominio `omniarealestateecosystem.it` su Resend per inviare email transazionali (welcome, password reset, notifiche) da `noreply@omniarealestateecosystem.it`.
> **Stato attuale**: ⏸️ SKIPPED in M1.S4 (Founder ha scelto default per ora, sandbox attiva).
> **Sblocco**: Da fare prima di onboarding reale agenzie in M2.

---

## ⚠️ LIMITE SANDBOX ATTUALE

Senza dominio verificato, Resend permette di inviare email **solo all'indirizzo email del proprietario dell'account Resend** (cioè `mcnicastro@gmail.com`).

Configurazione corrente in `/app/backend/.env`:
```env
SENDER_EMAIL="onboarding@resend.dev"
```

Questo basta per testing dell'admin, ma **NON** funziona quando si registreranno utenti reali (non riceveranno email).

---

## 📋 STEP 1 — Aggiungi il dominio su Resend

1. Login: https://resend.com/domains
2. Click **"Add Domain"**
3. Inserisci: `omniarealestateecosystem.it`
4. Scegli la regione più vicina: **EU (West)** raccomandata per GDPR
5. Resend mostrerà 3-4 record DNS da aggiungere

---

## 📋 STEP 2 — Aggiungi i record DNS

Esempio di record che Resend genererà (i valori esatti li vedi nel tuo pannello):

### SPF (autorizza Resend a inviare per tuo conto)
| Tipo | Host | Valore |
|---|---|---|
| `TXT` | `send` | `v=spf1 include:amazonses.com ~all` |

### DKIM (firma crittografica)
| Tipo | Host | Valore |
|---|---|---|
| `TXT` | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GN...` (chiave lunga) |

### DMARC (policy anti-spoofing — raccomandato)
| Tipo | Host | Valore |
|---|---|---|
| `TXT` | `_dmarc` | `v=DMARC1; p=none; rua=mailto:postmaster@omniarealestateecosystem.it` |

### MX (per ricevere reply se SENDER è onreply@...)
| Tipo | Host | Valore | Priority |
|---|---|---|---|
| `MX` | `send` | `feedback-smtp.eu-west-1.amazonses.com` | 10 |

---

## 📋 STEP 3 — Configura DNS sul registrar

Procedura identica a `DNS_SETUP_GUIDE.md` step 1: vai sul pannello DNS del registrar e aggiungi i 4 record qui sopra.

⏱️ Propagazione: 5-30 min nella maggior parte dei casi.

---

## 📋 STEP 4 — Verifica su Resend

Torna su https://resend.com/domains → click sul dominio → bottone **"Verify DNS Records"**.

Dovresti vedere ✅ verde su tutti e 3 i record. Se ne manca uno, Resend ti dice quale.

---

## 📋 STEP 5 — Aggiorna SENDER_EMAIL

Una volta verificato il dominio, aggiorna `/app/backend/.env`:

```env
SENDER_EMAIL="noreply@omniarealestateecosystem.it"
SUPPORT_EMAIL="support@omniarealestateecosystem.it"
```

Restart: `sudo supervisorctl restart backend`

---

## 📋 STEP 6 — Test email reale

```bash
curl -X POST https://api.omniarealestateecosystem.it/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"tuo-altro-indirizzo@gmail.com"}'
```

Controlla l'inbox dell'indirizzo. L'email deve arrivare da `noreply@omniarealestateecosystem.it`.

---

## 🎯 CHECKLIST

- [ ] Dominio aggiunto su Resend
- [ ] SPF/DKIM/DMARC configurati sul DNS
- [ ] Verifica DNS su Resend ✅ verde
- [ ] `SENDER_EMAIL` aggiornato in backend `.env`
- [ ] Test invio a email esterna riuscito
- [ ] Aggiornare `/app/memory/PRD.md` per chiudere issue "Resend Sandbox"

---

## 🚨 ALTERNATIVE SE RESEND BLOCCA

Se Resend dovesse darti problemi (es: account non approvato per produzione):
- **Postmark** (https://postmarkapp.com) — eccellente per transazionali, $15/mese 10k email
- **Brevo / SendinBlue** — gratis fino a 300/giorno
- **AWS SES** — economico ma più complesso da configurare

Decisione attuale (D-009): **Resend confermato**. Non cambiare senza autorizzazione Founder.

---

*Quando sei pronto a verificare il dominio Resend, riapri questa guida.*
