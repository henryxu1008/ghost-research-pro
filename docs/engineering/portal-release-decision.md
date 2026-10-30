# Portal blockers and release route

Updated 2026-10-30. The [candidate handoff](../candidate-delivery.md) is the current delivery/status summary. This changes no engine range, pinned runtime profile or strict assertion. Unified [PR17](https://github.com/henryxu1008/ghost-research-pro/pull/17) targets main and is ready for review; older PR10–16 remain open/Draft. No merge, production deployment, payment connection or license choice is authorized here.

## Pinned Portal diagnostic baseline

The font-fix candidate has a separate identity in the handoff above. The results
in this section belong to the earlier PR16 payload and are not transferred as
new-ZIP passes; use the latest exact-head PR17 checks for the current build.

Payload `993b4e25bd3d9aa227041b74f3e44bc3875c8054`, [CI41011050241](https://github.com/henryxu1008/ghost-research-pro/actions/runs/41011050241): Ghost5 **135 pass /3 fail**, Ghost6 **137 pass /1 fail**, with zero runtime skips. Validate passed; runtime and overall CI remain failed. The failure identities below are unchanged. Local Ghost6 buyer-copy installation/configuration acceptance has completed; its official API steps are distinguished from actual Admin UI upload/activation in the candidate guide.

The comment fix is now submitted as [official Ghost PR32314](https://github.com/TryGhost/Ghost/pull/32314), open and unmerged when checked on 2026-10-30 (head `f9812bb38e1b891df3668738faf401664eb515c9`). The local upstream experiments and contribution do not replace the stock Portal packages in this theme or establish a released fix.

The legacy non-2xx-to-null API chain was already fixed on Ghost's main line by [6076cd0](https://github.com/TryGhost/Ghost/commit/6076cd0f0b924e2a2189521a494a706a420ad7d4). No duplicate main-line fix is proposed for it. A verified Ghost5-compatible 2.51 backport has not been established. A main-line change is not evidence that pinned 2.51.5 is repaired.

For evaluation, use the exact stock Ghost6.73.0 profile as the primary local target; retain Ghost5's automated/static coverage and disclose that this handoff adds no local authenticated Ghost5 buyer run. Neither profile has full runtime acceptance. Notification false success can leave an intended opt-out unsaved and notifications enabled; the legacy errors can lose a local draft/client account display. These controlled probes did not demonstrate body leakage, server-session revocation or actual billing.

The dated counts, observations and proposals below document the original diagnosis; they are not the current completion state. Release still requires a supported stock repair and exact-candidate rerun. No theme-level notification suppression, global fetch interception, feature removal or experimental Portal replacement is a substitute.

## Historical diagnosis — 2026-10-29

Runtime code commit `89b2faf235ad123bb929f9e2686255f3f46ea99d`, [workflow 40801584624](https://github.com/qq550723504/ghost-research-pro/actions/runs/40801584624):

| Profile | Passed / failed / skipped | Remaining failure |
| --- | --- | --- |
| Ghost 5.130.6 / Portal 2.51.5 | 108 / 3 / 0 | Two newsletter HTTP 503/429 cases lose the draft/account UI/error feedback; one aborted comment save emits premature success. |
| Ghost 6.73.0 / Portal 2.72.11 | 110 / 1 / 0 | Aborted comment save emits premature success. |

All original 104 checks pass in both profiles. Real comment pointer/keyboard saves, reload persistence and restoration pass; the controlled failure leaves the server/session unchanged and subsequent explicit recovery/restoration uses real HTTP 200 writes. This does not excuse incorrect failure feedback. The pending screenshots visibly show success before abort: notification events are pending success at 244/284 ms and post-abort error at 604/659 ms. These are local probe observations, not production latency measurements.

Evidence: [Ghost 5 reports and 44 screenshots](https://github.com/qq550723504/ghost-research-pro/actions/runs/40801584624/artifacts/12865729408), [Ghost 6 reports and 44 screenshots](https://github.com/qq550723504/ghost-research-pro/actions/runs/40801584624/artifacts/12865674649). The original center-click, persistence, privacy and HTTP assertions remain intact.

## Repair boundary and smallest credible upstream changes

Neither failure has a safe theme-only repair. The theme controls templates/CSS and an accessibility DOM adapter; it does not own Portal's API result handling, React member state, action outcomes or notification lifecycle. A DOM adapter cannot safely reconstruct the lost member/draft or determine whether a success message represents a completed write. Hiding a toast would conceal the defect; reloading the page would discard the draft. No such workaround is implemented.

The original diagnosis proposed two narrow source changes inside Portal itself. The later isolated experiments and current contribution above are separate from the unchanged stock-theme acceptance:

1. **Legacy newsletter failure:** in `updateNewsletterPreference`, reject a missing member immediately after awaiting `api.member.update`, before returning the success action/member. Its existing catch path can then retain the prior member and report failure. This action-local guard is narrower than changing every consumer of the API helper's null result. A central API-helper change is an alternative requiring broader consumer review. Either candidate must pass the existing real 503/429 draft/session/feedback tests.
2. **Comment success feedback, both lines:** make the comment success notification depend on the confirmed successful member update inside the owning action, and remove the component's unconditional success notification. Preserve distinct notification intents for comment-only changes versus unsubscribe-all/other preference actions. If an implementation instead returns an explicit action outcome to the caller, the caller must check that outcome. Merely adding `await` is insufficient: both installed dispatchers apply failure state and do not return the updated result; the action itself also catches failures. The current regression must observe no success while pending or after abort, followed by a real explicit recovery.

These are upstream responsibilities rather than a new theme account API. Isolated candidate experiments were kept outside the theme; only the applicable current-main comment fix was submitted upstream. No patched bundle, global fetch patch or runtime bundle rewrite is shipped. The contribution is not claimed as accepted, released or production-ready.

## Exact 2.51.5 provenance and scope limits

This diagnosis is not inferred from the Portal package.json inside the older Ghost tag. The installed npm alias declares `@tryghost/portal` 2.51.5; the lock and [official version metadata](https://registry.npmjs.org/@tryghost%2fportal/2.51.5) agree on its integrity. Registry gitHead is `85a96d1588e3bdf04dcd2dadc6d01cf4da79c4a0`. Installed bundle SHA256 is `3b4a04433817b08e6cb4e0a914ce5416ccf769b3f1eaa40850a5c78027da93e5`; source map SHA256 is `9fe52709b10698dd0502cb7b4c37c6405fb920956c799a6d874c3f3be5ab11c3`.

The map's `sourcesContent` contains `../src/utils/api.js` lines 209-233 (non-2xx returns null) and `../src/actions.js` lines 286-315 (unchecked member assigned on success). Independently inspected official files at that exact gitHead show the same [API implementation](https://github.com/TryGhost/Ghost/blob/85a96d1588e3bdf04dcd2dadc6d01cf4da79c4a0/apps/portal/src/utils/api.js) and [action implementation](https://github.com/TryGhost/Ghost/blob/85a96d1588e3bdf04dcd2dadc6d01cf4da79c4a0/apps/portal/src/actions.js). The [comment callback](https://github.com/TryGhost/Ghost/blob/85a96d1588e3bdf04dcd2dadc6d01cf4da79c4a0/apps/portal/src/components/pages/AccountEmailPage.js), [unconditional notification](https://github.com/TryGhost/Ghost/blob/85a96d1588e3bdf04dcd2dadc6d01cf4da79c4a0/apps/portal/src/components/common/NewsletterManagement.js) and [dispatcher](https://github.com/TryGhost/Ghost/blob/85a96d1588e3bdf04dcd2dadc6d01cf4da79c4a0/apps/portal/src/App.js) establish the legacy feedback path. Modern callback/dispatcher/notification behavior was inspected in the installed official 2.72.11 source map and reproduced independently by its runtime probe.

The complete installed map entries for the legacy API and actions were also compared byte-for-byte with those official gitHead files: both match. Their respective source-text SHA256 values are `17afd73df4511d268a70a34cc1825658bd11eb4da5a2ff1ce8f77e3cdb71032c` and `1a7403124e1c4bba901bc9af29325b0e01cf421639a8df9a2b31493584400132`.

Ghost 5.130.6's [official default config](https://github.com/TryGhost/Ghost/blob/v5.130.6/ghost/core/core/shared/config/defaults.json) chooses the `~2.51` Portal line. The official registry checked on 2026-10-29 lists stable 2.51.0 through 2.51.5, with no later patch in that line. No verified compatible fix has been found. This does not prove every newer line incompatible, nor that no future/backported fix can exist. The exact pinned profiles establish neither all Ghost 5/6 minors nor every browser or Portal release.

## Recorded initial support decision

The owner selected **Ghost6.73.0 / Node24.22.1 / stock Portal2.72.11** as first-version
primary support/delivery. Ghost5 remains compatibility CI evidence, outside the
first delivery promise. No all6.x claim, engine restriction, test removal or
failure waiver accompanies this decision. Licensing, paid-commerce promises,
merge and Release are not authorized by it.

## Historical support options before that decision

| Route | What it resolves | What remains / decision required |
| --- | --- | --- |
| Keep Ghost 5 + 6 scope | The previous dual-line proposal. | Would require supported repairs for both lines. The owner has instead chosen the exact Ghost6 primary target above; Ghost5 evidence is retained. |
| Ghost 6 first release | Chosen exact-version primary scope; the legacy null-member issue is outside that initial promise. | The comment feedback defect still blocks Ghost6. Keep Ghost5 compatibility tests/results visible; engine metadata is unchanged. |
| Force a newer/custom Portal into Ghost 5 | Could change the failing implementation. | Compatibility and distribution responsibilities are unproven. This is not equivalent to passing stock Ghost 5 acceptance and is not recommended as a shortcut. |

Disabling comments or removing account controls would change product behavior and would not fix the underlying account lifecycle. It is not proposed as a passing substitute. No route converts current failed cases into skipped or expected-success cases.

## Recommended shortest delivery path

Implement the owner's exact Ghost6-first support decision above while retaining both compatibility matrices and every red assertion. Ghost6 still needs a supported stock comment-feedback repair; the choice does not make that fix available or convert CI to green. Ghost5's additional newsletter503/429 failures remain recorded as compatibility limitations rather than a first-version support promise.

The applicable comment repair has been submitted upstream; the old API chain has an existing main-line fix. Preserve the strict reproductions and seek a supported released repair/backport. Pin it and rerun the unchanged relevant matrix on the exact candidate. A local patched demonstration alone cannot close the stock-runtime release gate.

The **Ghost Admin UI ZIP upload/activation regression** is now complete at runtime code `e53af9a678f3152d3183e7cc1822eeb16fa6459a`, [workflow 40809348925](https://github.com/qq550723504/ghost-research-pro/actions/runs/40809348925): all four UI cases pass on both versions. [Installation evidence](admin-ui-acceptance.md) records real native writes, cancellation, invalid-ZIP safety, canonical frontend fixtures and the explicit offline system-font fallback. The remaining runtime results are 112/3 on Ghost 5 and 114/1 on Ghost 6, with only the existing Portal failures.

The remaining release-path responsibility is a supported native Portal repair and candidate validation. The historical Admin batch did not itself create a fork or PR; the later contribution is recorded above. Project licensing, Stripe sandbox lifecycle and screen-reader acceptance still require their respective decisions/environments. No live service connection or legal choice is made here.

Release remains blocked until the native Portal failures and the remaining [QA gates](qa-checklist.md) are resolved. [HTTP scope](account-http-acceptance.md), [comment scope](comment-preference-acceptance.md), [payment preparation](payment-acceptance.md) and [licensing inventory](release-licensing-inventory.md) distinguish completed evidence from outstanding work. The full development audit still has 0 critical and 3 known high nodes; no clean-audit claim is made.
