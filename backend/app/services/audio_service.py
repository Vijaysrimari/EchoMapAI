"""Temporary audio upload validation and storage helpers."""

from pathlib import Path
from subprocess import run
from uuid import uuid4
from imageio_ffmpeg import get_ffmpeg_exe

from fastapi import UploadFile

MAX_AUDIO_SIZE = 10 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {
	"audio/wav",
	"audio/mpeg",
	"audio/mp3",
	"audio/x-wav",
	"audio/mp4",
	"audio/m4a",
}
ALLOWED_EXTENSIONS = {".wav", ".mp3", ".m4a", ".mp4", ".webm"}
UPLOADS_DIR = Path(__file__).resolve().parents[2] / "uploads"


def prepare_audio_for_analysis(audio_path: str) -> str:
	source = Path(audio_path)
	if source.suffix.lower() == ".wav":
		return str(source)

	converted = source.with_suffix(".analysis.wav")
	result = run(
		[
			get_ffmpeg_exe(),
			"-y",
			"-i",
			str(source),
			"-vn",
			"-ac",
			"1",
			"-ar",
			"22050",
			str(converted),
		],
		capture_output=True,
		check=False,
	)
	if result.returncode != 0 or not converted.exists() or converted.stat().st_size == 0:
		converted.unlink(missing_ok=True)
		raise ValueError("The uploaded audio could not be decoded")
	return str(converted)


def validate_audio_upload(upload: UploadFile) -> str:
	extension = Path(upload.filename or "").suffix.lower()
	content_type = (upload.content_type or "").lower()

	if extension not in ALLOWED_EXTENSIONS:
		raise ValueError("Unsupported audio format")

	return extension


async def save_audio_upload(upload: UploadFile, extension: str) -> tuple[str, int]:
	UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
	filename = f"{uuid4()}{extension}"
	destination = UPLOADS_DIR / filename
	size_bytes = 0

	try:
		with destination.open("wb") as output_file:
			while chunk := await upload.read(1024 * 1024):
				size_bytes += len(chunk)
				if size_bytes > MAX_AUDIO_SIZE:
					raise ValueError("Audio file exceeds the 10 MB limit")
				output_file.write(chunk)
	except Exception:
		destination.unlink(missing_ok=True)
		raise
	finally:
		await upload.close()

	return filename, size_bytes