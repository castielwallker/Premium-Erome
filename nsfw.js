// ==UserScript==
// @name         Erome NSFW Premium
// @namespace    https://github.com/castielwallker/
// @version      1.1
// @description  Aplica efeito de desfoque nas imagens de álbuns NSFW
// @author       Maad
// @match        https://www.erome.com/explore*
// @match        https://www.erome.com/*
// @match        https://www.erome.com/search?q=*
// ==/UserScript==

(function () {
    'use strict';
    // Adicionando estilo para o desfoque
    const style = document.createElement('style');
    style.textContent = `
        .blur {
            filter: blur(15px) !important; 
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
