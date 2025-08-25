+++
title = 'Getting started with Dependabot'
slug = 'dependabot-getting-started'
date = '2025-08-25 09:00:00Z'
lastmod = '2025-08-25 09:00:00Z'
draft = true
tags = ["GitHub", "Dependabot", "Security"]
categories = ["DevSecOps"]
series = ["GitHub Security"]

layout = "single"
[params]
    cover = true
    author = "sujith"
  cover_prompt = '''Create a clean, modern technical illustration for a blog post about getting started with Dependabot on GitHub.
  Use GitHub’s dark theme accents and a professional palette (black, white, grey, with a hint of blue).
  Visualise: a dependency graph, update arrows, a shield/security badge, and a pull request card titled "Dependabot".
  Include subtle icons for npm, Actions, Docker, Maven/Gradle, and Terraform. Suggest a YAML sheet labeled dependabot.yml.
  Keep it enterprise-ready, minimal, and accessible—no text beyond minimal labels like "PR" and small ecosystem icons.'''
    
description = "Enable Dependabot alerts and updates, add dependabot.yml, and tune it for npm, Actions, Docker, and Java (Maven/Gradle)."
+++

Dependabot is the easiest way to keep dependencies current and secure in your GitHub repositories. It can: alert on vulnerabilities, open PRs to fix them, and keep versions fresh with scheduled updates. This guide shows how to enable Dependabot, add a robust dependabot.yml, and include small optimisations for specific ecosystems.

## What you’ll set up

- Enable Dependabot alerts, security updates, and version updates.
- Create and tune a `.github/dependabot.yml` that covers your package managers.
- Add optional Java metadata to improve PR quality.

## Enable Dependabot in your repository

Use the repository UI:

1. Go to Settings.
1. Under Security, open Advanced Security.
1. Enable: Dependabot alerts, Dependabot security updates, and Dependabot version updates.

If you enable version updates from the UI, GitHub adds a default `.github/dependabot.yml` you can edit.

## Create dependabot.yml

Dependabot looks for a `.github/dependabot.yml` at the repo root. Here’s a practical starting file that covers common ecosystems. Adjust directories and schedules to match your repo layout.

```yaml
version: 2
updates:
  # JavaScript/TypeScript (npm or pnpm)
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"   # daily | weekly | monthly
    open-pull-requests-limit: 10
    labels: ["dependencies"]

  # GitHub Actions (workflow uses action@version syntax only)
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"

  # Docker (Dockerfiles and image tags in k8s manifests/Helm charts)
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"

  # Maven (Java)
  - package-ecosystem: "maven"
    directory: "/"
    schedule:
      interval: "weekly"

  # Gradle (Java/Kotlin)
  - package-ecosystem: "gradle"
    directory: "/"
    schedule:
      interval: "weekly"

  # Terraform
  - package-ecosystem: "terraform"
    directory: "/"
    schedule:
      interval: "weekly"
```

{{< notice-card info >}}

- For pnpm and some others, you still use `package-ecosystem: "npm"` (see Supported ecosystems).
- Poetry and pipenv use the `pip` YAML value (see Supported ecosystems).
- If you have multiple package roots (for example, monorepos), add one `updates` entry per directory.

{{< /notice-card >}}

### Useful options to consider

