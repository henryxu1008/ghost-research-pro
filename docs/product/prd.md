# Ghost Research Pro product requirements

Current product contract, updated 2026-11-01. **v0.2.0 is merged and publicly
downloadable**, not an unmerged candidate. Use the [official Release and installable
ZIP](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.2.0) and
[operator guide](../user-guide.md). The release's source is merge commit
`b416f9a042bf2d0fc467636fc7e4915866ee1444`. Its [release notes](../release-notes-0.2.0.md)
and the older candidate records retain their original, exact-version evidence.
This document describes the current product; it does not authorize deployment.

## Reader and publisher value

An independent researcher or small editorial team can configure a recognizable
research publication using Ghost's existing editor, tags, authors, navigation
and memberships. Readers get a configurable homepage, report reading view,
native search and complete server-paginated collections. These implemented
features can be tried on a test publication; they are not validated reasons to
purchase or promises of better conversion.

[Dated market evidence](market-validation.md) retains the ten-theme comparison
and twenty qualified commercial examples. Customer conversations remain 0/5,
confirmed unmet needs 0/3 and paid-intent signals for this theme 0/2. No pricing,
customer result or new outreach is claimed. Those unknowns are not prerequisites
for trying the delivered functionality.

## Implemented product contract

| Area | Current behavior and boundary |
| --- | --- |
| Homepage settings | Four native Ghost Admin theme controls: Hero title, Hero description, open-signup CTA label and Show editor selection. Empty text preserves the publication title/description or original CTA; selection defaults on. Selection shows the newest Featured publication or an honest reading-guide fallback. Turning it off removes its column and compacts the narrow-screen Hero without breaking latest work or pagination. Text is escaped; no arbitrary HTML or page builder. |
| Membership prompts | The custom CTA label applies only to anonymous open registration. Signed-in members see Your account; invitation-only/unavailable registration uses Sign in; paid-only registration offers View plans only when paid memberships are enabled. Ghost owns access, signup, account and payment behavior. |
| Brand and typography | Ghost's brand accent drives theme actions, native button/upgrade cards and an already-accessible Portal iframe. Readable hex colors are retained; light colors are darkened along their RGB hue to at least 4.5:1 against white and the theme panel. Keyboard focus uses the safe tone; invalid/missing colors or unavailable JavaScript retain the safe blue fallback. Ghost heading/body fonts remain supported. Author colors/custom CSS need their own review; no dark mode or new font system. |
| Native search | A default header Search entry uses Ghost's official data-ghost-search / #/search interface. Ghost already allowed a manually configured Navigation search link before v0.2.0. The theme adds no private body index, search engine, external search service or global shortcut. Public search metadata must be safe to disclose; restricted bodies and draft/private fields stay outside the accepted public payload. |
| Reports and cards | Actual authors, published/updated timestamps, public-safe excerpts and Public / Members / Paid members / Selected tiers policy labels. Reading time appears with access. Ghost's updated timestamp is not an audited revision history. |
| Reading | Shared Research/Brief post template, visible-content H2/H3 TOC, native editor cards, constrained tables/code and a single reading column. The TOC uses already-authorized HTML and never fetches protected bodies. No PDF/chart generation or market-data service. |
| Collections | Native tag/author archives plus optional Library and dated channels. Full server pagination and separate topic/format/year views; no combined facets. Native keyword search is separate from those collection views. |
| Publisher setup | Research/Brief are public editorial tags, not enforced content types. Optional Library setup requires metadata Pages, a merged route file and navigation. Fixed example years require a new Page, dated route and menu link annually. The ZIP creates none of these records. |
| Delivery | Deterministic installable theme ZIP, source and MIT notice, installation/configuration guides and a fictional manual demo recipe. No hosted public demo, populated publication or importable sample-content pack is supplied. Localhost test instances are disposable tests, not production hosting. |

The same post may appear in several collections. Public titles, excerpts, tags,
authors and images must never contain confidential findings. No Library facets,
related-article system, membership-benefit expansion or payment feature is added
by the Portal dependency follow-up.

## Acceptance evidence and current Portal follow-up

