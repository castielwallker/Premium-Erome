// ==UserScript==
// @name         Erome Downloader Premium
// @namespace    https://github.com/maadvfx/
// @icon         https://www.erome.com/favicon.ico
// @version      1.5
// @description  Download videos e images de erome com controle de botões.
// @author       Maad
// @match        https://www.erome.com/a/*
// @match        https://www.erome.com/*
// @match        https://www.erome.com/explore*
// @match        https://www.erome.com/search?q=*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @require      https://github.com/castielwallker/Premium-Erome/raw/refs/heads/main/player.js
// @updateURL    https://raw.githubusercontent.com/castielwallker/Premium-Erome/refs/heads/main/erome.js
// @downloadURL  https://raw.githubusercontent.com/castielwallker/Premium-Erome/refs/heads/main/erome.js
// ==/UserScript==
/* globals $ Maad */

(function () {
    'use strict';

    // Adiciona CSS customizado
    GM_addStyle(`
    .vjs-control:hover {
        background: rgba(211, 69, 121, 0.5); /* Cor ao passar o mouse */
    }
    button:hover {
        background: rgba(211, 69, 121, 0.5); /* Cor ao passar o mouse */
    }
   .media-group .img-back { /* Corrigido com ponto antes de media-group */
    width: 100%;
    height: auto;
    filter: brightness(40%) blur(10px); /* Combine os filtros em uma única declaração */
    border-radius: 15px;
    opacity: 1;
    }
`);
    const speeds = [0.5, 1, 1.5,2,4];
    let currentSpeedIndex = 2;
    const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        const target = mutation.target;
        if (target.classList.contains('lg-visible') ||
            target.classList.contains('lg-backdrop') ||
            target.classList.contains('in')) {
            target.classList.remove('lg-visible', 'lg-show-after-load', 'lg-hide-items', 'lg-backdrop', 'in');
            console.log('Classes lg-* e backdrop removidas!');
            target.style.display = 'none';
        }
    });
});

    // Remover Botões Padrão
    function removerBotoes() {
        const botaoFollow = document.querySelector('button.btn.btn-pink[data-toggle="modal"][data-target="#needAccount"]');
        if (botaoFollow) {
            botaoFollow.remove();
        }
        const botaoOlho = document.querySelector('button.btn.btn-pink[data-toggle="modal"][data-target="#needAccount"] i.fas.fa-eye-slash');
        if (botaoOlho) {
            botaoOlho.closest('button').remove();
        }
    }

    //Detectar Perfil
    function isProfilePage() {
        return document.querySelector('#user') !== null;
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
        }, 200000);

        setTimeout(() => {
            clearInterval(blinkInterval);
            document.title = originalTitle;
        }, 200000);
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
            button.className = 'btn-download';
            button.style.cssText = `
    border: none; /* Corrigido de 'border = 'none';' para 'border: none;' */
    outline: none; /* Adicionando isso para garantir que não haja contorno */
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: #ffffff;
    border-radius: 50px;
    cursor: pointer;
    z-index: 9999;
    transition: background-color 0.3s ease, border-color 0.3s ease, fill 0.3s ease;
`;
            button.innerHTML = `
    <svg
        fill="#161616"
        height="20px"
        width="20px"
        viewBox="0 0 330 330"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M154.389,265.602c0.351,0.35,0.719,0.683,1.103,0.997c0.169,0.138,0.347,0.258,0.52,0.388
            c0.218,0.164,0.432,0.333,0.659,0.484c0.212,0.142,0.432,0.265,0.649,0.395c0.202,0.121,0.4,0.248,0.608,0.359
            c0.224,0.12,0.453,0.221,0.681,0.328c0.215,0.102,0.427,0.21,0.648,0.301c0.223,0.092,0.45,0.167,0.676,0.247
            c0.235,0.085,0.468,0.175,0.709,0.248c0.226,0.068,0.456,0.119,0.685,0.176c0.246,0.062,0.489,0.131,0.739,0.181
            c0.263,0.052,0.528,0.083,0.794,0.121c0.219,0.031,0.435,0.073,0.658,0.095c0.492,0.048,0.986,0.075,1.48,0.075
            s0.988-0.026,1.48-0.075c0.225-0.022,0.444-0.064,0.667-0.096c0.262-0.037,0.524-0.068,0.784-0.12
            c0.255-0.05,0.503-0.121,0.754-0.184c0.223-0.057,0.448-0.105,0.669-0.172c0.246-0.075,0.483-0.167,0.724-0.253
            c0.221-0.08,0.444-0.152,0.662-0.242c0.225-0.093,0.44-0.202,0.659-0.306c0.225-0.106,0.452-0.206,0.672-0.324
            c0.21-0.112,0.408-0.239,0.611-0.361c0.217-0.13,0.437-0.252,0.648-0.394c0.222-0.148,0.431-0.314,0.643-0.473
            c0.179-0.134,0.362-0.258,0.536-0.4c0.365-0.3,0.714-0.617,1.049-0.949l70.002-69.998c5.858-5.858,5.858-15.355,0-21.213
            s-15.355-5.857-21.213,0l-44.396,44.393V15c0-8.284-6.716-15-15-15s-15,6.716-15,15v203.785l-44.392-44.391
            c-5.858-5.858-15.356-5.858-21.213,0s-5.858,15.355,0,21.213L154.389,265.602z"></path>
        <path d="M315,300H15c-8.284,0-15,6.716-15,15s6.716,15,15,15h300c8.284,0,15-6.716,15-15S323.284,300,315,300z"></path>
    </svg>
`;

            button.addEventListener('mouseenter', () => {
            button.style.border = 'none';
            button.style.outline = 'none';
            button.style.backgroundColor = '#101010';
            button.style.boxShadow = '0 0 10px 3px #101010';
            button.querySelector('svg').setAttribute('fill', '#ffffff');
            });
            button.addEventListener('mouseleave', () => {
            button.style.border = 'none';
            button.style.outline = 'none';
            button.style.backgroundColor = '#ffffff';
            button.style.boxShadow = 'none';
            button.querySelector('svg').setAttribute('fill', '#161616');
                });
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                download(src);
            });

            media.parentElement.parentElement?.appendChild(button);
        }
    }

    // Ocultar Donwload
    function OcultarDownload() {
        const buttonsToToggle = document.querySelectorAll('.btn-download');
        const newButton = document.createElement('button');
        newButton.className = 'btn btn-pink';
        newButton.style.marginLeft = '4px';
        newButton.innerHTML = '<i class="fas fa-eye-slash"></i> Downloads';

        newButton.addEventListener('click', () => {
            buttonsToToggle.forEach(button => {
                button.style.display = button.style.display === 'none' ? 'inline-block' : 'none';
            });

            if (buttonsToToggle[0].style.display === 'none') {
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
        const albumImages = document.querySelector('.album-images'); // Seleciona o elemento
        // Oculta todas as fotos ao carregar o site

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

                // Oculta ou mostra o elemento span baseado na visibilidade das fotos
                if (isHidden) {
                    showToast('Você restaurou as fotos!');
                    if (albumImages) {
                        albumImages.style.display = 'none'; // Oculta o elemento
                        albumImages.style.display = 'inline'; // Mostra o elemento
                    }
                } else {
                    showToast('Você ocultou as fotos!');
                    if (albumImages) {
                        albumImages.style.display = 'none'; // Oculta o elemento
                    }
                }

                // Alterna o ícone conforme o estado das fotos
                toggleButton.innerHTML = isHidden
                    ? '<i class="fas fa-eye-slash"></i> Fotos'
                : '<i class="fas fa-eye"></i> Fotos';
            });

            userInfo.appendChild(toggleButton);
        }
    }

    // Ocultar Videos
    function ocultarVideos() {
        const videos = document.querySelectorAll('.video-js'); // Seleciona vídeos
        const userInfo = document.querySelector('.user-info');
        const albumVideos = document.querySelector('.album-videos'); // Seleciona o elemento

        // Oculta todos os vídeos ao carregar o site
        if (userInfo) {
            const toggleButton = document.createElement('button');
            toggleButton.className = 'btn btn-pink';
            toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i> Vídeos';
            toggleButton.style.position = 'relative';
            toggleButton.style.marginLeft = '4px';
            toggleButton.addEventListener('click', () => {
                const isHidden = videos[0].style.display === 'none';

                // Oculta ou mostra vídeos
                videos.forEach(video => {
                    video.style.display = isHidden ? 'block' : 'none'; // Altera aqui para 'block' ou 'none'
                });

                            // Oculta ou mostra o elemento span baseado na visibilidade das fotos
                if (isHidden) {
                    showToast('Você restaurou os videos!');
                    if (albumVideos) {
                        albumVideos.style.display = 'none'; // Oculta o elemento
                        albumVideos.style.display = 'inline'; // Mostra o elemento
                    }
                } else {
                    showToast('Você ocultou os videos!');
                    if (albumVideos) {
                        albumVideos.style.display = 'none'; // Oculta o elemento
                    }
                }

                // Alterna o ícone conforme o estado dos vídeos
                toggleButton.innerHTML = isHidden
                    ? '<i class="fas fa-eye-slash"></i> Vídeos'
                : '<i class="fas fa-eye"></i> Vídeos';

                // Exibe uma mensagem de toast
                //showToast(isHidden ? 'Você restaurou os vídeos!' : 'Você ocultou os vídeos!');
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
        if (userInfo) userInfo.appendChild(nightButton);
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
        const newOrder = ascendingOrder ? 'asc' : 'desc';
        document.location.hash = `#order=${newOrder}`;
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
        toggleButton.innerHTML = `<i class="fa fa-sort fa-lg"></i> View: ${ascendingOrder ? 'Menos' : 'Mais'}`;
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

    // Player Detected Modification
    function initializePlayers() {
        const players = document.querySelectorAll('video.vjs-tech');
        if (players.length > 0) {
            players.forEach(player => modifyVideoPlayer(player));
        } else {
            setTimeout(initializePlayers, 1000);
        }
    }

    function init() {
        const mediaElements = document.querySelectorAll('.media-group video, .media-group img');
        mediaElements.forEach(media => addLink(media));
        OcultarDownload();
        removerBotoes();
        ocultarFotos();
        ocultarVideos();
        CinemaMode();
        BypassAccount();
        ChangeTitle();
        Disclaimer();
        setTimeout(Disclaimer, 500);
    }

    window.addEventListener('load', init);
    window.addEventListener('load', initializePlayers);
    document.addEventListener('DOMContentLoaded', init);
})();
