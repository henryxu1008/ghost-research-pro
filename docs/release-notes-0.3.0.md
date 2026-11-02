# Ghost Research Pro 0.3.0

Version date: 2026-11-02. The [v0.3.0 Release record](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.3.0)
is authoritative for publication status, the exact tag/merge/PR relationship,
version-preparation CI and public download verification. Repository metadata
alone is not proof that an asset has been published. Project code is [MIT](../LICENSE).
The existing [v0.2.0](release-notes-0.2.0.md) and [v0.1.0](release-notes-0.1.0.md)
tags, assets and historical results are unchanged.

## Changes since 0.2.0

- Compact collection navigation on narrow screens, retaining every native link
  and the no-JavaScript path. Long report/card/archive titles balance without
  truncating content; unsupported CSS retains natural wrapping. Desktop branding stays.
- Consistent ordinary Page/About shell and preserved prose/wide-card controls.
  Stable root scrollbar space and native popup compensation prevent the measured
  long-page-to-short-Page shift. These changes do not modify Ghost/Portal packages.
- Up to 3 latest Research recommendations in the same primary topic. Exclude the
  current post, Briefs, mixed types and drafts; missing topic/no match renders no
  section. Only explicit public metadata/custom_excerpt is requested/rendered,
  never generated protected-body excerpts. See the [topic-first setup](research-publishing-setup.md#more-research-in-this-topic-030).
- Clearer install/configuration and fictional sample guidance. Membership benefits
  and FAQ use ordinary editable Ghost Page blocks; they are content supplied
  separately, not new backend settings or service promises in the theme ZIP.
- Ghost 6-only installation/support policy. Existing homepage controls, readable
  brand accent, default native Search, TOC and server-paginated collections remain.

## Exact installation package

| Field | Value |
| --- | --- |
| Package / version | `ghost-research-pro` / `0.3.0` |
| Installation range | `>=6.0.0 <7.0.0` |
| Filename | `ghost-research-pro.zip` |
| Size / regular files | 47,127 bytes / 18 |
| SHA256 | `1b25334abc707c12d31d6beb1659a24dec5e1c36f8bdfed2126dcc0dce28ab82` |
| Download | [v0.3.0 theme ZIP](https://github.com/henryxu1008/ghost-research-pro/releases/download/v0.3.0/ghost-research-pro.zip) |

On publication, the Release assets also include `release-manifest.json` (per-file hashes and exact
source identity) and `SHA256SUMS`. The theme ZIP includes the MIT notice but no
documentation, tests, development modules, private samples/screenshots, account
data, credentials or database. Source archives and outer CI/private handoff ZIPs
are not the installation asset. Old private0.2.0 candidates can have the same
byte size but different hashes; do not relabel them as 0.3.0.

### Complete ZIP inventory

| Path | Bytes |
| --- | ---: |
| `LICENSE` | 1,068 |
| `assets/css/screen.css` | 13,255 |
| `assets/js/accessibility.js` | 13,933 |
| `assets/js/brand.js` | 1,275 |
| `author.hbs` | 538 |
| `custom-membership.hbs` | 1,938 |
| `default.hbs` | 1,397 |
| `error.hbs` | 143 |
| `index.hbs` | 2,578 |
| `library.hbs` | 867 |
| `package.json` | 2,340 |
| `page.hbs` | 398 |
| `partials/access-badge.hbs` | 274 |
| `partials/card.hbs` | 617 |
| `partials/library-nav.hbs` | 825 |
| `partials/related-research.hbs` | 1,400 |
| `post.hbs` | 1,890 |
| `tag.hbs` | 455 |

## Support and actual acceptance boundary

Supported major: **Ghost 6**. Exact target: **6.73.0 / Node24.22.1 / official
Portal2.72.12 / Search1.9.6**. Other6.x minors, Ghost 7 and all browsers are not
individually established by that result. Ghost 7 is excluded by engine metadata.
The [support policy](support-policy.md) records the approved retirement of EOL
Ghost 5; it is not a repair or conversion of its old failures.

Implementation baseline [PR20](https://github.com/henryxu1008/ghost-research-pro/pull/20),
merge `ed5f01717a093f49865f85ced9f76151775719a0`, has actual
[main CI41409048656](https://github.com/henryxu1008/ghost-research-pro/actions/runs/41409048656):
Validate success and Ghost 6 **142 PASS /0 FAIL /0 SKIP**. Those are baseline
results, not a prefilled 0.3.0 rerun. The version-preparation PR and exact release
merge CI are linked in the Release record. Full Ghost 6 assertions, timeouts,
failure probes and warning/error gates remain required; no skip/allow-failure
conversion is introduced. Source/ZIP GScan targets the supported Ghost 6 only.

Historical Ghost 5/Portal2.51.5 remains **139 PASS /3 FAIL /0 SKIP** for newsletter
HTTP503/429 and aborted-comment feedback. The unsuccessful official-newer-Portal
experiments also remain failed. No Portal fork/backport is shipped. The theme
does not upgrade an existing site's Ghost or independently loaded Portal; inspect
the actual loaded versions. See the [retained investigation](engineering/ghost5-portal-compatibility.md).

## Installation and limits

Use the [installation guide](user-guide.md). The ZIP does not import content,
routes, navigation, homepage/brand settings, users or membership/payment setup.
Merge optional Library routes carefully and configure menus separately. Private
HarborCloud v3/v4 samples remain separately delivered historical snapshots; the
public Release contains neither those samples nor their old candidate ZIPs.

There is no public hosted demo or website deployment in this release process.
Complimentary/free membership fixtures verify access and UI, not Stripe checkout,
renewal, cancellation/refunds or payment-failure recovery. No real charge, mail
delivery, price, support SLA, customer result or validated willingness to pay is
claimed. Remote fonts, cross-origin Portal enhancement, comprehensive browser/
screen-reader coverage and full WCAG certification remain unverified. The audit
still has 0 critical /3 known high /3 moderate development nodes; it is not claimed clean.
