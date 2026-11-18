"""HTTP JSON API server for the Python backend."""

from __future__ import annotations

import json
import os
from datetime import datetime
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Dict
from urllib.parse import parse_qs, urlparse

from backend.database import (
    clear_enquiries,
    init_database,
    insert_enquiry,
    list_campus_rooms,
    list_enquiries,
    update_enquiry_channel,
)
from backend.portfolio_engine import (
    compute_gpa_analytics,
    compute_weather_telemetry,
    resolve_campus_query,
)
from backend.validators import (
    ALLOWED_CHANNELS,
    build_channel_targets,
    format_enquiry_message,
    validate_enquiry_payload,
)


class PortfolioAPIHandler(BaseHTTPRequestHandler):
    """REST request handler serving /api/* endpoints for the portfolio."""

    server_version = "PortfolioPythonAPI/1.0"

    def log_message(self, format: str, *args: Any) -> None:  # noqa: A002
        return

    def _send_json(self, status: int, payload: Dict[str, Any]) -> None:
        encoded = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(encoded)

    def _read_json_body(self) -> Dict[str, Any]:
        raw_length = self.headers.get("Content-Length", "0")
        try:
            length = int(raw_length)
        except ValueError:
            return {}
        if length <= 0 or length > 1_048_576:
            return {}
        raw = self.rfile.read(length)
        try:
            parsed = json.loads(raw.decode("utf-8"))
            return parsed if isinstance(parsed, dict) else {}
        except (UnicodeDecodeError, json.JSONDecodeError):
            return {}

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        params = parse_qs(parsed.query)

        if path == "/api/health":
            self._send_json(HTTPStatus.OK, {"ok": True, "runtime": "python3"})
            return

        if path == "/api/enquiries":
            items = list_enquiries(limit=10)
            self._send_json(HTTPStatus.OK, {"enquiries": items})
            return

        if path == "/api/campus/rooms":
            floor_param = params.get("floor", [None])[0]
            floor_val = int(floor_param) if floor_param and floor_param.isdigit() else None
            self._send_json(HTTPStatus.OK, {"rooms": list_campus_rooms(floor=floor_val)})
            return

        if path == "/api/weather":
            city = params.get("city", ["Hyderabad"])[0]
            self._send_json(HTTPStatus.OK, compute_weather_telemetry(city))
            return

        if path == "/api/education/gpa":
            self._send_json(HTTPStatus.OK, compute_gpa_analytics())
            return

        self._send_json(HTTPStatus.NOT_FOUND, {"error": "Endpoint not found"})

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        body = self._read_json_body()

        if path == "/api/enquiries":
            validated, errors = validate_enquiry_payload(body)
            if errors or validated is None:
                self._send_json(HTTPStatus.BAD_REQUEST, {"errors": errors})
                return

            formatted = format_enquiry_message(validated)
            now = datetime.now()
            record = {
                "id": str(int(now.timestamp() * 1000)),
                "name": validated.name,
                "email": validated.email,
                "doubt": validated.doubt,
                "description": validated.description,
                "formatted_message": formatted,
                "dispatched_via": None,
                "created_at": now.strftime("%I:%M %p").lstrip("0"),
            }
            insert_enquiry(record)
            channels = build_channel_targets(validated, formatted)
            self._send_json(
                HTTPStatus.CREATED,
                {"enquiry": record, "channels": channels},
            )
            return

        if path == "/api/campus/query":
            query = str(body.get("query", ""))
            self._send_json(HTTPStatus.OK, resolve_campus_query(query))
            return

        self._send_json(HTTPStatus.NOT_FOUND, {"error": "Endpoint not found"})

    def do_PATCH(self) -> None:
        parsed = urlparse(self.path)
        parts = [p for p in parsed.path.split("/") if p]

        if len(parts) == 4 and parts[0] == "api" and parts[1] == "enquiries" and parts[3] == "channel":
            enquiry_id = parts[2]
            body = self._read_json_body()
            channel = str(body.get("channel", "")).strip()
            if channel not in ALLOWED_CHANNELS:
                self._send_json(
                    HTTPStatus.BAD_REQUEST,
                    {"error": "Channel must be Email, LinkedIn, or GitHub."},
                )
                return

            updated = update_enquiry_channel(enquiry_id, channel)
            if not updated:
                self._send_json(HTTPStatus.NOT_FOUND, {"error": "Enquiry not found."})
                return

            self._send_json(HTTPStatus.OK, {"enquiry": updated})
            return

        self._send_json(HTTPStatus.NOT_FOUND, {"error": "Endpoint not found"})

    def do_DELETE(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/enquiries":
            removed = clear_enquiries()
            self._send_json(HTTPStatus.OK, {"deleted": removed})
            return
        self._send_json(HTTPStatus.NOT_FOUND, {"error": "Endpoint not found"})


def run_server() -> None:
    """Initialize SQLite and serve the Python backend HTTP API."""
    init_database()
    host = os.environ.get("PYTHON_API_HOST", "127.0.0.1")
    port = int(os.environ.get("PYTHON_API_PORT", "8001"))
    server = ThreadingHTTPServer((host, port), PortfolioAPIHandler)
    print(f"Python portfolio backend listening on http://{host}:{port}", flush=True)
    server.serve_forever()
