---
description: "Record the authorised delivery contact."
---

# /add-customer

Record the authorised delivery contact.

```bash
node scripts/sds.mjs add-customer --name="<customer>" --contact="<contact>" --actor="<operator>"
```

Read the current result and explain the relevant rows. Use --json for structured output. Ambiguous matches list candidates and exit without a write. Never invent a missing value or evidence reference.
