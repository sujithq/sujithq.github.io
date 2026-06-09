#!/usr/bin/env python3
"""Fetch Microsoft Learn and GitHub certificates data and save to JSON file."""

import json
import re
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path
from datetime import datetime, timezone
from typing import Any

TRANSCRIPT_ID = "71pnqhwmx5xn8ww"
API_URL = f"https://learn.microsoft.com/api/profiles/transcript/share/{TRANSCRIPT_ID}?locale=en-us&isModuleAssessment=true"
OUTPUT_PATH = Path(__file__).parents[2] / "data" / "certificates.json"

HEADERS: dict[str, str] = {
    "User-Agent": "Mozilla/5.0 (compatible; Certificate renewal tracker)",
    "Accept": "application/json",
}

CATALOG_CERTIFICATIONS_URL = "https://learn.microsoft.com/api/catalog/?locale=en-us&type=certifications"
EXAM_UID_PATTERN = re.compile(r"examUid=exam\.([A-Z]{2,3}-\d{3})", re.IGNORECASE)
EXAM_TEXT_PATTERN = re.compile(r"\b([A-Z]{2,3}-\d{3})\b")

CatalogMap = dict[str, dict[str, str | None]]


CERT_CODE_MAP: dict[str, str] = {
    "microsoft certified: azure ai engineer associate": "AI-102",
    "microsoft certified: azure cosmos db developer specialty": "DP-420",
    "microsoft certified: azure security engineer associate": "AZ-500",
    "microsoft certified: azure network engineer associate": "AZ-700",
    "microsoft certified: identity and access administrator associate": "SC-300",
    "microsoft certified: cybersecurity architect expert": "SC-100",
    "microsoft certified: azure administrator associate": "AZ-104",
    "microsoft certified: azure solutions architect expert": "AZ-305",
    "microsoft certified: azure solutions architect expert (legacy)": "AZ-305",
    "microsoft certified: devops engineer expert": "AZ-400",
    "microsoft certified: azure developer associate": "AZ-204",
    "microsoft certified: azure data engineer associate": "DP-203",
    "microsoft certified: azure data scientist associate": "DP-100",
    "microsoft certified: azure database administrator associate": "DP-300",
    "microsoft certified: power bi data analyst associate": "PL-300",
    "microsoft certified: azure fundamentals": "AZ-900",
    "microsoft certified: azure ai fundamentals": "AI-900",
    "microsoft certified: azure data fundamentals": "DP-900",
    "microsoft certified: security, compliance, and identity fundamentals": "SC-900",
    "github copilot": "GH-300",
    "github actions": "GH-200",
    "github foundations": "GH-900",
    "github advanced security": "GH-500",
    "github administration": "GH-100",
}

CERT_PAGE_CODE_CACHE: dict[str, str | None] = {}


def fetch_text(url: str) -> str:
    """Fetch text content from a URL."""
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.read().decode("utf-8")


def fetch_exam_code_from_page(url: str | None) -> str | None:
    """Extract the official exam code from a certification page."""
    if not url:
        return None

    cached = CERT_PAGE_CODE_CACHE.get(url)
    if cached is not None:
        return cached

    try:
        html = fetch_text(url)
    except Exception:
        CERT_PAGE_CODE_CACHE[url] = None
        return None

    match = EXAM_UID_PATTERN.search(html)
    if match:
        code = match.group(1).upper()
        CERT_PAGE_CODE_CACHE[url] = code
        return code

    for candidate in EXAM_TEXT_PATTERN.findall(html):
        candidate = candidate.upper()
        if candidate.startswith(("AZ-", "AI-", "DP-", "SC-", "PL-", "GH-", "MS-", "MB-", "MO-", "AB-")):
            CERT_PAGE_CODE_CACHE[url] = candidate
            return candidate

    CERT_PAGE_CODE_CACHE[url] = None
    return None


def extract_certificate_code(cert_name: str, cert_id: str, catalog_map: CatalogMap | None = None) -> str:
    """Return the official exam code for a certification."""
    if not cert_name:
        return cert_id or "unknown"

    normalized_name = normalize_text(cert_name)

    if catalog_map:
        page_url = catalog_map.get(normalized_name, {}).get("url")
        code = fetch_exam_code_from_page(page_url)
        if code:
            return code

    code = CERT_CODE_MAP.get(normalized_name)
    if code:
        return code

    return cert_name.replace("Microsoft Certified:", "").strip()


def fetch_json(url: str) -> Any:
    """Fetch JSON data from a URL."""
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def normalize_text(value: str | None) -> str:
    """Normalize text for resilient catalog name matching."""
    if not value:
        return ""
    return " ".join(value.replace("\ufffd", "").split()).strip().lower()


