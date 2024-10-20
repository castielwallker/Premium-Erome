// ==UserScript==
// @name         Erome NSFW Premium
// @namespace    https://github.com/castielwallker/
// @version      1.2
// @description  Aplica efeito de desfoque nas imagens de álbuns NSFW
// @author       Maad
// @match        https://www.erome.com/explore*
// @match        https://www.erome.com/*
// @match        https://www.erome.com/search?q=*
// ==/UserScript==

(function () {
    'use strict';

    // Adiciona estilo para o efeito de blur e o pseudo-elemento
    const style = document.createElement('style');
    style.textContent = `
        .blur::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: inherit;
            filter: blur(15px);
            z-index: 1;
        }
        .vjs-poster {
            position: relative;
            overflow: hidden; /* Garante que o pseudo-elemento não vaze */
        }
    `;
    document.head.appendChild(style);

    // Função para adicionar o botão NSFW na barra de navegação
    const addButtonToNavbar = function () {
        const navbarRight = document.querySelector('.navbar-nav.navbar-right');
        if (!document.getElementById('nsfw-toggle-btn')) {
            const nsfwButton = document.createElement('li');
            nsfwButton.innerHTML = '<a href="#" id="nsfw-toggle-btn">NSFW</a>';
            nsfwButton.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                // Seleciona os elementos que precisam de blur
                const albumContainers = document.querySelectorAll(
                    '.album-thumbnail-container, .media-group img, .media-group video, .vjs-poster'
                );
                const isBlurred = albumContainers[0]?.classList.contains('blur');
                albumContainers.forEach(albumContainer => {
                    if (isBlurred) {
                        albumContainer.classList.remove('blur');
                    } else {
                        albumContainer.classList.add('blur');
                    }
                });
            });
            navbarRight.appendChild(nsfwButton);
        }
    };

    // Adiciona o botão assim que o conteúdo estiver carregado
    document.addEventListener('DOMContentLoaded', addButtonToNavbar);
})();
