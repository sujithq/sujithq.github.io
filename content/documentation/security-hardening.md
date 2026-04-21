---
title: "Security Hardening Configuration"
slug: "security-hardening"
date: 2026-04-21
lastmod: 2026-04-21
draft: false
toc: true
description: "Security hardening configuration for quintelier.dev including Cloudflare edge settings, CSP policies, and HTTPS enforcement."
type: "documentation"
robots: "noindex"
---

# Security Hardening for quintelier.dev

This document outlines the security hardening measures implemented for the root domain **quintelier.dev** to improve trust signals, browser reputation, and security posture.

## Scope

**In Scope (This Repository)**:

- Root domain content: blog, resume, updates, tools, and legal pages
- Hugo configuration for navigation and trust pages
- Meta tag fallback policies for security headers
- Static site generation and content structure

**Out of Scope (External Configuration)**:

- App subdomain (app.quintelier.dev) - managed separately
- DNS configuration
- Cloudflare edge rules and settings
- GitHub Pages hosting configuration

## Phase 1: Trust Pages

Trust pages provide transparency and identity verification, critical for browser reputation and SmartScreen evaluation.

### Implemented Pages

1. **About** (`/about/`)
   - Owner identity and professional background
   - Purpose of the site
   - External verification links (GitHub, LinkedIn)

2. **Contact** (`/contact/`)
   - Direct contact method (email)
   - Professional network links
   - Anti-phishing guidance

3. **Cookies** (`/cookies/`)
   - Cookie categories and purposes
   - Consent management
   - Data processing details
   - Cross-reference to Privacy Policy

4. **Privacy** (`/privacy/`)
   - Updated with cross-links to Contact and Cookies
   - GDPR compliance details
   - Data retention and user rights

### Navigation Integration

- **Main menu**: About and Contact added to top navigation
- **Footer menu**: Privacy, Cookies, and Contact links added to footer
- Trust pages are discoverable from all site pages

## Phase 2: Security Headers and Content Security Policy

### Edge Headers (Cloudflare Configuration Required)

The following HTTP response headers must be configured via **Cloudflare Response Header Rules** for the root domain:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' https://d3js.org https://analytics.ahrefs.com https://www.clarity.ms; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: wss:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';
```

**Note**: GitHub Pages cannot natively set all required HTTP security headers. Cloudflare edge rules are the authoritative source for these headers in production.

### CSP Policy Rationale

The Content Security Policy is designed to:

- **Prevent XSS attacks**: `object-src 'none'` blocks plugins
- **Allow required third-party scripts**:
  - `https://d3js.org` - Tech Radar visualization
  - `https://analytics.ahrefs.com` - Analytics (non-consent-based)
  - `https://www.clarity.ms` - Microsoft Clarity (consent-based)
- **Allow inline styles**: Required for Bootstrap and theme system (`'unsafe-inline'`)
- **Allow eval**: Required for certain JavaScript build tools (`'unsafe-eval'`)
- **WebAssembly support**: `'wasm-unsafe-eval'` for potential WASM modules
- **WebSocket connections**: `wss:` for real-time features (future-proofing)
- **Data URIs**: `data:` for fonts and small embedded images

### Meta Tag Fallback

In-repository fallback via `layouts/partials/head.html`:

```html
{{- if eq hugo.Environment "production" }}
<meta http-equiv="Content-Security-Policy" content="...">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta name="referrer" content="strict-origin-when-cross-origin">
{{- end }}
```

These meta tags provide partial coverage but **edge headers take precedence** and are more reliable.

### Third-Party Script Audit

Scripts loaded on the site (from `layouts/partials/js.html`):

1. **Self-hosted** (served from `quintelier.dev`):
   - Bootstrap JS
   - AOS (Animate On Scroll)
   - Swiper
   - PrismJS (syntax highlighting)
   - Custom TypeScript/JavaScript

2. **External CDN**:
   - `https://d3js.org/d3.v7.min.js` - D3.js for Tech Radar
   - `https://analytics.ahrefs.com/analytics.js` - Ahrefs Analytics

3. **Consent-based** (loaded only with user consent):
   - Microsoft Clarity - via `layouts/partials/clarity-consent.html`

All third-party scripts are included in the CSP `script-src` directive.

