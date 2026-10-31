# Ghost Research Pro product requirements

Candidate scope, updated 2026-10-31. PR16 runtime baseline:
`993b4e25bd3d9aa227041b74f3e44bc3875c8054`; PR17's font/notice follow-up now has
the separate build identity and evidence in the candidate handoff below.
This updates the earlier [PR14 contract](https://github.com/henryxu1008/ghost-research-pro/blob/5fcec3162be2fff50383d3541b55d511250567d8/docs/product/prd.md)
to the owner's subsequent research-publishing direction. It is an unmerged
candidate for evaluation. See the [delivery guide](../candidate-delivery.md)
for the exact ZIP, evidence and release criteria. The owner now accepts the
specific known Portal failure-feedback limitation for first delivery; it is not
a whole-theme delivery blocker or a passing test.

## Reader and publisher value

An independent researcher or small editorial team can configure a recognizable
research publication using Ghost's existing editor, tags, authors, navigation
and memberships. Readers get a coherent homepage, report reading view and
complete server-paginated collections. These are implemented differences to
evaluate, not validated reasons to purchase or promises of better conversion.

[Dated market evidence](market-validation.md) retains the ten-theme comparison
and twenty qualified commercial examples. Actual customer conversations remain
0/5, confirmed unmet needs 0/3 and paid-intent signals for this theme 0/2.
No new outreach, pricing decision or customer claim accompanies this candidate.

## Implemented first-version contract

| Area | Current behavior and boundary |
| --- | --- |
| Homepage | Publication identity, newest actual Featured publication with an honest empty-selection fallback, paginated latest work and a research sidebar. No carousel or invented editorial endorsements. |
| Reports and cards | Actual authors, published/updated timestamps, public-safe excerpts and Public / Members / Paid members / Selected tiers policy labels. Reading time only with access. The updated date is Ghost's timestamp, not an audited revision history. |
| Reading | Shared Research/Brief post template, visible-content H2/H3 TOC, native editor cards, constrained tables/code and a single reading column. No PDF/chart-generation or market-data service. |
| Collections | Native tag/author archives plus optional Library and dated channels. Full server pagination; separate topic/format/year links, without combined facets or keyword search. |
| Publisher setup | Research/Brief public-tag conventions; three metadata Pages; merge/upload one route file; primary/secondary navigation. Fixed example years require a new Page, dated route and menu link annually. |
| Membership | Ghost enforces body access and owns signup/plans/account/payment. Theme CTAs respect public, paid-only and invitation-only signup. Native membership/paid features and access rules are retained, while the owner excludes the unexecuted paid lifecycle from the first promise. The known stock Portal comment-save feedback failure is an accepted disclosed limitation; strict tests remain failed. |
| Presentation | Light presentation, English theme-owned labels, native title/description/logo/fonts, fixed theme blue accent. No dark mode, arbitrary palette control or custom Admin theme fields. |
| Delivery | Deterministic installable ZIP, installation/upgrade/rollback and setup guides, fictional demo recipe, explicit evidence and licensing inventory. No hosted deployment or automatic content import. |

The same post may appear in several native collections. Research and Brief are
editorial tags, not separate enforced content types. Public titles, summaries,
tags, authors and images must never contain confidential findings. The TOC uses
already authorized HTML and never retrieves protected bodies.

## Candidate acceptance

| Outcome | Evidence and remaining limit |
| --- | --- |
| Complete browsing | Exact-payload CI passes all nine new research checks in both pinned Ghost profiles, including old work beyond page one, UTC year bounds, access labels and protected Featured metadata. Historical PR16 local Ghost6 acceptance (`993b4e25`, ZIP `e515558f…cb5f`) traversed 20 publications across two Library pages and separate year/tag/format views; it is not a fresh buyer run of the final ZIP. |
| Reading and keyboard | Actual-template Chromium and stock-Portal focus fixtures pass on the payload baseline. Historical PR16 independent visual review (`993b4e25`, ZIP `e515558f…cb5f`) reported no P0/P1/P2 in 21 screens, not a new independent review of the final ZIP. This is sampled visual/interaction evidence, not full screen-reader or WCAG certification. |
| Install and recover | Pinned CI includes real Admin UI upload/cancel/repeat/invalid-ZIP and backup/upgrade/rollback probes. The final 16-file ZIP passes all five Admin UI probes in CI41073586729. The separate historical PR16 buyer-copy run uploaded ZIP `e515558f…cb5f` through Admin UI; its tags/Pages/routes/menus used official Admin APIs. Their graphical editor click paths were not individually tested. |
| Repeatable package | PR13's packager is in the PR16 ancestor chain. Current packaging checks preserve supplied LICENSE/NOTICE; standard MIT LICENSE now joins the 15 runtime files in the 16-file ZIP. Inspect exact-head CI for all seven packaging cases. Docs, routes, Portal bundles and demo data are excluded. |
| Account recovery | **Known fail:** Ghost5 newsletter HTTP503/429 client recovery; both pinned Portals' premature success on aborted comment-preference saves. Successful ordinary saves do not clear those failures. |
| Compatibility | Static Ghost5/6 scans pass; exact-runtime results remain Ghost5 135 pass/3 fail and Ghost6 137 pass/1 fail at the payload baseline. No full-runtime green or every-minor support claim. |
| Toolchain | Audit gate remains enabled: 0 critical / 3 known high dependency nodes in development ZIP tooling. The 2026-10-31 local audit also reports 3 moderate development nodes (one minimatch advisory); see the security notes. This is not a clean audit; dependencies are excluded from the theme ZIP. |
| Paid lifecycle | **Owner decision: no first-version promise of the unexecuted paid lifecycle or end-to-end commercial readiness.** Subscription creation/checkout, renewals, cancellation, refunds and failure recovery remain unaccepted. Complimentary entitlement/CTA checks are not billing. Native features/access remain unchanged; a future promise requires sandbox acceptance. |
| Distribution | The owner selected standard MIT; root LICENSE and package metadata match, with verified repository-account attribution and existing upstream references retained. MIT permits distribution/sale under its terms; no extra restriction is added. Functional release/marketplace readiness and optional service pricing are not established by that license grant. |

## Release decisions and constraints

The owner selected Ghost6.73.0 / Node24.22.1 / stock Portal2.72.11 as first-version
primary support/delivery, without promising all6.x. Ghost5 is compatibility CI
evidence outside that first promise; both strict matrices remain visible and
unchanged. Evaluate the exact [candidate matrix](../candidate-delivery.md#tested-profiles).
Permissive installation-engine metadata is retained, not a support warranty.
Core functionality and package identity must stay verified. On 2026-10-31 the
owner chose to proceed with the disclosed upstream comment-save feedback issue,
without changing strict tests or claiming it repaired. A supported Portal repair
and rerun remain follow-up work, not a prerequisite for this bounded delivery.
Payment sandbox acceptance is required before a future paid-lifecycle promise;
broader browser/accessibility claims need their corresponding evidence. Market
interviews and buying intent remain unverified research, not a technical blocker
for this first delivery. No customer results are invented.

No custom CMS, identity/billing service, client-side private index, global fetch
patch or replacement Portal is part of this contract. No merge, public release,
deployment, real mail/payment or license grant is authorized by this document.

Use the [design specification](design-spec.md), [research setup](../research-publishing-setup.md),
[operator guide](../user-guide.md) and [QA checklist](../engineering/qa-checklist.md)
for the maintained implementation and operation details.
