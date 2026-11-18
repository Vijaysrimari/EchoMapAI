# EchoMap AI Backend

Minimal FastAPI backend for local development. ML, audio processing, database, and external API integrations are intentionally not included yet.

## Setup on Windows

From the repository root:

```powershell
cd backend
py -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

If PowerShell blocks script activation, run the server with the virtual environment interpreter directly:

```powershell
.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

## Start the server

With the virtual environment activated:

```powershell
uvicorn app.main:app --reload
```

The server runs at http://127.0.0.1:8000.

- Root endpoint: http://127.0.0.1:8000/
- Health endpoint: http://127.0.0.1:8000/health
- Swagger documentation: http://127.0.0.1:8000/docs
