# Research publishing experience — bounded extension

This batch extends the content-discovery decision recorded in the separate
[PR14 PRD](https://github.com/henryxu1008/ghost-research-pro/blob/5fcec3162be2fff50383d3541b55d511250567d8/docs/product/prd.md).
It implements the owner's subsequent request for an identifiable research desk,
native topic/format/year browsing and a practical setup path. The candidate documentation now integrates and updates the [product contract](../product/prd.md) and [design specification](../product/design-spec.md) from that parallel branch. No market-validation,
pricing, licensing or release-readiness gate is marked complete.

| Surface | Data and boundary |
| --- | --- |
| Home selection | Server `get posts`, `featured:true`, newest first, limit 1; title/custom excerpt/date/tag/access only. No generated “results” or private HTML. |
| Latest / Library | Native collection/channel `posts` and `pagination`, not a client filter or a 100-item catalogue query. The channel does not change permalinks. |
| Formats | Two existing editorial slug conventions: `research`, `brief`; tags/counts read server-side, limit 2. No claim to discover arbitrary format names. |
| Topics and year menu | Native secondary navigation, curated by the operator. Each link opens a full tag archive or configured dated channel. No all-site facets or keyword search. |
| Year channel | Native `published_at` date-only lower/upper bounds. UTC January 1 inclusive, following January 1 exclusive; fixed example years require annual configuration. |
| Report metadata | Native published/updated timestamps, authors and `visibility`; reading time only with access. A policy badge is not the visitor's entitlement or a payment test. |

The date-only filter form matters: a first real-Ghost preview probe found that
full ISO strings could omit the first-day-midnight SQLite row. The corrected
range includes both first-day and final-second examples and excludes the next
year. The runtime regression uses real API-published boundary fixtures, traverses
all channel pages and checks old work outside page 1. It also verifies the
featured protected-post metadata and existing post URLs.

Real API publication also exposed a Windows/non-UTC SQLite-driver distinction:
the stored date can use local time while the public timestamp is rendered in
UTC. The isolated runtime and local candidate explicitly use `TZ=UTC`; CI records
the same condition. No OS or account timezone is changed. The setup guide requires
boundary verification before year links are enabled on another hosting setup.

Template fixtures use the actual Handlebars templates/CSS in Chromium. Their
fictional contexts verify selection/empty behavior, four visibility labels,
metadata, heading contexts and 320/768/1280px reflow with 16/32px text. They are not
real Ghost pagination or visual acceptance. The disposable Ghost matrix supplies
those server-side checks, using enough data to require several pages and no
client JavaScript for navigation. Existing TOC, Portal keyboard, membership and
packaging checks remain enabled, including the known upstream failure gates.

The ZIP allowlist is unchanged: runtime templates, assets, partials and package
metadata only. Routing examples, demo recipes/data, tests, screenshots, reports
and development dependencies stay outside it. No Portal bundle or third-party
asset was introduced into the release payload.

The [operator setup](../research-publishing-setup.md) is authoritative for the new
configuration steps; the base [demo recipe](../demo-content.md) is reused rather
than replaced. Final independent desktop/narrow screenshot and interaction
acceptance must identify its exact candidate commit. Automated fixtures and HTTP
responses do not substitute for that review.

## Unreleased publisher settings, brand color and native search

The next build adds four `config.custom` homepage fields only: `hero_title`,
`hero_description`, `hero_signup_label` and `show_editor_selection` (default on).
Missing/empty text falls back to the previous content. Plain Handlebars escaping
keeps text out of HTML; the signup label is used only for anonymous open signup.
Account, sign-in and paid-only plan labels retain the existing membership rules.
Selection off removes its whole grid column, including the reading-guide fallback;
selection on without a Featured post still uses that existing guide.

`brand.js` reads Ghost's escaped hex accent attribute before the body renders.
It preserves readable colors and darkens other RGB colors in 0.005 scale steps
until the unrounded WCAG ratio is at least 4.5:1 against both `#fff` and `#f5f8fc`.
This same dark tone supplies links, white-label buttons and focus outlines.
Invalid/missing values and unavailable JavaScript retain the original safe theme
blue. Existing native button/upgrade-card rules and the accessible Portal adapter
consume that tone. Portal's button color transition is disabled: a real Ghost
probe found that interpolation from its bright original inline background briefly
  left white labels unreadable. Native hover/focus opacity reductions are also
  suppressed on these themed actions so they cannot dilute the safe contrast.
  Portal source, version and iframe permission
boundaries are unchanged. Author-selected card colors and arbitrary custom CSS
are outside this default-palette guarantee.

The header's named Search link uses `data-ghost-search` and `#/search`, with the
existing `ghost_head` intact. Native search was already reachable by a manually
configured Navigation URL in v0.1.0; this change supplies its default visible entry.
There is no theme global shortcut or search index. Tests serve unmodified official
Sodo Search **1.9.6** JS/CSS from the locked development package and connect it to
actual disposable Ghost search-index APIs. This exact search version is used in
both matrix profiles (Ghost 5's default CDN line is 1.8); it is test configuration,
not a production Ghost/Portal upgrade. No search/Portal bundle, private index,
fixture, screenshot or development dependency directory enters the theme ZIP.

Local evidence on 2026-10-31:

- Focused tests copied into an untouched `b8253801ccf0864d856c1b8368bca4d32ef5a03c`
  export give **0 PASS / 8 FAIL / 0 SKIP** before implementation; the final
  `test:publisher` suite gives **8 PASS / 0 FAIL / 0 SKIP**.
  These cover defaults, escaped text, all CTA policy branches, selection off/empty,
  native entry, light/dark/invalid colors, native action contrast and the Portal
  transition regression. Template/browser fixtures are distinguished from the
  genuine Ghost acceptance below.
- A fresh Ghost **6.73.0 / Node 24.22.1 / Portal 2.72.11**, with ports **2468/2626**
  and an independent SQLite database, passed **15 publisher-only runtime checks**.
  This includes existing full collection/year boundaries, real API save/reload,
  native Admin homepage/brand save/reload, real native-card/Portal contrast and
  native search. Original services, databases and browser sessions were not used.
- Native search was keyboard-opened/Escape-closed with focus return three times;
  it found a Chinese-titled 2020 article absent from the homepage's 12 cards,
  handled a long Chinese no-match query, and found a protected title. Actual API
  response checks exclude restricted body markers, protected search excerpts,
  draft titles and private fields. API/UI successes are not mocked. Unrelated
  outbound browser resources are blocked; Admin's Bunny font stylesheet receives
  the same local empty-CSS fallback as existing Admin acceptance, so remote font
  appearance is not verified.
- Genuine desktop, 390×844 and 320px enlarged-text screenshots were captured;
  desktop, 390px and native search images were visually inspected. In the 390×844,
  16px-text fixture with an intentionally long escaped heading and selection off,
  the first card starts at **1036.28px**. This is a measurement of that fixture,
  not a before/after comparison with the separate audit's unconfirmed viewport,
  nor a promise that every first card is above the fold. Sidebar density remains
  part of the existing layout; no full mobile redesign is included.
- The combined local focused/publishing/layout/contrast/TOC/Portal-focus/security/
  packaging run gives **54 PASS / 0 FAIL / 1 SKIP**. The sole skip is the existing
  Windows symlink-fixture restriction; Linux CI must execute that negative case.
  Source and ZIP GScan each have **0 errors / 0 warnings** for Ghost 5 and 6.
  The audit gate passes with **0 critical / 3 known high / 3 moderate** nodes;
  this is not a clean-audit claim. Two builds have identical bytes. The new
  43,482-byte preview ZIP's SHA-256 is
  `f590bd502fa69c1e4a364c7a3ec1aad8d0c2c48a50962dffaed5a2e90c6ac808`;
  it is separate from the immutable published v0.1.0 asset.

Run the focused browser suite with `npm run test:publisher`. For genuine selected
acceptance, prepare a **fresh** pinned Ghost runtime and ZIP as described in the
README, then run `node tests/runtime/acceptance.cjs --publisher-only`; optional
`GHOST_TEST_PORT` and `GHOST_TEST_SMTP_PORT` choose independent loopback ports.
The default CI command still runs the complete strict suite, including previously
red Portal checks. Local selected acceptance is not a full matrix pass. Ghost 5
and both complete Linux profiles must be read from the exact PR HEAD's CI result.
The accepted baseline is [main run 41185102703](https://github.com/henryxu1008/ghost-research-pro/actions/runs/41185102703):
validate passes, Ghost 6 has 137 PASS / 1 FAIL, Ghost 5 has 135 PASS / 3 FAIL;
comment-notification false-success feedback affects both, with additional Ghost 5
newsletter HTTP 503/429 recovery failures. New failures remain strict and must
be investigated separately.
