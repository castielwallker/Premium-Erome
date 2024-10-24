// ==UserScript==
// @name         Erome NSFW Premium
// @namespace    https://github.com/castielwallker/
// @version      1.3
// @description  Aplica efeito de desfoque nas imagens de álbuns NSFW com controle adequado de mensagens Toast.
// @author       Maad
// @match        https://www.erome.com/*
// ==/UserScript==

(function () {
    'use strict';

    // Carregar Font Awesome dinamicamente
    const fontAwesome = document.createElement('link');
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    fontAwesome.rel = 'stylesheet';
    document.head.appendChild(fontAwesome);

    const style = document.createElement('style');
    style.textContent = 
        .blur {
            filter: blur(15px);
        }
        .fa-eye {
            margin-right: 8px;
        }
    ;
    document.head.appendChild(style);

    const addButtonToNavbar = function () {
        const navbarRight = document.querySelector('.navbar-nav.navbar-right');
        if (!document.getElementById('nsfw-toggle-btn')) {
            const nsfwButton = document.createElement('li');
            nsfwButton.innerHTML = 
                <a href="#" id="nsfw-toggle-btn" style="display: flex; align-items: center;">
                    <i class="fas fa-eye"></i> NSFW
                </a>
            ;
            nsfwButton.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();

                const albumContainers = document.querySelectorAll(
                    '.album-thumbnail-container, .media-group img, .media-group video, .vjs-poster'
                );

                const isBlurred = albumContainers[0]?.classList.toggle('blur');
                albumContainers.forEach(albumContainer => {
                    albumContainer.classList.toggle('blur', isBlurred);
                });

            navbarRight.appendChild(nsfwButton);
        }
    };

    addButtonToNavbar();
})();
