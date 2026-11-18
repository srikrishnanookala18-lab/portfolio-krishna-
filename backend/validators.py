"""Validation and channel dispatch formatting for portfolio enquiries."""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any, Dict, Tuple
from urllib.parse import quote

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

PORTFOLIO_CONTACT = {
    "email": "srikrishnanookala18@gmail.com",
    "github_url": "https://github.com/srikrishnanookala18-lab",
    "linkedin_url": "https://www.linkedin.com/in/sri-krishna-nookala-19758a44b",
}

ALLOWED_CHANNELS = ("Email", "LinkedIn", "GitHub")


@dataclass(frozen=True)
class ValidatedEnquiry:
    name: str
    email: str
    doubt: str
    description: str


def validate_enquiry_payload(payload: Dict[str, Any]) -> Tuple[OptionalPayload, Dict[str, str]]:
    """Validate all four required enquiry fields and return clean values or field errors."""
    errors: Dict[str, str] = {}

    name = str(payload.get("name", "")).strip()
    email = str(payload.get("email", "")).strip()
    doubt = str(payload.get("doubt", "")).strip()
    description = str(payload.get("description", "")).strip()

    if not name:
        errors["name"] = "Please enter your name."
    elif len(name) > 120:
        errors["name"] = "Name must be 120 characters or fewer."

    if not email:
        errors["email"] = "Please enter your email address."
    elif not EMAIL_PATTERN.match(email):
        errors["email"] = "Please enter a valid email address."

    if not doubt:
        errors["doubt"] = "Please enter your doubt or topic."
    elif len(doubt) > 200:
        errors["doubt"] = "Doubt summary must be 200 characters or fewer."

    if not description or len(description) < 10:
        errors["description"] = "Please add a clear description about your doubt (at least 10 characters)."
    elif len(description) > 3000:
        errors["description"] = "Description must be 3000 characters or fewer."

    if errors:
        return None, errors

    return ValidatedEnquiry(
        name=name,
        email=email,
        doubt=doubt,
        description=description,
    ), {}


OptionalPayload = ValidatedEnquiry | None


def format_enquiry_message(enquiry: ValidatedEnquiry) -> str:
    """Format the structured enquiry into a clean message ready for Email, LinkedIn, or GitHub."""
    return "\n".join(
        [
            "Hello Sri Krishna,",
            "",
            f"Name: {enquiry.name}",
            f"Email: {enquiry.email}",
            f"Doubt / Topic: {enquiry.doubt}",
            "",
            "Description about my doubt:",
            enquiry.description,
        ]
    )


def build_channel_targets(enquiry: ValidatedEnquiry, formatted_message: str) -> Dict[str, Dict[str, str]]:
    """Build direct dispatch metadata exclusively for Email, LinkedIn, and GitHub (no mobile)."""
    subject = quote(f"[Portfolio Enquiry] {enquiry.doubt}")
    body = quote(formatted_message)
    return {
        "Email": {
            "label": "Email",
            "target": f"mailto:{PORTFOLIO_CONTACT['email']}?subject={subject}&body={body}",
            "address": PORTFOLIO_CONTACT["email"],
        },
        "LinkedIn": {
            "label": "LinkedIn",
            "target": PORTFOLIO_CONTACT["linkedin_url"],
            "address": "sri-krishna-nookala",
        },
        "GitHub": {
            "label": "GitHub",
            "target": PORTFOLIO_CONTACT["github_url"],
            "address": "srikrishnanookala18-lab",
        },
    }
