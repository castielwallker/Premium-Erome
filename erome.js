// ==UserScript==
// @name         Erome Premium - By Maad
// @author       Maad
// @version      2.0
// @namespace    https://github.com/maadvfx/
// @description  Premium Addons For Erome.
// @match        https://www.erome.com/*
// @icon         https://www.erome.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
//
// @require      https://github.com/castielwallker/Premium-Erome/raw/refs/heads/main/player.js
// @require      https://github.com/castielwallker/Premium-Erome/raw/refs/heads/main/nsfw.js
// @require      https://github.com/castielwallker/Premium-Erome/raw/refs/heads/main/download.js
// @require      https://github.com/castielwallker/Premium-Erome/raw/refs/heads/main/hidden.js
// @require      https://github.com/castielwallker/Premium-Erome/raw/refs/heads/main/theme.js
//
// @updateURL    https://github.com/castielwallker/Premium-Erome/raw/refs/heads/main/erome.js
// @downloadURL  https://github.com/castielwallker/Premium-Erome/raw/refs/heads/main/erome.js
// ==/UserScript==
// ================================================================================================================================================================
//                                          PLEASE READ SCRIPT INFO BEFORE USE
//                                      PLEASE RESPECT IF MY SCRIPTS USEFUL FOR YOU
//                      DON'T TRY TO COPY PASTE MY SCRIPTS THEN SHARE TO OTHERS LIKE YOU ARE THE CREATOR
//                                  M A A D          M A A D        M A A D       M A A D
//                                  M A A D          M A A D        M A A D       M A A D
//                                  M A A D          M A A D        M A A D       M A A D
//                                  M A A D          M A A D        M A A D       M A A D
//                                  M A A D          M A A D        M A A D       M A A D
//                                  M A A D          M A A D        M A A D       M A A D
//                                  M A A D          M A A D        M A A D       M A A D
//                                          PLEASE DO NOT REMOVE CREATOR CREDITS
//                                          PLEASE DO NOT REMOVE CREATOR CREDITS
//                                          PLEASE DO NOT REMOVE CREATOR CREDITS
//                                          PLEASE DO NOT REMOVE CREATOR CREDITS
// =================================================================================================================================================================
// NOTES
// To perform the complete download, it is advisable to load the entire page (scroll to the end of the page) and then the download will load completely.
// Some downloads will probably be blocked due to CORS. Just reload the page or clear the site's cookies.
// To use the hidden video, you need to click on the button to display another button that will be in the bottom corner of the screen and select the seconds to hide the video, the value that was selected will hide if the video is shorter.
// nsfw system puts a blur on all albums, images and videos. function is not saved after loading the page it will return to the default.
// Any error or detail, tip or feedback, contact us via telegram or instagram.
// Please do not remove creator credits.
//
// Instagram : https://t.me/maadvfx
// Telegram : @maad.vfx
// GitHub : https://github.com/castielwallker
//
//
/* globals $ Maad */


