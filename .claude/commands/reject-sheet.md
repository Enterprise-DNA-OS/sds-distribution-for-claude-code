---
description: "Read the sheet and the operator reason. Run node scripts/sds.mjs reject-sheet \"<sheet id>\" --reason=\"<reason>\" --actor=\"<operator>\". Only unverified sheets"
---

# /reject-sheet

Read the sheet and the operator reason. Run `node scripts/sds.mjs reject-sheet "<sheet id>" --reason="<reason>" --actor="<operator>"`. Only unverified sheets can be rejected. Retain the record and explain the change. Never discard an actual valid revision to clear a delivery blocker.
