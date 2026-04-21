+++
title = 'About'
slug = 'about'
url = '/about/'
date = '2026-04-21 20:33:49Z'
lastmod = '2026-04-21 20:33:49Z'
draft = false
layout = 'single'
description = 'Who runs quintelier.dev, what lives here, and how the root domain is operated.'
[params]
  author = "sujith"
+++

## Purpose of quintelier.dev

quintelier.dev is my personal root domain for publishing articles, updates, and my resume. It does not host product builds or application payloads. Any app-specific subdomains (for example, `app.quintelier.dev`) are managed outside this repository and are not served from GitHub Pages.

## Who I am

I am **Sujith Quintelier**, a Belgium-based cloud and DevOps engineer focusing on Azure, GitHub, automation, and security-by-default practices.

## What you will find here

- Technical posts, update feeds, and changelogs that stay versioned and stable.
- A public resume and portfolio items that track my current skill set.
- Experiments and tools built with Hugo, TypeScript, and SCSS that remain static and cache-friendly.

## How I run the site

- Static site generation with Hugo, published through GitHub Pages and protected at the edge with Cloudflare.
- HTTPS-only posture with HSTS and security headers managed in Cloudflare (documented in the security hardening notes).
- Predictable publishing cadence: scheduled update runs keep `/updates` current while blog posts are added deliberately to avoid churn.

## Identity and trust links

- GitHub: [github.com/sujithq](https://github.com/sujithq)
- LinkedIn: [linkedin.com/in/sujith-quintelier](https://www.linkedin.com/in/sujith-quintelier/)
- Privacy and cookies: visit {{< relref "/privacy/" >}} and {{< relref "/cookies/" >}} for data handling details.

## Need to reach me?

Use the {{< relref "/contact/" >}} page for direct contact options and guidance on the safest way to verify messages.
