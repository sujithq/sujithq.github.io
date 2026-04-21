+++
title = 'Security Hardening'
slug = 'security-hardening'
date = '2026-04-21 20:00:00Z'
lastmod = '2026-04-21 20:00:00Z'
draft = false
robots = "noindex"
layout = "single"
description = "Documents the Cloudflare and GitHub Pages security configuration required for quintelier.dev root domain hardening."
+++

## Overview

This document records the required Cloudflare and GitHub Pages configuration for root-domain hardening of **quintelier.dev**. It is an operational reference for the site owner. All settings listed here must be applied at the edge (Cloudflare) — GitHub Pages cannot natively enforce HTTP security headers.

## Scope

This document covers **quintelier.dev** (root domain) only. App subdomain provisioning is managed outside this repository.

## Cloudflare Settings

### SSL/TLS

| Setting | Value |
|---------|-------|
| SSL mode | **Full (Strict)** |
| Always Use HTTPS | **On** |
| Minimum TLS Version | **TLS 1.2** |
| HSTS | Enabled (see below) |

### HSTS (HTTP Strict Transport Security)

Enable via Cloudflare SSL/TLS → Edge Certificates → HTTP Strict Transport Security (HSTS):

| Field | Value |
|-------|-------|
| Enable HSTS | On |
| Max Age | 31536000 (12 months) |
| Include Subdomains | On |
| Preload | On |
| No-Sniff Header | On |

### Response Header Rules

Configure via Cloudflare Rules → Transform Rules → Modify Response Headers. Apply these headers to all requests matching `*.quintelier.dev` or `quintelier.dev`:

| Header | Value |
|--------|-------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | See CSP baseline below |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

### Content Security Policy Baseline

```
default-src 'self';
script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' https://www.clarity.ms https://analytics.ahrefs.com https://d3js.org;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: https:;
font-src 'self' data: https://fonts.gstatic.com;
connect-src 'self' https:;
frame-ancestors 'none';
```

Note: The site also includes a `<meta http-equiv="Content-Security-Policy">` fallback in `layouts/partials/head.html`. The Cloudflare response header is the canonical source of truth; the meta tag is a defence-in-depth fallback only.

## GitHub Pages Configuration

| File | Purpose |
|------|---------|
| `static/CNAME` | Declares `quintelier.dev` as the custom domain |
| `static/.nojekyll` | Prevents Jekyll processing on GitHub Pages |

These files must remain stable. Do not rename or remove them.

## Update Workflow Cadence

| Workflow | File | Status | Notes |
|----------|------|--------|-------|
| Publish due posts | `.github/workflows/publish-due-posts.yml` | Active | Primary publishing path; runs on schedule |
| Daily updates | `.github/workflows/update.yml` | Disabled (if applicable) | Keep disabled unless explicitly re-enabled; reduces deployment burst noise |

Keeping deployment cadence predictable supports domain reputation stability for browser trust signals (e.g., Microsoft SmartScreen).

## Trust Pages

The following pages provide owner identity and legal transparency for root-domain content:

| Route | Purpose |
|-------|---------|
| `/about/` | Owner identity and site purpose |
| `/contact/` | Direct contact method and anti-phishing note |
| `/privacy/` | Full privacy policy (GDPR) |
| `/cookies/` | Cookie categories and consent model |

These pages are linked from the site footer and are crawlable per `static/robots.txt`.

## Verification Checklist (Post-Deploy)

Run these checks after applying Cloudflare rules:

- [ ] `curl -I https://quintelier.dev/` returns `strict-transport-security` header
- [ ] `curl -I https://quintelier.dev/` returns `x-content-type-options: nosniff`
- [ ] `curl -I https://quintelier.dev/` returns `x-frame-options: SAMEORIGIN`
- [ ] `curl -I https://quintelier.dev/` returns `referrer-policy` header
- [ ] `curl -I https://quintelier.dev/` returns `content-security-policy` header
- [ ] HTTP → HTTPS redirect confirmed: `curl -I http://quintelier.dev/`
- [ ] Trust pages render: `/about/`, `/contact/`, `/privacy/`, `/cookies/`
- [ ] No mixed-content warnings in browser DevTools on any page
- [ ] `https://quintelier.dev/sitemap.xml` is accessible and valid
- [ ] `https://quintelier.dev/robots.txt` is accessible and lists `Sitemap:`

## SmartScreen Reconsideration

After verifying headers and trust pages are live, submit a false-positive appeal at:
<https://www.microsoft.com/en-us/wdsi/support/report-unsafe-site>

Include in the submission:

- Domain: `quintelier.dev`
- Evidence of ownership (GitHub repo, WHOIS)
- Links to trust pages: About, Contact, Privacy, Cookies
- Evidence of stable deployment cadence
- Screenshot of security headers from DevTools or curl output
