# Move from DirectSDS

## Export the library

[DirectSDS describes an XLS export](https://sdsmanager.com/nz/sds-distribution/) containing ERP identifiers or product codes and permanent safety sheet links. The [SDS Manager help article](https://sdsmanager.com/faq/content/277/en/how-can-i-export-our-sds-library-to-a-excel%26solxlsx%26solcsv-file%26quest) also describes configurable library exports and says PRO or higher is required for that export route. Confirm the export available in your subscription.

Export and keep an untouched original privately. Save a prepared extract as UTF-8 CSV with one row per product, country, language and version. A vendor export is configurable: the public documentation does not establish universal column names. The fixture here is synthetic, not a downloaded customer or vendor file.

## Map eight columns

| Field | Default CSV header | Meaning |
|---|---|---|
| sku | SKU | One product code. Split multiple codes into separate rows. |
| name | Product name | Your product name |
| supplier | Supplier | Issuing supplier |
| country | Country | Verified NZ or AU edition |
| language | Language | Verified language, such as en |
| version | Version | Supplier version identifier |
| issued_on | Revision date | Supplier issue/revision date in YYYY-MM-DD |
| source_url | SDS URL | Exported HTTPS document link |

Confirm missing metadata from the supplier PDF; never guess it from a filename. Create mapping.json with exactly these eight field keys mapped to your eight actual headers. Remove other columns from the prepared extract while preserving the untouched export. Blank required fields, unknown columns, duplicate keys, inconsistent product metadata and changed existing versions fail the whole import.

```bash
node scripts/sds.mjs import directsds imports/library.csv --mapping=imports/mapping.json --dry-run --actor="Operator name"
node scripts/sds.mjs import directsds imports/library.csv --mapping=imports/mapping.json --actor="Operator name"
```

Without --mapping, use the default headers above. Identical reruns skip existing rows. A dry run writes nothing. The importer reads CSV only, not native XLS or XLSX.

## Own the documents

Every imported document is unverified. The link exported from DirectSDS is vendor-hosted and can change to a later revision. It is a source pointer, not an owned immutable copy. Download the supplier-issued PDFs through your authorised export route, establish your own controlled HTTPS addresses, and verify the country, language, issue date and contents. /approve-sheet archives each actual PDF and records its hash and human review evidence. It does not retrieve remote URLs or author SDSs.

## Reconcile the rest

Customer contacts, subscriptions, ERP events, sending logs, access controls, QR codes and attachments are not imported by the library CSV. Register current customer obligations with /add-customer and /subscribe. Preserve historical evidence separately and agree a mapping before migrating it. The free desk records new external delivery evidence; it does not infer that an imported row was ever sent.

Compare product codes and document counts, inspect duplicate product mappings, then test first supply, a revision and a requested resend on isolated data. Check source PDFs and backup restoration. Keep the old service until document access and your authorised delivery channel have been verified. A working import alone is not a complete switch.
