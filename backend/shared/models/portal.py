"""OMNIA — Portal Subscription model (M2.S5 Layer A, D-029).

Each PortalSubscription = agency's integration credentials for one publisher portal.
Passwords stored encrypted via Fernet (key from env OMNIA_PORTAL_ENC_KEY).
"""
from __future__ import annotations
from datetime import datetime, timezone
from typing import Literal, Optional

from pydantic import BaseModel, Field

PortalFrequency = Literal["hourly", "every_4h", "daily", "weekly", "manual"]
PortalStatus = Literal["active", "disabled", "error", "pending"]


# Built-in portal catalog. Keep alphabetic codes — adapters live in adapters/.
PORTAL_CATALOG = [
    {"code": "idealista", "name": "Idealista", "site": "https://www.idealista.it",
     "mode": "pull_xml", "needs_credentials": False, "supports_omnia_extended": False},
    {"code": "immobiliare", "name": "Immobiliare.it", "site": "https://www.immobiliare.it",
     "mode": "pull_xml", "needs_credentials": True, "supports_omnia_extended": False},
    {"code": "casa", "name": "Casa.it", "site": "https://www.casa.it",
     "mode": "pull_xml", "needs_credentials": True, "supports_omnia_extended": False},
    {"code": "wikicasa", "name": "Wikicasa", "site": "https://www.wikicasa.it",
     "mode": "pull_xml", "needs_credentials": True, "supports_omnia_extended": False},
    {"code": "subito", "name": "Subito.it", "site": "https://www.subito.it",
     "mode": "push_api", "needs_credentials": True, "supports_omnia_extended": False},
    {"code": "facebook_catalog", "name": "Facebook Catalog", "site": "https://www.facebook.com/business/marketplace",
     "mode": "push_api", "needs_credentials": True, "supports_omnia_extended": True},
    {"code": "linkedin", "name": "LinkedIn", "site": "https://www.linkedin.com",
     "mode": "push_api", "needs_credentials": True, "supports_omnia_extended": True},
]


class PortalCredentials(BaseModel):
    """User-facing credentials (we never return password in cleartext on read)."""
    username: Optional[str] = Field(default=None, max_length=200)
    email: Optional[str] = Field(default=None, max_length=200)
    api_key: Optional[str] = Field(default=None, max_length=500)
    extra: Optional[dict] = None  # adapter-specific (e.g. fb_business_id, linkedin_page_urn)


class PortalSubscriptionCreate(BaseModel):
    portal_code: str = Field(..., min_length=2, max_length=60)
    credentials: PortalCredentials = Field(default_factory=PortalCredentials)
    password: Optional[str] = Field(default=None, max_length=500)  # plaintext on input only
    frequency: PortalFrequency = "daily"
    enabled: bool = False
    notes: Optional[str] = Field(default=None, max_length=2000)


class PortalSubscriptionUpdate(BaseModel):
    credentials: Optional[PortalCredentials] = None
    password: Optional[str] = Field(default=None, max_length=500)
    frequency: Optional[PortalFrequency] = None
    enabled: Optional[bool] = None
    notes: Optional[str] = Field(default=None, max_length=2000)


class PortalSubscriptionPublic(BaseModel):
    """Safe public read shape (never includes password)."""
    id: str
    agency_id: str
    portal_code: str
    portal_name: str
    site: str
    mode: str
    credentials: PortalCredentials
    has_password: bool
    frequency: PortalFrequency
    enabled: bool
    status: PortalStatus
    last_transfer_at: Optional[str] = None
    next_transfer_at: Optional[str] = None
    last_error: Optional[str] = None
    notes: Optional[str] = None
    created_at: str
    updated_at: str


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
