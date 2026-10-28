# Scrollable content contrast review

Reviewed on 2026-10-28 using the actual Ghost 5.130.6 and 6.73.0 fixtures at 360px and 1440px. Evidence was captured at commit `3425edb6f737dd9d4059f9bba4cc88b7ea3c1e34`, [workflow 40737172209](https://github.com/qq550723504/ghost-research-pro/actions/runs/40737172209). That workflow intentionally exposed three failing Portal cleanup boundaries per profile; its contrast probes passed. It is evidence for this review, not a claim that the full workflow passed.

## Targets and measurements

Each profile's raw `accessibility.json` contains two `color-contrast` incomplete entries, `editor-cards-360` and `editor-cards-1440`, targeting `caption`, `th[scope="col"]:nth-child(2)` and `td` in the horizontally clipped table. These are manual-review findings, not automated passes.

`contrast-review.json` records computed colors and the full ancestor background chain for 12 text samples at each width: table caption, all column/row headings and cells, code, ordinary body text and five image/gallery captions. Both Ghost profiles produced the same values:

| Text | Foreground | Effective background | Size / weight | Unrounded ratio |
| --- | --- | --- | --- | --- |
| Table caption, headings, cell and body control | `#162238` | `#ffffff` | 17.6px / 400 or 700 | 15.908725001019427:1 |
| Code control | `#162238` | `#f5f8fc` | 17.6px / 400 | 14.935346727522692:1 |
| Image/gallery captions | `#58657a` | `#ffffff` | 13.6px / 400 | 5.903118508518366:1 |

The recorded ancestors have opacity 1, no background image, no filter and normal blending. Transparent layers resolve to the solid backgrounds above. The calculation follows [WCAG relative luminance](https://www.w3.org/TR/WCAG22/#dfn-relative-luminance). Every sample exceeds the conservative [4.5:1 normal-text threshold](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html); no threshold rounding or large-text exception is used. Three calculation tests include black/white 21:1, near-threshold gray and alpha compositing.

## Visual review

Inspected all 24 region screenshots: table and code, both widths, start/middle/end, both Ghost profiles. The visible caption, headings, cell and code text remain dark and readable on uniform light backgrounds at each position. Long content is clipped at the scroll viewport edge and becomes visible by horizontal scrolling; the recorded ArrowRight checks verify keyboard movement. No overlapping layer, gradient or image alters the text/background pairs. The adjacent ordinary body text and image/gallery captions were also checked in the full editor-card captures.

Artifacts are `ghost-runtime-ghost5` and `ghost-runtime-ghost6`, containing `contrast-review.json`, `accessibility.json`, `editor-cards-{width}.png` and `contrast-{table,pre}-{width}-{start,middle,end}.png`. Scroll positions and dimensions are recorded with the measurements so the captures can be reproduced. The test waits for scrolling to settle before capturing.

This closes the current four incomplete contrast entries by separate measurement and visual review for the default fixture palette. The raw axe entries remain incomplete and visible. No theme color change was needed. This does not establish full WCAG conformance, screen-reader support, every content/background combination or custom palette compliance. Changing colors or rendering styles requires a new review.
