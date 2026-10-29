# First-version component and responsive specification

**Source-derived specification · 2026-10-29 · Development preview**

[PRD and scope](prd.md) · [Operator configuration](../user-guide.md) · [Acceptance limits](../engineering/qa-checklist.md)

This records the existing implementation at code commit `248f00b9cc7a168865e645a1ac9dbe1235562e43` (later baseline `6cb531ef77778b3a5d7d043d1c5e16ee45dd11b6` changes documentation only). Repository-relative links point to the reviewed source in this branch. It supplies the reusable-component specification and dark-mode decision requested by [issue #3](https://github.com/henryxu1008/ghost-research-pro/issues/3), not a new UI implementation, Figma file, prototype, design-asset package or screenshot set. Those visual deliverables and their review remain outstanding; issue #3 is not complete.

## Palette and typography

The first version is **light only**: `color-scheme:light`; no dark toggle or dark palette. [Theme CSS](../../assets/css/screen.css) is authoritative.

| Token / role | Existing value |
| --- | --- |
| `--ink` / primary text | `#162238` |
| `--muted` / secondary text | `#58657a` |
| `--border` / outlines and dividers | `#dce3ed` |
| `--accent` / theme links and primary actions | `#174e8b` |
| `--bg` / page background | `#fff` |
| `--panel` / cards, TOC, code and callouts | `#f5f8fc` |
| Theme link focus ring | `3px solid #f59e0b`, offset `3px` |

Ghost's publication accent setting is **not mapped** to `--accent`. Theme buttons/links and the explicitly styled `.kg-btn` and `.gh-post-upgrade-cta .gh-btn` controls use the theme accent. The [accessibility adapter](../../assets/js/accessibility.js) reads that CSS value (fallback `#174e8b`) and, when it can access the Portal iframe, sets its `--brandcolor` and selected controls/focus styling. An inaccessible iframe is left to its native behavior; this is not a universal override of every Ghost or third-party control. Publisher-injected CSS can change values, but arbitrary palettes are not a supported or contrast-accepted first-version feature.

| Text role | CSS size / weight / line-height |
| --- | --- |
| Body | `16px`, normal, `1.7`; `--gh-font-body` or system sans-serif fallback |
| Hero, archive and report H1 | `clamp(2.4rem,5vw,4.5rem)`, browser/default heading weight, `1.12`; tracking `-.035em`, margin `.2em 0` |
| Brand text | `1.3rem`, `750`; ink color, no underline |
| Lead / hero and archive summary | `1.18rem`, muted |
| Report content | `1.1rem`; `overflow-wrap:anywhere` |
| Card H3 | `1.5rem`, `700`, `1.25` |
| Eyebrow | `.75rem`, `700`, uppercase, tracking `.13em`, accent |
| Card metadata / content captions | `.83rem` / `.85rem`; muted; captions centered |

H1–H3, card headings and membership-plan headings use `--gh-font-heading` with Georgia/serif fallback. The CSS does not define a complete H2–H6 type scale; other heading sizes/margins retain browser/native-card defaults. Ghost remote-font appearance and all possible font combinations are not certified. Sizes above are CSS values, not fixed rendered pixel measurements at every user zoom setting.

## Layout and responsive rules

There is one authored breakpoint: **`max-width:800px`** (inclusive). No separate tablet layout or hamburger-menu interaction is implemented. [CSS](../../assets/css/screen.css) uses global `box-sizing:border-box` and the following rules:

| Region | Above 800px | At or below 800px |
| --- | --- | --- |
| `.wrap` | `width:min(1120px,calc(100% - 40px))`, centered | Same, retaining nominal 20px outer gutters |
| Header | Flex, `min-height:88px`, gap `28px`; brand/navigation/member actions | Wraps, padding `15px 0`, gap `8px`; navigation moves to order 3 and full width; links wrap; member gap becomes `8px` |
| Hero | `max-width:760px`; padding `90px 0 75px` | Padding `50px 0` |
| Report / ordinary Page | `max-width:790px`; margin `65px auto` | Margin `35px auto` |
| Research-card grid | Three `minmax(0,1fr)` columns; gap `22px` | One column; no intermediate two-column mode |
| Membership grid | Two `minmax(0,1fr)` columns; gap `24px`; margin `20px 0 60px` | One column; a single desktop option is not explicitly full-row spanning |

Archive headers use `65px 0 35px` padding without a separate small-screen override. Report headers have `32px` bottom margin. Footer remains a flex row with `24px 0` padding and `70px` top margin; no additional mobile footer rule exists.

Native wide cards use `min(100vw - 40px,1000px)` and full-width cards use `100vw - 40px`, centered relative to the reading column. These are not edge-to-edge viewport layouts. Images/video stay within `max-width:100%` with automatic height; iframes are constrained to `max-width:100%`. Tables and code provide horizontal scrolling rather than stretching the page. Table cells have `min-width:9rem`, padding `10px 14px`, and normal wrapping; code has `18px` padding and panel background. No charting engine is included.

## Components and page composition

| Component | Existing composition and states | Source |
| --- | --- | --- |
| Site shell | Logo (max `220px` wide / `46px` high) or publication title; primary navigation named “Main navigation”; member actions; focusable main landmark; copyright/RSS footer. Secondary navigation is not rendered. | [default.hbs](../../default.hbs) |
| Action/link | `.button`: accent background, white text, `9px 18px` padding, `6px` radius, weight `650`, no underline. Ordinary links use accent; hover thickens underline to `2px`. Actions are native links, not custom button widgets. | [CSS](../../assets/css/screen.css) |
| Homepage | Eyebrow, publication title/description, state-dependent account/signup link; “Latest research” grid and native pagination. | [index.hbs](../../index.hbs) |
| Tag / author archive | Eyebrow, name, optional tag description or author bio, shared cards and pagination. No custom filters/search or profile-image component. | [tag.hbs](../../tag.hbs), [author.hbs](../../author.hbs) |
| Research card | `25px` padding, `8px` radius, `1px` border, panel background. Primary tag/date, linked H3, custom excerpt or 28-word generated excerpt, reading time. No thumbnail, author byline or distinct Brief visual. | [card partial](../../partials/card.hbs) |
| Report | Primary tag, title, optional lead, authors/date; reading time only when access is granted; optional feature image; TOC; Ghost content. Entitled members see thanks; entitled nonmembers see signup-policy-aware follow-up. Restricted content/upgrade markup comes from Ghost, not a theme-created paywall. | [post.hbs](../../post.hbs) |
| TOC | In-column panel, not sticky/sidebar: block margins `24px`, padding `20px`, border, wrapping labels; title “On this page”; ordered lists with `24px` start padding and `4px` item margins. Visible rendered H2/H3 only, H3 nested under preceding H2; existing IDs preserved, missing IDs generated uniquely. Hidden when empty or when JavaScript is unavailable. No content request. | [post.hbs](../../post.hbs), [adapter](../../assets/js/accessibility.js) |
| Membership | Optional title/excerpt hero, native Page content, “Membership options” region and state-dependent plan cards (`32px` padding, `8px` radius, border/panel). No price amounts hardcoded; actual plans/prices are native Portal's responsibility. | [custom-membership.hbs](../../custom-membership.hbs) |
| Ordinary Page / error | Page uses report column without TOC and honors native header/feature-image visibility. Error uses hero/status/message and “Back to home” link. | [page.hbs](../../page.hbs), [error.hbs](../../error.hbs) |

### Membership state contract

The header, hero, report follow-up and Membership template derive actions from Ghost's public settings, not from a theme-owned account state machine. Exact CTA copy varies by placement; [configuration acceptance](../engineering/membership-signup-acceptance.md) defines the existing test scope.

- Existing members: Account / Your account / Manage membership; no duplicate registration card.
- Public signup: free registration allowed; Membership additionally shows Premium research only when Ghost reports paid memberships available.
- Paid-only signup: no free promise; View plans only when paid memberships are available, otherwise unavailable copy and Sign in.
- Invitation-only or disabled self-signup: sign-in path, not open registration; Membership distinguishes invitation-only from general registration-unavailable copy.
- Restricted report bodies remain Ghost-controlled. Public title/excerpt/tag/image metadata must contain no confidential content. Native Portal defects remain release blockers; rendering these states does not prove payment-lifecycle acceptance.

## Keyboard, empty and unavailable states

- Native links remain keyboard-focusable. The skip link becomes visible at `left:12px;top:12px`, with `8px` padding and `z-index:99`, and targets `main[tabindex=-1]`. The theme's `.button` links are anchors and inherit the amber link focus ring. Native `button` elements and adapter-marked scroll regions instead use `3px` accent focus outlines with `3px` offset.
- TOC target headings receive `tabindex=-1` only when none is authored, `scroll-margin-top:24px`, and an accent focus ring. Links use fragment navigation and plain text. Hidden/inert/ARIA-hidden/closed-details/upgrade headings are excluded; duplicate authored IDs are preserved but later ambiguous targets are not linked.
- Overflowing code/table regions gain keyboard focus through the adapter. Portal enhancement contains Tab, supports Escape/close and restores focus where accessible; it is not a substitute for Ghost's account logic or a guarantee for cross-origin frames.
- Empty homepage: “Research is coming soon.” Tag/author grids have no explicit empty-state message. Missing optional descriptions/excerpts/images are omitted; absent logo uses title. No theme skeleton/loading animation is provided. Empty TOC stays hidden; disabled JavaScript leaves native content and links without enhanced TOC/Portal behavior.

## Review boundary

This document describes source values and existing behavior, not a visual QA pass. Existing CI and limited desktop results, with exact commits and gaps, are in the [PRD evidence appendix](prd.md#evidence-appendix). No new screenshots or browser interaction were produced for this specification; safety-stopped computer control was not resumed. Dedicated real no-heading/access/privacy/text-enlargement/Ghost-5 TOC checks, broader font/browser/layout review, screen-reader and complete manual accessibility remain outstanding. Selected axe/contrast/keyboard checks are not full WCAG certification. Design assets and reviewable desktop/mobile screenshots requested in issue #3 still require a separately verified deliverable.
