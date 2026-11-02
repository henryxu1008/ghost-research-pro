# Supported Ghost versions

Effective for the **unreleased PR20 candidate**, 2026-11-02. The owner approved
supporting Ghost 6 and retaining Ghost 5 only as historical compatibility
evidence. This is an EOL support-policy change, **not a repair or passing rerun
of the three Ghost 5 failures**.

[Ghost's official lifecycle table](https://docs.ghost.org/faq/major-versions-lts)
lists Ghost 5.x as EOL in January 2026 and Ghost 6.x as Current (EOL TBC). Ghost
states that EOL versions should be considered insecure. Existing Ghost 5 users
should follow the [official upgrade guide](https://docs.ghost.org/update/) or
their hosting provider's supported upgrade process. This theme does not upgrade
Ghost, migrate a site or change an existing preview.

| Version | Current policy | Acceptance |
| --- | --- | --- |
| Ghost 6 | Supported major; candidate installation range `>=6.0.0 <7.0.0` | Exact runtime target **6.73.0 / Node24.22.1 / official Portal2.72.12 / Search1.9.6**. Other 6.x minors are not individually verified by this result. |
| Ghost 5 | EOL; unsupported, historical evidence only | Last stock run remains **139 PASS / 3 FAIL / 0 SKIP**. Neither those failures nor the unsuccessful newer-Portal experiments are relabeled as passes. |
| Ghost 7 | Unverified, unsupported and excluded by installation metadata | No runtime or GScan support claim. |

## Required checks and retained history

Current CI runs source/ZIP GScan against **Ghost 6**, fails on every error or
warning, and runs the complete unchanged Ghost 6 runtime suite. Security,
contrast, deterministic packaging and the focused regressions remain required.
The last pre-policy Ghost 6 run passed **142 / 0 / 0** at `dd82d44`; each new head
must supply its own CI result. A green current workflow means the applicable
Ghost 6 checks passed, not that Ghost 5 was repaired or that all Ghost versions
were tested. No Ghost 6 assertion, timeout or failure policy is relaxed.

The old matrix and its red results remain in
[CI41400739177](https://github.com/henryxu1008/ghost-research-pro/actions/runs/41400739177).
The [Ghost 5 investigation](engineering/ghost5-portal-compatibility.md) retains
the two dependency roots, exact official bundle hashes and failed full
experiments (134/8/0, then 135/7/0 after a genuine keyboard locator fix). No
Portal fork/backport or theme API/React/fetch workaround is maintained.

To reproduce those historical runs, use their exact commit
`dd82d44bc3799ad2bf615caeaa139feb035d7d14` in a separate disposable checkout,
following that commit's fresh-runtime instructions. The current runner rejects
Ghost 5/7 before starting a site; the current Ghost-6-only package is not a Ghost
5 diagnostic payload. Historical reproduction is optional investigation, not a
current release gate or supported installation guide. The development-only
`portal-ghost5` alias remains for legacy Portal DOM/keyboard fixtures; those
read-only browser fixtures do not start an EOL Ghost server or imply support.

## Release and private trial boundaries

The existing v0.1.0/v0.2.0 tags, Releases, notes, assets and their original engine
declarations/results are unchanged. Published v0.2.0 still has its historical
permissive engine declaration; that is not a current Ghost 5 support promise.
The PR20 candidate has new engine metadata and a new ZIP hash, while its package
version remains 0.2.0 until a separately authorized release. Identify it by full
commit and SHA, and never substitute it silently for the published download.

The new private buyer pack targets Ghost 6 and distinguishes current candidate
metadata from historical screenshots and validation records. Content import is
separate from theme installation; routes, navigation, homepage and brand settings
still require the documented manual steps. No public demo, deployment, pricing,
Stripe lifecycle, customer demand or service commitment is established here.
