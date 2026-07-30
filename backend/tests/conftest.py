"""Pytest configuration — make /app/backend importable for `from server import app`."""
import os
import sys
from pathlib import Path

_BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(_BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(_BACKEND_ROOT))

# L14 — la vera base URL viene sempre da frontend/.env: i fallback hardcoded
# nei singoli test non diventano mai stantii tra un fork e l'altro.
_FRONTEND_ENV = _BACKEND_ROOT.parent / "frontend" / ".env"
if "REACT_APP_BACKEND_URL" not in os.environ and _FRONTEND_ENV.exists():
    for line in _FRONTEND_ENV.read_text().splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            os.environ["REACT_APP_BACKEND_URL"] = line.split("=", 1)[1].strip()
            break

# Carica anche backend/.env (MONGO_URL, DB_NAME) se non già nel processo
_BACKEND_ENV = _BACKEND_ROOT / ".env"
if "MONGO_URL" not in os.environ and _BACKEND_ENV.exists():
    for line in _BACKEND_ENV.read_text().splitlines():
        if "=" in line and not line.strip().startswith("#"):
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
