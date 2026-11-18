import sqlite3
from pathlib import Path
from threading import Lock


DB_PATH = Path(__file__).resolve().parents[2] / "echomap_reports.db"
_lock = Lock()


def _connect() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH, timeout=10)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_reports() -> None:
    with _lock, _connect() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS reports (
                id TEXT PRIMARY KEY,
                sound TEXT NOT NULL,
                location TEXT NOT NULL,
                severity TEXT NOT NULL,
                level TEXT NOT NULL,
                reported_at TEXT NOT NULL,
                status TEXT NOT NULL,
                confidence TEXT NOT NULL,
                description TEXT NOT NULL,
                filename TEXT NOT NULL,
                coarse_category TEXT NOT NULL,
                top_predictions TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        existing_columns = {
            row["name"]
            for row in connection.execute("PRAGMA table_info(reports)").fetchall()
        }
        for column, definition in (
            ("landmark", "TEXT NOT NULL DEFAULT ''"),
            ("frequency", "TEXT NOT NULL DEFAULT 'Daily'"),
        ):
            if column not in existing_columns:
                connection.execute(
                    f"ALTER TABLE reports ADD COLUMN {column} {definition}"
                )


def create_report(report: dict) -> dict:
    with _lock, _connect() as connection:
        connection.execute(
            """
            INSERT INTO reports (
                id, sound, location, severity, level, reported_at, status,
                confidence, description, filename, coarse_category,
                top_predictions, created_at, landmark, frequency
            ) VALUES (
                :id, :sound, :location, :severity, :level, :reported_at, :status,
                :confidence, :description, :filename, :coarse_category,
                :top_predictions, :created_at, :landmark, :frequency
            )
            """,
            report,
        )
    return get_report(report["id"])


def get_reports() -> list[dict]:
    with _lock, _connect() as connection:
        rows = connection.execute(
            "SELECT * FROM reports ORDER BY created_at DESC"
        ).fetchall()
    return [dict(row) for row in rows]


def get_report(report_id: str) -> dict:
    with _lock, _connect() as connection:
        row = connection.execute(
            "SELECT * FROM reports WHERE id = ?",
            (report_id,),
        ).fetchone()
    if row is None:
        raise KeyError(report_id)
    return dict(row)


def update_report_status(report_id: str, status: str) -> dict:
    with _lock, _connect() as connection:
        cursor = connection.execute(
            "UPDATE reports SET status = ? WHERE id = ?",
            (status, report_id),
        )
        if cursor.rowcount == 0:
            raise KeyError(report_id)
    return get_report(report_id)
