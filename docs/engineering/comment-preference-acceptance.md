# Disposable comment notification preference acceptance

The [release decision material](portal-release-decision.md) records why a theme DOM change cannot safely repair this request/notification lifecycle and what a narrow upstream repair must establish.

The existing account checklist includes comment preference writes. These probes exercise only that native control on the temporary `example.test` member. The disposable publication's `comments_enabled` setting is temporarily changed to `all` through Ghost Admin API, then restored in a finally block. The official Ghost 5 schema permits `off`, `all` and `paid`; no live publication setting is changed. Existing profile/newsletter/HTTP checks run before this setting change.

Three strict probes cover:

- At 360px, click the visible switch's center, verify exactly one real member PUT changes only `enable_comment_notifications`, read the member API, reload/reopen preferences and restore the original value through the same UI.
- At 1440px, focus the accessible native row/legacy switch, press Space, reload and check persisted visual/ARIA state, then press Enter to restore and reload again. Each activation must send exactly one real PUT.
- Abort one controlled loopback PUT, observe error feedback and every transient success notification, verify the authenticated server member stays unchanged and no automatic retry occurs. Reopen to recover server state, explicitly select the change, verify real HTTP 200 and reload persistence, then restore through the UI. A later error does not erase a premature success notification: contradictory success remains a strict failure.

All successful writes reach stock Ghost; no successful response is mocked. Name, email, newsletters and announcement flags must remain unchanged. The suite posts no comment, requests no external email and verifies the local SMTP count does not increase. Existing signout checks then verify profile data isolation. This is preference-storage acceptance, not notification delivery, comment posting/moderation or an actual screen-reader test.

`comment-preferences.json` records field names, boolean flags, request counts/statuses, hit testing and strict outcomes, without raw member data, credentials or cookies. It records first success/error notification events with relative timing and pending/aborted phase. The controlled failure holds its one request for two render frames, captures pending feedback before abort, then captures the eventual error. It never waits for success as a prerequisite to aborting. Three final screenshots, a pending screenshot and a fault screenshot contain only the disposable fixture. `comment-settings.json` records the publication's before/enabled/after values read back from Ghost; restoration is asserted.

## Confirmed upstream feedback failure

The first strict run at `3bc614f133270bd0ad052b14e8117df217f7d1fc`, [40800743922](https://github.com/qq550723504/ghost-research-pro/actions/runs/40800743922), passed both pointer/keyboard roundtrips in both profiles. Each normal roundtrip made two real HTTP 200 writes, survived reload and restored the initial flag without changing other inspected member fields or sending mail.

The aborted-save feedback case failed in both Portal 2.51.5 and 2.72.11: its notification observer recorded both success and failure. The actual server/session remained unchanged, exactly one aborted attempt occurred, explicit recovery/restoration made two real HTTP 200 writes, reload persisted and no mail was sent. These diagnostic successes do not clear the contradictory-feedback failure. Full results were Ghost 5 **108 passed / 3 failed** and Ghost 6 **110 passed / 1 failed**; Ghost 5's other two failures are the existing newsletter HTTP 503/429 cases.

The installed official source maps identify the cause. `AccountEmailPage` / `account-email-page` provides an async `updateCommentNotifications` callback that starts `onAction` / `doAction` without awaiting or returning it. `CommentsSection.handleToggle` awaits that already-resolved callback and then displays its success notification before the member request settles. Legacy source is independently available at the registry's exact [2.51.5 gitHead callback](https://github.com/TryGhost/Ghost/blob/85a96d1588e3bdf04dcd2dadc6d01cf4da79c4a0/apps/portal/src/components/pages/AccountEmailPage.js) and [notification handler](https://github.com/TryGhost/Ghost/blob/85a96d1588e3bdf04dcd2dadc6d01cf4da79c4a0/apps/portal/src/components/common/NewsletterManagement.js). This is internal request/action outcome handling; the theme does not replace it, alter global fetch or suppress native notifications to conceal the failure.

The existing HTTP 503/429 failures and this comment-feedback failure remain required release gates. This additional coverage cannot clear them. Use the latest exact-head CI artifacts for final results.
