from datetime import datetime
import json
from uuid import uuid4

from pydantic import BaseModel

from fastapi import APIRouter, Header
from fastapi.responses import JSONResponse

from app.services.report_service import (
    get_report,
    get_reports,
    initialize_reports,
    update_report_status,
    create_report,
)
from app.api.routes.auth import require_government


class ReportSubmission(BaseModel):
    category: str
    coarse_category: str
    confidence: float
    severity: str
    estimated_level_db: float
    top_predictions: list[dict]
    location: str
    landmark: str = ""
    frequency: str = "Daily"
    description: str
    filename: str = ""

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.on_event("startup")
async def startup_reports() -> None:
    initialize_reports()


@router.get("", response_model=None)
def list_reports(authorization: str | None = Header(default=None)) -> dict | JSONResponse:
    authentication_error = require_government(authorization)
    if authentication_error:
        return JSONResponse(status_code=401, content=authentication_error)
    initialize_reports()
    return {"status": "success", "reports": get_reports()}


@router.post("", response_model=None)
def submit_report(submission: ReportSubmission) -> dict:
    initialize_reports()
    report_id = f"RPT-{uuid4().hex[:8].upper()}"
    sound = submission.category.replace("_", " ").title()
    confidence = round(submission.confidence * 100, 1)
    location = submission.location.strip() or "Citizen submitted location"
    description = submission.description.strip()
    if not description:
        description = f"Citizen report for {sound} near {location}."

    report = create_report(
        {
            "id": report_id,
            "sound": sound,
            "location": location,
            "landmark": submission.landmark.strip(),
            "frequency": submission.frequency,
            "severity": submission.severity,
            "level": f"{submission.estimated_level_db:.1f} dB",
            "reported_at": datetime.now().strftime("%b %d, %Y, %I:%M %p"),
            "status": "Pending",
            "confidence": f"{confidence:.1f}%",
            "description": description,
            "filename": submission.filename,
            "coarse_category": submission.coarse_category,
            "top_predictions": json.dumps(submission.top_predictions),
            "created_at": datetime.now().isoformat(timespec="seconds"),
        }
    )
    return {"status": "success", "report": report}


@router.get("/{report_id}", response_model=None)
def list_report(report_id: str, authorization: str | None = Header(default=None)) -> dict | JSONResponse:
    authentication_error = require_government(authorization)
    if authentication_error:
        return JSONResponse(status_code=401, content=authentication_error)
    try:
        return {"status": "success", "report": get_report(report_id)}
    except KeyError:
        return JSONResponse(
            status_code=404,
            content={"status": "error", "message": "Report not found"},
        )


@router.patch("/{report_id}", response_model=None)
def review_report(report_id: str, authorization: str | None = Header(default=None)) -> dict | JSONResponse:
    authentication_error = require_government(authorization)
    if authentication_error:
        return JSONResponse(status_code=401, content=authentication_error)
    try:
        return {
            "status": "success",
            "report": update_report_status(report_id, "Reviewed"),
        }
    except KeyError:
        return JSONResponse(
            status_code=404,
            content={"status": "error", "message": "Report not found"},
        )
