# Focus, header reflow and archive headings

The theme uses its existing blue accent for keyboard focus, including ordinary
links. The 3px outline is offset by 3px so it contrasts with the surrounding white
or panel surface, including around a blue anchor button. Its contrast is 8.40:1
against white and 7.89:1 against the panel (`#f5f8fc`).

At viewport widths up to 1300px the navigation occupies a separate header row.
At larger widths the flex layout can still wrap rather than overlap. Membership
action labels remain whole; on narrow screens or with enlarged text, complete
actions may move to another line. Navigation wraps between links, and long brand
text can wrap without pushing controls outside the viewport.

The card partial defaults to H2 for tag and author archives, following their H1.
The homepage explicitly passes `in_section=true` for H3 cards below its existing
H2. Both heading levels share the same card typography.

Run the focused Chromium fixtures after installing the locked dependencies and
Playwright Chromium:

```sh
node --test tests/runtime/theme-layout.test.cjs
```

These render the actual templates and stylesheet. They cover Tab focus contrast,
the long-brand/six-link header at 320–1600px with 16px and 32px root/body text,
and homepage/tag/author heading order. They are isolated fixtures, not a complete
Ghost installation, screen-reader audit, or a replacement for visual review.

A local preview's Portal resource URL is deployment configuration, separate from
these theme changes. No Portal bundle or upstream experimental patch is added to
the installable theme ZIP.

## Portal sequential focus boundary

An independent follow-up check found that the existing iframe focus adapter used
DOM order for its first/last controls. Portal 2.72.11's signup fields have positive
tabindex values, so native reverse Tab from the initially focused Name field could
leave the iframe. This observation does not establish which earlier change
introduced the problem.

The adapter now follows native sequential order: positive tabindex values first,
ascending, then ordinary controls in DOM order. Equal values preserve DOM order.
It does not change Portal's own markup, tabindex values, or bundle bytes.

```sh
node --test tests/runtime/portal-focus.test.cjs
```

These real Chromium checks load the two pinned, unmodified Portal bundles with
fictional read-only API responses. They cover signup and signin at 360/1280px,
native autofocus, complete forward/backward cycles without skipped controls,
Escape immediately after reverse Tab, trigger focus restoration, repeated opens,
and keyboard close. They reject non-GET requests and never submit a form.
The disposable Ghost runtime also exercises the signup sequence against its real
Portal UI while preserving the existing signin checks. This does not replace the
independent local-preview visual recheck or test authenticated behavior.
