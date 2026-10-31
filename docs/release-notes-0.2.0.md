# Ghost Research Pro 0.2.0

Release date: 2026-10-31. The official publication record, exact tag/merge/PR
commit relationship, final CI links and installable asset are on the
[v0.2.0 Release](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.2.0).
The previous [v0.1.0 Release](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.1.0)
and its original tag/asset remain separate. The repository and theme are [MIT licensed](../LICENSE).

## Changes

- Four bounded native homepage settings: Hero title, Hero description, Hero
  signup label and Show editor selection. Empty text retains the original
  content; selection defaults on and has the original reading-guide fallback
  when no post is Featured. Turning it off removes the whole selection column
  and compacts the narrow-screen Hero without changing latest research/pagination.
- Ghost's brand accent drives theme links/buttons, styled native button/upgrade
  cards and the already-accessible Portal adapter. Readable colors are preserved;
  light colors are darkened along their RGB hue until the unrounded ratio is at
  least 4.5:1 on white and the theme panel. The same tone supplies keyboard focus.
  Portal button transitions and hover/focus opacity cannot dilute that contrast.
  Missing/invalid values or unavailable JavaScript retain the safe theme fallback.
- A visible header Search entry opens Ghost's native `data-ghost-search` /
  `#/search` interface. Ghost already supported a manually configured Navigation
  link in v0.1.0; this version supplies the default entry. The theme adds no global
  shortcut, private body index or external search service.

The custom signup label applies only to anonymous open registration. Existing
members retain **Your account**; invitation-only/unavailable registration retains
**Sign in**; paid-only registration offers **View plans** only when Ghost reports
paid memberships enabled. Text is escaped. This is not a page builder or a Portal
fork. Existing research metadata, TOC, Library/tag/year collections and native
access policies are retained; no new Library facets, related articles, membership
benefits or payment feature is included.

## Exact installation package

