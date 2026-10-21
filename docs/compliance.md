# Evidence checks for supplier safety sheets

Checked 21 October 2026. These checks support document-control work. They do not establish full chemical compliance, classify hazards, certify an SDS or determine whether a legal exemption applies. A qualified operator confirms the document's content and applicable jurisdiction. This build does not take over a regulated authoring or safety-advice role.

| Rule | Implemented check | Basis and limit |
|---|---|---|
| SDS-01 | Each supply obligation needs an approved sheet in the recorded country and language. | Record-control implementation of having the appropriate supplier document. It does not validate SDS content. |
| SDS-02 | Flag ageing supplier sheets 60 days before five years; block new approval and delivery records at five years. | Five-year review/update guidance below. Sixty days is a configurable operational lead time, not a statutory period. A newer issue date is required after review in this model. |
| SDS-03 | Identify first supply and revision obligations lacking recorded delivery evidence. | Supplier provision and updated-document duties below. The desk does not send or infer successful receipt. |
| SDS-04 | Imported and newly registered sheets stay unverified. Approval needs a supplier PDF, owned URL, hash and human review reference. | An internal control to prevent exported links being mistaken for verified owned documents. Not a legal certification. |
| SDS-05 | A pending edition at least as recent as the approved sheet blocks delivery recording until reviewed or rejected with a reason. | Internal control against dispatching an old sheet while a potential change is under review. |
| OPS-01 | List requests past the operator's recorded deadline. Closing requires current delivery evidence. | Business policy; there is no invented universal statutory response deadline. |

## Primary sources

- [NZ EPA: Safety data sheets](https://www.epa.govt.nz/hazardous-substances/safety-data-sheets-labelling-and-packaging/safety-data-sheets-sds/) describes SDS updates at least every five years and New Zealand-specific information. The operator checks the current notice and applicability.
- [WorkSafe NZ: Safety data sheets in the workplace](https://www.worksafe.govt.nz/dmsdocument/2632-safety-data-sheets-in-the-workplace-quick-guide/) covers obtaining supplier sheets on first supply, following changes and relevant five-year supply circumstances. Those triggers do not mean every customer has an identical calendar deadline.
- [SafeWork NSW: Manufacturers and importers](https://www.safework.nsw.gov.au/hazards-a-z/hazardous-chemical/manufacturers-and-importers) covers preparing a sheet before workplace supply, review at least every five years or when things change, and providing copies when required.
- [Safe Work Australia: Safety data sheets](https://www.safeworkaustralia.gov.au/safety-topic/hazards/chemicals/safety-data-sheets) describes keeping SDS copies. Confirm state or territory requirements; NSW guidance is not a substitute for another jurisdiction's law.

The operator remains responsible for hazardous-product scope, exemptions, emergency availability, labelling, worker access, language suitability, scientific accuracy and actual delivery. The internal packs produced here cannot replace a supplier-issued SDS. Human actor labels and references can be inaccurate; use authenticated permissions and independent evidence controls for a shared installation.
