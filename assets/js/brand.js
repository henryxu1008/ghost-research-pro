(() => {
    'use strict';
    // Ghost supplies a hex brand color. Treat the escaped attribute as data,
    // never CSS/HTML, and retain the original palette when it is unavailable.
    const root = document.documentElement;
    let hex = root.dataset.accentColor || '';
    if (/^#[\da-f]{3}$/i.test(hex)) hex = '#' + [...hex.slice(1)].map(n => n + n).join('');
    if (!/^#[\da-f]{6}$/i.test(hex)) hex = '#174e8b';
    const channels = hex.slice(1).match(/../g).map(n => parseInt(n, 16));
    const luminance = rgb => rgb.map(n => {
        const c = n / 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    }).reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
    // One shared dark tone keeps white button labels >=4.5:1 and ordinary
    // text/focus rings >=4.5:1 on both white and the theme's #f5f8fc panel.
    // Darken along the supplied RGB hue; preserve already-readable colors.
    const ceiling = (luminance([245, 248, 252]) + 0.05) / 4.5 - 0.05;
    let scale = 1;
    while (luminance(channels.map(n => Math.floor(n * scale))) > ceiling) scale -= 0.005;
    const accent = '#' + channels.map(n => Math.floor(n * scale).toString(16).padStart(2, '0')).join('');
    root.style.setProperty('--accent', accent);
})();
