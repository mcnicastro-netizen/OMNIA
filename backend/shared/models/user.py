"""OMNIA — User model (multi-tenant, multi-role)."""
from typing import List, Optional, Literal
from pydantic import EmailStr, Field

from shared.models.base import TimestampedModel, OmniaBaseModel, utcnow_iso
from uuid import uuid4

UserRole = Literal["super_admin", "agency_admin", "agent", "client", "student"]
UserLang = Literal["it", "en", "es"]


class UserPublic(OmniaBaseModel):
    """User shape returned to the client (NEVER includes password_hash)."""
    id: str
    email: EmailStr
    name: str
    role: UserRole
    lang: UserLang = "it"
    agency_ids: List[str] = Field(default_factory=list)
    is_active: bool = True
    created_at: str
    updated_at: str


class UserInDB(TimestampedModel):
    """User shape stored in MongoDB (with password_hash)."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    email: EmailStr
    password_hash: str
    name: str
    role: UserRole = "client"
    lang: UserLang = "it"
    agency_ids: List[str] = Field(default_factory=list)
    is_active: bool = True
    # M3.S5 v1 — B2C account fields
    account_type: Literal["b2b", "b2c"] = "b2b"
    intents: List[Literal["sell", "rent_out", "get_alerts"]] = Field(default_factory=list)
    notification_channels: List[Literal["email", "push"]] = Field(default_factory=lambda: ["email"])
    email_verified: bool = False


class RegisterRequest(OmniaBaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=1, max_length=120)
    role: Optional[UserRole] = "client"
    lang: Optional[UserLang] = "it"


class LoginRequest(OmniaBaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(OmniaBaseModel):
    email: EmailStr


class ResetPasswordRequest(OmniaBaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)
