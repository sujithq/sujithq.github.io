+++
title = '🧰 Manage agent skills with GitHub CLI'
slug = 'manage-agent-skills-github-cli'
date = '2026-04-17 09:00:00Z'
lastmod = '2026-04-17 09:00:00Z'
draft = false
tags = [
  "GitHub",
  "GitHub CLI",
  "GitHub Copilot",
  "Agent Skills",
  "Supply Chain Security",
  "Developer Productivity",
  "Platform Engineering"
]
categories = [
  "GitHub",
  "DevOps",
  "Security",
  "Updates"
]
series = [
  "GitHub Updates"
]

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''Create a clean, modern technical illustration for a blog post about managing AI agent skills with GitHub CLI.
    Show a terminal-centric workflow where a developer installs, pins, previews, updates, and publishes skills from a trusted repository.
    Include visual cues for supply chain integrity: immutable release lock icon, git tag pinning, commit SHA verification, and provenance metadata in SKILL.md frontmatter.
    Represent multi-agent compatibility with subtle icons for Copilot, Claude Code, Cursor, Codex, and Gemini CLI connected to one shared skill package.
    Use a professional engineering aesthetic with GitHub-inspired dark graphite and blue accents plus neutral greys, geometric lines, and uncluttered composition.
    Keep the scene enterprise-ready, practical, and focused on secure, reproducible AI workflow automation for platform teams.'''

description = "GitHub CLI now supports agent skills in public preview. Learn install, pinning, updates, publishing, and supply chain safeguards."
+++

GitHub has introduced `gh skill`, a new GitHub CLI command set for managing agent
skills from repositories. This release is in **public preview**, and it gives
teams a practical workflow to install, update, and publish reusable AI agent
capabilities.

The changelog entry is tagged as a release event, but the feature lifecycle is
currently **public preview**.

If you use coding agents across multiple tools, this matters because it creates
a repeatable way to distribute task-specific instructions and scripts while
adding stronger provenance and version controls.

## What are agent skills

Agent skills are portable folders that contain instructions and optional
resources for an AI agent. At minimum, each skill includes a `SKILL.md` file,
and can also include scripts, references, and assets.

According to the Agent Skills specification, skills are designed to be reused
across multiple agent hosts, not tied to a single product.

## What `gh skill` adds

GitHub CLI now supports end-to-end skill operations:

- Discover and install skills from a repository.
- Pin skills to a release tag or commit SHA.
- Preview skill contents before installation.
- Update installed skills while respecting pinned versions.
- Publish and validate your own skills repository.

The changelog positions this as package-manager-like behaviour for skills, with
special focus on reproducibility and supply chain integrity.

## Quick start commands

GitHub notes that you should update to GitHub CLI `v2.90.0` or later.

```bash
# Browse skills in a repository and install interactively
gh skill install github/awesome-copilot

# Install a specific skill
gh skill install github/awesome-copilot documentation-writer

# Install a version tag
gh skill install github/awesome-copilot documentation-writer@v1.2.0

# Install a commit-pinned revision
gh skill install github/awesome-copilot documentation-writer@abc123def

# Search skills
gh skill search mcp-apps
```

You can also target a specific agent host and scope:

```bash
gh skill install github/awesome-copilot documentation-writer --agent claude-code --scope user
```

## Supported agent hosts

At launch, GitHub lists support for:

- GitHub Copilot
- Claude Code
- Cursor
- Codex
- Gemini CLI
- Antigravity

This is helpful for platform teams that need one reusable capability pack across
different agent tooling choices.

## Why the security model matters

This announcement is not only about convenience. It also introduces controls
that reduce silent drift and tampering risks in skill distribution.

- **Version pinning**: lock installs to a tag or commit with `--pin`.
- **Content-addressed checks**: `gh skill update` compares tree SHAs to detect
  real content changes.
- **Portable provenance**: repository, ref, and tree SHA metadata are written
  into skill frontmatter.
- **Immutable release integration**: `gh skill publish` can guide maintainers to
  enable immutable releases so published assets and tags cannot be altered.

For teams that treat prompts, scripts, and agent behaviour as production
artifacts, these controls are important.

## Publishing your own skills repo

If you maintain an internal or public skills repository:

```bash
# Validate all skills
gh skill publish

# Auto-fix metadata issues
gh skill publish --fix
```

GitHub indicates publish-time checks can include repository hardening signals
such as tag protection, secret scanning, and code scanning recommendations.

## Operational rollout checklist

Use this rollout sequence for enterprise environments:

1. Standardise on GitHub CLI `v2.90.0+` in developer images.
2. Define approved skill sources and required pinning policy.
3. Require `gh skill preview` before first install in sensitive repos.
4. Enable immutable releases on skills repositories where possible.
5. Use scheduled `gh skill update` checks with audit logging.
6. Verify pinned release integrity for critical skills during CI.

For integrity workflows, GitHub also documents release verification commands such
as `gh release verify` and `gh release verify-asset` for immutable release
checks.

## Important preview caveat

GitHub explicitly notes that `gh skill` is in public preview and subject to
change. Skills are not verified by GitHub by default and can contain malicious
instructions or scripts. Review skill content before installation.

## References

- [Manage agent skills with GitHub CLI](https://github.blog/changelog/2026-04-16-manage-agent-skills-with-github-cli/)
- [Agent Skills overview](https://agentskills.io/)
- [Agent Skills specification](https://agentskills.io/specification)
- [About releases](https://docs.github.com/repositories/releasing-projects-on-github/about-releases)
- [Managing releases in a repository](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
- [Immutable releases](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/immutable-releases)
- [Preventing changes to your releases](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/preventing-changes-to-your-releases)
- [Verifying the integrity of a release](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/verifying-the-integrity-of-a-release)
- [skills-ref reference library](https://github.com/agentskills/agentskills/tree/main/skills-ref)
- [GitHub Community announcements](https://github.com/orgs/community/discussions/categories/announcements)

## Recap

`gh skill` makes agent-skill management easier to operationalise in teams,
especially when you combine version pinning, immutable releases, and provenance
tracking. The feature is still preview, so a policy-first rollout and explicit
skill review process are the right next steps.