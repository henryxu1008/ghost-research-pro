# Ghost Research Pro — bounded market evidence

Research date: 2026-10-29 (UTC). Status: desk research, **validation gate NOT passed**.

[Project overview](../../README.md) · [First-version PRD](prd.md) · [Fictional demo recipe](../demo-content.md)

The inventory below preserves the dated desk-research snapshot; document integration is not a fresh verification of prices/offers, runtime audit, or customer interview.

## Decision summary

Focus the first-release evaluation on **small, expert-led research publications with long-form reports, topic archives, and free/paid editions**, not all newsrooms or corporate content sites. This is the selected first-version scope in the [PRD](prd.md#first-version-scope-decisions), but remains a positioning hypothesis, not a validated customer segment. The Diff, ByteTree and Notes on the Crises provide concrete examples of that publishing pattern. Larger professional communities below are adjacent references, not the initial implementation target.

1. Keep the existing native Ghost membership approach. Verify anonymous/free/paid access states and clear upgrade copy rather than adding a new billing/account system.
2. Keep the existing TOC, report reading layout and topic pages, but evaluate the coherent research reading experience and installation clarity, **not TOC or memberships as unique features**. At least Curie, Rinne, Thesis and Scope already advertise those features.
3. Use the existing demo guide to demonstrate one realistic long report, its topic archive and free/paid states. Prioritize installation and reading QA over new generic theme features. Do not add analytics, enterprise licensing, financial dashboards, AI tools or community software based on this research.

No launch price is validated. The sampled paid themes list USD 89–149; four free alternatives make “another attractive Ghost theme” a weak proposition. This price range is an observed comparison set, not willingness to pay for this product.

## Issue and completion boundary

[Issue #1](https://github.com/henryxu1008/ghost-research-pro/issues/1), read through the GitHub connector on 2026-10-29, requests 10 competing themes, 20 real Ghost commercial publishers, pricing, feature gaps, evidence links, at least five customer conversations, and `docs/research/market-validation.md`. This canonical product document is linked from that [requested research path](../research/market-validation.md); relocating the narrative does not change the issue's evidence requirements. Its full-build gate requires three unmet needs and two credible paid-intent signals.

- 10 competing themes: documented below; prices/listings and public feature descriptions verified.
- 20 real publication examples: documented below with Ghost directory evidence. **Not 20 independently validated paying publisher customers**: this includes corporate publications, related brands, free newsletters and cases with commercial status still unverified. Do not check off the stricter commercial-publisher target without resolving those qualifications.
- Customer conversations: **0/5; unverified/not conducted**.
- Confirmed unmet needs: **0/3**. Three testable hypotheses appear below, not findings.
- Credible intent to pay for Ghost Research Pro: **0/2; unverified**. Publisher subscription offers and competitor prices are not paid intent for our theme.
- During the desk-research pass, no one was contacted and no purchases, signups, account changes or GitHub writes were performed. This documentation-only integration publishes the findings; it does not authorize outreach or payments.

## Method and evidence limits

All sources below were retrieved on 2026-10-29. A retrieval date is not the publication date; many pages are undated and search caches vary. Ghost Explore inclusion is direct evidence that Ghost lists a publication, not an independent runtime audit of its current CMS, theme or hosting. Publisher pages establish visible navigation/content/offers only. No theme purchases, private source review, benchmark tests, checkout tests, revenue inference, or claims about conversion improvements were made. Vendor features and testimonials are vendor claims, not independently tested results. An unmentioned feature is **unknown**, not absent. Some dynamic prices were not exposed in the text reader and remain unverified.

## Ten-theme comparison

Prices are listed USD theme prices at retrieval, not verified checkout totals, renewal terms or support licenses. “Question/gap” means a candidate-fit question for testing, not proven missing functionality.

| Theme | Listed price and evidence | Publicly supported feature evidence | Relevance / question to test |
|---|---|---|---|
| Source | Free, [marketplace](https://ghost.org/themes/?tag=News) | [Official demo description](https://source-newsletter.ghost.io/about/) describes four homepage styles and list/grid feeds. | Default baseline; why would a research publisher pay instead of configuring Source? Research-specific setup is not established by the reviewed description. |
| Digest | Free, [official announcement](https://ghost.org/changelog/free-newsletter-themes/) | [Official demo](https://digest.ghost.io/about/) describes latest-issue homepage, previous issue navigation and automatic issue archive. | Strong newsletter-first baseline. Test whether topic-based research retrieval matters more than chronological issues. |
| Journal | Free, [official announcement](https://ghost.org/changelog/free-newsletter-themes/) | [Official demo](https://journal.ghost.io/about/) describes typography-led layout, latest-post emphasis, featured/tag widgets and signup. | Text-heavy publishing is already served. Research utility must go beyond clean typography. |
| Ease | Free, [marketplace](https://ghost.org/themes/?tag=News) | [Live demo](https://ease.ghost.io/) visibly lists search and grouped article collections. | Archive/knowledge organization baseline. Paid-report discovery fit needs evaluation; not proven absent. |
| Brief | $149, [vendor](https://brightthemes.com/themes/brief) | Vendor describes configurable signup hero and dedicated newsletters/archive pages; claims Ghost 6 compatibility, version 1.7.0 updated Aug 1, 2026. | Direct newsletter competitor; generic conversion/landing features already available. |
| Curie | $149, [vendor](https://brightthemes.com/themes/curie?ref=ghost) | Vendor describes timeline/list/grid feeds, fixed TOC template and native membership tiers. Claims version 1.8.0, Aug 1, 2026, Ghost 6. | Although positioned for changelogs, its report-reading features directly overlap; do not claim TOC is novel. |
| Rinne | $149, [vendor](https://brightthemes.com/themes/rinne?ref=ghost) | Vendor describes tag resource filters, resources page, TOC/sidebar templates and membership pages/Portal choice. Claims version 1.11.0, Aug 1, 2026, Ghost 6. | Strong resource-library overlap. Test installation complexity and report-first workflow, not unproven feature absence. |
| Thesis | $89, [vendor](https://www.priority.vision/themes/thesis/) | Vendor lists double sidebar, native search, memberships, TOC and responsive tables. | Low-price long-form competitor. Differentiate by a focused research setup and demonstrated usability, if customers value it. |
| Scope | $99, [vendor](https://www.priority.vision/themes/scope/) | Vendor lists sidebar navigation, configurable landing pages, coauthors, memberships, TOC and responsive tables. | Broad overlap at lower price than $149 competitors. Generic feature-count differentiation is weak. |
| Newsroom | $149, [marketplace](https://ghost.org/themes/newsroom/) | [Live demo](https://newsroom.highfivethemes.com/) visibly includes categories, sidebar post variants and member/paid-only labels. | More news-oriented alternative. Test a quieter report-centric experience; no claim that Newsroom cannot support research. |

## Twenty publication examples

All rows observed 2026-10-29. “Price unknown” means not established in this pass, not free. Explore links are platform evidence; site links are publication/offer evidence. These are examples, **not outreach leads with consent or qualified buyers**. Prices refer to publisher content, never to theme spend.

| # | Publication / platform evidence | Observed publication evidence; commercial/pricing qualification | Why relevant |
|---|---|---|---|
| 1 | [Yardeni QuickTakes](https://explore.ghost.org/p/yardeni-quicktakes) | [Site](https://www.yardeniquicktakes.com/) promotes daily market analysis; [membership](https://www.yardeniquicktakes.com/membership/) exists; price not readable/verified. | Expert identity and research subscription landing page. |
| 2 | [The Diff](https://explore.ghost.org/p/the-diff) | [Site](https://www.thediff.co/) explicitly distinguishes free weekly and additional paying-subscriber issues; price unknown. | Long-form finance/technology with free-to-premium proposition. |
| 3 | [Bits about Money](https://explore.ghost.org/p/bits-about-money) | [Site](https://www.bitsaboutmoney.com/) explicitly says essays are free; corporate copyright is shown. Paid publication status **not established**. | Text-first expert research and essay archive; counterexample to assuming every research newsletter charges. |
| 4 | [ByteTree — Ghost finance listing](https://explore.ghost.org/finance/) | [Membership](https://www.bytetree.com/membership/) lists free, Quality £19/month, Digital £25/month, Multi-Asset £39/month, combined £49/month and Pro £99/month. | Clearly differentiated research series and tier benefits. |
| 5 | [Notes on the Crises](https://explore.ghost.org/p/notes-on-the-crises) | [Site](https://www.crisesnotes.com/) visibly separates paid-only research, public articles and FOIA database; numeric price unknown. | Research series, source material and access labels. |
| 6 | [Independent Vanguard Adviser](https://explore.ghost.org/p/the-independent-vanguard-adviser) | [About](https://www.independentvanguardadviser.com/about/) distinguishes free/premium, archive and research benefits; price unknown. | Topic taxonomy and report types. |
| 7 | [Asian Century Stocks](https://explore.ghost.org/p/asian-century-stocks) | Ghost lists the publication and a publisher testimonial about migration. Linked site fetch failed. Current offer/price/commercial status **not independently verified**. | Specialist company analysis; evidence-qualified migration reference only. |
| 8 | [Cestrian Capital Research](https://explore.ghost.org/p/cestrian-capital-research) | [Site](https://www.cestriancapitalresearch.com/) offers research licensing and investor services, plus a free daily review; price unknown. | Strong explicit audience segmentation; enterprise features are out of our MVP scope. |
| 9 | [Exchange Invest](https://explore.ghost.org/p/exchange-invest) | [Site](https://www.exchangeinvest.com/) describes five weekday subscriber newsletters and free weekend edition; numeric price unknown. | Narrow B2B intelligence niche and archive. |
| 10 | [Product Marketing Alliance](https://explore.ghost.org/p/product-marketing-alliance-1) | [Site](https://www.productmarketingalliance.com/) offers memberships, training, media kit and resource hub; [plans](https://www.productmarketingalliance.com/signup/) numeric price not verified. | Reports/resources within a professional membership. |
| 11 | [Packaging Europe — Ghost business listing](https://explore.ghost.org/business/) | [Site](https://www.packagingeurope.com/) has reports, membership and advertise navigation; [membership](https://www.packagingeurope.com/membership/) price not verified. | Industry-specific report navigation; commercial publishing signals beyond paywalls. |
| 12 | [Hello Partner](https://explore.ghost.org/p/hello-partner) | [Site](https://hellopartner.com/) has members-only labels, events, Partner+ and gift membership; price unknown. | B2B editorial plus membership pathways. |
| 13 | [Product-Led Alliance](https://explore.ghost.org/p/product-led-alliance-product-led-growth) | [Site](https://www.productledalliance.com/) lists resources, certifications, events and membership; price unknown. | Professional resource archive; same Alliance group as other rows, not independent demand evidence. |
| 14 | [Mass Market Retailers](https://explore.ghost.org/p/mass-market-retailers) | [Site](https://massmarketretailers.com/) shows retail/supplier news, research, events and subscription navigation; paid subscription price/status unverified. | Trade-publication topic navigation. |
| 15 | [Sales Enablement Collective](https://explore.ghost.org/p/sales-enablement-collective) | [Site](https://www.salesenablementcollective.com/) offers membership, training and media kit; price unknown. | Templates and reports for a defined profession; related Alliance brand. |
| 16 | [Customer Success Collective](https://explore.ghost.org/p/customer-success-collective) | [Site](https://www.customersuccesscollective.com/) has membership/resources/training and a publisher-hosted paid-member testimonial; price unknown. | Professional knowledge library; related Alliance brand; testimonial not our customer interview. |
| 17 | [Buffer](https://explore.ghost.org/p/buffer) | [Resources](https://buffer.com/resources/) is a marketing publication connected to Buffer software products; paid content subscription **not established**. | Commercial content-marketing adjacency, not a paid research publisher. |
| 18 | [Geckoboard](https://explore.ghost.org/p/the-team-performance-blog-geckoboard) | [Blog](https://www.geckoboard.com/blog/) shows advice, case studies, categories and software trial CTA; paid content subscription **not established**. | Evidence-backed B2B articles; commercial software blog adjacency. |
| 19 | [StartupTalky](https://explore.ghost.org/p/startuptalky-business-news-insights-and-stories) | [Site](https://startuptalky.com/) lists sector coverage, case studies and commercial service links; paid content price/status unverified. | Content taxonomy; broader than initial target. |
| 20 | [PESTLE Analysis](https://explore.ghost.org/p/pestle-analysis) | [Site](https://pestleanalysis.com/) groups company/country/industry analyses and has signup; directory author identifies web-publishing business. Paid offer/revenue **unverified**. | Reusable analytical report structure; no proven theme budget. |

## Three needs to test — NOT validated unmet needs

1. **Find older research by topic, not just date.** ByteTree's series navigation, IVA's taxonomy and the archive-oriented themes make this plausible. They also show existing solutions. Ask a publisher to demonstrate a recent retrieval failure and its cost before calling this unmet.
2. **Readable long reports without hand-editing layout.** Existing TOC/responsive-table competitors show this is served in principle. Test a real report with headings, footnotes, wide tables and Ghost cards on mobile; ask what currently fails and what workaround they use.
3. **Understandable free/paid access and easier setup.** Public publisher sites visibly distinguish tiers, and vendors advertise membership setup. Ask for concrete setup/support incidents, not whether they “like” the demo. Existing native Ghost features may already solve the need.

## Remaining gate evidence (requires actual participants)

Do not represent this plan as completed interviews. Five conversations must document date, participant role, publication, permission to retain notes, existing theme/workflow, a demonstrated recent problem, workaround and switching constraint. Determine whether at least three needs recur and are genuinely unmet by current alternatives.

Two credible paid-intent signals must concern **this theme** and include a defined deliverable, price, buyer authority and concrete commitment (for example a documented pilot purchase intent with timing or an authorized preorder). Generic enthusiasm, newsletter subscription prices, third-party testimonials and competitor purchases do not count. No payment collection or outreach is authorized by this documentation/research scope.

## Fetch limitations

Ghost Explore technology page was inaccessible; not used. Individual Explore pages for ByteTree and Packaging Europe failed (timeout/cache miss), so their readable category listings provide platform evidence. Asian Century Stocks' linked site was inaccessible, so its commercial offer remains unverified. The Diff upgrade link returned the same text page; multiple membership pages did not expose numeric prices. These are source/tool accessibility limitations, **not policy denials or pending approvals**. No hidden prices or missing features were inferred.
