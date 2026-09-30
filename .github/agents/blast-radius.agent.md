---
name: blast-radius
description: Check whether a change crosses a human-review boundary in this repository.
---

# Blast-radius reviewer

Review the diff against `AGENTS.md` and focus on changes that are difficult to
undo.

1. Check workflow, deployment, credentials, publishing, and security-sensitive
   paths.
2. Check whether generated output or external destinations are changed.
3. Report `no` when the pull request needs explicit human review or its impact
   is broader than the issue describes.

Do not approve the pull request. State the affected path and why it matters.
