import hashlib
import hmac
import os
import secrets
import time
from pydantic import BaseModel
from fastapi import APIRouter, Header
from fastapi.responses import JSONResponse


router = APIRouter(prefix="/api/auth", tags=["authentication"])

GOVERNMENT_EMAIL = os.getenv("ECHOMAP_GOVERNMENT_EMAIL", "authority@echomap.gov").strip().lower()
GOVERNMENT_PASSWORD = os.getenv("ECHOMAP_GOVERNMENT_PASSWORD", "EchoMap@Gov2026!")
SESSIONS: dict[str, float] = {}
SESSION_TTL_SECONDS = 8 * 60 * 60


class GovernmentLogin(BaseModel):
    email: str
    password: str


@router.post("/government", response_model=None)
def government_login(credentials: GovernmentLogin) -> dict | JSONResponse:
    email_matches = hmac.compare_digest(
        credentials.email.strip().lower(),
        GOVERNMENT_EMAIL,
    )
    password_matches = hmac.compare_digest(credentials.password, GOVERNMENT_PASSWORD)
    if not email_matches or not password_matches:
        return JSONResponse(
            status_code=401,
            content={"status": "error", "message": "Invalid government email or password"},
        )

    token = secrets.token_urlsafe(32)
    SESSIONS[token] = time.time() + SESSION_TTL_SECONDS
    return {
        "status": "success",
        "token": token,
        "role": "government",
        "email": GOVERNMENT_EMAIL,
        "expires_in": SESSION_TTL_SECONDS,
    }


def require_government(authorization: str | None = Header(default=None)) -> dict | None:
    if not authorization or not authorization.startswith("Bearer "):
        return {"status": "error", "message": "Government authentication required"}

    token = authorization.removeprefix("Bearer ").strip()
    expires_at = SESSIONS.get(token)
    if expires_at is None:
        return {"status": "error", "message": "Invalid government session"}
    if time.time() >= expires_at:
        SESSIONS.pop(token, None)
        return {"status": "error", "message": "Government session expired"}
    return None
