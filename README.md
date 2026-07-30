# OMNIA — Real Estate Ecosystem

Piattaforma full-stack per il mercato immobiliare italiano: CRM B2B per agenzie (**ImmoWeb**), portale B2C (**ImmobilCloud**), AI suite (HAL), API Gateway a crediti, billing Stripe e Academy (in arrivo).

## Stack
- **Backend**: FastAPI + MongoDB (motor), JWT httpOnly cookies, multi-tenant per `agency_id`
- **Frontend**: React (CRA + craco), Tailwind, i18n IT/EN/ES, lazy-loaded routes
- **Integrazioni**: Stripe (test mode), Emergent LLM (Gemini), fal.ai, Resend, Object Storage

## Struttura
```
backend/
  apps/          # moduli: core (auth), immoweb (CRM), immocloud (B2C), billing, marketplace…
  shared/        # auth, db, models, storage, utils (crypto, net_guard, tenant)
  tests/         # ~45 suite pytest (leggono credenziali da memory/test_credentials.env)
frontend/
  src/apps/      # landing, auth, immoweb, immocloud, academy, legal
  src/shared/    # api client, auth provider, i18n, componenti condivisi
memory/          # PRD, decisioni, roadmap (documentazione operativa)
```

## Setup locale
1. Copia `backend/.env.example` → `backend/.env` e `frontend/.env.example` → `frontend/.env`, valorizza le variabili.
2. Backend: `cd backend && pip install -r requirements.txt && uvicorn server:app --port 8001`
3. Frontend: `cd frontend && yarn && yarn start`
4. Test: `cd backend && python -m pytest tests/ -q` · `cd frontend && yarn test --watchAll=false`

Le credenziali di test NON sono nel repo: crea `memory/test_credentials.env` locale (vedi `tests/conftest.py`).

## Regole chiave
- Tutte le route backend sono prefissate `/api`.
- Nessun segreto hardcoded: tutto via `.env` (vedi `.env.example`).
- I ruoli privilegiati (`agency_admin`, `agent`, `group_admin`) si ottengono solo via onboarding o invito, mai dalla registrazione pubblica.

© 2026 OMNIA — progetto proprietario del Founder (mcnicastro-netizen).
