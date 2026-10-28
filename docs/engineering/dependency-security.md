# Development dependency security

## 2026-10-28 audit

`npm audit --json` on the previous lockfile reported **2 critical + 2 high dependency nodes**. These counts include vulnerable parents, not four distinct advisories. GScan 6.6.1 pinned Handlebars 4.7.9; a scoped npm override now pins its compiler to 4.7.10 without downgrading GScan or changing unrelated dependencies.

The [official Handlebars 4.7.10 release](https://github.com/handlebars-lang/handlebars.js/releases/tag/v4.7.10) fixes the three reported advisories: GHSA-xw65-4hp5-5hc7, GHSA-8r5x-fm3f-whwj and GHSA-p8wg-vrv2-v86f. A clean `npm ci --ignore-scripts` resolves the override. Source GScan passes for Ghost 5 and 6 with zero errors and warnings.

The updated audit reports **0 critical + 3 high dependency nodes**: `gscan` -> `@tryghost/zip@3.5.18` -> `extract-zip@2.0.1`. The remaining two advisories are [GHSA-jmr9-qjv8-65gv](https://github.com/advisories/GHSA-jmr9-qjv8-65gv) and [GHSA-7pqw-9j4j-h8q3](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3). No patched extract-zip version is listed. GScan is now classified high instead of critical because its remaining vulnerable path is ZIP extraction; the higher high count does not represent a new advisory.

Do not use `npm audit fix --force`: the suggested GScan downgrade would abandon the current Ghost 6 validation tooling. Keep the compatible compiler override until GScan pins a fixed compiler itself.

## Exposure and remaining work

All npm dependencies are development dependencies and `node_modules` is excluded from the installable theme ZIP. This fixes the project's validation compiler; it does not patch Ghost's independently installed dependencies.

GScan's locked `@tryghost/zip` wrapper rejects symlink entries before calling extract-zip's write path, but extract-zip remains vulnerable and audit does not become clean. Validate archives built from this repository in disposable CI runners. Do not treat this toolchain as a safe service for arbitrary uploaded archives or run it with production credentials. Reassess the override and ZIP dependency when upstream fixes become available. The Draft PR and other release gates remain in place.

## Continuing CI gate

`npm run audit:ci` runs a full `npm audit --json`, including development dependencies. It blocks any critical finding, any high advisory/package-version/dependency-path tuple outside the six reviewed combinations, and unavailable, malformed or inconsistent audit reports. The exact reviewed versions are GScan 6.6.1, @tryghost/zip 3.5.18 and extract-zip 2.0.1, each bound to the two ZIP advisory URLs and its locked installation path. Versions are read from the lockfile used by `npm ci`; the audit report's vulnerable range is not mistaken for an installed version. It does not use `--omit=dev` or suppress a severity level.

The gate prints and saves `knownHigh`, `newHigh`, `critical` and `removedKnownHigh` classifications with the complete npm report in `artifacts/dependency-audit.json`. Removed means a previously known path is no longer reported as high; it does not by itself prove an upstream advisory was patched. Review the report before changing the explicit baseline in `scripts/audit.cjs`.

`npm run test:security` uses fixed audit/lock fixtures to check the known chain, critical regression, new high, partial/full removal, new paths, exact versions, missing versions, severity escalation, advisory replacement with unchanged counts, command/service failure, malformed JSON/schema and unresolved dependency chains. CI runs those tests before the live audit gate and uploads the audit evidence separately. The current baseline remains 0 critical and 3 high dependency nodes, not a clean audit.
