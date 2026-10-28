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
- [x] Scan source and ZIP against Ghost 5/6 specifications; actual runtime tested: Ghost 6.73.0, Node 24.22.1.

## Remaining release gates
- [ ] Manually exercise Ghost Admin UI theme installation; automated installation currently uses the same backend API.
- [ ] Verify third-party Portal UI signup/account flows and the paid-plan card with Stripe in **test mode**. No live Stripe connection or charge was used.
- [ ] Test payment subscription lifecycle/webhooks in test mode; complimentary entitlements do not prove billing works.
- [ ] Full accessibility audit, screen reader testing and broader editorial-card/image/embed/long-article coverage.
- [ ] Test other advertised runtime versions, especially Ghost 5; static GScan compatibility is not runtime proof.
- [ ] Resolve project licensing and complete design/commercial review.

## Release gate
PR #10 stays Draft. A passing disposable-instance acceptance run does not authorize merging, deploying or real payments, and is not a claim of production readiness.
