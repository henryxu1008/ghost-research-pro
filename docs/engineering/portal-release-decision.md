# Portal blockers and release route

Decision material as of 2026-10-29. This does not change the published Ghost engine range, pinned runtime profiles, required assertions or Draft status. The current scope still includes Ghost 5 and Ghost 6. No merge, deployment, paid service connection or project license choice is authorized by this document.

## What the exact code proves

Runtime code commit `89b2faf235ad123bb929f9e2686255f3f46ea99d`, [workflow 40801584624](https://github.com/qq550723504/ghost-research-pro/actions/runs/40801584624):

| Profile | Passed / failed / skipped | Remaining failure |
| --- | --- | --- |
| Ghost 5.130.6 / Portal 2.51.5 | 108 / 3 / 0 | Two newsletter HTTP 503/429 cases lose the draft/account UI/error feedback; one aborted comment save emits premature success. |
| Ghost 6.73.0 / Portal 2.72.11 | 110 / 1 / 0 | Aborted comment save emits premature success. |

All original 104 checks pass in both profiles. Real comment pointer/keyboard saves, reload persistence and restoration pass; the controlled failure leaves the server/session unchanged and subsequent explicit recovery/restoration uses real HTTP 200 writes. This does not excuse incorrect failure feedback. The pending screenshots visibly show success before abort: notification events are pending success at 244/284 ms and post-abort error at 604/659 ms. These are local probe observations, not production latency measurements.

Evidence: [Ghost 5 reports and 44 screenshots](https://github.com/qq550723504/ghost-research-pro/actions/runs/40801584624/artifacts/12865729408), [Ghost 6 reports and 44 screenshots](https://github.com/qq550723504/ghost-research-pro/actions/runs/40801584624/artifacts/12865674649). The original center-click, persistence, privacy and HTTP assertions remain intact.

## Repair boundary and smallest credible upstream changes

Neither failure has a safe theme-only repair. The theme controls templates/CSS and an accessibility DOM adapter; it does not own Portal's API result handling, React member state, action outcomes or notification lifecycle. A DOM adapter cannot safely reconstruct the lost member/draft or determine whether a success message represents a completed write. Hiding a toast would conceal the defect; reloading the page would discard the draft. No such workaround is implemented.

Two narrow source changes are plausible inside Portal itself, but are **proposals, not validated fixes**:

1. **Legacy newsletter failure:** in `updateNewsletterPreference`, reject a missing member immediately after awaiting `api.member.update`, before returning the success action/member. Its existing catch path can then retain the prior member and report failure. This action-local guard is narrower than changing every consumer of the API helper's null result. A central API-helper change is an alternative requiring broader consumer review. Either candidate must pass the existing real 503/429 draft/session/feedback tests.
2. **Comment success feedback, both lines:** make the comment success notification depend on the confirmed successful member update inside the owning action, and remove the component's unconditional success notification. Preserve distinct notification intents for comment-only changes versus unsubscribe-all/other preference actions. If an implementation instead returns an explicit action outcome to the caller, the caller must check that outcome. Merely adding `await` is insufficient: both installed dispatchers apply failure state and do not return the updated result; the action itself also catches failures. The current regression must observe no success while pending or after abort, followed by a real explicit recovery.

These are small upstream responsibilities rather than a new theme account API. Implementing a source candidate in an isolated upstream checkout and preparing an unsubmitted patch is possible independently. It must not become a shipped theme bundle, global fetch patch, runtime bundle rewrite or replacement of the stock tested Portal. No upstream issue/PR has been posted and no patched upstream build has been claimed as accepted or production-ready.

## Exact 2.51.5 provenance and scope limits

This diagnosis is not inferred from the Portal package.json inside the older Ghost tag. The installed npm alias declares `@tryghost/portal` 2.51.5; the lock and [official version metadata](https://registry.npmjs.org/@tryghost%2fportal/2.51.5) agree on its integrity. Registry gitHead is `85a96d1588e3bdf04dcd2dadc6d01cf4da79c4a0`. Installed bundle SHA256 is `3b4a04433817b08e6cb4e0a914ce5416ccf769b3f1eaa40850a5c78027da93e5`; source map SHA256 is `9fe52709b10698dd0502cb7b4c37c6405fb920956c799a6d874c3f3be5ab11c3`.

The map's `sourcesContent` contains `../src/utils/api.js` lines 209-233 (non-2xx returns null) and `../src/actions.js` lines 286-315 (unchecked member assigned on success). Independently inspected official files at that exact gitHead show the same [API implementation](https://github.com/TryGhost/Ghost/blob/85a96d1588e3bdf04dcd2dadc6d01cf4da79c4a0/apps/portal/src/utils/api.js) and [action implementation](https://github.com/TryGhost/Ghost/blob/85a96d1588e3bdf04dcd2dadc6d01cf4da79c4a0/apps/portal/src/actions.js). The [comment callback](https://github.com/TryGhost/Ghost/blob/85a96d1588e3bdf04dcd2dadc6d01cf4da79c4a0/apps/portal/src/components/pages/AccountEmailPage.js), [unconditional notification](https://github.com/TryGhost/Ghost/blob/85a96d1588e3bdf04dcd2dadc6d01cf4da79c4a0/apps/portal/src/components/common/NewsletterManagement.js) and [dispatcher](https://github.com/TryGhost/Ghost/blob/85a96d1588e3bdf04dcd2dadc6d01cf4da79c4a0/apps/portal/src/App.js) establish the legacy feedback path. Modern callback/dispatcher/notification behavior was inspected in the installed official 2.72.11 source map and reproduced independently by its runtime probe.

The complete installed map entries for the legacy API and actions were also compared byte-for-byte with those official gitHead files: both match. Their respective source-text SHA256 values are `17afd73df4511d268a70a34cc1825658bd11eb4da5a2ff1ce8f77e3cdb71032c` and `1a7403124e1c4bba901bc9af29325b0e01cf421639a8df9a2b31493584400132`.

Ghost 5.130.6's [official default config](https://github.com/TryGhost/Ghost/blob/v5.130.6/ghost/core/core/shared/config/defaults.json) chooses the `~2.51` Portal line. The official registry checked on 2026-10-29 lists stable 2.51.0 through 2.51.5, with no later patch in that line. No verified compatible fix has been found. This does not prove every newer line incompatible, nor that no future/backported fix can exist. The exact pinned profiles establish neither all Ghost 5/6 minors nor every browser or Portal release.

## Support options

| Route | What it resolves | What remains / decision required |
| --- | --- | --- |
| Keep current Ghost 5 + 6 scope | Preserves the existing product promise and evidence. | Obtain and validate both upstream repairs on supported stock Portal lines, then require all existing assertions to pass in both profiles. This remains the default until a scope decision. |
| Conditional Ghost 6 first release | Removes the legacy null-member problem from the proposed initial release scope. | The comment feedback defect still blocks Ghost 6. Owner approval is required before changing engine metadata, documentation or the supported matrix. Ghost 5 stays explicitly blocked/unsupported for that release; it cannot silently disappear from evidence. |
| Force a newer/custom Portal into Ghost 5 | Could change the failing implementation. | Compatibility and distribution responsibilities are unproven. This is not equivalent to passing stock Ghost 5 acceptance and is not recommended as a shortcut. |

Disabling comments or removing account controls would change product behavior and would not fix the underlying account lifecycle. It is not proposed as a passing substitute. No route converts current failed cases into skipped or expected-success cases.

## Recommended shortest delivery path

Concentrate the first release candidate on **stock Ghost 6 plus a verified upstream comment-feedback repair**; retain the current dual-version scope and red evidence until the owner explicitly approves a narrower initial support range. Ghost 6 already passes the controlled newsletter HTTP cases, so this candidate has one upstream responsibility rather than the legacy line's two. This is a sequencing recommendation, not a support-range change or a promise of an available fixed version.

Prepare the two source-level upstream repair proposals with their existing strict reproductions; do not add unrelated account/media matrices. An official fixed release or approved compatibility decision must then be pinned and the unchanged relevant matrix rerun on the exact candidate. A local patched demonstration alone cannot close the stock-runtime release gate.

The next shortest independently deliverable item is the **Ghost Admin UI ZIP upload/activation regression** using the existing disposable owner and bundled Admin assets. It closes an existing installation gate without third-party credentials or a product feature change. In parallel with an upstream resolution, the existing license/ZIP inventory and payment scenario evidence can be packaged for review; project licensing, Stripe sandbox connection and actual screen-reader acceptance still need their respective external inputs/environments. No live service connection or legal choice is made here.

Release remains blocked until the native Portal failures and the remaining [QA gates](qa-checklist.md) are resolved. [HTTP scope](account-http-acceptance.md), [comment scope](comment-preference-acceptance.md), [payment preparation](payment-acceptance.md) and [licensing inventory](release-licensing-inventory.md) distinguish completed evidence from outstanding work. The full development audit still has 0 critical and 3 known high nodes; no clean-audit claim is made.
