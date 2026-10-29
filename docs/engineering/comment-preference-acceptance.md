# Disposable comment notification preference acceptance

The existing account checklist includes comment preference writes. These probes exercise only that native control on the temporary `example.test` member. The disposable publication's `comments_enabled` setting is temporarily changed to `all` through Ghost Admin API, then restored in a finally block. The official Ghost 5 schema permits `off`, `all` and `paid`; no live publication setting is changed. Existing profile/newsletter/HTTP checks run before this setting change.

Three strict probes cover:

- At 360px, click the visible switch's center, verify exactly one real member PUT changes only `enable_comment_notifications`, read the member API, reload/reopen preferences and restore the original value through the same UI.
- At 1440px, focus the accessible native row/legacy switch, press Space, reload and check persisted visual/ARIA state, then press Enter to restore and reload again. Each activation must send exactly one real PUT.
- Abort one controlled loopback PUT, observe error feedback and every transient success notification, verify the authenticated server member stays unchanged and no automatic retry occurs. Reopen to recover server state, explicitly select the change, verify real HTTP 200 and reload persistence, then restore through the UI. A later error does not erase a premature success notification: contradictory success remains a strict failure.

All successful writes reach stock Ghost; no successful response is mocked. Name, email, newsletters and announcement flags must remain unchanged. The suite posts no comment, requests no external email and verifies the local SMTP count does not increase. Existing signout checks then verify profile data isolation. This is preference-storage acceptance, not notification delivery, comment posting/moderation or an actual screen-reader test.

`comment-preferences.json` records field names, boolean flags, request counts/statuses, hit testing and strict outcomes, without raw member data, credentials or cookies. Three final screenshots and one fault screenshot contain only the disposable fixture. The existing HTTP 503/429 failures remain required failures; this additional coverage cannot clear that release gate. Use the exact-head CI artifacts for results.
