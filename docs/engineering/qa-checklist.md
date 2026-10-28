# Ghost Research Pro — installation and acceptance checklist

## CI evidence
The first theme validation and ZIP packaging workflow passed in GitHub Actions run 40656495494. This is **not** evidence of installation or runtime behavior.

## Manual Ghost verification (not yet performed)
- [ ] Download the `ghost-research-pro-theme` artifact from a successful Theme CI run.
- [ ] Extract artifact and upload `ghost-research-pro.zip` in Ghost Admin → Settings → Design & branding → Change theme (location may vary by Ghost version).
- [ ] Activate theme and confirm home, post, tag, author, page and 404 routes render.
- [ ] Configure a Ghost page with custom template `Membership` and verify both membership cards.
- [ ] Confirm native Ghost Portal signup/signin links work with memberships enabled.
- [ ] Test anonymous, free member, paid member and restricted-content states; Ghost itself must enforce access rules.
- [ ] Test mobile widths 360px, 768px and desktop 1440px; keyboard focus and screen reader landmarks.
- [ ] Verify report tables, embeds, images, heading hierarchy and long article readability.
- [ ] Re-run GScan against the final ZIP and record the Ghost version tested.

## Release gate
Do not label this production ready until installation, accessibility and member flows have been manually verified on a supported Ghost instance.
