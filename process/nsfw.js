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

    let toastTimeout;
    let isToastVisible = false;

    function showToast(message, isError = false) {
    const existingToasts = document.querySelectorAll('.toast');

    const toast = document.createElement('div');
    toast.className = 'toast';
	    
    const svgIcon = `
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.1892 14.0608L19.0592 12.1808C18.8092 11.7708 18.5892 10.9808 18.5892 10.5008V8.63078C18.5892 5.00078 15.6392 2.05078 12.0192 2.05078C8.38923 2.06078 5.43923 5.00078 5.43923 8.63078V10.4908C5.43923 10.9708 5.21923 11.7608 4.97923 12.1708L3.84923 14.0508C3.41923 14.7808 3.31923 15.6108 3.58923 16.3308C3.85923 17.0608 4.46923 17.6408 5.26923 17.9008C6.34923 18.2608 7.43923 18.5208 8.54923 18.7108C8.65923 18.7308 8.76923 18.7408 8.87923 18.7608C9.01923 18.7808 9.16923 18.8008 9.31923 18.8208C9.57923 18.8608 9.83923 18.8908 10.1092 18.9108C10.7392 18.9708 11.3792 19.0008 12.0192 19.0008C12.6492 19.0008 13.2792 18.9708 13.8992 18.9108C14.1292 18.8908 14.3592 18.8708 14.5792 18.8408C14.7592 18.8208 14.9392 18.8008 15.1192 18.7708C15.2292 18.7608 15.3392 18.7408 15.4492 18.7208C16.5692 18.5408 17.6792 18.2608 18.7592 17.9008C19.5292 17.6408 20.1192 17.0608 20.3992 16.3208C20.6792 15.5708 20.5992 14.7508 20.1892 14.0608ZM12.7492 10.0008C12.7492 10.4208 12.4092 10.7608 11.9892 10.7608C11.5692 10.7608 11.2292 10.4208 11.2292 10.0008V6.90078C11.2292 6.48078 11.5692 6.14078 11.9892 6.14078C12.4092 6.14078 12.7492 6.48078 12.7492 6.90078V10.0008Z" fill="#8a5acc"></path>
        <path d="M14.8297 20.01C14.4097 21.17 13.2997 22 11.9997 22C11.2097 22 10.4297 21.68 9.87969 21.11C9.55969 20.81 9.31969 20.41 9.17969 20C9.30969 20.02 9.43969 20.03 9.57969 20.05C9.80969 20.08 10.0497 20.11 10.2897 20.13C10.8597 20.18 11.4397 20.21 12.0197 20.21C12.5897 20.21 13.1597 20.18 13.7197 20.13C13.9297 20.11 14.1397 20.1 14.3397 20.07C14.4997 20.05 14.6597 20.03 14.8297 20.01Z" fill="#8a5acc"></path>
      </svg>
    `;

    toast.innerHTML = `${svgIcon} <span>${message}</span>`;
    toast.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        position: fixed;
        bottom: ${existingToasts.length > 0 ? (existingToasts.length * 60 + 20) + 'px' : '20px'};
        right: 20px;
        background-color: ${isError ? '#1d1e2ad9' : '#14151fd9'};
        color: ${isError ? '#FFF' : '#b39ad6'};
        padding: 15px 20px;
        border-radius: 12px;
        font-size: 14px;
        font-family: Arial, sans-serif;
        z-index: 9999;
        box-shadow: 0 0 15px ${isError ? '#8a5accd9' : '#b39ad6d9'}, 0 0 25px ${isError ? '#b39ad6d9' : '#8a5accd9'};
        transition: opacity 0.5s ease-in-out;
        opacity: 0.9;
        animation: ToastAnim 2s ease 0s 1 normal forwards;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => toast.remove(), 800);
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

                const isBlurred = !albumContainers[0]?.classList.contains('blur');

                albumContainers.forEach(albumContainer => {
                    albumContainer.classList.toggle('blur', isBlurred);
                });

                if (isBlurred) {
                    localStorage.setItem('nsfw', 'true');
                    if (!window.location.href.includes('=nsfw')) {
                        window.history.replaceState(null, '', window.location.href + '=nsfw');
                    }
                    showToast('O blur foi ativado. Foi detectado ambiente adulto.');
                } else {
                    localStorage.removeItem('nsfw');
                    const newUrl = window.location.href.replace('=nsfw', '');
                    window.history.replaceState(null, '', newUrl);
                    showToast('O blur foi desativado.');
                }
            });

            navbarRight.appendChild(nsfwButton);
        }

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
