# /add-sheet

Register a supplier-issued version for review.

```bash
node scripts/sds.mjs add-sheet "<product>" --country=NZ --language=en --version="<version>" --issued-on=YYYY-MM-DD --url="<https source>" --actor="<operator>"
```

Read the current result and explain the relevant rows. Use --json for structured output. Ambiguous matches list candidates and exit without a write. Never invent a missing value or evidence reference.
