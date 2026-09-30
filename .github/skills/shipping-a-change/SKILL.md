---
name: shipping-a-change
description: What to update when changing this repository and what done requires. Use before opening a pull request.
---

# Shipping a change

## When you change this, also change that

| Change | Also update |
| --- | --- |
| Hugo templates, assets, or styles | Relevant Playwright coverage and run `npm run build:prod` |
| Crawler code or project files | Crawler tests and dependency lock files when applicable |
| A blog post | `index.md` and `cover.jpg` in the same post directory |
| Weekly editorial automation | Workflow documentation and packet validation |
| Agentic workflow source | Its compiled `.lock.yml` and `npm run validate-workflows` |
| Agent guidance | `AGENTS.md`, pointers, and scoped instructions |

## Done

Use the machine-checkable completion criteria in `AGENTS.md`, especially
`git diff --check` and the checks relevant to the changed paths.
