#!/usr/bin/env python3
"""Fetch Microsoft Learn and GitHub certificates data and save to JSON file."""

import json
import sys
import urllib.request
from pathlib import Path
from datetime import datetime, timezone

TRANSCRIPT_ID = "71pnqhwmx5xn8ww"
API_URL = f"https://learn.microsoft.com/api/profiles/transcript/share/{TRANSCRIPT_ID}?locale=en-us&isModuleAssessment=true"
OUTPUT_PATH = Path(__file__).parents[2] / "data" / "certificates.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; Certificate renewal tracker)",
    "Accept": "application/json",
}

CATALOG_CERTIFICATIONS_URL = "https://learn.microsoft.com/api/catalog/?locale=en-us&type=certifications"


def extract_certificate_code(cert_name, cert_id):
    """Extract a compact code-like label from certificate name."""
    if not cert_name:
        return cert_id or "unknown"

    name_match = None
    if "azure" in cert_name.lower():
        import re
        name_match = re.search(r"Azure\s+(.+?)(?:\s+Associate|\s+Expert|\s+Specialty|$)", cert_name, re.IGNORECASE)
    if name_match:
        return name_match.group(1).strip()

    return cert_name.replace("Microsoft Certified:", "").strip()


def fetch_json(url):
    """Fetch JSON data from a URL."""
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def normalize_text(value):
    """Normalize text for resilient catalog name matching."""
    if not value:
        return ""
    return " ".join(value.replace("\ufffd", "").split()).strip().lower()


def fetch_certification_icon_map():
    """Fetch title->icon URL mappings for certifications from the MS Learn catalog."""
    icon_map = {}
    try:
        data = fetch_json(CATALOG_CERTIFICATIONS_URL)
        items = data.get("certifications", []) if isinstance(data, dict) else []
        for item in items:
            title = normalize_text(item.get("title"))
            icon_url = item.get("icon_url")
            if title and icon_url and title not in icon_map:
                icon_map[title] = icon_url
    except Exception as exc:
        print(f"Could not fetch certification icon map from catalog: {exc}")

    print(f"Certification catalog icon entries: {len(icon_map)}")
    return icon_map


def calculate_days_until_expiry(expiration_iso):
    """Calculate days until certificate expires."""
    if not expiration_iso:
        return None
    
    try:
        expiry_date = datetime.fromisoformat(expiration_iso.replace('Z', '+00:00'))
        days = (expiry_date - datetime.now(expiry_date.tzinfo)).days
        return max(0, days)
    except Exception:
        return None


def normalize_cert(cert, icon_map=None):
    """Normalize certificate data for export. Returns None if cert has no expiration."""
    if icon_map is None:
        icon_map = {}
    
    expiration = cert.get("expiration")
    
    # Skip certificates without expiration dates
    if not expiration:
        return None
    
    days_until_expiry = calculate_days_until_expiry(expiration)
    cert_name = cert.get("name", "")
    
    # Determine status category
    status = cert.get("status", "Unknown")
    status_category = "active" if status == "Active" else "inactive"
    if days_until_expiry is not None and days_until_expiry < 30:
        status_category = "expiring_soon"
    
    # Use API icon if available, fall back to catalog icon map (matched by normalized name)
    icon_url = cert.get("iconUrl") or icon_map.get(normalize_text(cert_name))
    
    normalized = {
        "id": cert.get("certificationNumber", ""),
        "name": cert_name,
        "type": "microsoft_learn",
        "status": status,
        "statusCategory": status_category,
        "dateEarned": cert.get("dateEarned"),
        "expiration": expiration,
        "daysUntilExpiry": days_until_expiry,
        "iconUrl": icon_url,
    }
    return normalized


def to_hugo_certificate(cert, cert_type):
    """Transform normalized certificate record to Hugo layout format."""
    cert_id = cert.get("id", "")
    cert_name = cert.get("name", "")
    expiration = cert.get("expiration", "")
    expires = expiration.split("T")[0] if expiration else ""

    return {
        "id": cert_id,
        "code": extract_certificate_code(cert_name, cert_id),
        "desc": cert_name,
        "type": cert_type,
        "expires": expires,
        "daysUntilExpiry": cert.get("daysUntilExpiry"),
        "dateEarned": cert.get("dateEarned"),
        "iconUrl": cert.get("iconUrl"),
        "statusCategory": cert.get("statusCategory"),
    }


def fetch_certificates():
    """Fetch and normalize certificate data from MS Learn."""
    print(f"Fetching transcript from: {API_URL}")
    
    # Load icon URLs from the MS Learn certification catalog
    icon_map = fetch_certification_icon_map()
    
    try:
        data = fetch_json(API_URL)
        
        cert_data = data.get("certificationData", {})
        active_certs = cert_data.get("activeCertifications", [])
        historical_certs = cert_data.get("historicalCertifications", [])
        
        print(f"Fetched {len(active_certs)} active certificates")
        print(f"Fetched {len(historical_certs)} historical certificates")
        
        # Normalize certificates (filter out those without expiration)
        normalized_active = [normalize_cert(cert, icon_map) for cert in active_certs]
        normalized_active = [c for c in normalized_active if c is not None]
        normalized_historical = [normalize_cert(cert, icon_map) for cert in historical_certs]
        normalized_historical = [c for c in normalized_historical if c is not None]
        
        # Build Hugo-ready output structure
        output = {
            "fetchedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "summary": {
                "totalActive": len(normalized_active),
                "totalHistorical": len(normalized_historical),
                "expiringWithin30Days": sum(1 for c in normalized_active if c.get("daysUntilExpiry") is not None and c["daysUntilExpiry"] < 30),
            },
            "activeCertificates": sorted(
                [to_hugo_certificate(c, "Active") for c in normalized_active],
                key=lambda c: c.get("daysUntilExpiry") or 999999
            ),
            "historicalCertificates": [
                to_hugo_certificate(c, "Expired") for c in normalized_historical
            ],
        }
        
        return output
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


def main():
    output = fetch_certificates()
    
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"Saved to: {OUTPUT_PATH}")
    
    # Print summary
    summary = output.get("summary", {})
    print(f"\nSummary:")
    print(f"  Active: {summary.get('totalActive')}")
    print(f"  Historical: {summary.get('totalHistorical')}")
    print(f"  Expiring within 30 days: {summary.get('expiringWithin30Days')}")


if __name__ == "__main__":
    main()