(function () {
    'use strict';

    // CSS PLAYER
    GM_addStyle(`
   .media-group .img-back {
        width: 100%;
        height: auto;
        filter: brightness(40%) blur(10px);
        border-radius: 15px;
        opacity: 1;
    }
    
// Animation
@keyframes ToastAnim {
0% {
	animation-timing-function: ease-in;
	opacity: 1;
	transform: translateY(-45px); 
    }

24% { 
        opacity: 1;
    }

40% {
	animation-timing-function: ease-in;
	transform: translateY(-24px);
   }
65% {
	animation-timing-function: ease-in;
	transform: translateY(-12px);
    }
82% {
	animation-timing-function: ease-in;
	transform: translateY(-6px);
    }
93% {
	animation-timing-function: ease-in;
  	transform: translateY(-4px);
    }
	25%,
	55%,
	75%,
87% {
	animation-timing-function: ease-out;
	transform: translateY(0px);
    }
100% {
        animation-timing-function: ease-out;
	opacity: 1;
	transform: translateY(0px);
    }
}
    `);
    const speeds = [0.5, 1, 1.5,2,4,5];
    let currentSpeedIndex = 2;

    // Index Ajuste
    const observer = new MutationObserver(ajustarZIndex);
    observer.observe(document.body, { childList: true, subtree: true });

    function ajustarZIndex() {
        const downloadButtons = document.querySelectorAll('.btn-download');
        const lgImgWraps = document.querySelectorAll('.lg-img-wrap');

        let hasVisibleLgImgWrap = Array.from(lgImgWraps).some(wrap => {
            return window.getComputedStyle(wrap).display !== 'none' &&
                window.getComputedStyle(wrap).visibility !== 'hidden';
        });

        if (hasVisibleLgImgWrap) {
            downloadButtons.forEach(button => {
                button.style.zIndex = -1;
            });
        } else {
            downloadButtons.forEach(button => {
                button.style.zIndex = '9999';
            });
        }
    }

    // Remover Botões Padrão
    function removerBotoes() {
        //Botão Donwload All
        const allButtons = document.querySelectorAll('.col-sm-7.user-info button');
        allButtons.forEach(button => {
            const isDownloadButton = button.querySelector('i.fas.fa-download');
            if (!isDownloadButton) {
                button.style.display = 'none'; // Oculta botões não relacionados ao download
            }
        });

        // Botão Pagina User
        const targetIds = ['user', 'tabs'];
        const buttonsToHide = document.querySelectorAll('.btn.btn-pink');

        // Verifica se algum dos IDs está presente
        const isTargetPage = targetIds.some(id => document.getElementById(id) !== null);

        if (isTargetPage) {
            buttonsToHide.forEach(button => {
                button.style.display = 'none'; // Esconde os botões
            });
        }

        //Com Login
        const botoesFollowAc = document.querySelectorAll('button.btn.btn-pink.user-follow');
        botoesFollowAc.forEach(botao => botao.remove());

        const botaoOlhoAc = document.querySelectorAll('button.btn.btn-pink.user-hide');
        botaoOlhoAc.forEach(botao => botao.remove());

         //Sem Login
        const botaoFollow = document.querySelector('button.btn.btn-pink[data-toggle="modal"][data-target="#needAccount"]');
        if (botaoFollow) {
            botaoFollow.remove();
        }
        const botaoOlho = document.querySelector('button.btn.btn-pink[data-toggle="modal"][data-target="#needAccount"] i.fas.fa-eye-slash');
        if (botaoOlho) {
            botaoOlho.closest('button').remove();
        }
    }

    // Mudar Titulo
    function ChangeTitle() {

        const h1Element = document.querySelector('.col-sm-12.page-content h1');
        if (h1Element) {
            h1Element.textContent = "By Maad - Premium Erome";
        }

        document.title = "By Maad - Premium";
        let originalTitle = document.title;
        let blinkInterval = setInterval(() => {
            document.title = document.title === originalTitle ? "By Maad" : originalTitle;
        }, 1);

        setTimeout(() => {
            clearInterval(blinkInterval);
            document.title = originalTitle;
        }, 1);
    }

    // Disclaimer
    function Disclaimer() {
        const disclaimer = document.getElementById('disclaimer');
        if (disclaimer) {
            disclaimer.remove();
            document.body.style.overflow = 'visible';
            $.ajax({ type: 'POST', url: '/user/disclaimer', async: true });
        }
    }

    // Bypass Account
    function BypassAccount() {
        var modalElement = document.getElementById("needAccount");
        if (modalElement) {
            modalElement.parentNode.removeChild(modalElement);
         } else {
        }

        var userNameElement = document.getElementById("user_name") || document.querySelector(".username");
        if (userNameElement) {
             userNameElement.textContent = "By Maad";
             userNameElement.innerHTML = "By Maad&nbsp;<i class='fas fa-check-circle user-verified' title='Verified'></i>"; // Atualiza o texto e adiciona o ícone

        } else {

        }
    }

    function getFileName(url) {
        return url.split('/').pop().split('?')[0];
    }
    // Toast Mensagem
    function showToast(message, isError = false) {
    const existingToasts = document.querySelectorAll('.toast');

    const toast = document.createElement('div');
    toast.className = 'toast';

    // SVG adicionado ao Toast
    const svgIcon = `
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.1892 14.0608L19.0592 12.1808C18.8092 11.7708 18.5892 10.9808 18.5892 10.5008V8.63078C18.5892 5.00078 15.6392 2.05078 12.0192 2.05078C8.38923 2.06078 5.43923 5.00078 5.43923 8.63078V10.4908C5.43923 10.9708 5.21923 11.7608 4.97923 12.1708L3.84923 14.0508C3.41923 14.7808 3.31923 15.6108 3.58923 16.3308C3.85923 17.0608 4.46923 17.6408 5.26923 17.9008C6.34923 18.2608 7.43923 18.5208 8.54923 18.7108C8.65923 18.7308 8.76923 18.7408 8.87923 18.7608C9.01923 18.7808 9.16923 18.8008 9.31923 18.8208C9.57923 18.8608 9.83923 18.8908 10.1092 18.9108C10.7392 18.9708 11.3792 19.0008 12.0192 19.0008C12.6492 19.0008 13.2792 18.9708 13.8992 18.9108C14.1292 18.8908 14.3592 18.8708 14.5792 18.8408C14.7592 18.8208 14.9392 18.8008 15.1192 18.7708C15.2292 18.7608 15.3392 18.7408 15.4492 18.7208C16.5692 18.5408 17.6792 18.2608 18.7592 17.9008C19.5292 17.6408 20.1192 17.0608 20.3992 16.3208C20.6792 15.5708 20.5992 14.7508 20.1892 14.0608ZM12.7492 10.0008C12.7492 10.4208 12.4092 10.7608 11.9892 10.7608C11.5692 10.7608 11.2292 10.4208 11.2292 10.0008V6.90078C11.2292 6.48078 11.5692 6.14078 11.9892 6.14078C12.4092 6.14078 12.7492 6.48078 12.7492 6.90078V10.0008Z" fill="#8a5acc"></path>
        <path d="M14.8297 20.01C14.4097 21.17 13.2997 22 11.9997 22C11.2097 22 10.4297 21.68 9.87969 21.11C9.55969 20.81 9.31969 20.41 9.17969 20C9.30969 20.02 9.43969 20.03 9.57969 20.05C9.80969 20.08 10.0497 20.11 10.2897 20.13C10.8597 20.18 11.4397 20.21 12.0197 20.21C12.5897 20.21 13.1597 20.18 13.7197 20.13C13.9297 20.11 14.1397 20.1 14.3397 20.07C14.4997 20.05 14.6597 20.03 14.8297 20.01Z" fill="#8a5acc"></path>
      </svg>
    `;

    // Conteúdo do Toast
    toast.innerHTML = `${svgIcon} <span>${message}</span>`;

    toast.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        position: fixed;
        bottom: ${existingToasts.length > 0 ? (existingToasts.length * 60 + 20) + 'px' : '20px'};
        right: 20px;
        background-color: ${isError ? '#1d1e2a' : '#14151f'};
        color: ${isError ? '#FFF' : '#b39ad6'};
        padding: 15px 20px;
        border-radius: 12px;
        font-size: 14px;
        font-family: Arial, sans-serif;
        z-index: 9999;
        box-shadow: 0 0 15px ${isError ? '#8a5acc' : '#b39ad6'}, 0 0 25px ${isError ? '#b39ad6' : '#8a5acc'};
        transition: opacity 0.5s ease-in-out;
        opacity: 0.9;
        animation: ToastAnim 2s ease 0s 1 normal forwards;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

    //Botão Donwload
    function download(url) {
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            responseType: "blob",
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Referer': 'https://www.erome.com/'
            },
            onload: function (response) {
                if (response.status === 200) {
                    const blob = new Blob([response.response], { type: response.response.type });
                    const tempUrl = URL.createObjectURL(blob);
                    const aTag = document.createElement('a');
                    aTag.href = tempUrl;
                    aTag.download = getFileName(url);
                    document.body.appendChild(aTag);
                    aTag.click();
                    URL.revokeObjectURL(tempUrl);
                    aTag.remove();
                    showToast('Download iniciado');
                } else {
                    showToast('Erro 403: Acesso negado ao arquivo', true);
                }
            },
            onerror: function (err) {
            }
        });
    }

    // Download Direct
    function addLink(media) {
        let src = media.tagName === 'IMG' ? media.src || media.getAttribute('data-src') : media.querySelector('source')?.src || media.src;

        if (src) {
            const button = document.createElement('button');
            button.className = 'btn-download button';
            button.setAttribute('data-label', 'Baixar'); // Atributo para o texto

            button.innerHTML = `
            <svg class="svgIcon" viewBox="0 0 384 512" fill="white" style="transform: rotate(180deg);">
                <path
                    d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
                ></path>
            </svg>
        `;
            button.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: rgb(20, 21, 31);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0px 0px 0px 4px rgba(138, 90, 204, 0.255);
            cursor: pointer;
            transition-duration: 0.3s;
            overflow: hidden;
            z-index: 9999;
        `;

            const svgIcon = button.querySelector('.svgIcon');
            svgIcon.style.width = '15px';

            button.addEventListener('mouseenter', () => {
                button.style.width = '100px';
                button.style.borderRadius = '40px';
                button.style.backgroundColor = 'rgb(138, 90, 204)';
                svgIcon.querySelector('path').setAttribute('fill', '#ffffff');
                button.textContent = button.getAttribute('data-label');
            });

            button.addEventListener('mouseleave', () => {
                button.style.width = '40px';
                button.style.borderRadius = '50%';
                button.style.backgroundColor = 'rgb(20, 21, 31)';
                svgIcon.querySelector('path').setAttribute('fill', 'white');
                button.textContent = ''; // Limpar o texto
                button.innerHTML = `
                <svg class="svgIcon" viewBox="0 0 384 512" fill="white" style="transform: rotate(180deg); width: 17px; height: 17px;">
                    <path
                        d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
                    ></path>
                </svg>
            `;
            });
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                download(src);
            });
            media.parentElement.parentElement?.appendChild(button);
        }
    }

    // Ocultar Download
    function OcultarDownload() {
        const buttonsToToggle = document.querySelectorAll('.btn-download');
        const newButton = document.createElement('button');
        newButton.className = 'btn btn-pink';
        newButton.style.marginLeft = '4px';
        newButton.innerHTML = '<i class="fas fa-eye-slash"></i> Downloads';

        newButton.addEventListener('click', () => {
            buttonsToToggle.forEach(button => {
                button.style.visibility = button.style.visibility === 'hidden' ? 'visible' : 'hidden';
            });

            if (buttonsToToggle[0].style.visibility === 'hidden') {
                newButton.innerHTML = '<i class="fas fa-eye"></i> Downloads';
                showToast('Você ocultou os botões de Download!');
            } else {
                newButton.innerHTML = '<i class="fas fa-eye-slash"></i> Downloads';
                showToast('Você restaurou os botões de Download!');
            }
        });

        const userInfo = document.querySelector('.user-info');
        if (userInfo) userInfo.appendChild(newButton);
    }

    // Ocultar Fotos
    function ocultarFotos() {
        const fotos = document.querySelectorAll('.media-group img');
        const botoesDownload = document.querySelectorAll('.btn-download');
        const userInfo = document.querySelector('.user-info');
        const albumImages = document.querySelector('.album-images');

        if (userInfo) {
            const toggleButton = document.createElement('button');
            toggleButton.className = 'btn btn-pink';
            toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i> Fotos';
            toggleButton.style.position = 'relative';
            toggleButton.style.marginLeft = '4px';

            toggleButton.addEventListener('click', () => {
                const isHidden = fotos[0].style.display === 'none';
                fotos.forEach(foto => {
                    foto.style.display = isHidden ? 'block' : 'none';
                });

                botoesDownload.forEach(botao => {
                    const parentImage = botao.closest('.media-group').querySelector('img');
                    if (parentImage) {
                        botao.style.display = isHidden ? 'inline-block' : 'none';
                    }
                });

                if (isHidden) {
                    showToast('Você restaurou as fotos!');
                    if (albumImages) {
                        albumImages.style.display = 'inline';
                    }
                } else {
                    showToast('Você ocultou as fotos!');
                    if (albumImages) {
                        albumImages.style.display = 'none';
                    }
                }
                toggleButton.innerHTML = isHidden
                    ? '<i class="fas fa-eye"></i> Fotos'
                : '<i class="fas fa-eye-slash"></i> Fotos';
            });

            userInfo.appendChild(toggleButton);
        }
    }

    // Ocultar Videos
    function ocultarVideos() {
        const videos = document.querySelectorAll('.video-js');
        const botoesDownload = document.querySelectorAll('.btn-download');
        const userInfo = document.querySelector('.user-info');
        const albumVideos = document.querySelector('.album-videos');

        if (userInfo) {
            const toggleButton = document.createElement('button');
            toggleButton.className = 'btn btn-pink';
            toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i> Vídeos';
            toggleButton.style.position = 'relative';
            toggleButton.style.marginLeft = '4px';

            toggleButton.addEventListener('click', () => {
                const isHidden = videos[0].style.display === 'none';

                videos.forEach(video => {
                    video.style.display = isHidden ? 'block' : 'none';
                });

                botoesDownload.forEach(botao => {
                    const parentVideo = botao.closest('.media-group').querySelector('.video-js');
                    if (parentVideo) {
                        botao.style.display = isHidden ? 'inline-block' : 'none';
                    }
                });

                if (isHidden) {
                    showToast('Você restaurou os vídeos!');
                    if (albumVideos) {
                        albumVideos.style.display = 'inline';
                    }
                } else {
                    showToast('Você ocultou os vídeos!');
                    if (albumVideos) {
                        albumVideos.style.display = 'none';
                    }
                }

                toggleButton.innerHTML = isHidden
                    ? '<i class="fas fa-eye"></i> Vídeos'
                : '<i class="fas fa-eye-slash"></i> Vídeos';
            });

            userInfo.appendChild(toggleButton);
        }
    }

    // Modo Noite/Cinema Start
    let overlay;

    function CinemaMode() {
        const nightButton = document.createElement('button');
        nightButton.className = 'btn btn-pink';
        nightButton.style.marginLeft = '4px';
        nightButton.innerHTML = '<i class="fas fa-moon"></i> Cinema';

        let nightMode = false;

        nightButton.addEventListener('click', () => {
            nightMode = !nightMode;

            if (nightMode) {
                AtivarCinemaMode();
                nightButton.innerHTML = '<i class="fas fa-sun"></i> Cinema';
                showToast('Modo Cinema Ativado!');
            } else {
                DesativarCinemaMode();
                nightButton.innerHTML = '<i class="fas fa-moon"></i> Cinema';
                showToast('Modo Cinema Desativado!');
            }
        });

        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            userInfo.appendChild(nightButton);
        }
    }

    function AtivarCinemaMode() {
        document.body.style.backgroundColor = '#111';
        document.body.style.color = '#fff';

        overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        overlay.style.zIndex = '998';
        overlay.style.pointerEvents = 'none';
        document.body.appendChild(overlay);

        highlightMedia();
    }

    function DesativarCinemaMode() {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';

        if (overlay) {
            overlay.remove();
            overlay = null;
        }

        resetMedia();
    }

    function highlightMedia() {
        const videos = document.querySelectorAll('.media-group video');

        videos.forEach(video => {
            video.style.filter = 'brightness(1)';
            video.parentElement.style.backgroundColor = 'transparent';
            video.removeAttribute('controls');

            const wrapper = video.closest('.video-js');
            if (wrapper) {
                wrapper.style.backgroundColor = 'transparent';
                wrapper.style.zIndex = '9999';
            }
        });

        const images = document.querySelectorAll('.media-group img');
        images.forEach(img => {
            img.style.filter = 'none';
            img.style.position = 'relative';
            img.style.zIndex = '9999';
        });
    }

    function resetMedia() {
        const medias = document.querySelectorAll('.media-group video, .media-group img');
        medias.forEach(media => {
            media.style.filter = '';
            media.style.backgroundColor = '';

            if (media.tagName === 'VIDEO') {
                media.removeAttribute('controls');
                media.style.backgroundColor = '#000000';
            }
        });
    }
     // Modo Noite/Cinema End

    // View Grid Start
    function isAlbumPage() {
        const path = window.location.pathname;
        return path.startsWith('/a/') || path.includes('/a/');
    }

    let ascendingOrder = true;
    let toggleButton;

    const toggleGridOrder = (ev) => {
        if (ev) ev.preventDefault();
        ascendingOrder = !ascendingOrder;
        const newOrder = ascendingOrder ? 'a' : 'd';
        document.location.hash = `#view=${newOrder}`;
        updateButtonText();
        sortAlbums();
    };

    function sortAlbums() {
        const albums = Array.from(document.querySelectorAll('#albums .album'));
        albums.sort((a, b) => {
            const viewsA = parseViews(a.querySelector('.album-bottom-views').textContent);
            const viewsB = parseViews(b.querySelector('.album-bottom-views').textContent);
            return ascendingOrder ? viewsA - viewsB : viewsB - viewsA;
        });

        const albumsContainer = document.querySelector('#albums');
        albums.forEach(album => albumsContainer.appendChild(album));
    }

    function parseViews(text) {
        return parseFloat(text.replace(/[^\d,]/g, '').replace(',', '.')) *
            (text.includes('K') ? 1000 : 1);
    }

    function updateButtonText() {
        toggleButton.innerHTML = `<i class="fa fa-sort fa-lg"></i>VIEWS`;
        toggleButton.style.display = 'flex';
        toggleButton.style.alignItems = 'center';
        toggleButton.style.marginLeft = '-10px'; // Aplicando margin-right corretamente
    }

    function addButtonToNav() {
        if (isAlbumPage()) {

            return;
        }

        const navRight = document.querySelector('.nav.navbar-nav.navbar-right');
        if (navRight) {
            const li = document.createElement('li');
            toggleButton = document.createElement('a');
            toggleButton.href = '#';
            updateButtonText();
            toggleButton.addEventListener('click', toggleGridOrder);
            li.appendChild(toggleButton);
            navRight.appendChild(li);
        } else {

        }
    }

    function waitForNav() {
        const interval = setInterval(() => {
            const navRight = document.querySelector('.nav.navbar-nav.navbar-right');
            if (navRight) {
                clearInterval(interval);
                addButtonToNav();
            }
        }, 500);
    }

    window.addEventListener('load', () => {
        waitForNav();
        if (document.location.hash.includes('order=desc')) {
            ascendingOrder = false;
        }
        sortAlbums();
    });

    // View Grid End

    // Albun Liked
    async function LikeAlbun() {
        const albums = Array.from(document.getElementsByClassName('album-link'));
        const albumPromises = albums.map(async (album) => {
            const hr = album.href;
            const hdr = await fetch(hr);
            const data = await hdr.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');

            let countArea = doc.querySelector('#like_count') || doc.querySelector('.far.fa-heart.fa-lg');
            let count = countArea ? countArea.nextElementSibling.firstChild.textContent.trim() : 0;

            if (+count < 1) {
                return;
            }

            const viewSec = album.parentElement.querySelector('.album-bottom-right .album-images');

            const likeCountHTML = `
    <span style="position: relative; bottom: 0px; filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 0px); margin-left: 5px; color: white;">
        <i class="ml-5 mr-1 fas pink fa-heart fa-lg" aria-hidden="true" style="position: relative; bottom: 0;"></i> ${count}
    </span>
     `;


            viewSec.insertAdjacentHTML("afterbegin", likeCountHTML);
        });

        await Promise.all(albumPromises);
    }

    function init() {
        const mediaElements = document.querySelectorAll('.media-group video, .media-group img');
        mediaElements.forEach(media => addLink(media));
        Disclaimer();
        OcultarDownload();
        ocultarFotos();
        ocultarVideos();
        CinemaMode();
        ajustarZIndex();
        removerBotoes();
        BypassAccount();
        ChangeTitle();
        Disclaimer();
        LikeAlbun();
        setTimeout(Disclaimer, 2000);
    }

    const MILIMETROS = 5;
    const PIXELS = MILIMETROS * 3.78;
    const PIXELSREVERSE = MILIMETROS * -3.78;
    // By Maad
    window.addEventListener('load', () => {
        window.scrollBy(0, PIXELS);
	window.scrollBy(0, PIXELSREVERSE); 
    });
	
    window.addEventListener('load', init);
    document.addEventListener('DOMContentLoaded', init);
    document.addEventListener("contextmenu", (e) => {e.stopPropagation()}, true);
})();
