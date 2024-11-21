// ==UserScript==
// @name         Erome NSFW Premium
// @namespace    https://github.com/castielwallker/
// @version      1.4
// @description  Aplica efeito de desfoque nas imagens de álbuns NSFW com controle adequado de mensagens Toast e URL dinâmica.
// @author       Maad
// @match        https://www.erome.com/*
// @match        https://*.erome.com/*
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
            filter: grayscale(100%) blur(10px) invert(100%) hue-rotate(90deg) contrast(170%);
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

    // Variável global para armazenar referência ao Toast
    let toastTimeout;
    let isToastVisible = false;

    function showToast(message, isError = false) {
        if (isToastVisible) return;  // Impedir exibição de múltiplas toasts simultâneas

        isToastVisible = true;  // Marcar Toast como visível

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        if (isError) {
            toast.style.backgroundColor = '#101010';
            toast.style.color = '#ffffff';
        }

        document.body.appendChild(toast);

        toastTimeout = setTimeout(() => {
            toast.style.opacity = 0;
            setTimeout(() => {
                toast.remove();
                isToastVisible = false;  // Marcar Toast como não visível
            }, 500);
        }, 2000);
    }

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

                // Verificar se o blur está ativado ou desativado
                const isBlurred = !albumContainers[0]?.classList.contains('blur');

                albumContainers.forEach(albumContainer => {
                    albumContainer.classList.toggle('blur', isBlurred);
                });

                // Alterar o estado no localStorage
                if (isBlurred) {
                    localStorage.setItem('nsfw', 'true');
                    // Modificar a URL adicionando o prefixo =nsfw
                    if (!window.location.href.includes('=nsfw')) {
                        window.history.replaceState(null, '', window.location.href + '=nsfw');
                    }
                    showToast('O blur foi ativado. Foi detectado ambiente adulto.');
                } else {
                    localStorage.removeItem('nsfw');
                    // Remover o prefixo =nsfw da URL
                    const newUrl = window.location.href.replace('=nsfw', '');
                    window.history.replaceState(null, '', newUrl);
                    showToast('O blur foi desativado.');
                }
            });

            navbarRight.appendChild(nsfwButton);
        }

        // Verificar o estado inicial do blur
        if (localStorage.getItem('nsfw') === 'true') {
            const albumContainers = document.querySelectorAll(
                '.album-thumbnail-container, .media-group img, .media-group video, .vjs-poster'
            );
            albumContainers.forEach(albumContainer => {
                albumContainer.classList.add('blur');
            });
            showToast('O blur foi ativado anteriormente. Foi detectado ambiente adulto.');
        }
    };

    setTimeout(() => {
        addButtonToNavbar();
     }, 1500);
    
})();
