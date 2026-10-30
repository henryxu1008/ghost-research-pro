# Ghost Research Pro

MIT-licensed Ghost theme candidate for research publishers, B2B intelligence and professional newsletters. See [LICENSE](LICENSE) for permissions and notice conditions; functional release readiness is tracked separately.

> Status: unmerged evaluation candidate. Research publishing, installation and scoped Ghost 5/6 acceptance evidence are available; stock Portal failures and other release gates remain. No production-ready theme has been released.

Review the [candidate handoff](docs/candidate-delivery.md) for the exact installable ZIP/hash, configuration cost, tested profiles, integration plan and known limits. The [current product contract](docs/product/prd.md), [design specification](docs/product/design-spec.md) and [dated market evidence](docs/product/market-validation.md) are included. The owner selected standard MIT; no paid-service pricing is set here.

Installing a development preview? Start with the [installation, configuration, upgrade and rollback guide](docs/user-guide.md). It distinguishes the installable artifact from a source ZIP and documents the controls this theme actually exposes.

Preparing a demonstration publication? Use the [demo content setup plan](docs/demo-content.md) for fictional reports, Briefs, a members-only post and a manual homepage/archive checklist.

## Roadmap

Track research, product requirements, design, implementation and release in [GitHub Issues](https://github.com/qq550723504/ghost-research-pro/issues).

## Development principles

- Keep `main` stable; develop via feature branches and pull requests.
- Validate customer demand before committing to advanced features.
- Prefer Ghost-native memberships, posts, tags and authors.
- Keep the project MIT license and applicable upstream notices with distributed code; review separately introduced assets and dependencies under their own terms.

## Commercial approach

Public source under MIT, which permits commercial use, redistribution and sale subject to its notice conditions. Optional paid installation, customization or support services may be offered separately; their pricing is not set here. Technical release readiness is not a restriction added to the MIT license.

## Local checks and packaging

Use Node.js 22.17+ (22.x) or 24.x and npm. Packaging uses Node's built-in modules; a system `zip` command or WSL is not required.

```sh
npm ci --ignore-scripts
npm run test:security
npm run test:contrast
npm run audit:ci
npm run test:ci
node --test tests/package.test.cjs
npm run zip
npm run test:zip
```

Install `dist/ghost-research-pro.zip` in Ghost Admin. Both local development and CI use this packaging command. It includes template partials and recreates the archive to prevent stale entries. Development dependencies and project scripts are excluded. The command prints the installable ZIP's SHA-256; this is distinct from GitHub's outer artifact-download ZIP hash.

For identical payload paths and file bytes, packaging is deterministic: entries sort by UTF-8 path bytes, use the fixed DOS timestamp `1980-01-01 00:00:00`, and record regular Unix `0644` files without extra fields, comments, owner IDs or directory entries. Files use ZIP's uncompressed **stored** method so different Node/zlib compressor versions cannot change the output. The current small theme therefore has a slightly larger archive; file contents and install paths are preserved. The allowlist is root `*.hbs`, `package.json`, existing root `LICENSE`/`NOTICE` files, and files under `assets/` and `partials/`, excluding `*.map`; symlinks and non-regular inputs are rejected. Notice files are preserved only when supplied; the packager generates no license or permission grant. The writer supports ZIP32 only and fails rather than silently overflowing its limits.

The packaging regression checks creation order, file times/modes/timezones, excluded documentation/dependencies, changed/removed payload files, independent ZIP extraction and CLI replacement. CI runs them with both pinned runtime Node versions. Git attributes fix LF checkout bytes for the packaged text files; the packager itself does not rewrite text, normalize binary bytes or derive metadata from checkout time. Different file bytes intentionally produce a different hash. See the [reproducible packaging notes](docs/engineering/reproducible-packaging.md) for the original evidence and verification boundary.

Validation runs all GScan rules for Ghost 5 and 6 and fails on errors **or warnings**. Static compatibility checks do not prove runtime compatibility with every Ghost minor version. See [QA checklist](docs/engineering/qa-checklist.md) for remaining release gates. The author email in package metadata is the repository owner's GitHub noreply address, not a customer support inbox.

GScan's Handlebars compiler is overridden to the security fix 4.7.10. The audit still reports high-severity ZIP extraction dependencies; see [dependency security](docs/engineering/dependency-security.md) for the exact findings and limits.

## Runtime acceptance

The owner selected **Ghost6.73.0 / Node24.22.1 / stock Portal2.72.11** as the
first-version primary support and delivery target. This is not a promise for
every Ghost6 minor. Ghost5 remains compatibility CI evidence, outside the first
delivery commitment. Its strict tests and failures are retained; the permissive
`engines.ghost >=5.0.0` installation metadata is unchanged and is not a support warranty.

The first delivery does not promise the unexecuted paid-subscription lifecycle
(creation/checkout, renewal, cancellation/refunds and recovery). Native Ghost
membership/paid features and access rules are unchanged; this is not an
end-to-end commercial-readiness claim. The project license is MIT.

Theme CI exercises stock Ghost 5.130.6 / Node 22.23.4 / Portal 2.51.5 and Ghost 6.73.0 / Node 24.22.1 / Portal 2.72.11 on separate loopback-only runners. It uploads/activates the ZIP and checks page rendering, member permissions, common editor cards, keyboard navigation and selected WCAG A/AA rules. Both environments use disposable complimentary membership fixtures and an in-memory local SMTP sink. The matching official Portal bundle exercises free signup/signin/signout and fixture name/newsletter saves, reload persistence, cancellation, aborted-request recovery and signed-out data isolation. See [account acceptance](docs/engineering/account-acceptance.md) for the exact coverage and limits. All external browser requests are blocked. No Stripe account or real email delivery is involved. Evidence is uploaded as `ghost-runtime-ghost5` and `ghost-runtime-ghost6` (14-day retention).

See [runtime acceptance and host-error diagnosis](docs/engineering/runtime-acceptance.md). To run outside CI, prepare a fresh unpacked installation of one pinned version with its supported Node version and dependencies, install Chromium with `npx playwright install chromium`, build the ZIP, and set `GHOST_RUNTIME_DIR` plus `GHOST_RUNTIME_VERSION` before `npm run test:runtime`. The default version is 6.73.0; the runner verifies the package's Node engines and refuses an existing database. Never point it at a live site.

The theme includes a small accessibility adapter for the native Portal iframe: it restores keyboard focus, contains Tab navigation, enables the legacy close control, and supplies document language/title and zoom-friendly viewport metadata. Portal actions still use Ghost's handlers. Native card/Portal actions follow the theme's accent color; custom palette changes need contrast verification. Automated checks do not replace screen-reader or full accessibility review.

## Research publishing experience

The editorial homepage, public-safe access labels, report metadata and native Library/topic/format/year browsing are described in the [research desk setup](docs/research-publishing-setup.md). The optional Library requires metadata Pages and merged native routing; the ZIP does not create them. Browsing uses complete server-paginated views, not page-local filters or a downloaded content index. See the [implementation and acceptance boundaries](docs/engineering/research-publishing.md).
