# Controlled account HTTP failure acceptance

Four strict cases extend the existing disposable member tests: profile name and newsletter subscription, each under HTTP 503 and HTTP 429. Only browser PUTs to the loopback `/members/api/member/` endpoint receive the injected JSON error and `Retry-After: 1`. No real service is overloaded or rate-limited. The official pinned Portal bundles are unchanged.

Each case records request phases/counts, response status/header, relative timing and boolean observations in `account-http.json`. Member responses, draft values, cookies and tokens remain in memory. Fault screenshots show only deliberately created `example.test` fixture data.

Required observations during the fault:

- The actual server member/session still exists and all inspected profile/preferences remain unchanged.
- The account UI and chosen draft remain available, with clear failure feedback and no contradictory success feedback.
- Exactly one initial PUT occurs; no implicit retry occurs during the supplied delay.

The simulated user waits at least the supplied one-second interval before explicit recovery. This records header/timing behavior; it does not claim Portal disables the UI or implements a cooldown. Profile recovery uses the same form's native Retry button. Newsletter controls autosave and have no Retry button, so recovery reopens preferences and explicitly reselects the same intended value. Successful requests are never fulfilled by the test: interception is removed, HTTP 200 must come from real Ghost, and both a member GET and a freshly opened form verify persistence. Native UI saves restore the starting fixture state afterward; no email should be sent.

The report distinguishes `explicitRetryDelayMs` (when recovery starts) from `actualRetryRequestDelayMs` (the first real retry PUT after receipt of the injected response). Both must satisfy the supplied interval; request phases/timestamps show the remaining UI navigation time.

If a failed upstream UI loses its draft, the case may reopen it solely to collect recovery/restoration evidence and let independent cases run. Its draft/feedback/account assertions remain failed. This diagnostic continuation is not an expected failure, skip, retry or pass substitution. The normal saves, visible-switch center clicks and signed-out privacy checks continue unchanged.

These probes cover only the specified controlled responses. They do not establish every server/network failure, actual external rate limiting, email-address changes, payment recovery or screen-reader conformance. Use the exact-head CI report for results; passing the earlier aborted-request tests does not establish these HTTP cases.

## Confirmed pinned upstream limitation

The first strict run, [40797929153](https://github.com/qq550723504/ghost-research-pro/actions/runs/40797929153), tested `91d2c9b057506b32908922dd6bb1f586afb2bfc4`:

| Pinned profile | Profile 503 / 429 | Newsletter 503 / 429 | Full result |
| --- | --- | --- | --- |
| Ghost 5.130.6 / Portal 2.51.5 | Pass / Pass | Fail / Fail | 106 passed, 2 failed |
| Ghost 6.73.0 / Portal 2.72.11 | Pass / Pass | Pass / Pass | 108 passed, 0 failed |

The two failures are draft loss, missing client account UI and missing failure feedback. They are not server-session loss: member GET remains authenticated and the server state is unchanged. Both cases make one injected attempt, observe `Retry-After: 1`, and can subsequently make real HTTP 200 recovery/restoration writes with reload persistence. Those recovery results do not erase the failed UI assertions. Fault screenshots show the empty legacy popup versus the retained modern preference form and error notification.

The unmodified 2.51.5 npm bundle's source map identifies the cause in `src/utils/api.js` and `src/actions.js`: `api.member.update` returns null for a non-2xx response; `updateNewsletterPreference` treats that return as success and returns `member: null`. The client account state is then removed. The profile action separately checks for a missing member and reports failure, explaining why the two profile cases pass. Version 2.72.11 throws for non-2xx responses and reaches its existing error path.

Read-only verification of the official [npm registry metadata](https://registry.npmjs.org/@tryghost%2fportal) on 2026-10-29 found 2.51.5 to be the latest stable 2.51 patch. No compatible patch update was available in that line. Restoring Portal's internal member context would require changing its request/action implementation; this theme's DOM accessibility adapter is not a safe repair surface. No bundle rewrite, global fetch shim or successful mock response is used. The strict failures remain a release gate pending an upstream fix or an explicitly validated compatibility decision. The stock Ghost 5/Portal 2.51 profile is not silently replaced by a newer Portal line.
