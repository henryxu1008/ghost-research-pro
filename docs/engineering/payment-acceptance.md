# Payment lifecycle acceptance preparation

Status: **prepared, not executed**. The current runtime suite exercises free Portal flows and complimentary tier permissions. It creates no Stripe subscriptions and proves no billing lifecycle behavior.

Use Ghost's native Portal and billing integration. Do not add theme-side billing, webhook handlers or client-side entitlement flags. Stripe recommends an isolated [Billing sandbox](https://docs.stripe.com/billing/testing) for integration testing; do not connect production keys or reuse live customer data. The theme's CI remains credential-free.

## Required test setup

- A fresh disposable Ghost 6.73.0 publication and isolated Stripe sandbox connected through Ghost's supported setup, with two paid tiers and monthly/yearly prices.
- Test payment methods only, local test email capture, separate test members per scenario, and secrets held outside source/artifacts.
- Ghost's expected subscription/access policy recorded for the exact version before executing failure/dunning tests. `past_due` is not assumed to mean immediate loss of access.
- A webhook delivery path configured by the supported Ghost integration. Record its API version and event types. Use real sandbox subscriptions for lifecycle tests; CLI fixture events alone do not establish a real subscription relationship.
- Use [test clocks](https://docs.stripe.com/billing/testing) for eligible subscription scenarios after checking the sandbox's supported clock flow. Otherwise execute the supported sandbox lifecycle API. A simulated theme entitlement is not a substitute.

These prerequisites need an authorized sandbox connection. No account connection, credentials, tunnel, webhook registration or Stripe call was attempted during this preparation.

## Matrix

For every row, capture the Stripe sandbox subscription/invoice state, Ghost Admin member/tier state, Portal account display, and raw post HTML for anonymous, that member and a different-tier member. Assert secret body markers never appear in unauthorized HTML. Repeat anonymous requests after authenticated ones to catch cache leakage.

| Scenario | Trigger and required observations |
| --- | --- |
| Initial success | Complete native Portal sandbox checkout. Await Ghost's processed events; verify one subscription/member relationship, correct tier, paid body access, and wrong-tier denial. |
| Decline or abandoned checkout | Decline/cancel the sandbox checkout. Verify no paid access is granted by the success/cancel URL alone. |
| Authentication required | Use the documented sandbox authentication scenario. Verify pending authentication does not falsely show a completed paid subscription; confirm the final state after authentication. |
| Renewal success | Advance an eligible clock through renewal. Verify invoice settlement, unchanged tier and continued authorized access. |
| Renewal failure and recovery | Trigger failed renewal; observe Ghost's configured grace/dunning policy. Repair the sandbox method and retry; verify recovered status/access without duplicate memberships. |
| Cancellation at period end | Cancel in native account UI. Verify cancellation is shown, access matches the paid-through period, and entitlement ends after the period/events complete. |
| Immediate cancellation | Cancel the sandbox subscription immediately using the supported flow. Verify Ghost reaches the expected terminal state and removes paid/tier access. |
| Resume before cancellation | Undo a scheduled cancellation before expiry. Verify account display and future renewal recover without creating another subscription. |
| Tier change | Change A to B through native UI. Verify configured proration/effective date, both tier markers, and access on an already signed-in browser after the change. |
| Refund | Record Ghost's actual policy for refunds versus cancellations; do not assume a refund alone cancels the subscription. Verify access follows the expected subscription policy. |
| Duplicate/delayed events | Replay an already delivered sandbox event, then exercise delivery retry/delay. Verify no duplicate entitlement and eventual agreement with authoritative subscription state. |
| Invalid webhook | In the isolated instance, send a request with an invalid signature. Verify rejection and no member-state change. |

Stripe documents that webhook delivery can be retried and event order is not guaranteed in [webhook guidance](https://docs.stripe.com/webhooks). Test those conditions against Ghost's existing handler; no theme handler is introduced.

## Evidence and exit criteria

Store only sanitized scenario names, version information, expected/actual statuses, timestamps, non-secret test fixture aliases and screenshots without tokens or payment details. Do not publish keys, webhook secrets/signatures, magic links, cookies, raw payloads or databases.

Each scenario must have its own result and reproducible sandbox evidence. Leave unexecuted or unsupported rows explicitly pending. This matrix is a release gate; a passing free/complimentary suite does not close it. PR #10 remains Draft, with no merge, deployment or live payment authorized.
