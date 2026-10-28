# Engineering bootstrap plan

Track implementation under #4. Do not claim Starter or CI is installed yet.

1. Verify the current upstream TryGhost/Starter release, Ghost compatibility, and license obligations.
2. Vendor or adapt the upstream Starter with license and attribution preserved.
3. Provide a reproducible local Ghost environment and sample content import instructions.
4. Configure build, GScan, packaging, and smoke-test GitHub Actions.
5. Require feature-branch PR review and successful CI before merging to main.

Definition of done: fresh checkout can build a Ghost-installable ZIP; CI validates the theme and documents reproducible local verification.
