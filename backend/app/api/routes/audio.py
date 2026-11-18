from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse

from app.services.audio_service import save_audio_upload, validate_audio_upload

router = APIRouter(prefix="/api/audio", tags=["audio"])


@router.post("/upload", response_model=None)
async def upload_audio(audio: UploadFile | None = File(default=None)) -> dict[str, str | int] | JSONResponse:
    if audio is None:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": "No audio file uploaded"},
        )

    try:
        extension = validate_audio_upload(audio)
        filename, size_bytes = await save_audio_upload(audio, extension)
    except ValueError as error:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": str(error)},
        )
    except OSError:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Unable to save audio file"},
        )
    except Exception:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Unable to save audio file"},
        )

    return {
        "status": "success",
        "message": "Audio uploaded successfully",
        "filename": filename,
        "original_filename": audio.filename or "",
        "content_type": audio.content_type or "",
        "size_bytes": size_bytes,
    }