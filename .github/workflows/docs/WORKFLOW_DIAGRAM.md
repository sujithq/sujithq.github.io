# Security Advisory Responder - Workflow Diagram

```mermaid
graph TD
    A[Trigger Event] --> B{Event Type?}
    
    B -->|Pull Request Opened| C[Check if Dependabot PR]
    B -->|Issue Labeled| D[Check if 'security' label]
    
    C -->|Yes - Security Update| E[Extract Advisory Details]
    C -->|No| Z[Exit Gracefully]
    
    D -->|Yes| E
    D -->|No| Z
    
    E --> F[Identify Package & Versions]
    F --> G[Search Codebase for Usage]
    
    G --> H{Find Imports?}
    H -->|Yes| I[List Files & Lines]
    H -->|No| J[Mark as 'Not Directly Used']
    
    I --> K[Analyze Dependency Type]
    J --> K
    
    K --> L{Direct or Transitive?}
    L -->|Direct| M[Check package.json/.csproj]
    L -->|Transitive| N[Check lockfiles only]
    
    M --> O[Assess Version Change]
    N --> O
    
    O --> P{Major Version Bump?}
    P -->|Yes| Q[Flag for Manual Review]
    P -->|No - Patch/Minor| R[Mark as Safe]
    
    Q --> S{Triggered by Issue?}
    R --> S
    
    S -->|Yes| T[Create New Branch]
    S -->|No - Dependabot PR| U[Skip to Analysis]
    
    T --> V[Update Dependency]
    V --> W[Run Audit Tools]
    W --> X[Create Pull Request]
    X --> Y[Comment on Issue]
    
    U --> AA[Run Audit Tools]
    AA --> AB[Post Comment on PR]
    
    Y --> AC[Done]
    AB --> AC
    Z --> AC
    
    style E fill:#e1f5fe
    style G fill:#fff9c4
    style I fill:#c8e6c9
    style Q fill:#ffccbc
    style R fill:#c8e6c9
    style X fill:#b2dfdb
    style AB fill:#b2dfdb
    style AC fill:#e8f5e9
    style Z fill:#f5f5f5
```

## Workflow Steps Explained

### 1. Trigger Detection (A → B → C/D)
- Workflow activates on two events: PR opened or Issue labeled
- Checks if it's a Dependabot security PR or security-labeled issue
- Exits gracefully if neither condition is met

### 2. Advisory Analysis (E → F)
- Extracts vulnerability details from PR/issue body
- Identifies package name, current version, patched version
- Captures CVE/GHSA IDs and severity level

### 3. Usage Detection (G → H → I/J)
- Searches codebase for actual package usage
- For npm: looks for `import` or `require` statements
- For NuGet: looks for `using` statements
- Lists specific files and line numbers where found

### 4. Dependency Classification (K → L → M/N)
- Determines if dependency is direct (in package.json/.csproj)
- Or transitive (only in lockfiles)
- Checks parent dependencies that bring in transitive packages

### 5. Impact Assessment (O → P → Q/R)
- Evaluates version change (major, minor, patch)
- Major version bump → flags for manual review (breaking changes likely)
- Minor/patch → marks as safe to merge

### 6. Action Phase (S → T/U)
**For Issue-triggered workflows (T → V → W → X → Y):**
- Creates new branch with security fix
- Updates dependency to patched version
- Runs audit tools to verify fix
- Creates PR with comprehensive analysis
- Comments on original issue with PR link

**For Dependabot PR workflows (U → AA → AB):**
- Analyzes existing Dependabot changes
- Runs audit tools to verify
- Posts detailed comment with recommendations
- Does NOT create new PR

### 7. Completion (AC)
- Workflow completes successfully
- Maintainers have actionable PR or enhanced Dependabot PR
- Clear merge recommendations provided

## Key Decision Points

### 🔍 Is it a security event?
- **Yes**: Continue with analysis
- **No**: Exit gracefully (no wasted resources)

### 📦 Is the package actually used?
- **Used**: Higher priority, flag for testing
- **Not used**: Lower risk, but still fix it

### 📊 What's the version change?
- **Major**: Breaking changes likely → manual review
- **Minor/Patch**: Usually safe → recommend merge

### 🎯 How was it triggered?
- **Issue**: Create new PR with fix
- **Dependabot PR**: Enhance existing PR with analysis

## Output Types

### For New PRs (Issue-triggered)
```markdown
Title: security: fix [package] vulnerability (GHSA-xxx)
Body:
  - Vulnerability details
  - Impact analysis
  - Usage report
  - Changes made
  - Breaking change warnings
  - Verification results
  - Merge recommendation
```

### For Dependabot PR Comments
```markdown
Comment:
  - Usage analysis for this repo
  - Files where package is imported
  - Breaking change assessment
  - Clear recommendation (✅ Safe / 🔍 Review / 🧪 Test)
```

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to PR creation | < 5 minutes |
| Usage detection accuracy | > 95% |
| Recommendation accuracy | > 90% |
| False positive rate | < 5% |
| Manual intervention needed | < 10% |

## Error Handling

At each stage, if an error occurs:
1. Log the error details
2. Attempt graceful degradation
3. Still provide partial analysis if possible
4. Flag for manual intervention if needed
5. Never block security fixes due to analysis errors

---

**Last Updated:** 2026-02-15
