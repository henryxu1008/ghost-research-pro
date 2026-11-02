# Private buyer trial: local candidate, not a Release

This unreleased candidate includes the mobile collection/title and ordinary Page /
scrollbar fixes, plus a bounded **More research in this topic** section. Source
review in a Draft PR does not publish the private sample/screenshot pack, change
the official Release asset or deploy an existing preview. Package version remains
0.2.0; identify each candidate by its full commit and SHA-256, never by version
alone. The separately delivered private manifest records its original snapshot;
use the PR's exact head and CI for subsequent source revisions. The private pack
itself is not stored in this public repository.

The currently published installation package is the
[v0.2.0 Release](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.2.0)
([theme ZIP](https://github.com/henryxu1008/ghost-research-pro/releases/download/v0.2.0/ghost-research-pro.zip)):
43,482 bytes, SHA-256
`c9691d9a5c3d57224f3b899aae02e40dd3aafb77e48ff14341ede8a8b3426743`.
It has homepage fields, readable brand accent and native Search, but does not
contain these local improvements or any sample content. GitHub source archives,
historical CI artifacts and outer handoff ZIPs are not installation packages.

## What to install for this trial

Use a disposable authorized Ghost **6.73.0 / Node24.22.1** publication. The private
delivery contains two separate inputs:

1. `theme/ghost-research-pro-candidate-unreleased.zip`: upload under Design →
   Change theme → Upload, then activate. Check its manifest hash first. To
   evaluate only the published product instead, install the official ZIP above;
   do not expect the candidate-only recommendation/mobile changes there.
   Keep the normal uploaded installation name `ghost-research-pro.zip` when
   upgrading an existing installation: Ghost associates custom theme settings
   with the installed theme identity. A renamed upload can create another theme
   and require its homepage values to be entered again.
2. `content/harborcloud-buyer-trial-import.json`: import with Ghost's content
   importer (Settings → Advanced → Import/Export; labels may vary). This is five
   fictional posts and five public Pages, with three public tags. Import into an
   empty trial, once: Ghost's importer is not an idempotent synchronizer and may
   rename colliding slugs. The theme ZIP and content import JSON are different objects.
   Ghost may add an internal import-history tag; stock empty-site tags can also
   remain. The three sample public tags are Research, Brief and Demo Logistics.

The membership Page uses `custom-membership`. Its benefits and FAQ use ordinary
Ghost headings, paragraphs, lists and links, editable block by block under Pages
→ Membership. They describe this fictional free-access demo only. Before using
them for a real publication, replace them with the operator's actual content,
access policies and support terms. No price, publication cadence, customer claim,
support SLA or paid subscription is created by the sample.

## Configuration that import does not do

- **Routes:** merge `content/routes-library-example.yaml` into existing routes
  after checking conflicts; upload through the routing control. It supplies
  `/library/` and optional UTC 2025/2026 channels using imported metadata Pages.
  Do not replace unrelated routes. Verify year boundaries on the hosting runtime.
- **Menus:** add Home `/`, Report `/demo-harbor-capacity/`, Library `/library/`,
  About `/demo-about/`, Membership `/membership/`. Add desired tag/year links to
  secondary navigation. Confirm actual imported slugs before using these URLs.
- **Homepage:** Design/Customize → Homepage: enter title, introduction and
  open-signup CTA text; toggle editor selection. Empty fields fall back normally.
- **Brand:** set the Ghost brand accent. The theme maps it to a readable tone;
  a pale selected color will not be reproduced as unreadable pale text/buttons.
- **Search:** the header entry opens native Ghost Search; no new search service
  or shortcut is needed. Leave the native resources available to the site.
- **Membership:** choose actual signup policy in Ghost. This trial uses free
  registration, paid memberships off, and website-only content. No mail account,
  member, staff credential, payment integration or consent is imported. Do not
  send samples as newsletters. Check the custom Membership template after import.
- **Topics:** primary tag is Demo Logistics, Research/Brief second. See
  [the exact association rule](research-publishing-setup.md#local-candidate-more-research-in-this-topic).

## Buyer walkthrough

1. Open Home; verify your title/accent, Search entry, optional selection and list.
2. Open the public capacity report; use its TOC/table, then reach its end and open
   the related member appendix. The current report/Briefs must not be recommended.
3. While signed out, see only the appendix's public metadata and native lock.
   Read Membership to understand what free access means. Do not infer payment
   success from a button or an access label.
4. Open Library, topic and year links; return to an older report. Use Search for
   a fictional title. With a local test member, sign in and check the appendix,
   then sign out and confirm it locks again.
5. Edit a Membership paragraph/FAQ in the native editor, save website-only and
   reload the public Page. These are real content blocks, not theme settings.

The private validation record identifies which of these were run through the
actual UI, stock Admin API or source/template checks. Do not read an API import
success as proof of every graphical importer step. The trial is loopback-only,
not a public hosted demo. No real checkout, billing lifecycle, customer demand,
channel submission, pricing or legal agreement has been tested or decided here.
Ghost5's known compatibility failures and the historical Release evidence remain
unchanged. Merging, versioning, releasing or deployment requires separate
authorization; a Draft PR is not permission for those actions or commercial launch.
