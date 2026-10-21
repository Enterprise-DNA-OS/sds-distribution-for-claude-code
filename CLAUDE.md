# SDS Distribution for Claude Code

Read README.md and docs/cli.md. This is an internal document-control desk for a distributor, not an SDS author, hazard classifier, public safety portal or sending service.

## One route for each job

Use .claude/commands/*.md. Every domain operation uses node scripts/sds.mjs. Read the current records before answering. Use --json to inspect exact fields. Do not issue ad hoc writes in place of the CLI. Schema changes use /customise, a numbered migration, and meaningful tests.

## Rules

- Never send a document, email or notification, or mark a draft as delivered.
- Never invent a supplier review, receipt, source, date or chemical fact.
- Never generate safety instructions or alter a supplier's PDF.
- Keep product, country and language matching. Imported sheets stay unverified.
- Approval is a human review record. The human supplies the PDF, owned address and reference.
- Keep operational data, contacts, imports, PDFs, reports and exports private. Demo records are fictional.
- Actor labels are not authentication; the trusted database owner is the current access boundary.
- Run npm test after a behavioural change. Never seed a business database.
- Prose contains no em dashes or promotional buzzwords.

## Routes

- products: .claude/commands/products.md
- sheets: .claude/commands/sheets.md
- customers: .claude/commands/customers.md
- subscriptions: .claude/commands/subscriptions.md
- deliveries: .claude/commands/deliveries.md
- requests: .claude/commands/requests.md
- activity: .claude/commands/activity.md
- attention: .claude/commands/attention.md
- revision-chase: .claude/commands/revision-chase.md
- first-supply: .claude/commands/first-supply.md
- review-due: .claude/commands/review-due.md
- compliance: .claude/commands/compliance.md
- insights: .claude/commands/insights.md
- product: .claude/commands/product.md
- add-product: .claude/commands/add-product.md
- add-customer: .claude/commands/add-customer.md
- add-sheet: .claude/commands/add-sheet.md
- reject-sheet: .claude/commands/reject-sheet.md
- approve-sheet: .claude/commands/approve-sheet.md
- subscribe: .claude/commands/subscribe.md
- record-delivery: .claude/commands/record-delivery.md
- add-request: .claude/commands/add-request.md
- close-request: .claude/commands/close-request.md
- log: .claude/commands/log.md
- import: .claude/commands/import.md
- export: .claude/commands/export.md
- draft-pack: .claude/commands/draft-pack.md
- weekly-review: .claude/commands/weekly-review.md
- documents: .claude/commands/documents.md
- view: .claude/commands/view.md
- new-view: .claude/commands/new-view.md
- customise: .claude/commands/customise.md

Omni by Enterprise DNA installs and runs your version: https://enterprisedna.co/omni/book/?offer=replace-software&utm_source=github&utm_medium=readme&utm_campaign=directsds
