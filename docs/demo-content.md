# Set up a research publication demo

Use this plan after [installing the development preview](user-guide.md) in a disposable Ghost publication. It is a manual content recipe, not an importer or an account setup script. All names, copy and numbers below are fictional demonstration material, not research findings. Keep that label in any screenshots or shared demo.

These steps use ordinary posts, public tags and existing authors. They do not require changing routing, membership signup settings, staff permissions or billing. Use the publication's existing authorized demo author; do not invite staff or modify an account just to follow this recipe. Menu labels can differ between Ghost 5 and 6.

## How the content maps to the theme

| Content | What readers see |
| --- | --- |
| Published posts | The homepage's **Latest research** list includes all posts in Ghost's home collection, including Brief and members-only posts. The theme does not filter that list by tag. With standard Ghost routing, newer publication dates appear first; the theme defaults to 12 posts per page. |
| First public tag on a post | The card label and report's linked eyebrow. The card also shows date, title, excerpt and reading time when the visitor has access; it uses a text layout, with an author byline and actual access-policy label. |
| Any public tag assigned to a post | Its tag archive includes the post, even when that tag is not primary. The archive heading uses the tag name and description. With standard routing, a tag with slug `research` has the URL `/tag/research/`. |
| Post author | The report byline links to the author's archive. That archive uses the author's name and available bio, followed by their posts. |
| Custom excerpt | The card summary and report introduction. Without one, the card attempts a generated 28-word excerpt; the report introduction is omitted. Write a public-safe custom excerpt for every demo post, especially a restricted one. |
| Visible body H2/H3 headings | The report's **On this page** navigation. H3 sections nest under the preceding H2; headings excluded from the rendered body cannot supply entries. A post without eligible headings keeps the navigation hidden. Ordinary Pages do not have this post TOC. |
| Featured flag / Brief tag | The newest Featured post becomes the homepage editorial selection. Without one, a reading introduction appears. Brief remains a tag convention using the shared post template. |

The mapping comes from [index.hbs](../index.hbs), [card.hbs](../partials/card.hbs), [post.hbs](../post.hbs), [tag.hbs](../tag.hbs), [author.hbs](../author.hbs) and the [TOC enhancement](../assets/js/accessibility.js). Existing custom routing may change URLs or collection membership; this recipe does not replace it.

## 1. Prepare three public tags

In Ghost Admin, open **Tags** and create or reuse the following public tags. Check the actual saved slugs and URLs; an existing name or slug may already be in use.

| Name | Suggested slug | Description |
| --- | --- | --- |
| Research | `research` | Fictional long-form research examples for this demo. |
| Brief | `brief` | Fictional short updates for this demo. |
| Demo Logistics | `demo-logistics` | A made-up topic used to demonstrate a shared archive. |

