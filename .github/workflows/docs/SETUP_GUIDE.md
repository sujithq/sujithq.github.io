# Security Advisory Responder - Setup and Testing Guide

## Overview

This guide explains how to set up, test, and use the Security Advisory Responder agentic workflow in your repository.

## Prerequisites

- GitHub repository with Dependabot enabled
- GitHub Copilot Workspace or Agentic Workflows feature enabled
- `gh` CLI tool installed with `gh-aw` extension
- Personal Access Token (PAT) with appropriate permissions

## Setup

### 1. Install gh-aw Extension

```bash
gh extension install github/gh-aw
```

### 2. Configure PAT Secret

Create a Personal Access Token with the following permissions:
- `contents: write` - To create branches and commits
- `pull-requests: write` - To create PRs and add comments
- `issues: write` - To comment on issues

Add it to your repository secrets as `AW_WORKFLOWS_PAT`:
1. Go to repository Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Name: `AW_WORKFLOWS_PAT`
4. Value: Your PAT
5. Click "Add secret"

### 3. Compile the Workflow

The workflow markdown file needs to be compiled into a workflow lock file:

```bash
# From the repository root
gh aw compile
```

This will generate `.github/workflows/security-advisory-responder.lock.yml` which is the actual workflow file that GitHub Actions runs.

Alternatively, the workflow is automatically compiled when you push changes to `.github/workflows/*.md` files (via the `agentic-compile.yml` workflow).

### 4. Verify Compilation

Check that the lock file was created:

```bash
ls -la .github/workflows/security-advisory-responder.lock.yml
```

The lock file should contain the compiled workflow definition.

## Testing the Workflow

### Test 1: Security-Labeled Issue

1. Create a test issue in your repository
2. Add content like:
   ```markdown
   Security vulnerability found in lodash
   
   **Package:** lodash
   **Current Version:** 4.17.19
   **Patched Version:** 4.17.21
   **CVE:** CVE-2020-8203
   **GHSA:** GHSA-p6mc-m468-83gw
   **Severity:** High
   
   Please update to fix prototype pollution vulnerability.
   ```
3. Add the "security" label to the issue
4. Wait for the workflow to run
5. Check that:
   - A new PR was created
   - The issue has a comment with the PR link
   - The PR contains detailed analysis and recommendations

### Test 2: Dependabot PR

1. Wait for Dependabot to create a security PR (or create one manually)
2. The workflow should trigger automatically when the PR is opened
3. Check that:
   - A comment is added to the PR
   - The comment includes usage analysis
   - The comment provides a merge recommendation

### Test 3: Manual Trigger (for Development)

You can manually test the workflow logic without waiting for real events:

1. Create a test branch with a security fix:
   ```bash
   git checkout -b test/security-workflow
   # Make a small change to package.json or a .csproj file
   git commit -m "test: trigger security workflow"
   git push origin test/security-workflow
   ```

2. Create a PR from this branch
3. Add a comment mentioning "security" or "CVE"
4. Observe the workflow behavior

## Validation

Use the provided validation script to check the workflow structure:

```bash
node scripts/validate-agentic-workflow.js .github/workflows/security-advisory-responder.md
```

Expected output:
```
✅ Workflow is valid!
```

## Usage Examples

### Example 1: Responding to a npm Security Alert

When Dependabot creates a PR for an npm package security update:

1. The workflow triggers on `pull_request.opened`
2. Agent checks if PR is from Dependabot and contains security keywords
3. Agent searches for `import` or `require` statements of the package
4. Agent posts a comment with:
   - Usage analysis (files where the package is imported)
   - Assessment of breaking changes
   - Recommendation (safe to merge, needs review, etc.)

### Example 2: Responding to a Security Issue

When someone reports a security vulnerability via an issue:

1. User creates issue describing the vulnerability
2. User (or maintainer) adds "security" label
3. The workflow triggers on `issues.labeled`
4. Agent parses the issue body for vulnerability details
5. Agent creates a new branch and updates the dependency
6. Agent creates a PR with comprehensive analysis
7. Agent comments on the original issue with the PR link