def fetch_certification_catalog_map() -> CatalogMap:
    """Fetch title->metadata mappings for certifications from the MS Learn catalog."""
    catalog_map: CatalogMap = {}
    try:
        data = fetch_json(CATALOG_CERTIFICATIONS_URL)
        items: list[Any] = []
        if isinstance(data, dict):
            raw_items = data.get("certifications", [])
            if isinstance(raw_items, list):
                items = raw_items

        for item in items:
            if not isinstance(item, dict):
                continue
            title = normalize_text(item.get("title") if isinstance(item.get("title"), str) else None)
            icon_url = item.get("icon_url") if isinstance(item.get("icon_url"), str) else None
            page_url = item.get("url") if isinstance(item.get("url"), str) else None
            if title and title not in catalog_map:
                catalog_map[title] = {
                    "iconUrl": icon_url,
                    "url": page_url,
                }
    except Exception as exc:
        print(f"Could not fetch certification icon map from catalog: {exc}")

    print(f"Certification catalog entries: {len(catalog_map)}")
    return catalog_map


def calculate_days_until_expiry(expiration_iso: str | None) -> int | None:
    """Calculate days until certificate expires."""
    if not expiration_iso:
        return None
    
    try:
        expiry_date = datetime.fromisoformat(expiration_iso.replace('Z', '+00:00'))
        days = (expiry_date - datetime.now(expiry_date.tzinfo)).days
        return max(0, days)
    except Exception:
        return None