Add these tags in each post's settings, with **Research** or **Brief** first and **Demo Logistics** second. Reorder them there if necessary. The first public tag is the theme's visible label, while both tags contribute archive membership. Do not prefix these public category names with `#`: Ghost treats those as internal tags. See [Ghost's tag guide](https://ghost.org/help/tags/) for the native controls.

## 2. Draft the three posts

Open **Posts**, create a draft for each row and use the normal post template. In post settings, fill in the URL, ordered tags, custom excerpt, author and post access. Select the existing authorized demo author for all three so their archive has a useful collection. These fields are described in [Ghost's post settings](https://ghost.org/help/post-settings/).

| Title / suggested slug | Ordered tags | Access | Custom excerpt |
| --- | --- | --- | --- |
| Demo: Harbor capacity scenarios / `demo-harbor-capacity` | Research, Demo Logistics | Public | Fictional demo: compare two made-up capacity scenarios and the assumptions behind them. |
| Demo brief: Lab notebook / `demo-lab-notebook` | Brief, Demo Logistics | Public | Fictional demo: a short update on the sample dataset and the next review. |
| Demo member note: Scenario appendix / `demo-scenario-appendix` | Research, Demo Logistics | Members only | Fictional demo: sign in to read the sample scenario appendix. This summary contains no restricted findings. |

### Public report body

Begin with **Fictional demonstration content. These are invented examples, not measured results.** Add these sections using the editor's Heading 2 and Heading 3 formats; the post title already supplies H1:

- H2 **Summary** — “This sample compares Harbor A and Harbor B to demonstrate a report layout.”
- H2 **Illustrative dataset** — Add a Markdown card containing the small table below. The values are invented units with no real-world reference.
- H3 **Assumptions** — “Both scenarios use the same invented baseline. No external dataset was consulted.”
- H2 **Limitations** — “This page demonstrates formatting and navigation only. It provides no operational or investment advice.”

Paste this into the Markdown card, leaving the section headings in their own editor blocks:

```markdown
| Fictional scenario | Baseline units | Example units |
| --- | ---: | ---: |
| Harbor A | 100 | 104 |
| Harbor B | 100 | 97 |
```

No image or chart service is needed. If you later add your own feature image, supply alt text in the editor; this theme displays it on the report, not on the listing card.

### Brief body

Use two short paragraphs with no H2/H3 headings:

> Fictional demonstration content. The sample dataset has been prepared for a layout review. No real organizations or observations are represented.
>
> The next demo review will compare labels, summaries and links across the site.

This creates a short post whose TOC should remain hidden. Briefs use the same card and report styling as the longer report.

### Members-only body

Add the fictional-content notice, H2 **DEMO-MEMBER-HEADING-7C9** and a paragraph such as “DEMO-MEMBER-BODY: this invented appendix is only for the disposable member-access check.” The H2 is a unique fictional sentinel for the restricted body, distinct from the public title “Demo member note: Scenario appendix.” Keep both `DEMO-MEMBER-HEADING-7C9` and `DEMO-MEMBER-BODY` out of the title, custom excerpt, tags and image metadata. Do not add a public-preview divider for this simple check.

Choose **Members only** in post access; a tag named “Members” would not restrict the body. Ghost grants this access to signed-in free and paid members. For the initial demo, no paid tier or Stripe connection is needed. Leave paid-only/tier scenarios to the separate [payment acceptance plan](engineering/payment-acceptance.md); a visible signup button is not evidence of checkout or payment success. See [Ghost's protected content guide](https://ghost.org/help/protected-content/).

## 3. Publish to the demo website

Review the drafts and their public metadata. Publish the member note first, then the long report, then the Brief if you want the Brief to be newest on the default homepage. Choose **Publish only** / website-only in the publishing flow, not newsletter delivery. Do not send these samples to subscribers. Copy each resulting published URL; use that URL if Ghost changes a requested slug. Ghost's [publishing guide](https://ghost.org/help/publishing-content/) explains the web/email choices.

Publishing is a step for the operator of the disposable demo. Adding this document does not create posts, publish a site or send email.

## 4. Add pages and a small navigation menu

Under **Pages**, create a public **Demo About** page describing the fictional publication. Use the default page template; Pages are static content and do not join the homepage post list. For an optional **Demo Membership** page, select the **Membership** template, add a fictional introduction and publish it. Its native Portal buttons follow existing signup availability; the page does not create plans or change who can join. The [installation guide](user-guide.md#configure-the-existing-layout) covers this template.

Use the publication's primary navigation editor to add **Home**, **Research**, **Brief**, **Demo Logistics** and **About**, plus **Membership** if you created it. Use the actual tag-archive/page URLs collected above. Under standard routing, Research and Brief point to `/tag/research/` and `/tag/brief/`; linking `/research/` would require a separate routing decision. Do not create a static Research page expecting it to list posts automatically. Creating content alone does not add menu items, and secondary navigation supplies the research sidebar. For the optional global Library and actual publication-year channels, use the [research desk setup](research-publishing-setup.md).

Use an existing author byline link to open the author archive; it need not occupy the main menu. No author account changes are required. See Ghost's [Pages](https://ghost.org/help/pages/) and [navigation](https://ghost.org/help/updating-navigation/) guides for the manual controls.

## 5. Walk through the expected pages

This checklist describes manual acceptance to perform on the assembled demo. It is not a record that these content-setup steps or browser checks have been executed.

- [ ] **Home:** three sample posts appear under Latest research. Each card has the intended primary tag, public-safe excerpt, date and access label. Reading time appears with access. Existing publication title/description supply the home introduction. Feature images do not create a carousel. An optional Featured post supplies the editorial selection.
- [ ] **Research archive:** both Research-tagged posts appear. **Brief archive:** only the Brief appears. **Demo Logistics archive:** all three appear, despite this being their secondary tag. Each archive shows its tag name/description.
- [ ] **Author archive:** the byline opens the existing demo author's name/bio and three assigned posts. Pages do not appear in this collection.
- [ ] **Public report:** title, custom excerpt, byline, table and body render. On this page lists Summary, Illustrative dataset, nested Assumptions and Limitations; activate a link with Tab/Enter and check focus moves to the matching heading.
- [ ] **Brief:** its two paragraphs render and no empty On this page panel appears.
- [ ] **Members-only report, signed out:** the public title/summary and Ghost access prompt are visible; neither `DEMO-MEMBER-HEADING-7C9` nor `DEMO-MEMBER-BODY` appears in the rendered body or TOC. “Scenario appendix” may still appear in the intended public metadata; it is not the private sentinel. Use the ordinary published URL, not an Admin preview/share/gift URL that may grant access.
- [ ] **Members-only report, authorized demo session:** if an existing disposable member session is available, the `DEMO-MEMBER-HEADING-7C9` H2, its matching TOC entry and the `DEMO-MEMBER-BODY` paragraph render. Otherwise mark this check unexecuted; do not claim it passed from an editor preview or from payment-free markup alone.
- [ ] **Pages/menu:** About and optional Membership open via the actual saved primary-navigation URLs. The Membership prompt agrees with the existing signup mode; this walkthrough does not test a payment or change that mode.
- [ ] **Narrow screen and enlarged text:** inspect the homepage menu, cards, long heading/TOC and table. Text should wrap; a wide table may scroll inside its own area without making the entire page scroll sideways. These are checks to perform, not a substitute for the [remaining accessibility gates](engineering/qa-checklist.md#remaining-release-gates).

Keep the exact theme commit and manual check results with any demo screenshots. Remove fictional claims before using the content as real editorial material. A completed content walkthrough does not fix native Portal failures or verify payments. The [release checklist](engineering/qa-checklist.md#remaining-release-gates) distinguishes core requirements, accepted upstream limitations and future-scope checks; demo setup itself does not block the bounded theme delivery.
