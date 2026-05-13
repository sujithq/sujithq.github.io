+++
title = '📱 Create repos faster with GitHub Mobile'
slug = 'github-mobile-create-repositories'
date = '2026-05-12 09:00:00Z'
lastmod = '2026-05-12 09:00:00Z'
draft = false
tags = [
  "GitHub",
  "GitHub Mobile",
  "Mobile Development",
  "Developer Productivity",
  "Repository Management",
  "Client Apps"
]
categories = [
  "GitHub",
  "Developer Tools",
  "DevOps"
]
series = [
  "GitHub Updates"
]

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''A clean, modern technical illustration of creating a new software repository from a mobile app interface.
    Show a smartphone screen with a minimal "Create repository" form containing fields for name, visibility, template, README, gitignore, and license.
    Add subtle workflow arrows from the phone to a cloud-hosted repository node and a collaboration graph to represent immediate team onboarding.
    Use deep blue, cyan, and graphite tones with soft gradients and geometric UI panels.
    Keep it enterprise-friendly, uncluttered, and focused on mobile-first developer productivity.
    No people, no logos, no text overlays.
    '''

description = "GitHub Mobile now lets you create repositories directly in-app, with templates and initialisation options, so you can start projects anywhere."
+++

GitHub has announced that you can now create repositories directly from the
GitHub Mobile app on both iOS and Android. This removes a common friction point
for developers who capture ideas away from their desktop and want to start a
project immediately.

If you track client app improvements, this is a practical quality-of-life update
that turns GitHub Mobile into a stronger day-to-day creation tool, not only a
triage and review companion.

## What changed

From GitHub Mobile, you can now create a repository from key app entry points:

- On iOS: from Home or Profile, tap `+`, then choose **Create repository**.
- On Android: from Home or the Repositories section in Profile.

During creation, you can:

- Select the owner account.
- Set repository name and optional description.
- Choose visibility: public or private.
- Optionally select a template repository.

Setup options then branch by your choice:

- If using a template: you get an **Include all branches** toggle.
- If not using a template: you can initialise with README, plus optional
  `.gitignore` and license.

After creation, the app takes you straight to the new repository.

## Why this matters in real workflows

This update is small on paper but useful in practice:

- Faster idea capture: start a repo when an idea appears, without context
  switching to desktop.
- Better team responsiveness: create a private repo quickly for incident notes,
  experiments, or spike work.
- Cleaner project bootstrap: initialise with README, `.gitignore`, and license
  at creation time instead of patching later.
- Improved template usage: if your team relies on templates, you can now start
  consistently from mobile.

## Practical caveats to remember

Before treating mobile creation as your default path, keep these constraints in
mind:

- Organisation policies still apply. If your organisation restricts who can
  create repositories, mobile follows the same permissions.
- Template behaviour matches web patterns: template-based creation focuses on
  template options; non-template creation exposes README and other init choices.
- Mobile is excellent for creation and quick hand-off, but deeper repository
  governance and settings are still easier on desktop.

## Quick start checklist

Use this as a simple team rollout checklist:

1. Update GitHub Mobile from the App Store or Google Play.
2. Validate repository creation permissions for your organisation owners and
   teams.
3. Confirm your preferred template repositories are visible to intended users.
4. Define whether new mobile-created repos should default to private visibility.
5. Share an internal naming convention for quick, consistent repo creation.

## Final thoughts

GitHub Mobile keeps moving from passive monitoring towards active project
creation. If your team often starts work from meetings, on-call rotations, or
travel, this feature can reduce delay between idea and implementation.

The strongest pattern is to create quickly on mobile, then continue with branch
protection, repository rules, and automation setup on desktop.

## References

- [Create repositories on the go with GitHub Mobile](https://github.blog/changelog/2026-05-11-create-repositories-on-the-go-with-github-mobile/)
- [GitHub Mobile documentation](https://docs.github.com/en/get-started/using-github/github-mobile)
- [Creating a new repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)
