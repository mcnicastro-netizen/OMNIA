"""OMNIA — ImmoWeb Dashboard KPIs (placeholders + real counts where available)."""
from fastapi import APIRouter, Depends
from typing import List

from shared.db.connection import Database
from shared.auth.dependencies import get_current_user
from shared.models.agency import DashboardKPI

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/kpis", response_model=List[DashboardKPI])
async def get_kpis(user: dict = Depends(get_current_user)):
    """Return KPI cards for the dashboard home.

    M2.S1: most are placeholders (locked=True). Only "members" is real.
    Real data fills in over M2.S2/S3/S4/S5.
    """
    db = Database.get()
    agency_ids = user.get("agency_ids") or []
    agency_id = agency_ids[0] if agency_ids else None

    # Real KPI: agency members
    members_count = 0
    if agency_id:
        members_count = await db.users.count_documents({"agency_ids": agency_id, "is_active": True})

    # Real KPI: pending invites
    invites_count = 0
    if agency_id:
        invites_count = await db.agency_invites.count_documents(
            {"agency_id": agency_id, "status": "pending"}
        )

    # Real KPI: active properties (M2.S2)
    properties_active = 0
    if agency_id:
        properties_active = await db.properties.count_documents(
            {"agency_id": agency_id, "status": "active"}
        )

    kpis: List[DashboardKPI] = [
        DashboardKPI(
            key="properties_active",
            label="Immobili attivi",
            value=properties_active,
            icon="home",
            locked=False,
        ),
        DashboardKPI(
            key="leads_open",
            label="Lead aperti",
            value=0,
            icon="user-plus",
            locked=True,
        ),
        DashboardKPI(
            key="matches_week",
            label="Nuovi match (7gg)",
            value=0,
            icon="sparkles",
            locked=True,
        ),
        DashboardKPI(
            key="visits_week",
            label="Visite settimana",
            value=0,
            icon="calendar",
            locked=True,
        ),
        DashboardKPI(
            key="members_active",
            label="Collaboratori",
            value=members_count,
            icon="users",
            locked=False,
        ),
        DashboardKPI(
            key="invites_pending",
            label="Inviti pendenti",
            value=invites_count,
            icon="mail",
            locked=False,
        ),
    ]
    return kpis
