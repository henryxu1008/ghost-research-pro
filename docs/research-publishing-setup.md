# Build a research desk with native Ghost

This development theme gives a small publication an editorial homepage, a
metadata-led report page and a paginated research library. It uses ordinary Ghost
posts, public tags, authors, Featured, navigation and routing. It adds no content
management or billing service. Install the ZIP using the [operator guide](user-guide.md)
first; use the [existing fictional demo recipe](demo-content.md) for the base content.

## What works immediately

- The homepage's latest list uses the existing home collection and native
  pagination. A separate **Editor's selection** shows the newest Featured post.
  Without one, a reading introduction appears instead. This is not a carousel.
- Cards show the actual primary tag, public-safe summary, author, publication
  date and Ghost visibility. Public / Members / Paid members / Selected tiers
  describes the publication's access policy, not whether this reader has paid.
- Reports show their actual published/updated timestamps, authors and access
  policy. Reading time appears only with access. “Updated” is Ghost's timestamp,
  not an audited revision log or a guarantee of substantive revision.
- Topic and author links lead to native, paginated archives. The existing
  visible-content TOC, editor cards and native membership flow remain in use.

Write a public-safe custom excerpt for every protected report. Titles, authors,
tags, summaries and images are public metadata. Keep confidential findings in the
protected body. Neither cards nor the featured selection prints report HTML.

## Configure the library once

1. Use public tags **Research** (`research`) and **Brief** (`brief`) for publication
   formats. Put the intended format first, then add topic tags such as Logistics.
   The sidebar lists these two format tags only when they have published posts.
   These names are conventions, not new content types or an enforced schema.
2. Optionally mark one or more posts **Featured**. The newest featured post is the
   selection; a protected one still exposes only its public-safe metadata.
3. Create and publish three ordinary **Pages**, website only, with the following
   exact slugs. Their titles and custom excerpts supply channel headings; their
   editor bodies are not rendered by the library template. Use public-safe copy.

   | Slug | Suggested title |
   | --- | --- |
   | `library-intro` | Research library |
   | `research-2025` | 2025 research archive |
   | `research-2026` | 2026 research archive |

4. Download/back up the site's current routes. Merge the `routes` entries from
   [the example](../examples/research-routes.yaml), keeping your existing
   collections, permalinks, taxonomies and other routes. Upload the result through
   Ghost's routing control in Settings/Labs. The theme ZIP does **not** install
   routes or create Pages. Avoid duplicate/conflicting `/library/` URLs; the
   example redirects the metadata Pages to their corresponding channel URLs.
5. Add **Library → `/library/`** to primary navigation. Add your selected topic
   archives and year channels to **secondary navigation**, for example Logistics
   → `/tag/logistics/`, 2025 archive → `/library/2025/`, 2026 archive →
   `/library/2026/`. The theme uses that menu in the research sidebar, preserving
   your labels/order. Use saved actual tag URLs if their slugs differ.
6. Check the homepage, Library, a topic, a format, both years, an author and a
   protected report while signed out. When a collection exceeds 12 publications,
   follow its older/newer links and confirm the older work is still reachable.

This is two format tags, three metadata Pages, one route-file merge and the two
native navigation menus. No custom Admin theme fields, external account or API
key is needed. Existing content remains ordinary Ghost content.

## What the browsing controls mean

The library channel lists **all published posts**, newest first, 12 per page.
Topic and format links are complete tag archives; year links are complete
server-side channels filtered on `published_at`, with inclusive January 1 and
exclusive next January 1 in **UTC**. They do not rely on year tags. Ghost channels
retain original post URLs and can contain the same post in multiple views.
See the official [routing/channel guide](https://docs.ghost.org/themes/routing)
and [server-side get helper](https://docs.ghost.org/themes/helpers/functional/get).

These are separate collection links, not combined topic/type/year facets or
keyword/full-text search. Nothing filters only the current page or downloads a
private content index. Adding a year requires one metadata Page, one dated route
and one secondary-menu link. The example supplies 2025/2026, not an automatically
growing calendar. New-year work remains available in the full library and tags
before its year link is configured. If your publishing-year convention is not
UTC, choose and verify appropriate boundaries in your routing configuration.

The supplied UTC-year recipe is tested with the Ghost **process running in UTC**
(`TZ=UTC`). On a non-UTC SQLite runtime, driver date serialization can shift the
stored boundary relative to the displayed publication date. Verify a first-day,
last-day and next-year publication before enabling these links. If the hosting
operator cannot confirm that convention, keep the full Library/topic/format
links and leave year links disabled until the boundaries are verified. Installing
the theme does not change the operating system or hosting timezone.

## A small, explicitly fictional demonstration

Keep the three base samples from [the demo recipe](demo-content.md). Optionally add:

- **Demo: A closer look at the research landscape** — public Research, secondary
  topic Demo Energy, Featured. Give it Summary, Illustrative evidence, Assumptions,
  Limitations and Sources/method sections. Label all numbers and copy invented.
- **Demo: The 2025 research starting point** — public Research, Demo Logistics,
  publication time January 1, 2025, 00:00 UTC.
- **Demo brief: The year-end reading note** — public Brief, Demo Logistics,
  publication time December 31, 2025, 23:59:59 UTC.

Use an existing authorized demo author and website-only publishing. Do not send
these to subscribers. The two 2025 samples should appear in that year channel;
the existing 2026 samples should not. A selected members-only post must show its
safe title/summary/access label without its protected headings or body. The
manual demo is not a customer testimonial, empirical study or evidence of demand.

## Change or roll back safely

Download the previous routes and record both menus before changing them. To
return to an older theme without the library template, restore its route/menu
configuration as part of the [normal theme rollback](user-guide.md#restore-the-previous-theme).
Do not delete reports, tags or members to undo a layout. Check existing post URLs
afterward. Installation, payments, licensing and other
[release gates](engineering/qa-checklist.md) remain separate from this setup.
