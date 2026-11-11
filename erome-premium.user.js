// ==UserScript==
// @name         Erome Premium
// @namespace    https://github.com/castielwallker
// @version      3.0.0
// @description  Combina o feed vertical TikTok, rolagem infinita, pré-carregamento e os recursos premium de SuperNinja com o visual Dark Violet, bypasses e o downloader concorrente de Maad.
// @match        https://*.erome.com/*
// @match        https://www.erome.com/*
// @icon         https://www.erome.com/favicon.ico
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license      MIT
// ==/UserScript==

/* globals $ JSZip saveAs */

(function () {
    'use strict';

    /* ============================================================
     *  CONFIGURATION & STATE
     * ============================================================ */
    const CONFIG = {
        brand: 'Erome Premium All-in-One',
        version: '3.0.0',
        accent: '#8a5acc',
        accentSoft: '#b39ad6',
        dark: '#14151f',
        darker: '#0e0f17',
        surface: '#1d1e2a',
        success: '#4ade80',
        danger: '#ef4444',
        warning: '#fbbf24'
    };

    /* === Embedded Erome Logo (base64 PNG) === */
    const LOGO_SPLASH = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAACcCAMAAABm1A0xAAAB/lBMVEWcHy2hV1ceFCBUICHc2uCcKE3PV2+WatIQEB2tkY7Ms9kPkpPgJGHbqKqHSzqhjnJgM1jcX4yOcpq3nd49QD3rxK1tU5nCCSZd196o9fclYmUp0tXWmHRUPoB+R8fmPYV7cF+FPrwFBQoRERsUEiN2dnKsCCNWVlM2NTS0hnDGyshJSEksKSZoaGlMOStxWEbS1tDMlnjn7OOMZ1JWRTe1uLaPhXOuemrSmYiUlpTlp47WpInl59tyZFOHiYgAAAHqt5Tv9O6OdFqnqKjFiXJpSTeOemcDAwUBAQMtIxuvlXgCAgSKWUnHxrm9wsJvUj2SBhgUDyCsdVpTR2mwpY+9wrsqGhOmAhvd4desmod5eYMGBgwEBAinalZFOlVwOS90Z41bWWZkWnHNua1IKhp0CBK6vMHToX07OUN9gYOIVsyxaWUGBgs+QUHhnIvUtZSdoaLuSZLo2NBeYWKbnKHGeXFxKCrJi4htTUFuWpGqh9ldYFlvFxl9gXusNVDV/f0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAS69gxAAAAgHRSTlP//+n//////6z//////////////////////////////////v7+//////////////////////////////////8F/////////43P//+x////////////////////US7///////////////////9w/////////////////////////+lpkHUAABqCSURBVHja7d2LX9NY9gBwanmsDr7H2dn375cQkzS5Sds0SUNJVvKaaadS7SBYdpGnCjK+38/913/n3PSRloIocX9lN0cUFHTmky/nnHtuHh37e2LxzyHxj6HxWyd+6o/f/fQ7jF/gjQZ+FMWpfTFzhGAPC2Yk47ex/kPyS1/8PDQS/5847LDNHC9OnMhvY6Pz/xI7UEnoHAwxyiIjCMIklywHpsboivw0NmIew7Mj4ao1wiKjAxJlxjCPmWPHgSIMm4Icnh/st/AY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';
    const LOGO_ICON   = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAB/lBMVEWXHiq1mNve4ttgIxyXbNPQcJp1WZuDTzyhUk2fjXHoIVrDp+Day7MQEBs/QDyvK0OtqZvEYGjgn34fIB45LEVfUjxjT2KHY7bABCPCpq4MCxUREBwUEiNVVlQ3NzRISEjGycezhnByWEfNl3mtCCMsKSZnaGmKZ1LR19CuemlLOStTRDd1dXLn7ONwZFWNhnTRmYe0t7Xlp4+HiIjYpIlmSjjk5tuVl5Tqt5OnqaeOdFqNe2fr8uqvlHbEiHEvIxuMWkoUDiDHxrptUTypARurdlu0pI2SBRi9wsJ5eIMJCREICBB0aYusmIcqGxNDOlBlWnKmali9wrnd4dhQQ2c9OkVxOjA+QUFeYWLNuLIQEB2doaLa4+Pm2s59gYS5vMLIioVdYFvinYtcV2R3BxNsFxl0KCWal6S0Z2W1jIaUaNWrFy2rJzbHe2nXtI99gHuwQ1O1WWiqh9dFKBdvWZKWISuUbGOCeomzOETJnKXQoX3Mu8jjxLgkHS5HLSdtTUIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+vwaQAAAAgHRSTlP/////////////////v/////////////////7+/v///////////////////////////////////////////////////////////7nR///////////////////T/////////////////////////////////////////////////zEiVIkAAArlSURBVHja7Zn3X9tIGocNJJtsL9elqMwISVZBxbIQkpHtuGHvYlpCCwRISAKk92w2u5t//d4ZGWODDVifu/vpvsTYOPb76C3zzowm83NX3377y507d34hupOIBd04T+wZMaeVSZ7OfvLGxWIHaQigAzlFGo2RfHkogD1l/8Zl1Yu4AJDKfh9iAKEPkMp8L4I5S+gBnDgwNIMD1Uc4k4bMafsM/cbpnF1EGO5CZmCAzi0/Vu5XP+G0C5mTEhpwQSBioiTLPV/5C39KlwP0J0Amf8vwXZZYkGWjx54gcIkEeAUP49wsZAY5cIMlRr/jgWDo1CinUH0BmucUEwR/wS9BlgWO7a2kCwHJh3mlItiBaQYBZ5CLVDzbfmH/Y+zrsbHHS3bFdd3A9sTQ5gWDN0tnG8cAQN8QYA0Sgf39/aWlJBqmiTnDePv4ypUrj1sB2HfDoBE2Ao7n79nyRYCz/YclYcbY6gjDdcq8ruvC35c+hEHoJgrDsGG+CIKLAAO6KMsllkm0FdMydN0wDGzoxt90o+1WsiJRBeSuuGGjH8AMBjD9AEwTSWWbYBhXfbVaVVXVKBnt7DTRrSwRMFz+5ugeYCWJPJi34NqtajVSlyUQwqVqZWr6BFFZOQVg+glDPLAEgzM5zi7YFly+alUjrZ7P5XL5vKQuFKanpoYD2DOAQUm2sAF5tuwoIg6oOEJ1KTczAwSpqE9UZk9cECsrCWAIIcMMmipZq2CahUJBrfqG7keqilAR7BPlwIX27IkLBMCc78FAgGmDClUdALgQFeK6NNMB5NFEBDGaOh/ADgEwXQ+I/YiUJwAKcVzPdwAz+aKPs7P/EQAkmNQ/xKcRUcA3FCBV/cpxjEQxOxqA7QNgGLy6UUBxvozV4yDlpLKxOZvECDrHa/EiADsMEKMqDDEAxHmnXkSIAiQNSaqfp4DxsSuvXz8eq6QGxL5RIh7Ez+vLRUkiQfoJqWUYFY0pCngN3fX12DepALb9ZRsAuu7rWv63a2VU1BAJD5HqN6ZJEsY/Pb569fFu1wNmNEA7jquGUb5moOfx2sKff/ooPyNFKN8FTE3Pfv3VV2PZipHOgxhCpONyXY2fk7ioCGKUxzrGdVxt3KWAW9NXr2YrojHAgwsHGnjQQL6Brz1blvKQYAcEjQKpn40I40ZlNilU0owGAtjLAGwMbbpe/03Sik4eWh1NgONI2Ip/oICpkOMCURRGADAngEYjAoCvFaW4XryfI/bz4EY+J1XVuD1FYpRVRJFzRwKwvQAL+/CTk1D92f0cqSAYxsQRX41jmuUsF4ZDAMwlPIgxzMrVBb/+ZQdQlopg/77mqyimWb5ciNjBgKBh+xZWqwslFdW1n2iIissSPFVxFzAFvUhM54EXNCLDslS/VMISmQ3AcvEZJDun6mqE2gmAttMLAUz/HoV++B4FqATwp0+KB1rFs8PD688cSccosjsjjRBSA2LLiADwRtfJ6I2Xy4d7e3uaVNdRpEbtaVKnUyumEmYvFyKmH8B5bWSRudKHhl3+DVxYvu449+87pIQwjiAHALilmC+4lWxKgI39QkQABi4CAWk5Iu0NUkmWCWAWytTl3CyXAJhzQ3QG8GUBYwLwjSq0ISlf18hgy/lvNB9bqv3NLHEh4DgPxlof4NQmJ9O/PTgB2BG2ClEVlnS4A4BmdD+nlurYV9VokwC2s64LhUoBbC9gwPL9ZKPcBYD9yCdrRpgtn0vFokNDtGDFuhVFjSkAZOmkL44EYLoANSrYKukVBQDAeovaz6EFPUY+zHekTrdv0TK9GJC81QHQHRdn22ohskkzsmxcz5M2SleOjv7Gb0cYdZqR98I9BjAn13gugOkAoghSjH2/itfKSEoAeSfvlCceVTVYS9IZ4YUXKJ0q6lgeciuBZfoBDABgGFtl3V+bIL0NLt0hD8cpz81NrKnla2XoFtuKK8JI6wUw59xtYXoBBRVjVcW6//AhrHxjhwII4t0cKPPuXWbuycuPBdgQNk8AzAUApgcABQrbDeyvPXiowsqLhIg64DwF+5O1Wm1ysjZXO/ohWGnSHLCjAlSwb+Hrjx7NzfmWhpCGiHWoVSn3IxgnqmVebZIiSgDMEGXOvNMJkRVZGK+B/do7rEaaWnecvT1E58zJjuZebgNgZVQAITACVBHG1x5l5sDQk8yvmacvHWnzblHTtGL+144Lc6+yYdAU0wE8pPqfM9T+5OQ/IR5PUf53mDKfP5+ZOTwG7AWCYq5k76UAcO0CJPjh3GRXTzQHll5QR9CXjl3YVLyAS8p0VMDOUYTXJh5kOtZrXx1mNn8vFkm265rkPCWE2tPxD5wJAy2NB14jqj560HWg9mq5ctfRluvUCSmWCKH2ckr0TGgVG8xw+8MBqv/wBDB5vXjUrozDUECaBpQYPalN1n4cF6GdNkcGgMMMbGB7M1C7Xtbu/u44m9MkTnWE4peTT2pXt+kthea9UQHsDQbH6lrHgRoZtr8uL6Pl8tra4V6e7JURan/a/Phpe1x0s2KTSwEQkProQYaYfvL9q6sfN0VR096XQctkIMzAFL05vr1NVnYmHQejA2z14YPJ71/tffwk0pse2c33mob2SL+ANDjghJiFxa8ZCmFKAJ44/JdIF24iXR82tCPnCBFBy1528sVwOysqipeMgxQhwgWxqyyMWHQEV94RAoKUhxS7CllVQJKZFICg6XYJgoGIeVijJs/LmiTR21LwmaaojAqAz39nW6HbBInNUBRDQWkT88cASHSxkRV3m7sUkQbAFwqu6+7uNpsu6TcKhyigmABgoYTAAXeXmHebqQCWR277NQPIogC1qLxPCIgAyqojtcVs090NlQ0vFYCVrTYFmLzAeYIimNb74wzDlrbooAZkONxVPI8LUgKSe5chuY9sCoKpcHa7fYRUtVxWNQhUCLHZCjnT47zdVAAzBLmh6wmrMJgAQG6TbgVkRw6x0myFc13voCVwyla4kSrJwVZIFQThlifwHDwHgYcpoBBZHB+ELS/wWkGwxaUA6IUgCA62tuDrgQd2TGVdgHdMnhDIegYLXmC2vC03hCJLESLe3AG7xHYAGdiAXCq8GXiKLGBIAixoqsKOt6GYpgdKA2CX3r6dn2/NU91evH37i7eLYAqKCnfkY0XYVwReae0IIwNusiw3ryjzrVaLnBMowir8KIrZ6gUYxiq3KrRkxRwdAEs8AcIDxqFIeTBNzj0UfsOEEHGG3wHo+qK8aspcOgDPwQgmJygcOVIR5FV6DMLLAi8bhv/ZMAxyw1CXWZ7bWE8DYIXbVMIi0eoieb0EIRfIOYLRtQ/XoQt8CgDLLkICDrx57+CDN/+h5R0cHHjkOIR4ox9LlhdK6+DT8OnmHMBfl5b251tLS1BFS/NLCqkmsM+zMkvPQhL7ZM/CLy6kArB/0OD88ceqAGFahd9Eq7JMj73IQ5ZL7I4CWUjlASMbkFROuMdxHC2mDXLSRY7NhMQ4sb/Aci0uLYAHQxBwk1glZ3IcPZ5LjurkUiKIjXwjLSB5Jmd19IrpkePxWeAxAAgsW0oHWKDiN8iBn6JsEDf2ydEfPQPcF2ilJrUq7PDMyACGXShBjEs8aQ8m6RjEbmuntePt0JcCjDYQYXAcmwbA8pYiL8jCuiCsr8O/9XUanPXjIHVVYs+1PwzA9Gz9B/5397AdWmMqAMNc8jj/fPPnAUjbvnnjZtfQIDEXK8P8l/V/wP8G8Msp/dyjfwM+3QqIogQPIQAAAABJRU5ErkJggg==';

    const STATE = {
        showPhotos: true,
        showVideos: true,
        showDownloadButtons: true,
        cinemaMode: false,
        nsfwBlur: loadBool('eu_nsfw', false),
        hiddenSeconds: 0,
        videoOnlyMode: loadBool('eu_video_only', false),
        sortAscending: false,
        sortMode: 'views',
        videoDurations: new Map(),
        downloadQueue: [],
        downloadInProgress: false,
        tiktokMode: false,
        tiktokType: 'videos',
        tiktokIndex: 0
    };

    function loadBool(key, def) {
        try { return localStorage.getItem(key) === 'true' ? true : (localStorage.getItem(key) === 'false' ? false : def); }
        catch (e) { return def; }
    }
    function saveBool(key, val) {
        try { localStorage.setItem(key, val ? 'true' : 'false'); } catch (e) {}
    }

    const IS_ALBUM_PAGE = /^\/a\//.test(window.location.pathname);

    /* ============================================================
     *  REDIRECT & POPUP BLOCKER
     * ============================================================ */
    const BLOCKED_PATTERNS = [
        'brightadnetwork.com',
        'pemsrv.com',
        '/jump/next.php',
        'splash.php'
    ];

    function isBlockedUrl(url) {
        return url && typeof url === 'string' && BLOCKED_PATTERNS.some(p => url.includes(p));
    }

    (function installRedirectBlocker() {
        const origOpen = window.open;
        window.open = function (url, ...rest) {
            if (isBlockedUrl(url)) { console.log('[EU] Blocked popup:', url); return null; }
            return origOpen.apply(this, [url, ...rest]);
        };

        document.addEventListener('click', function (e) {
            let t = e.target;
            while (t && t.tagName !== 'A' && t.tagName !== 'FORM') t = t.parentElement;
            if (t && t.tagName === 'A' && isBlockedUrl(t.href)) {
                console.log('[EU] Blocked click redirect:', t.href);
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            }
        }, { capture: true, passive: false });

        const observer = new MutationObserver(muts => {
            muts.forEach(m => m.addedNodes.forEach(node => {
                if (node.tagName === 'A' && isBlockedUrl(node.href)) { node.href = '#'; node.onclick = e => { e.preventDefault(); return false; }; }
                if ((node.tagName === 'SCRIPT' || node.tagName === 'IFRAME') && isBlockedUrl(node.src)) node.remove();
            }));
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    })();

    /* ============================================================
     *  STYLES — Modern Twitter-like UI
     * ============================================================ */
    GM_addStyle(`
    /* ---------- Global Theme ---------- */
    body {
        background-color: ${CONFIG.surface} !important;
        color: #fff;
    }
    a { color: ${CONFIG.accent}; }

    /* ---------- Navbar ---------- */
    .navbar-inverse { background-color: ${CONFIG.dark} !important; }
    .nav.navbar-nav.navbar-right li a {
        color: ${CONFIG.accent};
        transition: all .2s ease-in-out;
    }
    .nav.navbar-nav.navbar-right li a:hover {
        color: #fff;
        text-shadow: 0 0 10px rgba(138,90,204,.9);
        transform: scale(1.05);
    }

    /* ---------- Buttons ---------- */
    .btn-pink {
        color: #fff;
        background-color: rgba(138,90,204,.35);
        border-radius: 6px;
        border: 1px solid transparent;
        transition: all .25s ease;
    }
    .btn-pink:hover {
        background-color: transparent;
        border: 1px solid ${CONFIG.accent} !important;
        box-shadow: 0 0 20px 2px rgba(138,90,204,.5);
        color: #fff;
    }
    .btn-grey {
        color: #fff;
        border-radius: 6px;
        filter: drop-shadow(0 0 5px rgba(138,90,204,.6));
    }
    .btn-grey:hover {
        background: transparent !important;
        border: 1px solid ${CONFIG.accent} !important;
        box-shadow: 0 0 15px rgba(138,90,204,.5);
    }

    /* ---------- Album Cards ---------- */
    .album-thumbnail-container {
        transition: all .25s ease-in-out;
        position: relative;
        border-radius: 8px;
        overflow: hidden;
    }
    .album-thumbnail-container:hover {
        transform: scale(.96);
        box-shadow: 0 0 25px 4px rgba(138,90,204,.55);
    }
    .album .album-thumbnail {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }

    /* ---------- Pagination ---------- */
    .pagination > li > a, .pagination > li > span {
        background-color: ${CONFIG.dark};
        color: #fff;
        border: none;
        border-radius: 6px;
        margin: 0 4px;
        transition: background-color .3s ease;
    }
    .pagination > li > a:hover, .pagination > .active > a,
    .pagination > .active > span {
        background-color: ${CONFIG.accent};
        color: #fff;
        box-shadow: 0 0 10px rgba(138,90,204,.7);
    }

    /* ---------- NSFW Blur ---------- */
    .eu-blur {
        filter: grayscale(100%) blur(10px) invert(100%) hue-rotate(90deg) contrast(170%);
        transition: filter .3s ease;
    }

    /* ---------- Keyframes ---------- */
    @keyframes eu-spin { to { transform: rotate(360deg); } }
    @keyframes eu-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
    @keyframes eu-fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes eu-toast-in {
        0%   { opacity: 0; transform: translateX(100px); }
        100% { opacity: 1; transform: translateX(0); }
    }

    /* ---------- Download Button on Media ---------- */
    .eu-dl-btn {
        position: absolute;
        top: 10px; left: 10px;
        width: 30px; height: 30px;
        border-radius: 50%;
        background: #9d6eec;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 0 3px rgba(138,90,204,.4);
        cursor: pointer;
        transition: all .3s ease;
        overflow: hidden;
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        z-index: 9999;
        white-space: nowrap;
    }
    .eu-dl-btn svg { width: 16px; height: 16px; transition: margin-right .2s ease; }
    .eu-dl-btn:hover {
        width: 110px;
        border-radius: 24px;
        background: ${CONFIG.accent};
    }
    .eu-dl-btn:hover .eu-dl-label { display: inline; margin-left: 6px; }
    .eu-dl-btn:hover svg {
    fill: #ffffff !important;
}
    .eu-dl-btn .eu-dl-label { display: none; }
    .eu-dl-btn.downloading { background: ${CONFIG.accent}; width: 110px; border-radius: 24px; pointer-events: none; }
    .eu-dl-btn.downloading .eu-dl-label { display: inline; margin-left: 6px; }

    /* ---------- Album Badges ---------- */
    .eu-duration-badge {
        position: absolute;
        top: 8px; right: 8px;
        background: rgba(0,0,0,.82);
        color: #fff;
        padding: 3px 7px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
        z-index: 15;
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255,255,255,.08);
    }
    .eu-count-badge {
        position: absolute;
        top: 8px; left: 8px;
        background: rgba(0,0,0,.82);
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
        z-index: 15;
        display: flex;
        gap: 8px;
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255,255,255,.08);
    }
    .eu-likes-badge {
        color: ${CONFIG.accent};
        filter: drop-shadow(0 0 4px rgba(138,90,204,.8));
        margin-left: 6px;
        font-weight: 600;
    }

    /* ---------- Toast Notifications ---------- */
    .eu-toast-wrap {
        position: fixed;
        bottom: 24px; right: 24px;
        display: flex;
        flex-direction: column-reverse;
        gap: 10px;
        z-index: 100000;
        pointer-events: none;
    }
    .eu-toast {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 240px;
        max-width: 360px;
        padding: 12px 16px;
        border-radius: 12px;
        background: rgba(20,21,31,.95);
        color: ${CONFIG.accentSoft};
        font-size: 13.5px;
        font-family: 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 8px 24px rgba(0,0,0,.4), 0 0 0 1px rgba(138,90,204,.25);
        backdrop-filter: blur(10px);
        animation: eu-toast-in .35s cubic-bezier(.22,1,.36,1);
        border-left: 3px solid ${CONFIG.accent};
        pointer-events: auto;
    }
    .eu-toast svg {
        width: 18px !important;
        height: 18px !important;
        flex-shrink: 0;
        fill: currentColor;
    }
    .eu-toast span {
        flex: 1;
        word-break: break-word;
        line-height: 1.3;
    }
    .eu-toast.success { border-left-color: ${CONFIG.success}; color: #e0ffef; }
    .eu-toast.error   { border-left-color: ${CONFIG.danger};  color: #ffe0e0; }
    .eu-toast.warning { border-left-color: ${CONFIG.warning}; color: #fff4d6; }
    /* ---------- Estilização das Abas HOT / NEW ---------- */
    #tabs.mb-20 {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 12px !important;
        width: 100% !important;
        margin-top: 20px !important;
        margin-bottom: 20px !important;
    }

    #tabs .menu-tab {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 8px 28px !important; /* Mais largo para dar formato de pílula */
        border-radius: 50px !important; /* Força o arredondamento total */
        background-color: ${CONFIG.surface} !important;
        color: #aaa !important;
        font-weight: 600 !important;
        font-size: 14px !important;
        text-decoration: none !important;
        border: 1px solid rgba(255,255,255,0.08) !important;
        transition: all 0.3s ease !important;
        box-shadow: none !important; /* Remove sombras quadradas do Bootstrap */
        outline: none !important;
        line-height: 1.5 !important;
    }

    #tabs .menu-tab:hover {
        background-color: rgba(138, 90, 204, 0.15) !important;
        color: #fff !important;
        border-color: ${CONFIG.accent} !important;
    }

    /* Estado Selecionado (HOT ou NEW) */
    #tabs .menu-tab.selected {
        background: ${CONFIG.accent} !important; /* Cor sólida fica mais limpa que gradiente */
        color: #fff !important;
        border-color: ${CONFIG.accent} !important;
        box-shadow: 0 4px 12px rgba(138, 90, 204, 0.3) !important; /* Sombra suave e arredondada */
    }

    /* Remove a linha rosa original do site e qualquer borda extra */
    #tabs .menu-tab.selected::after,
    #tabs .menu-tab::after {
        display: none !important;
        content: none !important;
    }

    /* ---------- Hub Menu ---------- */
    .eu-hub {
        position: relative;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 0 4px !important;
        width: 38px !important;
        height: 38px !important;
        vertical-align: middle !important;
        align-self: center !important;
    }
    .eu-hub-btn {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 38px !important;
        height: 38px !important;
        min-width: 38px !important;
        min-height: 38px !important;
        background: ${CONFIG.surface};
        border-radius: 10px;
        color: #fff !important;
        transition: all .3s ease;
        cursor: pointer;
        border: 1px solid transparent;
        box-sizing: border-box !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    .eu-hub-btn:hover {
        border-color: ${CONFIG.accent};
        box-shadow: 0 0 15px rgba(138,90,204,.4);
        transform: translateY(-1px);
    }
    .eu-hub-btn svg,
    .eu-hub-btn i {
        width: 18px !important;
        height: 18px !important;
        font-size: 18px !important;
        fill: #fff !important;
        color: #fff !important;
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        line-height: 1 !important;
    }
    .eu-hub-menu {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: ${CONFIG.dark};
        border-radius: 12px;
        box-shadow: 0 12px 32px rgba(0,0,0,.6), 0 0 0 1px rgba(138,90,204,.2);
        padding: 8px;
        list-style: none !important;
        display: none;
        min-width: 220px;
        z-index: 10000;
        backdrop-filter: blur(12px);
        animation: eu-fade-in .2s ease;
        margin: 0 !important;
    }
    .eu-hub.open .eu-hub-menu { display: block; }
    .eu-hub-item {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        padding: 10px 12px !important;
        cursor: pointer;
        color: #fff !important;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        transition: all .2s ease;
        white-space: nowrap;
        margin: 0 !important;
        text-decoration: none !important;
    }
    .eu-hub-item:hover {
        background: rgba(138,90,204,.15);
        transform: translateX(3px);
    }
    .eu-hub-item svg,
    .eu-hub-item i {
        width: 16px !important;
        height: 16px !important;
        font-size: 14px !important;
        fill: ${CONFIG.accentSoft} !important;
        color: ${CONFIG.accentSoft} !important;
        flex-shrink: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    .eu-hub-item.inactive { opacity: .45; }
    .eu-hub-item .eu-kbd {
        margin-left: auto;
        background: rgba(255,255,255,.08);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        color: ${CONFIG.accentSoft};
    }
    /* ---------- Personalização e Efeito Hover na Barra de Botões (Álbum) ---------- */

    /* Alinha os botões da direita e define a transição */
    .col-sm-7.user-info.text-right {
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 8px !important;
        transition: all 0.3s ease !important;
    }

    /* Esconde os botões por padrão */
    .col-sm-7.user-info.text-right button.btn-grey,
    .col-sm-7.user-info.text-right .album-repost,
    .col-sm-7.user-info.text-right .album-share,
    .col-sm-7.user-info.text-right .album-flag {
        opacity: 0 !important;
        transform: translateX(20px) !important; /* Efeito de vir da direita */
        pointer-events: none !important; /* Impede cliques acidentais enquanto invisível */
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        background: rgba(138, 90, 204, 0.1) !important;
        border: 1px solid rgba(138, 90, 204, 0.3) !important;
        color: #fff !important;
        border-radius: 8px !important;
        padding: 6px 12px !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
    }

    /* Mostra os botões quando o mouse passa por cima da barra ou da área */
    .col-sm-7.user-info.text-right:hover button.btn-grey,
    .col-sm-7.user-info.text-right:hover .album-repost,
    .col-sm-7.user-info.text-right:hover .album-share,
    .col-sm-7.user-info.text-right:hover .album-flag {
        opacity: 1 !important;
        transform: translateX(0) !important;
        pointer-events: auto !important;
    }

    /* Efeito de hover individual em cada botão */
    .col-sm-7.user-info.text-right button.btn-grey:hover {
        background: ${CONFIG.accent} !important;
        border-color: ${CONFIG.accent} !important;
        box-shadow: 0 0 10px rgba(138, 90, 204, 0.5) !important;
        transform: translateY(-2px) !important;
    }

    /* Mantém as estatísticas (fotos, vídeos, views) sempre visíveis e elegantes */
    .col-sm-7.user-info.text-right > span {
        background: rgba(255, 255, 255, 0.05) !important;
        padding: 6px 10px !important;
        border-radius: 8px !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
    }
    .col-sm-7.user-info.text-right > span svg {
        fill: #aaa !important;
        width: 14px !important;
        height: 14px !important;
    }

    /* Ajuste para telas menores (Mobile), onde não existe hover */
    @media (max-width: 768px) {
        .col-sm-7.user-info.text-right button.btn-grey,
        .col-sm-7.user-info.text-right .album-repost,
        .col-sm-7.user-info.text-right .album-share,
        .col-sm-7.user-info.text-right .album-flag {
            opacity: 1 !important; /* Sempre visível no celular */
            transform: none !important;
            pointer-events: auto !important;
        }
        .col-sm-7.user-info.text-right {
            justify-content: center !important;
            margin-top: 10px !important;
        }
    }
    /* ---------- Bulk Download Modal ---------- */
    .eu-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.75);
        backdrop-filter: blur(6px);
        z-index: 99998;
        display: none;
        align-items: center;
        justify-content: center;
        animation: eu-fade-in .2s ease;
    }
    .eu-modal-overlay.open { display: flex; }
    .eu-modal {
        background: ${CONFIG.dark};
        border-radius: 16px;
        width: 440px;
        max-width: 92vw;
        max-height: 90vh;
        overflow: hidden;
        box-shadow: 0 24px 64px rgba(0,0,0,.7), 0 0 0 1px rgba(138,90,204,.2);
        animation: eu-fade-in .25s cubic-bezier(.22,1,.36,1);
    }
    .eu-modal-header {
        padding: 18px 22px;
        background: linear-gradient(135deg, ${CONFIG.accent}, #6b3fb0);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .eu-modal-header h3 {
        margin: 0;
        color: #fff;
        font-size: 17px;
        font-weight: 700;
        display: flex !important;
        align-items: center !important;
        gap: 10px;
    }
    .eu-modal-header h3 svg {
        width: 20px !important;
        height: 20px !important;
        fill: #fff !important;
    }
    .eu-modal-close {
        background: rgba(255,255,255,.2);
        border: none;
        color: #fff;
        width: 30px; height: 30px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background .2s ease;
    }
    .eu-modal-close:hover { background: rgba(255,255,255,.35); }
    .eu-modal-body { padding: 22px; }

    .eu-option-group { margin-bottom: 18px; }
    .eu-option-title {
        color: ${CONFIG.accentSoft};
        font-weight: 700;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: .8px;
        margin-bottom: 10px;
    }
    .eu-option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
        color: #e4e4e8;
        cursor: pointer;
        transition: color .2s ease;
        font-size: 14px;
    }
    .eu-option:hover { color: ${CONFIG.accentSoft}; }
    .eu-option input { display: none; }
    .eu-radio, .eu-check {
        width: 18px; height: 18px;
        border: 2px solid #555;
        border-radius: 50%;
        position: relative;
        transition: all .25s ease;
        flex-shrink: 0;
    }
    .eu-check { border-radius: 4px; }
    .eu-option input:checked + .eu-radio,
    .eu-option input:checked + .eu-check {
        border-color: ${CONFIG.accent};
        background: ${CONFIG.accent};
    }
    .eu-option input:checked + .eu-radio::after {
        content: ''; position: absolute;
        top: 4px; left: 4px;
        width: 6px; height: 6px;
        background: #fff; border-radius: 50%;
    }
    .eu-option input:checked + .eu-check::after {
        content: '✓'; position: absolute;
        top: -2px; left: 2px;
        color: #fff; font-size: 13px; font-weight: bold;
    }
    .eu-zip-preview {
        font-size: 11px;
        color: #888;
        margin-top: 6px;
        padding: 8px 10px;
        background: ${CONFIG.darker};
        border-radius: 6px;
        word-break: break-all;
        font-family: monospace;
    }
    .eu-btn-primary {
        width: 100%;
        padding: 13px;
        background: linear-gradient(135deg, ${CONFIG.accent}, #a77fd4);
        color: #fff;
        border: none;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: all .25s ease;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px;
    }
    .eu-btn-primary svg {
        width: 18px !important;
        height: 18px !important;
        fill: #fff !important;
        flex-shrink: 0;
    }
    .eu-btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(138,90,204,.5);
    }
    .eu-btn-primary:disabled { opacity: .55; cursor: not-allowed; }

    .eu-progress-box {
        margin-top: 14px;
        padding: 14px;
        background: ${CONFIG.darker};
        border-radius: 10px;
    }
    .eu-progress-bar {
        width: 100%; height: 6px;
        background: rgba(255,255,255,.08);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 8px;
    }
    .eu-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, ${CONFIG.accent}, ${CONFIG.accentSoft});
        width: 0;
        transition: width .25s ease;
    }
    .eu-progress-text {
        color: ${CONFIG.accentSoft};
        font-size: 12px;
        text-align: center;
        font-weight: 600;
    }

    /* ---------- Floating Action Button (FAB) ---------- */
    .eu-fab {
        position: fixed;
        bottom: 24px; right: 24px;
        width: 56px; height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${CONFIG.accent}, #6b3fb0);
        border: none;
        cursor: pointer;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        box-shadow: 0 6px 18px rgba(138,90,204,.55);
        transition: all .3s ease;
    }
    .eu-fab:hover { transform: scale(1.08); box-shadow: 0 8px 26px rgba(138,90,204,.75); }
    .eu-fab svg { width: 24px; height: 24px; fill: #fff; }
    .eu-fab-badge {
        position: absolute;
        top: -4px; right: -4px;
        min-width: 22px; height: 22px;
        padding: 0 6px;
        background: ${CONFIG.danger};
        color: #fff;
        border-radius: 11px;
        font-size: 11px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid ${CONFIG.dark};
    }

    /* ---------- Hidden Slider ---------- */
    .eu-hidden-slider {
        position: fixed;
        bottom: 24px; left: 24px;
        width: 44px; height: 44px;
        border-radius: 50%;
        background: ${CONFIG.dark};
        border: none;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 0 3px rgba(138,90,204,.35);
        cursor: pointer;
        transition: all .3s ease;
        z-index: 9999;
        color: #fff;
        font-weight: 700;
        font-size: 12px;
        overflow: hidden;
    }
    .eu-hidden-slider.visible { display: flex; }
    .eu-hidden-slider:hover {
        width: 110px;
        border-radius: 22px;
        background: ${CONFIG.accent};
    }
    .eu-hidden-slider svg { width: 20px; height: 20px; fill: #fff; }

    /* ---------- Video Player Custom Controls ---------- */
    .video-js .vjs-play-progress {
        background: ${CONFIG.accent} !important;
        box-shadow: 0 0 18px 4px rgba(138,90,204,.5);
    }
    .vjs-control:hover { background: rgba(138,90,204,.3); }
    .eu-player-btn {
        background: ${CONFIG.accent};
        color: #fff;
        border: none;
        border-radius: 5px;
        padding: 6px 10px;
        margin: 0 3px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background .2s ease;
        font-weight: 600;
        font-size: 12px;
    }
    .eu-player-btn:hover { background: #a77fd4; }
    .eu-player-btn svg { width: 16px; height: 16px; fill: #fff; }

    /* ---------- Cinema Overlay ---------- */
    .eu-cinema-overlay {
        position: fixed; inset: 0;
        background: rgba(0,0,0,.92);
        z-index: 998;
        pointer-events: none;
        display: none;
    }
    body.eu-cinema .eu-cinema-overlay { display: block; }
    body.eu-cinema .video-js,
    body.eu-cinema .media-group img { z-index: 9999; position: relative; }

    /* ---------- Utility ---------- */
    .eu-hidden-video { display: none !important; }
    .eu-spinner {
        width: 14px; height: 14px;
        border: 2px solid rgba(255,255,255,.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: eu-spin .8s linear infinite;
        display: inline-block;
    }

    /* ---------- Maad's Custom Styles ---------- */
    .suggested-users { display: none !important; }
    .username h1 { color: #8a5acc; }
    .username #user_name { animation: pulse 2s infinite; }
    .navbar-logo img { animation: pulse 2s infinite; }
    .album-title { display: none !important; }
    .user-verified { color: #8a5acc; filter: drop-shadow(0 0 5px rgba(138, 90, 204, 0.8)); margin-left: 6px; }
    .album-thumbnail-container:hover { transform: scale(0.9) !important; }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    /* TRAVA GLOBAL DE SEGURANÇA PARA SVGs NOVOS */
    .eu-count-badge svg {
        width: 12px !important;
        height: 12px !important;
        fill: #fff !important;
        display: inline-block !important;
        vertical-align: middle !important;
        margin: 0 !important;
    }
    .eu-tiktok-kind-pill svg,
    .eu-tiktok-desc svg,
    .eu-tiktok-views svg {
        width: 14px !important;
        height: 14px !important;
        fill: #fff !important;
        display: inline-block !important;
        vertical-align: middle !important;
        margin-right: 4px !important;
    }
    `);

    /* ============================================================
     *  ICONS (SVG)
     * ============================================================ */
    const ICONS = {
        download:  '<svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z" fill="currentColor"/></svg>',
        upload:    '<svg viewBox="0 0 384 512"><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>',
        settings:  '<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
        eye:       '<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>',
        eyeOff:    '<svg viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.39 2.59-3.26 3.1-5.34-1.71-4.38-5.98-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1.14 12c1.71 4.38 5.98 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/></svg>',
        photo:     '<svg viewBox="0 0 24 24"><path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/></svg>',
        video:     '<svg viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>',
        cinema:    '<svg viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>',
        heart:     '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        copy:      '<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>',
        zip:       '<svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-4 17h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm3 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/></svg>',
        flip:      '<svg viewBox="0 0 16 16"><path d="M7 16V0H9V16H7Z"/><path d="M15 12H14L10 8L14 4H15L15 12Z"/><path d="M2 12H1L1 4H2L6 8L2 12Z"/></svg>',
        pip:       '<svg viewBox="0 0 24 24"><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/></svg>',
        clock:     '<svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/></svg>',
        sort:      '<svg viewBox="0 0 24 24"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/></svg>',
        bell:      '<svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>',
        close:     '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
        check:     '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
        star:      '<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
        starFill:  '<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
        share:     '<svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>',
        flag:      '<svg viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>',
        comment:   '<svg viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>',
        user:      '<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
        music:     '<svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>'
    };

    /* ============================================================
     *  TOAST SYSTEM
     * ============================================================ */
    const toastWrap = document.createElement('div');
    toastWrap.className = 'eu-toast-wrap';
    (document.body || document.documentElement).appendChild(toastWrap);

    function toast(message, type = 'info', duration = 2600) {
        const t = document.createElement('div');
        t.className = `eu-toast ${type}`;
        const iconMap = { success: ICONS.check, error: ICONS.close, warning: ICONS.bell, info: ICONS.bell };
        t.innerHTML = `${iconMap[type] || ICONS.bell}<span>${message}</span>`;
        toastWrap.appendChild(t);
        setTimeout(() => {
            t.style.opacity = '0';
            t.style.transform = 'translateX(100px)';
            t.style.transition = 'all .3s ease';
            setTimeout(() => t.remove(), 350);
        }, duration);
    }

    /* ============================================================
     *  UTILITIES
     * ============================================================ */
    function formatFileSize(bytes) {
        if (!bytes) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
    }
    function formatDuration(ms) {
        let s = Math.floor(ms / 1000);
        const h = Math.floor(s / 3600); s %= 3600;
        const m = Math.floor(s / 60); s %= 60;
        return h > 0
            ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
            : `${m}:${String(s).padStart(2, '0')}`;
    }
    function getFilename(url) {
        try { return url.split('?')[0].split('/').pop(); }
        catch (e) { return 'file'; }
    }
    function sanitize(name) {
        return (name || '').replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_').substring(0, 60);
    }

    function gmRequest(opts) {
        const fn = (typeof GM !== 'undefined' && GM.xmlHttpRequest) ? GM.xmlHttpRequest
                 : (typeof GM_xmlhttpRequest !== 'undefined' ? GM_xmlhttpRequest : null);
        if (!fn) throw new Error('GM.xmlHttpRequest not available');
        return fn(opts);
    }

    /* ============================================================
     *  DOWNLOAD ENGINE
     * ============================================================ */
    async function pLimit(concurrency, items, fn) {
        const results = [];
        const executing = new Set();
        for (const item of items) {
            const p = Promise.resolve().then(() => fn(item));
            results.push(p);
            executing.add(p);
            const clean = () => executing.delete(p);
            p.then(clean, clean);
            if (executing.size >= concurrency) {
                await Promise.race(executing);
            }
        }
        return Promise.all(results);
    }

    function fetchBlobWithRetry(url, retries = 3, delay = 1000) {
        return new Promise((resolve, reject) => {
            function attempt(n) {
                const fn = (typeof GM !== 'undefined' && GM.xmlHttpRequest) ? GM.xmlHttpRequest
                         : (typeof GM_xmlhttpRequest !== 'undefined' ? GM_xmlhttpRequest : null);
                if (!fn) return reject(new Error('GM.xmlHttpRequest not available'));

                fn({
                    method: 'GET',
                    url: url,
                    responseType: 'blob',
                    headers: {
                        'User-Agent': navigator.userAgent || 'Mozilla/5.0',
                        'Referer': 'https://www.erome.com/',
                        'Accept': '*/*'
                    },
                    onload: function (response) {
                        if (response.status === 200) {
                            resolve(response.response);
                        } else {
                            if (n < retries) {
                                console.warn(`[Erome Premium] Falha ao baixar ${url}. Tentativa ${n}/${retries}. Status: ${response.status}. Retrying...`);
                                setTimeout(() => attempt(n + 1), delay * Math.pow(2, n - 1));
                            } else {
                                reject(new Error(`HTTP ${response.status}`));
                            }
                        }
                    },
                    onerror: function (err) {
                        if (n < retries) {
                            console.warn(`[Erome Premium] Erro de conexão ao baixar ${url}. Tentativa ${n}/${retries}. Retrying...`);
                            setTimeout(() => attempt(n + 1), delay * Math.pow(2, n - 1));
                        } else {
                            reject(err);
                        }
                    },
                    ontimeout: function () {
                        if (n < retries) {
                            console.warn(`[Erome Premium] Timeout ao baixar ${url}. Tentativa ${n}/${retries}. Retrying...`);
                            setTimeout(() => attempt(n + 1), delay * Math.pow(2, n - 1));
                        } else {
                            reject(new Error('Timeout'));
                        }
                    },
                    timeout: 45000
                });
            }
            attempt(1);
        });
    }

    function downloadBlob(url) {
        return fetchBlobWithRetry(url);
    }

    async function downloadSingle(url, filename, btn) {
        const name = filename || getFilename(url);
        const originalHTML = btn ? btn.innerHTML : null;

        if (btn) {
            btn.classList.add('downloading');
            btn.innerHTML = `<span class="eu-spinner"></span><span class="eu-dl-label">Downloading</span>`;
        }

        try {
            const blob = await downloadBlob(url);
            const tmp = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = tmp; a.download = name; a.style.display = 'none';
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(() => URL.revokeObjectURL(tmp), 5000);
            toast(`Downloaded: ${name}`, 'success');
        } catch (err) {
            console.error('[EU] Download failed:', err);
            toast(`Download failed: ${err}`, 'error');
        } finally {
            if (btn) {
                btn.classList.remove('downloading');
                btn.innerHTML = originalHTML;
            }
        }
    }

    /* ============================================================
     *  INLINE DOWNLOAD BUTTONS ON MEDIA
     * ============================================================ */
    function buildDownloadButton(url) {
        const btn = document.createElement('button');
        btn.className = 'eu-dl-btn';
        btn.innerHTML = `${ICONS.upload}<span class="eu-dl-label">Download</span>`;
        btn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            downloadSingle(url, getFilename(url), btn);
        });
        return btn;
    }

    function attachDownloadButtons() {
        if (!STATE.showDownloadButtons) return;

        document.querySelectorAll('.media-group video, .media-group img').forEach(media => {
            const parent = media.parentElement?.parentElement;
            if (!parent || parent.querySelector('.eu-dl-btn')) return;

            let src;
            if (media.tagName === 'IMG') {
                src = media.src || media.getAttribute('data-src');
            } else {
                src = media.querySelector('source')?.src || media.src || media.currentSrc;
            }
            if (!src) return;

            parent.style.position = parent.style.position || 'relative';
            parent.appendChild(buildDownloadButton(src));
        });

        document.querySelectorAll('.album-image img').forEach(img => {
            const src = img.src || img.getAttribute('data-src');
            if (!src) return;
            const host = img.closest('.album-image');
            if (!host || host.querySelector('.eu-dl-btn')) return;
            host.style.position = host.style.position || 'relative';
            host.appendChild(buildDownloadButton(src));
        });
    }

    /* ============================================================
     *  VIDEO DURATION DETECTION
     * ============================================================ */
    function detectVideoDuration(url) {
        return new Promise(resolve => {
            if (!url) return resolve(0);
            if (STATE.videoDurations.has(url)) return resolve(STATE.videoDurations.get(url));

            const cacheKey = 'eu_vl_' + url;
            const cached = localStorage.getItem(cacheKey);
            if (cached && !isNaN(parseInt(cached))) {
                const d = parseInt(cached);
                STATE.videoDurations.set(url, d);
                return resolve(d);
            }

            try {
                let req = gmRequest({
                    method: 'GET',
                    url,
                    headers: {
                        'Accept': 'video/webm,video/ogg,video/*;q=0.9,*/*;q=0.5',
                        'Referer': 'https://www.erome.com/',
                        'Range': 'bytes=0-500'
                    },
                    responseType: 'blob',
                    onprogress: r => { if (Math.max(r.loaded || 0, r.total || 0) > 600) req.abort?.(); },
                    onload: r => {
                        try {
                            const text = r.responseText || '';
                            const m = text.match(/\x03.*\xe8/);
                            if (m) {
                                const i = text.indexOf(m[0]) + m[0].length;
                                const s = text.substring(i, i + 4);
                                const ms = Array.from(s)
                                    .map(c => c.charCodeAt(0))
                                    .map((v, idx, arr) => v * Math.pow(256, arr.length - idx - 1))
                                    .reduce((a, b) => a + b, 0);
                                localStorage.setItem(cacheKey, ms);
                                STATE.videoDurations.set(url, ms);
                                return resolve(ms);
                            }
                        } catch (e) {}
                        resolve(0);
                    },
                    onerror: () => resolve(0),
                    ontimeout: () => resolve(0)
                });
            } catch (e) { resolve(0); }
        });
    }

    function decorateVideoDurations() {
        document.querySelectorAll('.media-group video, .video-js video').forEach(video => {
            const container = video.closest('.media-group') || video.closest('.video') || video.parentElement;
            if (!container || container.querySelector('.eu-duration-badge')) return;

            const src = video.querySelector('source')?.src || video.src || video.currentSrc;
            if (!src) return;

            detectVideoDuration(src).then(ms => {
                if (ms > 0 && !container.querySelector('.eu-duration-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'eu-duration-badge';
                    badge.textContent = formatDuration(ms);
                    container.style.position = container.style.position || 'relative';
                    container.appendChild(badge);
                    video.dataset.length = Math.floor(ms / 1000);
                    applyHiddenFilter();
                }
            });
        });
    }

    /* ============================================================
     *  ALBUM COUNT BADGES
     * ============================================================ */
    function decorateAlbumCounts() {
        document.querySelectorAll('.album').forEach(album => {
            if (album.querySelector('.eu-count-badge')) return;

            const imgCount = parseInt(album.querySelector('.album-images')?.textContent?.match(/\d+/)?.[0] || '0');
            const vidCount = parseInt(album.querySelector('.album-videos')?.textContent?.match(/\d+/)?.[0] || '0');
            if (imgCount === 0 && vidCount === 0) return;

            const badge = document.createElement('div');
            badge.className = 'eu-count-badge';
            const parts = [];
            if (imgCount > 0) parts.push(`<span style="display:inline-flex;align-items:center;gap:4px;">${ICONS.photo} ${imgCount}</span>`);
            if (vidCount > 0) parts.push(`<span style="display:inline-flex;align-items:center;gap:4px;">${ICONS.video} ${vidCount}</span>`);
            badge.innerHTML = parts.join('');

            const thumb = album.querySelector('.album-thumbnail-container');
            if (thumb) {
                thumb.style.position = thumb.style.position || 'relative';
                thumb.appendChild(badge);
            }
        });
    }

    /* ============================================================
     *  LIKE COUNTS ON ALBUMS
     * ============================================================ */
    async function loadAlbumLikes() {
        if (IS_ALBUM_PAGE) return;
        const albums = Array.from(document.querySelectorAll('.album-link')).slice(0, 30);
        for (const a of albums) {
            if (a.dataset.euLiked) continue;
            a.dataset.euLiked = '1';
            try {
                const res = await fetch(a.href);
                const text = await res.text();
                const doc = new DOMParser().parseFromString(text, 'text/html');
                const likeArea = doc.querySelector('#like_count') || doc.querySelector('.far.fa-heart.fa-lg');
                const count = likeArea?.nextElementSibling?.firstChild?.textContent?.trim() || 0;
                if (+count < 1) continue;
                const viewSec = a.parentElement.querySelector('.album-bottom-right .album-images');
                if (!viewSec) continue;
                viewSec.insertAdjacentHTML('afterbegin',
                    `<span class="eu-likes-badge">${ICONS.heart} ${count}</span>`);
            } catch (e) { /* silent */ }
        }
    }

    /* ============================================================
     *  SORT ALBUMS
     * ============================================================ */
    function parseViews(text) {
        if (!text) return 0;
        const hasK = /k/i.test(text);
        const num = parseFloat(text.replace(/[^\d.,]/g, '').replace(',', '.'));
        return (isNaN(num) ? 0 : num) * (hasK ? 1000 : 1);
    }
    function parseCount(text) {
        if (!text) return 0;
        const n = parseInt(text.replace(/[^\d]/g, ''));
        return isNaN(n) ? 0 : n;
    }
    function getAlbumMetric(album, mode) {
        switch (mode) {
            case 'videos': return parseCount(album.querySelector('.album-videos')?.textContent);
            case 'photos': return parseCount(album.querySelector('.album-images')?.textContent);
            case 'views':
            default: return parseViews(album.querySelector('.album-bottom-views')?.textContent);
        }
    }

    function sortAlbums(mode) {
        if (mode) STATE.sortMode = mode;
        const container = document.querySelector('#albums') || document.querySelector('.page-content');
        if (!container) return;
        const albums = Array.from(container.querySelectorAll('.album'));
        if (albums.length < 2) return;

        albums.sort((a, b) => {
            const va = getAlbumMetric(a, STATE.sortMode);
            const vb = getAlbumMetric(b, STATE.sortMode);
            return STATE.sortAscending ? va - vb : vb - va;
        });
        albums.forEach(a => container.appendChild(a));

        const labels = { views: 'views', videos: 'video count', photos: 'photo count' };
        toast(`Sorted by ${labels[STATE.sortMode]} (${STATE.sortAscending ? 'ascending' : 'descending'})`, 'info');
    }
    function sortAlbumsByViews() { sortAlbums('views'); }

    /* ============================================================
     *  TOGGLES
     * ============================================================ */
    function togglePhotos() {
        STATE.showPhotos = !STATE.showPhotos;
        document.querySelectorAll('.media-group').forEach(el => {
            const hasVideo = el.querySelector('video');
            if (hasVideo) return;
            const imgs = el.querySelectorAll('img');
            if (imgs.length > 0) {
                el.style.display = STATE.showPhotos ? '' : 'none';
            }
        });
        toast(STATE.showPhotos ? 'Photos visible' : 'Photos hidden', 'info');
    }

    function toggleVideos() {
        STATE.showVideos = !STATE.showVideos;
        document.querySelectorAll('.media-group, .video-js').forEach(el => {
            const hasVideo = el.querySelector('video') || el.classList.contains('video-js');
            if (hasVideo) {
                el.style.display = STATE.showVideos ? '' : 'none';
            }
        });
        toast(STATE.showVideos ? 'Videos visible' : 'Videos hidden', 'info');
    }
    function toggleDownloadButtons() {
        STATE.showDownloadButtons = !STATE.showDownloadButtons;
        document.querySelectorAll('.eu-dl-btn').forEach(btn => {
            btn.style.display = STATE.showDownloadButtons ? '' : 'none';
        });
        toast(STATE.showDownloadButtons ? 'Download buttons visible' : 'Download buttons hidden', 'info');
    }
    function toggleNSFW() {
        STATE.nsfwBlur = !STATE.nsfwBlur;
        saveBool('eu_nsfw', STATE.nsfwBlur);
        applyNSFW();
        toast(STATE.nsfwBlur ? 'NSFW blur enabled' : 'NSFW blur disabled', 'info');
    }
    function applyNSFW() {
        const targets = document.querySelectorAll(
            '.album-thumbnail-container, .media-group img, .media-group video, .vjs-poster'
        );
        targets.forEach(el => el.classList.toggle('eu-blur', STATE.nsfwBlur));
    }
    function toggleCinema() {
        STATE.cinemaMode = !STATE.cinemaMode;
        document.body.classList.toggle('eu-cinema', STATE.cinemaMode);
        if (STATE.cinemaMode && !document.querySelector('.eu-cinema-overlay')) {
            const o = document.createElement('div');
            o.className = 'eu-cinema-overlay';
            document.body.appendChild(o);
        }
        toast(STATE.cinemaMode ? 'Cinema mode on' : 'Cinema mode off', 'info');
    }
    function toggleVideoOnly() {
        STATE.videoOnlyMode = !STATE.videoOnlyMode;
        saveBool('eu_video_only', STATE.videoOnlyMode);
        applyVideoOnly();
        toast(STATE.videoOnlyMode ? 'Showing video albums only' : 'Showing all albums', 'info');
    }
    function applyVideoOnly() {
        document.querySelectorAll('.album').forEach(a => {
            const hasVideo = !!a.querySelector('.album-videos');
            a.style.display = (STATE.videoOnlyMode && !hasVideo) ? 'none' : '';
        });
    }

    /* ============================================================
     *  HIDDEN BY DURATION
     * ============================================================ */
    function applyHiddenFilter() {
        document.querySelectorAll('.video').forEach(vc => {
            const video = vc.querySelector('.video-js video');
            if (!video || !video.dataset.length) { vc.classList.remove('eu-hidden-video'); return; }
            const len = parseInt(video.dataset.length);
            if (STATE.hiddenSeconds > 0 && len < STATE.hiddenSeconds) {
                vc.classList.add('eu-hidden-video');
            } else {
                vc.classList.remove('eu-hidden-video');
            }
        });
    }

    function createHiddenSlider() {
        if (!IS_ALBUM_PAGE) return;
        if (document.querySelector('.eu-hidden-slider')) return;

        const btn = document.createElement('button');
        btn.className = 'eu-hidden-slider';
        btn.dataset.count = '0';
        btn.innerHTML = ICONS.clock;
        btn.title = 'Hide videos shorter than (seconds)';

        btn.addEventListener('mouseenter', () => {
            const n = parseInt(btn.dataset.count);
            btn.innerHTML = n > 0 ? `${n}s` : 'OFF';
        });
        btn.addEventListener('mouseleave', () => { btn.innerHTML = ICONS.clock; });
        btn.addEventListener('click', () => {
            let n = parseInt(btn.dataset.count);
            n = (n + 5) % 105;
            if (n >= 100) n = 0;
            btn.dataset.count = n;
            STATE.hiddenSeconds = n;
            btn.innerHTML = n > 0 ? `${n}s` : 'OFF';
            applyHiddenFilter();
            toast(n > 0 ? `Hiding videos shorter than ${n}s` : 'Duration filter off', 'info');
        });

        document.body.appendChild(btn);
    }

    /* ============================================================
     *  VIDEO.JS PLAYER CUSTOM CONTROLS
     * ============================================================ */
    const SPEEDS = [0.5, 1, 1.5, 2, 3, 5];

    function enhancePlayers() {
        if (typeof window.videojs === 'undefined') {
            setTimeout(enhancePlayers, 500);
            return;
        }

        document.querySelectorAll('.video-js').forEach(el => {
            if (el.dataset.euEnhanced) return;
            el.dataset.euEnhanced = '1';

            let player;
            try { player = window.videojs(el); }
            catch (e) { return; }

            player.ready(() => {
                const bar = player.controlBar?.el?.();
                if (!bar) return;

                let speedIdx = 1;
                const speedBtn = document.createElement('button');
                speedBtn.className = 'eu-player-btn';
                speedBtn.textContent = '1x';
                speedBtn.title = 'Playback speed';
                speedBtn.onclick = () => {
                    speedIdx = (speedIdx + 1) % SPEEDS.length;
                    player.playbackRate(SPEEDS[speedIdx]);
                    speedBtn.textContent = SPEEDS[speedIdx] + 'x';
                    toast(`Speed: ${SPEEDS[speedIdx]}x`, 'info', 1500);
                };

                const dlBtn = document.createElement('button');
                dlBtn.className = 'eu-player-btn';
                dlBtn.innerHTML = ICONS.download;
                dlBtn.title = 'Download video';
                dlBtn.onclick = () => {
                    const src = player.currentSrc();
                    if (src) downloadSingle(src, getFilename(src));
                };

                let flipped = false;
                const flipBtn = document.createElement('button');
                flipBtn.className = 'eu-player-btn';
                flipBtn.innerHTML = ICONS.flip;
                flipBtn.title = 'Flip video';
                flipBtn.onclick = () => {
                    const v = el.querySelector('video');
                    flipped = !flipped;
                    if (v) v.style.transform = flipped ? 'scaleX(-1)' : '';
                    toast('Video flipped', 'info', 1500);
                };

                const cineBtn = document.createElement('button');
                cineBtn.className = 'eu-player-btn';
                cineBtn.innerHTML = ICONS.cinema;
                cineBtn.title = 'Cinema mode';
                cineBtn.onclick = toggleCinema;

                const pipBtn = document.createElement('button');
                pipBtn.className = 'eu-player-btn';
                pipBtn.innerHTML = ICONS.pip;
                pipBtn.title = 'Picture-in-Picture';
                pipBtn.onclick = async () => {
                    try {
                        const v = el.querySelector('video');
                        if (document.pictureInPictureElement) { await document.exitPictureInPicture(); toast('PiP off', 'info', 1500); }
                        else if (v) { await v.requestPictureInPicture(); toast('PiP on', 'info', 1500); }
                    } catch (e) { toast('PiP not supported', 'error'); }
                };

                bar.appendChild(speedBtn);
                bar.appendChild(dlBtn);
                bar.appendChild(flipBtn);
                bar.appendChild(cineBtn);
                bar.appendChild(pipBtn);
            });
        });
    }

    /* ============================================================
     *  BULK DOWNLOAD MODAL
     * ============================================================ */
    function collectAllMediaUrls() {
        const urls = new Set();

        document.querySelectorAll('.media-group img, img.media, .album-image img').forEach(img => {
            const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-original');
            if (src && !src.includes('thumb') && !src.includes('logo') && !src.includes('avatar')) {
                try { urls.add(new URL(src, location.href).href); } catch (e) {}
            }
        });

        document.querySelectorAll('.media-group video, .video-js video, video, video source').forEach(v => {
            const src = v.src || v.getAttribute('src') || v.currentSrc;
            if (src) { try { urls.add(new URL(src, location.href).href); } catch (e) {} }
        });

        return Array.from(urls);
    }

    function isImageUrl(u) { return /\.(jpe?g|png|gif|webp|bmp)(\?|$)/i.test(u); }
    function isVideoUrl(u) { return /\.(mp4|webm|mov|avi|m3u8)(\?|$)/i.test(u); }

    function getPageTitle() {
        const el = document.querySelector('h1, .album-title');
        let title = el?.textContent?.trim() || document.title || 'Erome_Album';
        return sanitize(title) || 'Erome_Album';
    }

    function generateZipName() {
        const stamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').substring(0, 16);
        return `Erome_${stamp}_${getPageTitle()}.zip`;
    }

    function buildBulkModal() {
        if (document.getElementById('eu-bulk-modal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'eu-bulk-modal';
        overlay.className = 'eu-modal-overlay';
        overlay.innerHTML = `
          <div class="eu-modal">
            <div class="eu-modal-header">
              <h3>${ICONS.download}<span>Bulk Download</span></h3>
              <button class="eu-modal-close">${ICONS.close}</button>
            </div>
            <div class="eu-modal-body">
              <div class="eu-option-group">
                <div class="eu-option-title">Media Type</div>
                <label class="eu-option"><input type="radio" name="eu-type" value="all" checked><span class="eu-radio"></span>All files</label>
                <label class="eu-option"><input type="radio" name="eu-type" value="images"><span class="eu-radio"></span>Images only</label>
                <label class="eu-option"><input type="radio" name="eu-type" value="videos"><span class="eu-radio"></span>Videos only</label>
              </div>
              <div class="eu-option-group">
                <div class="eu-option-title">Output</div>
                <label class="eu-option"><input type="checkbox" id="eu-zip" checked><span class="eu-check"></span>Package as ZIP</label>
                <div class="eu-zip-preview" id="eu-zip-name"></div>
              </div>
              <div class="eu-option-group">
                <div class="eu-option-title">Stats</div>
                <div class="eu-zip-preview" id="eu-stats">Scanning…</div>
              </div>
              <button class="eu-btn-primary" id="eu-start-dl">${ICONS.download}<span>Start Download</span></button>
              <div class="eu-progress-box">
                <div class="eu-progress-bar"><div class="eu-progress-fill" id="eu-progress-fill"></div></div>
                <div class="eu-progress-text" id="eu-progress-text">Ready</div>
              </div>
            </div>
          </div>`;
        document.body.appendChild(overlay);

        overlay.querySelector('.eu-modal-close').onclick = () => overlay.classList.remove('open');
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });

        const refreshPreview = () => {
            document.getElementById('eu-zip-name').textContent = generateZipName();
            const urls = collectAllMediaUrls();
            const imgs = urls.filter(isImageUrl).length;
            const vids = urls.filter(isVideoUrl).length;
            document.getElementById('eu-stats').textContent = `Found ${urls.length} items (${imgs} images, ${vids} videos)`;
        };
        overlay.querySelectorAll('input[name="eu-type"]').forEach(r => r.addEventListener('change', refreshPreview));
        document.getElementById('eu-zip').addEventListener('change', refreshPreview);

        document.getElementById('eu-start-dl').onclick = () => bulkDownload(overlay);

        overlay.dataset.refresh = '1';
        overlay.addEventListener('transitionstart', refreshPreview);
        overlay._refreshPreview = refreshPreview;
    }

    function openBulkModal() {
        buildBulkModal();
        const m = document.getElementById('eu-bulk-modal');
        m.classList.add('open');
        m._refreshPreview?.();
    }

    async function bulkDownload(overlay) {
        if (STATE.downloadInProgress) { toast('A download is already running', 'warning'); return; }

        const type = overlay.querySelector('input[name="eu-type"]:checked').value;
        const asZip = overlay.querySelector('#eu-zip').checked;
        const btn = overlay.querySelector('#eu-start-dl');
        const fill = overlay.querySelector('#eu-progress-fill');
        const text = overlay.querySelector('#eu-progress-text');

        let urls = collectAllMediaUrls();
        if (type === 'images') urls = urls.filter(isImageUrl);
        if (type === 'videos') urls = urls.filter(isVideoUrl);

        if (urls.length === 0) { toast('No media found', 'error'); return; }

        STATE.downloadInProgress = true;
        btn.disabled = true;
        btn.innerHTML = `<span class="eu-spinner"></span><span>Working…</span>`;
        fill.style.width = '0%';
        text.textContent = `0 / ${urls.length}`;

        try {
            if (asZip && typeof JSZip !== 'undefined') {
                const zip = new JSZip();
                let ok = 0;

                const downloadTask = async (url, i) => {
                    const name = `${String(i + 1).padStart(3, '0')}_${getFilename(url)}`;
                    try {
                        const blob = await downloadBlob(url);
                        zip.file(name, await blob.arrayBuffer());
                        ok++;
                    } catch (e) {
                        zip.file(`ERROR_${i + 1}.txt`, `URL: ${url}\nError: ${e}`);
                    }
                    const currentPercent = (ok / urls.length) * 100;
                    fill.style.width = `${currentPercent}%`;
                    text.textContent = `Downloading ${ok}/${urls.length}: ${name.substring(0, 30)}`;
                };

                await pLimit(4, urls.map((url, i) => ({ url, i })), async (item) => {
                    await downloadTask(item.url, item.i);
                });

                text.textContent = 'Generating ZIP…';
                const zipBlob = await zip.generateAsync(
                    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
                    meta => { text.textContent = `Compressing: ${Math.round(meta.percent)}%`; fill.style.width = `${meta.percent}%`; }
                );
                if (typeof saveAs === 'function') saveAs(zipBlob, generateZipName());
                else {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(zipBlob);
                    a.download = generateZipName();
                    a.click();
                }
                fill.style.width = '100%';
                text.textContent = `Complete (${ok}/${urls.length})`;
                toast(`ZIP saved: ${ok}/${urls.length} files`, 'success');
            } else {
                let ok = 0;

                const downloadTask = async (url, i) => {
                    const name = `${String(i + 1).padStart(3, '0')}_${getFilename(url)}`;
                    try {
                        const blob = await downloadBlob(url);
                        const u = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = u; a.download = name; a.style.display = 'none';
                        document.body.appendChild(a); a.click(); a.remove();
                        setTimeout(() => URL.revokeObjectURL(u), 5000);
                        ok++;
                    } catch (e) {
                        console.error(e);
                    }
                    const currentPercent = (ok / urls.length) * 100;
                    fill.style.width = `${currentPercent}%`;
                    text.textContent = `Downloading ${ok}/${urls.length}`;
                };

                await pLimit(4, urls.map((url, i) => ({ url, i })), async (item) => {
                    await downloadTask(item.url, item.i);
                });

                fill.style.width = '100%';
                text.textContent = `Complete (${ok}/${urls.length})`;
                toast(`Downloaded ${ok}/${urls.length} files`, 'success');
            }
        } catch (err) {
            console.error(err);
            toast('Bulk download error', 'error');
        } finally {
            STATE.downloadInProgress = false;
            btn.disabled = false;
            btn.innerHTML = `${ICONS.download}<span>Start Download</span>`;
        }
    }

    /* ============================================================
     *  TIKTOK-STYLE VERTICAL SCROLL MODE
     * ============================================================ */
    GM_addStyle(`
    .eu-tiktok-overlay {
        position: fixed; inset: 0;
        background: radial-gradient(circle at 50% 30%, #1a1a2e 0%, #000 70%);
        z-index: 99999;
        display: none;
        align-items: center;
        justify-content: center;
        animation: eu-fade-in .3s ease;
    }
    .eu-tiktok-overlay.open { display: flex; }

    .eu-phone {
        position: relative;
        width: min(420px, 92vw);
        height: min(calc(420px * 16 / 9), 94vh);
        aspect-ratio: 9 / 16;
        background: #000;
        border-radius: 28px;
        overflow: hidden;
        box-shadow:
            0 0 0 8px #111,
            0 0 0 9px #2a2a2a,
            0 30px 80px rgba(138, 90, 204, .25),
            0 60px 120px rgba(0, 0, 0, .7);
        display: flex;
        flex-direction: column;
    }
    .eu-phone::before {
        content: '';
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        width: 110px;
        height: 22px;
        background: #0a0a0a;
        border-radius: 14px;
        z-index: 100;
    }
    @media (max-width: 520px) {
        .eu-phone {
            width: 100vw;
            height: 100vh;
            border-radius: 0;
            box-shadow: none;
            aspect-ratio: auto;
        }
        .eu-phone::before { display: none; }
    }

    .eu-tiktok-topbar {
        position: absolute;
        top: 0; left: 0; right: 0;
        padding-top: 36px;
        height: 86px;
        background: linear-gradient(180deg, rgba(0,0,0,.9), transparent);
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding-left: 14px;
        padding-right: 14px;
        z-index: 20;
        pointer-events: none;
    }
    .eu-tiktok-topbar > * { pointer-events: auto; }
    .eu-tiktok-title {
        color: #fff;
        font-weight: 700;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .eu-tiktok-title span {
        border-bottom: 2px solid ${CONFIG.accent};
        padding-bottom: 2px;
    }
    .eu-tiktok-title svg { width: 16px; height: 16px; fill: #fff; }
    .eu-tiktok-brand-logo {
        height: 22px; width: auto;
        filter: drop-shadow(0 0 6px rgba(138,90,204,0.7));
        border-radius: 4px;
    }

    .eu-tiktok-splash {
        position: absolute; inset: 0;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        background: linear-gradient(135deg, #0e0f17 0%, #14151f 50%, #2a1f3d 100%);
        z-index: 100;
        gap: 18px;
        animation: eu-splash-fade 1.8s ease forwards;
        animation-delay: 0.8s;
        pointer-events: none;
    }
    .eu-tiktok-splash-logo {
        max-width: 76%; width: 360px; height: auto;
        filter: drop-shadow(0 0 40px rgba(138,90,204,0.7));
        animation: eu-splash-pop .7s cubic-bezier(.2,.9,.3,1.2);
    }
    .eu-tiktok-splash-tag {
        color: #b39ad6; font-size: 13px; font-weight: 700;
        letter-spacing: 4px; text-transform: uppercase;
        animation: eu-splash-pop .9s cubic-bezier(.2,.9,.3,1.2);
    }
    .eu-tiktok-splash-dots {
        display: flex; gap: 8px;
    }
    .eu-tiktok-splash-dots span {
        width: 8px; height: 8px; border-radius: 50%;
        background: #8a5acc;
        animation: eu-splash-dot 1.2s ease-in-out infinite;
    }
    .eu-tiktok-splash-dots span:nth-child(2) { animation-delay: .2s; }
    .eu-tiktok-splash-dots span:nth-child(3) { animation-delay: .4s; }
    @keyframes eu-splash-pop {
        0% { opacity: 0; transform: scale(.6); }
        100% { opacity: 1; transform: scale(1); }
    }
    @keyframes eu-splash-dot {
        0%, 100% { opacity: 0.3; transform: translateY(0); }
        50%      { opacity: 1;   transform: translateY(-6px); }
    }
    @keyframes eu-splash-fade {
        0%   { opacity: 1; }
        85%  { opacity: 1; }
        100% { opacity: 0; visibility: hidden; pointer-events: none; }
    }
    .eu-tiktok-controls {
        display: flex;
        gap: 6px;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-end;
    }
    .eu-tiktok-tab {
        background: rgba(255,255,255,.12);
        color: #fff;
        border: none;
        padding: 5px 10px;
        border-radius: 14px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all .2s ease;
        backdrop-filter: blur(6px);
    }
    .eu-tiktok-tab:hover { background: rgba(255,255,255,.22); }
    .eu-tiktok-tab.active {
        background: ${CONFIG.accent};
        box-shadow: 0 0 12px rgba(138,90,204,.6);
    }
    .eu-tiktok-close {
        background: rgba(0,0,0,.65);
        color: #fff;
        border: none;
        width: 32px; height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background .2s ease;
        backdrop-filter: blur(6px);
    }
    .eu-tiktok-close:hover { background: rgba(255,255,255,.2); }
    .eu-tiktok-close svg { width: 16px; height: 16px; fill: #fff; }

    .eu-tiktok-feed {
        flex: 1;
        overflow-y: scroll;
        scroll-snap-type: y mandatory;
        scrollbar-width: none;
        -ms-overflow-style: none;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
    }
    .eu-tiktok-feed::-webkit-scrollbar { display: none; }

    .eu-tiktok-item {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 100%;
        scroll-snap-align: start;
        scroll-snap-stop: always;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
        overflow: hidden;
    }
    .eu-tiktok-media {
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #000;
    }
    .eu-tiktok-item::after {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        box-shadow: inset 0 -140px 160px -40px rgba(0,0,0,.55), inset 0 70px 80px -40px rgba(0,0,0,.35);
    }

    .eu-tiktok-sidebar {
        position: absolute;
        right: 10px;
        bottom: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        z-index: 5;
        max-height: calc(100% - 48px);
    }
    .eu-tiktok-user-link {
        color: #fff !important;
        text-decoration: none;
    }
    .eu-tiktok-action {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        color: #fff;
        cursor: pointer;
        transition: transform .15s ease;
    }
    .eu-tiktok-action:hover { transform: scale(1.12); }
    .eu-tiktok-action:active { transform: scale(.92); }
    .eu-tiktok-action .eu-tiktok-icon {
        width: 40px; height: 40px;
        border-radius: 50%;
        background: rgba(0,0,0,.55);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255,255,255,.12);
        transition: all .2s ease;
    }
    .eu-tiktok-action .eu-tiktok-icon svg { width: 20px; height: 20px; fill: #fff; }
    .eu-tiktok-action.liked .eu-tiktok-icon { background: #ef4444; animation: eu-pulse .35s ease; }
    .eu-tiktok-action .eu-tiktok-lbl {
        font-size: 10px;
        font-weight: 700;
        text-shadow: 0 0 6px rgba(0,0,0,.95);
    }

    .eu-tiktok-caption {
        position: absolute;
        left: 14px;
        right: 80px;
        bottom: 22px;
        color: #fff;
        z-index: 4;
        padding-bottom: 12px;
        background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
        padding-top: 40px; padding-left: 0; padding-right: 0;
        margin-left: -14px; margin-right: -80px;
        padding-left: 14px; padding-right: 80px;
    }
    .eu-tiktok-caption .eu-tiktok-user {
        font-weight: 700;
        font-size: 14px;
        margin-bottom: 4px;
        text-shadow: 0 0 8px rgba(0,0,0,.95);
    }
    .eu-tiktok-caption .eu-tiktok-desc {
        font-size: 12px;
        line-height: 1.35;
        opacity: .92;
        text-shadow: 0 0 8px rgba(0,0,0,.95);
        max-height: 54px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }
    .eu-tiktok-caption .eu-tiktok-album {
        display: inline-block;
        margin-top: 6px;
        font-size: 11px;
        padding: 3px 8px;
        background: rgba(138,90,204,.4);
        border-radius: 8px;
        backdrop-filter: blur(6px);
        color: #fff;
    }

    .eu-tiktok-counter {
        position: absolute;
        top: 95px;
        left: 14px;
        background: rgba(0,0,0,.55);
        color: #fff;
        padding: 4px 10px;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 700;
        z-index: 5;
        backdrop-filter: blur(6px);
    }

    .eu-tiktok-play-hint {
        position: absolute;
        width: 64px; height: 64px;
        background: rgba(0,0,0,.65);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        opacity: 0;
        transition: opacity .2s ease;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
    }
    .eu-tiktok-play-hint.show { opacity: 1; }
    .eu-tiktok-play-hint svg { width: 32px; height: 32px; fill: #fff; }

    .eu-tiktok-progress {
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 3px;
        background: rgba(255,255,255,.12);
        z-index: 6;
    }
    .eu-tiktok-progress-fill {
        height: 100%;
        background: #fff;
        width: 0;
        transition: width .1s linear;
    }

    .eu-tiktok-top {
        position: absolute; top: 14px; left: 14px; right: 70px;
        display: flex; align-items: center; gap: 8px;
        z-index: 10; pointer-events: none;
    }
    .eu-tiktok-views, .eu-tiktok-kind-pill {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(0,0,0,0.55); backdrop-filter: blur(8px);
        color: #fff; font-size: 11px; font-weight: 600;
        padding: 5px 10px; border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.1);
    }
    .eu-tiktok-views svg, .eu-tiktok-kind-pill svg { width: 12px; height: 12px; fill: #fff; }

    .eu-tiktok-avatar {
        position: relative; width: 52px; height: 52px;
        border-radius: 50%; overflow: visible;
        border: 2px solid #fff; margin-bottom: 6px;
        display: block; flex-shrink: 0;
        transition: transform .2s ease;
    }
    .eu-tiktok-avatar:hover { transform: scale(1.08); }
    .eu-tiktok-avatar img {
        width: 100%; height: 100%; border-radius: 50%;
        object-fit: cover; background: #8a5acc;
        display: block;
    }
    .eu-tiktok-avatar-plus {
        position: absolute; bottom: -7px; left: 50%;
        transform: translateX(-50%);
        width: 20px; height: 20px; border-radius: 50%;
        background: #ff0050; color: #fff;
        font-size: 14px; font-weight: 700;
        display: flex; align-items: center; justify-content: center;
        line-height: 1; border: 2px solid transparent;
    }

    .eu-tiktok-action.faved .eu-tiktok-icon { background: #f59e0b; animation: eu-pulse .35s ease; }
    .eu-tiktok-action.faved .eu-tiktok-icon svg { fill: #fff; }
    .eu-tiktok-action-mini .eu-tiktok-icon {
        width: 36px !important; height: 36px !important;
        background: rgba(0,0,0,.55) !important;
    }
    .eu-tiktok-action-mini .eu-tiktok-icon svg { width: 16px !important; height: 16px !important; }
    .eu-tiktok-count {
        font-variant-numeric: tabular-nums;
        min-width: 20px; text-align: center;
    }

    .eu-tiktok-disc {
        width: 48px; height: 48px; border-radius: 50%;
        overflow: hidden; border: 6px solid #111;
        background: #000; flex-shrink: 0;
        animation: eu-spin 6s linear infinite;
        box-shadow: 0 2px 10px rgba(0,0,0,0.6);
        margin-top: 4px;
    }
    .eu-tiktok-disc img { width: 100%; height: 100%; object-fit: cover; }
    @keyframes eu-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .eu-tiktok-ticker {
        display: flex; align-items: center; gap: 6px;
        color: #fff; font-size: 12px; opacity: .85;
        margin-top: 6px;
        white-space: nowrap; overflow: hidden;
    }
    .eu-tiktok-ticker svg { width: 13px; height: 13px; fill: #fff; flex-shrink: 0; }
    .eu-tiktok-ticker span {
        display: inline-block; animation: eu-ticker 12s linear infinite;
        padding-left: 0;
    }
    @keyframes eu-ticker {
        0%   { transform: translateX(0); }
        50%  { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }

    .eu-tiktok-caption .eu-tiktok-album {
        display: inline-flex !important; align-items: center; gap: 6px;
        margin-top: 6px;
        background: rgba(138, 90, 204, 0.25);
        border: 1px solid rgba(138, 90, 204, 0.5);
        padding: 6px 12px; border-radius: 20px;
        font-size: 12px; font-weight: 600;
        text-decoration: none; color: #fff !important;
        transition: all .2s ease;
    }
    .eu-tiktok-caption .eu-tiktok-album:hover {
        background: rgba(138, 90, 204, 0.5);
        transform: translateY(-1px);
    }
    .eu-tiktok-caption .eu-tiktok-album svg { width: 12px; height: 12px; fill: #fff; }

    .eu-tiktok-loading {
        color: #fff;
        text-align: center;
        padding: 24px;
        font-size: 13px;
        opacity: .7;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .eu-tiktok-empty {
        color: #aaa;
        font-size: 13px;
        text-align: center;
        padding: 40px 20px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .eu-tiktok-hint {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: rgba(255,255,255,.5);
        font-size: 11px;
        text-align: center;
        z-index: 2;
        pointer-events: none;
        animation: eu-hint-bounce 2s ease infinite;
    }
    @keyframes eu-hint-bounce {
        0%, 100% { transform: translate(-50%, 0); opacity: .5; }
        50% { transform: translate(-50%, -6px); opacity: 1; }
    }

    .eu-tiktok-heart-pop {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%) scale(0);
        font-size: 120px;
        pointer-events: none;
        opacity: 0;
        z-index: 50;
    }
    .eu-tiktok-heart-pop.animate {
        animation: eu-heart-pop .8s ease;
    }
    @keyframes eu-heart-pop {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        30% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        70% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
    }
    `);

    /* --- TikTok State --- */
    const TT = {
        items: [],
        seenUrls: new Set(),
        albumQueue: [],
        albumSeen: new Set(),
        loadingMore: false,
        io: null,
        currentAlbum: null
    };

    function extractMediaFromDoc(doc, type, albumMeta = {}) {
        const results = [];
        const add = (kind, url) => {
            if (!url || TT.seenUrls.has(url)) return;
            if (url.includes('thumb') || url.includes('avatar') || url.includes('logo')) return;
            TT.seenUrls.add(url);
            results.push({ kind, url, ...albumMeta });
        };

        if (type === 'videos' || type === 'all') {
            doc.querySelectorAll('.media-group video, .video-js video, video').forEach(v => {
                const src = v.querySelector('source')?.src || v.src || v.getAttribute('src');
                if (src) add('video', src.startsWith('//') ? 'https:' + src : src);
            });
            doc.querySelectorAll('.media-group source, video source').forEach(s => {
                const src = s.src || s.getAttribute('src');
                if (src) add('video', src.startsWith('//') ? 'https:' + src : src);
            });
        }

        if (type === 'photos' || type === 'all') {
            doc.querySelectorAll('.media-group img, .album-image img, img.img-front').forEach(img => {
                const src = img.src || img.getAttribute('data-src') || img.getAttribute('src');
                if (src) add('image', src.startsWith('//') ? 'https:' + src : src);
            });
        }

        return results;
    }

    function getAlbumMetaFromDoc(doc, fallbackUrl) {
        const userEl = doc.getElementById('user_name') || doc.querySelector('.username');
        const titleEl = doc.querySelector('.page-content h1, h1');

        const grabCount = (selector) => {
            const el = doc.querySelector(selector);
            if (!el) return '';
            const m = (el.textContent || '').match(/[\d,.]+[kKmM]?/);
            return m ? m[0] : '';
        };

        return {
            username: userEl?.textContent?.replace(/\s+/g, ' ').trim() || 'Erome',
            title: titleEl?.textContent?.trim() || 'Album',
            albumUrl: fallbackUrl || location.href,
            likeCount: grabCount('#like_count') || grabCount('.likes-count') || grabCount('.fa-heart + span') || '',
            favCount: grabCount('#favorites_count') || grabCount('.favorites-count') || grabCount('.fa-star + span') || '',
            viewCount: grabCount('#views_count') || grabCount('.views-count') || grabCount('.fa-eye + span') || ''
        };
    }

    function collectCurrentPageItems(type) {
        TT.seenUrls = new Set();
        const meta = getAlbumMetaFromDoc(document, location.href);
        TT.currentAlbum = meta;
        return extractMediaFromDoc(document, type, meta);
    }

    function buildNextAlbumQueue() {
        const links = new Set();
        document.querySelectorAll('a.album-link, .album a[href*="/a/"]').forEach(a => {
            const href = a.getAttribute('href');
            if (href && /\/a\//.test(href) && href !== location.pathname) {
                const abs = new URL(href, location.href).href;
                if (!TT.albumSeen.has(abs)) links.add(abs);
            }
        });
        TT.albumQueue = Array.from(links);
        console.log(`[EU] TikTok queue: ${TT.albumQueue.length} related albums ready to preload`);
    }

    async function fetchAlbumPage(url) {
        try {
            const res = await fetch(url, { credentials: 'include' });
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            return doc;
        } catch (e) {
            console.warn('[EU] Failed to preload album:', url, e);
            return null;
        }
    }

    async function preloadNextAlbum() {
        if (TT.loadingMore) return 0;
        if (TT.albumQueue.length === 0) {
            buildNextAlbumQueue();
            if (TT.albumQueue.length === 0) return 0;
        }

        TT.loadingMore = true;
        showLoadingCard(true);

        const url = TT.albumQueue.shift();
        TT.albumSeen.add(url);
        const doc = await fetchAlbumPage(url);
        let added = 0;

        if (doc) {
            const meta = getAlbumMetaFromDoc(doc, url);
            const newItems = extractMediaFromDoc(doc, STATE.tiktokType, meta);
            added = newItems.length;
            if (added > 0) {
                TT.items.push(...newItems);
                newItems.forEach((item, i) => appendTikTokCard(item, TT.items.length - added + i));
                updateTikTokCounter();
                console.log(`[EU] Preloaded ${added} items from: ${meta.title}`);
            }
        }

        showLoadingCard(false);
        TT.loadingMore = false;

        if (added === 0 && TT.albumQueue.length > 0) {
            return preloadNextAlbum();
        }

        return added;
    }

    function showLoadingCard(show) {
        const feed = document.getElementById('eu-tiktok-feed');
        if (!feed) return;
        let card = feed.querySelector('.eu-tiktok-loading');
        if (show) {
            if (!card) {
                card = document.createElement('div');
                card.className = 'eu-tiktok-loading';
                card.innerHTML = `<span class="eu-spinner"></span><span>Loading next album…</span>`;
                feed.appendChild(card);
            }
        } else if (card) {
            card.remove();
        }
    }


    function removerContadoresAlbum() {
        // Seleciona todos os spans dentro da barra de ações do álbum
        const spans = document.querySelectorAll('.col-sm-7.user-info.text-right > span');
        spans.forEach(span => span.remove());
    }


    function updateTikTokCounter() {
        const el = document.getElementById('eu-tiktok-counter');
        if (!el) return;
        const idx = Math.min(STATE.tiktokIndex + 1, TT.items.length);
        el.textContent = `${idx} / ${TT.items.length}`;
    }

    function appendTikTokCard(item, idx) {
        const feed = document.getElementById('eu-tiktok-feed');
        if (!feed) return;

        const el = document.createElement('div');
        el.className = 'eu-tiktok-item';
        el.dataset.idx = idx;
        el._euData = item;

        let mediaHTML;
        if (item.kind === 'video') {
            mediaHTML = `<video class="eu-tiktok-media" src="${item.url}" loop playsinline preload="metadata" muted></video>`;
        } else {
            mediaHTML = `<img class="eu-tiktok-media" src="${item.url}" alt="" loading="lazy">`;
        }

        const descText = (item.title || '').replace(/[<>]/g, '');
        const kindIcon = item.kind === 'video' ? ICONS.video : ICONS.photo;

        const username = (item.username || 'Erome').replace(/[<>]/g, '');
        const avatarSeed = encodeURIComponent(username);
        const likeCount = item.likeCount || '';
        const favCount = item.favCount || '';
        const viewCount = item.viewCount || '';
        const albumHref = item.albumUrl || '#';

        el.innerHTML = `
            ${mediaHTML}
            <div class="eu-tiktok-play-hint">${ICONS.video}</div>
            <div class="eu-tiktok-heart-pop">❤️</div>

            <div class="eu-tiktok-top">
                ${viewCount ? `<span class="eu-tiktok-views">${ICONS.eye}<span>${viewCount}</span></span>` : ''}
                <span class="eu-tiktok-kind-pill">${kindIcon} ${item.kind === 'video' ? 'Video' : 'Photo'}</span>
            </div>

            <div class="eu-tiktok-caption">
                <a class="eu-tiktok-user" href="${albumHref}" target="_blank" rel="noopener">@${username}</a>
                <div class="eu-tiktok-desc">${descText || `${kindIcon} Media`}</div>
                ${item.albumUrl ? `<a class="eu-tiktok-album" href="${item.albumUrl}" target="_blank" rel="noopener">${ICONS.eye}<span>View Album on Erome</span></a>` : ''}
                <div class="eu-tiktok-ticker">
                    ${ICONS.music}<span>Erome · @${username}</span>
                </div>
            </div>

            <div class="eu-tiktok-sidebar">
                <a class="eu-tiktok-avatar" href="${albumHref}" target="_blank" rel="noopener" title="Visit @${username}">
                    <img src="https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=8a5acc" alt="${username}">
                    <span class="eu-tiktok-avatar-plus">+</span>
                </a>

                <div class="eu-tiktok-action" data-act="like" title="Like">
                    <div class="eu-tiktok-icon">${ICONS.heart}</div>
                    <div class="eu-tiktok-lbl eu-tiktok-count">${likeCount || 'Like'}</div>
                </div>

                <div class="eu-tiktok-action" data-act="favorite" title="Add to Favorites">
                    <div class="eu-tiktok-icon">${ICONS.star}</div>
                    <div class="eu-tiktok-lbl eu-tiktok-count">${favCount || 'Favorite'}</div>
                </div>

                <div class="eu-tiktok-action" data-act="comment" title="Comments">
                    <div class="eu-tiktok-icon">${ICONS.comment}</div>
                    <div class="eu-tiktok-lbl">Comments</div>
                </div>

                <div class="eu-tiktok-action" data-act="share" title="Share">
                    <div class="eu-tiktok-icon">${ICONS.share}</div>
                    <div class="eu-tiktok-lbl">Share</div>
                </div>

                <div class="eu-tiktok-action" data-act="download" title="Save">
                    <div class="eu-tiktok-icon">${ICONS.download}</div>
                    <div class="eu-tiktok-lbl">Save</div>
                </div>

                <div class="eu-tiktok-action" data-act="copy" title="Copy URL">
                    <div class="eu-tiktok-icon">${ICONS.copy}</div>
                    <div class="eu-tiktok-lbl">Copy</div>
                </div>

                <div class="eu-tiktok-action eu-tiktok-action-mini" data-act="report" title="Report">
                    <div class="eu-tiktok-icon">${ICONS.flag}</div>
                </div>

                <div class="eu-tiktok-disc">
                    <img src="https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}&backgroundColor=14151f" alt="">
                </div>
            </div>

            ${item.kind === 'video' ? '<div class="eu-tiktok-progress"><div class="eu-tiktok-progress-fill"></div></div>' : ''}
        `;

        el.querySelectorAll('.eu-tiktok-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const act = btn.dataset.act;
                if (act === 'download') downloadSingle(item.url, getFilename(item.url));
                if (act === 'copy') {
                    navigator.clipboard?.writeText(item.url)
                        .then(() => toast('URL copied!', 'success', 1400))
                        .catch(() => toast('Copy failed', 'error'));
                }
                if (act === 'like') {
                    btn.classList.toggle('liked');
                    if (btn.classList.contains('liked')) {
                        showHeartPop(el);
                        toast('Liked \u2665', 'success', 1200);
                    }
                }
                if (act === 'favorite') {
                    btn.classList.toggle('faved');
                    toast(btn.classList.contains('faved') ? 'Added to favorites \u2b50' : 'Removed from favorites', 'success', 1400);
                }
                if (act === 'comment') {
                    if (item.albumUrl) window.open(item.albumUrl + '#comments', '_blank');
                    else toast('Comments available on the full album page', 'info');
                }
                if (act === 'share') {
                    const shareUrl = item.albumUrl || item.url;
                    if (navigator.share) {
                        navigator.share({ title: `Erome \u00b7 @${username}`, url: shareUrl }).catch(() => {});
                    } else {
                        navigator.clipboard?.writeText(shareUrl)
                            .then(() => toast('Share link copied \ud83d\udce4', 'success', 1400))
                            .catch(() => toast('Copy failed', 'error'));
                    }
                }
                if (act === 'report') {
                    if (confirm('Open the full album page to report this content?') && item.albumUrl) {
                        window.open(item.albumUrl, '_blank');
                    }
                }
            });
        });

        let lastTap = 0;
        el.addEventListener('click', (e) => {
            if (e.target.closest('.eu-tiktok-sidebar') || e.target.closest('.eu-tiktok-album')) return;

            const now = Date.now();
            if (now - lastTap < 350) {
                const likeBtn = el.querySelector('.eu-tiktok-action[data-act="like"]');
                if (likeBtn && !likeBtn.classList.contains('liked')) {
                    likeBtn.classList.add('liked');
                }
                showHeartPop(el);
            } else {
                if (item.kind === 'video') {
                    const video = el.querySelector('video');
                    const hint = el.querySelector('.eu-tiktok-play-hint');
                    if (video) {
                        if (video.paused) { video.play().catch(() => {}); hint.classList.remove('show'); }
                        else { video.pause(); hint.classList.add('show'); }
                    }
                }
            }
            lastTap = now;
        });

        if (TT.io) TT.io.observe(el);

        const loadingCard = feed.querySelector('.eu-tiktok-loading');
        if (loadingCard) feed.insertBefore(el, loadingCard);
        else feed.appendChild(el);

        if (item.kind === 'video') {
            const video = el.querySelector('video');
            const fill = el.querySelector('.eu-tiktok-progress-fill');
            video?.addEventListener('timeupdate', () => {
                if (video.duration) fill.style.width = `${(video.currentTime / video.duration) * 100}%`;
            });
        }
    }

    function showHeartPop(cardEl) {
        const pop = cardEl.querySelector('.eu-tiktok-heart-pop');
        if (!pop) return;
        pop.classList.remove('animate');
        void pop.offsetWidth;
        pop.classList.add('animate');
    }

    function buildTikTokOverlay() {
        if (document.getElementById('eu-tiktok')) return;

        const overlay = document.createElement('div');
        overlay.id = 'eu-tiktok';
        overlay.className = 'eu-tiktok-overlay';
        overlay.innerHTML = `
          <div class="eu-phone">
            <div class="eu-tiktok-splash" id="eu-tiktok-splash">
              <img src="${LOGO_SPLASH}" alt="Erome" class="eu-tiktok-splash-logo">
              <div class="eu-tiktok-splash-tag">Ultimate Premium</div>
              <div class="eu-tiktok-splash-dots"><span></span><span></span><span></span></div>
            </div>
            <div class="eu-tiktok-topbar">
              <div class="eu-tiktok-title">
                <img src="${LOGO_ICON}" alt="Erome" class="eu-tiktok-brand-logo">
                <span>For You</span>
              </div>
              <div class="eu-tiktok-controls">
                <button class="eu-tiktok-tab" data-type="videos">Videos</button>
                <button class="eu-tiktok-tab" data-type="photos">Photos</button>
                <button class="eu-tiktok-tab" data-type="all">All</button>
                <button class="eu-tiktok-close" title="Close">${ICONS.close}</button>
              </div>
            </div>
            <div class="eu-tiktok-counter" id="eu-tiktok-counter">0 / 0</div>
            <div class="eu-tiktok-feed" id="eu-tiktok-feed"></div>
          </div>`;

        document.body.appendChild(overlay);

        overlay.querySelector('.eu-tiktok-close').addEventListener('click', closeTikTok);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeTikTok();
        });

        overlay.querySelectorAll('.eu-tiktok-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                STATE.tiktokType = tab.dataset.type;
                updateTikTokTabs();
                resetAndRenderFeed();
            });
        });

        const feed = overlay.querySelector('#eu-tiktok-feed');
        TT.io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const card = entry.target;
                const videoEl = card.querySelector('video');
                const idx = parseInt(card.dataset.idx);

                if (entry.isIntersecting && entry.intersectionRatio > 0.65) {
                    STATE.tiktokIndex = idx;
                    updateTikTokCounter();
                    if (videoEl) {
                        videoEl.muted = false;
                        videoEl.play().catch(() => {
                            videoEl.muted = true;
                            videoEl.play().catch(() => {});
                        });
                    }
                    if (idx >= TT.items.length - 3) {
                        preloadNextAlbum();
                    }
                } else if (videoEl) {
                    videoEl.pause();
                }
            });
        }, { root: feed, threshold: [0, 0.65, 0.9] });

        document.addEventListener('keydown', (e) => {
            if (!STATE.tiktokMode) return;
            if (e.key === 'Escape') closeTikTok();
            else if (e.key === 'ArrowDown' || e.key === 'j') { scrollTikTok(1); e.preventDefault(); }
            else if (e.key === 'ArrowUp' || e.key === 'k') { scrollTikTok(-1); e.preventDefault(); }
            else if (e.key === ' ') {
                const card = getCurrentCard();
                const video = card?.querySelector('video');
                if (video) {
                    if (video.paused) video.play(); else video.pause();
                    e.preventDefault();
                }
            }
            else if (e.key === 'd') {
                const item = getCurrentItem();
                if (item) downloadSingle(item.url, getFilename(item.url));
            }
            else if (e.key === 'l') {
                const card = getCurrentCard();
                card?.querySelector('.eu-tiktok-action[data-act="like"]')?.click();
            }
        });
    }

    function updateTikTokTabs() {
        document.querySelectorAll('.eu-tiktok-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.type === STATE.tiktokType);
        });
    }

    function getCurrentCard() {
        const feed = document.getElementById('eu-tiktok-feed');
        if (!feed) return null;
        const cards = feed.querySelectorAll('.eu-tiktok-item');
        return cards[STATE.tiktokIndex] || cards[0] || null;
    }

    function getCurrentItem() {
        return getCurrentCard()?._euData || null;
    }

    function scrollTikTok(direction) {
        const feed = document.getElementById('eu-tiktok-feed');
        if (!feed) return;
        const cards = feed.querySelectorAll('.eu-tiktok-item');
        const next = Math.max(0, Math.min(cards.length - 1, STATE.tiktokIndex + direction));
        cards[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function resetAndRenderFeed() {
        const feed = document.getElementById('eu-tiktok-feed');
        if (!feed) return;

        TT.items = [];
        TT.seenUrls = new Set();
        TT.albumQueue = [];
        TT.albumSeen = new Set();
        if (IS_ALBUM_PAGE) TT.albumSeen.add(location.href);
        STATE.tiktokIndex = 0;

        feed.innerHTML = '';

        const pageItems = collectCurrentPageItems(STATE.tiktokType);
        TT.items = pageItems;

        if (pageItems.length === 0) {
            feed.innerHTML = `<div class="eu-tiktok-empty">
                <div style="font-size:44px;margin-bottom:14px;">📭</div>
                <div style="font-weight:600;margin-bottom:4px;">No ${STATE.tiktokType} on this page</div>
                <div style="font-size:11px;opacity:.6;">Try another tab above, or open an album.</div>
            </div>`;
            const c = document.getElementById('eu-tiktok-counter');
            if (c) c.textContent = '0 / 0';
            return;
        }

        pageItems.forEach((item, idx) => appendTikTokCard(item, idx));
        updateTikTokCounter();
        feed.scrollTop = 0;

        buildNextAlbumQueue();

        if (IS_ALBUM_PAGE && TT.albumQueue.length > 0) {
            setTimeout(() => preloadNextAlbum(), 1500);
        }
    }

    function openTikTok(type) {
        buildTikTokOverlay();
        if (type) STATE.tiktokType = type;
        updateTikTokTabs();
        STATE.tiktokMode = true;
        document.getElementById('eu-tiktok').classList.add('open');
        document.body.style.overflow = 'hidden';
        resetAndRenderFeed();
        toast(`TikTok mode — swipe up/down, tap to pause, double-tap to like`, 'info', 3500);
    }

    function closeTikTok() {
        STATE.tiktokMode = false;
        const o = document.getElementById('eu-tiktok');
        if (o) {
            o.classList.remove('open');
            o.querySelectorAll('video').forEach(v => v.pause());
        }
        document.body.style.overflow = '';
    }

    /* ============================================================
     *  FLOATING ACTION BUTTON (FAB)
     * ============================================================ */
    function buildFAB() {
        if (document.querySelector('.eu-fab')) return;
        const fab = document.createElement('button');
        fab.className = 'eu-fab';
        fab.title = 'Bulk Download';
        fab.innerHTML = `${ICONS.download}<span class="eu-fab-badge" id="eu-fab-badge">0</span>`;
        fab.addEventListener('click', openBulkModal);
        document.body.appendChild(fab);

        if (IS_ALBUM_PAGE && !document.querySelector('.eu-fab-tiktok')) {
            const tt = document.createElement('button');
            tt.className = 'eu-fab eu-fab-tiktok';
            tt.title = 'TikTok-style Feed';
            tt.style.bottom = '92px';
            tt.style.background = 'linear-gradient(135deg, #ff0050 0%, #8a5acc 50%, #00f2ea 100%)';
            tt.innerHTML = `<img src="${LOGO_ICON}" alt="Erome" style="width:32px;height:32px;border-radius:50%;object-fit:cover;box-shadow:0 0 8px rgba(0,0,0,0.4);">`;
            tt.addEventListener('click', () => openTikTok(STATE.tiktokType));
            document.body.appendChild(tt);
        }
    }
    function updateFabBadge() {
        const badge = document.getElementById('eu-fab-badge');
        if (!badge) return;
        const n = collectAllMediaUrls().length;
        badge.textContent = n;
        badge.style.display = n > 0 ? 'flex' : 'none';
    }

    /* ============================================================
     *  HUB MENU (Twitter-style popup cards in navbar)
     * ============================================================ */
    const officialGenderIcons = {
        "all": 'fas fa-users',
        "straight": 'fas fa-venus-mars',
        "trans": 'fas fa-transgender-alt',
        "gay": 'fas fa-mars-double',
        "hentai": 'fas fa-mercury'
    };

    function buildHubMenu(id, iconKey, items, title = '') {
        if (document.getElementById(id)) return null;

        const hub = document.createElement('div');
        hub.id = id;
        hub.className = 'eu-hub';

        let headerIconHtml = '';
        if (id === 'eu-gender-hub') {
            headerIconHtml = ICONS.user;
        } else if (iconKey.startsWith('fa-') || iconKey.startsWith('fas ')) {
            headerIconHtml = `<i class="${iconKey}"></i>`;
        } else {
            headerIconHtml = ICONS[iconKey] || ICONS.settings;
        }

        hub.innerHTML = `
          <div class="eu-hub-btn" title="${title}">${headerIconHtml}</div>
          <ul class="eu-hub-menu"></ul>`;

        const menu = hub.querySelector('.eu-hub-menu');

        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'eu-hub-item';

            let itemIconHtml = '';
            // SOLUÇÃO: Se for o menu de gênero, força o SVG nativo em vez de FontAwesome
            if (id === 'eu-gender-hub') {
                itemIconHtml = ICONS.sort; // Usa o ícone de lista/sort como padrão
            } else if (item.icon.startsWith('fa-') || item.icon.startsWith('fas ')) {
                itemIconHtml = `<span style="width: 16px; display: inline-flex; justify-content: center; align-items: center;"><i class="${item.icon}" style="font-size: 14px !important; color: ${CONFIG.accentSoft} !important;"></i></span>`;
            } else {
                itemIconHtml = ICONS[item.icon] || ICONS.settings;
            }

            li.innerHTML = `${itemIconHtml}<span>${item.label}</span>`;

            li.addEventListener('click', (e) => {
                e.stopPropagation();
                item.action?.();
                hub.classList.remove('open');
            });
            menu.appendChild(li);
        });

        hub.querySelector('.eu-hub-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.eu-hub.open').forEach(h => { if (h !== hub) h.classList.remove('open'); });
            hub.classList.toggle('open');
        });

        return hub;
    }

    function installHubs() {
        if (document.getElementById('eu-new-navbar')) return;

        // 1. Esconde a navbar original do site
        const oldNavbar = document.querySelector('.navbar');
        if (oldNavbar) oldNavbar.style.display = 'none';

        // 2. Cria a nossa nova navbar do zero
        const newNav = document.createElement('nav');
        newNav.id = 'eu-new-navbar';
        newNav.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: ${CONFIG.dark};
            height: 60px;
            padding: 0 60px;
            width: 100%;
            position: sticky;
            top: 0;
            z-index: 1030;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            box-sizing: border-box;
        `;

        // 3. Lado Esquerdo: Logo + Botões (como irmãos, não um dentro do outro)
        const leftSide = document.createElement('div');
        leftSide.style.cssText = 'display: flex; align-items: center; gap: 20px; height: 100%;';

        // Link da Logo (separado)
        const logoLink = document.createElement('a');
        logoLink.href = 'https://www.erome.com/explore';
        logoLink.style.cssText = 'display: flex; align-items: center; height: 100%; text-decoration: none;';

        const logoImg = document.createElement('img');
        logoImg.src = '/img/logo-erome-horizontal.png?v=4';
        logoImg.style.cssText = `height: 30px; width: auto; filter: hue-rotate(295deg); transition: filter 0.5s;`;
        logoLink.appendChild(logoImg);
        leftSide.appendChild(logoLink); // Adiciona a logo primeiro

        // Container dos botões (Agora é um irmão da logo, não um filho)
        const hubsContainer = document.createElement('div');
        hubsContainer.id = 'eu-hubs-container';
        hubsContainer.style.cssText = 'display: flex; align-items: center; gap: 8px; height: 100%;';
        leftSide.appendChild(hubsContainer); // Adiciona os botões DEPOIS da logo

        // 4. Lado Direito: Mantém os botões originais (Search e Sign In)
        const rightSide = document.createElement('div');
        rightSide.style.cssText = 'display: flex; align-items: center; gap: 15px; height: 100%;';

        const oldRightMenu = document.querySelector('.navbar-nav.navbar-right');
        if (oldRightMenu) {
            const clonedRight = oldRightMenu.cloneNode(true);
            clonedRight.style.cssText = 'display: flex; align-items: center; gap: 10px; margin: 0; padding: 0; list-style: none; height: 100%;';

            clonedRight.querySelectorAll('a').forEach(a => {
                a.style.cssText = 'color: #fff; text-decoration: none; display: flex; align-items: center; height: 100%;';
            });

            const mobileSignIn = clonedRight.querySelector('a[href="/"]');
            if (mobileSignIn && mobileSignIn.parentElement) mobileSignIn.parentElement.remove();

            rightSide.appendChild(clonedRight);
        }

        // 5. Monta a nova barra na página
        newNav.appendChild(leftSide);
        newNav.appendChild(rightSide);
        document.body.insertBefore(newNav, document.body.firstChild);

        // ==========================================
        // Lógica de criação dos menus
        // ==========================================
        const genderIcons = {
            "all": 'fas fa-users',
            "straight": 'fas fa-venus-mars',
            "trans": 'fas fa-transgender-alt',
            "gay": 'fas fa-mars-double',
            "hentai": 'fas fa-mercury'
        };

        const genderItems = Object.keys(genderIcons).map(g => ({
            label: g.toUpperCase(),
            icon: genderIcons[g],
            action: () => {
                localStorage.setItem("generoSelecionado", g);
                window.location.href = `https://www.erome.com/version/${g}`;
            }
        }));

        const genderHub = buildHubMenu('eu-gender-hub', 'user', genderItems, 'Gender / Orientation');
        if (genderHub) hubsContainer.appendChild(genderHub);

        const privacyItems = [
            { label: 'Toggle NSFW Blur', icon: 'eye', action: toggleNSFW },
            { label: 'Toggle Hidden Filter', icon: 'clock', action: () => {
                const s = document.querySelector('.eu-hidden-slider');
                if (s) s.classList.toggle('visible');
                toast('Hidden filter ' + (s?.classList.contains('visible') ? 'on' : 'off'), 'info');
            } }
        ];
        const privacyHub = buildHubMenu('eu-privacy-hub', 'eye', privacyItems, 'Privacy');
        if (privacyHub) hubsContainer.appendChild(privacyHub);

        if (!IS_ALBUM_PAGE) {
            const viewItems = [
                { label: 'Sort by Views', icon: 'sort', action: () => sortAlbums('views') },
                { label: 'Sort by Video Count', icon: 'video', action: () => sortAlbums('videos') },
                { label: 'Sort by Photo Count', icon: 'photo', action: () => sortAlbums('photos') },
                { label: 'Toggle Sort Direction', icon: 'sort', action: () => {
                    STATE.sortAscending = !STATE.sortAscending;
                    sortAlbums(STATE.sortMode);
                } },
                { label: 'Video-Only Albums', icon: 'video', action: toggleVideoOnly }
            ];
            const viewHub = buildHubMenu('eu-view-hub', 'sort', viewItems, 'View & Sort');
            if (viewHub) hubsContainer.appendChild(viewHub);
        }

        if (IS_ALBUM_PAGE) {
            const albumItems = [
                { label: 'TikTok Mode — Videos', icon: 'video', action: () => openTikTok('videos') },
                { label: 'TikTok Mode — Photos', icon: 'photo', action: () => openTikTok('photos') },
                { label: 'TikTok Mode — All', icon: 'cinema', action: () => openTikTok('all') },
                { label: 'Bulk Download…', icon: 'download', action: openBulkModal },
                { label: 'Toggle Download Buttons', icon: 'upload', action: toggleDownloadButtons },
                { label: 'Toggle Photos', icon: 'photo', action: togglePhotos },
                { label: 'Toggle Videos', icon: 'video', action: toggleVideos },
                { label: 'Cinema Mode', icon: 'cinema', action: toggleCinema }
            ];
            const albumHub = buildHubMenu('eu-album-hub', 'settings', albumItems, 'Album Tools');
            if (albumHub) hubsContainer.appendChild(albumHub);
        }

        document.addEventListener('click', () => {
            document.querySelectorAll('.eu-hub.open').forEach(h => h.classList.remove('open'));
        });
    }
    /* ============================================================
     *  DISCLAIMER / ACCOUNT BYPASS
     * ============================================================ */
    function bypass() {
        const disc = document.getElementById('disclaimer');
        if (disc) {
            disc.remove();
            document.body.style.overflow = 'visible';
            try {
                if (typeof $ !== 'undefined') $.ajax({ type: 'POST', url: '/user/disclaimer', async: true });
                else fetch('/user/disclaimer', { method: 'POST' });
            } catch (e) {}
        }
        const needAcc = document.getElementById('needAccount');
        if (needAcc) needAcc.remove();
    }

    /* ============================================================
     *  INFINITE SCROLL (listing pages)
     * ============================================================ */
    function installInfiniteScroll() {
        if (IS_ALBUM_PAGE) return;
        if (!document.querySelector('.pagination')) return;
        if (typeof $ === 'undefined' || !$.fn.infiniteScroll) return;

        const url = new URL(window.location.href);
        let nextPage = parseInt(url.searchParams.get('page')) || 2;
        const limit = parseInt($('.pagination li:last-child').prev().text()) || 50;

        const nextPageUrl = () => {
            url.searchParams.set('page', nextPage);
            return url.href;
        };

        try {
            const infinite = $('#page').infiniteScroll({
                path: nextPageUrl,
                append: '.page-content',
                scrollThreshold: 800
            });
            $('#page').on('append.infiniteScroll', () => {
                nextPage++;
                if (nextPage > limit) infinite.infiniteScroll('destroy');
                refreshAll();
            });
        } catch (e) { console.warn('[EU] Infinite scroll not available:', e); }
    }

    /* ============================================================
     *  MAAD'S CUSTOM VISUAL ENHANCEMENTS
     * ============================================================ */
    function logoHueRotate() {
        const logo = document.querySelector('img[src*="logo-erome-horizontal.png"]');
        if (logo) {
            logo.style.filter = 'hue-rotate(295deg)';
            logo.style.transition = 'filter 0.5s ease';
        }
    }

    function ocultarSuggestedUsers() {
        const suggestedUsers = document.querySelector('.col-sm-12 h2 i.fas.fa-user')?.closest('.col-sm-12');
        if (suggestedUsers) {
            suggestedUsers.style.display = 'none';
        }
    }

    function applyCustomAvatars() {
        const defaultAvatarUrl = 'https://i.imgur.com/v1vw6WB.png';

        document.querySelectorAll('.default-avatar').forEach(avatar => {
            const pai = avatar.closest('.album-infos');
            if (pai) {
                const albumTitle = pai.querySelector('.album-title')?.outerHTML || '';
                const albumUser = pai.querySelector('.album-user')?.outerHTML || '';
                pai.innerHTML = `
                    <img src="${defaultAvatarUrl}" class="avatar initial loading" data-was-processed="true" alt="Avatar padrão">
                    <div>
                        ${albumTitle}
                        ${albumUser}
                    </div>`;
            }
        });

        document.querySelectorAll('.col-sm-5.user-info.username.mb-5').forEach(userInfo => {
            const avatarSpan = userInfo.querySelector('.default-avatar');
            if (avatarSpan) {
                const userLink = userInfo.querySelector('#user_icon')?.href || '#';
                const userIconNode = userInfo.querySelector('#user_icon');
                if (userIconNode) {
                    userIconNode.innerHTML = `
                        <a href="${userLink}" id="user_icon">
                            <img src="${defaultAvatarUrl}" class="avatar initial loading" alt="Default avatar" width="36" height="36" data-was-processed="true">
                        </a>`;
                }
            }
        });

        document.querySelectorAll('.col-xs-12.text-center.relative').forEach(container => {
            const avatarSpan = container.querySelector('.default-avatar');
            if (avatarSpan) {
                container.innerHTML = `
                    <img src="${defaultAvatarUrl}" class="avatar initial loading" alt="Default avatar" width="100" height="100" data-was-processed="true">`;
            }
        });
    }

    function updateFavicon() {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = 'https://www.erome.com/favicon.ico';
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.filter = 'hue-rotate(290deg)';
            ctx.drawImage(img, 0, 0);
            link.href = canvas.toDataURL();
        };
    }

    function ChangeTitleAndElements() {
        const h1Element = document.querySelector('.col-sm-12.page-content h1');
        const originalTitle = document.title.replace(" - Porn Videos & Photos - EroMe", "");
        const userNameElement = document.getElementById("user_name") || document.querySelector(".username");
        const originalUserName = userNameElement
            ? userNameElement.textContent.replace(/\u00A0/g, "").trim()
            : "By Maad";

        const texts = ["By Maad", originalTitle];
        const userNameTexts = ["By Maad", originalUserName];
        let index = 0;

        setInterval(() => {
            document.title = texts[index];
            if (h1Element) {
                h1Element.textContent = texts[index];
            }

            if (userNameElement) {
                userNameElement.innerHTML = `${userNameTexts[index]} <i class='fas fa-check-circle user-verified' title='Verified'></i>`;
            }

            index = (index + 1) % texts.length;
        }, 2500);
    }

    function removerElementos() {
        const elementosParaRemover = document.querySelectorAll('.sp, .sp-mob.hidden-sm.hidden-md.hidden-lg, .bubble-mobile');
        elementosParaRemover.forEach(el => el.remove());
        const bubbleLink = document.getElementById('bubble');
        if (bubbleLink) {
            bubbleLink.remove();
        }
    }

    /* ============================================================
     *  PERIODIC REFRESH — runs all decorators
     * ============================================================ */
    function refreshAll() {
        installHubs();
        logoHueRotate();
        ocultarSuggestedUsers();
        applyCustomAvatars();
        removerElementos();

        attachDownloadButtons();
        decorateAlbumCounts();
        decorateVideoDurations();
        applyNSFW();
        applyVideoOnly();
        applyHiddenFilter();
        removerContadoresAlbum();
        updateFabBadge();
        enhancePlayers();
    }

    /* ============================================================
     *  INITIALIZATION
     * ============================================================ */
    function init() {
        console.log(`[${CONFIG.brand}] v${CONFIG.version} initializing…`);

        bypass();
        updateFavicon();
        ChangeTitleAndElements();
        installHubs();
        buildFAB();
        createHiddenSlider();
        refreshAll();
        loadAlbumLikes();
        installInfiniteScroll();

        setInterval(refreshAll, 2000);

        const mo = new MutationObserver(() => {
            clearTimeout(window._euDebounce);
            window._euDebounce = setTimeout(refreshAll, 300);
        });
        mo.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            const n = collectAllMediaUrls().length;
            toast(`${CONFIG.brand} ready — ${n} media items detected`, 'success', 3500);
        }, 1200);

        console.log(`[${CONFIG.brand}] ready`);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('load', () => { setTimeout(refreshAll, 1000); });

    window.eromeUltimate = {
        state: STATE,
        config: CONFIG,
        collectAllMediaUrls,
        openBulkModal,
        toast,
        refreshAll
    };
})();
