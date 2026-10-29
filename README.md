# Ghost Research Pro

Open-source Ghost theme project for research publishers, B2B intelligence and professional newsletters.

> Status: theme scaffold in development. Source/ZIP validation and isolated Ghost 5/6 runtime/member-access checks are automated; broader release gates remain. No production-ready theme has been released.

Installing a development preview? Start with the [installation, configuration, upgrade and rollback guide](docs/user-guide.md). It distinguishes the installable artifact from a source ZIP and documents the controls this theme actually exposes.

Preparing a demonstration publication? Use the [demo content setup plan](docs/demo-content.md) for fictional reports, Briefs, a members-only post and a manual homepage/archive checklist.

## Product definition

The [first-version PRD](docs/product/prd.md) records the selected small research-publication scope, testable acceptance criteria and remaining release gates. The [market evidence](docs/product/market-validation.md) compares 10 themes and 20 Ghost-listed publication examples; it does **not** validate 20 commercial buyers or customer demand. Customer conversations, validated unmet needs and paid-intent signals remain **0/5, 0/3 and 0/2** respectively.

## Roadmap

Track research, product requirements, design, implementation and release in [GitHub Issues](https://github.com/qq550723504/ghost-research-pro/issues).

## Development principles

- Keep `main` stable; develop via feature branches and pull requests.
- Validate customer demand before committing to advanced features.
- Prefer Ghost-native memberships, posts, tags and authors.
- Confirm the upstream Starter license and choose a compatible project license before distributing theme code.

## Commercial approach

Public source repository, with optional paid installation, customization and support services. Pricing and licensing remain under evaluation.

## Local checks and packaging

Use Node.js 22.17+ (22.x) or 24.x, npm, and the `zip` command (Linux/macOS or WSL).

```sh
npm ci --ignore-scripts
npm run test:security
npm run test:contrast
npm run audit:ci
npm run test:ci
npm run zip
npm run test:zip
```

Install `dist/ghost-research-pro.zip` in Ghost Admin. Both local development and CI use this packaging command. It includes template partials and recreates the archive to prevent stale entries. Development dependencies and project scripts are excluded.

Validation runs all GScan rules for Ghost 5 and 6 and fails on errors **or warnings**. Static compatibility checks do not prove runtime compatibility with every Ghost minor version. See [QA checklist](docs/engineering/qa-checklist.md) for remaining release gates. The author email in package metadata is the repository owner's GitHub noreply address, not a customer support inbox.

GScan's Handlebars compiler is overridden to the security fix 4.7.10. The audit still reports high-severity ZIP extraction dependencies; see [dependency security](docs/engineering/dependency-security.md) for the exact findings and limits.

## Runtime acceptance

Theme CI exercises stock Ghost 5.130.6 / Node 22.23.4 / Portal 2.51.5 and Ghost 6.73.0 / Node 24.22.1 / Portal 2.72.11 on separate loopback-only runners. It uploads/activates the ZIP and checks page rendering, member permissions, common editor cards, keyboard navigation and selected WCAG A/AA rules. Both environments use disposable complimentary membership fixtures and an in-memory local SMTP sink. The matching official Portal bundle exercises free signup/signin/signout and fixture name/newsletter saves, reload persistence, cancellation, aborted-request recovery and signed-out data isolation. See [account acceptance](docs/engineering/account-acceptance.md) for the exact coverage and limits. All external browser requests are blocked. No Stripe account or real email delivery is involved. Evidence is uploaded as `ghost-runtime-ghost5` and `ghost-runtime-ghost6` (14-day retention).

See [runtime acceptance and host-error diagnosis](docs/engineering/runtime-acceptance.md). To run outside CI, prepare a fresh unpacked installation of one pinned version with its supported Node version and dependencies, install Chromium with `npx playwright install chromium`, build the ZIP, and set `GHOST_RUNTIME_DIR` plus `GHOST_RUNTIME_VERSION` before `npm run test:runtime`. The default version is 6.73.0; the runner verifies the package's Node engines and refuses an existing database. Never point it at a live site.

The theme includes a small accessibility adapter for the native Portal iframe: it restores keyboard focus, contains Tab navigation, enables the legacy close control, and supplies document language/title and zoom-friendly viewport metadata. Portal actions still use Ghost's handlers. Native card/Portal actions follow the theme's accent color; custom palette changes need contrast verification. Automated checks do not replace screen-reader or full accessibility review.
