# Release licensing inventory

Updated 2026-10-30 after the owner selected standard MIT. The actual [LICENSE](../../LICENSE) now matches `package.json`; its permissions include commercial use, modification, redistribution, sublicensing and sale subject to retaining the copyright/permission notice. Candidate-quality gates do not add restrictions to MIT. No merge, Release, sale or deployment has been performed by this licensing change.

## Actual theme ZIP

The current [PR17](https://github.com/henryxu1008/ghost-research-pro/pull/17) licensed ZIP is **40,023 bytes /16 files**, SHA-256 `6264dc52d249bdb3348fbd4b5e2eb748ff30524d389b0a29d6b4a50ff62dee55`. The 15 previous runtime files are byte-identical to the 38,865-byte `cd6dd6b3…a2d706` font-fix ZIP; only `LICENSE` is added. Its 16 regular files match source; exact head/run is recorded in the PR and handoff manifest. Existing2380 still runs the previous15-file deployment, not this new licensed ZIP. Older PR16/e515558f and12-file inventories remain historical evidence.

| Included files | Source / license evidence | Notice status |
| --- | --- | --- |
| `author.hbs`, `custom-membership.hbs`, `default.hbs`, `error.hbs`, `index.hbs`, `library.hbs`, `page.hbs`, `post.hbs`, `tag.hbs`, `partials/access-badge.hbs`, `partials/card.hbs`, `partials/library-nav.hbs` | Repository scaffold and research-publishing extensions; [UPSTREAM.md](UPSTREAM.md) records implementation informed by Ghost's specification and Starter. Files were introduced individually here. | Project MIT applies; no vendored third-party file/header requiring an additional notice identified. Provenance evidence is described below, not independent title certification. |
| `assets/css/screen.css` | Repository styles; system font stacks, Georgia and Ghost font variables. No `@font-face`, imported stylesheet, embedded font or image URL. | No font files or third-party CSS bundle shipped. |
| `assets/js/accessibility.js` | Repository visible-content TOC, scroll-region and Portal accessibility adapter, introduced in `f9cd97d` and refined through PR16. No vendored library, SVG path data or external script URL. | No third-party script bundle identified. Its selectors operate on Ghost/Portal runtime controls; no Portal bundle is shipped. |
| `package.json` | Project metadata, including `license: "MIT"` and development dependency names/versions. | Matches the selected/included MIT text. Dependency names are not copies of their packages. |
| `LICENSE` | Standard [SPDX MIT text](https://spdx.org/licenses/MIT.html), changing only the copyright placeholder to `Copyright (c) 2026 henryxu1008`. SPDX data blob `065ce2195eabd0586a961768dc8998aacc02d547`; file SHA256 `acde45d4ca77203c15ba27d4887abd9c23c1e51a7bf2639ba1fe5ecd9d1ee996`. | Complete 1,068-byte text included byte for byte. No resale/redistribution ban or additional clause. Root LICENSE/NOTICE checkout bytes are fixed to LF. |

There are **no font, image, icon, video or audio files** in the archive. Template logo/feature-image URLs and post content come from the publication. CSS font names do not bundle their font binaries; Ghost's configured font variables may select other runtime resources. `ghost_head`, `ghost_foot` and `card_assets` allow Ghost to provide its own assets, including Portal/card scripts and icons. Those resources are outside this ZIP inventory. Publication names, logos, uploaded media, external embeds and configured fonts require their own provenance review; no commercial or trademark permission is inferred here.

## Starter reference and notice handling

Read the official [TryGhost/Starter LICENSE at `99df4c9466d54fe23191109a0019572819ed3481`](https://github.com/TryGhost/Starter/blob/99df4c9466d54fe23191109a0019572819ed3481/LICENSE): MIT text, copyright `(c) 2013-2026 Ghost Foundation`. Its notice condition requires preserving the copyright and permission notice in copies or substantial portions. The repository's existing attribution is retained and pinned in [UPSTREAM.md](UPSTREAM.md).

No copied Starter file or other third-party payload requiring a newly inserted notice was identified in this inspection. The existing Starter attribution/reference above is retained; no Ghost Foundation copyright is reassigned or third-party content relicensed. If upstream code/assets are later copied, retain their exact applicable notices. The packager preserves existing regular LICENSE/NOTICE byte for byte and generates nothing when absent. A fixture verifies inclusion/hash changes, baseline restoration and directory rejection. No additional NOTICE was fabricated for this original payload.

## Copyright attribution basis

The verified repository is `henryxu1008/ghost-research-pro`, repository ID1436793817, owner userID6007227. The older `qq550723504/ghost-research-pro` URL resolves to the same repository/account; package author metadata retains that historical handle. [Early theme introduction195d4a9](https://github.com/henryxu1008/ghost-research-pro/commit/195d4a998b5d2d61e6498365ebd80d312f9527b6) is attributed by GitHub to `henryxu1008`, ID6007227, dated2026-10-28. Git history shows the project began in2026; early local author labels include `wei xu`, later `Henry`. The copyright notice uses the verified current account handle, not an inferred company/legal name. This records repository provenance; it is not an independent legal ownership adjudication or a license for publication content/third-party assets.

## Development / CI material excluded from the ZIP

Inspected the locked installed package metadata and available license files. This direct-dependency summary is not a full transitive license audit.

| Package | Version | Declared license / inspected material |
| --- | --- | --- |
| `@tryghost/portal` | 2.72.11 | MIT; `LICENSE` present |
| `portal-ghost5` (npm alias for `@tryghost/portal`) | 2.51.5 | Metadata declares MIT; this npm package has no `LICENSE` file. Resolve the version's original notice if redistributing that fixture. |
| `axe-core` | 4.14.0 | MPL-2.0; `LICENSE` and `LICENSE-3RD-PARTY.txt` present |
| `gscan` | 6.6.1 | MIT; `LICENSE` present |
| `mailparser` | 3.12.4 | MIT; `LICENSE` present |
| `playwright` | 1.64.1 | Apache-2.0; `LICENSE` and `NOTICE` present |

`node_modules`, the lockfile, test scripts, Playwright browsers and downloaded Ghost installations are absent from the theme ZIP. The scoped Handlebars 4.7.10 compiler (MIT) and extract-zip 2.0.1 (BSD-2-Clause) are also development toolchain dependencies, not bundled theme scripts. The locally generated SVG chart, text download and embed used by `tests/runtime/editor-cards.cjs` are created in disposable Ghost content directories and are not distributed in the ZIP. CI screenshots show that runtime environment, not an expanded theme payload.

## Recorded choice and remaining boundaries

- The owner explicitly selected MIT; root text, metadata and archive inclusion now agree. No license-direction question remains pending from [issue #8](https://github.com/henryxu1008/ghost-research-pro/issues/8); this document does not close that issue or authorize publication.
- Standard MIT permissions are not limited by an evaluation-candidate label. Functional readiness, future service pricing and marketplace eligibility are separate from the license; no unsupported commercial-readiness claim is made.
- Inventory any later demo/customer media, fonts, logos or vendored code separately, with exact source/version and applicable notices. The current absence of bundled third-party media does not approve future assets.

This follow-up adds the actual owner-selected MIT grant and LF checkout rules; runtime logic/asset bytes are unchanged. Product/research documents, route examples, tests, screenshots, synthetic data and local receipts remain outside the installable ZIP. Use exact-head CI for this 16-file package; old preview/buyer/visual evidence is not a new licensed-ZIP installation pass.