## Phase 3: HTTPS/TLS Configuration

### Cloudflare SSL/TLS Settings (Required)

Configure the following in **Cloudflare Dashboard > SSL/TLS**:

1. **SSL Mode**: Full (Strict)
   - Ensures encrypted connection between Cloudflare and GitHub Pages
   - Validates GitHub Pages SSL certificate

2. **Always Use HTTPS**: On
   - Redirects all HTTP requests to HTTPS
   - Prevents mixed content and insecure connections

3. **HSTS (HTTP Strict Transport Security)**: Enabled
   - `max-age=31536000` (1 year)
   - `includeSubDomains` flag enabled
   - `preload` flag enabled (for HSTS preload list submission)

4. **Minimum TLS Version**: TLS 1.2 or higher
   - Disables legacy TLS 1.0/1.1

5. **Automatic HTTPS Rewrites**: Enabled
   - Rewrites HTTP URLs in HTML to HTTPS where possible

### Mixed Content Prevention

- All internal resources use relative URLs or HTTPS
- External resources (d3.js, analytics) use HTTPS
- CDN resources served via HTTPS
- No mixed content warnings expected

## Phase 4: Operational Hygiene

### Static Site Structure

- Hugo static site generator
- GitHub Pages hosting
- Cloudflare CDN and edge rules
- Clean, predictable URL structure

### Stable Files

1. **`.nojekyll`**: Prevents GitHub Pages from running Jekyll
2. **`CNAME`**: Declares custom domain `quintelier.dev`
3. **`robots.txt`**: Crawl directives (disallows `/page/` pagination)

### Update Cadence

Predictable, stable update patterns reduce reputation risk:

1. **`publish-due-posts.yml`**: Runs every 2 hours at :30
   - Publishes scheduled posts in approved series
   - Predictable, low-noise deployment pattern

2. **`update.yml`**: Disabled (schedule commented out)
   - Previously ran daily at 05:15 UTC
   - Can be re-enabled via manual trigger (workflow_dispatch)
   - Rationale: Reduces deployment frequency to avoid "noisy" signals

3. **Best Practice**: Keep update frequency predictable
   - Avoid sudden bursts of commits or deployments
   - Maintain stable URL structure
   - Preserve historical content

### Repository Hygiene

- No large binary downloads hosted under root domain paths
- Static assets served from `static/` and processed via Hugo
- Vendor dependencies managed via npm and Hugo modules
- Build artifacts excluded via `.gitignore`

## Phase 5: Verification Checklist

### Local Testing

- [ ] Run `npm run build:prod` to generate production site
- [ ] Verify trust pages render correctly:
  - `/about/`
  - `/contact/`
  - `/cookies/`
  - `/privacy/`
- [ ] Check navigation menu includes About and Contact
- [ ] Check footer includes Privacy, Cookies, Contact links
- [ ] Verify no build errors or warnings

### Post-Deploy Verification

After deploying to production and configuring Cloudflare:

1. **Trust Page Accessibility**:
   - Visit each trust page and verify content
   - Check links from navigation and footer
   - Verify cross-links between legal pages work

2. **HTTP Headers** (use browser DevTools or `curl`):
   ```bash
   curl -I https://quintelier.dev/
   ```
   - Verify `Strict-Transport-Security` header present
   - Verify `X-Content-Type-Options: nosniff`
   - Verify `X-Frame-Options: SAMEORIGIN`
   - Verify `Referrer-Policy: strict-origin-when-cross-origin`
   - Verify `Content-Security-Policy` header present

3. **HTTPS Behavior**:
   - Visit `http://quintelier.dev` and verify redirect to HTTPS
   - Check for mixed content warnings in browser console
   - Verify TLS certificate is valid

4. **Crawlability**:
   - Visit `/robots.txt` and verify directives
   - Visit `/sitemap.xml` and verify generation
   - Check that trust pages are included in sitemap

5. **Browser Security Audit**:
   - Open DevTools > Security tab
   - Verify "Secure connection" and valid certificate
   - Check for CSP violations in Console
   - Verify no mixed content or blocked resources

### SmartScreen Reconsideration

After verification is complete:

