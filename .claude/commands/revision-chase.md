# /revision-chase

Find customers whose old sheet has been replaced.

```bash
node scripts/sds.mjs revision-chase
```

Read the current result and explain the relevant rows. Use --json for structured output. Ambiguous matches list candidates and exit without a write. Never invent a missing value or evidence reference.
