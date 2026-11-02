# Install, configure, update and restore Ghost Research Pro

For separately delivered **private fictional sample content**, use the
[sample-trial guide](private-buyer-trial.md). Old private candidate ZIPs keep
their recorded versions/hashes; use the 0.3.0 theme below with the separate import
JSON when trying the current theme. The public theme ZIP contains no sample content.

This guide describes **version 0.3.0**: compact mobile collections, stable ordinary Page/About layout and same-topic research recommendations, retaining homepage controls, readable brand colors and native Search. Its versioned delivery channel is the [v0.3.0 Release](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.3.0). The [v0.2.0](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.2.0) and [v0.1.0](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.1.0) assets remain separate. Current support is **Ghost 6**, with exact acceptance on **6.73.0 / Node24.22.1 / Portal2.72.12**; other6.x minors are not individually verified. [Ghost 5 is EOL and historical only; Ghost 7 is unverified](support-policy.md). Version 0.3.0 declares `>=6.0.0 <7.0.0`; older assets retain their original metadata/evidence. Do not edit ZIP metadata to bypass compatibility. Project code is [MIT licensed](../LICENSE).

The [0.2.0 release evidence](release-notes-0.2.0.md#known-limitations) used stock
Portal **2.72.11** and retains its known failures. The current development follow-up
tests official Portal **2.72.12**; see the [actual new-version results](product/prd.md#acceptance-evidence-and-current-portal-follow-up).
It does not replace that Release asset or update a publication's loaded Portal.
Check the actual bundle version before applying a result to an existing site.

For the current payload's version/hash, file inventory and delivery boundary, read the [0.3.0 release notes](release-notes-0.3.0.md). The [candidate delivery guide](candidate-delivery.md) is historical 0.1.0 evidence. Real Admin UI save/reload checks are distinguished from API-only configuration checks.

The owner selected a first delivery **without a promise of the unexecuted paid-subscription lifecycle**: subscription creation/checkout, renewals, cancellation, refunds and related recovery remain unaccepted. Native Ghost membership/paid features and content-access rules are retained unchanged. This is not an end-to-end commercial-readiness claim; a future paid-lifecycle promise needs its own authorized sandbox acceptance.

## Get the theme ZIP

Download **ghost-research-pro.zip** from the [v0.3.0 Release assets](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.3.0). Keep your previous release ZIP separately. GitHub's **Code → Download ZIP** and automatic source archives are source checkouts, not the installable theme package.

CI `ghost-research-pro-theme` artifacts are for evaluating an exact development commit. If using one, unpack the artifact download and select the **inner** `ghost-research-pro.zip`, recording its commit and hash. Installing/activating a theme ZIP and importing independent fictional demo content are separate operations: this ZIP does not import posts, Pages, members, routes or demo data.

Record the tag/commit, displayed package version and SHA-256. The 0.3.0 asset must contain `package.json` version `0.3.0` and match its release hash. Old private candidates used version0.2.0 with other hashes; neither byte size nor a filename alone identifies a build. Theme installation does not update the Ghost/Portal service; inspect the actual versions separately.

Use a disposable/staging publication for the first installation and retain a recoverable backup before any authorized live-site change. You need access to Ghost's theme settings. No Node.js, npm or local build tools are required when installing a built ZIP. Building from source uses the separate [development commands](../README.md#local-checks-and-packaging). This guide does not itself authorize deployment.

## Keep a recoverable copy

Before replacing a theme, open the theme screen's **Installed** list. Use the current theme's overflow menu to download it. Save any local theme edits and note the active theme name/version. Ghost's [download/upload tutorial](https://ghost.org/tutorials/download-and-upload-a-theme/) shows this menu.

Keep downloaded backups in folders named for their version or commit, preserving the inner filename `ghost-research-pro.zip`. Uploading a differently named ZIP can install another theme entry instead of replacing the original one. A same-name overwrite replaces the installed files; it does not retain a separate selectable history entry for each version.

A theme ZIP contains templates and assets. It is not a backup of publication content, members, uploaded media, routing or publication settings. Theme rollback restores the theme files; it does not undo content edits or upgrade/downgrade Ghost itself.

## Install and activate

1. In Ghost 6, open **Settings**, find the **Theme/Design** area and choose **Change theme**. Labels/grouping can differ by minor version. Ghost's [installation guide](https://ghost.org/help/installing-a-theme/) illustrates the current interface.
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

Ghost 5 operators: Ghost 5 reached EOL in January 2026. Follow the [official
upgrade process](https://docs.ghost.org/update/) or your provider's supported
route before using the current candidate. The [historical failure investigation](engineering/ghost5-portal-compatibility.md)
is not an accepted Portal upgrade recipe. The theme ZIP does not upgrade Ghost
or replace Portal, and the old defects remain unresolved.

- **No Membership template:** activate this theme, reload the editor and check the page's template selector. The package must include `custom-membership.hbs`; installing the theme does not create that page or a navigation item.
- **A page is missing from the menu:** add its published URL to primary navigation and save. The footer shows copyright and RSS; secondary navigation appears in the research sidebar.
- **Upload/version confusion:** confirm you selected the inner package, retained its filename and checked the intended active row. Cancelling or receiving a validation error is not a successful update.
- **Comment-notification feedback depends on the actual Portal version:** the published 0.2.0 run with Portal 2.72.11 recorded premature success on an interrupted write. An intended opt-out could remain unsaved. Reopen/reload and verify the value, explicitly retrying if needed; a success message alone is insufficient. The [historical comment evidence](engineering/comment-preference-acceptance.md) remains unchanged. Official Portal 2.72.12 follows the [upstream repair](https://github.com/TryGhost/Ghost/pull/32314); its [current full rerun](product/prd.md#acceptance-evidence-and-current-portal-follow-up) is separate evidence, not proof an existing site has upgraded or that notification delivery was tested. Ghost5/Portal 2.51.5 retains comment feedback and [newsletter HTTP limitations](engineering/account-http-acceptance.md). The theme does not replace Portal.
- **Choosing a build for delivery:** use the [release notes](release-notes-0.3.0.md), [support policy](support-policy.md), [license inventory](engineering/release-licensing-inventory.md) and [dependency findings](engineering/dependency-security.md). Historical Ghost5 failures remain failures outside current support. Investigate any supported-profile failure, protected-content exposure, broken installation or package/hash mismatch.
