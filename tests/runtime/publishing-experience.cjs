// Disposable Ghost only: verifies complete server-side collections, not a local filter.
const assert = require('node:assert/strict');
const {probe, audit} = require('./accessibility.cjs');

async function checkPublishingExperience({browser, base, admin, anon, api, out, record}) {
    for (const [slug, title] of [['library-intro', 'Research library'], ['research-2025', '2025 research archive'], ['research-2026', '2026 research archive']]) {
        await api(admin, 'post', 'pages/?source=html', {pages: [{title, slug, status: 'published', custom_excerpt: 'Fictional publications, grouped by their actual publication date (UTC).', html: '<p>Fictional metadata page.</p>'}]});
    }
    const definitions = [
        {slug: 'qa-library-2024', date: '2024-12-31T23:59:59.000Z', format: 'Research'},
        {slug: 'qa-library-2025-start', date: '2025-01-01T00:00:00.000Z', format: 'Research', topic: true},
        {slug: 'qa-library-2025-end', date: '2025-12-31T23:59:59.000Z', format: 'Brief'},
        {slug: 'qa-library-2026-start', date: '2026-01-01T00:00:00.000Z', format: 'Research', topic: true},
        {slug: 'qa-library-selection', date: new Date().toISOString(), format: 'Research', visibility: 'members', featured: true},
        ...Array.from({length: 14}, (_, index) => ({slug: `qa-library-fill-${index}`, date: `2026-06-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`, format: 'Research'})),
    ];
    for (const spec of definitions) await api(admin, 'post', 'posts/?source=html', {posts: [{
        title: `Fictional ${spec.slug}`, slug: spec.slug, status: 'published', published_at: spec.date,
        visibility: spec.visibility || 'public', featured: Boolean(spec.featured),
        custom_excerpt: 'Fictional public-safe collection summary.',
        html: `<h2>Fictional findings</h2><p>${spec.visibility ? 'RESEARCH_LIBRARY_PRIVATE_6a1' : 'Invented research fixture.'}</p>`,
        tags: [{name: spec.format}, ...(spec.topic ? [{name: 'QA Archive Topic', slug: 'qa-archive-topic'}] : [])],
    }]});
    const settings = await api(admin, 'get', 'settings/');
    const previous = settings.settings.find(setting => setting.key === 'secondary_navigation').value;
    await api(admin, 'put', 'settings/', {settings: [{key: 'secondary_navigation', value: JSON.stringify([
        {label: 'Archive topic', url: '/tag/qa-archive-topic/'},
        {label: '2025 archive', url: '/library/2025/'}, {label: '2026 archive', url: '/library/2026/'},
    ])}]});
    const ctx = await browser.newContext({javaScriptEnabled: false, viewport: {width: 1280, height: 900}});
    await ctx.route('**/*', route => new URL(route.request().url()).origin === base && route.request().method() === 'GET' ? route.continue() : route.abort());
    const page = await ctx.newPage();
    page.setDefaultTimeout(5000);
    const go = async route => {
        const response = await page.goto(base + route);
        assert.equal(response.status(), 200, route);
        assert(!(await page.content()).includes('RESEARCH_LIBRARY_PRIVATE_6a1'), 'Restricted featured body leaked');
    };
    const cardURLs = () => page.locator('.card h2 a,.card h3 a').evaluateAll(links => links.map(link => new URL(link.href).pathname));
    try {
        await probe(record, 'Research library paginates the entire published collection without client JavaScript', async () => {
            const expected = (await api(admin, 'get', 'posts/?filter=status:published&limit=1')).meta.pagination.total;
            const found = [];
            for (let number = 1; ; number++) {
                assert(number <= 10, 'Unexpected unbounded pagination');
                await go(number === 1 ? '/library/' : `/library/page/${number}/`);
                assert.equal(await page.locator('h1').textContent(), 'Research library');
                const batch = await cardURLs();
                assert(batch.length > 0 && batch.length <= 12);
                if (number === 1) assert(!batch.includes('/qa-library-2025-start/'), 'Old fixture must be outside the first page');
                found.push(...batch);
                const next = page.locator('.pagination .older-posts');
                if (!await next.count()) break;
                assert.equal(new URL(await next.getAttribute('href'), base).pathname, `/library/page/${number + 1}/`);
            }
            assert.equal(found.length, expected);
            assert.equal(new Set(found).size, expected, 'Duplicate publications across pages');
            assert(found.includes('/qa-library-2025-start/'));
        });
        await probe(record, 'Research topic archive finds older work outside the first library page', async () => {
            await go('/tag/qa-archive-topic/');
            assert.deepEqual((await cardURLs()).sort(), ['/qa-library-2025-start/', '/qa-library-2026-start/']);
            assert.equal(await page.getByRole('link', {name: '2025 archive', exact: true}).count(), 1);
        });
        await probe(record, 'Brief format archive uses native tag membership across publication years', async () => {
            await go('/tag/brief/');
            assert((await cardURLs()).includes('/qa-library-2025-end/'));
        });
        for (const [year, included, excluded] of [
            [2025, ['2025-start', '2025-end'], ['2024', '2026-start']],
            [2026, ['2026-start'], ['2024', '2025-start', '2025-end']],
        ]) await probe(record, `Research ${year} archive enforces actual UTC publication-date boundaries`, async () => {
            await go(`/library/${year}/`);
            assert.equal(await page.locator('h1').textContent(), `${year} research archive`);
            const urls = [];
            for (let number = 1; ; number++) {
                assert(number <= 10, 'Unexpected unbounded year pagination');
                if (number > 1) await go(`/library/${year}/page/${number}/`);
                urls.push(...await cardURLs());
                if (!await page.locator('.pagination .older-posts').count()) break;
            }
            for (const suffix of included) assert(urls.includes(`/qa-library-${suffix}/`), `Missing ${suffix}`);
            for (const suffix of excluded) assert(!urls.includes(`/qa-library-${suffix}/`), `Out-of-year ${suffix}`);
        });
        await probe(record, 'Featured protected selection renders only public-safe metadata', async () => {
            await go('/');
            assert.equal(await page.locator('.spotlight h2 a').textContent(), 'Fictional qa-library-selection');
            assert.equal(await page.locator('.spotlight .access-badge').textContent(), 'Members');
            assert.equal(await page.locator('.spotlight h2 a').getAttribute('href'), '/qa-library-selection/');
        });
        await probe(record, 'Research cards and report metadata reflect all four native access levels', async () => {
            for (const [slug, badge] of [['public-report', 'Public'], ['members-report', 'Members'], ['paid-report', 'Paid members'], ['tier-report', 'Selected tiers']]) {
                await go(`/${slug}/`);
                assert.equal(await page.locator('.report-metadata .access-badge').textContent(), badge);
                assert.equal(await page.locator('.report-metadata dt').allTextContents().then(items => items.includes('Published') && items.includes('Updated')), true);
                const html = await page.content();
                for (const secret of ['MEMBERS_SECRET_71b', 'PAID_SECRET_28f', 'TIER_A_SECRET_59c']) assert(!html.includes(secret));
            }
        });
        await probe(record, 'Research library and report metadata reflow on a narrow real Ghost page', async () => {
            await page.setViewportSize({width: 320, height: 900});
            for (const route of ['/library/', '/public-report/']) {
                await go(route);
                for (const size of [16, 32]) {
                    await page.evaluate(size => {
                        document.documentElement.style.fontSize = `${size}px`;
                        document.body.style.fontSize = `${size}px`;
                    }, size);
                    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} overflow at ${size}px text`);
                }
            }
        });
        const auditPage = await browser.newPage({viewport: {width: 320, height: 900}});
        try {
            await auditPage.route('**/*', route => new URL(route.request().url()).origin === base && !route.request().url().includes('/__qa__/portal.min.js') ? route.continue() : route.abort());
            await auditPage.goto(base + '/library/');
            await audit(auditPage, {out, label: 'research-library-320', record});
        } finally { await auditPage.close(); }
        assert.equal((await anon.get('/public-report/')).status(), 200, 'Existing post URL changed');
    } finally {
        await ctx.close();
        await api(admin, 'put', 'settings/', {settings: [{key: 'secondary_navigation', value: previous}]});
    }
}
module.exports = {checkPublishingExperience};