| Field | Value |
| --- | --- |
| Package / version | `ghost-research-pro` / `0.2.0` |
| Installable filename | `ghost-research-pro.zip` |
| Size / entries | 43,482 bytes / 17 regular files |
| SHA-256 | `c9691d9a5c3d57224f3b899aae02e40dd3aafb77e48ff14341ede8a8b3426743` |
| Official download | [v0.2.0 theme ZIP](https://github.com/henryxu1008/ghost-research-pro/releases/download/v0.2.0/ghost-research-pro.zip) |

The prior 43,482-byte development preview contained version **0.1.0** and SHA
`f590bd502fa69c1e4a364c7a3ec1aad8d0c2c48a50962dffaed5a2e90c6ac808`.
Equal byte sizes do not mean equal builds. The released v0.1.0 ZIP is **40,181
bytes**, SHA `a8f0f6642c2a747cc06ac48b4781f1861a4b668ef1464d3463d10f23f11ee5ac`.
Neither older package is the 0.2.0 asset.

### Complete ZIP inventory

| Path | Bytes |
| --- | ---: |
| `LICENSE` | 1,068 |
| `assets/css/screen.css` | 11,269 |
| `assets/js/accessibility.js` | 13,933 |
| `assets/js/brand.js` | 1,275 |
| `author.hbs` | 538 |
| `custom-membership.hbs` | 1,938 |
| `default.hbs` | 1,397 |
| `error.hbs` | 143 |
| `index.hbs` | 2,578 |
| `library.hbs` | 867 |
| `package.json` | 2,268 |
| `page.hbs` | 369 |
| `partials/access-badge.hbs` | 274 |
| `partials/card.hbs` | 617 |
| `partials/library-nav.hbs` | 825 |
| `post.hbs` | 1,866 |
| `tag.hbs` | 455 |

The deterministic stored ZIP has fixed timestamps/modes and sorted paths. Docs,
tests, screenshots, routing examples, dependencies, Portal/search bundles,
credentials and demo databases are excluded. Installing a theme and importing
fictional demonstration content are separate operations; no posts, members,
Pages, routes or settings are imported by this ZIP.

## Validation and support boundary

The exact support target remains **Ghost 6.73.0 / Node 24.22.1 / stock Portal
2.72.11**. **Ghost 5.130.6 / Node 22.23.4 / Portal 2.51.5** is compatibility CI,
not an expanded formal support promise or a guarantee for every 5.x/6.x version.

The unchanged implementation baseline is [PR18 head c18e72e](https://github.com/henryxu1008/ghost-research-pro/commit/c18e72e45700c03a1b7986a8e397d2ce64447325),
[CI 41192411978](https://github.com/henryxu1008/ghost-research-pro/actions/runs/41192411978):
validate success; Ghost 6 **141 PASS / 1 FAIL / 0 SKIP**; Ghost 5 **139 PASS / 3
FAIL / 0 SKIP**. All four new real runtime checks pass in both profiles. The
0.2.0 version-metadata build is independently revalidated; its exact PR-head and
merge-main CI outcomes are recorded in the Release, without rebranding old red
tests as green.

Focused RED/GREEN evidence is **8 FAIL** on untouched main `b8253801`, then **8
PASS** with the implementation. Prior local selected real-Ghost acceptance is
15 PASS per pinned profile, including native Admin control DOM, UI-originated
save responses and refresh persistence. Real native search covers repeated
keyboard opening/Escape/focus return, a Chinese title older than the homepage's
12 cards, a long no-match query and actual public search-index payloads without
restricted bodies, draft titles or private fields. These are not API/UI success
mocks. The full matrix retains every strict Portal assertion. See the
[implementation evidence](engineering/research-publishing.md) for precise methods.

CI serves unmodified official **Sodo Search 1.9.6** in both profiles; Ghost 5's
default CDN release line is **1.8**, so that older default search bundle is not
claimed as tested. This is test configuration, not a theme-bundled search upgrade.
Admin's remote Bunny font stylesheet uses the documented local empty-CSS fallback;
remote font appearance is not verified. Portal enhancement never expands iframe
permissions or browser security settings.

## Known limitations

1. Stock Portal can show success before an interrupted/failed comment-notification
   save fails. The intended opt-out may remain unsaved. Reopen/reload, verify the
   saved preference and explicitly retry if needed. This is an accepted upstream
   limitation, not a repair. Its strict failed check remains visible in both profiles.
2. Ghost 5 Portal additionally fails newsletter HTTP 503/429 draft/account-feedback
   recovery. These two failed checks remain visible in compatibility CI.
3. The development-tool audit retains **0 critical / 3 known high / 3 moderate**
   nodes. This is not a clean-audit claim; dependencies are outside the theme ZIP.
   See [dependency security](engineering/dependency-security.md).
4. Stripe checkout/subscription creation, renewal, cancellation/refunds and recovery
   remain unverified. Complimentary entitlement fixtures are not real billing.
5. Full screen-reader/all-browser/WCAG conformance, remote fonts, cross-origin
   Portal enhancement and arbitrary author-card/custom-CSS color combinations are
   outside acceptance. Existing mobile sidebar density remains; no above-fold
   first-card guarantee or full mobile redesign is claimed.

## Installation and delivery checklist

1. Download the attached installation ZIP from v0.2.0, not a GitHub source archive
   or outer Actions artifact. Verify the SHA above and package version **0.2.0**.
2. Keep the installed theme download and v0.1.0 package as rollback copies. Back
   up publication content/settings/routes independently; a theme ZIP is not that backup.
3. Follow the [operator guide](user-guide.md): upload the same filename, confirm
   overwrite if appropriate, verify the active version, then reload home/report/page.
4. Save a homepage setting and Ghost brand color, refresh, and check keyboard
   Search and membership labels. Keep confidential findings out of public metadata.
5. Configure the [optional Library recipe](research-publishing-setup.md) only if
   needed; installing the theme does not create its Pages, menus or routes.
6. For release verification, retain tag → merge commit → PR head, exact CI results,
   rebuilt hash/inventory/CRCs and anonymous HTTP-200 download verification from
   the Release publication record. MIT notice remains in every installation ZIP.

This delivery channel is GitHub source/tag/Release and its installation asset.
No hosted deployment, paid-store listing, real payment or new support/refund
promise is part of version 0.2.0.
