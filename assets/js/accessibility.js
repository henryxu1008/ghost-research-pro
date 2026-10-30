(() => {
    'use strict';
    // Read only headings Ghost has rendered for this visitor. Never request the
    // full post, and do not include upgrade prompts or hidden card content.
    for (const toc of document.querySelectorAll('.report > .report-toc')) {
        const content = toc.parentElement.querySelector('.gh-content');
        const list = toc.querySelector('ol');
        if (!content || !list) continue;
        let section;
        for (const heading of content.querySelectorAll('h2,h3')) {
            if (heading.closest('[hidden],[inert],[aria-hidden="true"],details:not([open]),.gh-post-upgrade-cta') ||
                !heading.getClientRects().length || getComputedStyle(heading).visibility !== 'visible' ||
                (heading.checkVisibility && !heading.checkVisibility({checkOpacity: true, checkVisibilityCSS: true}))) continue;
            const label = heading.innerText.trim();
            if (!label) continue;
            if (!heading.id) {
                const slug = Array.from(label.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')).slice(0, 80).join('') || 'section';
                const base = `report-${slug}`;
                let id = base, suffix = 2;
                while (document.getElementById(id)) id = `${base}-${suffix++}`;
                heading.id = id;
            }
            // Preserve author-supplied IDs, but never link to a different node
            // when authored markup already contains a duplicate ID.
            if (document.getElementById(heading.id) !== heading) continue;
            if (!heading.hasAttribute('tabindex')) heading.tabIndex = -1;
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${encodeURIComponent(heading.id)}`;
            link.textContent = label;
            item.append(link);
            if (heading.tagName === 'H3' && section) {
                let children = section.querySelector('ol');
                if (!children) { children = document.createElement('ol'); section.append(children); }
                children.append(item);
            } else {
                list.append(item);
                if (heading.tagName === 'H2') section = item;
            }
        }
        toc.hidden = !list.children.length;
    }

    const frameSelector = 'iframe[title="portal-popup"]';
    let trigger;
    let active;
    const background = new Map();
    const inaccessibleFrames = new WeakSet();
    const focusable = doc => [...doc.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
        .filter(el => el.tabIndex >= 0 && !el.disabled && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden')
        // Positive tabindex controls precede the ordinary DOM-order controls.
        // Keep ties stable, matching the browser's sequential focus order.
        .sort((a, b) => {
            if (a.tabIndex === b.tabIndex) return 0;
            if (a.tabIndex === 0) return 1;
            if (b.tabIndex === 0) return -1;
            return a.tabIndex - b.tabIndex;
        });

    document.addEventListener('click', event => {
        const link = event.target.closest?.('[data-portal],a[href*="#/portal/"]');
        if (link) trigger = link;
    }, true);

    function setBackgroundInert() {
        for (const element of document.body.children) {
            if (element.id === 'ghost-portal-root' || ['SCRIPT', 'STYLE', 'LINK'].includes(element.tagName)) continue;
            if (!background.has(element)) background.set(element, element.inert);
            element.inert = true;
        }
    }

    function closeFrame(restoreWithFrame = false) {
        if (!active) return;
        active.cleanup();
        active = null;
        for (const [element, inert] of background) element.inert = inert;
        background.clear();
        const target = trigger?.isConnected ? trigger : document.querySelector('.member-actions a');
        queueMicrotask(() => { if (restoreWithFrame || !document.querySelector(frameSelector)) target?.focus({preventScroll: true}); });
    }

    function setupFrame(frame) {
        if (active?.frame === frame || inaccessibleFrames.has(frame)) return;
        closeFrame();
        if (!trigger?.isConnected && document.activeElement !== document.body) trigger = document.activeElement;
        let observer;
        let doc;
        const legacyCloseButtons = new WeakSet();
        const legacySwitches = new WeakSet();
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#174e8b';
        const muted = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#58657a';
        const activateClose = () => {
            const close = doc.querySelector('[data-test-button="close-popup"],button[aria-label="Close popup"]');
            if (close?.tagName === 'BUTTON') close.click();
            else close?.querySelector('svg')?.dispatchEvent(new doc.defaultView.MouseEvent('click', {bubbles: true, cancelable: true}));
            return Boolean(close);
        };
        const keydown = event => {
            if (event.key === 'Escape') {
                if (activateClose()) { event.preventDefault(); event.stopPropagation(); }
            }
            if (['Enter', ' '].includes(event.key) && event.target.matches('[data-test-button="close-popup"][role="button"]')) {
                event.preventDefault(); event.stopPropagation(); activateClose();
            }
            if (event.key === 'Tab') {
                const controls = focusable(doc);
                const current = doc.activeElement;
                const first = controls[0], last = controls.at(-1);
                if (!first) return;
                if (event.shiftKey && (current === first || !controls.includes(current))) {
                    event.preventDefault(); last.focus();
                } else if (!event.shiftKey && (current === last || !controls.includes(current))) {
                    event.preventDefault(); first.focus();
                }
            }
        };
        const decorate = () => {
            if (!doc?.head || !doc.body || active?.frame !== frame) return;
            setBackgroundInert();
            if (!doc.documentElement.lang) doc.documentElement.lang = document.documentElement.lang || 'en';
            if (!doc.title) doc.title = `${document.title} — Membership`;
            // Portal 2.51 renders a clickable SVG inside a div. Preserve its native
            // click handler while making the same close action keyboard accessible.
            const close = doc.querySelector('[data-test-button="close-popup"]');
            if (close && close.tagName !== 'BUTTON' && !legacyCloseButtons.has(close)) {
                legacyCloseButtons.add(close);
                close.setAttribute('role', 'button');
                close.setAttribute('aria-label', 'Close popup');
                close.tabIndex = 0;
                close.addEventListener('click', event => { if (event.target === close) activateClose(); });
            }
            const viewport = doc.querySelector('meta[name="viewport"]');
            if (viewport && viewport.content !== 'width=device-width, initial-scale=1') viewport.content = 'width=device-width, initial-scale=1';
            doc.documentElement.style.setProperty('--brandcolor', accent);
            doc.documentElement.style.setProperty('--theme-muted', muted);
            const signout = doc.querySelector('[data-test-button="footer-signout"]');
            if (signout?.textContent.trim()) signout.setAttribute('aria-label', signout.textContent.trim());
            for (const box of doc.querySelectorAll('.gh-portal-for-switch')) {
                const input = box.querySelector('input[type="checkbox"]');
                if (!input) continue;
                if (box.getAttribute('aria-hidden') === 'true') {
                    // Modern Portal makes the row the control; the visual switch is
                    // decorative. Let pointer hits reach that native row handler too.
                    const row = box.closest('[role="button"][aria-pressed]');
                    if (row) {
                        const wrapper = box.parentElement;
                        // Portal's sole-child wrapper stops click propagation. It
                        // must be decorative too, so hits reach the native row.
                        if (wrapper?.tagName === 'DIV' && wrapper !== row && wrapper.childElementCount === 1) wrapper.inert = true;
                        else box.inert = true;
                    }
                    continue;
                }
                const label = box.closest('section')?.querySelector('h3')?.textContent.trim();
                if (!label) continue;
                box.setAttribute('role', 'switch');
                box.setAttribute('aria-label', label);
                box.setAttribute('aria-checked', String(input.checked));
                box.tabIndex = 0;
                input.tabIndex = -1;
                input.setAttribute('aria-hidden', 'true');
                input.inert = true;
                if (!legacySwitches.has(box)) {
                    legacySwitches.add(box);
                    box.addEventListener('keydown', event => {
                        if (event.target !== box || !['Enter', ' '].includes(event.key)) return;
                        event.preventDefault(); event.stopPropagation();
                        box.querySelector('.input-toggle-component')?.dispatchEvent(new doc.defaultView.MouseEvent('click', {bubbles: true, cancelable: true}));
                        queueMicrotask(decorate);
                    });
                    box.addEventListener('click', () => queueMicrotask(decorate));
                }
            }
            if (!doc.getElementById('theme-portal-accessibility')) {
                const style = doc.createElement('style');
                style.id = 'theme-portal-accessibility';
                style.textContent = '.gh-portal-btn-main{background-color:var(--brandcolor)!important;color:#fff!important}.gh-portal-btn-link,.gh-portal-btn-branded,.gh-portal-btn-back{color:var(--brandcolor)!important}.gh-portal-list-detail p{color:var(--theme-muted)!important}button:focus-visible,a:focus-visible,input:focus-visible,[role="switch"]:focus-visible{outline:3px solid var(--brandcolor);outline-offset:3px}';
                doc.head.append(style);
            }
            const panel = doc.querySelector('.gh-portal-popup-container');
            if (panel) {
                panel.setAttribute('role', 'dialog');
                panel.setAttribute('aria-modal', 'true');
                const heading = panel.querySelector('h1,h2,h3');
                if (heading) {
                    if (!heading.id) heading.id = 'theme-portal-heading';
                    panel.setAttribute('aria-labelledby', heading.id);
                    panel.removeAttribute('aria-label');
                } else {
                    panel.removeAttribute('aria-labelledby');
                    panel.setAttribute('aria-label', 'Membership');
                }
            }
        };
        const load = event => {
            try {
                const next = frame.contentDocument;
                if (!next) {
                    // Before the first load, a document may simply not exist yet.
                    if (event?.type === 'load') {
                        inaccessibleFrames.add(frame);
                        closeFrame(true);
                    }
                    return;
                }
                if (next === doc) return;
                if (doc) doc.removeEventListener('keydown', keydown, true);
                observer?.disconnect();
                doc = next;
                doc.addEventListener('keydown', keydown, true);
                observer = new MutationObserver(decorate);
                observer.observe(doc, {childList: true, subtree: true, attributes: true, attributeFilter: ['content']});
                decorate();
            } catch {
                // Stop enhancing this document, restore only this adapter's background
                // state and focus, and leave the iframe's own native behavior intact.
                inaccessibleFrames.add(frame);
                closeFrame(true);
            }
        };
        frame.addEventListener('load', load);
        active = {frame, cleanup() {
            observer?.disconnect();
            doc?.removeEventListener('keydown', keydown, true);
            frame.removeEventListener('load', load);
        }};
        load();
    }

    const observePortal = () => {
        const frame = document.querySelector(frameSelector);
        if (frame) setupFrame(frame);
        else closeFrame();
    };
    new MutationObserver(observePortal).observe(document.body, {childList: true, subtree: true});
    observePortal();

    for (const region of document.querySelectorAll('.gh-content pre,.gh-content table')) {
        const update = () => {
            if (region.scrollWidth > region.clientWidth + 1 && !region.hasAttribute('tabindex')) {
                region.tabIndex = 0;
                region.dataset.themeScroll = 'true';
                if (region.tagName === 'PRE') { region.setAttribute('role', 'region'); region.setAttribute('aria-label', 'Scrollable code sample'); }
            }
        };
        update();
        new ResizeObserver(update).observe(region);
    }
})();
