// ==UserScript==
// @name         Erome Downloader - By Maad
// @namespace    https://github.com/maadvfx/
// @icon         https://www.erome.com/favicon.ico
// @version      1.5
// @description  Download videos e images de erome com controle de botões.
// @author       Maad
// @match        https://www.erome.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @require      https://github.com/castielwallker/Premium-Erome/raw/refs/heads/main/player.js
// @require      https://github.com/castielwallker/Premium-Erome/raw/refs/heads/main/slider.js
// @require      https://github.com/castielwallker/Premium-Erome/raw/refs/heads/main/nsfw.js
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

    // Index Ajuste
    const observer = new MutationObserver(ajustarZIndex);
    observer.observe(document.body, { childList: true, subtree: true });
    function ajustarZIndex() {
        const downloadButtons = document.querySelectorAll('.btn-download');
        const lgImgWraps = document.querySelectorAll('.lg-img-wrap');

        // Verifica se há alguma lg-img-wrap visível
        let hasVisibleLgImgWrap = Array.from(lgImgWraps).some(wrap => {
            return window.getComputedStyle(wrap).display !== 'none' &&
                window.getComputedStyle(wrap).visibility !== 'hidden';
        });

        // Se houver lg-img-wrap visível, ajusta o z-index dos botões de download
        if (hasVisibleLgImgWrap) {
            downloadButtons.forEach(button => {
                button.style.zIndex = -1; // Define z-index menor que lg-img-wrap
            });
        } else {
            downloadButtons.forEach(button => {
                button.style.zIndex = '9999'; // Restaura o z-index padrão
            });
        }
    }


    // Remover Botões Padrão
    function removerBotoes() {

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
            background-color: rgb(20, 20, 20);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0px 0px 0px 4px rgba(235, 99, 149, 0.255);
            cursor: pointer;
            transition-duration: 0.3s;
            overflow: hidden;
            z-index: 9999;
        `;

            const svgIcon = button.querySelector('.svgIcon');
            svgIcon.style.width = '15px'; // Largura do ícone SVG inicial

            button.addEventListener('mouseenter', () => {
                button.style.width = '100px';
                button.style.borderRadius = '40px';
                button.style.backgroundColor = 'rgb(235, 99, 149)';
                svgIcon.querySelector('path').setAttribute('fill', '#ffffff');
                button.textContent = button.getAttribute('data-label'); // Usar o atributo para definir o texto
            });

            button.addEventListener('mouseleave', () => {
                button.style.width = '40px';
                button.style.borderRadius = '50%';
                button.style.backgroundColor = 'rgb(20, 20, 20)';
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
        const buttonsToToggle = document.querySelectorAll('.btn-download'); // Seleciona todos os botões de download
        const newButton = document.createElement('button'); // Cria um novo botão
        newButton.className = 'btn btn-pink';
        newButton.style.marginLeft = '4px';
        newButton.innerHTML = '<i class="fas fa-eye-slash"></i> Downloads';

        newButton.addEventListener('click', () => {
            buttonsToToggle.forEach(button => {
                // Alterna a visibilidade dos botões
                button.style.visibility = button.style.visibility === 'hidden' ? 'visible' : 'hidden';
            });

            // Atualiza o texto do botão com base no estado de visibilidade do primeiro botão
            if (buttonsToToggle[0].style.visibility === 'hidden') {
                newButton.innerHTML = '<i class="fas fa-eye"></i> Downloads'; // Ícone de olho aberto
                showToast('Você ocultou os botões de Download!'); // Mensagem informativa
            } else {
                newButton.innerHTML = '<i class="fas fa-eye-slash"></i> Downloads'; // Ícone de olho fechado
                showToast('Você restaurou os botões de Download!'); // Mensagem informativa
            }
        });

        const userInfo = document.querySelector('.user-info'); // Seleciona a área do usuário
        if (userInfo) userInfo.appendChild(newButton); // Adiciona o novo botão à interface
    }

    // Ocultar Fotos
    function ocultarFotos() {
        const fotos = document.querySelectorAll('.media-group img'); // Seleciona as imagens
        const botoesDownload = document.querySelectorAll('.btn-download'); // Seleciona botões de download
        const userInfo = document.querySelector('.user-info');
        const albumImages = document.querySelector('.album-images'); // Seleciona o elemento

        if (userInfo) {
            const toggleButton = document.createElement('button');
            toggleButton.className = 'btn btn-pink';
            toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i> Fotos';
            toggleButton.style.position = 'relative';
            toggleButton.style.marginLeft = '4px';

            toggleButton.addEventListener('click', () => {
                const isHidden = fotos[0].style.display === 'none';

                // Oculta ou mostra fotos
                fotos.forEach(foto => {
                    foto.style.display = isHidden ? 'block' : 'none';
                });

                // Oculta ou mostra os botões de download correspondentes
                botoesDownload.forEach(botao => {
                    const parentImage = botao.closest('.media-group').querySelector('img');
                    if (parentImage) {
                        botao.style.display = isHidden ? 'inline-block' : 'none';
                    }
                });

                // Exibe mensagens baseadas na visibilidade das fotos
                if (isHidden) {
                    showToast('Você restaurou as fotos!');
                    if (albumImages) {
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
                    ? '<i class="fas fa-eye"></i> Fotos' // Ícone de olhos abertos
                : '<i class="fas fa-eye-slash"></i> Fotos'; // Ícone de olhos fechados
            });

            userInfo.appendChild(toggleButton);
        }
    }

    // Ocultar Videos
    function ocultarVideos() {
        const videos = document.querySelectorAll('.video-js'); // Seleciona vídeos
        const botoesDownload = document.querySelectorAll('.btn-download'); // Seleciona botões de download
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

                // Oculta ou mostra os botões de download correspondentes
                botoesDownload.forEach(botao => {
                    const parentVideo = botao.closest('.media-group').querySelector('.video-js');
                    if (parentVideo) {
                        botao.style.display = isHidden ? 'inline-block' : 'none';
                    }
                });

                // Exibe mensagens baseadas na visibilidade dos vídeos
                if (isHidden) {
                    showToast('Você restaurou os vídeos!');
                    if (albumVideos) {
                        albumVideos.style.display = 'inline'; // Mostra o elemento
                    }
                } else {
                    showToast('Você ocultou os vídeos!');
                    if (albumVideos) {
                        albumVideos.style.display = 'none'; // Oculta o elemento
                    }
                }

                // Alterna o ícone conforme o estado dos vídeos
                toggleButton.innerHTML = isHidden
                    ? '<i class="fas fa-eye"></i> Vídeos' // Ícone de olhos abertos
                : '<i class="fas fa-eye-slash"></i> Vídeos'; // Ícone de olhos fechados
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

        // Verifica se estamos na página de perfil
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
    function init() {
        const mediaElements = document.querySelectorAll('.media-group video, .media-group img');
        mediaElements.forEach(media => addLink(media));
        OcultarDownload();
        ocultarFotos();
        ocultarVideos();
        CinemaMode();
        ajustarZIndex();
        removerBotoes();
        BypassAccount();
        ChangeTitle();
        Disclaimer();
        setTimeout(Disclaimer, 1000);
    }

    window.addEventListener('load', init);
    document.addEventListener('DOMContentLoaded', init);
})();