### Example 3: NuGet Package Update

For .NET NuGet packages in `src/Crawler/*.csproj`:

1. Dependabot creates PR to update a NuGet package
2. Agent searches for `using` statements in C# files
3. Agent identifies usage patterns
4. Agent runs `dotnet list package --vulnerable` to verify fix
5. Agent posts detailed analysis including .NET-specific recommendations

## Troubleshooting

### Workflow Not Triggering

**Problem:** Workflow doesn't run when expected

**Solutions:**
- Check that the lock file exists: `.github/workflows/security-advisory-responder.lock.yml`
- Verify the workflow is enabled in repository Settings > Actions
- Check workflow run logs in the Actions tab
- Ensure `AW_WORKFLOWS_PAT` secret is set correctly

### Compilation Errors

**Problem:** `gh aw compile` fails

**Solutions:**
- Ensure `gh-aw` extension is installed: `gh extension list`
- Check YAML syntax in the frontmatter
- Run validation script: `node scripts/validate-agentic-workflow.js ...`
- Check for proper `---` dividers around frontmatter

### Agent Not Finding Package Usage

**Problem:** Agent reports "not used" when package is actually imported

**Solutions:**
- The agent searches for common patterns but may miss unconventional imports
- Check if the package is dynamically imported
- Verify the search patterns in the workflow instructions
- Add a manual comment explaining actual usage

### Permission Errors

**Problem:** Agent can't create PRs or add comments

**Solutions:**
- Verify `AW_WORKFLOWS_PAT` has correct permissions
- Check that workflow permissions are set correctly in the frontmatter
- Ensure the PAT hasn't expired

## Monitoring

### Check Workflow Runs

View workflow runs in your repository:
1. Go to Actions tab
2. Filter by "Security Advisory Responder"
3. Click on a run to see logs and outputs

### Review Agent Performance

Monitor the agent's effectiveness:
- Are recommendations accurate?
- Is usage analysis correct?
- Are PRs actionable?
- Do breaking changes get flagged appropriately?

### Metrics to Track

- Time from alert to PR creation
- Percentage of "safe to merge" recommendations
- Accuracy of usage analysis
- Number of manual interventions needed

## Maintenance

### Updating the Workflow

1. Edit `.github/workflows/security-advisory-responder.md`
2. Test with validation script
3. Compile: `gh aw compile`
4. Commit both `.md` and `.lock.yml` files
5. Push and verify in a test scenario

### Adjusting Agent Instructions

To modify the agent's behavior, edit the instructions section in the markdown file:
- Add more search patterns for finding package usage
- Adjust the recommendation criteria
- Add ecosystem-specific checks
- Modify the PR/comment template

### Adding New Ecosystems

To support additional package ecosystems (e.g., Python pip, Ruby gems):

1. Add tools to frontmatter: `bash: ["pip", "python"]`
2. Add network access: `network: ["pypi.org"]`
3. Update instructions with ecosystem-specific patterns
4. Add search commands for imports (e.g., `grep -r "import PACKAGE"`)

## Best Practices

1. **Review Agent Recommendations**: Always review the agent's analysis before merging
2. **Test Critical Updates**: For critical vulnerabilities, test in a staging environment
3. **Monitor False Positives**: If the agent consistently misses usage, update search patterns
4. **Keep Instructions Updated**: As your codebase evolves, update the agent instructions
5. **Document Custom Patterns**: If you use non-standard import patterns, document them in the workflow

## Reference

- Workflow definition: `.github/workflows/security-advisory-responder.md`
- Documentation: `.github/workflows/SECURITY_ADVISORY_RESPONDER.md`
- Validation script: `scripts/validate-agentic-workflow.js`
- Dependabot config: `.github/dependabot.yml`
- GitHub Agentic Workflows: https://github.github.com/gh-aw/introduction/overview/

## Support

If you encounter issues:
1. Check workflow run logs in GitHub Actions
2. Validate workflow structure with the validation script
3. Review the documentation files
4. Open an issue with the workflow run URL and error details
