> Historical preparation evidence below is retained as originally recorded. Version 0.1.0 was formally published on 2026-10-31 at [its Release](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.1.0), tag/main `b8253801ccf0864d856c1b8368bca4d32ef5a03c`. Current package identity and installation guidance are in [the 0.2.0 notes](release-notes-0.2.0.md).

# Ghost Research Pro 0.1.0 — release preparation

Prepared 2026-10-31. **Not yet tagged, released or listed for sale.**
The owner has chosen to proceed with theme delivery while disclosing the known
upstream Portal failure-feedback limitation. This is not an all-tests-passed
claim and does not authorize publication actions by itself.

## First-version scope

- Support target: **Ghost 6.73.0 / Node 24.22.1 / stock Portal 2.72.11**.
  No every-6.x, all-browser or Ghost5 support promise. Ghost5 compatibility CI
  remains enabled with its known failures; engine metadata is not a warranty.
- Editorial Featured/recent-research home, report metadata and public-safe
  access labels; visible-authorized H2/H3 TOC and native editor-card presentation.
- Complete native tag/author pagination and optional Library/format/year views.
  These are separate server-paginated collections, not combined filters/search.
  Optional Library setup requires metadata Pages, routing and navigation; the
  ZIP does not create them. See the [setup guide](research-publishing-setup.md).
- Native Ghost free/member/paid/tier body access and membership entry points.
  No replacement account, billing service, custom Portal bundle or global fetch
  shim is included. Native paid features stay intact, but Stripe checkout,
  renewals, cancellations/refunds and recovery are **not verified or promised**.
- Standard MIT, with the actual LICENSE retained. No additional resale ban.
  Hosting, mail delivery, domain, managed deployment and payment services are
  not part of the theme package.

## Exact package identity

| Field | Value |
| --- | --- |
| Package / version | `ghost-research-pro` / `0.1.0` |
| Runtime payload source | `431990efde71e751c097d170c4314e28f301bb79` |
| Installable inner ZIP | `ghost-research-pro.zip` |
| Size / entries | 40,181 bytes / 16 regular files |
| SHA-256 | `a8f0f6642c2a747cc06ac48b4781f1861a4b668ef1464d3463d10f23f11ee5ac` |
| Evidence | [CI41073586729](https://github.com/henryxu1008/ghost-research-pro/actions/runs/41073586729), PR17 head above against main `68acc002` |

This release-preparation change is documentation-only: version and runtime
payload bytes remain unchanged. The package was rebuilt and its identity
rechecked on 2026-10-31. Multiple development commits used version 0.1.0; retain
the full source SHA and ZIP hash. Before any later release, record the actual
merged commit and verify it still produces this payload. Do not treat a GitHub
test-merge SHA or an outer artifact-download ZIP as the installable ZIP identity.

### Runtime ZIP inventory

| Path | Bytes |
| --- | ---: |
| `LICENSE` | 1,068 |
| `assets/css/screen.css` | 11,003 |
| `assets/js/accessibility.js` | 13,717 |
| `author.hbs` | 538 |
| `custom-membership.hbs` | 1,938 |
| `default.hbs` | 1,258 |
| `error.hbs` | 143 |
| `index.hbs` | 2,214 |
| `library.hbs` | 867 |
| `package.json` | 1,339 |
| `page.hbs` | 369 |
| `partials/access-badge.hbs` | 274 |
| `partials/card.hbs` | 617 |
| `partials/library-nav.hbs` | 825 |
| `post.hbs` | 1,866 |
| `tag.hbs` | 455 |

ZIP size includes headers; the rows are uncompressed file sizes. Runtime files
exclude docs, tests, development dependencies, Portal bundles, screenshots,
accounts/secrets and synthetic content. Supply [installation guidance](user-guide.md),
these release notes and the optional [route example](../examples/research-routes.yaml)
separately, plus access to the source repository and its LICENSE. The existing
[fictional demo recipe](demo-content.md) is manual setup documentation, not an
imported publication or a one-click importer. The separate five-draft content
pack is not included or promised by this release preparation; its content was
not imported/tested by the theme's installation checks.

## Verified core and strict results

The exact-payload CI above reports:

- Validate **passed**: source and ZIP GScan for Ghost5/6, 0 errors / 0 warnings;
  seven Linux packaging cases, independent CRC checks and bounded audit gate.
- Ghost6 primary profile: **137 PASS / 1 FAIL / 0 SKIP**. Current ZIP's real Admin
  UI upload/activation, cancellation, repeated upload, backup/upgrade/rollback
  and invalid-ZIP protection pass. Core research pages/pagination, protected
  body isolation and ordinary account/save flows have passing evidence.
- Ghost5 compatibility only: **135 PASS / 3 FAIL / 0 SKIP**.
- Runtime jobs and the overall run remain **failed**, not green. Failed cases
  are the specific upstream behaviors below. The test suite, workflow,
  assertions, skip behavior and audit policy are unchanged by this decision.

Current CI installation evidence is distinct from historical PR16 local
buyer-copy/21-screen evidence. The latter does not establish a new independent
buyer acceptance of this final ZIP. API configuration saves are not individual
GUI-editor walkthroughs. No fresh local browser run is claimed here.

## Known limitations

1. **Accepted for the first delivery: Portal comment-notification feedback.**
   If a preference write fails or is interrupted, Portal may display success
   before error. The intended change may be unsaved; turning notifications off
   may therefore leave them enabled. Reopen/reload and verify the actual saved
   preference, then explicitly retry if needed. This precaution is not a repair.
   Normal save/reload and explicit recovery checks pass. These probes did not
   demonstrate protected-body exposure, server-session loss or a real charge;
   actual notification delivery was not tested. The owner explicitly accepted
   this limitation on 2026-10-31 rather than blocking the entire theme on it.
2. **Ghost5, outside initial support:** stock Portal2.51.5 additionally loses
   client draft/account feedback on newsletter HTTP503/429 errors. Its results
   remain visible, not silently treated as supported or passing.
3. **Development tooling:** the 2026-10-31 local refresh reports 0 critical /
   3 known high / 3 moderate dependency nodes. The moderate nodes share one new
   minimatch advisory in the development ZIP chain; the unchanged audit gate
   passes, but this is not a clean audit or a tested dependency repair. These
   dependencies are not in the runtime ZIP. Do not use that
   toolchain to inspect untrusted third-party archives. See the
   [exact advisory boundary](engineering/dependency-security.md).
4. **Not verified/promised:** Stripe subscription lifecycle, full WCAG or
   screen-reader conformance, all browsers, arbitrary fonts/palettes/content,
   external embeds/media delivery and account fields beyond documented probes.
   Theme-owned labels are English; there is no custom Admin palette UI.

[Upstream PR32314](https://github.com/TryGhost/Ghost/pull/32314) remains a tracked
repair, not an installed released fix. A future supported Portal update must
pass the unchanged regression checks before this limitation can be removed.
No private package, theme-side toast suppression or disabled feature is shipped.

## Publication checklist

- Keep core-function, access-control, package and license requirements intact;
  investigate any new or different failure before publication. The known-issue
  acceptance is not a blanket waiver for future defects or audit regressions.
- Preserve red CI and applicable repository rules. If rules block merging,
  handle that through the normal authorized process, not altered tests/rules.
- Confirm one [publication action batch and channel](delivery-readiness.md#smallest-remaining-publication-decision)
  before merge/tag/Release/listing; none has happened in this preparation.
- Include the limitations in the listing and downloadable notes, and retain a
  rollback ZIP. Do not advertise all tests passed, verified billing, customer
  demand, a hosted public demo, or support/refund terms not actually provided.
