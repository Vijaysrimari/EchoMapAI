from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import JSONResponse
from pathlib import Path

from app.services.ml_service import predict_audio
from app.services.severity_service import estimate_severity
from app.services.audio_service import (
    UPLOADS_DIR,
    prepare_audio_for_analysis,
    save_audio_upload,
    validate_audio_upload,
)

router = APIRouter(prefix="/api/prediction", tags=["prediction"])


@router.post("", response_model=None)
async def predict(
    audio: UploadFile | None = File(default=None),
    location: str = Form(default="Citizen submitted location"),
) -> dict | JSONResponse:
    if audio is None:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": "No audio file uploaded"},
        )

    try:
        extension = validate_audio_upload(audio)
        filename, size_bytes = await save_audio_upload(audio, extension)
        from app.services.ml_service import MODEL_PATH

        if not MODEL_PATH.exists():
            return JSONResponse(
                status_code=503,
                content={
                    "status": "error",
                    "message": "ESC-50 model is not trained yet",
                },
            )

        audio_path = str(UPLOADS_DIR / filename)
    except ValueError as error:
        return JSONResponse(status_code=400, content={"status": "error", "message": str(error)})
    except Exception:
        return JSONResponse(status_code=500, content={"status": "error", "message": "Unable to process audio"})

    try:
        analysis_path = prepare_audio_for_analysis(audio_path)
        try:
            prediction = predict_audio(analysis_path)
            severity = estimate_severity(analysis_path)
        finally:
            if analysis_path != audio_path:
                Path(analysis_path).unlink(missing_ok=True)
    except Exception as error:
        return JSONResponse(
            status_code=422,
            content={"status": "error", "message": f"Unable to analyze audio: {error}"},
        )

    return {
        "status": "success",
        "filename": filename,
        "size_bytes": size_bytes,
        **prediction,
        **severity,
    }