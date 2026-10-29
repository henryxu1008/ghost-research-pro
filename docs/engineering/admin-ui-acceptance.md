# Disposable Ghost Admin UI theme installation

Four strict browser probes exercise each pinned Ghost version's bundled official Admin interface in the existing loopback-only CI instance. The fixture seeds a temporary owner and authenticates through the existing Admin API setup, then transfers that session to an ephemeral browser context in memory. This tests theme management after authentication, not the login/device-verification interface. Cookies, passwords, storage state and raw Admin responses are never uploaded.

The theme is absent before this UI suite. Content fixtures already exist so activation can be checked against actual public pages. After the UI suite, the original independent Admin API upload/activation baseline still runs and establishes the theme for all existing page/permission/Portal checks. That later API write is not UI evidence and cannot make a failed UI assertion pass.

| Probe | Required evidence |
| --- | --- |
| First installation | Open the official theme-management screen, click Upload theme, select the actual built ZIP in its file input, observe a real browser POST 200 and success dialog, click the native activation button and observe a real PUT 200. The installed row must show the packaged version and Active; backend readback must show one matching active theme. |
| Cancel | Cancel the upload picker, then select the same ZIP and cancel the native overwrite confirmation. No theme POST/PUT/DELETE may occur; the original active name/version stays intact after reload. |
| Confirm repeat upload | Select the same ZIP, confirm Overwrite and observe exactly one real POST 200. The active state/version remain and only one installed entry exists; an already active theme must not trigger another activation request. |
| Invalid ZIP | Upload a valid ZIP container containing only synthetic package metadata, deliberately missing required templates. Real Ghost must return 422, the UI must identify the missing index.hbs and allow closing the error. The invalid theme must not be installed or replace the active release. |

Successful upload requests must contain the exact selected archive bytes. No theme mutation response is mocked or sent through the read-only observation helper. The browser then opens home, a public report and the about page; the served screen.css must match the release payload hash and fixture content must render. Backend GETs only confirm resulting state. All external browser requests, payment endpoints and third-party marketplace downloads remain blocked; no external account, credential or service is created.

`admin-ui.json` records the ZIP hash/package version, UI request paths/methods/statuses, selected-archive byte matches, resulting theme metadata and strict outcomes. On failure it includes only fixture-visible headings/buttons and frame path names for diagnosis. Screenshots show installed version, overwrite confirmation, invalid-template feedback and frontend pages. The OS-native file dialog itself, theme code editor, third-party marketplace installation and login/security configuration are outside this scope.

Use the exact code head's CI results to establish pass/fail. Adding these probes does not resolve or suppress the existing [Portal release blockers](portal-release-decision.md). The current supported scope and Draft/no-deployment boundary are unchanged.
