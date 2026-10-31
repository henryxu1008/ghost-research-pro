# Candidate handoff — not a published release

Prepared 2026-10-30; delivery decision updated 2026-10-31. This is the unpublished
0.1.0 release-preparation candidate. Core publishing, protected-content and
installation paths have passing evidence. The owner accepted the known stock
Portal comment-save feedback issue as a disclosed limitation rather than
blocking the whole theme's delivery. Strict failures remain real and visible;
new defects are not covered by that decision. See the
[release notes and package inventory](release-notes-0.1.0.md). Project files are under [MIT](../LICENSE),
including its commercial-use/distribution/sale permissions and notice conditions.
This is not a production-readiness claim or an additional license restriction.

## Identify this build

| Item | Exact value |
| --- | --- |
| Runtime source | Unified PR17, native font and Portal placeholder contrast fixes plus owner-selected MIT; exact source HEAD is recorded in its PR and the handoff manifest |
| Package name / version | `ghost-research-pro` / `0.1.0` |
| Installable filename | `ghost-research-pro.zip` |
| Size / payload | 40,181 bytes / 16 regular files, including `LICENSE` |
| SHA-256 | `a8f0f6642c2a747cc06ac48b4781f1861a4b668ef1464d3463d10f23f11ee5ac` |
| Current candidate checks | [PR17 checks](https://github.com/henryxu1008/ghost-research-pro/pull/17/checks); record the exact head/run before relying on their results |

This follow-up fixes archive H2 cards ignoring Ghost's configured heading font;
homepage H3 and archive H2 cards now use the same native font variable, retaining
their semantics, 24px size and 30px line height. Actual-template Chromium probes
reproduced the three archive mismatches before repair and pass afterward. The
packager preserves provided root `LICENSE`/`NOTICE` files. The owner has now
selected standard MIT and the actual root `LICENSE` is included unchanged;
no additional NOTICE obligation was identified for the original project payload.
The Portal adapter also makes visible input placeholders `#6B6B6B`, with computed
white-background contrast 5.33:1, instead of stock `#AEAEAE` at 2.22:1. Real
Chromium tests cover stock Portal 2.51.5/2.72.11 signup/signin at 360/1280px,
forward/reverse Tab, Escape, focus return and reopening without form submission.
Only the existing accessible-iframe stylesheet is extended; official Portal
bundles, permissions and membership/payment logic are unchanged. This is not a
complete WCAG or 200% zoom acceptance claim. This ZIP differs from the prior
licensed `6264dc52…dee55` build only in `assets/js/accessibility.js`; all other
15 entries, including MIT, retain their bytes. Local preview deployment and
independent visual/buyer acceptance must be identified separately by exact hash.
Keep the full commit/hash: several development builds
share version 0.1.0. An outer handoff/artifact ZIP is not the installable inner
ZIP. Verify the inner file with `Get-FileHash .\ghost-research-pro.zip -Algorithm SHA256`
on PowerShell or `sha256sum ghost-research-pro.zip` on a Unix shell.

## What can be evaluated now

- Editorial research homepage with newest actual Featured selection and a
  clear fallback, author/access/date metadata and paginated recent work.
- Consistent long-report view with visible-content TOC, native cards and
  Ghost-controlled restricted bodies.
- Native topic/author/format archives and optional complete Library/year
  channels. Each link opens a full paginated view; there is no combined facet
  or keyword search and no downloaded private content index.
- Native Ghost publishing and membership, with no additional CMS, account,
  service subscription or theme-owned billing system.

These are implemented behaviors, not evidence of demand, revenue, conversion
improvement or unique feature ownership. [PRD](product/prd.md),
[design specification](product/design-spec.md) and the dated
[market evidence](product/market-validation.md) separate those claims.

## Install and configure

Use an existing disposable Ghost publication and your authorized Admin access.
No additional administrator/API key is part of this delivery.

1. Retain the current installed-theme download, routes and both navigation
   menus. A theme ZIP is not a backup of content, members, settings or media.
2. Follow [install and activate](user-guide.md#install-and-activate): upload the
   inner ZIP, read validation feedback, activate and check the Installed row.
   Confirm the homepage, a report and an ordinary Page before configuring more.
3. Set native publication identity/fonts. Keep public-safe excerpts for
   protected work. The palette and English theme-owned labels are source
   values; no custom design-controls UI is supplied.
4. Reuse or create public format tags `research` and `brief`; put the intended
   format first and add topic tags. Featured is optional.
5. For the optional Library create website-only Pages `library-intro`,
   `research-2025`, `research-2026`, with public-safe titles/excerpts. Merge
   [research-routes.yaml](../examples/research-routes.yaml) into your backed-up
   routing instead of blindly replacing custom routes. Upload the merged file
   through Ghost's routing control. The ZIP does not create these objects.
6. Add the actual Library URL to primary navigation and selected topic/year
   links to secondary navigation. Use actual saved URLs if slugs differ.
   Add a Membership Page with its native template only if needed; this does
   not configure paid plans or Stripe.
7. Follow the [research setup checks](research-publishing-setup.md): home,
   library, topic, format, year, author, protected report and older/newer links.
   Verify year boundaries on the target host before enabling year links. The
   recipe was tested with the Ghost process in UTC; no OS-timezone change is
   performed by the theme.

Minimum optional-Library setup is two tag conventions, three metadata Pages,
one route merge/upload and two menus. An added year needs a new Page, dated
route and menu entry. Without that configuration the normal home/tag/author
views remain usable. The [fictional demo recipe](demo-content.md) is manual;
no synthetic publication data or automated importer is inside the theme ZIP.
The separate five-draft content package was not imported by this handoff.

## Update and roll back

Use the [update](user-guide.md#update-the-theme) and
[restore](user-guide.md#restore-the-previous-theme) procedures. Preserve the
inner filename on same-name replacements; Ghost overwrites files rather than
keeping a history entry for each commit. Retain your exact previous ZIP/hash.
To restore, activate a separate retained theme or upload the previous same-name
ZIP, then verify its active row and served page/assets. Restore routes/menus as
well if reverting to a theme without the Library template. Do not delete posts,
members or tags to undo a layout. Theme rollback does not downgrade Ghost.

## Tested profiles

The owner selected **Ghost6.73.0 / Node24.22.1 / stock Portal2.72.11** as the
first-version primary support/delivery target. No all6.x promise is made.
Ghost5 remains compatibility CI evidence, outside the first delivery commitment.
Both test profiles and all strict failures remain enabled. The permissive
`engines.ghost >=5.0.0` installation metadata is retained to avoid blocking
existing installations; it is not the promised support range.
Only these exact profiles have runtime evidence:

| Runtime / stock Portal | Exact-payload evidence | Limits |
| --- | --- | --- |
| Ghost5.130.6 / Node22.23.4 / Portal2.51.5 | Source/ZIP GScan 0 errors/0 warnings; CI real Admin install/backup/upgrade/rollback and all nine research checks pass. Runtime 135 pass / 3 fail / 0 skip. Additional local Node22 source/ZIP scans pass. | No new local authenticated Ghost5 buyer run; its two newsletter HTTP cases and comment feedback remain red. |
| Ghost6.73.0 / Node24.22.1 / Portal2.72.11 | Same static/CI installation/research coverage; runtime 137 pass / 1 fail / 0 skip. Additional isolated local buyer-copy acceptance described below. | Comment feedback remains red; billing and complete accessibility unexecuted. |

No other minor versions, Node versions or browsers become supported by this
table. Ghost5's row records compatibility results, not first-version support.
The broader engine declaration is not a verified-support or production-readiness
warranty. The Ghost6-first decision does not turn any failed check green,
authorize a license/payment promise or approve a merge/release.

## Acceptance evidence and method

The profile counts, local buyer-copy run and 21-screen independent visual review
below are **historical PR16 evidence**, payload `993b4e25` / ZIP `e515558f…cb5f`.
They do not by themselves validate the current ZIP. Current source/ZIP, focused
layout/publishing/Portal fixtures and complete runtime results are separately
recorded in [PR17 CI41073586729](https://github.com/henryxu1008/ghost-research-pro/actions/runs/41073586729). No new local administrator, buyer installation,
independent visual review or real payment is claimed for this follow-up. A later
PR17 local filesystem overlay was reported for the final payload, with served
asset-hash checks; that is not a new buyer-run Admin installation or independent
visual review. The current ZIP's real Admin install/upgrade/rollback evidence is
in exact-head CI, separately from these historical local receipts.

The exact-payload CI's validate job passed source/ZIP GScan, seven Linux
packaging checks, independent unzip CRCs and the bounded audit. Both
runtime jobs passed TOC10/10, layout3/3, stock-Portal focus4/4 and research
template4/4 fixtures. The runtime jobs and whole run remain failed as above.

Additional local Ghost6 acceptance used a separate loopback-only synthetic
copy and one authorized temporary administrator. It is execution by the original
development thread, not an independent review or buyer usability study:

| Operation | Method and result |
| --- | --- |
| Exact ZIP installation | Real Ghost Admin UI upload200, activation200, unique Active row, served CSS match and all 15 installed file bytes matching the ZIP. |
| Initialization/login | Official Admin setup/session APIs, in-memory test credentials. Graphical initial-setup/login forms not exercised. |
| Format tags / metadata Pages | Official Admin APIs; two existing tags reused/saved, three Pages published website-only and read back. |
| Routes / navigation | Official Admin APIs; routes backed up/uploaded/downloaded with matching hash, six primary/four secondary links saved and read back. These editor click paths were not tested individually. |
| Anonymous reading | 20 publications traversed over two complete Library pages; 2025 count2, 2026 count18, Research18, Brief2 and topic5; all relevant pages traversed. Date boundary, Featured metadata, metadata-page redirects and no restricted body/headings in anonymous HTML verified. |
| Safety/cleanup | Logout204 and unauthorized readback; test HTTP/SMTP ports stopped; external delivery0 and SMTP messages0. Original previews/data unchanged; no new reader accounts or API keys. |

The initial helper attempt reached native upload success but used the wrong
modal selector and stopped before activation. The helper was corrected and the
same isolated scenario passed; both attempts were retained. No product/guide
defect was inferred or hidden. An exact cosmetic Bunny-font stylesheet fallback
used system fonts in offline Admin tests; remote-font appearance is unproved.

Local receipts and retained rollback files are intentionally outside Git. No
screenshots, account data, databases, secrets or local machine paths belong in
the public repository or candidate ZIP. Independent visual review separately
reported no P0/P1/P2 in 21 captured screens; those screenshots remain local and
do not substitute for the unexecuted checks below.

## Known limitations and publication requirements

The owner's first-version promise excludes the unexecuted paid-subscription
lifecycle (creation/checkout, renewal, cancellation, refunds and related
recovery). Native Ghost membership/paid features and access rules stay intact;
no end-to-end commercial readiness is claimed. Those scenarios remain explicitly
unaccepted and required before adding a paid-lifecycle promise. This choice
does not claim Portal recovery is fixed or broader acceptance completed. MIT is
already selected/included. The owner's 2026-10-31 decision accepts the specific
comment-feedback limitation for first delivery while keeping core checks and
all strict test results intact.

1. **Accepted stock Portal limitation:** Ghost5 newsletter HTTP503/429 can lose the client
   draft/account display/error feedback while the server member/session stays
   intact. Both pinned Portals can announce a comment-preference save before
   an aborted request subsequently fails. The intended change may not persist;
   a success toast is not reliable proof of that write. A failed attempt to turn
   notifications off may leave them enabled, so the reader could continue to
   receive notifications. Reopen/reload and check
   the actual saved preference before relying on it. This is diagnostic advice,
   not a fix or passing substitute. This known comment-feedback issue no longer
   blocks the entire theme's delivery under the owner's decision. Ghost5 remains
   outside initial support. [Repair ownership](engineering/portal-release-decision.md)
   and the strict tests remain unchanged; no patched Portal/global fetch hack
   is shipped. [Upstream PR32314](https://github.com/TryGhost/Ghost/pull/32314)
   is open, not a released installed repair. These probes did not show protected
   body leakage, server-session revocation or a real charge.
2. **Development tooling:** the 2026-10-31 local audit refresh reports 0 critical /
   3 known high / 3 moderate nodes (one additional minimatch advisory) in the
   development ZIP chain; the earlier CI audit counts are dated evidence. [Exact advisories and limits](engineering/dependency-security.md)
   remain visible. Dependencies are excluded from the theme ZIP; avoid scanning
   untrusted third-party archives with this toolchain.
3. **Unexecuted:** actual Stripe sandbox lifecycle, full screen-reader and
   alternate-browser review, arbitrary palettes/fonts/content combinations and
   individual graphical configuration-editor paths. Complimentary access and
   official-API saves are not substitutes for those outcomes.
4. **License and release status:** standard MIT is now selected and included,
   matching package metadata. The [payload inventory](engineering/release-licensing-inventory.md)
   records attribution and third-party boundaries. MIT does not prohibit resale
   or redistribution; keep its copyright/permission notice. No price or
   marketplace eligibility is established, and this work has not merged,
   published a Release or started a sale on the owner's behalf.

## Minimal integration plan

| PR | Base → head | Candidate relationship |
| --- | --- | --- |
| 10 | main → `feat/ghost-theme-bootstrap` at `25debe7` | Ancestor; theme and strict acceptance baseline. |
| 11 | PR10 → `feat/report-table-of-contents` at `26e8aba` | Ancestor; visible-content TOC. |
| 12 | PR11 → `docs/demo-content-setup` at `2f48533` | Ancestor; demo/operator documentation. |
| 13 | PR12 → `fix/reproducible-theme-zip` at `459faf1` | Ancestor; deterministic packager. |
| 14 | PR12 → `docs/first-version-product` at `5fcec31` | Parallel docs only. Four product/research files are integrated here, with PRD/design updated to the current implementation. Its older README/checklist edits are not applied over newer files. Dated market evidence is retained without pretending it is refreshed. |
| 15 | PR13 → `fix/audit-focus-header-headings` at `8f408a8` | Ancestor; focus/header/headings and signup keyboard boundaries. |
| 16 | PR15 → `feat/research-publishing-experience` at `993b4e2` | Runtime payload anchor. |

Following the owner's confirmation, [PR17](https://github.com/henryxu1008/ghost-research-pro/pull/17)
is the single unified delivery candidate, targeting `main` and ready for review.
Its `docs/candidate-delivery` branch contains the PR16 code chain and this
documentation reconciliation; no runtime file changes accompany the retarget.
The base changed from `feat/research-publishing-experience@993b4e25` to
`main@68acc0029dedd70b81b656f7bc292133411252ed`. At that snapshot main is the
merge base, with no divergent main commits. This is source ancestry evidence,
not a passing-check or merge-approval claim.

PR10–16 remain open with their heads unchanged; no old PR is closed or separately
merged by this consolidation. Review PR17 as a whole rather than merging the
old chain individually. Its [current checks](https://github.com/henryxu1008/ghost-research-pro/pull/17/checks)
must verify the final head against the main baseline, preserving and disclosing
the accepted Portal failure identities rather than requiring their disappearance
before bounded delivery. The older runs above
remain exact-payload evidence, not a substitute for that final-base run.

Actual merge, auto-merge, old-PR closure and release remain separate, unperformed
actions requiring their respective authorization. Known Portal failures remain
strict red checks. If merge is later authorized, one PR17 merge can include the
whole candidate; do not reapply PR14's obsolete README/checklist replacements.
Recheck the final merged commit and payload hash before any release; a GitHub
test-merge SHA is not the evaluated source commit.

For the exact user-only handoff boundary and the remaining owner choices, see
the [delivery readiness and decisions](delivery-readiness.md). No artifact upload,
merge or public release is authorized by the presence of that document.
