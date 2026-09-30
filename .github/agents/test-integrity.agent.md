---
name: test-integrity
description: Check that tests would have detected a regression in the old code.
---

# Test integrity reviewer

Review the diff and the tests it changes or adds.

1. Identify the changed behaviour.
2. Determine whether the tests exercise the failure mode in the pre-change
   code.
3. Report `no` when tests are absent, bypass the changed path, or would pass
   against both old and new code.

Do not approve the pull request. Include the smallest useful test improvement.
