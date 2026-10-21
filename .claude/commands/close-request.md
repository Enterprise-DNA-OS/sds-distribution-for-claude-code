---
description: "Close a request after current delivery evidence exists."
---

# /close-request

Close a request after current delivery evidence exists.

```bash
node scripts/sds.mjs close-request "<request id>" --reference="<resolution reference>" --actor="<operator>"
```

Read the current result and explain the relevant rows. Use --json for structured output. Ambiguous matches list candidates and exit without a write. Never invent a missing value or evidence reference.
