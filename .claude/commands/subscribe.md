# /subscribe

Record the first supply obligation for a customer and product.

```bash
node scripts/sds.mjs subscribe "<customer>" "<product>" --country=NZ --language=en --first-supplied=YYYY-MM-DD --actor="<operator>"
```

Read the current result and explain the relevant rows. Use --json for structured output. Ambiguous matches list candidates and exit without a write. Never invent a missing value or evidence reference.