- [`ignore`](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference#ignore--): ignore specific dependencies or version ranges.
- [`allow`](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference#allow--): restrict updates to a list of dependencies.
- [`commit-message`](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference#commit-message--): add a prefix such as `deps:`.
- [`target-branch`](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference#target-branch-): direct PRs to a non-default branch.
- [`rebase-strategy`](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference#rebase-strategy--): control how rebases are handled.

See the [Dependabot options reference](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference) for the full list.

## Ecosystem specifics and caveats

### GitHub Actions

- Dependabot only updates actions referenced with the GitHub repository syntax: `owner/repo@vX` (for example, `actions/checkout@v5`).
- Local action references like `./.github/actions/foo` and container actions via `docker://` are ignored.

### Docker and Kubernetes/Helm

- Dependabot can add metadata (release notes/changelogs) to Docker PRs when images include the `org.opencontainers.image.source` label in their Dockerfile and matching tags.
- It can update image tags inside Kubernetes manifests and Helm charts when you configure a `docker` entry for those directories.

### Java (Maven and Gradle)

Dependabot uses dependency metadata to enrich PRs. For libraries you publish, add these to your `pom.xml` so Dependabot can link to release notes and issues.

```xml
<project>
  <url>https://github.com/OWNER/REPOSITORY</url>
  <scm>
    <url>https://github.com/OWNER/REPOSITORY</url>
  </scm>
  <issueManagement>
    <url>https://github.com/OWNER/REPOSITORY/issues</url>
  </issueManagement>
</project>
```

- Gradle: Dependabot updates `build.gradle`, `build.gradle.kts`, and standard version catalogs (`gradle/libs.versions.toml`).
- Maven: Dependabot updates `pom.xml` files.

If metadata is missing, PRs are still created, but without rich links.

### Terraform

- Dependabot updates providers and modules (including OCI/registry sources). Private registries are supported with proper configuration.

### Dev containers

- Use `package-ecosystem: "devcontainers"` to keep Features up to date in `devcontainer.json` and lockfiles.

## Private registries and private dependencies

Dependabot can access private package registries and private GitHub repositories, but you must configure credentials in `dependabot.yml` and/or grant org access. See “Configuring access to private registries for Dependabot” and “Managing security and analysis settings for your organisation” in the official docs.

Tip: Keep credentials in GitHub secrets and reference them from `dependabot.yml` rather than using plaintext.

## How Dependabot runs

- Alerts: appear on the repository Security tab when the dependency graph detects known vulnerabilities.
- Security updates: PRs that bump vulnerable versions to a patched release.
- Version updates: PRs on a schedule to keep you current.

After you commit `dependabot.yml`, Dependabot will scan and begin creating PRs based on your schedule. You can merge, close, or tweak the config and rerun.

## Troubleshooting essentials

- Dependabot must be able to resolve all dependencies. If manifests reference private sources, provide access.
- For Actions, only `owner/repo@version` references are updatable.
- For Docker metadata in PRs, ensure images include the `org.opencontainers.image.source` label and matching tags.
- Some ecosystems (for example, Gradle security updates) may rely on dependency submission; check the ecosystem notes in Supported ecosystems.

## Advanced configuration and operations

- Managing PRs for dependency updates: <https://docs.github.com/en/code-security/dependabot/working-with-dependabot/managing-pull-requests-for-dependency-updates>
- Automating Dependabot with GitHub Actions: <https://docs.github.com/en/code-security/dependabot/working-with-dependabot/automating-dependabot-with-github-actions>
- Keeping your actions up to date with Dependabot: <https://docs.github.com/en/code-security/dependabot/working-with-dependabot/keeping-your-actions-up-to-date-with-dependabot>
- Configuring access to private registries: <https://docs.github.com/en/code-security/dependabot/working-with-dependabot/configuring-access-to-private-registries-for-dependabot>
- Guidance for private registry configuration: <https://docs.github.com/en/code-security/dependabot/working-with-dependabot/guidance-for-the-configuration-of-private-registries-for-dependabot>
- Configuring multi-ecosystem updates: <https://docs.github.com/en/code-security/dependabot/working-with-dependabot/configuring-multi-ecosystem-updates>
- About Dependabot on GitHub Actions runners: <https://docs.github.com/en/code-security/dependabot/working-with-dependabot/about-dependabot-on-github-actions-runners>
- Running on self-hosted runners with ARC: <https://docs.github.com/en/code-security/dependabot/working-with-dependabot/setting-dependabot-to-run-on-self-hosted-runners-using-arc>
- Running on GitHub-hosted runners with Azure VNET: <https://docs.github.com/en/code-security/dependabot/working-with-dependabot/setting-dependabot-to-run-on-github-hosted-runners-using-vnet>

## Recap

- Enable alerts, security updates, and version updates.
- Add a single `.github/dependabot.yml` and include one `updates` entry per ecosystem and directory.
- For Java, add project metadata in `pom.xml` to improve PRs.
- Review supported ecosystems for caveats, private registries, and special cases.

Happy patching and stay secure.

## References

- [Dependabot quickstart guide](https://docs.github.com/en/code-security/getting-started/dependabot-quickstart-guide)
- [Dependabot supported ecosystems and repositories](https://docs.github.com/en/code-security/dependabot/ecosystems-supported-by-dependabot/supported-ecosystems-and-repositories)
- [Optimising Java packages for Dependabot updates](https://docs.github.com/en/code-security/dependabot/ecosystems-supported-by-dependabot/optimizing-java-packages-dependabot)
