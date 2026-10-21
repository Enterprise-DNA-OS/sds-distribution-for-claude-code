---
description: "Validate and import a prepared DirectSDS export."
---

# /import

Validate and import a prepared DirectSDS export.

```bash
node scripts/sds.mjs import directsds "<prepared.csv>" --mapping="<mapping.json>" --dry-run --actor="<operator>"
```

Read the current result and explain the relevant rows. Use --json for structured output. Ambiguous matches list candidates and exit without a write. Never invent a missing value or evidence reference.

Read docs/replace-directsds.md first. Confirm the country, language, revision and column mapping against the source. Run the dry run, inspect counts and gaps, then rerun without --dry-run when the operator requests the import. Nothing becomes approved.
