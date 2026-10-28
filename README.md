# Ghost Research Pro

Open-source Ghost theme project for research publishers, B2B intelligence and professional newsletters.

> Status: theme scaffold in development. Source/ZIP validation and isolated Ghost 6 runtime/member-access acceptance are automated; broader release gates remain. No production-ready theme has been released.

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
npm run test:ci
npm run zip
npm run test:zip
```

Install `dist/ghost-research-pro.zip` in Ghost Admin. Both local development and CI use this packaging command. It includes template partials and recreates the archive to prevent stale entries. Development dependencies and project scripts are excluded.

Validation runs all GScan rules for Ghost 5 and 6 and fails on errors **or warnings**. Static compatibility checks do not prove runtime compatibility with every Ghost minor version. See [QA checklist](docs/engineering/qa-checklist.md) for remaining release gates. The author email in package metadata is the repository owner's GitHub noreply address, not a customer support inbox.

## Runtime acceptance

Theme CI also boots an unmodified Ghost 6.73.0 instance on loopback, uploads/activates the ZIP, and checks page rendering, member permissions and three Chromium viewport sizes. It uses disposable complimentary membership fixtures and an in-memory local SMTP sink; no Stripe account or real email delivery is involved. Results and screenshots are uploaded as `ghost-runtime-acceptance` (14-day retention).

See [runtime acceptance and host-error diagnosis](docs/engineering/runtime-acceptance.md). To run the suite outside CI, prepare a fresh unpacked Ghost 6.73.0 installation with its dependencies, install Chromium with `npx playwright install chromium`, build the ZIP, and set `GHOST_RUNTIME_DIR` to that installation's absolute path before `npm run test:runtime`. It deliberately refuses an existing database. Never point it at a live site.