The published v0.2.0 [main CI41202284274](https://github.com/henryxu1008/ghost-research-pro/actions/runs/41202284274)
tested **Ghost 6.73.0 / Node 24.22.1 / Portal 2.72.11**: 141 PASS / 1 FAIL / 0
SKIP. Ghost 5.130.6 / Node 22.23.4 / Portal 2.51.5 had 139 PASS / 3 FAIL / 0
SKIP. Validate passed, and all four new homepage/brand/native-search runtime
checks passed in both profiles. The strict failures were comment-save premature
success in both profiles and Ghost 5 newsletter HTTP 503/429 recovery. These are
historical release results, not evidence for a newer Portal bundle.

The current development fixture updates only Ghost 6's official Portal to
**2.72.12**, following [upstream PR32314](https://github.com/TryGhost/Ghost/pull/32314).
Ghost and Node stay pinned; Ghost 5 and Portal 2.51.5 remain unchanged. The
existing full runtime suite checks normal pointer/keyboard saves, reload
persistence, failure without premature success and an explicit real-write retry.
It uses a fresh SQLite database, disposable example.test accounts, loopback SMTP
sink and independent browser context. No assertion is skipped or weakened.

On **2026-11-01**, the unchanged full **npm run test:runtime** completed locally:
**142 PASS / 0 FAIL / 0 SKIP**, Ghost 6.73.0 / Node 24.22.1 / Portal 2.72.12.
All three comment probes passed: pointer/keyboard save-and-reload, no premature
success while the controlled request is pending or aborted, and explicit real
HTTP-200 retry with persisted/restored state and no mail. All four publisher
settings/brand/native-search probes also passed. The existing 20-cycle desktop
Portal interruption check remained enabled.

The first full run is retained separately as **141 PASS / 1 FAIL / 0 SKIP**:
Admin's missing-template ZIP case could not spawn the absent zip command. After
restoring that local tool, the result above used another fresh database and
passed the actual UI rejection check. No assertion changed. Related existing
security/package/contrast/publisher checks were **32 PASS / 0 FAIL / 1 existing
Windows symlink-fixture SKIP**; Linux CI must execute that negative case. Source
and ZIP GScan had zero errors/warnings for Ghost 5 and 6. This local run did not
rerun Ghost 5; use the accompanying Draft PR's exact-head CI for the Linux matrix.
Publication of an upstream package alone is not a passing acceptance result.

Portal is a development fixture, not bundled theme code. This source follow-up
does not replace the v0.2.0 tag, Release or downloadable asset, and does not update
an existing publication. Ghost loads Portal independently; inspect the actual
loaded bundle before applying any result to a site. Historical release notes and
old failures are retained unchanged.

## Support and limits

- Formal Ghost support remains the exact **6.73.0** target with **Node 24.22.1**;
  this follow-up tests stock Portal **2.72.12**. Ghost **5.130.6 / Node 22.23.4 /
  Portal 2.51.5** remains compatibility CI, with its known failures disclosed.
  Permissive engines.ghost metadata is not an every-minor support warranty.
- Native search tests use unmodified official **Sodo Search 1.9.6** in both
  profiles. Ghost 5's default CDN line **1.8** is not claimed as tested. Keyboard
  open/Escape/focus return, repeated opening, an older Chinese-titled post beyond
  the homepage's 12 cards, a long no-result query and actual public-index safety
  are covered. Search requires Ghost's official resources and APIs to load.
- The existing suite includes real Admin upload/activation, homepage/color
  save-and-refresh, native collections/access, editor cards and sampled keyboard,
  layout and axe checks. It is not full browser, screen-reader or WCAG certification.
  Remote Bunny fonts use the documented empty-CSS fallback; remote-font appearance
  and cross-origin Portal enhancement are not accepted. No permissions are expanded.
- Stripe checkout/subscription creation, renewals, cancellation, refunds and
  payment-failure recovery remain unverified. Complimentary access/CTA fixtures
  verify native permissions, not billing or end-to-end commercial readiness.
- The dependency audit gate remains enabled: **0 critical / 3 known high / 3
  moderate** development-tool nodes, not a clean audit. Dependencies are excluded
  from the theme ZIP; see [security notes](../engineering/dependency-security.md).
- MIT permits distribution and sale subject to its notice conditions. No paid
  store listing, hosted service, price, refund policy, response-time commitment or
  lifetime-update promise is established by this technical delivery.

Use the [research setup](../research-publishing-setup.md), [operator guide](../user-guide.md)
and exact-head CI/PR evidence for configuration and current results. The
[manual demo guide](../demo-content.md) is a recipe, not an imported content pack.
