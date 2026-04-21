+++
title = 'Root Domain Security Hardening'
slug = 'security-hardening'
url = '/documentation/security-hardening/'
date = '2026-04-21 20:33:49Z'
lastmod = '2026-04-21 20:33:49Z'
draft = false
layout = 'single'
description = 'Operational notes for hardening the quintelier.dev root domain, including Cloudflare header rules and GitHub Pages hygiene.'
[params]
  author = "sujith"
+++

## Scope and boundary

This runbook applies to the root domain **quintelier.dev** served from this repository via GitHub Pages behind Cloudflare. Application subdomains (for example, `app.quintelier.dev`) are owned and configured elsewhere and are intentionally excluded from these steps.

## Edge configuration (Cloudflare)

Set these as response header rules and SSL/TLS settings:

- **Always Use HTTPS:** On
- **SSL/TLS encryption mode:** Full (Strict)
- **HSTS:** `max-age=31536000; includeSubDomains; preload`
- **Response headers:**  
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`  
  - `X-Content-Type-Options: nosniff`  
  - `X-Frame-Options: SAMEORIGIN`  
  - `Referrer-Policy: strict-origin-when-cross-origin`  
  - `Content-Security-Policy:`  
    ```
    default-src 'self'; script-src 'self' https://analytics.ahrefs.com https://d3js.org https://www.clarity.ms 'unsafe-eval' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:;
    ```

## GitHub Pages hygiene

- Keep `static/CNAME` and `.nojekyll` intact for stable hostname and routing.
- Do not host large binaries or downloads under the root domain; keep pages static and cache-friendly.
- Hugo publishes only root-domain content (blog, resume, updates). App assets remain out of scope.

## Change cadence and workflows

- Automated updates run via `.github/workflows/publish-due-posts.yml` every two hours at `:30`. This keeps `/updates` fresh without noisy bursts.
- `.github/workflows/update.yml` is intentionally disabled (schedule commented out). Re-enable only if a deliberate daily update cadence is required.
- Keep blog post publishing deliberate to avoid rapid churn that can affect reputation signals.

## Verification checklist

- Confirm trust routes render and link from navigation/footer: `/about`, `/contact`, `/privacy`, `/cookies`.
- After Cloudflare propagation, check headers with `curl -I https://quintelier.dev/` and ensure the values above are present.
- Inspect for mixed content in browser devtools; all assets should load over HTTPS.
- Verify crawlability: `static/robots.txt` and the generated `/sitemap.xml` remain accessible.
- If SmartScreen flags persist, submit a false-positive appeal referencing the trust pages and header evidence.

## Contact

For security questions, use the {{< relref "/contact/" >}} page. For privacy-specific requests, also review {{< relref "/privacy/" >}} and {{< relref "/cookies/" >}}.