1. Prepare evidence:
   - Screenshots of trust pages (/about, /contact, /privacy, /cookies)
   - Screenshot of response headers showing security configuration
   - Domain ownership verification (WHOIS, DNS records)
   - Description of site purpose (personal technical blog)

2. Submit SmartScreen false-positive appeal:
   - Visit [Microsoft SmartScreen feedback](https://www.microsoft.com/en-us/wdsi/support/report-unsafe-site)
   - Provide domain: `quintelier.dev`
   - Category: False positive / Legitimate site incorrectly flagged
   - Attach evidence and description

3. Monitor for recategorization:
   - Check SmartScreen status periodically
   - Re-submit if necessary with additional evidence

## Cloudflare Configuration Runbook

### Step 1: DNS Configuration

Ensure DNS is configured correctly:

- Root domain (`quintelier.dev`) → GitHub Pages IP or CNAME
- Proxied through Cloudflare (orange cloud icon)

### Step 2: SSL/TLS Settings

Navigate to **SSL/TLS** in Cloudflare Dashboard:

1. **Overview** > SSL/TLS encryption mode: **Full (Strict)**
2. **Edge Certificates**:
   - Always Use HTTPS: **On**
   - Minimum TLS Version: **TLS 1.2**
   - Automatic HTTPS Rewrites: **On**
3. **HSTS**:
   - Enable HSTS
   - Max-Age: `31536000` (12 months)
   - Include subdomains: **Checked**
   - Preload: **Checked**
   - No-Sniff Header: **Checked**

### Step 3: Response Header Rules

Navigate to **Rules** > **Transform Rules** > **Modify Response Header**:

Create a new rule for root domain:

**Rule Name**: `quintelier.dev Security Headers`

**Match Criteria**:
- Hostname equals `quintelier.dev`

**Header Modifications**:

1. **Set Static** `Strict-Transport-Security` = `max-age=31536000; includeSubDomains; preload`
2. **Set Static** `X-Content-Type-Options` = `nosniff`
3. **Set Static** `X-Frame-Options` = `SAMEORIGIN`
4. **Set Static** `Referrer-Policy` = `strict-origin-when-cross-origin`
5. **Set Static** `Content-Security-Policy` = `default-src 'self'; script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' https://d3js.org https://analytics.ahrefs.com https://www.clarity.ms; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: wss:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';`

**Action**: Deploy Rule

### Step 4: Caching and Performance

Navigate to **Caching** > **Configuration**:

- **Caching Level**: Standard
- **Browser Cache TTL**: Respect Existing Headers
- **Always Online**: On (optional, for resilience)

### Step 5: Validation

After applying rules, wait 2-5 minutes for propagation, then test:

```bash
curl -I https://quintelier.dev/ | grep -E "(Strict-Transport|X-Content-Type|X-Frame|Referrer-Policy|Content-Security-Policy)"
```

Expected output should include all configured headers.

## Maintenance and Updates

### Regular Reviews

- **Quarterly**: Review and update trust pages for accuracy
- **Quarterly**: Audit CSP for new third-party scripts or restrictions
- **Annually**: Review HSTS configuration and consider preload list submission
- **As needed**: Update security headers based on best practices or vulnerabilities

### CSP Tightening (Future)

If SmartScreen warnings persist or as site evolves:

1. Reduce `'unsafe-eval'` if build tools can avoid it
2. Reduce `'unsafe-inline'` for styles by extracting critical CSS
3. Add `nonce` or `hash` for inline scripts
4. Remove unused third-party script origins
5. Re-submit to SmartScreen with before/after header evidence

### Monitoring

- Set up alerts for:
  - 4xx/5xx errors
  - CSP violation reports (if `report-uri` is added)
  - Unexpected traffic spikes
  - Certificate expiration warnings

## References

- [Content Security Policy (CSP) Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [HTTP Strict Transport Security (HSTS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [Cloudflare SSL/TLS Documentation](https://developers.cloudflare.com/ssl/)
- [GitHub Pages Custom Domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Hugo Security Configuration](https://gohugo.io/about/security/)

## Change Log

- **2026-04-21**: Initial security hardening documentation created
  - Trust pages implemented (About, Contact, Cookies)
  - Privacy page updated with cross-links
  - Navigation and footer menus updated
  - Security meta tags added to head.html
  - Cloudflare configuration documented
