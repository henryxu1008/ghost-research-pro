# Ghost Research Pro — installation and acceptance checklist

## CI evidence
The first theme validation and ZIP packaging workflow passed in GitHub Actions run 40656495494. This is **not** evidence of installation or runtime behavior.

## Validation hardening — 2026-10-28

- Previous head `500e7db` passed workflow [40657343358](https://github.com/qq550723504/ghost-research-pro/actions/runs/40657343358), but only fatal GScan rules were checked.
- Full scan exposed 3 errors and 4 warnings. Fixed author metadata, editor wide/full card styles, font variables, card assets configuration, theme keyword, and page title visibility support.
- Local `npm ci --ignore-scripts`, source scan and archive scan passed with **0 errors and 0 warnings** against both Ghost 5 and Ghost 6 specifications (GScan 6.6.1; Node 24.22.1).
- Inspected ZIP contents: `partials/card.hbs` included; development files excluded. Injected a stale archive entry and rebuilt: stale entry removed.
- Negative checks: a missing ZIP fails validation; a temporary theme missing `author.email` fails validation. The new CI gate blocks nonfatal errors and warnings as well.
- Lockfile pins the dependency tree; CI uses the same packaging and validation commands as local development.

## Local runtime attempt — blocked before theme activation

Ghost 6.73.0 was unpacked and dependencies installed in an isolated temporary directory with Node 24.22.1. Bootstrap failed during database fixture migration (`2-create-fixtures.js`): `uv_interface_addresses`, `ERR_SYSTEM_ERROR`, errno 1. The process exited before theme upload/activation. This is an environment-level blocker, not evidence of a theme runtime failure or a successful installation. Repeat installation and route/member checks on a normal Ghost development host.

## Manual Ghost verification (not yet performed)
- [ ] Download the `ghost-research-pro-theme` artifact from a successful Theme CI run.
- [ ] Extract artifact and upload `ghost-research-pro.zip` in Ghost Admin → Settings → Design & branding → Change theme (location may vary by Ghost version).
- [ ] Activate theme and confirm home, post, tag, author, page and 404 routes render.
- [ ] Configure a Ghost page with custom template `Membership` and verify both membership cards.
- [ ] Confirm native Ghost Portal signup/signin links work with memberships enabled.
- [ ] Test anonymous, free member, paid member and restricted-content states; Ghost itself must enforce access rules.
- [ ] Test mobile widths 360px, 768px and desktop 1440px; keyboard focus and screen reader landmarks.
- [ ] Verify report tables, embeds, images, heading hierarchy and long article readability.
- [ ] Re-run GScan against the final ZIP and record the Ghost version tested.

## Release gate
Do not label this production ready until installation, accessibility and member flows have been manually verified on a supported Ghost instance.
