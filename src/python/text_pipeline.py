"""
Use case:
A support team receives ticket text from multiple channels.
We want a lightweight, repeatable pandas pipeline to clean text and extract signals.

Best-practice ideas used:
- method chaining with .assign(...)
- vectorized string ops via .str
- nullable/string dtype handling
- regex extraction with named groups
- no row-by-row Python loops for text transforms
"""

from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
INPUT_CSV = BASE_DIR / "sample_tickets.csv"
OUTPUT_JSON = BASE_DIR / "../server/processed_tickets.json"

def normalize_text(series: pd.Series) -> pd.Series:
    # keep text processing vectorized and null-safe
    return (
        series.astype("string")
        .str.lower()
        .str.replace(r"\s+", " ", regex=True)
        .str.strip()
    )

def run_pipeline() -> pd.DataFrame:
    df = pd.read_csv(INPUT_CSV)

    cleaned = (
        df
        .assign(
            created_at=lambda d: pd.to_datetime(d["created_at"], errors="coerce"),
            text_clean=lambda d: normalize_text(d["text"]),
            # simple intent-like tags from business rules
            has_refund_word=lambda d: d["text_clean"].str.contains(r"\brefund\b", na=False),
            has_login_word=lambda d: d["text_clean"].str.contains(r"\blogin|password\b", na=False),
            # extract order id like ORD-12345
            order_id=lambda d: d["text_clean"].str.extract(r"(?P<order_id>ord-\d{4,})", expand=True),
            channel=lambda d: d["channel"].astype("string").str.lower().str.strip(),
        )
        .assign(
            category=lambda d: pd.Series(
                pd.NA, index=d.index, dtype="string"
            ).mask(d["has_refund_word"], "refund").mask(d["has_login_word"], "auth")
        )
        .fillna({"category": "other"})
        .sort_values("created_at")
        .reset_index(drop=True)
    )

    return cleaned[
        ["ticket_id", "created_at", "channel", "text", "text_clean", "order_id", "category"]
    ]

if __name__ == "__main__":
    result = run_pipeline()
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    result.to_json(OUTPUT_JSON, orient="records", date_format="iso", indent=2)
    print(f"Wrote {len(result)} records to {OUTPUT_JSON}")