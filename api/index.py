"""Vercel Python Serverless Function entry point routing all /api/* requests."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.database import init_database
from backend.server import PortfolioAPIHandler

init_database()


class handler(PortfolioAPIHandler):
    """Vercel serverless HTTP handler inheriting PortfolioAPIHandler."""

    def setup(self) -> None:
        init_database()
        super().setup()
