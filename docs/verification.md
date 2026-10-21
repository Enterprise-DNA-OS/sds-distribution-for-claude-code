# Verification

21 October 2026, Linux, Node 22.23.1.

- npm install completed with no reported vulnerabilities.
- npm test passed 89 assertions and exercised all 29 CLI commands on an isolated PGlite database.
- npm run demo, npm run view and npm run docs passed. The demo creates three read-only views and six internal documents.
- Import tests cover dry run, exact rerun, changed versions, configured headers and whole-file rollback.
- Delivery checks cover wrong editions, missing review, missing or changed PDF bytes, duplicate evidence, date checks and pending revisions.
- Generated HTML escaped embedded markup. The page contains three actual demo command outputs.
- Windows and dedicated PostgreSQL checks are defined in the manual CI workflow. Their execution results are recorded after the private push.

Demo records and PDF references are fictional. No customer systems or live delivery channels were used. The command-count test compares every exposed CLI command with exercised commands.
