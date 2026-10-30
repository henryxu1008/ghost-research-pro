# Release licensing inventory

Updated 2026-10-30 for the PR17 font-fix candidate payload. This records files and unresolved decisions; it does not select a project license, grant buyer rights or clear commercial distribution.

## Actual theme ZIP

The current [PR17](https://github.com/henryxu1008/ghost-research-pro/pull/17) font-fix ZIP is 38,865 bytes; SHA-256 `cd6dd6b32ab384b96bc7eb0b888b27369cd2ba98878cc3d02c200e6ce5a2d706`. Its 15 regular files match the source checkout byte for byte; the exact candidate head/run is recorded in its PR and handoff manifest. PR16's 38,856-byte `e515558f…cb5f` ZIP and the older 12-file inventory are historical. The current file list below is unchanged; the font fix changes only `screen.css` in the runtime payload.

| Included files | Source / license evidence | Notice status |
| --- | --- | --- |
| `author.hbs`, `custom-membership.hbs`, `default.hbs`, `error.hbs`, `index.hbs`, `library.hbs`, `page.hbs`, `post.hbs`, `tag.hbs`, `partials/access-badge.hbs`, `partials/card.hbs`, `partials/library-nav.hbs` | Repository scaffold and research-publishing extensions; [UPSTREAM.md](UPSTREAM.md) records implementation informed by Ghost's specification and Starter. Files were introduced individually here. | No vendored third-party file or license header identified. Authorship is repository provenance, not independently certified ownership. Project license remains unresolved. |
| `assets/css/screen.css` | Repository styles; system font stacks, Georgia and Ghost font variables. No `@font-face`, imported stylesheet, embedded font or image URL. | No font files or third-party CSS bundle shipped. |
| `assets/js/accessibility.js` | Repository visible-content TOC, scroll-region and Portal accessibility adapter, introduced in `f9cd97d` and refined through PR16. No vendored library, SVG path data or external script URL. | No third-party script bundle identified. Its selectors operate on Ghost/Portal runtime controls; no Portal bundle is shipped. |
| `package.json` | Project metadata, including `license: "MIT"` and names/versions of development dependencies. | Metadata declaration conflicts with the still-open project licensing decision; no `LICENSE`, `COPYING` or `NOTICE` file is present. Dependency names in metadata are not copies of those packages. |

There are **no font, image, icon, video or audio files** in the archive. Template logo/feature-image URLs and post content come from the publication. CSS font names do not bundle their font binaries; Ghost's configured font variables may select other runtime resources. `ghost_head`, `ghost_foot` and `card_assets` allow Ghost to provide its own assets, including Portal/card scripts and icons. Those resources are outside this ZIP inventory. Publication names, logos, uploaded media, external embeds and configured fonts require their own provenance review; no commercial or trademark permission is inferred here.

## Starter reference and notice handling

Read the official [TryGhost/Starter LICENSE at `99df4c9466d54fe23191109a0019572819ed3481`](https://github.com/TryGhost/Starter/blob/99df4c9466d54fe23191109a0019572819ed3481/LICENSE): MIT text, copyright `(c) 2013-2026 Ghost Foundation`. Its notice condition requires preserving the copyright and permission notice in copies or substantial portions. The repository's existing attribution is retained and pinned in [UPSTREAM.md](UPSTREAM.md).

No copied Starter file or other third-party payload requiring a newly inserted notice was identified in this inspection. This does not settle derivation or project ownership. If upstream code/assets are later copied, retain the exact applicable notices and include them in the distribution. The packager now includes existing regular root `LICENSE` and `NOTICE` files byte for byte; missing files are not generated. A fixture proves inclusion changes the ZIP and removal restores the baseline, and rejects a directory in place of a notice. The owner must still provide/approve the actual terms and applicable notices before distribution. Adding them requires a new manifest/hash and package validation.

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

This follow-up changes the CSS font selector and optional-notice packaging support. No actual license/notice file or new grant is added. Product/research documents, route examples, tests, screenshots, synthetic data and local receipts remain outside the installable ZIP. Use exact-head CI for this new payload, rather than transferring the previous ZIP's runtime/visual passes.
