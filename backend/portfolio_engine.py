"""Domain computation engines in Python for campus NL navigation, weather analytics, and GPA stats."""

from __future__ import annotations

from typing import Any, Dict, List

from backend.database import list_campus_rooms

SEMESTER_GPAS: List[Dict[str, Any]] = [
    {"label": "Sem 1", "gpa": 9.02, "note": "Completed"},
    {"label": "Sem 2", "gpa": 8.86, "note": "Completed"},
    {"label": "Sem 3", "gpa": None, "note": "Upcoming"},
    {"label": "Sem 4", "gpa": None, "note": "Upcoming"},
    {"label": "Sem 5", "gpa": None, "note": "Upcoming"},
    {"label": "Sem 6", "gpa": None, "note": "Upcoming"},
    {"label": "Sem 7", "gpa": None, "note": "Upcoming"},
    {"label": "Sem 8", "gpa": None, "note": "Upcoming"},
]

WEATHER_BASELINE: Dict[str, Dict[str, Any]] = {
    "Hyderabad": {
        "temp_c": 31,
        "humidity_pct": 44,
        "wind_kmh": 14,
        "pressure_hpa": 1011,
        "uv_index": 7,
        "uv_label": "7 (High)",
        "hourly": [
            {"t": "09h", "v": 26},
            {"t": "12h", "v": 31},
            {"t": "15h", "v": 33},
            {"t": "18h", "v": 29},
            {"t": "21h", "v": 25},
            {"t": "00h", "v": 23},
        ],
        "daily": [
            {"t": "Mon", "v": 32},
            {"t": "Tue", "v": 33},
            {"t": "Wed", "v": 31},
            {"t": "Thu", "v": 30},
            {"t": "Fri", "v": 32},
            {"t": "Sat", "v": 34},
            {"t": "Sun", "v": 33},
        ],
    },
    "Bengaluru": {
        "temp_c": 25,
        "humidity_pct": 61,
        "wind_kmh": 18,
        "pressure_hpa": 1015,
        "uv_index": 5,
        "uv_label": "5 (Mod)",
        "hourly": [
            {"t": "09h", "v": 21},
            {"t": "12h", "v": 25},
            {"t": "15h", "v": 27},
            {"t": "18h", "v": 23},
            {"t": "21h", "v": 20},
            {"t": "00h", "v": 19},
        ],
        "daily": [
            {"t": "Mon", "v": 26},
            {"t": "Tue", "v": 27},
            {"t": "Wed", "v": 25},
            {"t": "Thu", "v": 24},
            {"t": "Fri", "v": 26},
            {"t": "Sat", "v": 27},
            {"t": "Sun", "v": 26},
        ],
    },
    "Delhi": {
        "temp_c": 36,
        "humidity_pct": 29,
        "wind_kmh": 11,
        "pressure_hpa": 1008,
        "uv_index": 8,
        "uv_label": "8 (Very High)",
        "hourly": [
            {"t": "09h", "v": 29},
            {"t": "12h", "v": 36},
            {"t": "15h", "v": 38},
            {"t": "18h", "v": 34},
            {"t": "21h", "v": 29},
            {"t": "00h", "v": 26},
        ],
        "daily": [
            {"t": "Mon", "v": 37},
            {"t": "Tue", "v": 38},
            {"t": "Wed", "v": 36},
            {"t": "Thu", "v": 35},
            {"t": "Fri", "v": 37},
            {"t": "Sat", "v": 39},
            {"t": "Sun", "v": 38},
        ],
    },
}


def compute_gpa_analytics() -> Dict[str, Any]:
    """Compute academic GPA summary metrics across completed semesters."""
    completed = [s["gpa"] for s in SEMESTER_GPAS if isinstance(s["gpa"], (int, float))]
    mean_gpa = round(sum(completed) / len(completed), 2) if completed else 0.0
    return {
        "semesters": SEMESTER_GPAS,
        "completed_count": len(completed),
        "mean_gpa": mean_gpa,
        "highest_gpa": max(completed) if completed else 0.0,
        "lowest_gpa": min(completed) if completed else 0.0,
    }


def compute_weather_telemetry(city: str) -> Dict[str, Any]:
    """Compute comfort classification and advisory alert in Python for a requested city."""
    selected_city = city if city in WEATHER_BASELINE else "Hyderabad"
    raw = WEATHER_BASELINE[selected_city]
    temp_c = raw["temp_c"]
    humidity = raw["humidity_pct"]
    uv = raw["uv_index"]

    if temp_c >= 35:
        comfort = "Hot / Arid"
        alert = {
            "level": "Heat Alert",
            "text": "High daytime temperature & UV index; limit direct afternoon sun.",
        }
    elif temp_c >= 29:
        comfort = "Warm / Dry"
        alert = {
            "level": "Advisory",
            "text": "Peak UV window 11:30–15:00 IST. Hydrate regularly.",
        }
    else:
        comfort = "Pleasant"
        alert = {
            "level": "Clear",
            "text": "Mild evening breeze expected; comfortable outdoor index.",
        }

    # Approximate apparent temperature (Australian Bureau of Meteorology formula)
    apparent_c = round(temp_c + 0.33 * (humidity / 100.0 * 6.105) - 0.70 * (raw["wind_kmh"] / 3.6) - 4.0, 1)

    return {
        "city": selected_city,
        "temp": f"{temp_c}°C",
        "apparent_temp": f"{apparent_c}°C",
        "humidity": f"{humidity}%",
        "wind": f"{raw['wind_kmh']} km/h",
        "pressure": f"{raw['pressure_hpa']} hPa",
        "uv": raw["uv_label"],
        "uv_index": uv,
        "comfort": comfort,
        "alert": alert,
        "hourly": raw["hourly"],
        "daily": raw["daily"],
    }


def resolve_campus_query(raw_query: str) -> Dict[str, Any]:
    """Resolve natural-language campus room & availability queries against SQLite."""
    query = (raw_query or "").strip() or "Find available AI Lab"
    text = query.lower()
    rooms = list_campus_rooms()

    if "vacant" in text or ("available" in text and "ai" not in text):
        intent = "availability_filter"
        matches = [r for r in rooms if r["status"] == "Available"]
    elif "ai" in text or "ml" in text:
        intent = "lab_lookup"
        matches = [r for r in rooms if r["id"] == "R201"]
    elif "304" in text:
        intent = "room_id_lookup"
        matches = [r for r in rooms if r["id"] == "R304"]
    elif "lab" in text:
        intent = "type_filter"
        matches = [r for r in rooms if r["type"] == "Laboratory"]
    else:
        intent = "keyword_search"
        matches = [
            r for r in rooms if text in r["name"].lower() or text in r["id"].lower()
        ]

    if not matches and rooms:
        matches = [rooms[0]]

    summary = "; ".join(
        f"{m['id']} ({m['name']}, Floor {m['floor']}, {m['status']})" for m in matches
    )

    return {
        "query": query,
        "intent": intent,
        "floor": matches[0]["floor"] if matches else 2,
        "highlighted_ids": [m["id"] for m in matches],
        "matches": matches,
        "trace": [
            f'1. NL Query: "{query}"',
            f"2. Python Intent Engine ({intent}): SQLite room & availability lookup",
            f"3. Matched: {summary}",
        ],
    }
