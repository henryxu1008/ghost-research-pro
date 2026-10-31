# Research publishing component and responsive specification

Source-derived candidate specification, 2026-10-30, PR16 baseline `993b4e25` plus
PR17's native heading-font fix. Both `.card h2` and `.card h3` now explicitly use
Ghost's heading-font variable; actual-template fixtures verify the same family,
24px size, 700 weight and 30px line height across home/tag/author/library.
This updates [PR14's earlier snapshot](https://github.com/henryxu1008/ghost-research-pro/blob/5fcec3162be2fff50383d3541b55d511250567d8/docs/product/design-spec.md).
It describes the existing implementation; it is not a new Figma file, complete
assistive-technology audit or commercial approval.

## Palette and typography

[CSS](../../assets/css/screen.css) is authoritative. Light only:

| Token / control | Value |
| --- | --- |
| Ink | `#162238` |
| Muted text | `#58657a` |
| Border | `#dce3ed` |
| Accent | `#174e8b` |
| Background / panel | `#fff` / `#f5f8fc` |
| Link, button and overflow-region focus | 3px solid accent, offset 3px |
| Body | Ghost body-font variable; system fallback; 16px / 1.7 |
| Headings | Ghost heading-font variable; Georgia fallback |

The accent focus color has 8.40:1 contrast on white and 7.89:1 on the panel.
The earlier amber focus ring is no longer used. Ghost's publication accent is
not mapped to this palette; changing it alone does not recolor the theme.
Configured remote fonts are outside offline font-appearance acceptance.

## Layout and responsive behavior

The centered wrap is `min(1120px, calc(100% - 40px))`; reports have a 790px
reading maximum. Header branding and actions wrap as whole controls. At or below
1300px the navigation receives its own row, preserving account-action width.
At or below 800px the base card/membership grids collapse to one column.
There is no hamburger overlay. Existing native navigation links remain visible.

The homepage has an editorial introduction and selection, followed by latest
work with a 220px research sidebar. At or below 950px the editorial hero and
sidebar/results layout stack, with a two-column sidebar. Library result cards
remain two columns through that breakpoint and collapse at or below 600px,
alongside the sidebar and report metadata. Long headings/labels wrap; tables and code scroll inside
their own reading region. Enlarged-text reflow is covered by focused fixtures,
not an assurance for arbitrary publisher content or custom CSS.

## Components and data

| Component | Data, hierarchy and state |
| --- | --- |
| [Shell](../../default.hbs) | Logo/title, primary navigation, signup-policy-aware account actions, skip link and focusable main landmark. Secondary navigation is rendered in the research sidebar. |
| [Home](../../index.hbs) | H1 publication identity; latest real Featured post or reading introduction. Latest section has H2 and its cards/sidebar sections use H3. Only public-safe metadata is printed for protected selections. |
| [Card](../../partials/card.hbs) | Primary tag, access-policy badge, public custom/generated excerpt, date, entitled reading time and author byline. H2 by default; H3 below the homepage's H2. No thumbnail. |
| [Library](../../library.hbs) | Metadata Page title/excerpt, actual total/page count, complete native pagination, result cards and empty message. Page editor body is intentionally not rendered. |
| [Sidebar](../../partials/library-nav.hbs) | Existing `research`/`brief` tag counts plus curated secondary-navigation topic/year links. No fake current-page filter or private content index. |
| [Report](../../post.hbs) | H1/title, optional safe excerpt, authors, published/updated timestamps and access policy; reading time with access, optional feature image, TOC and Ghost-authorized body. |
| [Tag](../../tag.hbs) / [author](../../author.hbs) | Identity/description or biography, H2 cards and native pagination. |
| [Page](../../page.hbs) / [Membership](../../custom-membership.hbs) | Ordinary editable page visibility; Membership uses native Portal actions without theme-owned prices or billing. |

Access labels describe content policy, not a visitor's payment status. Updated
timestamps do not certify substantive revisions. Excerpts/tags/images are public
metadata; confidentiality depends on safe editorial metadata and Ghost body
authorization, not the presence of a badge.

## Keyboard and empty states

The [accessibility adapter](../../assets/js/accessibility.js) builds the TOC only
from visible authorized H2/H3, preserves authored anchors and focuses navigation
targets. Empty TOCs stay hidden. It enhances overflowing reading regions and
accessible native Portal frames; native actions and stock bundle bytes remain
unchanged. Tab boundaries follow positive tabindex order before ordinary controls;
Escape, close, trigger restoration and repeated opening have focused regressions.
Inaccessible/removed frames have cleanup checks; cross-origin Portal support is
not blanket-certified.

The home latest list and Library have explicit empty messages. No Featured
selection gets a reading introduction. Empty secondary navigation is omitted;
absent logo uses the publication name. Without the optional routes/Pages, home,
tag and author pages still work. JavaScript is not needed for complete native
collection pagination, but enhanced TOC/Portal interactions depend on it.

## Review boundary

Exact-payload CI and local installation evidence are summarized in the
[candidate handoff](../candidate-delivery.md). Independent review reported no
P0/P1/P2 across 21 captured screens; screenshots remain on the local computer
and are not included here. This does not clear stock Portal recovery failures,
full screen-reader/alternative-browser coverage, arbitrary palettes, billing or
licensing. The older PR14 amber-focus, absent-byline/secondary-menu and single
breakpoint descriptions are superseded by this source-derived specification.
