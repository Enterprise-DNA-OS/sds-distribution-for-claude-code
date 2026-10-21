# SDS Distribution for Claude Code

Your safety sheet distribution desk: product codes, supplier-issued documents, customer obligations and delivery evidence in a database you own. Built by Enterprise DNA. Runs with Claude Code, Codex, OpenCode or Cursor.

| Do it yourself | We customise it | We run it for you |
|---|---|---|
| Free, MIT. Follow the quick start. | Your product codes, review rules, documents and DirectSDS records. [Book a call](https://enterprisedna.co/omni/book/?offer=replace-software&utm_source=github&utm_medium=readme&utm_campaign=directsds). | Installed and operated through Omni by Enterprise DNA. One setup fee, then a retainer. [See your version](https://enterprisedna.co/omni/instead-of/directsds). |

## The bill and the desk

DirectSDS lists its Pro tier for 4,000 safety sheets at US$923 per month. Twelve monthly payments total US$11,076. This is a published tier calculation, not a verified customer's annual invoice or an annual-plan quote. [Vendor pricing](https://sdsmanager.com/us/pricing/?solution=distribution).

This desk suits distributors who already hold supplier-issued safety data sheets (SDS). It manages document versions and distribution evidence. It does not classify chemicals, author or translate SDSs, certify compliance or send documents. Keep the supplier's actual PDF and the approved delivery channel. DirectSDS also provides automated delivery and hosted document access; those connections belong in a scoped installation.

## Quick start

```bash
git clone https://github.com/Enterprise-DNA-OS/sds-distribution-for-claude-code.git
cd sds-distribution-for-claude-code
npm install
npm test
npm run demo
npm run view
npm run docs
```

Node 20 or later. PGlite runs locally; DATABASE_URL selects a dedicated PostgreSQL database. DATA_DIR selects local storage. Use a fresh database and npm run migrate for operational records. Never seed the demo into a business database. Demo businesses, documents, delivery receipts and reviews are fictional. Demo PDFs are not supplied and demo evidence cannot be used to record a real delivery.

## Five weekly rituals

Review first supplies, chase revised sheets, follow up ageing supplier documents, clear customer requests and reconcile delivery evidence. /weekly-review drafts a Monday note from attention, review-due and compliance. /draft-pack prepares an internal customer pack. Neither sends anything.

## Commands

29 CLI commands and 32 slash recipes. [Full syntax](docs/cli.md).

- /products: List product codes and suppliers.
- /sheets: Read document editions and review status.
- /customers: Read the customer contact register.
- /subscriptions: Read each customer, product, country and language obligation.
- /deliveries: Read evidence recorded for completed external deliveries.
- /requests: Read open customer requests and their agreed deadlines.
- /activity: Read operator-labelled changes.
- /attention: Find missing sheets and outstanding delivery evidence.
- /revision-chase: Find customers whose old sheet has been replaced.
- /first-supply: Find first supplies and country editions needing attention.
- /review-due: Chase unverified and ageing supplier documents.
- /compliance: Check evidence against the documented rules.
- /insights: Answer ten questions across sheets, customers and evidence.
- /product: Read one product and its customer obligations.
- /add-product: Register a supplier product.
- /add-customer: Record the authorised delivery contact.
- /add-sheet: Register a supplier-issued version for review.
- /reject-sheet: Reject an unverified document with the reason retained.
- /approve-sheet: Record the operator review and archive the supplied PDF.
- /subscribe: Record the first supply obligation for a customer and product.
- /record-delivery: Record a delivery already completed through an authorised channel.
- /add-request: Record a customer request and its agreed deadline.
- /close-request: Close a request after current delivery evidence exists.
- /log: Log an internal product follow-up.
- /import: Validate and import a prepared DirectSDS export.
- /export: Write a private archive of every domain record.
- /draft-pack: Draft an internal customer distribution pack.
- /weekly-review: Draft the Monday review from attention, review-due and compliance.
- /documents: Run `npm run docs`.
- /view: Run `npm run view`.
- /new-view: Read views.
- /customise: Read CLAUDE.

## Ten questions the desk answers today

/insights answers these from the actual records. They are shipped cross-record reports, not a claim that DirectSDS cannot be configured to produce similar results.

1. Which customers have both overdue requests and outstanding revisions?
2. Which suppliers have unverified sheets with customers waiting?
3. Which customers need a different country edition of an existing product?
4. Which approved revisions have no recorded deliveries at all?
5. Which suppliers have ageing sheets still attached to customer obligations?
6. How many outstanding obligations does each customer have?
7. Which product and country combinations have multiple approved versions?
8. Which customer requests lack a usable current sheet?
9. Which customers have delivery evidence for an older revision only?
10. Which registered products have no customer supply records?

## Your first hour: ten things to ask for

1. Put our name and logo on the internal packs.
2. Show first supplies without delivery evidence.
3. Show customers still linked to an old revision.
4. Show supplier documents needing review.
5. Separate Australian and New Zealand editions.
6. Add our warehouse contact to a customer.
7. Test our prepared DirectSDS export without saving it.
8. Compare the imported counts with the source.
9. Add our product division through /customise.
10. Draft the weekly follow-up pack.

## Review, then record

Every imported sheet starts unverified. Approval requires the operator's review reference, an HTTPS address under their control and the actual supplier PDF. The PDF is archived privately and hashed. Approval records human verification; it does not inspect scientific contents or prove that a URL is reachable. A pending version at least as recent as the current sheet blocks delivery recording until reviewed or rejected with a reason. /reject-sheet retains the rejected record and the operator reason. New approved versions must have later issue dates than the current edition. A same-day corrected edition needs an explicit model change through /customise, not a fabricated issue date.

Country and language must match the customer's recorded obligation. Delivery recording requires the current approved edition, a matching archived PDF, a valid date and an external receipt reference. A draft is never proof of delivery. An ageing sheet is flagged from 60 days before its fifth anniversary; a sheet at least five years old cannot be approved or used for a new delivery record. Obtain an updated supplier document. These checks support the operator's duties, not a chemical-safety certification. [Rules and sources](docs/compliance.md).

## Views and paperwork

npm run view creates three branded, read-only snapshots: the distribution week, supplier review queue and evidence register. npm run docs creates customer distribution packs and supplier follow-up sheets. These internal documents are not safety data sheets. brand.json controls the name, logo and colours. [Why no front end](docs/why-no-front-end.md).

## Move your records

[Switching guide](docs/replace-directsds.md). DirectSDS documents an XLS export of product codes and permanent document links. Save a prepared eight-column extract as CSV, supply the mapping and import it in one command. Country, language, revision and supplier metadata must be confirmed from your source. Exported links still depend on the vendor: archive supplier PDFs and establish owned links before approving them.

The import validates the whole file, rolls back on any bad row, skips identical repeats and rejects conflicting versions. Customer lists, subscriptions and historic delivery receipts are separate records and are not in this library import. Reconcile them before retiring an existing service.

## Privacy and verification

This version assumes a trusted local operator or dedicated database owner. Actor labels are not authenticated identities. The history is not tamper-proof. Shared deployment needs access controls, backups, a retention policy and tested delivery connections. Keep contacts, supplier documents, exports and internal packs private. The importer treats document links as text and never fetches them.

An export includes all eight domain registers as JSON. It does not contain the PDF bytes. Back up both the database and the sibling sheets archive beneath .data, plus any owned document hosting. TEST_DATABASE_URL must be an empty disposable database. npm test checks every command, import rollback, edition matching, evidence guards, seed idempotence, HTML escaping and private drafts. Windows and PostgreSQL support is represented in the manual CI workflow; the verification note records actual runs.

[Book Sam's 30-minute call](https://enterprisedna.co/omni/book/?offer=replace-software&utm_source=github&utm_medium=readme&utm_campaign=directsds). Omni by Enterprise DNA builds your fields, connections, screens and operational rules, then runs your version. One setup fee, then a retainer.

MIT. Copyright 2026 Enterprise DNA. DirectSDS and SDS Manager are their owners' trademarks. This independent project is not affiliated with SDS Manager.
