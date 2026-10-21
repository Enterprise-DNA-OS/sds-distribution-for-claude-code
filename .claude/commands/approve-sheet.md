---
description: "Record the operator review and archive the supplied PDF."
---

# /approve-sheet

Record the operator review and archive the supplied PDF.

```bash
node scripts/sds.mjs approve-sheet "<sheet id>" --file="<supplier.pdf>" --owner-url="<owned HTTPS URL>" --reference="<review evidence>" --actor="<operator>"
```

Read the current result and explain the relevant rows. Use --json for structured output. Ambiguous matches list candidates and exit without a write. Never invent a missing value or evidence reference.

The human operator must have reviewed the complete supplier PDF, jurisdiction, language, issue date, ownership and source. Never manufacture a review reference. This records their review; it does not certify chemical compliance.
