// ==UserScript==
// @name         Erome Premium Hub
// @namespace    https://www.erome.com/
// @version      1.0.0
// @description  Hub unificado com Gênero, Privacidade e Configurações.
// @author       Maad
// @match        https://*.erome.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #nsfw-toggle-btn,
        .navbar-right li:has(a[style*="margin-left: -20px"]),
        .navbar-right li:has(i.fa-eye),
        .navbar-right li:has(i.fa-search) + li:has(a[href="/"]) {
            display: none !important;
        }
        .hub-container { vertical-align: middle; }
    `);

    const hubState = {
        showPhotos: true,
        showVideos: true,
        showDownloadBtn: true,
        cinemaMode: false,
        nsfwBlur: false,
        hiddenActive: false
    };

    const officialGenderIcons = {
        "all": 'fas-fa-mars-and-venus-burst',
        "straight": 'fas-fa-venus-mars',
        "trans": 'fas-fa-transgender',
        "gay": 'fas-fa-mars-double',
        "hentai": 'fas-fa-mercury'
    };

    const customSvgs = {
        settings: '<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>',
        privacy: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>',
        download: '<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>',
        hide_dl: '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.39 2.59-3.26 3.1-5.34-1.71-4.38-5.98-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1.14 12c1.71 4.38 5.98 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>',
        photo: '<path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>',
        video: '<path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>',
        cinema: '<path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>',
        eye: '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>'
    };

    function getIconHtml(iconId, size = 18) {
        if (officialGenderIcons[iconId] || iconId.startsWith('fas-')) {
            const id = officialGenderIcons[iconId] || iconId;
            return `<svg class="svg-fa" style="width: ${size}px; height: ${size}px; fill: #FFFFFF; color: #FFFFFF; display: inline-block; vertical-align: middle;">
                        <use xlink:href="#${id}"></use>
                    </svg>`;
        }
        return `<svg viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; fill: #FFFFFF; display: inline-block; vertical-align: middle;">${customSvgs[iconId]}</svg>`;
    }

    function limparInterface() {
        if (window.location.pathname.includes('/a/')) {
            const userArea = document.querySelector('.col-sm-5.user-info.username.mb-5');
            if (userArea) userArea.querySelectorAll('.btn-pink, .btn-grey, button').forEach(b => b.style.display = 'none');
            document.querySelectorAll('.media-group img').forEach(el => el.style.display = hubState.showPhotos ? 'block' : 'none');
            document.querySelectorAll('.media-group video, .video-js').forEach(el => el.style.display = hubState.showVideos ? 'block' : 'none');
        }
    }

    function criarMenuBase(id, mainIcon, items) {
        if (document.getElementById(id)) return;
        let container = document.createElement("div");
        container.id = id;
        container.className = "hub-container";
        container.style.cssText = "position: relative; display: inline-block; margin-left: 10px; cursor: pointer;";

        let btn = document.createElement("div");
        btn.innerHTML = getIconHtml(mainIcon, 20);
        btn.style.cssText = "display: flex; align-items: center; padding: 9px; background: #1d1e2a; border-radius: 10px; margin-top: -10px; color: #b39ad6; transition: 0.3s;";

        let dropdown = document.createElement("ul");
        dropdown.style.cssText = "position: absolute; top: 45px; left: 0; background: #14151f; border-radius: 5px; box-shadow: 0px 0px 15px rgba(0,0,0,0.7); padding: 10px; list-style: none; display: none; min-width: 160px; z-index: 10000; border: 1px solid rgba(255,255,255,0.05);";

        items.forEach(item => {
            let li = document.createElement("li");
            li.innerHTML = `<span style="margin-right:10px">${getIconHtml(item.i)}</span> ${item.t}`;
            li.style.cssText = "display: flex; align-items: center; padding: 8px 12px; cursor: pointer; color: #fff; transition: 0.2s; font-size: 11px; font-weight: bold; white-space: nowrap;";

            li.onclick = (e) => {
                e.stopPropagation();
                if (item.key) {
                    hubState[item.key] = !hubState[item.key];
                    li.style.color = hubState[item.key] ? "#fff" : "#8a5acc";
                }
                if (item.fn) item.fn();
                limparInterface();
            };

            li.onmouseover = () => {
                li.style.transform = "scale(1.05)";
                li.style.textShadow = "0px 0px 8px #8a5acc";
                dropdown.childNodes.forEach(child => { if(child !== li) child.style.opacity = "0.5"; });
            };
            li.onmouseout = () => {
                li.style.transform = "scale(1)";
                li.style.textShadow = "none";
                dropdown.childNodes.forEach(child => child.style.opacity = "1");
            };
            dropdown.appendChild(li);
        });

        btn.onclick = (e) => {
            e.stopPropagation();
            const isVisible = dropdown.style.display === "block";
            document.querySelectorAll(".hub-container ul").forEach(u => u.style.display = "none");
            dropdown.style.display = isVisible ? "none" : "block";
        };

        container.appendChild(btn);
        container.appendChild(dropdown);
        let timer;
        container.onmouseleave = () => timer = setTimeout(() => dropdown.style.display = "none", 600);
        container.onmouseenter = () => clearTimeout(timer);
        return container;
    }

    function montarMenus() {
        const navToggle = document.querySelector(".navbar-toggle");
        if (!navToggle) return;
        const target = navToggle.parentNode;
        const ref = navToggle.nextSibling;

        const generoSalvo = localStorage.getItem("generoSelecionado") || "all";
        const genderItems = Object.keys(officialGenderIcons).map(g => ({
            t: g.toUpperCase(),
            i: officialGenderIcons[g],
            fn: () => {
                localStorage.setItem("generoSelecionado", g);
                window.location.href = `https://www.erome.com/version/${g}`;
            }
        }));
        const hubGender = criarMenuBase("gender-hub", officialGenderIcons[generoSalvo], genderItems);
        target.insertBefore(hubGender, ref);

        const privacyItems = [
            { t: "NSFW BLUR", i: "eye", fn: () => { document.getElementById('nsfw-toggle-btn')?.click(); hubState.nsfwBlur = !hubState.nsfwBlur; }, key: "nsfwBlur" },
            { t: "MODO HIDDEN", i: "eye", fn: () => {
                const hiddenBtn = Array.from(document.querySelectorAll('a')).find(el => el.textContent.includes('HIDDEN'));
                if (hiddenBtn) hiddenBtn.click();
            }, key: "hiddenActive" }
        ];
        const hubPrivacy = criarMenuBase("privacy-hub", "privacy", privacyItems);
        target.insertBefore(hubPrivacy, hubGender.nextSibling);

        if (window.location.pathname.includes('/a/')) {
            const configItems = [
                { t: "DOWNLOADER", i: "download", fn: () => document.querySelector('.btn-grey i.fa-download, .btn-download')?.parentElement.click() },
                { t: "OCULTAR FOTOS", i: "photo", key: "showPhotos" },
                { t: "OCULTAR VÍDEOS", i: "video", key: "showVideos" },
                { t: "MODO CINEMA", i: "cinema", fn: () => {
                    hubState.cinemaMode = !hubState.cinemaMode;
                    document.body.style.background = hubState.cinemaMode ? "#000" : "";
                    document.querySelectorAll(".navbar, .sidebar, footer, .user-info").forEach(el => el.style.display = hubState.cinemaMode ? "none" : "");
                }}
            ];
            const hubConfig = criarMenuBase("combo-hub", "settings", configItems);
            target.insertBefore(hubConfig, hubPrivacy.nextSibling);
        }
    }

    window.addEventListener("load", () => {
        montarMenus();
        setInterval(limparInterface, 1000);
        document.addEventListener("click", () => document.querySelectorAll(".hub-container ul").forEach(u => u.style.display = "none"));
    });

})();
