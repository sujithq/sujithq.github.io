# Certificate Integration

## Current Architecture

The certificate renewal page now uses a single data source:

- `data/certificates.json`

Pipeline:
1. `scripts/fetch-certificates/fetch_certificates.py` fetches from Microsoft Learn.
2. The script writes Hugo-ready output directly to `data/certificates.json`.
3. `layouts/tools/cert-renewal.html` reads from `hugo.Data.certificates.activeCertificates`.

## Why This Is Better

- No duplicate `certificates.json` files.
- No JSON-to-JSON transform step.
- Workflow is smaller and less fragile.
- Hugo content page stays clean (`content/tools/cert-renewal/_index.md`).

## Workflow

`.github/workflows/update-certificates.yml`:
- Runs weekly and on manual dispatch.
- Commits only `data/certificates.json` when changed.