def normalize_cert(cert: dict[str, Any], catalog_map: CatalogMap | None = None) -> dict[str, Any] | None:
    """Normalize certificate data for export. Returns None if cert has no expiration."""
    if catalog_map is None:
        catalog_map = {}
    
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
    icon_url = cert.get("iconUrl") or catalog_map.get(normalize_text(cert_name), {}).get("iconUrl")
    
    normalized: dict[str, Any] = {
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


def to_hugo_certificate(cert: dict[str, Any], cert_type: str, catalog_map: CatalogMap | None = None) -> dict[str, Any]:
    """Transform normalized certificate record to Hugo layout format."""
    cert_id = cert.get("id", "")
    cert_name = cert.get("name", "")
    expiration = cert.get("expiration", "")
    expires = expiration.split("T")[0] if expiration else ""

    return {
        "id": cert_id,
        "code": extract_certificate_code(cert_name, cert_id, catalog_map),
        "desc": cert_name,
        "type": cert_type,
        "expires": expires,
        "daysUntilExpiry": cert.get("daysUntilExpiry"),
        "dateEarned": cert.get("dateEarned"),
        "iconUrl": cert.get("iconUrl"),
        "statusCategory": cert.get("statusCategory"),
    }


def fetch_credly_badges() -> list[dict[str, Any]]:
    """Fetch Credly badge data from the rendered profile page using Playwright."""
    node_path = shutil.which("node") or shutil.which("node.exe")
    npm_path = shutil.which("npm") or shutil.which("npm.cmd") or shutil.which("npm.exe")
    npx_path = shutil.which("npx") or shutil.which("npx.cmd") or shutil.which("npx.exe")

    if node_path is None or npm_path is None or npx_path is None:
        print("Skipping Credly badges: node/npm not available in this environment", file=sys.stderr)
        return []

    repo_root = Path(__file__).resolve().parents[2]
    node_modules = repo_root / "node_modules" / "@playwright" / "test"
    if not node_modules.exists():
        print("Installing project dependencies for Credly badge extraction...")
        subprocess.run([npm_path, "install", "--ignore-scripts", "--no-audit", "--no-fund"], cwd=repo_root, check=True)

    playwright_bin = repo_root / "node_modules" / "playwright" / "index.js"
    if not playwright_bin.exists():
        print("Installing Playwright package for Credly badge extraction...")
        subprocess.run([npm_path, "install", "--ignore-scripts", "--no-audit", "--no-fund"], cwd=repo_root, check=True)

    browser_cache = Path.home() / ".cache" / "ms-playwright"
    if not any(browser_cache.glob("chromium-*")):
        try:
            subprocess.run([npx_path, "playwright", "install", "chromium"], cwd=repo_root, check=True, capture_output=True, text=True)
        except subprocess.CalledProcessError as exc:
            print(f"Playwright browser install warning: {exc.stderr or exc.stdout}", file=sys.stderr)

    script = r'''
const { chromium } = require('@playwright/test');

function normalizeDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function parseBadges(text) {
  const lines = text
    .split('\n')
    .map((line) => line.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const badges = [];
  const seen = new Set();

  for (let i = 0; i < lines.length - 2; i += 1) {
    const name = lines[i];
    const issuer = lines[i + 1];
    const statusLine = lines[i + 2];

    if (!/^(Issued|Expires|Expired)\b/i.test(statusLine)) continue;

    const statusMatch = statusLine.match(/^(Issued|Expires|Expired)\s+(.*)$/i);
    if (!statusMatch) continue;

    const statusType = statusMatch[1].toLowerCase();
    const statusValue = statusMatch[2].trim();
    const key = [name, issuer, statusType, statusValue].map((part) => part.toLowerCase()).join('||');
    if (seen.has(key)) continue;
    seen.add(key);

    const issuedDate = statusType === 'issued' ? normalizeDate(statusValue) : null;
    const expiration = statusType === 'expires' || statusType === 'expired' ? normalizeDate(statusValue) : null;

    badges.push({
      id: `credly-${badges.length + 1}`,
      name,
      issuer,
      status: statusType === 'expired' ? 'Expired' : 'Active',
      statusCategory: statusType === 'expired' ? 'inactive' : 'active',
      dateEarned: issuedDate,
      expiration,
      source: 'credly',
      iconUrl: null,
      code: name,
    });
  }

  return badges;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1600 } });
    await page.goto('https://www.credly.com/users/sujith/badges', { waitUntil: 'networkidle', timeout: 120000 });
    await page.locator('body').waitFor({ state: 'visible', timeout: 120000 });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    const text = await page.locator('body').innerText();
    console.log(JSON.stringify(parseBadges(text)));
  } finally {
    await browser.close();
  }
})();
'''

    result = subprocess.run([node_path, "-e", script], cwd=repo_root, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stderr or result.stdout, file=sys.stderr)
        return []

    raw = result.stdout.strip()
    if not raw:
        return []

    parsed = json.loads(raw)
    if not isinstance(parsed, list):
        return []
    return parsed


def fetch_certificates() -> dict[str, Any]:
    """Fetch and normalize certificate data from MS Learn and Credly."""
    print(f"Fetching transcript from: {API_URL}")
    
    # Load icon URLs from the MS Learn certification catalog
    catalog_map = fetch_certification_catalog_map()
    
    try:
        data = fetch_json(API_URL)
        
        cert_data: dict[str, Any] = data.get("certificationData", {}) if isinstance(data, dict) else {}
        active_certs_raw = cert_data.get("activeCertifications", [])
        historical_certs_raw = cert_data.get("historicalCertifications", [])
        active_certs: list[dict[str, Any]] = [cert for cert in active_certs_raw if isinstance(cert, dict)] if isinstance(active_certs_raw, list) else []
        historical_certs: list[dict[str, Any]] = [cert for cert in historical_certs_raw if isinstance(cert, dict)] if isinstance(historical_certs_raw, list) else []
        
        print(f"Fetched {len(active_certs)} active certificates")
        print(f"Fetched {len(historical_certs)} historical certificates")
        
        # Normalize certificates (filter out those without expiration)
        normalized_active = [normalize_cert(cert, catalog_map) for cert in active_certs]
        normalized_active = [c for c in normalized_active if c is not None]
        normalized_historical = [normalize_cert(cert, catalog_map) for cert in historical_certs]
        normalized_historical = [c for c in normalized_historical if c is not None]
        
        credly_badges = fetch_credly_badges()
        credly_hugo = [
            {
                "id": badge.get("id", ""),
                "code": extract_certificate_code(badge.get("name", ""), badge.get("id", ""), catalog_map),
                "desc": badge.get("name", ""),
                "type": "credly",
                "expires": badge.get("expiration", "").split("T")[0] if badge.get("expiration") else "",
                "daysUntilExpiry": calculate_days_until_expiry(badge.get("expiration")),
                "dateEarned": badge.get("dateEarned"),
                "iconUrl": badge.get("iconUrl"),
                "statusCategory": badge.get("statusCategory", "active"),
            }
            for badge in credly_badges
        ]

        active_certificates = sorted(
            [to_hugo_certificate(c, "Active", catalog_map) for c in normalized_active],
            key=lambda c: c.get("daysUntilExpiry") or 999999
        ) + credly_hugo

        # Build Hugo-ready output structure
        output: dict[str, Any] = {
            "fetchedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "summary": {
                "totalActive": len(active_certificates),
                "totalHistorical": len(normalized_historical),
                "expiringWithin30Days": sum(1 for c in active_certificates if c.get("daysUntilExpiry") is not None and c["daysUntilExpiry"] < 30),
            },
            "activeCertificates": active_certificates,
            "historicalCertificates": [
                to_hugo_certificate(c, "Expired", catalog_map) for c in normalized_historical
            ],
            "credlyBadges": credly_hugo,
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
