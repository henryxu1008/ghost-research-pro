# Install, configure, update and restore Ghost Research Pro

This is a development preview, not a production release. The tested runtime profiles are Ghost 5.130.6 and Ghost 6.73.0; the wider engine declaration is not a test of every Ghost version. Native Portal recovery, payments, accessibility and project licensing still have [open release gates](engineering/qa-checklist.md#remaining-release-gates).

## Get the theme ZIP

Use the built `ghost-research-pro.zip` from the exact commit you are evaluating. In the repository's Actions tab, open its Theme CI run and download the `ghost-research-pro-theme` artifact. Unpack the artifact download and select the **inner** `ghost-research-pro.zip` for installation. GitHub's **Code → Download ZIP** is a source checkout, not the installable theme package.

Record the commit, displayed package version and SHA-256, and retain this file. Version 0.1.0 is currently used by multiple development commits, so the version label alone does not identify a build. Installing a preview does not resolve a red runtime check; review the run's individual results and known Portal failures.

You need an existing disposable Ghost publication and access to its theme settings. No Node.js, npm or local build tools are required when installing a built ZIP. Building from source uses the separate [development commands](../README.md#local-checks-and-packaging).

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

The theme currently has no custom controls under theme design settings. Use Ghost's publication/editor settings:

| Setting/content | Result in this theme |
| --- | --- |
| Publication title and description | Title in the home heading; description below it. The header uses the title when no logo is set. |
| Publication logo | Logo in the header, constrained to the available header size. |
| Primary navigation | Header menu. Add the actual published URLs of your pages; creating a page does not add a menu item automatically. Secondary navigation supplies the research sidebar's topic/year links. See [Ghost navigation](https://ghost.org/help/updating-navigation/). |
| Heading/body fonts, where exposed by Ghost | Ghost's font variables are honored; unset values fall back to Georgia/system fonts. Remote-font appearance is outside the offline acceptance coverage. |
| Publication accent color | This theme does not map Ghost's publication accent setting to its palette. Theme links/buttons and styled native card/upgrade buttons use the CSS `--accent` value (blue `#174e8b` by default). When the accessibility adapter can access the Portal iframe, it also sets Portal's `--brandcolor` to that theme value. Changing the publication accent alone therefore does not recolor these controls. Custom CSS palette edits require contrast review; there is no custom theme-color setting. |
| Post title, publication date, primary tag, excerpt | Research cards show these with author and access-policy labels; reading time is shown with access. A custom excerpt overrides the generated excerpt. The default listing is 12 posts per page. |
| Post feature image and alt text | Image on the full report page. Research cards currently use a text layout. |
| Page title/feature-image visibility | The normal page header follows the editor's visibility control. The Membership template uses the title/excerpt visibility control for its own introduction. |
| Post access setting | Ghost controls public, members, paid and tier-specific bodies. Titles, excerpts, tags and feature images remain public metadata; place protected findings in the protected body. |
| Membership signup access | Public signup offers free registration; paid-only offers plans only when Ghost reports paid signup available; invitation-only offers sign in without open registration. Existing members retain account links. |

Create ordinary static content under **Pages**. Publish it, copy its actual URL, then add it to primary navigation if needed. A requested slug can already be occupied; use the published URL rather than assuming `/about/` is yours. See [Ghost pages](https://ghost.org/help/pages/).

For the membership landing page, create a page and select **Membership** in the editor's **Template** setting, then publish it. Add its actual URL to navigation. The theme supplies the layout, not a pre-created page. Its buttons open native Portal; they do not create products or configure billing.

The Membership page follows Ghost's signup access setting. In public signup mode it offers **Join for free**, plus **View plans** when paid memberships are available. Paid-only mode never promises a free membership: it shows **View plans** when available, or an unavailable message and **Sign in** while paid signup is unavailable. Invitation-only mode shows an invitation notice and **Sign in**, with no open-registration button. Free and paid-access members who are already signed in get **Manage membership**. The header, homepage and public-report prompts follow the same availability rules; the homepage sends existing members to their account instead of asking them to register again.

These rules apply to the theme's own prompts. Publication navigation, editor links, code injection and native Portal settings remain under your control. The [configuration acceptance scope](engineering/membership-signup-acceptance.md) separates real signup-setting/member checks from render-only paid-enabled examples. Actual Stripe checkout and paid lifecycle acceptance remain unexecuted.

The page introduction and editor content are editable in Ghost. The homepage eyebrow, section labels, membership-option copy, theme palette and 12-post default are currently theme source values. They are not additional Admin controls.

To populate a disposable publication, follow the [research demo content recipe](demo-content.md). It supplies fictional Research, Brief and members-only examples, ordered tags, public summaries, pages and a manual homepage/archive walkthrough. The recipe does not create content or change membership settings automatically.

## Update the theme

1. Download the current installed theme and retain the exact candidate ZIP/commit, as above. Preserve your code edits separately: overwriting replaces those files.
2. On the same theme-management screen, upload the new package using the same `ghost-research-pro.zip` filename. Read the **Overwrite theme** confirmation before accepting it.
3. When replacing the already active theme, Ghost keeps that theme active. Close the success dialog and reload **Installed**. Verify there is one matching active entry and that its version is the one you intended. If you uploaded a separate inactive entry, activate the intended one explicitly.
4. Recheck the homepage, a report, a page, primary navigation and restricted content as a signed-out reader. Use a fresh browser tab/private window to distinguish a cached page from the currently served theme. Check any site-specific code injection or theme edits you maintain.

The focused upgrade probe downloads the installed theme through Admin, uploads a disposable higher-version package with different template/CSS markers, then uploads the downloaded backup again. It checks actual Admin uploads, version/active state, served bytes and preservation of the fixture's content/access settings. It does not test a Ghost server upgrade, custom edits, a CDN or every publication configuration.

## Restore the previous theme

If the previous theme has a different installed name and is still listed, activate that entry. If you overwrote `ghost-research-pro`, upload your saved earlier `ghost-research-pro.zip` and confirm the same-name overwrite. Close the result and verify its version and **Active** state again. For development builds sharing version 0.1.0, use your saved commit/hash record as well as a visible page check.

Repeat the frontend checks after restoring. Your publication's posts/pages and ordinary settings should remain; restoring a theme does not restore unrelated content/settings changes. Reapply custom source changes only after comparing them with the restored version.

If installation failed before activation, first inspect the existing active entry rather than deleting it. Keep the known working package available until the candidate has been checked.

## Troubleshooting and current limits

- **No Membership template:** activate this theme, reload the editor and check the page's template selector. The package must include `custom-membership.hbs`; installing the theme does not create that page or a navigation item.
- **A page is missing from the menu:** add its published URL to primary navigation and save. The footer shows copyright and RSS; secondary navigation appears in the research sidebar.
- **Upload/version confusion:** confirm you selected the inner package, retained its filename and checked the intended active row. Cancelling or receiving a validation error is not a successful update.
- **Account save reports success before failing:** this is a known issue in the pinned native Portal versions. See [account HTTP](engineering/account-http-acceptance.md) and [comment preference](engineering/comment-preference-acceptance.md) evidence. The [upstream Draft PR](https://github.com/TryGhost/Ghost/pull/32314) is a contribution under review, not an installed or released fix. This theme does not replace Portal.
- **Choosing a preview for release:** review all [QA gates](engineering/qa-checklist.md), [licensing inventory](engineering/release-licensing-inventory.md) and [dependency findings](engineering/dependency-security.md). A successful theme upload alone is not production-readiness evidence.
