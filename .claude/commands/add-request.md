---
description: "Record a customer request and its agreed deadline."
---

# /add-request

Record a customer request and its agreed deadline.

```bash
node scripts/sds.mjs add-request "<subscription id>" --due=YYYY-MM-DD --reason="<request>" --actor="<operator>"
```

Read the current result and explain the relevant rows. Use --json for structured output. Ambiguous matches list candidates and exit without a write. Never invent a missing value or evidence reference.
