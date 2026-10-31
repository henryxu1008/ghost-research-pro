# Install, configure, update and restore Ghost Research Pro

This guide describes **version 0.2.0**: bounded homepage controls, readable brand-color mapping and a default native Search entry. Its official delivery channel is the [v0.2.0 Release](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.2.0). The previous [v0.1.0 Release](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.1.0) remains available and does not include these three additions. The support target remains **Ghost6.73.0 / Node24.22.1 / stock Portal2.72.11**, not every6.x version. Ghost5.130.6 remains compatibility CI evidence, outside that support promise. Its tests and failures stay enabled; the wider installation-engine declaration is not a verified-support warranty. Project code is [MIT licensed](../LICENSE). Read the [0.2.0 release notes and known limitations](release-notes-0.2.0.md#known-limitations) before installing; accepted Portal failures are not represented as repaired or passing.

For the current payload's version/hash, file inventory and delivery checklist, read the [0.2.0 release notes](release-notes-0.2.0.md). The [candidate delivery guide](candidate-delivery.md) is historical 0.1.0 evidence. Real Admin UI save/reload checks are distinguished from API-only configuration checks.

The owner selected a first delivery **without a promise of the unexecuted paid-subscription lifecycle**: subscription creation/checkout, renewals, cancellation, refunds and related recovery remain unaccepted. Native Ghost membership/paid features and content-access rules are retained unchanged. This is not an end-to-end commercial-readiness claim; a future paid-lifecycle promise needs its own authorized sandbox acceptance.

## Get the theme ZIP

Download **ghost-research-pro.zip** from the [official v0.2.0 Release assets](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.2.0). Keep the previous v0.1.0 ZIP as a separate rollback copy. GitHub's **Code → Download ZIP** and the Release's automatic source archives are source checkouts, not the installable theme package.

CI `ghost-research-pro-theme` artifacts are for evaluating an exact development commit. If using one, unpack the artifact download and select the **inner** `ghost-research-pro.zip`, recording its commit and hash. Installing/activating a theme ZIP and importing independent fictional demo content are separate operations: this ZIP does not import posts, Pages, members, routes or demo data.

Record the tag/commit, displayed package version and SHA-256, and retain this file. The 0.2.0 asset must contain `package.json` version `0.2.0` and match its release hash. Earlier development previews used version 0.1.0, including a 43,482-byte preview with a different hash; neither byte size nor version label alone identifies a build. Installation does not resolve an existing Portal failure; review the individual results.

Use a disposable/staging publication for the first installation and retain a recoverable backup before any authorized live-site change. You need access to Ghost's theme settings. No Node.js, npm or local build tools are required when installing a built ZIP. Building from source uses the separate [development commands](../README.md#local-checks-and-packaging). This guide does not itself authorize deployment.

## Keep a recoverable copy

Before replacing a theme, open the theme screen's **Installed** list. Use the current theme's overflow menu to download it. Save any local theme edits and note the active theme name/version. Ghost's [download/upload tutorial](https://ghost.org/tutorials/download-and-upload-a-theme/) shows this menu.

Keep downloaded backups in folders named for their version or commit, preserving the inner filename `ghost-research-pro.zip`. Uploading a differently named ZIP can install another theme entry instead of replacing the original one. A same-name overwrite replaces the installed files; it does not retain a separate selectable history entry for each version.

A theme ZIP contains templates and assets. It is not a backup of publication content, members, uploaded media, routing or publication settings. Theme rollback restores the theme files; it does not undo content edits or upgrade/downgrade Ghost itself.

## Install and activate

1. Open **Settings**, find the **Theme/Design** area and choose **Change theme**. The labels/grouping differ between Ghost 5 and 6; both lead to the theme-management screen. Ghost's [installation guide](https://ghost.org/help/installing-a-theme/) illustrates the current interface.
2. Choose **Upload theme** and select the inner `ghost-research-pro.zip`.
3. Read the validation result. If Ghost rejects the archive, close the error and obtain the correct built package. A missing `index.hbs` often means the wrong ZIP was selected. Do not edit the package metadata to silence compatibility errors.
4. On a successful first upload, choose **Activate**. In **Installed**, verify the name `ghost-research-pro`, the intended version and the **Active** label.
5. Open the public site in a separate tab. Check the homepage, one report and one published page. The header, report body and stylesheet should render. Check both desktop and narrow-screen navigation before continuing with configuration.

Cancelling the upload before selection or cancelling the overwrite confirmation keeps the active theme. A rejected archive should also leave it active. These cases are covered by the [native Admin UI acceptance](engineering/admin-ui-acceptance.md).

## Configure the existing layout

For the optional paginated Library and publication-year channels, follow the [research desk setup](research-publishing-setup.md). The normal home/tag/author pages work without installing that optional routing.

In version 0.2.0, open **Design & branding → Customize → Theme → Homepage** (labels vary by Ghost version). Four bounded settings are available:

| Theme setting | Meaning |
| --- | --- |
| Hero title | Plain-text home heading; empty uses the publication title. |
| Hero description | Plain-text introduction; empty uses the publication description. |
| Hero signup label | Open-registration CTA only; empty uses **Get research updates**. It never relabels **Your account**, **Sign in** or paid-only **View plans**. |
| Show editor selection | On by default. Shows the newest Featured post, or the reading guide if none exists. Off removes that whole column and gives the introduction a compact single-column layout, including on narrow screens. Latest research and pagination remain. |

Text is escaped, with no HTML injection or page builder. Save and reload the public homepage to verify the result. Existing members always get their account; open registration may use the custom label; paid-only signup shows **View plans** only when Ghost reports paid memberships enabled; invitation-only/unavailable registration shows **Sign in**. The published v0.1.0 package has no custom theme controls.

Use Ghost's publication/editor settings for the remaining content:

| Setting/content | Result in this theme |
| --- | --- |
| Publication title and description | Title in the home heading; description below it. The header uses the title when no logo is set. |
| Publication logo | Logo in the header, constrained to the available header size. |
| Primary navigation | Header menu. Add the actual published URLs of your pages; creating a page does not add a menu item automatically. Secondary navigation supplies the research sidebar's topic/year links. See [Ghost navigation](https://ghost.org/help/updating-navigation/). |
| Heading/body fonts, where exposed by Ghost | Ghost's font variables are honored; unset values fall back to Georgia/system fonts. Remote-font appearance is outside the offline acceptance coverage. |
| Publication accent color | Version 0.2.0: Ghost's native brand color drives links, buttons, accents, styled native button/upgrade cards and the accessible Portal adapter. Already-readable hex colors are preserved; light colors are darkened along their RGB hue until text/white button labels reach at least 4.5:1 on white and the theme panel. The same tone supplies keyboard focus. Missing/invalid color or unavailable JavaScript keeps the safe blue `#174e8b` theme fallback. Portal is adapted only when its iframe is already accessible; browser permissions and the Portal package are unchanged. Author-selected card colors/custom CSS still need their own review. Published v0.1.0 uses the fixed blue theme palette. |
| Post title, publication date, primary tag, excerpt | Research cards show these with author and access-policy labels; reading time is shown with access. A custom excerpt overrides the generated excerpt. The default listing is 12 posts per page. |
| Post feature image and alt text | Image on the full report page. Research cards currently use a text layout. |
| Page title/feature-image visibility | The normal page header follows the editor's visibility control. The Membership template uses the title/excerpt visibility control for its own introduction. |
| Post access setting | Ghost controls public, members, paid and tier-specific bodies. Titles, excerpts, tags and feature images remain public metadata; place protected findings in the protected body. |
| Membership signup access | Public signup offers free registration; paid-only offers plans only when Ghost reports paid signup available; invitation-only offers sign in without open registration. Existing members retain account links. |

Create ordinary static content under **Pages**. Publish it, copy its actual URL, then add it to primary navigation if needed. A requested slug can already be occupied; use the published URL rather than assuming `/about/` is yours. See [Ghost pages](https://ghost.org/help/pages/).

For the membership landing page, create a page and select **Membership** in the editor's **Template** setting, then publish it. Add its actual URL to navigation. The theme supplies the layout, not a pre-created page. Its buttons open native Portal; they do not create products or configure billing.

The Membership page follows Ghost's signup access setting. In public signup mode it offers **Join for free**, plus **View plans** when paid memberships are available. Paid-only mode never promises a free membership: it shows **View plans** when available, or an unavailable message and **Sign in** while paid signup is unavailable. Invitation-only mode shows an invitation notice and **Sign in**, with no open-registration button. Free and paid-access members who are already signed in get **Manage membership**. The header, homepage and public-report prompts follow the same availability rules; the homepage sends existing members to their account instead of asking them to register again.

These rules apply to the theme's own prompts. Publication navigation, editor links, code injection and native Portal settings remain under your control. The [configuration acceptance scope](engineering/membership-signup-acceptance.md) separates real signup-setting/member checks from render-only paid-enabled examples. Actual Stripe checkout and paid lifecycle acceptance remain unexecuted.

The page introduction and editor content are editable in Ghost. The homepage eyebrow, section labels, membership-option copy and 12-post default remain theme source values. They are not additional Admin controls.

### Native search

Version 0.2.0 includes a visible **Search** link in the header on every page. It uses Ghost's official `data-ghost-search` / `#/search` entry. Ghost already supplied native search through `ghost_head`: even the released v0.1.0 can enable it manually by adding a Navigation link to `#/search`. The new work supplies the default entry, not a new search engine or a claim that search was previously unavailable.

Activate Search with the keyboard, type a query, and use Escape to close it; native search returns focus to the entry and supports repeated opening. The theme adds no global shortcut. Ghost's own shortcut belongs to the native app. The official script/styles and Ghost APIs must load; blocked resources are a search failure, not an empty-results success.

Native search uses titles and permitted excerpts from up to the most recent 10,000 published posts, independently of the homepage's 12-item page. Protected excerpts are excluded by Ghost's search index. Protected titles/URLs and other public-safe metadata can still be found; keep secrets out of all public metadata. Restricted bodies, drafts and private member data must remain absent. This theme creates no private body index or external search service. See [Ghost's search documentation](https://docs.ghost.org/themes/search).

To populate a disposable publication, follow the [research demo content recipe](demo-content.md). It supplies fictional Research, Brief and members-only examples, ordered tags, public summaries, pages and a manual homepage/archive walkthrough. The recipe does not create content or change membership settings automatically.

## Update the theme

1. Download the current installed theme and retain the exact ZIP/tag/commit, as above. Preserve your code edits separately: overwriting replaces those files.
2. On the same theme-management screen, upload the new package using the same `ghost-research-pro.zip` filename. Read the **Overwrite theme** confirmation before accepting it.
3. When replacing the already active theme, Ghost keeps that theme active. Close the success dialog and reload **Installed**. Verify there is one matching active entry and that its version is the one you intended. If you uploaded a separate inactive entry, activate the intended one explicitly.
4. Recheck the homepage, a report, a page, primary navigation and restricted content as a signed-out reader. Use a fresh browser tab/private window to distinguish a cached page from the currently served theme. Check any site-specific code injection or theme edits you maintain.

The focused upgrade probe downloads the installed theme through Admin, uploads a disposable higher-version package with different template/CSS markers, then uploads the downloaded backup again. It checks actual Admin uploads, version/active state, served bytes and preservation of the fixture's content/access settings. It does not test a Ghost server upgrade, custom edits, a CDN or every publication configuration.

## Restore the previous theme

If the previous theme has a different installed name and is still listed, activate that entry. If you overwrote `ghost-research-pro`, upload your saved earlier `ghost-research-pro.zip` and confirm the same-name overwrite. Close the result and verify its version and **Active** state again. For development builds, use your saved commit/hash record as well as a visible page check.

Repeat the frontend checks after restoring. Your publication's posts/pages and ordinary settings should remain; restoring a theme does not restore unrelated content/settings changes. Reapply custom source changes only after comparing them with the restored version.

Record the four 0.2.0 homepage theme-setting values separately before returning to 0.1.0. Version 0.1.0 does not define those controls; do not rely on that older theme to preserve them. The automated temporary upgrade/rollback probe uses the current settings schema, and is not a promise that older schemas retain newly added theme settings.

If installation failed before activation, first inspect the existing active entry rather than deleting it. Keep the known working package available until the candidate has been checked.

## Troubleshooting and current limits

- **No Membership template:** activate this theme, reload the editor and check the page's template selector. The package must include `custom-membership.hbs`; installing the theme does not create that page or a navigation item.
- **A page is missing from the menu:** add its published URL to primary navigation and save. The footer shows copyright and RSS; secondary navigation appears in the research sidebar.
- **Upload/version confusion:** confirm you selected the inner package, retained its filename and checked the intended active row. Cancelling or receiving a validation error is not a successful update.
- **Comment-notification save reports success before failing:** the pinned Portal can show success before an interrupted write fails. An intended opt-out may remain unsaved, leaving notifications enabled. Reopen/reload the preference and check the saved value; if unchanged, explicitly retry when the request can complete and verify again. This is a recovery precaution, not a fix or a promise that notification delivery was tested. Normal save/reload checks pass. The owner accepted this disclosed limitation for the first delivery; strict failure checks remain red. See [comment evidence](engineering/comment-preference-acceptance.md). Ghost5 has additional [newsletter HTTP limitations](engineering/account-http-acceptance.md) and is outside initial support. The [upstream PR](https://github.com/TryGhost/Ghost/pull/32314) is not an installed released repair; this theme does not replace Portal.
- **Choosing a build for delivery:** use the [release notes](release-notes-0.2.0.md), [core-function checklist](engineering/qa-checklist.md#remaining-release-gates), [license inventory](engineering/release-licensing-inventory.md) and [dependency findings](engineering/dependency-security.md). Known upstream failures are disclosed exceptions, not green tests. Investigate any new failure, protected-content exposure, broken installation or package/hash mismatch before publication.
