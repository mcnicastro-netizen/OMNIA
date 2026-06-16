"""OMNIA — Agency model (multi-tenant root entity for ImmoWeb)."""
from typing import List, Optional, Literal
from pydantic import EmailStr, Field, HttpUrl, field_validator
from uuid import uuid4
import re

from shared.models.base import TimestampedModel, OmniaBaseModel, utcnow_iso

AgencyPlan = Literal["free", "starter", "pro", "enterprise"]
InviteStatus = Literal["pending", "accepted", "revoked", "expired"]


def _slugify(text: str) -> str:
    """Convert agency name to URL-safe slug."""
    s = text.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_-]+", "-", s)
    s = s.strip("-")
    return s[:60] or "agency"


# -------------------- AGENCY --------------------

class AgencyFiscal(OmniaBaseModel):
    """Italian fiscal / legal identity fields."""
    legal_name: str = Field(min_length=2, max_length=200)
    vat_number: Optional[str] = Field(default=None, max_length=20)       # Partita IVA
    fiscal_code: Optional[str] = Field(default=None, max_length=20)      # Codice Fiscale
    rea: Optional[str] = Field(default=None, max_length=30)              # REA (Repertorio Economico Amministrativo)
    fiaip_code: Optional[str] = Field(default=None, max_length=30)       # codice agente FIAIP


class AgencyAddress(OmniaBaseModel):
    street: Optional[str] = Field(default=None, max_length=200)
    city: Optional[str] = Field(default=None, max_length=100)
    province: Optional[str] = Field(default=None, max_length=10)         # es. "RM", "MI"
    postal_code: Optional[str] = Field(default=None, max_length=10)
    country: str = Field(default="IT", max_length=2)


class AgencyContact(OmniaBaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, max_length=30)
    website: Optional[str] = Field(default=None, max_length=200)


class AgencyBranding(OmniaBaseModel):
    """Visual branding (logo/colors arrive properly in M2.S6 white-label)."""
    logo_url: Optional[str] = Field(default=None, max_length=500)
    primary_color: str = Field(default="#0B1E3F", pattern=r"^#[0-9a-fA-F]{6}$")
    accent_color: str = Field(default="#1F6B5C", pattern=r"^#[0-9a-fA-F]{6}$")
    tagline: Optional[str] = Field(default=None, max_length=200)


# Website strategy: agencies either already have a site (we feed it via XML)
# or they want one built by OMNIA (template gallery, custom domain — M2.S6).
WebsiteMode = Literal["external", "omnia_template"]


class AgencyWebsite(OmniaBaseModel):
    """How the agency wants its public website handled."""
    mode: Optional[WebsiteMode] = None
    external_url: Optional[str] = Field(default=None, max_length=300)
    template_id: Optional[str] = Field(default=None, max_length=60)
    custom_domain: Optional[str] = Field(default=None, max_length=120)


class AgencyInDB(TimestampedModel):
    """Agency stored in MongoDB."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    slug: str = Field(min_length=2, max_length=60, pattern=r"^[a-z0-9-]+$")
    display_name: str = Field(min_length=2, max_length=120)
    fiscal: AgencyFiscal
    address: AgencyAddress = Field(default_factory=AgencyAddress)
    contact: AgencyContact = Field(default_factory=AgencyContact)
    branding: AgencyBranding = Field(default_factory=AgencyBranding)
    website: AgencyWebsite = Field(default_factory=AgencyWebsite)
    plan: AgencyPlan = "free"
    owner_id: str  # user_id of the agency_admin who created it
    is_active: bool = True
    onboarding_completed: bool = False


class AgencyPublic(OmniaBaseModel):
    """Agency shape returned to the client."""
    id: str
    slug: str
    display_name: str
    fiscal: AgencyFiscal
    address: AgencyAddress
    contact: AgencyContact
    branding: AgencyBranding
    website: AgencyWebsite = Field(default_factory=AgencyWebsite)
    plan: AgencyPlan
    owner_id: str
    is_active: bool
    onboarding_completed: bool
    created_at: str
    updated_at: str


class AgencyCreate(OmniaBaseModel):
    display_name: str = Field(min_length=2, max_length=120)
    fiscal: AgencyFiscal
    address: Optional[AgencyAddress] = None
    contact: Optional[AgencyContact] = None
    branding: Optional[AgencyBranding] = None


class AgencyUpdate(OmniaBaseModel):
    display_name: Optional[str] = Field(default=None, min_length=2, max_length=120)
    fiscal: Optional[AgencyFiscal] = None
    address: Optional[AgencyAddress] = None
    contact: Optional[AgencyContact] = None
    branding: Optional[AgencyBranding] = None
    website: Optional[AgencyWebsite] = None
    onboarding_completed: Optional[bool] = None


def make_slug(display_name: str) -> str:
    return _slugify(display_name)


# -------------------- INVITE --------------------

class AgencyInviteInDB(TimestampedModel):
    """Magic-link invitation to join an agency."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    agency_id: str
    email: EmailStr
    role: Literal["agent", "agency_admin"] = "agent"
    token: str                             # secure random token (32+ chars)
    expires_at: str                        # ISO timestamp
    status: InviteStatus = "pending"
    invited_by: str                        # user_id of inviter
    name_hint: Optional[str] = Field(default=None, max_length=120)


class AgencyInvitePublic(OmniaBaseModel):
    """Public-safe invite payload (no token)."""
    id: str
    agency_id: str
    email: EmailStr
    role: str
    status: InviteStatus
    expires_at: str
    invited_by: str
    name_hint: Optional[str] = None
    created_at: str


class InviteCreateRequest(OmniaBaseModel):
    email: EmailStr
    role: Literal["agent", "agency_admin"] = "agent"
    name_hint: Optional[str] = Field(default=None, max_length=120)


class InviteVerifyResponse(OmniaBaseModel):
    """Returned when the invitee visits the accept page (no token leak)."""
    invite_id: str
    agency_name: str
    role: str
    email: EmailStr
    expires_at: str


class InviteAcceptRequest(OmniaBaseModel):
    token: str
    name: str = Field(min_length=1, max_length=120)
    password: str = Field(min_length=8, max_length=128)


# -------------------- DASHBOARD KPI --------------------

class DashboardKPI(OmniaBaseModel):
    key: str
    label: str
    value: int
    delta_label: Optional[str] = None
    delta_direction: Optional[Literal["up", "down", "flat"]] = None
    icon: Optional[str] = None
    locked: bool = False  # True means "coming in future milestone"
