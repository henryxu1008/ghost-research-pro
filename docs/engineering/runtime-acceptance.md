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
9. Exercises membership/header links with each profile's official Portal bundle: invalid email, free signup/confirmation, opening the account panel, signout and desktop signin. Free members get members-only content but no paid/tier body markers. Profile/preference saving is not tested.
10. Checks Escape/close-button focus return, Tab/Shift+Tab containment, form switching, repeated triggers and interrupted/reopened forms at 360px and 1440px. Those interrupted flows must not send email.
11. Seeds actual Lexical HTML, code, image (normal/wide/full), gallery, bookmark, callout, button, toggle, file and local embed cards. It checks rendering/bounds at three widths, local image/file delivery, keyboard toggle activation and table/code scrolling, plus protected-card markers in raw authorized/unauthorized HTML. The sandboxed embed uses a constant `srcdoc` document with its rendered heading checked; it makes no external request. Image fixtures are local SVGs, not a test of JPEG resizing or every media format.
12. Runs axe-core 4.14.0 WCAG 2 A/AA and 2.1 A/AA rules on representative pages and Portal sign-in documents. It saves rule IDs/selector targets without raw HTML or form values, records incomplete checks for review and fails on violations.

There is no Stripe connection, checkout or real charge. All emails use `example.test` addresses and are held in memory by a local SMTP sink; none are delivered externally. Complimentary entitlement fixtures test Ghost's real access-control middleware, **not payment subscription creation, renewal, cancellation or webhooks**.

Portal is pinned as a development fixture and excluded from the theme ZIP. The disposable Ghost config points its normal Portal URL at a loopback test URL; Playwright serves the unmodified official bundle at that URL. Portal calls the actual Ghost APIs. All other external browser requests, including Stripe SDKs, fonts and telemetry, are blocked. This verifies pinned Portal integration and free flows, not CDN availability, paid checkout or external embeds. Portal screenshots are captured before authentication URLs are opened or after those URLs have been cleared.

## Evidence and limits

`ghost-runtime-ghost5` and `ghost-runtime-ghost6` workflow artifacts contain `results.json`, `portal-layout.json`, `accessibility.json` and screenshots. Earlier runs used `ghost-runtime-acceptance`. Raw server logs, passwords, member tokens, cookies and databases are not uploaded. The app process is stopped in `finally`, and the CI runner is discarded afterward.

The theme ZIP source/packaging path is unchanged by serving the test Portal bundle. The general layout smoke pass blocks external scripts; the separate Portal pass captures signup/account at 360px and signin at 1440px. The theme's accessibility adapter supplements native Portal semantics/focus behavior and applies the theme's accent to its actions, without changing member or billing API behavior. Portal 2.51's clickable SVG close control receives button semantics and forwards activation to its original handler. Changing the theme palette requires rechecking contrast.

Portal captures wait for font readiness and finite iframe animations, assert the panel is opaque and its visible panel/controls fit the iframe viewport, then disable animations for the capture. Portal deliberately extends its hidden-scrollbar wrapper by 30px, so document `scrollWidth` would falsely flag that wrapper; panel and control bounds are saved in `portal-layout.json`. This avoids saving the opening fade as a blank or pale screenshot. The first passing Portal functional run was [40725520848](https://github.com/qq550723504/ghost-research-pro/actions/runs/40725520848), commit `324d69aaeba5d3db98b4d96e0bd2ff642d65c0cf`: 43 runtime checks passed. Use the latest head's artifact for current visual evidence.

A passing matrix job validates its exact pinned environment only. It does not establish every Ghost 5/6 minor version, browser or custom palette. Current editorial fixtures do not cover audio/video playback, NFT/product/header/signup cards or arbitrary external embeds. axe-core checks are a focused automated subset: screen readers, full WCAG conformance, other Portal forms and account profile/preference persistence remain untested. PR #10 remains Draft. Production deployment, merge and real payments are outside this acceptance run.

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
