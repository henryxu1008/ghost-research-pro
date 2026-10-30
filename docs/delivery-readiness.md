# User handoff boundary and remaining release choices

This is one unpublished evaluation candidate in unified PR17, not a new product
branch or an authorization to sell. Build identity and evidence are in the
[candidate handoff](candidate-delivery.md). Files are prepared locally; no local
artifact, screenshot, database or credential is uploaded by this work.

## Clean handoff contents

| Included for the owner | Boundary |
| --- | --- |
| Inner `ghost-research-pro.zip` | Only the 15 current runtime files; no synthetic posts, Portal package, tests, routes or docs. No project LICENSE/NOTICE exists yet. |
| Operator and product documents | Installation/upgrade/rollback, research setup, fictional demo instructions, current scope/design and dated market evidence. The demo instructions are text, not imported publication data. |
| `examples/research-routes.yaml` | A merge example, not a replacement for the recipient's custom routes. |
| Manifest / checksums | Exact source head, byte sizes and hashes for the candidate actually provided. A new CSS or notice file means a new hash. |
| Sanitized evidence summary | Exact versions/run links, pass/fail/skip counts, method distinctions and known limitations; no raw response bodies, staff/member data or machine diagnostics. |

Excluded: local databases and backup directories, process/session files, passwords,
tokens/cookies/API keys, raw logs, screenshots, private machine paths, upstream
experimental patches/builds, dependencies and the separate five-draft cloud
content pack. Loopback preview links are useful only to the owner on that
computer; they are not public demos or externally shareable site URLs.

An allowlisted file/typed-secret/path scan and hash/CRC checks are evidence of
the inspected contents, not a guarantee that arbitrary future attachments are
safe. Keep the user handoff local until attachment permission is coordinated.

## Three concrete owner choices

| Choice | Available directions; nothing selected here | Work after the choice |
| --- | --- | --- |
| Project license | Confirm the intended MIT direction represented by existing metadata, or request a different reviewed license/terms proposal. The current metadata/missing-text mismatch is unresolved. | Owner approves actual license/copyright/notice text and provenance; reconcile metadata, include provided root LICENSE/NOTICE, rebuild and validate. No price, permission grant or legal conclusion is supplied here. |
| Initial formal Portal/Ghost scope | Keep Ghost5+6, or explicitly choose a Ghost6-first release scope. Ghost6-first has one known Portal responsibility; Ghost5 adds the legacy newsletter503/429 recovery responsibility. | Validate supported stock upstream repair(s) and rerun all relevant strict cases for the chosen exact versions. A scope decision alone does not turn red checks green; do not silently remove Ghost5 or ship an experimental Portal. |
| Paid-commerce promise | Include native paid checkout/lifecycle in the first release promise, or restrict that first promise to the demonstrated reading/free-member scope and explicitly leave commerce unverified. Native paid UI is not automatically removed by this choice. | If included, separately authorize/provide an isolated Stripe sandbox and run the prepared lifecycle matrix. If excluded, reconcile product/support claims before release. No new account, credential or payment is created now. |

The shortest technical sequencing recommendation is to evaluate Ghost6 first
and avoid promising unexecuted billing behavior. That is a recommendation for
the owner, not a support-range or product-contract change. Licensing remains
the owner's choice, and an official validated comment-feedback repair is still
needed even for Ghost6/free-member scope.

## Technical gates that decisions do not waive

Stock Portal can falsely confirm a comment-notification change before a failed
write; an opt-out may remain unsaved. Ghost5's503/429 newsletter failures can
lose the local draft/client account display. See [repair ownership](engineering/portal-release-decision.md)
and [official PR32314](https://github.com/TryGhost/Ghost/pull/32314); it is not an
installed/released fix. Preserve the red assertions. No theme toast suppression,
global fetch replacement or upstream fork is a passing substitute.

Full screen-reader/alternate-browser coverage and the stated dependency-tool
high findings remain explicit. Paid entitlements in complimentary fixtures are
not real billing evidence. The latest CSS-font fixture is not a new independent
visual audit or a buyer-run installation. Actual merge/auto-merge, closing older
PRs, a Release, production deployment and distribution are separate actions and
have not been authorized by the request to keep developing.
