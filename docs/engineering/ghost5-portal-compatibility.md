# Ghost 5: failure investigation and unsuccessful official Portal experiment

**Historical evidence after the 2026-11-02 [support-policy decision](../support-policy.md).**
Ghost 5 is EOL and no longer a current CI/release gate. The default red results
and failed experiments below belong to commit `dd82d44bc3799ad2bf615caeaa139feb035d7d14`;
the current runner supports Ghost 6 only. This policy change does not fix them.

This records investigation on **Ghost 5.130.6 / Node 22.23.4**, outside the formal
Ghost 6.73.0 support target. Official Portal 2.72.12 was tested as a possible
compatibility route and did **not** pass the unchanged complete contract.
It is not an accepted operator upgrade recipe. At that historical commit, CI
retained default Portal 2.51.5 and its strict failures. No published asset or
existing site was changed by the experiment.

## Why the default profile fails

Main [CI41293388046](https://github.com/henryxu1008/ghost-research-pro/actions/runs/41293388046)
and PR20 head `c903031a6c3f1be4709ce2ccd55d21d9ec8d4278`
[CI41394398245](https://github.com/henryxu1008/ghost-research-pro/actions/runs/41394398245)
both record **139 PASS / 3 FAIL / 0 SKIP** with official Portal 2.51.5.
The three failure identities are identical. They are dependency defects, not a
new theme regression or a selector timeout:

- Newsletter HTTP 503 and 429: `member.update` resolves non-2xx responses to
  `null`; `updateNewsletterPreference` accepts that result as a successful member.
  In both actual probes the server/session remain unchanged, but the local draft,
  account display and failure feedback are lost. Explicit real HTTP-200 retry,
  reload and restoration still work; that does not excuse the lost state.
- Aborted comment save: the page callback does not return the action promise,
  and the component emits success unconditionally after that callback. The PR20
  observer recorded success at 301 ms while pending, then failure at 734 ms after
  abort. This is a visible false-success event, not a delayed assertion artifact.

The unchanged official 2.51.5 bundle SHA256 is
`3b4a04433817b08e6cb4e0a914ce5416ccf769b3f1eaa40850a5c78027da93e5`.
Its published source map supplies the API/action/component evidence described
in the [dated diagnosis](portal-release-decision.md#exact-2515-provenance-and-scope-limits).
The npm registry still lists no later stable 2.51 patch on 2026-11-02.

Official Portal **2.72.12** throws on failed member updates and owns success
feedback in the completed action, including the merged
[upstream comment repair](https://github.com/TryGhost/Ghost/pull/32314).
Its unmodified bundle SHA256 is
`c9e7da0b60fc9b2a7ac5d5d16a1df78b5daf33c20412ab00c51dbab5529df601`.
No Portal fork, source-map rewrite, runtime/global fetch shim, toast suppression or
theme account API is used.

## Diagnostic configuration, not a supported upgrade

Self-hosted Ghost supports a custom
[`portal.url` configuration](https://docs.ghost.org/config#portal). That mechanism
does not guarantee cross-version Portal compatibility. The experiment's
equivalent server configuration is shown for reproduction on a disposable site:

```json
{
  "portal": {
    "url": "https://cdn.jsdelivr.net/npm/@tryghost/portal@2.72.12/umd/portal.min.js",
    "version": "2.72.12"
  }
}
```

This requires server configuration access and Ghost's normal restart. A theme
ZIP cannot set these options; no user site is changed by this PR. Preserve the
previous keys if conducting a separate authorized disposable experiment; undoing
the override restores those keys and uses the normal restart. Returning to
2.51.5 also returns to its defects. Do not disable Portal, broaden iframe origin
permissions or apply this failed experiment as a production upgrade recommendation.

## Historical reproduction and acceptance boundary

Use the exact historical commit above in a separate disposable checkout, not
the current Ghost-6-only candidate. Its engine metadata and runner profiles are
the matching diagnostic payload. This is optional investigation, not support.

The runner defaults to `GHOST5_PORTAL_MODE=stock`, retaining official 2.51.5 and
its strict failing probes for reproduction. The explicit
`GHOST5_PORTAL_MODE=official-2.72.12` selects the configured compatibility profile.
Unknown modes fail before starting Ghost. Both use the same complete acceptance
suite and assertions. Neither uses skip, expected failure or allow-failure.

With a fresh disposable Ghost 5.130.6 installation and supported Node 22.23.4:

```sh
GHOST_RUNTIME_DIR=/absolute/path/to/fresh/ghost/package \
GHOST_RUNTIME_VERSION=5.130.6 GHOST5_PORTAL_MODE=official-2.72.12 \
npm run test:runtime
```

Omit the mode (or set `stock`) on another fresh installation to reproduce the
default-profile defects. Never reuse a database or point this runner at a site
in use. The reports record the selected mode, installed package version and
actual bundle hash. The official bundle is served on loopback through Ghost's
Portal configuration; successful requests reach real Ghost, with a local SMTP
sink and disposable accounts. Only failure responses/aborts are controlled.

## Actual results and remaining boundary

On 2026-11-02 the full local experiment recorded **134 PASS / 8 FAIL / 0 SKIP**,
142 checks, actual Portal package 2.72.12 and the bundle hash above. Ghost used
a new SQLite database, isolated ports 2510/2660, fictional accounts and loopback
SMTP. The first preparation attempt could not expose its sandbox Temp path to
the host process and ran zero checks; it is retained separately, not a pass.

The eight failed checks were:

| Failure group | Checks | Evidence and interpretation |
| --- | ---: | --- |
| Complimentary-paid membership navigation in all/paid/invite modes | 3 | Existing 30-second `networkidle` timeout. Passive request diagnostics were added without changing the wait or assertions; the second run identifies the unsupported offers request below. |
| Account preference axe | 1 | Serious `nested-interactive`: the single-newsletter row is a button and can contain the native `Not receiving emails?` button. |
| Default newsletter keyboard | 1 | The test selected a hidden decorative switch rather than the native surrounding button row. The locator was corrected; native clicks/writes and assertions are unchanged. |
| Newsletter draft retention after abort/HTTP503/HTTP429 | 3 | The modern single-newsletter control is driven by saved `member.newsletters`, with no separate draft. After failure it correctly keeps the server member and error, but returns the checkbox to the saved value, violating the existing requirement to retain the unsaved selection. The abort case times out waiting for that value after the error, not locating the control. |

The second fresh complete run, after the native row locator correction and
passive diagnostics, records **135 PASS / 7 FAIL / 0 SKIP**. The real keyboard
toggle, save and restoration check now passes, without changing its assertions.
The other seven failures remain. On all three navigation timeouts the document
was `complete` and the browser still listed `POST /members/api/member/offers/`
as pending at about 29.8 seconds; requests from previous navigations also
remained listed at 64/99 seconds. Ghost 5's server log records those unsupported
requests as HTTP 404 in 1 ms. This proves the newer Portal requests an unavailable
API, but does not establish why browser request completion is still pending;
it must not be described as a slow document or a passing navigation. The probe
does not mock that endpoint, relax `networkidle`, connect Stripe or hide failure.

The original aborted-comment test passes: no success while pending/after abort,
one failed attempt, then real HTTP-200 retry, reload and restoration. The modern
503/429 cases also retain the client account, server/session and error without
false success; their remaining strict failure is specifically draft retention.
That partial improvement is not a complete passing result.

The native FAQ button condition tests whether the entire `email_suppression`
field is truthy, while the parent page selector checks its `.suppressed` flag.
Ghost 5's `MemberBREADService` constructs an object for that field even when
`suppressed` is false, and the members output passes it through. Therefore the
observed nesting must not be described as limited to actually suppressed users.

Independent read-only review confirmed the dependency roots and the distinction
between the genuine locator defect and the three draft-contract failures. It
found no safe theme-only way to introduce Portal-owned draft/retry state while
retaining the unchanged contract. Forcing checkbox DOM state, hiding feedback,
adding a runtime/global fetch shim, forking Portal, enabling comments or adding newsletters to
avoid the failing path are not implemented. Changing Portal state management or
explicitly revising that product contract requires a separate scoped decision;
the existing failures cannot simply be relabeled as passing.

This does not establish every newer Portal on Ghost 5, a default-install pass,
a provider upgrade, production operation or Stripe billing. Search remains
official Sodo 1.9.6, not Ghost 5's default 1.8; remote fonts and cross-origin
Portal enhancement remain outside acceptance. Historical release evidence is
unchanged, and the optional experimental profile is not added to CI.
