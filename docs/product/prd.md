# Ghost Research Pro Product Requirements

**First-version scope decision · Development preview · Evidence baseline: 2026-10-29 15:23 UTC; documentation/evidence update: 15:51 UTC**

[Project overview](../../README.md) · [Market evidence](market-validation.md) · [Operator guide](../user-guide.md) · [Release checklist](../engineering/qa-checklist.md) · [Component and responsive specification](design-spec.md)

Ghost Research Pro is a Ghost theme for research publishers, B2B intelligence publications, and professional newsletters. The first-version focus is small, expert-led publications with long-form reports, topic archives, and free/paid editions—not all corporate newsrooms. Readers should be able to find and read research, identify its authors, and use Ghost's native memberships. Publishers should be able to install and maintain it without a custom application or billing service.

The selected first-version scope is the existing reading and publishing experience, delivered as an installable theme ZIP with configuration and demo guides. It is a development preview, not a production-ready release. Implementation exists in draft, unmerged work; native Portal failures remain release blockers. The baseline packaging defect has a separately verified, unmerged repair in PR #13; this documentation branch does not contain that repair. This PRD does not authorize merging, deployment, payment setup, or commercial terms.

## Product basis and target users

The owner selected the research/B2B/professional-newsletter direction and delegated routine project decisions. [Issue #2](https://github.com/henryxu1008/ghost-research-pro/issues/2) defines homepage, tag-based report archive, article and author templates, native memberships, pricing, and brand configuration. [Issue #5](https://github.com/henryxu1008/ghost-research-pro/issues/5) adds navigation, report TOC, tables/charts, and demo instructions; [issue #7](https://github.com/henryxu1008/ghost-research-pro/issues/7) covers compatibility, accessibility, installation, packaging, and release readiness.

The following are target-user hypotheses, not validated customer segments:

- **Expert-led research publisher or small editorial team:** publishes long reports and shorter updates, organizes coverage by topic, and manages free/paid editions through Ghost.
- **Professional reader:** scans recent work, follows a topic or author, and reads long reports on desktop or mobile.
- **Member or prospective member:** understands the available access path and manages their account without a separate theme-owned identity or payment system.

The product hypothesis is a coherent research-reading experience with straightforward installation, not unique TOC or membership features. The public survey inventories 10 themes and 20 Ghost-listed publication examples, but does not verify 20 commercial buyers. [Issue #1](https://github.com/henryxu1008/ghost-research-pro/issues/1)'s customer-validation gate remains open: 0/5 conversations, 0/3 confirmed unmet needs, and 0/2 credible paid-intent signals. Competitor prices and publisher subscriptions are not willingness to pay for this theme. The [market evidence](market-validation.md) is a repository deliverable, not completion of that customer-validation gate; see S3.

## First-version scope decisions

These scope decisions were adopted on 2026-10-29 under the owner's delegation to keep the project moving and decide routine product scope. They are the first-version implementation contract, not evidence of customer demand or approval of commercial terms. They deliberately retain the existing reading experience rather than introduce a new application. The target segment remains a hypothesis to validate.

| Area | First-version decision | Consequence |
| --- | --- | --- |
| Content discovery | Use the homepage, native public-tag archives, and author archives. | No custom research catalogue, taxonomy engine, search, filters, or featured carousel. |
| Reports and briefs | Use the same Ghost post template for both; distinguish them editorially with tags and copy. | No separate Brief layout or content type. |
| Membership and pricing | Use Ghost membership/access settings and native Portal for signup, plans, and account management. | Portal is authoritative for actual plans and prices; the theme does not handle payments or hardcode prices. |
| Presentation | Ship the current light presentation and English theme-owned copy. | Dark mode and translated theme UI are outside the first version. Multilingual post content is not a translated-interface promise. |
| Configuration | Use native publication title, description, logo, navigation, typography, and content settings. Keep the existing theme blue accent for this version. | No custom Admin theme settings; Ghost's publication accent is not mapped to the theme accent. Do not advertise arbitrary palette support. |
| Delivery | Provide the installable ZIP, setup/upgrade/rollback guide, fictional demo recipe, and release checklist. | No hosted deployment, automated demo import, or automatically created pages/navigation. |
| Compatibility | Retain Ghost 5 and Ghost 6 as intended support lines. | Qualify explicit tested profiles; neither `engines >=5` nor one passing profile proves every minor release. Do not silently drop Ghost 5 to obtain a green result. |

The first version succeeds when the acceptance outcomes below are demonstrated on the release candidate. No conversion, revenue, or performance KPI is assumed without a separate baseline and decision.

## First version experience

### Discover and read research

A visitor reaches a homepage showing the publication title and description, an appropriate account/signup action, and paginated text cards. The default page size is 12 home-collection posts. Cards show the primary public tag, date, title, excerpt, and reading time; they do not include thumbnails or author bylines.

A public tag links to its native archive and description. Any public tag can group reports; the primary public tag supplies the card/report label. A publisher can use a Research tag as an editorial convention, but no custom routes or dedicated catalogue are bundled. A post's author link leads to that author's name, biography, and post archive. See [homepage][home], [tag archive][tag], [author archive][author], and [cards][card].

The report template presents the title, public custom excerpt, date, authors, feature image, and native Ghost content. A nested H2/H3 TOC links to already rendered, visible headings. Existing heading IDs are preserved; generated IDs must remain unique for duplicate and non-Latin headings. Tables and code scroll inside the reading column; images and native editor cards remain supported. Chart presentation means styling/support for authored content, not a custom chart engine or live data feed. Ordinary Pages use their own template and have no report TOC. See [report][post], [TOC implementation][toc], and [ordinary Page][page].

### Understand access and manage membership

A visitor or member encounters the same signup-policy-aware actions in the header, homepage, public report, and optional Membership page. Existing members can open account management. Public signup can invite free membership; paid-only signup must not promise a free account, and paid-plan actions appear only when native paid plans are available. Invitation-only configuration must not expose open signup.

Ghost owns access enforcement and Portal owns the plan/account flow. The theme must never fetch restricted report content to construct its TOC. Titles, excerpts, tags, and feature images are public metadata, even for protected posts. Publishers must supply explicit public-safe excerpts and keep confidential report text out of every public metadata field. The card fallback is a generated 28-word excerpt, not a confidentiality safeguard. See [report][post], [cards][card], and [Membership template][membership].

### Configure and maintain the publication

A publisher installs and activates the ZIP in Ghost Admin, sets native publication identity/typography, creates tags and content, and configures primary navigation. The optional Membership page requires manual creation and selection of the Membership template. Ordinary Pages honor their title/feature-image visibility settings. Secondary navigation is not rendered.

The publisher follows a documented backup, upgrade, and rollback path. The demo recipe uses fictional posts, public/member access, tags, a Page, and navigation; it does not provision a mail service, paid account, or real dataset. See [layout][layout], [installation and configuration guide][guide], and [demo recipe][demo].

## Acceptance matrix

**Status key:** **Implemented + scoped evidence** means the feature exists and the stated checks passed, not unrestricted certification. **Known fail** is an observed unmet outcome. **Unexecuted** means acceptance evidence is still required. **Decision pending** requires an explicit choice before the corresponding promise can be made. Mixed rows retain their incomplete status; they are not release passes. Evidence references are summarized in the appendix.

### Reader outcomes

| ID | User outcome and measurable acceptance | Status and evidence at the snapshot |
| --- | --- | --- |
| DISCOVER | A visitor can browse the default homepage, follow a card, and navigate pagination. It lists home-collection posts at the configured default of 12 per page and shows the defined card fields. | **Implemented + scoped evidence.** Homepage/card routes are checked. Pagination exists in the template, but the runtime checks do not establish second-page navigation: multi-page acceptance is **Unexecuted**. [S1, E1] |
| TOPICS | A reader can open a public-tag archive with its description and matching posts, then follow a post's author link to an author biography and archive. A non-primary public tag still includes the post in that tag's archive. | **Implemented + scoped evidence.** Tag/author routes are checked. Secondary-tag inclusion is native/source behavior and a demo expectation; its manual walkthrough is **Unexecuted**. [S1, E1, S2] |
| READING | Public and entitled readers can read native post content, images/editor cards, tables, and code without widening the page; ordinary Pages honor title/feature-image visibility and do not receive a report TOC. | **Implemented + scoped evidence.** Template/runtime checks and sampled responsive checks; authored-content combinations are not exhaustively certified. [S1, E1] |
| REPORT-NAV | A keyboard-usable, narrow-screen TOC represents visible H2/H3 structure only, preserves existing links, and gives duplicate/non-Latin headings unique anchors. It hides when empty and never fetches or exposes restricted content. | **Implemented + scoped evidence; dedicated acceptance incomplete.** Focused CI and limited real-Ghost-6 checks passed. Desktop no-heading, dedicated member/paid leakage, text-enlargement, and Ghost-5 TOC checks remain **Unexecuted**. General privacy tests do not replace TOC-specific acceptance. [S1, E1, E2] |
| PRIVATE-READING | Public, member-only, paid-only, and tier-restricted posts expose body content only to entitled readers. Signed-out/revoked access cannot retain restricted body content in the served page. Public metadata and demo excerpts contain no restricted markers. | **Implemented + scoped evidence.** Runtime access/revocation checks use complimentary members and local SMTP; no real billing claim. The corrected fictional demo is not yet manually exercised. [E1, S2] |
| JOIN | Header, homepage, report, and Membership-page CTAs agree with public, paid-only, and invitation-only settings for anonymous and existing-member states. No free-membership promise appears in paid-only mode; unavailable paid plans and invitation-only signup are not offered. | **Implemented + scoped evidence.** Real Ghost checks cover configurations without Stripe; a separate template fixture covers paid-enabled rendering, not checkout. [E3] |
| ACCOUNT | A member can open native account management. A failed preference update preserves useful state and shows failure without premature success; a retry remains possible. | **Known fail.** Legacy Portal newsletter failures lose client member/draft/error state; both tested Portal versions report comment-preference success before an aborted-request error. Other native account writes are not blanket-accepted. [E1, E6, E7] |
| PAID-ACCESS | Where an owner later enables paid memberships, the native signup/payment/account lifecycle must match the displayed plans and access rules. Theme-owned prices or payment handling must not appear. | Native delegation is **Implemented + scoped evidence**; actual Stripe sandbox lifecycle is **Unexecuted**. Paid-enabled rendering and complimentary-member access do not establish checkout, renewal, cancellation, or payment-failure behavior. [S1, E3] |
| ACCESSIBLE-USE | At 320/360, 768, and 1440 CSS-pixel widths, applicable navigation and reading layouts remain usable; keyboard users can reach navigation, skip link, content, and TOC with visible focus. Complete a manual keyboard/screen-reader/text-enlargement review for the advertised release scope. | **Implemented + scoped evidence; manual acceptance Unexecuted.** Basic responsive coverage is 360/768/1440, with focused card/TOC checks at 320; selected axe and contrast checks are not full WCAG or screen-reader certification. [E1, E2] |

### Publisher and delivery outcomes

| ID | User outcome and measurable acceptance | Status and evidence at the snapshot |
| --- | --- | --- |
| BRAND | Native title, description, logo, primary navigation, and typography render as configured. Documentation describes the fixed accent, light English UI, absent secondary navigation, and lack of custom Admin controls accurately. | **Implemented + scoped evidence** from source-reviewed mappings, not acceptance of all setting edits or remote fonts. Publication-accent mapping is absent; full configuration walkthrough and issue #3's visual assets/screenshot review remain outstanding. The [source-derived component specification](design-spec.md) records existing values, not completed visual acceptance. [S1, E4] |
| INSTALL-RECOVER | An operator can install/activate the ZIP and recover a downloaded backup after an upgrade, retaining selected settings/content and restoring the served version/assets/template. Invalid, cancelled, and repeated uploads do not corrupt the active theme or body protection. | **Implemented + scoped evidence.** Native Admin UI probes passed on both profiles. Seeded login and a system-font fallback leave normal login and production font appearance unproved. [E4] |
| COMPATIBILITY | Source and packaged theme pass GScan without errors or warnings on both intended Ghost lines, and core reader/operator journeys pass on each declared runtime profile. Document exact tested versions and unresolved differences. | GScan is **Implemented + scoped evidence**; full-runtime acceptance is **Known fail** because ACCOUNT remains red. No every-minor-version guarantee. [E1] |
| REPEATABLE-ZIP | Two clean builds from identical source and declared inputs produce identical ZIP bytes/hashes despite checkout timestamps. Contents, metadata, and ordering are deterministic; changing a payload file changes the hash. No stale build residue, development dependencies, or unintended files enter the installable ZIP. | **Known fail in this branch's baseline; separate fix verified, unmerged.** PR #13 passes deterministic-build checks and independent archive/payload verification. PR #14 does not contain its code; integration/review and release-candidate evidence remain gates. [E5] |
| SAFE-TOOLCHAIN | The audit gate rejects new critical/high findings and unavailable/invalid audit results; any accepted existing exception is explicit, bounded, and absent from the installable dependency-free theme ZIP. | **Implemented + scoped evidence** for the existing bounded gate, not a clean audit. Three known high-severity development-dependency findings remain. [E7] |
| DEMO-HANDOFF | Starting from a clean test publication, an operator can follow the guide and create the fictional demo, primary navigation, tag archives, and Membership page; public and member views match the recipe without exposing the restricted heading/body markers. | Guides are implemented; the clean manual setup and walkthrough are **Unexecuted**. A written recipe is not a working demo or release acceptance. [S2] |
| DISTRIBUTION | The release checklist identifies supported profiles, known limitations, package contents, license, and any chosen distribution channel's rules. Claims match evidence and the package's actual terms. | **Decision pending / Unexecuted.** License and commercial terms are unresolved, marketplace eligibility is unproved, and release readiness is not established. [S2, E7] |

## Exclusions and constraints

- **Explicit MVP exclusions:** custom billing, market-data feeds, and PDF generation, as required by issue #2.
- **Additional first-version scope exclusions:** custom account identity, a custom research catalogue/search/filter system, a distinct Brief template, automatic page/nav creation, secondary navigation rendering, custom Admin theme controls, dark mode, translated theme UI, and a custom chart engine.
- **Operational boundary:** no deployment, production mail configuration/sending, Stripe/payment-account setup, or purchase-flow authorization is supplied by this PRD. Native payment integration does not mean theme-owned billing.
- **Content boundary:** public metadata is intentionally public. Ghost access rules protect the body; editorial public-safe metadata is mandatory. The theme must not reconstruct, fetch, or cache protected content for navigation.
- **Validation boundary:** sampled runtimes and selected accessibility checks do not establish all Ghost versions, browsers, locales, palettes, assistive technologies, or editor-content combinations. No performance or conversion guarantee is asserted.

## Release gates

The current state is **not release-ready**. A new release candidate must carry its own evidence; passes from this draft baseline do not automatically transfer to later commits.

1. **Complete the design contract within the selected scope.** The first-version decisions above are recorded. The [component and responsive specification](design-spec.md) records existing source values and the light-only decision. Complete issue #3's remaining visual assets and reviewable desktop/mobile screenshots; do not treat this source specification as completed visual/design acceptance.
2. **Pass both supported runtime profiles.** Re-run core reader, operator, signup-policy, privacy, and packaging checks on the same candidate ZIP. Portal failures within the included support scope remain blockers, including false-success behavior; an owner risk waiver alone is not acceptance. Any support-scope change requires a recorded owner decision and a candidate rerun against that scope. Do not reclassify failures as expected success or silently remove Ghost 5.
3. **Integrate and re-verify reproducible packaging.** PR #13 has separate passing evidence [E5], but its implementation is not present in this documentation branch. Complete review and an authorized integration before assessing a combined release candidate; demonstrate REPEATABLE-ZIP from independent clean builds, plus payload-change and stale-residue checks on that candidate. Retain the dependency gate's disclosed exceptions and reject regressions. A source/ZIP GScan pass alone does not satisfy packaging readiness.
4. **Complete the missing user walkthroughs.** Execute the clean demo/install/configure walkthrough; finish dedicated TOC no-heading/access/privacy, keyboard, narrow-layout, and text-enlargement checks on the declared support scope. Complete the manual accessibility review and any claimed browser/locale/palette acceptance. Respect existing browser-control safety stops rather than bypassing them.
5. **Qualify paid-membership claims separately.** Before claiming paid-commerce readiness, obtain the required authorization/environment and complete the native Stripe sandbox lifecycle. Without it, label paid checkout/lifecycle validation unexecuted; do not imply that CTA fixtures tested billing.
6. **Resolve distribution and commercial readiness.** The owner must decide the license and any pricing/support terms before distribution promises. Review the rules of any chosen marketplace before claiming eligibility. The market-validation gate remains separate from engineering completion: passing CI cannot establish customer demand or paid intent.

These gates define evidence and decisions needed for readiness. They are not approval to merge, deploy, enable payments, or publish a marketplace listing.

## Open decisions

| Decision | Current position | Required resolution |
| --- | --- | --- |
| Visual design deliverables | First-version scope and the [source-derived component specification](design-spec.md) are recorded; issue #3's design assets and screenshot review remain outstanding. | Complete those visual deliverables within the selected scope; no new features or full-accessibility claim is implied. |
| License and commercial model | Package metadata says MIT but there is no LICENSE; README leaves licensing/pricing undecided. | Owner decision under [issue #8](https://github.com/henryxu1008/ghost-research-pro/issues/8). Do not infer a settled license, price, or support contract from metadata. |
| Native Portal release risk | Stock Portal defects remain; an upstream draft fix is not installed. | Verify a supported fix. Any support-scope change needs a recorded owner decision and candidate rerun; failures still within scope remain blockers. |
| Paid-commerce readiness | No real billing or Stripe sandbox lifecycle acceptance. | Authorized sandbox/environment and executed lifecycle before a paid-commerce-ready claim. |
| Demand and distribution | A public theme/publication inventory exists; commercial-buyer qualification, issue #1's customer-validation gate, and marketplace eligibility remain open. | Evidence-backed go/no-go for commercial positioning and the selected distribution route; no invented paid-intent claim. |

## Evidence appendix

### Baseline and source map

Snapshot: **2026-10-29 15:23 UTC**. Baseline is [PR #12](https://github.com/henryxu1008/ghost-research-pro/pull/12) at `2f485339dd5f0421b34d308a5588933c86f64431`, stacked on [PR #11](https://github.com/henryxu1008/ghost-research-pro/pull/11) at `26e8aba6dbe9b907c61cdd1479ab96cb6b863545`, itself on [PR #10](https://github.com/henryxu1008/ghost-research-pro/pull/10) at `25debe74e93fe0b1572ec46f4791b323b6626e79`. All three are Draft and unmerged at this snapshot.

- **S1 — Implementation:** [README][readme], [homepage][home], [tag][tag], [author][author], [post][post], [card][card], [TOC JavaScript][toc], [ordinary Page][page], [Membership template][membership], and [layout][layout]. Repository-relative source links resolve in this branch; the snapshot and its CI evidence remain tied to the exact baseline commit above. Later implementation changes require refreshed acceptance, not automatic transfer of these results.
- **S2 — Operator deliverables:** [user guide][guide] and [demo content][demo]. The demo recipe is fictional and unexecuted; its unique restricted heading is `DEMO-MEMBER-HEADING-7C9`, with body marker `DEMO-MEMBER-BODY`, both excluded from public metadata.
- **S3 — Market survey:** [Bounded market evidence](market-validation.md), dated 2026-10-29, documents 10 competing themes and 20 Ghost-listed publication examples, including corporate/free/related-brand examples and unverified commercial status. The [issue-requested research path](../research/market-validation.md) points to that canonical document. No interviews, confirmed unmet needs, or paid-intent signals are established.

### Verification scope and gaps

- **E1 — CI/runtime:** [Run 40896368434](https://github.com/henryxu1008/ghost-research-pro/actions/runs/40896368434) tests the exact baseline. Validate passed; source and ZIP GScan for Ghost 5/6 reported zero errors/warnings. Security checks cover 15 fixtures and contrast checks 3 reference cases. Full runtime: Ghost 5 **124 pass / 3 fail**; Ghost 6 **126 pass / 1 fail**. Profiles are Ghost **5.130.6 / Node 22.23.4 / Portal 2.51.5** and Ghost **6.73.0 / Node 24.22.1 / Portal 2.72.11**. Runtime access tests use complimentary members and captured local-SMTP magic links, including signed-out/revoked access, not real billing or production email.
- **E2 — TOC/responsive:** Focused TOC checks passed **10/10 per profile**: 4 DOM-double and 6 real-Chromium checks. Limited real-Ghost-6 desktop checks at code commit `248f00b9cc7a168865e645a1ac9dbe1235562e43` cover Chinese/duplicate headings, existing anchors, nesting, hidden headings, keyboard focus, and a 320-pixel layout. The later baseline through `2f48533` changed documentation only; that does not turn the desktop evidence into a new run. Dedicated desktop no-heading, member/paid leakage, text enlargement, and Ghost-5 checks were not completed; browser-control work was safety-stopped. Basic runtime responsive checks cover 360/768/1440, with focused card/TOC coverage at 320. These do not amount to full manual accessibility acceptance.
- **E3 — Signup configuration:** **11 probes per profile** passed: 3 signup modes × 3 reader states on real Ghost without Stripe (`paid` availability false), a paid-enabled template-only fixture, and settings restoration. This establishes scoped CTA behavior, not paid checkout.
- **E4 — Admin operations:** **5 native Admin UI probes per profile** passed, covering install/activate, cancel, repeat upload, downloaded-backup → disposable higher-version upgrade → restore of the actual downloaded ZIP, and invalid ZIP rejection with 422. Checks include active version, served CSS/template, selected settings/content preservation, and anonymous body protection. Admin login was seeded. The offline font endpoint returned empty CSS/system fonts, so actual font appearance was not tested.
- **E5 — Packaging failure:** Independent comparison of ZIPs from [PR #11 run 40856407954](https://github.com/henryxu1008/ghost-research-pro/actions/runs/40856407954) and [PR #12 run 40896368434](https://github.com/henryxu1008/ghost-research-pro/actions/runs/40896368434) found the same 12 payload files, compressed streams, and ordering but different hashes from checkout timestamps. The baseline [packager][packager] uses raw `zip -r`. This remains the implementation in this documentation branch. **Separate follow-up:** [Draft PR #13](https://github.com/henryxu1008/ghost-research-pro/pull/13), head `459faf152c1625b4bf5b5e61815629d827655cef`, based on `2f48533`, supplies the unmerged repair. [CI run 40903435377](https://github.com/henryxu1008/ghost-research-pro/actions/runs/40903435377) passed six packaging checks with zero failures/skips in all three Linux jobs (including executed symlink checks). The three inner installable ZIPs share SHA-256 `0ebfb4413de775b8001cbe869ebe17a04d0d95827e1db29ff97d305eb43509db`. Independent Python-reader verification passed CRC checks: 28,210 bytes, 12 payload files byte-identical to the older PR #12 payload, with normalized time, UTF-8 flags, mode 0644, no extra fields and correct order. These are PR #13 results, not results for PR #14's packager. PR #13 is not merged; final review/integration and combined-candidate acceptance remain outstanding. No merge is authorized by this evidence update.
- **E6 — Portal failures:** Portal 2.51.5 loses client member/draft/error state on newsletter HTTP 503/429; both tested Portal versions emit comment-preference success before an aborted-request error. [Upstream Ghost draft PR #32314](https://github.com/TryGhost/Ghost/pull/32314) awaits maintainer CI approval and is not an installed fix.
- **E7 — Security/release limits:** Audit reports **0 critical / 3 known high** development-dependency findings through `gscan → @tryghost/zip → extract-zip`. The [bounded dependency policy][security] permits the known baseline but rejects new critical/high or invalid/unavailable audit results. This is not a clean audit; those dependencies are not in the installable theme ZIP. Account-email changes, custom-field/announcement writes, full manual accessibility, custom palettes, non-pinned browsers/versions, broader locales, marketplace eligibility, and the Stripe sandbox lifecycle remain unverified.

[readme]: ../../README.md
[home]: ../../index.hbs
[tag]: ../../tag.hbs
[author]: ../../author.hbs
[post]: ../../post.hbs
[card]: ../../partials/card.hbs
[toc]: ../../assets/js/accessibility.js
[page]: ../../page.hbs
[membership]: ../../custom-membership.hbs
[layout]: ../../default.hbs
[guide]: ../user-guide.md
[demo]: ../demo-content.md
[packager]: ../../scripts/package.cjs
[security]: ../engineering/dependency-security.md
