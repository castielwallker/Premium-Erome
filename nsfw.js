// ==UserScript==
// @name         Erome NSFW Premium
// @namespace    https://github.com/castielwallker/
// @version      1.0
// @description  Aplica efeito de desfoque nas imagens de álbuns NSFW
// @author       Maad
// @match        https://www.erome.com/explore*
// @match        https://www.erome.com/*
// @match        https://www.erome.com/search?q=*
// ==/UserScript==

(function () {
    'use strict';
    const style = document.createElement('style');
    style.textContent = `
        .blur {
            filter: blur(15px);
        }
    `;
    document.head.appendChild(style);

        const addButtonToNavbar = function () {
        const navbarRight = document.querySelector('.navbar-nav.navbar-right');
        if (!document.getElementById('nsfw-toggle-btn')) {
            // Botão NSFW
            const nsfwButton = document.createElement('li');
            nsfwButton.innerHTML = '<a href="#" id="nsfw-toggle-btn">NSFW</a>';
            nsfwButton.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                  const albumContainers = document.querySelectorAll(
                      '.album-thumbnail-container, .media-group img, .media-group video, .vjs-poster');
                const isBlurred = albumContainers[0].classList.toggle('blur');
                albumContainers.forEach(albumContainer => {
                    if (isBlurred) {
                        albumContainer.classList.add('blur');
                    } else {
                        albumContainer.classList.remove('blur');
                    }
                });
            });
            navbarRight.appendChild(nsfwButton);
        }
    };
 addButtonToNavbar();
})();
