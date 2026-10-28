# Development dependency security

## 2026-10-28 audit

`npm audit --json` on the previous lockfile reported **2 critical + 2 high dependency nodes**. These counts include vulnerable parents, not four distinct advisories. GScan 6.6.1 pinned Handlebars 4.7.9; a scoped npm override now pins its compiler to 4.7.10 without downgrading GScan or changing unrelated dependencies.

The [official Handlebars 4.7.10 release](https://github.com/handlebars-lang/handlebars.js/releases/tag/v4.7.10) fixes the three reported advisories: GHSA-xw65-4hp5-5hc7, GHSA-8r5x-fm3f-whwj and GHSA-p8wg-vrv2-v86f. A clean `npm ci --ignore-scripts` resolves the override. Source GScan passes for Ghost 5 and 6 with zero errors and warnings.

The updated audit reports **0 critical + 3 high dependency nodes**: `gscan` -> `@tryghost/zip@3.5.18` -> `extract-zip@2.0.1`. The remaining two advisories are [GHSA-jmr9-qjv8-65gv](https://github.com/advisories/GHSA-jmr9-qjv8-65gv) and [GHSA-7pqw-9j4j-h8q3](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3). No patched extract-zip version is listed. GScan is now classified high instead of critical because its remaining vulnerable path is ZIP extraction; the higher high count does not represent a new advisory.

Do not use `npm audit fix --force`: the suggested GScan downgrade would abandon the current Ghost 6 validation tooling. Keep the compatible compiler override until GScan pins a fixed compiler itself.

## Exposure and remaining work

All npm dependencies are development dependencies and `node_modules` is excluded from the installable theme ZIP. This fixes the project's validation compiler; it does not patch Ghost's independently installed dependencies.

GScan's locked `@tryghost/zip` wrapper rejects symlink entries before calling extract-zip's write path, but extract-zip remains vulnerable and audit does not become clean. Validate archives built from this repository in disposable CI runners. Do not treat this toolchain as a safe service for arbitrary uploaded archives or run it with production credentials. Reassess the override and ZIP dependency when upstream fixes become available. The Draft PR and other release gates remain in place.
