(() => {
    'use strict';
    const frameSelector = 'iframe[title="portal-popup"]';
    let trigger;
    let active;
    const background = new Map();
    const focusable = doc => [...doc.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
        .filter(el => el.tabIndex >= 0 && !el.disabled && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');

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

    function closeFrame() {
        if (!active) return;
        active.cleanup();
        active = null;
        for (const [element, inert] of background) element.inert = inert;
        background.clear();
        const target = trigger?.isConnected ? trigger : document.querySelector('.member-actions a');
        queueMicrotask(() => { if (!document.querySelector(frameSelector)) target?.focus({preventScroll: true}); });
    }

    function setupFrame(frame) {
        if (active?.frame === frame) return;
        closeFrame();
        if (!trigger?.isConnected && document.activeElement !== document.body) trigger = document.activeElement;
        setBackgroundInert();
        let observer;
        let doc;
        const legacyCloseButtons = new WeakSet();
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#174e8b';
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
            if (!doc?.head || !doc.body) return;
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
            if (!doc.getElementById('theme-portal-accessibility')) {
                const style = doc.createElement('style');
                style.id = 'theme-portal-accessibility';
                style.textContent = '.gh-portal-btn-main{background-color:var(--brandcolor)!important;color:#fff!important}.gh-portal-btn-link,.gh-portal-btn-branded{color:var(--brandcolor)!important}button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid var(--brandcolor);outline-offset:3px}';
                doc.head.append(style);
            }
            const panel = doc.querySelector('.gh-portal-popup-container');
            if (panel) {
                panel.setAttribute('role', 'dialog');
                panel.setAttribute('aria-modal', 'true');
                const heading = panel.querySelector('h1,h2');
                if (heading) {
                    if (!heading.id) heading.id = 'theme-portal-heading';
                    panel.setAttribute('aria-labelledby', heading.id);
                    panel.removeAttribute('aria-label');
                } else panel.setAttribute('aria-label', 'Membership');
            }
        };
        const load = () => {
            try {
                const next = frame.contentDocument;
                if (!next || next === doc) return;
                if (doc) doc.removeEventListener('keydown', keydown, true);
                observer?.disconnect();
                doc = next;
                doc.addEventListener('keydown', keydown, true);
                observer = new MutationObserver(decorate);
                observer.observe(doc, {childList: true, subtree: true, attributes: true, attributeFilter: ['content']});
                decorate();
            } catch { /* A future cross-origin Portal must retain its own native behavior. */ }
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
