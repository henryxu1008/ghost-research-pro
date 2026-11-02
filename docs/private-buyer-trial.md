# Private sample content and historical buyer-trial snapshots

Version 0.3.0 includes the mobile/Page/scrollbar fixes and **More research in this
topic**. The earlier private v3/v4 packs retain their 0.2.0 candidate ZIPs,
manifests and screenshots as dated snapshots; they are not the 0.3.0 package.
Their fictional import JSON can be used separately with the current theme.
No private pack, account, screenshot or sample JSON is published in this repository
or included in the theme Release. Keep the original private files unchanged.

Version 0.3.0 and the private trial target **Ghost 6 only**;
exact acceptance targets 6.73.0 / Node24.22.1 / official Portal2.72.12. Installation
engine metadata is `>=6.0.0 <7.0.0`. Ghost 5 is EOL historical evidence and Ghost
7 is unverified. See [the support policy](support-policy.md). The original v3
pack, its screenshots and the published Releases retain their historical bytes;
the policy-aligned pack is a distinct revision with its own manifest/hash.

The intended0.3.0 installation asset is identified by the
[versioned Release record](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.3.0)
([theme ZIP](https://github.com/henryxu1008/ghost-research-pro/releases/download/v0.3.0/ghost-research-pro.zip)):
47,127 bytes /18 files, SHA-256
`1b25334abc707c12d31d6beb1659a24dec5e1c36f8bdfed2126dcc0dce28ab82`.
Confirm the Release is published and exposes the matching asset before download.
The older [v0.2.0 asset](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.2.0)
remains separate. Neither theme ZIP contains sample content. GitHub source
archives, historical CI artifacts and outer handoff ZIPs are not installation packages.

## What to install for this trial

Use a disposable authorized Ghost **6.73.0 / Node24.22.1** publication and two
separate inputs: obtain the current theme from its published Release and take
the import JSON from the separately delivered private pack. Old v3/v4 packs
still contain their recorded0.2.0 candidate theme, not0.3.0:

1. Current `ghost-research-pro.zip` from the 0.3.0 Release: upload under Design →
   Change theme → Upload, then activate. Check the 0.3.0 Release checksum first. To
   evaluate an old snapshot, use its recorded candidate ZIP and hash instead;
   do not identify an old candidate as 0.3.0.
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
  [the exact association rule](research-publishing-setup.md#more-research-in-this-topic-030).

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
Ghost5's known failures remain unchanged as EOL historical evidence; they are no
longer current support/release gates. This is a support-policy decision, not a
repair or a successful Ghost5 rerun. Historical Release evidence remains
unchanged. Merging, versioning, releasing or deployment requires separate
authorization; a Draft PR is not permission for those actions or commercial launch.
