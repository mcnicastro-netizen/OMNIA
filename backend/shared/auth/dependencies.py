"""OMNIA — FastAPI auth dependencies (get_current_user, role guards)."""
from typing import List, Optional
from fastapi import Request, HTTPException, status

from shared.auth.jwt_tokens import decode_token
from shared.db.connection import Database, set_current_agency_id


async def get_token_from_request(request: Request) -> Optional[str]:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    return token


async def get_current_user(request: Request) -> dict:
    token = await get_token_from_request(request)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="not_authenticated")

    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid_token")

    db = Database.get()
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="user_not_found")

    # Inject default agency for tenant filtering (first agency_id if user has any)
    agencies = user.get("agency_ids") or []
    if agencies:
        set_current_agency_id(agencies[0])

    return user


def require_roles(*allowed_roles: str):
    """Dependency factory: returns a dependency that checks the role of current user."""
    async def _guard(request: Request) -> dict:
        user = await get_current_user(request)
        if user.get("role") not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="forbidden")
        return user
    return _guard


async def get_optional_user(request: Request) -> Optional[dict]:
    """Returns user if logged in, None otherwise. Never raises."""
    try:
        return await get_current_user(request)
    except HTTPException:
        return None
