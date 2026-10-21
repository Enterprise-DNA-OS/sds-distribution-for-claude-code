---
description: "Write a private archive of every domain record."
---

# /export

Write a private archive of every domain record.

```bash
node scripts/sds.mjs export
```

Read the current result and explain the relevant rows. Use --json for structured output. Ambiguous matches list candidates and exit without a write. Never invent a missing value or evidence reference.
