# /record-delivery

Record a delivery already completed through an authorised channel.

```bash
node scripts/sds.mjs record-delivery "<subscription id>" "<sheet id>" --date=YYYY-MM-DD --evidence="<receipt reference>" --actor="<operator>"
```

Read the current result and explain the relevant rows. Use --json for structured output. Ambiguous matches list candidates and exit without a write. Never invent a missing value or evidence reference.

Require evidence of an external delivery already completed by an authorised person. This command sends nothing. Never record a draft as a delivery.
