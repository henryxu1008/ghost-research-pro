# Reproducible installable theme ZIP

Issue [#7](https://github.com/henryxu1008/ghost-research-pro/issues/7) calls for a reproducible ZIP. The previous system `zip -r` command preserved checkout-dependent modification times and UT/Unix extra fields. A documentation-only change could therefore change the installable archive hash even when every payload file was identical.

The supplied comparison was PR11 [run 40856407954](https://github.com/henryxu1008/ghost-research-pro/actions/runs/40856407954), inner ZIP SHA-256 `a4761b8f34977e4d916d57df7aa4b667d3ed9aa718dfe217e8c15f23449c18e7`, and PR12 [run 40896368434](https://github.com/henryxu1008/ghost-research-pro/actions/runs/40896368434), `cf5fccdc72e72e62357c451825c1e737cf104c8466b92fb745d7dcc6ad4f80ed`. Both were 11,837 bytes with the same 12 file payloads. The PR12 download was independently read back during this fix: its hash and size matched, and its entries carried timestamp `2026-10-29 14:55:48` with extra-field IDs `0x5455` (UT) and `0x7875` (Unix UID/GID). These hashes describe the inner installable file, not GitHub's wrapper archive.

## Packaging contract

`npm run zip` still writes `dist/ghost-research-pro.zip`. [The writer](../../scripts/package.cjs) uses Node's built-in filesystem, CRC32 and SHA-256 modules; no dependency or lockfile change is required. Its small ZIP32 implementation follows the [ZIP record specification](https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT) for ordinary stored files. It does not implement ZIP64, encryption, compression, executable payloads or symlink preservation.

| Input or metadata | Canonical output |
| --- | --- |
| Input allowlist | Root `*.hbs`, `package.json`, existing regular `LICENSE`/`NOTICE`, and regular files recursively under `assets/` and `partials/`, excluding `.map` files. Missing notices are not generated. |
| Entry order and names | UTF-8 byte order, forward-slash relative paths, UTF-8 flag; no parent folder or directory records |
| File contents | Exact input bytes, including binary and empty files |
| Timestamp | DOS `1980-01-01 00:00:00` in local and central records; no UT extra fields |
| Host and permissions | Unix creator, regular file mode `0644`; source owner, host defaults and executable bits do not enter the archive. Theme templates/assets require readable files, not executable programs. Extractors create parent directories as needed. |
| Compression | ZIP method 0 (stored). Current raw theme files total about 27KB, so the size tradeoff is small and output does not depend on a compressor version. |
| Extras/comments | Absent, including archive comment and UID/GID fields |
| Build output | Entire archive replaced each time; no stale entry or trailing data retained |

Git attributes keep checked-out `.hbs`, `.css`, `.js` and root `package.json` text at LF. The packager does not change file bytes: editing content, changing line endings externally, or adding an allowed asset is expected to change the hash. README, docs, tests, scripts, dependencies and previous ZIPs outside the allowlist do not affect it. No archive timestamp reflects the source or build date; record the Git commit separately.

## Verification and limits

Run `node --test tests/package.test.cjs`, `npm run test:ci`, `npm run zip` and `npm run test:zip` after installing the locked development dependencies. The seven focused regression cases cover different directory creation orders, mtimes, file modes and timezones; excluded docs/build/dependency/map files; changed and removed payloads; missing required files; symlinks; Unicode/binary/empty files through an independent existing ZIP reader; optional root notices preserved byte for byte without invented terms; and actual CLI output replacement. The Windows sandbox rejected link-fixture creation with `EPERM`; that one case is explicitly skipped on Windows, not claimed as a local pass. It remains a required real-filesystem assertion on Linux CI. CI includes the packaging cases on Node 22 and 24, source/ZIP GScan and the existing Ghost upload/activation/runtime matrix.

Linux CI also runs `unzip -t` on the actual output to independently verify ZIP CRCs. The Git-bundled native `unzip.exe` did not initialize in the Windows sandbox (exit `0xC0000142`, no archive diagnostic); it was not counted as a local integrity pass. Independent JavaScript extraction and source/ZIP GScan did run locally.

Compare the SHA-256 printed by each `npm run zip` on the same source file bytes. Do not compare the outer GitHub artifact download: that wrapper is produced by the artifact service and is outside this deterministic packaging contract. Static and extraction checks do not replace real Ghost installation. The existing stock Portal failures and other [release gates](qa-checklist.md#remaining-release-gates) remain visible; deterministic packaging does not clear them or authorize release.
