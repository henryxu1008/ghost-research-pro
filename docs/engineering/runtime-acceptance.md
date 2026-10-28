# Runtime acceptance on a disposable Ghost instance

## Environment failure diagnosis

On the original execution host, even this minimal command fails without Ghost or any database:

```sh
node -e 'require("node:os").networkInterfaces()'
```

Node 24.22.1 reports `ERR_SYSTEM_ERROR`, syscall `uv_interface_addresses`, errno 1. The Ghost 6.73.0 stack is:

`2-create-fixtures.js` → user model → `@tryghost/request` → `new CacheableLookup()` → `getIfaceInfo()` → `os.networkInterfaces()`.

This locates the failure in host network-interface enumeration reached during module initialization, not a theme SQL migration. The exact rejected kernel call cannot be established here: `strace` itself is unavailable because `ptrace` is denied. No platform permission changes or monkey patches to Node/Ghost/DNS were made.

## Repeatable test environment

The `runtime` job of Theme CI runs pinned Ghost 6.73.0 and Node 24.22.1 on an ephemeral Ubuntu runner. It unpacks the official npm tarball before installing dependencies, because the package contains local `components/*.tgz` dependencies. `--legacy-peer-deps` is needed for Ghost's Bookshelf/Knex peer range conflict. This installation method is test-only, not a production deployment procedure.

The test runner:

1. Starts stock Ghost with a new SQLite database, listening only on `127.0.0.1:2368`.
2. Creates a disposable owner via the setup API, then logs into the Admin API.
3. Uploads the actual built ZIP, activates it and reads back the active theme.
4. Creates public, members-only, paid and tier-restricted research fixtures, plus page, author and tag routes.
5. Creates test members and assigns two complimentary tier fixtures in the disposable database.
6. Requests real member sign-in links, captures them in a loopback-only SMTP sink and redeems them through Ghost to obtain real session cookies.
7. Checks response HTML for authorized content and absence of secret markers for unauthorized visitors, including anonymous requests after a privileged session, wrong-tier access and revoked sessions.
8. Runs Chromium layout and keyboard checks at 360, 768 and 1440 px, producing screenshots.

There is no Stripe connection, checkout or real charge. All emails use `example.test` addresses and are held in memory by a local SMTP sink; none are delivered externally. Complimentary entitlement fixtures test Ghost's real access-control middleware, **not payment subscription creation, renewal, cancellation or webhooks**. Browser screenshot requests to external origins are blocked, so third-party Portal rendering and external embeds are outside that visual check.

## Evidence and limits

`ghost-runtime-acceptance` workflow artifacts contain `results.json` and screenshots. Raw server logs, passwords, member tokens, cookies and databases are not uploaded. The app process is stopped in `finally`, and the CI runner is discarded afterward.

A passing runtime job validates the pinned Ghost 6.73.0 environment only. GScan's Ghost 5 compatibility result remains a static check; no Ghost 5 runtime claim is made. PR #10 remains Draft. Production deployment, merge and real payments are outside this acceptance run.

## First passing execution

[Theme CI 40661983220](https://github.com/qq550723504/ghost-research-pro/actions/runs/40661983220) tested commit `ac89607494ccf5f8f83d8eb40683338fabe818a0` on 2026-10-28: 34 checks passed. Artifact: [runtime results and screenshots](https://github.com/qq550723504/ghost-research-pro/actions/runs/40661983220/artifacts/12804422278).

| Visitor | Public report | Members report | Paid report | Tier A report |
| --- | --- | --- | --- | --- |
| Anonymous | Allow | Deny | Deny | Deny |
| Free member | Allow | Allow | Deny | Deny |
| Complimentary tier A | Allow | Allow | Allow | Allow |
| Complimentary tier B | Allow | Allow | Allow | Deny |
| Anonymous after privileged requests | Allow | Deny | Deny | Deny |

Revoking tier A member sessions also removed access. Denial means the secret body marker was absent from the entire returned HTML, not merely hidden by CSS.

Reviewed the desktop home, mobile membership and mobile locked-article screenshots. Basic layout is usable; review identified duplicate subscribe blocks and missing restricted-card public summaries. Follow-up fixes add regression assertions. New runs publish their own evidence; the first passing run above is not used to claim later commits passed.
