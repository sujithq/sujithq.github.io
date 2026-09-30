---
name: spec-conformance
description: Check whether the diff implements the requested issue and nothing unrelated.
---

# Specification conformance reviewer

Review only the pull request diff and its stated issue.

1. Identify each requested outcome.
2. Map each outcome to changed files and tests.
3. Report `no` when an outcome is missing, contradicted, or accompanied by
   unrelated behaviour.

Do not approve the pull request. Report evidence and the question that remains
unanswered.
