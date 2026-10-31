# Membership signup configuration

The theme's fixed registration prompts must agree with Ghost's signup access. The pinned Ghost 5.130.6 and 6.73.0 source packages expose `members_signup_access`, `allow_self_signup`, `members_invite_only` and `paid_members_enabled` through their public settings cache and theme data. Ghost calculates the latter values; the theme does not infer a Stripe connection or write those calculated fields. See the official [@site member options](https://docs.ghost.org/themes/helpers/data/site#site-member-data-and-options).

| Signup access | Anonymous theme-owned prompts | Existing signed-in member |
| --- | --- | --- |
| `all` | Free invitation; paid plans additionally appear when Ghost reports paid memberships enabled. | Account and Membership management; homepage points to account. |
| `paid` | No free invitation. Plans appear when paid signup is enabled; otherwise a neutral unavailable state and sign in remain. | Account and Membership management. |
| `invite` | Invitation notice/sign in; no open signup or plan invitation, even if paid memberships are enabled. | Account and Membership management. |

The header, homepage, public-report prompt and Membership template use the same public availability semantics. This does not rewrite publisher navigation/editor links, injected code or Portal's own interface. Ghost's native restricted-body/upgrade rendering remains intact.

## Controlled real-instance checks

`membership-settings.cjs` is part of the existing disposable runtime runner, after native member sessions/access fixtures are established and before session revocation. It first confirms the actual research theme is active and verifies that the anonymous/free/complimentary-paid fixtures have the expected real HTTP access to the paid report. Complimentary paid access is an entitlement fixture, not evidence of a billed subscription.

The fixture saves each of the three signup settings through the normal Admin settings API and reads it back. For every mode it opens Membership, home and a public report as anonymous, free and complimentary-paid readers. It checks signup/signin/account destinations, the free invitation, the Membership management entry and a useful anonymous Membership state. The viewport is desktop; these scenarios are not a new responsive or screen-reader audit. Screenshots and link observations are recorded without session/cookie data. The prior signup setting and its calculated fields must be restored after the scenarios, including after failures.

These real instances have no Stripe keys or connection. They explicitly require `paid_members_enabled: false`. Paid-only mode is therefore tested in its unconfigured/unavailable state rather than pretending a real checkout is available. All external and payment endpoints are blocked; no payment request may be attempted. Only temporary fixture settings/members are changed.

## Paid-enabled rendering examples

A separately labelled render-only probe compiles the actual Membership template with GScan's locked Handlebars compiler and the matching pinned Ghost equality helper. It supplies public `@site` values for paid-enabled public, paid-only and invitation-only configurations. This checks that valid paid-plan links are retained, free invitations are limited to public signup, and invitation-only registration stays closed when paid membership is enabled.

No Stripe key, connection, API response or successful transaction is fabricated. These examples are template-branch evidence only; they do not test the paid Portal UI, checkout, billing or subscription lifecycle. Those remain in the unexecuted [payment matrix](payment-acceptance.md).

## Evidence and boundaries

The effective pre-fix local baseline at `bd0431c14d248355b29a56bda979abf8511e7330` reproduced **2 passed / 9 failed** in each pinned profile: existing-member homepage registration, paid-only/invitation-only anonymous signup and the paid-enabled render branch were wrong. A preliminary temporary runner omitted theme activation and was discarded; it is not product failure evidence. The valid baseline verifies theme identity before checking routes.

The suite contains 11 probes per profile: nine real setting/reader combinations, one labelled rendering probe and one restoration probe. The fixed templates pass **11 / 0** in both focused local runs, with original settings restored and loopback ports closed. Use the exact new-head runtime artifacts for final full-suite outcomes; this document does not turn the previous Portal HTTP/comment failures into expected passes. `membership-settings.json` records scope, mode, routes/link text and setting restoration. No session storage, tokens, passwords or raw member responses are uploaded. Known [Portal account](account-http-acceptance.md) and [comment](comment-preference-acceptance.md) failures remain separate, with their release classification recorded in the [current delivery decision](portal-release-decision.md#current-delivery-decision).
