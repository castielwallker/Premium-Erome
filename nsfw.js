// ==UserScript==
// @name         Erome NSFW Premium
// @namespace    http://tampermonkey.net/
// @version      2024-10-19
// @description  Aplica efeito de desfoque nas imagens de álbuns NSFW
// @author       Você
// @match        https://www.erome.com/explore*
// @match        https://www.erome.com/*
// @match        https://www.erome.com/search?q=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Adiciona estilo CSS para o efeito de desfoque
    const style = document.createElement('style');
    style.textContent = `
        .blur {
            filter: blur(15px); /* Aplica o efeito de desfoque */
        }
    `;
    document.head.appendChild(style);

    const addButtonToNavbar = function () {
        const navbarRight = document.querySelector('.navbar-nav.navbar-right');

        // Verifica se o botão já existe para não duplicar
        if (!document.getElementById('nsfw-toggle-btn')) {
            // Botão NSFW
            const nsfwButton = document.createElement('li');
            nsfwButton.innerHTML = '<a href="#" id="nsfw-toggle-btn">NSFW</a>';
            nsfwButton.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                const albumContainers = document.querySelectorAll('.album-thumbnail-container'); // Obtém todos os contêineres de miniaturas
                const isBlurred = albumContainers[0].classList.toggle('blur'); // Verifica o estado de desfoque

                albumContainers.forEach(albumContainer => {
                    if (isBlurred) {
                        albumContainer.classList.add('blur'); // Aplica o efeito de desfoque
                    } else {
                        albumContainer.classList.remove('blur'); // Remove o efeito de desfoque
                    }
                });
            });
            navbarRight.appendChild(nsfwButton);
        }
    };

    // Chama a função apenas se a URL for correspondente
    if (window.location.href.match(/https:\/\/www\.erome\.com\/(explore.*|search\?q=.*|$)/)) {
        addButtonToNavbar();
    }
})();

