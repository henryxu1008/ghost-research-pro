# Research publishing experience — bounded extension

This batch extends the content-discovery decision recorded in the separate
[PR14 PRD](https://github.com/henryxu1008/ghost-research-pro/blob/5fcec3162be2fff50383d3541b55d511250567d8/docs/product/prd.md).
It implements the owner's subsequent request for an identifiable research desk,
native topic/format/year browsing and a practical setup path. The candidate documentation now integrates and updates the [product contract](../product/prd.md) and [design specification](../product/design-spec.md) from that parallel branch. No market-validation,
pricing, licensing or release-readiness gate is marked complete.

| Surface | Data and boundary |
| --- | --- |
| Home selection | Server `get posts`, `featured:true`, newest first, limit 1; title/custom excerpt/date/tag/access only. No generated “results” or private HTML. |
| Latest / Library | Native collection/channel `posts` and `pagination`, not a client filter or a 100-item catalogue query. The channel does not change permalinks. |
| Formats | Two existing editorial slug conventions: `research`, `brief`; tags/counts read server-side, limit 2. No claim to discover arbitrary format names. |
| Topics and year menu | Native secondary navigation, curated by the operator. Each link opens a full tag archive or configured dated channel. No all-site facets or keyword search. |
| Year channel | Native `published_at` date-only lower/upper bounds. UTC January 1 inclusive, following January 1 exclusive; fixed example years require annual configuration. |
| Report metadata | Native published/updated timestamps, authors and `visibility`; reading time only with access. A policy badge is not the visitor's entitlement or a payment test. |

The date-only filter form matters: a first real-Ghost preview probe found that
full ISO strings could omit the first-day-midnight SQLite row. The corrected
range includes both first-day and final-second examples and excludes the next
year. The runtime regression uses real API-published boundary fixtures, traverses
all channel pages and checks old work outside page 1. It also verifies the
featured protected-post metadata and existing post URLs.

Real API publication also exposed a Windows/non-UTC SQLite-driver distinction:
the stored date can use local time while the public timestamp is rendered in
UTC. The isolated runtime and local candidate explicitly use `TZ=UTC`; CI records
the same condition. No OS or account timezone is changed. The setup guide requires
boundary verification before year links are enabled on another hosting setup.

Template fixtures use the actual Handlebars templates/CSS in Chromium. Their
fictional contexts verify selection/empty behavior, four visibility labels,
metadata, heading contexts and 320/768/1280px reflow with 16/32px text. They are not
real Ghost pagination or visual acceptance. The disposable Ghost matrix supplies
those server-side checks, using enough data to require several pages and no
client JavaScript for navigation. Existing TOC, Portal keyboard, membership and
packaging checks remain enabled, including the known upstream failure gates.

The ZIP allowlist is unchanged: runtime templates, assets, partials and package
metadata only. Routing examples, demo recipes/data, tests, screenshots, reports
and development dependencies stay outside it. No Portal bundle or third-party
asset was introduced into the release payload.

The [operator setup](../research-publishing-setup.md) is authoritative for the new
configuration steps; the base [demo recipe](../demo-content.md) is reused rather
than replaced. Final independent desktop/narrow screenshot and interaction
acceptance must identify its exact candidate commit. Automated fixtures and HTTP
responses do not substitute for that review.
