# Controlled account HTTP failure acceptance

Four strict cases extend the existing disposable member tests: profile name and newsletter subscription, each under HTTP 503 and HTTP 429. Only browser PUTs to the loopback `/members/api/member/` endpoint receive the injected JSON error and `Retry-After: 1`. No real service is overloaded or rate-limited. The official pinned Portal bundles are unchanged.

Each case records request phases/counts, response status/header, relative timing and boolean observations in `account-http.json`. Member responses, draft values, cookies and tokens remain in memory. Fault screenshots show only deliberately created `example.test` fixture data.

Required observations during the fault:

- The actual server member/session still exists and all inspected profile/preferences remain unchanged.
- The account UI and chosen draft remain available, with clear failure feedback and no contradictory success feedback.
- Exactly one initial PUT occurs; no implicit retry occurs during the supplied delay.

The simulated user waits at least the supplied one-second interval before explicit recovery. This records header/timing behavior; it does not claim Portal disables the UI or implements a cooldown. Profile recovery uses the same form's native Retry button. Newsletter controls autosave and have no Retry button, so recovery reopens preferences and explicitly reselects the same intended value. Successful requests are never fulfilled by the test: interception is removed, HTTP 200 must come from real Ghost, and both a member GET and a freshly opened form verify persistence. Native UI saves restore the starting fixture state afterward; no email should be sent.

If a failed upstream UI loses its draft, the case may reopen it solely to collect recovery/restoration evidence and let independent cases run. Its draft/feedback/account assertions remain failed. This diagnostic continuation is not an expected failure, skip, retry or pass substitution. The normal saves, visible-switch center clicks and signed-out privacy checks continue unchanged.

These probes cover only the specified controlled responses. They do not establish every server/network failure, actual external rate limiting, email-address changes, payment recovery or screen-reader conformance. Use the exact-head CI report for results; passing the earlier aborted-request tests does not establish these HTTP cases.
