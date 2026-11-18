from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.audio import router as audio_router
from app.api.routes.health import router as health_router
from app.api.routes.prediction import router as prediction_router
from app.api.routes.reports import router as reports_router
from app.api.routes.auth import router as auth_router

app = FastAPI(
    title="EchoMap AI Backend",
    description="Minimal local development API for EchoMap AI.",
    version="1.0.0",
)

# Local development origins only; production origins should be configured explicitly later.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://127.0.0.1:8081",
        "http://localhost:8081",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(audio_router)
app.include_router(prediction_router)
app.include_router(reports_router)
app.include_router(auth_router)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "EchoMap AI Backend is running",
        "status": "success",
    }