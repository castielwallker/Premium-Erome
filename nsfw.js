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

            const isBlurred = albumContainers[0]?.classList.toggle('blur');
            albumContainers.forEach(albumContainer => {
                albumContainer.classList.toggle('blur', isBlurred);
            });

            // Alterar o ícone e o texto baseado no estado do blur
            const toggleIcon = nsfwButton.querySelector('i');
            if (isBlurred) {
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
                nsfwButton.querySelector('a').textContent = ' NSFW'; // Atualiza texto para NSFW
            } else {
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
                nsfwButton.querySelector('a').textContent = ' NSFW'; // Atualiza texto para NSFW
            }

            const message = isBlurred
                ? 'O blur foi ativado. Foi detectado ambiente adulto.'
                : 'O blur foi desativado.';
            showToast(message);
        });

        navbarRight.appendChild(nsfwButton);
    }
};

addButtonToNavbar();

})();
