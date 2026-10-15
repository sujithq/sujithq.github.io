+++
title = 'GitHub proof of presence closes the token gap 🔐'
slug = 'github-proof-of-presence-high-impact-actions'
date = '2026-09-28 09:00:00Z'
lastmod = '2026-09-28 09:00:00Z'
draft = true
tags = ["GitHub", "Security", "Identity"]
categories = ["Security"]
series = ["GitHub Platform"]

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''A minimalist security-themed illustration showing a shield with a fingerprint or identity check icon, connected to a cloud and an identity provider login screen, in a modern flat tech style with blue and dark tones, suitable for a technical blog cover about enterprise identity verification.
    '''

description = "GitHub's new proof of presence preview requires a fresh IdP check before high-impact actions, closing a gap stolen tokens exploit."
+++

Stolen session cookies and long-lived tokens have shown up repeatedly in recent supply chain attacks. A valid credential is not the same thing as a person acting in good faith at that moment, and attackers know it. GitHub's new public preview feature, proof of presence, is built to close exactly that gap for high-impact actions on GitHub Enterprise Cloud accounts.

## What proof of presence adds

Proof of presence extends GitHub's existing sudo mode, which already asks members to re-confirm their identity before certain sensitive actions. The new capability routes that confirmation through the enterprise's own identity provider (IdP) instead of relying purely on GitHub's session state.

When a member attempts a high-impact action, such as creating a token, editing webhooks, changing organisation security settings, or viewing recovery codes, GitHub redirects them back to the IdP to satisfy a specific authentication policy. Depending on how the enterprise configures it, this can mean:

- Authenticating again with the IdP, which may accept a password depending on IdP policy.
- Satisfying an additional multi-factor challenge, such as an authenticator app or biometric check, as configured in the IdP.

GitHub only allows the action to proceed once the member returns from the IdP with proof that the required policy was satisfied. After a successful challenge, the same browser session can continue performing high-impact actions for two hours before another proof of presence check is required, mirroring the session model already used by sudo mode.

## Availability and scope today

This is a public preview, and it is deliberately narrow in scope right now:

- It only applies to managed user (EMU) enterprises on github.com and to GHEC-DR.
- It requires Microsoft Entra ID as the SSO identity provider, connected via SAML or OIDC.
- Support for requiring proof of presence before pull request merges is planned but not yet available.

That scope matters for architecture planning. If your enterprise is not on EMU, is not using GHEC-DR, or federates through a different IdP, you cannot enable this yet. Track the feature's rollout before committing to it in a security roadmap.

## Why this matters for enterprise architecture

Most enterprises already have conditional access policies in their identity provider: device compliance checks, risk-based sign-in policies, step-up authentication for sensitive systems. Until now, those policies stopped at the GitHub session boundary. A compromised or long-lived GitHub session could bypass IdP-side hardening entirely, because GitHub was not asking the IdP again once a session existed.

Proof of presence closes that boundary. It lets you extend the same conditional access posture you already use for other enterprise systems to the specific, high-impact actions inside GitHub that carry the most risk: token creation, webhook changes, security setting changes and recovery code access.

For regulated industries, this also has compliance value. GitHub explicitly calls out frameworks like FDA Part 11, which require fresh authentication before sensitive operations. Proof of presence gives architects a documented, IdP-enforced control they can point to when demonstrating that sensitive actions require a freshly authenticated, present human.

## How to plan a rollout

If your enterprise is on EMU with Entra ID as SSO, and you want to evaluate proof of presence:

1. Identify which IdP conditional access policies you want to apply to high-impact GitHub actions, for example requiring a compliant device or a specific MFA method.
2. Decide whether your policy should require simple re-authentication or an additional multi-factor challenge, and configure the corresponding requirement in Entra ID.
3. Communicate the two-hour session window to your security and support teams, since users will be re-prompted periodically rather than on every single action.
4. Watch for the planned extension to pull request merges, since that will be the point where this control most directly touches software delivery workflows rather than administrative actions.

## What to watch next

Because this is a public preview scoped narrowly to EMU and Entra ID, expect GitHub to broaden IdP support and account types over time, and to eventually land pull request merge gating. Enterprises outside the current scope should still evaluate their conditional access maturity now, so they are ready to adopt proof of presence as soon as it becomes available for their configuration.

## Recap

Proof of presence is a narrowly scoped but architecturally significant preview: it binds GitHub's highest-impact administrative actions to a fresh check against the enterprise's own identity provider, directly addressing the stolen-token and hijacked-session attack pattern seen across recent supply chain incidents. For CSAs advising regulated or security-conscious customers, it is worth tracking closely, and worth planning for even before the pull request merge gating capability lands.
