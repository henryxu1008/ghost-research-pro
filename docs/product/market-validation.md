# Ghost Research Pro — bounded market evidence

Research date: 2026-10-29 (UTC). Status: desk research, **validation gate NOT passed**.

[Project overview](../../README.md) · [First-version PRD](prd.md) · [Fictional demo recipe](../demo-content.md)

The ten-theme inventory preserves its dated desk-research snapshot. The publication section was revised with paired Ghost/paid-offer evidence on the same date; representative offers and the documented migration conflict were independently rechecked during integration. This is not a checkout/runtime audit or customer interview.

## Decision summary

Focus the first-release evaluation on **small, expert-led research publications with long-form reports, topic archives, and free/paid editions**, not all newsrooms or corporate content sites. This is the selected first-version scope in the [PRD](prd.md#first-version-scope-decisions), but remains a positioning hypothesis, not a validated customer segment. The Diff, ByteTree and Notes on the Crises provide concrete examples of that publishing pattern. The journalism and culture publications below are adjacent references, not an expansion of the initial implementation target.

1. Keep the existing native Ghost membership approach. Verify anonymous/free/paid access states and clear upgrade copy rather than adding a new billing/account system.
2. Keep the existing TOC, report reading layout and topic pages, but evaluate the coherent research reading experience and installation clarity, **not TOC or memberships as unique features**. At least Curie, Rinne, Thesis and Scope already advertise those features.
3. Use the existing demo guide to demonstrate one realistic long report, its topic archive and free/paid states. Prioritize installation and reading QA over new generic theme features. Do not add analytics, enterprise licensing, financial dashboards, AI tools or community software based on this research.

No launch price is validated. The sampled paid themes list USD 89–149; four free alternatives make “another attractive Ghost theme” a weak proposition. This price range is an observed comparison set, not willingness to pay for this product.

## Issue and completion boundary

[Issue #1](https://github.com/henryxu1008/ghost-research-pro/issues/1), read through the GitHub connector on 2026-10-29, requests 10 competing themes, 20 real Ghost commercial publishers, pricing, feature gaps, evidence links, at least five customer conversations, and `docs/research/market-validation.md`. This canonical product document is linked from that [requested research path](../research/market-validation.md); relocating the narrative does not change the issue's evidence requirements. Its full-build gate requires three unmet needs and two credible paid-intent signals.

- 10 competing themes: documented below; prices/listings and public feature descriptions verified.
- 20 commercial publication examples: revised below with paired official Ghost evidence and publisher-owned explicit paid subscription/membership offers. Distinct publications, not 20 interviewed buyers; some numeric prices are not exposed. The public-example count is supported under the stated qualification rule; demand validation is not.
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

## Twenty qualified commercial Ghost publication examples — revised evidence

Verified **2026-10-29 UTC**. Count: **20 distinct publications with official Ghost evidence and a publisher-owned explicit paid subscription/membership offer**. This is commercial-offer validation, not audited revenue, proof of completed transactions, current full-stack inspection or 20 buyer interviews. No known same-company sibling brands are counted twice; ownership was checked at the visible publication/team description level, not through corporate-registry due diligence. Research/B2B examples are the closest product references; journalism/culture examples demonstrate adjacent commercial publishing patterns, not expansion of the initial target.

**Qualification rule:** (1) readable official Ghost directory entry or publisher Ghost attribution; (2) publisher-owned page explicitly describes a paid plan or recurring paid membership and its content benefits. A numerical price is desirable but not mandatory. Generic “subscribe” labels, directory revenue ranking alone, business blog ownership, donations alone and third-party revenue estimates do not qualify. “Price not exposed” is not free. Public prices are displayed offers, not checkout-tested totals, tax-inclusive guarantees or theme budgets. Dollar signs below reproduce the publisher's denomination unless explicitly labelled USD or A$.

| # | Publication / Ghost evidence | Publisher-owned paid offer / observed terms | Product relevance |
|---|---|---|---|
| 1 | [Yardeni QuickTakes](https://explore.ghost.org/p/yardeni-quicktakes) | [Membership](https://www.yardeniquicktakes.com/membership/): Premium $29/month or $290/year; all research, charts and deep dives. | Expert-led research; free versus full-access comparison. |
| 2 | [ByteTree, official finance directory](https://explore.ghost.org/finance/) | [Membership](https://www.bytetree.com/membership/): Quality £19/month or £228/year; Digital £25/month; Multi-Asset £39/month; Pro £99/month. Counted as one publisher, not separate series. | Series, research library and clear tier benefits. |
| 3 | [The Diff](https://explore.ghost.org/p/the-diff) | [Subscription landing page](https://www.thediff.co/): explicitly offers Premium and three additional full issues to paying subscribers versus free weekly issue; current numeric price not exposed. | Long-form finance/technology and free-to-paid explanation. |
| 4 | [Notes on the Crises](https://explore.ghost.org/p/notes-on-the-crises) | [Paid research offers](https://www.crisesnotes.com/) and [subscription terms](https://www.crisesnotes.com/about/): premium research, paid subscription account and billing-period renewal/cancellation described; current numeric price not exposed. About page also explicitly names Ghost and sole owner Nathan Tankus. | Research series, sources and access states. |
| 5 | [Independent Vanguard Adviser](https://explore.ghost.org/p/the-independent-vanguard-adviser) | [Premium benefits](https://www.independentvanguardadviser.com/about/), [FAQ](https://www.independentvanguardadviser.com/faq-how-to/) and [billing policy](https://www.independentvanguardadviser.com/refund-policy/): premium research/archive, monthly or annual paid subscription after a 30-day trial; numeric price not exposed. Publisher identifies Tiny Jumbos LLC. | Research taxonomy and archive entitlement. |
| 6 | [Cestrian Capital Research](https://explore.ghost.org/p/cestrian-capital-research) | [Circle subscription plan](https://www.cestriancapitalresearch.com/circle/): monthly/yearly paid research tier, twice-weekly articles/reports, purchase controls and paid upgrade; numeric price not exposed. [Inner Circle](https://www.cestriancapitalresearch.com/cestrian/) is the same publisher, not another case. | Research subscription positioning. Do not copy its custom checkout or professional licensing into MVP. |
| 7 | [MBI Deep Dives](https://explore.ghost.org/p/mbi-deep-dives) | [Start Here](https://www.mbi-deepdives.com/start-here/): $30/month or $250/year for deep dives, models, archive and audio; free samples and upgrade option. Page also attributes Ghost. | Closest long-report example; samples, company topics and library. |
| 8 | [Rampart](https://explore.ghost.org/p/rampart) | [Membership](https://www.rampart.news/membership/): Premium A$65/month or A$680/year; archive/articles and full interviews. Joe Aston-led publication; higher tiers counted once. | Narrow business-intelligence niche and report series. |
| 9 | [Force of Infection](https://explore.ghost.org/p/force-of-infection) | [Regional edition offer, published Sep 28, 2026](https://www.forceofinfection.com/regional-editions-begin-oct-18/): $5/month or $60/year for weekly state-level regional reports; national edition free. | Expert-led, data-heavy research with precise paid benefits. Clinical sister product not counted separately. |
| 10 | [Tangle](https://explore.ghost.org/p/tangle) | [Membership](https://www.readtangle.com/membership/) and [benefits](https://www.readtangle.com/membership-details/): newsletter $6/month or $59/year, premium editions/archive/comments; explicitly independent and investor-free. | Adjacent newsletter paywall and archive packaging. |
| 11 | [Platformer](https://explore.ghost.org/p/platformer) | [About / paid benefits](https://www.platformer.news/about/), [subscription entry](https://www.platformer.news/): paid subscriptions provide additional weekly updates and Sidechannel; current numeric price not verified. | Technology reporting; clear free/paid split. |
| 12 | [404 Media](https://explore.ghost.org/p/404-media) | [Membership](https://www.404media.co/membership/): Supporter $10/month or $100/year; unrestricted articles and reporting/podcast extras. Identifies independent media company. | Specialist technology journalism; access benefits. |
| 13 | [The Lever](https://explore.ghost.org/p/the-lever) | [Homepage subscription panel](https://www.levernews.com/): $10/month; reporting/archive, premium podcasts and subscriber events. Reader-supported publication. | Investigative publication and archive value. |
| 14 | [The Browser](https://explore.ghost.org/p/the-browser) | [Subscription plans](https://thebrowser.com/the-viewer/): $5/month or $48/year for curated reading and Sunday deep dive; page also attributes Ghost. | Text-oriented curation and subscription cadence. |
| 15 | [Hearing Things](https://explore.ghost.org/p/hearing-things) | [Membership](https://www.hearingthings.co/membership/): CD Quality $7/month or $70/year, articles/podcast/community; explicitly worker-owned and independent. | Adjacent expert editorial membership. |
| 16 | [Escape Collective](https://explore.ghost.org/p/escape-collective) | [Member plans](https://escapecollective.com/member-benefits/) and [FAQ](https://escapecollective.com/faqs/): Escape Member–USD $12.99/month for archive, exclusive podcasts and community. Regional currency plans are not separate cases. | Specialist reporting and archive access. |
| 17 | [Rascal News](https://explore.ghost.org/p/rascal-news) | [Subscription FAQ](https://www.rascal.news/faq/): explicitly paid subscriptions, upgrade/downgrade, payment handling and full-text RSS for paying subscribers; numeric price not exposed. Worker-owned and writer-led. | Small expert editorial team; paid reading benefits. |
| 18 | [Hell Gate](https://explore.ghost.org/p/hell-gate) | [Membership](https://hellgatenyc.com/membership/): Friend $6.99/month or $70/year, unlimited articles/newsletters/comments; worker-owned local publisher. | Adjacent small-team publication with clear entry tier. |
| 19 | [Dublin Inquirer](https://explore.ghost.org/p/dublin-inquirer) | [Membership](https://www.dublininquirer.com/membership/): Digital €8/month or €96/year; unlimited articles and archive. Page identifies independent publication and explicitly attributes Ghost. | Archive value and digital/print tier clarity. |
| 20 | [Aftermath](https://explore.ghost.org/p/aftermath) | [Paid subscription offer, Oct 26, 2026](https://aftermath.site/aftermath-subscription-sale-discount/): Reader ordinarily $70/year, published promotion $52.50; Member ordinarily $100/year, promotion $75; $1 first-month offer. Promotions are time-sensitive, not guaranteed future checkout prices. [About](https://aftermath.site/about-us-contact-us/) identifies worker ownership and Ghost attribution. | Adjacent specialist journalism with paid reader versus community tiers. |

### Evidence safeguards and stop condition

The bounded continuation reviewed Ghost Explore's main, Finance, News and Top Revenue public listings, then publisher offer/FAQ pages. **Stop condition reached: 20 qualifying distinct publications.** No need to exhaust every directory or keep searching. Not a census, random sample, market-size estimate or independent demand sample.

- Removed free or unproven entries and corporate-content blogs from the qualifying count. Related Alliance brands are not counted, even though they may sell memberships.
- **Stock Market Nerd excluded:** its Ghost directory/ghost.io instance remains visible, but its [publisher announcement](https://www.stockmarketnerd.com/p/an-announcement-and-news-of-the-week) says it is moving to Beehiiv and its [current terms](https://www.stockmarketnerd.com/terms-of-use) identify Beehiiv as host. Mixed evidence is not resolved by assuming the directory is current.
- AJ Investment Research, Tax Alpha Insider and Skeptic were examined but not needed for the final 20; no unverified plan/price was added merely to fill the count.
- Ghost Explore inclusion remains official platform evidence, not a full runtime/checkout audit. Where a publisher explicitly attributes Ghost (MBI, Notes on the Crises, Dublin Inquirer, Aftermath, Browser), that is additional corroboration.
- ByteTree individual directory page timed out, but its official category listing is readable. Dynamic Portal links for several sites returned only surrounding page text. Numeric prices remain unknown where stated; no checkout was attempted.
- Static HTML included success/payment-confirmation template text on some pages. These are **not evidence of any payment or registration performed by the researcher**. Only read-only page retrievals were used.
- The 20-row public commercial-example requirement is now supported under the rule above. **Customer interviews remain 0/5; validated unmet needs 0/3; paid-intent signals for Ghost Research Pro 0/2. Full-build validation gate remains unmet.**

## Three needs to test — NOT validated unmet needs

1. **Find older research by topic, not just date.** ByteTree's series navigation, IVA's taxonomy and the archive-oriented themes make this plausible. They also show existing solutions. Ask a publisher to demonstrate a recent retrieval failure and its cost before calling this unmet.
2. **Readable long reports without hand-editing layout.** Existing TOC/responsive-table competitors show this is served in principle. Test a real report with headings, footnotes, wide tables and Ghost cards on mobile; ask what currently fails and what workaround they use.
3. **Understandable free/paid access and easier setup.** Public publisher sites visibly distinguish tiers, and vendors advertise membership setup. Ask for concrete setup/support incidents, not whether they “like” the demo. Existing native Ghost features may already solve the need.

## Remaining gate evidence (requires actual participants)

Do not represent this plan as completed interviews. Five conversations must document date, participant role, publication, permission to retain notes, existing theme/workflow, a demonstrated recent problem, workaround and switching constraint. Determine whether at least three needs recur and are genuinely unmet by current alternatives.

Two credible paid-intent signals must concern **this theme** and include a defined deliverable, price, buyer authority and concrete commitment (for example a documented pilot purchase intent with timing or an authorized preorder). Generic enthusiasm, newsletter subscription prices, third-party testimonials and competitor purchases do not count. No payment collection or outreach is authorized by this documentation/research scope.

## Fetch limitations

Ghost Explore technology page was inaccessible; not used. The individual Explore page for ByteTree failed (timeout/cache miss), so its readable category listing supplies platform evidence. Packaging Europe was an initial-pass example and is not in the revised qualifying set. Asian Century Stocks' linked site was inaccessible in the initial pass; it is excluded from the revised qualifying set. The Diff upgrade link returned the same text page; some membership pages did not expose numeric prices. The continuation did resolve Yardeni pricing and added 14 replacement publications; see the revised table. These are source/tool accessibility limitations, **not policy denials or pending approvals**. No hidden prices or missing features were inferred.
