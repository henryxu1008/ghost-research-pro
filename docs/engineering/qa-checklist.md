# Ghost Research Pro — installation and acceptance checklist

For the current exact-payload status, local installation methods, PR integration and unresolved release conditions, start with the [candidate handoff](../candidate-delivery.md). The dated runs below are historical evidence, not the current result.

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

## Historical local runtime attempt — blocked before theme activation

Ghost 6.73.0 was unpacked and dependencies installed in an isolated temporary directory with Node 24.22.1. Bootstrap failed during database fixture migration (`2-create-fixtures.js`): `uv_interface_addresses`, `ERR_SYSTEM_ERROR`, errno 1. The process exited before theme upload/activation. This is an environment-level blocker, not evidence of a theme runtime failure or a successful installation. The same stock Ghost version subsequently initialized successfully on the ephemeral CI runner. The original host restriction remains; no Node or Ghost monkey patch was applied.

## Automated real-instance acceptance
- [x] Upload the built theme ZIP through Ghost Admin API and verify activation by reading back the active theme.
- [x] Verify actual Ghost Admin UI upload/activation, cancellation, repeat upload and invalid-ZIP feedback in both pinned profiles: [runtime code e53af9a / workflow 40809348925](https://github.com/qq550723504/ghost-research-pro/actions/runs/40809348925). All four UI cases pass per profile; [scope and offline font fallback](admin-ui-acceptance.md) remain explicit. This is browser UI automation with screenshot review, not login or remote-font acceptance.
- [x] Verify native installed-theme backup download, a temporary higher-version overwrite and rollback using that downloaded ZIP. The fifth [Admin UI probe](admin-ui-acceptance.md#backup-version-upgrade-and-rollback) passes in focused local checks on both pinned profiles and is included in runtime CI. It verifies active version, served template/CSS, selected publication settings/content and anonymous restricted-body protection. See the [user guide](../user-guide.md) for the supported install/configuration/update/restore flow; the dated probe evidence remains historical, while the latest exact-payload results are linked in the handoff.
- [x] Verify theme-owned signup/account prompts for public, paid-only and invitation-only signup across anonymous, free and complimentary-paid readers. Both pinned real instances reproduce the original failures and pass 11 focused probes after repair; [scope](membership-signup-acceptance.md) distinguishes real settings/sessions from render-only paid-enabled examples. No Stripe checkout is claimed.
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

Updated 2026-10-31: the owner accepted proceeding with the known stock Portal
comment-save feedback issue. This is a release-risk decision, not a test waiver.
Both matrices, strict assertions and red CI outcomes stay unchanged. Initial
support is only Ghost6.73.0 / Node24.22.1 / stock Portal2.72.11; Ghost5 remains
compatibility evidence outside that promise.

### Core-function requirements before publication

- [x] Current payload's source/ZIP GScan reports 0 errors / 0 warnings; seven
  packaging tests and independent ZIP CRC checks pass.
- [x] Current Ghost6 CI passes actual Admin UI upload/activation, cancellation,
  repeated upload, backup/upgrade/rollback and invalid-ZIP protection.
- [x] Core research routes/pagination, report rendering, member body-access
  isolation, free member flows and ordinary preference saves have passing
  evidence. See [CI41073586729](https://github.com/henryxu1008/ghost-research-pro/actions/runs/41073586729)
  for payload `431990ef`; its overall result is still failure.
- [x] Standard MIT is included and package metadata matches; the
  [license inventory](release-licensing-inventory.md) records third-party boundaries.
- [ ] At publication, confirm final merged source, version, exact ZIP/hash and
  matching release notes. Investigate any new/different failure or lost core
  pass; no silent assertion removal or branch-protection bypass is allowed.
- [ ] Obtain the separately scoped merge/release/listing authorization and
  final channel/terms in the [publication checklist](../delivery-readiness.md#smallest-remaining-publication-decision).

### Accepted known limitations — still failing tests

- Ghost6: [comment notification feedback](comment-preference-acceptance.md)
  can report success before an interrupted save fails. An opt-out may remain
  unsaved. Ordinary save/reload and explicit recovery pass; the failure remains
  **red**, must be disclosed, and does not block the whole theme under the new
  owner decision. A real supported repair is still tracked upstream.
- Ghost5, outside initial support: the same comment issue plus newsletter
  HTTP503/429 client draft/account feedback failures. Its strict probes stay
  enabled; do not claim Ghost5 fully accepted.
- The 2026-10-31 development-tool audit reports **0 critical / 3 known high /
  3 moderate nodes**;
  dependencies are not shipped in the runtime ZIP. See the
  [bounded security policy](dependency-security.md); new audit findings are not
  accepted by the Portal-risk decision.

### Future-scope acceptance — no completion claim

- [ ] Before promising a paid-subscription lifecycle, execute Stripe sandbox
  plan/checkout, creation, renewal, cancellation/refund and recovery checks in
  the [payment matrix](payment-acceptance.md). Complimentary access is not billing.
- [ ] Before claiming full accessibility or broader compatibility, complete
  screen-reader, alternate-browser, custom palette/font/content, media and
  external-embed coverage for that claim.
- [ ] Account email-address changes, custom fields, announcement writes and
  HTTP failures beyond documented probes remain unaccepted. Ghost6's existing
  controlled newsletter HTTP503/429 checks pass; do not conflate them with the
  failing Ghost5 cases.
- [ ] Verify any newly added third-party media/assets before distributing them.
  Customer interviews and buying-intent research remain unverified; they are
  not technical blockers for this bounded delivery and cannot be marketed as
  completed customer validation.

## Release gate

[PR17](https://github.com/henryxu1008/ghost-research-pro/pull/17) remains the single
candidate targeting main. Inspect the exact final-head jobs and failure names;
137/1 is not full green and the red aggregate is not proof that core theme
functions failed. The accepted upstream limitation permits delivery preparation,
not automatic merge, deployment, publication or real payments. Existing repository
rules remain in force. See [0.1.0 release notes](../release-notes-0.1.0.md).
