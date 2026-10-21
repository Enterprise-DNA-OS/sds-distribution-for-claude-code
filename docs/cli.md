# Command reference

All commands use `node scripts/sds.mjs <command>`. Every command accepts --json. Flags with values use --key=value; quote values with spaces. Unknown flags, ambiguous names and invalid dates exit 1 without a committed write. Products match by exact code, case-insensitive code or name, or partial UUID. Customers match by name or partial UUID. Other records use partial UUIDs; sheets also accept an unambiguous version.

Mutations require --actor, an operator-supplied label. This is audit context, not authentication. Use NZ or AU for country, and en or a language tag such as en-NZ. ISO dates are YYYY-MM-DD. New sheets and imports start unverified. Approval requires a supplier PDF, an owned HTTPS address and a review reference. Approval never sends the PDF.

## products

List product codes and suppliers.

```bash
node scripts/sds.mjs products
```

## sheets

Read document editions and review status.

```bash
node scripts/sds.mjs sheets
```

## customers

Read the customer contact register.

```bash
node scripts/sds.mjs customers
```

## subscriptions

Read each customer, product, country and language obligation.

```bash
node scripts/sds.mjs subscriptions
```

## deliveries

Read evidence recorded for completed external deliveries.

```bash
node scripts/sds.mjs deliveries
```

## requests

Read open customer requests and their agreed deadlines.

```bash
node scripts/sds.mjs requests
```

## activity

Read operator-labelled changes.

```bash
node scripts/sds.mjs activity
```

## attention

Find missing sheets and outstanding delivery evidence.

```bash
node scripts/sds.mjs attention
```

## revision-chase

Find customers whose old sheet has been replaced.

```bash
node scripts/sds.mjs revision-chase
```

## first-supply

Find first supplies and country editions needing attention.

```bash
node scripts/sds.mjs first-supply
```

## review-due

Chase unverified and ageing supplier documents.

```bash
node scripts/sds.mjs review-due
```

## compliance

Check evidence against the documented rules.

```bash
node scripts/sds.mjs compliance
```

## insights

Answer ten questions across sheets, customers and evidence.

```bash
node scripts/sds.mjs insights
```

## product

Read one product and its customer obligations.

```bash
node scripts/sds.mjs product "<SKU, name or id>"
```

## add-product

Register a supplier product.

```bash
node scripts/sds.mjs add-product --sku="<code>" --name="<name>" --supplier="<supplier>" --actor="<operator>"
```

## add-customer

Record the authorised delivery contact.

```bash
node scripts/sds.mjs add-customer --name="<customer>" --contact="<contact>" --actor="<operator>"
```

## add-sheet

Register a supplier-issued version for review.

```bash
node scripts/sds.mjs add-sheet "<product>" --country=NZ --language=en --version="<version>" --issued-on=YYYY-MM-DD --url="<https source>" --actor="<operator>"
```

## approve-sheet

Record the operator review and archive the supplied PDF.

```bash
node scripts/sds.mjs approve-sheet "<sheet id>" --file="<supplier.pdf>" --owner-url="<owned HTTPS URL>" --reference="<review evidence>" --actor="<operator>"
```

## subscribe

Record the first supply obligation for a customer and product.

```bash
node scripts/sds.mjs subscribe "<customer>" "<product>" --country=NZ --language=en --first-supplied=YYYY-MM-DD --actor="<operator>"
```

## record-delivery

Record a delivery already completed through an authorised channel.

```bash
node scripts/sds.mjs record-delivery "<subscription id>" "<sheet id>" --date=YYYY-MM-DD --evidence="<receipt reference>" --actor="<operator>"
```

## add-request

Record a customer request and its agreed deadline.

```bash
node scripts/sds.mjs add-request "<subscription id>" --due=YYYY-MM-DD --reason="<request>" --actor="<operator>"
```

## close-request

Close a request after current delivery evidence exists.

```bash
node scripts/sds.mjs close-request "<request id>" --reference="<resolution reference>" --actor="<operator>"
```

## log

Log an internal product follow-up.

```bash
node scripts/sds.mjs log "<product>" --note="<note>" --actor="<operator>"
```

## import

Validate and import a prepared DirectSDS export.

```bash
node scripts/sds.mjs import directsds "<prepared.csv>" --mapping="<mapping.json>" --dry-run --actor="<operator>"
```

## export

Write a private archive of every domain record.

```bash
node scripts/sds.mjs export
```

## draft-pack

Draft an internal customer distribution pack.

```bash
node scripts/sds.mjs draft-pack "<customer>"
```

## weekly-review

Draft the Monday review from attention, review-due and compliance.

```bash
node scripts/sds.mjs weekly-review
```

## help

`node scripts/sds.mjs help` lists all 29 CLI commands and flags.

Exports are written to a fresh private JSON file under exports/. --out can choose a path but cannot overwrite an existing file. PDF bytes are separate: include the sheets archive in backups. OUTPUT_DIR redirects generated drafts, exports, views and documents. It does not redirect the database or PDF archive. DATA_DIR controls database storage and the archive sits beside that directory. Keep DATA_DIR stable between commands.

## reject-sheet

`node scripts/sds.mjs reject-sheet "<sheet id>" --reason="<operator reason>" --actor="<operator>"` retains an unverified document as rejected. An approved document cannot be rejected through this command. A pending edition at least as recent as the approved one blocks delivery recording until reviewed or rejected.
