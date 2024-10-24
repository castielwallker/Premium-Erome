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
    `;
    document.head.appendChild(style);
    
  // Toast Mensagem
        function showToast(message, isError = false) {
        const existingToasts = document.querySelectorAll('.toast');
    
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: ${existingToasts.length > 0 ? (existingToasts.length * 60 + 20) + 'px' : '20px'};
            right: 20px;
            background-color: ${isError ? '#101010' : '#ffffff'};
            color: ${isError ? '#ffffff' : '#101010'};
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 0 10px ${isError ? '#101010' : '#ffffff'}, 0 0 20px ${isError ? '#ffffff' : '#101010'};
            transition: opacity 0.5s;
            opacity: 1;
        `;
    
        document.body.appendChild(toast);
    
        setTimeout(() => {
            toast.style.opacity = 0;
            setTimeout(() => toast.remove(), 100);
        }, 500);
    }

        const addButtonToNavbar = function () {
        const navbarRight = document.querySelector('.navbar-nav.navbar-right');
        if (!document.getElementById('nsfw-toggle-btn')) {
            // Botão NSFW
            const nsfwButton = document.createElement('li');
            //nsfwButton.innerHTML = '<a href="#" id="nsfw-toggle-btn">NSFW</a>';
            nsfwButton.innerHTML = `<i class="fa fa-sort fa-lg"></i> NSFW `; 
            nsfwButton.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                  const albumContainers = document.querySelectorAll(
                      '.album-thumbnail-container, .media-group img, .media-group video, .vjs-poster');
                const isBlurred = albumContainers[0].classList.toggle('blur');
                albumContainers.forEach(albumContainer => {
                    if (isBlurred) {
                        albumContainer.classList.add('blur');
                        showToast('O blur foi ativado,Foi detectado ambiente adulto.');
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
