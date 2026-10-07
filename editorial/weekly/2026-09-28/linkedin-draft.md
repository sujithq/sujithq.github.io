+++
title = "LinkedIn draft: proof of presence"
+++

# LinkedIn draft (unpublished teaser)

Stolen session cookies and long-lived tokens keep showing up in supply chain attacks. A valid credential is not the same as a present, authenticated person.

GitHub just previewed proof of presence: a control that redirects members back to their identity provider for a fresh authentication or MFA check before high-impact actions like creating tokens, editing webhooks, or changing security settings.

It is scoped narrowly today (EMU enterprises on github.com or GHEC-DR, Microsoft Entra ID via SAML or OIDC), and pull request merge gating is coming next. But for enterprise architects, it is a meaningful step: it extends your existing IdP conditional access policies all the way to GitHub's most sensitive administrative actions.

Full breakdown on the blog soon: what proof of presence does, its current limits, and how to plan a rollout if you are on Entra ID with EMU today.

#GitHub #Security #IdentityAndAccess #CloudArchitecture
