# Release licensing inventory

Updated 2026-10-30 for the PR16 candidate payload. This records files and unresolved decisions; it does not select a project license, grant buyer rights or clear commercial distribution.

## Actual theme ZIP

Inspected the exact [PR16](https://github.com/henryxu1008/ghost-research-pro/pull/16) payload `993b4e25bd3d9aa227041b74f3e44bc3875c8054`, also built by [CI41011050241](https://github.com/henryxu1008/ghost-research-pro/actions/runs/41011050241). The inner `ghost-research-pro.zip` is 38,856 bytes; SHA-256 `e515558fdb7eb35cb27f9f85b28d5a5bbe8e2b9e24d8fe6bb31413de3a73cb5f`. Its 15 regular files match source byte for byte. The older 12-file inventory is historical; the table below covers all current files.

| Included files | Source / license evidence | Notice status |
| --- | --- | --- |
| `author.hbs`, `custom-membership.hbs`, `default.hbs`, `error.hbs`, `index.hbs`, `library.hbs`, `page.hbs`, `post.hbs`, `tag.hbs`, `partials/access-badge.hbs`, `partials/card.hbs`, `partials/library-nav.hbs` | Repository scaffold and research-publishing extensions; [UPSTREAM.md](UPSTREAM.md) records implementation informed by Ghost's specification and Starter. Files were introduced individually here. | No vendored third-party file or license header identified. Authorship is repository provenance, not independently certified ownership. Project license remains unresolved. |
| `assets/css/screen.css` | Repository styles; system font stacks, Georgia and Ghost font variables. No `@font-face`, imported stylesheet, embedded font or image URL. | No font files or third-party CSS bundle shipped. |
| `assets/js/accessibility.js` | Repository visible-content TOC, scroll-region and Portal accessibility adapter, introduced in `f9cd97d` and refined through PR16. No vendored library, SVG path data or external script URL. | No third-party script bundle identified. Its selectors operate on Ghost/Portal runtime controls; no Portal bundle is shipped. |
| `package.json` | Project metadata, including `license: "MIT"` and names/versions of development dependencies. | Metadata declaration conflicts with the still-open project licensing decision; no `LICENSE`, `COPYING` or `NOTICE` file is present. Dependency names in metadata are not copies of those packages. |

There are **no font, image, icon, video or audio files** in the archive. Template logo/feature-image URLs and post content come from the publication. CSS font names do not bundle their font binaries; Ghost's configured font variables may select other runtime resources. `ghost_head`, `ghost_foot` and `card_assets` allow Ghost to provide its own assets, including Portal/card scripts and icons. Those resources are outside this ZIP inventory. Publication names, logos, uploaded media, external embeds and configured fonts require their own provenance review; no commercial or trademark permission is inferred here.

## Starter reference and notice handling

Read the official [TryGhost/Starter LICENSE at `99df4c9466d54fe23191109a0019572819ed3481`](https://github.com/TryGhost/Starter/blob/99df4c9466d54fe23191109a0019572819ed3481/LICENSE): MIT text, copyright `(c) 2013-2026 Ghost Foundation`. Its notice condition requires preserving the copyright and permission notice in copies or substantial portions. The repository's existing attribution is retained and pinned in [UPSTREAM.md](UPSTREAM.md).

No copied Starter file or other third-party payload requiring a newly inserted notice was identified in this inspection. This does not settle derivation or project ownership. If upstream code/assets are later copied, retain the exact applicable notices and include them in the distribution. The current explicit packaging allowlist does **not** include a future root `LICENSE` or `NOTICE` automatically; packaging must be reconciled with the eventual decision before release.

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

## Decisions still required before release

- The owner must resolve the `package.json` MIT declaration against README and [issue #8](https://github.com/qq550723504/ghost-research-pro/issues/8), which still require an explicit project-license decision. No project license text or grant is added by this inventory; metadata is unchanged.
- Confirm authorship/derivation and the intended project license, then supply its actual text and reconcile package metadata, documentation and archive inclusion.
- Inventory any later demo/customer media, fonts, logos or vendored code separately, with exact source/version and applicable notices. The current absence of bundled third-party media does not approve future assets.

This documentation integration leaves all 15 payload files and the packager unchanged. Product/research documents, route examples, tests, screenshots, synthetic data and local receipts are outside the installable ZIP. Runtime evidence remains tied to the exact payload commit above; newer documentation CI is identified separately in its PR.
