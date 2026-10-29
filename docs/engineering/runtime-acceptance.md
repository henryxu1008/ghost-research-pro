# Runtime acceptance on a disposable Ghost instance

## Environment failure diagnosis

On the original execution host, even this minimal command fails without Ghost or any database:

```sh
node -e 'require("node:os").networkInterfaces()'
```

Node 24.22.1 reports `ERR_SYSTEM_ERROR`, syscall `uv_interface_addresses`, errno 1. The Ghost 6.73.0 stack is:

`2-create-fixtures.js` → user model → `@tryghost/request` → `new CacheableLookup()` → `getIfaceInfo()` → `os.networkInterfaces()`.

This locates the failure in host network-interface enumeration reached during module initialization, not a theme SQL migration. The exact rejected kernel call cannot be established here: `strace` itself is unavailable because `ptrace` is denied. No platform permission changes or monkey patches to Node/Ghost/DNS were made.

## Repeatable test environment

Theme CI runs these profiles on separate ephemeral Ubuntu runners:

| Ghost | Node | Database driver | Official Portal fixture |
| --- | --- | --- | --- |
| 5.130.6 | 22.23.4 | sqlite3 | 2.51.5 (Ghost 5's configured 2.51 line) |
| 6.73.0 | 24.22.1 | better-sqlite3 | 2.72.11 (Ghost 6's configured 2.72 line) |

The [official compatibility table](https://docs.ghost.org/faq/node-versions/) lists Node 22 support for late Ghost 5. Ghost 5.130.6's published package declares `^18.12.1 || ^20.11.1 || ^22.13.1`; Node 22.23.4 satisfies that range. Ghost 6.73.0 declares `^22.23.1 || ^24.20.0`; its existing Node 24.22.1 profile is retained. The runner checks the installed version and engines before booting; it does not force Ghost 6's database driver or Portal line onto Ghost 5.

CI unpacks the official npm tarball before installing dependencies, because the package contains local `components/*.tgz` dependencies. `--legacy-peer-deps` handles Ghost's Bookshelf/Knex peer range conflict. This installation method is test-only, not a production deployment procedure.

The test runner:

1. Starts stock Ghost with a new SQLite database, listening only on `127.0.0.1:2368`.
2. Creates a disposable owner via the setup API, then logs into the Admin API.
3. Uploads the actual built ZIP, activates it and reads back the active theme.
4. Creates public, members-only, paid and tier-restricted research fixtures, plus page, author and tag routes.
5. Creates test members and assigns two complimentary tier fixtures in the disposable database.
6. Requests real member sign-in links, captures them in a loopback-only SMTP sink and redeems them through Ghost to obtain real session cookies.
7. Checks response HTML for authorized content and absence of secret markers for unauthorized visitors, including anonymous requests after a privileged session, wrong-tier access and revoked sessions.
8. Runs Chromium layout and keyboard checks at 360, 768 and 1440 px, producing screenshots.
9. Exercises membership/header links with each profile's official Portal bundle: invalid email, free signup/confirmation, account access, signout and desktop signin. Free members get members-only content but no paid/tier body markers. [Account acceptance](account-acceptance.md) checks fixture name/newsletter persistence, cancellation, recovery after an aborted loopback request and signed-out data isolation; no real user's profile is changed.
10. Checks Escape/close-button focus return, Tab/Shift+Tab containment, form switching, repeated triggers and interrupted/reopened forms at 360px and 1440px. Those interrupted flows must not send email.
11. Seeds actual Lexical HTML, code, image (normal/wide/full), gallery, bookmark, callout, button, toggle, file and local embed cards. It checks rendering/bounds at three widths, local image/file delivery, keyboard toggle activation and table/code scrolling, plus protected-card markers in raw authorized/unauthorized HTML. The sandboxed embed uses a constant `srcdoc` document with its rendered heading checked; it makes no external request. Image fixtures are local SVGs, not a test of JPEG resizing or every media format.
12. Runs axe-core 4.14.0 WCAG 2 A/AA and 2.1 A/AA rules on representative pages and Portal sign-in documents. It saves rule IDs/selector targets without raw HTML or form values, records incomplete checks for review and fails on violations.

The additional public `editor-boundaries` fixture checks long button/file/bookmark/callout text and a three-image gallery at 320px, 800px and 801px, spanning the theme's 800px breakpoint. It records actual card/action bounds and screenshots, downloads the local text file through keyboard activation and follows the CTA to its actual local destination. `editor-boundaries.json` preserves measurements even when the overflow assertion fails. These are existing native card types with edge-case content, not added product features.

Screenshot review exposed vertically clipped CTA text even though the horizontal bounds passed. The added `scrollHeight <= clientHeight + 1` assertion failed in both profiles at all three widths in [40793582567](https://github.com/qq550723504/ghost-research-pro/actions/runs/40793582567), commit `cdbf0b7cf1bfa87ac47475bc9f645487768288df`: native button height was about 40px while content required 104px at 320px and 54px at 800/801px. The theme lets button-card height grow with content, retains a 2.4em minimum and adds vertical padding. The scoped override outranks Ghost's `.kg-button-card a.kg-btn` height rule, verified in the official Ghost 6.73.0 npm package at `core/frontend/src/cards/css/button.css`. The regression verifies complete text containment as well as keyboard activation, rather than treating successful navigation as proof that the label fits.

There is no Stripe connection, checkout or real charge. All emails use `example.test` addresses and are held in memory by a local SMTP sink; none are delivered externally. Complimentary entitlement fixtures test Ghost's real access-control middleware, **not payment subscription creation, renewal, cancellation or webhooks**.

Portal is pinned as a development fixture and excluded from the theme ZIP. The disposable Ghost config points its normal Portal URL at a loopback test URL; Playwright serves the unmodified official bundle at that URL. Portal calls the actual Ghost APIs. All other external browser requests, including Stripe SDKs, fonts and telemetry, are blocked. This verifies pinned Portal integration and free flows, not CDN availability, paid checkout or external embeds. Portal screenshots are captured before authentication URLs are opened or after those URLs have been cleared.

## Evidence and limits

`ghost-runtime-ghost5` and `ghost-runtime-ghost6` workflow artifacts contain `results.json`, `portal-layout.json`, `accessibility.json` and screenshots. Earlier runs used `ghost-runtime-acceptance`. Raw server logs, passwords, member tokens, cookies and databases are not uploaded. The app process is stopped in `finally`, and the CI runner is discarded afterward.

`contrast-review.json` supplements axe's incomplete contrast entries on scrollable content. It records actual computed text/ancestor background colors, opacity/filter constraints, font metrics, DOM tag/selector information and unrounded contrast ratios. The calculation follows [WCAG relative luminance](https://www.w3.org/TR/WCAG22/#dfn-relative-luminance); these fixture texts are checked conservatively against [4.5:1](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). CI captures the table/code region at start, middle and end scroll positions for visual review. The raw axe `incomplete` entries remain in the report; they are not silently converted to passes. `npm run test:contrast` checks the calculation against black/white and near-threshold reference values.

The [recorded contrast review](contrast-review.md) resolves the current two incomplete entries per profile for the default palette using measurements and visual inspection. It does not change axe's raw classification.

`adapter-boundary.json` records controlled iframe failure/cleanup fixtures without external accounts or requests: an initially opaque sandbox document, iframe removal, an accessible document becoming opaque and a document getter throwing `SecurityError`. The first boundary run reproduced background `inert` leaks in the three inaccessible-document cases; removal already worked. The adapter now waits for an accessible document before locking the background, and restores its own recorded inert states and trigger focus if access fails. A preexisting inert element must stay inert. Failed frames retain their native behavior without further enhancement. These tests verify cleanup boundaries, not full cross-origin Portal support; actual Portal flows still use the pinned same-origin fixture.

`portal-interruption.json` records each form-switch/repeated-trigger cycle with its failing stage if any, iframe identities, close-click delivery, background inert state and animation/adapter state. It stores no form values, URLs or member data. A failure captures the anonymous fixture at that stage. `PORTAL_INTERRUPTION_REPEATS` accepts 1..30 desktop cycles; CI uses 20 for Ghost 6 and 1 for Ghost 5, with one mobile cycle each. These are repetitions inside the existing interrupted-flow assertion, not additional independent acceptance checks. Close/detachment timeouts and all original assertions remain unchanged. This bounded check targets the single Ghost 6 desktop close timeout in workflow 40738721333; a passing sample does not prove intermittent failures impossible.

`account-results.json` records seven fixture account flows without raw member responses or form values. `account-contrast.json` captures computed colors/background chains for account text and the Back/help controls, independently of axe incomplete classifications. `account-http.json` adds four strict [controlled 503/429 cases](account-http-acceptance.md); recovery writes go to real Ghost, not mocked successful responses. Profile and preference captures are added to the selected axe documents; this does not replace screen-reader testing.

The diagnostic run [40740720605](https://github.com/qq550723504/ghost-research-pro/actions/runs/40740720605), commit `aa0316d1a6a69151aa5b576df9c4c3efbafc0ad9`, reproduced the desktop timeout on cycle 2. `repeat-trigger` recorded no iframe; the conditional close was skipped, then iframe 2 appeared and received no close click before `wait-repeated-detached` failed. This was a test race: a synchronous zero count was mistaken for completion of Portal's asynchronous opening. The test now waits for the repeated dialog's email field, requires exactly one iframe, clicks its close button and waits for detachment. It adds no timeout extension or retry. Observations are read after closing, without browser round trips between the tested interactions. A controlled delayed-creation fixture verifies the initial zero-frame state still leads to one delivered close click and final detachment; its result is saved in `portal-delayed-open.json`. This verifies the diagnosed wait bug, not every possible native Portal race.

The theme ZIP source/packaging path is unchanged by serving the test Portal bundle. The general layout smoke pass blocks external scripts; the separate Portal pass captures signup/account at 360px and signin at 1440px. The theme's accessibility adapter supplements native Portal semantics/focus behavior and applies the theme's accent to its actions, without changing member or billing API behavior. Portal 2.51's clickable SVG close control receives button semantics and forwards activation to its original handler. Changing the theme palette requires rechecking contrast.

Portal captures wait for font readiness and finite iframe animations, assert the panel is opaque and its visible panel/controls fit the iframe viewport, then disable animations for the capture. Portal deliberately extends its hidden-scrollbar wrapper by 30px, so document `scrollWidth` would falsely flag that wrapper; panel and control bounds are saved in `portal-layout.json`. This avoids saving the opening fade as a blank or pale screenshot. The first passing Portal functional run was [40725520848](https://github.com/qq550723504/ghost-research-pro/actions/runs/40725520848), commit `324d69aaeba5d3db98b4d96e0bd2ff642d65c0cf`: 43 runtime checks passed. Use the latest head's artifact for current visual evidence.

A passing matrix job validates its exact pinned environment only. It does not establish every Ghost 5/6 minor version, browser or custom palette. Current editorial fixtures do not cover audio/video playback, NFT/product/header/signup cards or arbitrary external embeds. axe-core checks are a focused automated subset: screen readers and full WCAG conformance remain untested. Account coverage excludes email-address changes, custom member fields, comment/announcement preference writes and HTTP errors beyond the controlled 503/429 probes. PR #10 remains Draft. Production deployment, merge and real payments are outside this acceptance run.

## First passing execution

The pre-matrix baseline remains commit `e6787a06b363761180f48ad47f7e80b36a378e30`, [workflow 40726933871](https://github.com/qq550723504/ghost-research-pro/actions/runs/40726933871): 43 Ghost 6 checks passed with 15 screenshots. The first complete expanded matrix was commit `5cd0c2ba6ccf571fb7fd92668b471e296bbc6886`, [workflow 40732686825](https://github.com/qq550723504/ghost-research-pro/actions/runs/40732686825): both pinned Ghost profiles passed all 77 recorded checks. Those are historical code-specific results; newer card/scrolling assertions must be verified on their own head.

[Theme CI 40661983220](https://github.com/qq550723504/ghost-research-pro/actions/runs/40661983220) tested commit `ac89607494ccf5f8f83d8eb40683338fabe818a0` on 2026-10-28: 34 checks passed. Artifact: [runtime results and screenshots](https://github.com/qq550723504/ghost-research-pro/actions/runs/40661983220/artifacts/12804422278).

| Visitor | Public report | Members report | Paid report | Tier A report |
| --- | --- | --- | --- | --- |
| Anonymous | Allow | Deny | Deny | Deny |
| Free member | Allow | Allow | Deny | Deny |
| Complimentary tier A | Allow | Allow | Allow | Allow |
| Complimentary tier B | Allow | Allow | Allow | Deny |
| Anonymous after privileged requests | Allow | Deny | Deny | Deny |

Revoking tier A member sessions also removed access. Denial means the secret body marker was absent from the entire returned HTML, not merely hidden by CSS.

Reviewed the desktop home, mobile membership and mobile locked-article screenshots. Basic layout is usable; review identified duplicate subscribe blocks and missing restricted-card public summaries. Follow-up fixes add regression assertions. New runs publish their own evidence; the first passing run above is not used to claim later commits passed.
