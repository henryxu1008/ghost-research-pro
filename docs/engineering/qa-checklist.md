# Ghost Research Pro — installation and acceptance checklist

## CI evidence
The first complete runtime acceptance passed in [workflow 40661983220](https://github.com/qq550723504/ghost-research-pro/actions/runs/40661983220), commit `ac89607494ccf5f8f83d8eb40683338fabe818a0`: **34 checks passed**, including stock Ghost 6.73.0 initialization, real ZIP activation, page routes, member authorization and Chromium smoke checks. The `ghost-runtime-acceptance` artifact includes JSON results and 12 screenshots. See [runtime acceptance](runtime-acceptance.md) for setup, diagnosis and limits.

Screenshot review subsequently found redundant subscription CTA markup on restricted posts and missing public summaries on restricted report cards. These are fixed with regression assertions in the same runtime suite. Use the checks and artifacts on the latest PR head for final code validation.

## Validation hardening — 2026-10-28

- Previous head `500e7db` passed workflow [40657343358](https://github.com/qq550723504/ghost-research-pro/actions/runs/40657343358), but only fatal GScan rules were checked.
- Full scan exposed 3 errors and 4 warnings. Fixed author metadata, editor wide/full card styles, font variables, card assets configuration, theme keyword, and page title visibility support.
- Local `npm ci --ignore-scripts`, source scan and archive scan passed with **0 errors and 0 warnings** against both Ghost 5 and Ghost 6 specifications (GScan 6.6.1; Node 24.22.1).
- Inspected ZIP contents: `partials/card.hbs` included; development files excluded. Injected a stale archive entry and rebuilt: stale entry removed.
- Negative checks: a missing ZIP fails validation; a temporary theme missing `author.email` fails validation. The new CI gate blocks nonfatal errors and warnings as well.
- Lockfile pins the dependency tree; CI uses the same packaging and validation commands as local development.

## Local runtime attempt — blocked before theme activation

Ghost 6.73.0 was unpacked and dependencies installed in an isolated temporary directory with Node 24.22.1. Bootstrap failed during database fixture migration (`2-create-fixtures.js`): `uv_interface_addresses`, `ERR_SYSTEM_ERROR`, errno 1. The process exited before theme upload/activation. This is an environment-level blocker, not evidence of a theme runtime failure or a successful installation. The same stock Ghost version subsequently initialized successfully on the ephemeral CI runner. The original host restriction remains; no Node or Ghost monkey patch was applied.

## Automated real-instance acceptance
- [x] Upload the built theme ZIP through Ghost Admin API and verify activation by reading back the active theme.
- [x] Verify home, post, tag, author, page, custom membership page and 404 routes, plus stylesheet delivery.
- [x] Log in free and complimentary tier members through real Ghost magic links captured by local SMTP.
- [x] Verify public, members-only, paid and tier-specific post bodies for anonymous, free, tier A and tier B visitors.
- [x] Verify unauthorized HTML contains no protected marker, including wrong-tier and anonymous-after-authorized requests.
- [x] Revoke member sessions via Admin API and verify access is removed.
- [x] Verify 360px, 768px and 1440px layouts have no horizontal page overflow; test keyboard skip link.
- [x] Scan source and ZIP against Ghost 5/6 specifications. Pinned CI runtime profiles: Ghost 5.130.6 / Node 22.23.4 / Portal 2.51.5 and Ghost 6.73.0 / Node 24.22.1 / Portal 2.72.11.
- [x] Verify pinned Portal free signup/account/signout/signin: [workflow 40725520848](https://github.com/qq550723504/ghost-research-pro/actions/runs/40725520848), commit `324d69aaeba5d3db98b4d96e0bd2ff642d65c0cf`, **43 runtime checks passed**. Current visual evidence must come from the latest head; screenshot captures wait for Portal animations to finish.

The expanded matrix checks actual Lexical editor cards, protected-card HTML, selected axe-core WCAG A/AA rules, skip-link focus, Portal focus return/containment and interrupted forms. Use the latest matrix artifacts to establish success; an older passing 43-check run does not validate these additions. [Account checks](account-acceptance.md) update only disposable member names/newsletter subscriptions and test aborted-request recovery, cancellation, persistence and signed-out data isolation.

The first complete expanded matrix passed at `5cd0c2ba6ccf571fb7fd92668b471e296bbc6886`, [workflow 40732686825](https://github.com/qq550723504/ghost-research-pro/actions/runs/40732686825): 77 checks per Ghost profile, plus the dependency audit gate and its 10 fixed-fixture tests. Later refinements to embed/table checks require their own passing run.

## Remaining release gates

See the [Portal repair boundary and release route](portal-release-decision.md) for the smallest upstream responsibilities, support options and the next independent installation deliverable. The current supported scope and strict failures are unchanged.

- [ ] Manually exercise Ghost Admin UI theme installation; automated installation currently uses the same backend API.
- [ ] Verify paid Portal plan cards and checkout with Stripe in an isolated sandbox. No live Stripe connection or charge was used.
- [ ] Execute the [payment lifecycle matrix](payment-acceptance.md) in a sandbox; complimentary entitlements do not prove billing works.
- [ ] Full accessibility audit, screen readers, custom palettes, and cards outside the documented automated fixture set (including media playback and external embeds).
- [ ] Resolve every failed controlled HTTP 503/429 account-recovery case before release; see [HTTP acceptance](account-http-acceptance.md).
- [ ] Resolve the strict [comment notification feedback failure](comment-preference-acceptance.md) in both pinned Portal profiles. Real save/reload/keyboard restoration passes; aborted saves still announce success before reporting failure.
- [ ] Account email-address changes, custom fields, announcement preference writes and HTTP failures outside the documented controlled probes.
- [ ] Test runtime versions and browsers beyond the two exact pinned CI profiles; a broad engine range and static GScan result do not prove every minor version.
- [ ] Resolve project licensing using the [release inventory](release-licensing-inventory.md), including the existing MIT metadata / missing LICENSE mismatch, and complete design/commercial review.

## Release gate
PR #10 stays Draft. A passing disposable-instance acceptance run does not authorize merging, deploying or real payments, and is not a claim of production readiness.
