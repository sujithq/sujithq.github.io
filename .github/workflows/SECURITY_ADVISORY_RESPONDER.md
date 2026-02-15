# Security Advisory Responder - Agentic Workflow

## Overview

The Security Advisory Responder is an agentic workflow that automatically responds to security vulnerabilities in your dependencies. It transforms Dependabot alerts from simple notifications into actionable, well-analyzed PRs or comments.

## How It Works

### Triggers

The workflow is triggered by two events:

1. **Dependabot Security PRs** (`pull_request.opened`)
   - When Dependabot creates a PR for a security update
   - The agent enhances the PR with detailed usage analysis
   - Adds a comprehensive comment explaining the impact and safety of the update

2. **Security-Labeled Issues** (`issues.labeled`)
   - When an issue is labeled with "security"
   - The agent parses the vulnerability details from the issue
   - Creates a new PR with the fix and detailed analysis

### What the Agent Does

The Security Advisory Responder agent performs the following actions:

1. **Identifies the vulnerability**
   - Extracts package name, versions, CVE/GHSA IDs, and severity
   - Parses advisory details from PR body or issue description

2. **Analyzes actual usage**
   - Searches the codebase for `import`/`require` statements (npm packages)
   - Searches for `using` statements (NuGet packages)
   - Determines if the package is directly imported or just a transitive dependency
   - Lists specific files and lines where the package is used

3. **Assesses the impact**
   - Categorizes as direct vs transitive dependency
   - Identifies breaking changes (major version bumps)
   - Evaluates whether the vulnerability affects running code

4. **Applies or verifies the fix**
   - For issues: Creates a new branch and updates the dependency
   - For Dependabot PRs: Analyzes the existing changes
   - Runs `npm audit` or `dotnet list package --vulnerable` to verify
   - Checks for newly introduced vulnerabilities

5. **Provides actionable recommendations**
   - Clear merge safety assessment
   - Flags if manual review is needed
   - Suggests testing if the package is actively used
   - Documents any breaking changes or concerns

## Example Scenarios

### Scenario 1: Dependabot PR for a Minor Security Update

**Trigger:** Dependabot opens PR to update `axios` from 0.21.1 to 0.21.4 (security fix)

**Agent Actions:**
1. Detects Dependabot PR and security keywords
2. Searches codebase: finds `import axios from 'axios'` in `src/utils/api.ts`
3. Confirms it's a direct dependency in `package.json`
4. Identifies it as a minor version bump (safe)
5. Runs `npm audit` to verify fix
6. Posts detailed comment with usage analysis and "✅ Safe to merge" recommendation

**Result:** Maintainer can confidently merge the PR with full context

### Scenario 2: Issue Reporting a Critical Vulnerability

**Trigger:** User opens issue with "security" label: "CVE-2024-1234 in lodash 4.17.19"

**Agent Actions:**
1. Detects security label on issue
2. Parses issue body for CVE ID, package name, and version
3. Searches codebase: finds `_.map()` usage in multiple files
4. Confirms it's a direct dependency
5. Creates branch `security/fix-lodash-CVE-2024-1234`
6. Updates `package.json` to safe version 4.17.21
7. Runs `npm audit` to verify
8. Opens PR with comprehensive analysis
9. Comments on original issue with PR link

**Result:** Issue is automatically addressed with a PR ready for review

### Scenario 3: Transitive Dependency Update

**Trigger:** Dependabot PR to update `postcss` (used by `autoprefixer`)

**Agent Actions:**
1. Analyzes PR and identifies `postcss` vulnerability
2. Searches codebase: no direct imports found
3. Checks `package-lock.json`: confirms it's a transitive dependency via `autoprefixer`
4. Identifies parent package and relationship
5. Posts comment: "This is a transitive dependency brought in by autoprefixer. Not directly imported. ✅ Safe to merge."

**Result:** Maintainer understands the update is low-risk

## Configuration

### Required Secrets

- `AW_WORKFLOWS_PAT`: Personal Access Token with `contents: write` and `pull-requests: write` permissions

### Supported Ecosystems

- **npm**: JavaScript/TypeScript packages in `package.json`
- **NuGet**: .NET packages in `*.csproj` files (e.g., `src/Crawler/Crawler.csproj`)
- **GitHub Actions**: Actions in `.github/workflows/*.yml` (via Dependabot)

### Workflow Permissions

```yaml
permissions:
  contents: write        # To create branches and commits
  pull-requests: write   # To create PRs and add comments
  issues: write          # To comment on issues
  security-events: read  # To read security advisories
```

## Usage

### For Maintainers

1. **Review Agent Comments**: When a Dependabot PR arrives, check the agent's comment for:
   - Usage analysis (is it actually used?)
   - Breaking change warnings
   - Merge safety recommendation

2. **Act on Recommendations**:
   - ✅ "Safe to merge": Review quickly and merge
   - 🔍 "Requires manual review": Check breaking changes carefully
   - 🧪 "Requires testing": Run tests, especially if usage is found

3. **For Security Issues**: Simply label an issue with "security" and include:
   - Package name
   - CVE or GHSA ID
   - Current and patched versions
   - The agent will handle the rest

### For Contributors

If you find a security vulnerability:
1. Open an issue
2. Add the "security" label
3. Include vulnerability details (CVE, package, versions)
4. The agent will create a PR automatically

## Compilation

The workflow is defined in `.github/workflows/security-advisory-responder.md` and compiled to a lock file using the `gh-aw` extension:

```bash
gh aw compile
```

This generates `.github/workflows/security-advisory-responder.lock.yml` which is the actual workflow file that GitHub Actions runs.

To update the workflow:
1. Edit the `.md` file
2. Run `gh aw compile` (or push changes - the compile workflow runs automatically)
3. Commit the updated `.lock.yml` file

## Benefits

- **Actionable Context**: Transforms alerts into detailed, understandable PRs
- **Time Savings**: Automates research and analysis of vulnerabilities
- **Better Decisions**: Clear recommendations help maintainers merge confidently
- **Usage Analysis**: Know if a vulnerable package is actually used
- **Consistency**: Every security update gets the same thorough review

## Limitations

- **Beta Feature**: Agentic workflows are a GitHub feature in active development
- **Agent Capabilities**: The agent may not always correctly identify all usage patterns
- **Manual Review**: Always recommended for major version updates or critical vulnerabilities
- **Network Access**: Requires network access to npm/NuGet registries

## Reference

- [GitHub Agentic Workflows Documentation](https://github.github.com/gh-aw/introduction/overview/)
- [Dependabot Configuration](https://docs.github.com/en/code-security/dependabot)
- [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories)

## Feedback

If you encounter issues with the Security Advisory Responder:
1. Check the workflow run logs in GitHub Actions
2. Review the agent's comments for error messages
3. Open an issue in this repository with the workflow run link
