"""SQLite persistence layer for enquiries and campus navigation records."""

from __future__ import annotations

import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Dict, Iterator, List, Optional

DB_PATH = Path(__file__).resolve().parent / "portfolio.db"

SEED_ROOMS: List[Dict[str, Any]] = [
    {"id": "R101", "name": "Central Lobby & Helpdesk", "floor": 1, "type": "Facility", "status": "Open", "x": 18, "y": 18, "w": 120, "h": 62},
    {"id": "R102", "name": "Data & DB Lab 102", "floor": 1, "type": "Laboratory", "status": "Occupied", "x": 152, "y": 18, "w": 120, "h": 62},
    {"id": "R103", "name": "Seminar Hall 103", "floor": 1, "type": "Facility", "status": "Available", "x": 286, "y": 18, "w": 116, "h": 62},
    {"id": "R201", "name": "AI & ML Lab 201", "floor": 2, "type": "Laboratory", "status": "Available", "x": 18, "y": 18, "w": 120, "h": 62},
    {"id": "R202", "name": "Robotics Lab 202", "floor": 2, "type": "Laboratory", "status": "Occupied", "x": 152, "y": 18, "w": 120, "h": 62},
    {"id": "R203", "name": "Student Commons 203", "floor": 2, "type": "Facility", "status": "Open", "x": 286, "y": 18, "w": 116, "h": 62},
    {"id": "R301", "name": "Classroom 301", "floor": 3, "type": "Classroom", "status": "Occupied", "x": 18, "y": 18, "w": 120, "h": 62},
    {"id": "R304", "name": "Classroom 304", "floor": 3, "type": "Classroom", "status": "Available", "x": 152, "y": 18, "w": 120, "h": 62},
    {"id": "R305", "name": "Faculty Wing 305", "floor": 3, "type": "Facility", "status": "Open", "x": 286, "y": 18, "w": 116, "h": 62},
]


@contextmanager
def get_connection() -> Iterator[sqlite3.Connection]:
    """Yield an initialized SQLite connection with row factory enabled."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_database() -> None:
    """Create required tables and seed campus room records if empty."""
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS enquiries (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                doubt TEXT NOT NULL,
                description TEXT NOT NULL,
                formatted_message TEXT NOT NULL,
                dispatched_via TEXT,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS campus_rooms (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                floor INTEGER NOT NULL,
                type TEXT NOT NULL,
                status TEXT NOT NULL,
                x INTEGER NOT NULL,
                y INTEGER NOT NULL,
                w INTEGER NOT NULL,
                h INTEGER NOT NULL
            )
            """
        )

        existing = conn.execute("SELECT COUNT(*) AS cnt FROM campus_rooms").fetchone()
        if existing and existing["cnt"] == 0:
            conn.executemany(
                """
                INSERT INTO campus_rooms (id, name, floor, type, status, x, y, w, h)
                VALUES (:id, :name, :floor, :type, :status, :x, :y, :w, :h)
                """,
                SEED_ROOMS,
            )


def insert_enquiry(record: Dict[str, Any]) -> Dict[str, Any]:
    """Persist a validated enquiry into SQLite."""
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO enquiries (
                id, name, email, doubt, description, formatted_message, dispatched_via, created_at
            ) VALUES (
                :id, :name, :email, :doubt, :description, :formatted_message, :dispatched_via, :created_at
            )
            """,
            record,
        )
    return record


def list_enquiries(limit: int = 10) -> List[Dict[str, Any]]:
    """Return recent enquiries ordered newest-first."""
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, name, email, doubt, description, formatted_message, dispatched_via, created_at
            FROM enquiries
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
    return [dict(row) for row in rows]


def update_enquiry_channel(enquiry_id: str, channel: str) -> Optional[Dict[str, Any]]:
    """Record which permitted channel (Email, LinkedIn, GitHub) was used."""
    with get_connection() as conn:
        conn.execute(
            "UPDATE enquiries SET dispatched_via = ? WHERE id = ?",
            (channel, enquiry_id),
        )
        row = conn.execute(
            """
            SELECT id, name, email, doubt, description, formatted_message, dispatched_via, created_at
            FROM enquiries
            WHERE id = ?
            """,
            (enquiry_id,),
        ).fetchone()
    return dict(row) if row else None


def clear_enquiries() -> int:
    """Delete all stored enquiries and return the count removed."""
    with get_connection() as conn:
        cursor = conn.execute("DELETE FROM enquiries")
        return cursor.rowcount or 0


def list_campus_rooms(floor: Optional[int] = None) -> List[Dict[str, Any]]:
    """Return campus room records optionally filtered by floor."""
    with get_connection() as conn:
        if floor is not None:
            rows = conn.execute(
                "SELECT id, name, floor, type, status, x, y, w, h FROM campus_rooms WHERE floor = ? ORDER BY id",
                (floor,),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT id, name, floor, type, status, x, y, w, h FROM campus_rooms ORDER BY floor, id"
            ).fetchall()
    return [dict(row) for row in rows]
