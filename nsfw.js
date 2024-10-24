// ==UserScript==
// @name         Erome NSFW Premium
// @namespace    https://github.com/castielwallker/
// @version      1.2
// @description  Aplica efeito de desfoque nas imagens de álbuns NSFW
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
    style.textContent = `
        .blur {
            filter: blur(15px);
        }
        .fa-eye {
            margin-right: 8px;
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

    // Função para mostrar mensagem (Toast) com controle para evitar múltiplas exibições
    let toastTimeout; // Armazena o timeout para evitar múltiplas toasts

    function showToast(message, isError = false) {
        // Remover qualquer toast existente antes de criar uma nova
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        if (isError) {
            toast.style.backgroundColor = '#101010';
            toast.style.color = '#ffffff';
        }

        document.body.appendChild(toast);

        // Limpar o timeout anterior se houver
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
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
                <a href="#" id="nsfw-toggle-btn" style="display: flex; align-items: center;">
                    <i class="fas fa-eye"></i> NSFW
                </a>
            `;
            nsfwButton.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                const albumContainers = document.querySelectorAll(
                    '.album-thumbnail-container, .media-group img, .media-group video, .vjs-poster'
                );

                const isBlurred = albumContainers[0]?.classList.toggle('blur');
                albumContainers.forEach(albumContainer => {
                    albumContainer.classList.toggle('blur', isBlurred);
                });

                const message = isBlurred
                    ? 'O blur foi ativado. Foi detectado ambiente adulto.'
                    : 'O blur foi desativado.';
                showToast(message);
            });
            navbarRight.appendChild(nsfwButton);
        }
    };

    // Adicionar o botão ao carregar a página
    addButtonToNavbar();
})();
