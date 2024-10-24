// ==UserScript==
// @name         Erome NSFW Premium
// @namespace    https://github.com/castielwallker/
// @version      1.0
// @description  Aplica efeito de desfoque nas imagens de álbuns NSFW
// @author       Maad
// @match        https://www.erome.com/*
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .blur {
            filter: blur(15px);
        }
        .fa-eye {
            margin-right: 5px;
        }
        .toast {
            position: fixed;
            right: 20px;
            background-color: #ffffff;
            color: #101010;
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 0 10px #ffffff, 0 0 20px #101010;
            transition: opacity 0.5s;
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // Função para mostrar uma mensagem (Toast)
    function showToast(message, isError = false) {
        const existingToasts = document.querySelectorAll('.toast');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.bottom = `${existingToasts.length * 60 + 20}px`;

        if (isError) {
            toast.style.backgroundColor = '#101010';
            toast.style.color = '#ffffff';
        }

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = 0;
            setTimeout(() => toast.remove(), 100);
        }, 2000);
    }

    // Função para adicionar o botão NSFW à navbar
    const addButtonToNavbar = function () {
        const navbarRight = document.querySelector('.navbar-nav.navbar-right');
        if (!document.getElementById('nsfw-toggle-btn')) {
            const nsfwButton = document.createElement('li');
            nsfwButton.innerHTML = `
                <a href="#" id="nsfw-toggle-btn">
                    <i class="fa fa-eye"></i> NSFW
                </a>
            `;
            nsfwButton.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                const albumContainers = document.querySelectorAll(
                    '.album-thumbnail-container, .media-group img, .media-group video, .vjs-poster'
                );
                const isBlurred = albumContainers[0]?.classList.toggle('blur');
                albumContainers.forEach(albumContainer => {
                    if (isBlurred) {
                        albumContainer.classList.add('blur');
                        showToast('O blur foi ativado. Foi detectado ambiente adulto.');
                    } else {
                        albumContainer.classList.remove('blur');
                        showToast('O blur foi desativado.');
                    }
                });
            });
            navbarRight.appendChild(nsfwButton);
        }
    };

    addButtonToNavbar();
})();
