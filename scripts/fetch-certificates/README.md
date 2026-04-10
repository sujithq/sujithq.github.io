# Certificate Renewal Tracker

Automated fetcher for Microsoft Learn certificates used by the cert-renewal page.

## Single Source of Truth

Only one certificate data file is required:

- `data/certificates.json`

The Hugo template reads from this file via `.Site.Data.certificates`.

## What the Script Does

`fetch_certificates.py`:
- Calls the Microsoft Learn transcript API
- Normalizes certificate data
- Computes expiry status and days left
- Writes Hugo-ready JSON directly to `data/certificates.json`

## Local Usage

```bash
python3 scripts/fetch-certificates/fetch_certificates.py
```

## GitHub Actions Usage

Workflow: `.github/workflows/update-certificates.yml`

- Runs weekly (Sunday at midnight UTC)
- Can be triggered manually (`workflow_dispatch`)
- Commits only `data/certificates.json` when changes exist

## Configuration

Edit in `fetch_certificates.py`:
- `TRANSCRIPT_ID`: your Microsoft Learn transcript ID

## Output Shape

`data/certificates.json` includes:
- `fetchedAt`
- `summary`
- `activeCertificates`
- `historicalCertificates`

Each active certificate includes fields used by the template:
- `code`
- `desc`
- `type`
- `expires`
- `daysUntilExpiry`
- `statusCategory`

## Troubleshooting

If no data appears:
1. Verify `TRANSCRIPT_ID` is correct.
2. Run the script locally and confirm `data/certificates.json` was updated.
3. Check GitHub Actions logs for the `Update Certificates` workflow.
