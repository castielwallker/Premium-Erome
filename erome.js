// ==UserScript==
// @name         Erome Downloader Premium
// @namespace    https://github.com/maadvfx/
// @icon         https://www.erome.com/favicon.ico
// @version      1.2
// @description  Download videos e images de erome com controle de botões.
// @author       Maad
// @match        https://www.erome.com/a/*
// @grant        GM.xmlHttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @updateURL https://raw.githubusercontent.com/castielwallker/Premium-Erome/refs/heads/main/erome.js
// @downloadURL https://raw.githubusercontent.com/castielwallker/Premium-Erome/refs/heads/main/erome.js
// ==/UserScript==

(function () {
    'use strict';

    const speeds = [0.5, 1, 1.5,2,4]; // Opções de velocidade
    let currentSpeedIndex = 2;

    function mudarTitulo() {
        document.title = "By Maad - Premium"; // Altera o título da página

        // Efeito de piscar
        let originalTitle = document.title; // Guarda o título original
        let blinkInterval = setInterval(() => {
            document.title = document.title === originalTitle ? "By Maad" : originalTitle; // Alterna entre os títulos
        }, 200000); // Altera a cada 1 segundo

        // Para o efeito após 10 segundos
        setTimeout(() => {
            clearInterval(blinkInterval); // Para o efeito de piscar
            document.title = originalTitle; // Restaura o título original após o efeito
        }, 200000); // Dura 10 segundos
    }

    // Função para mudar o texto do H1
    function mudarTextoH1() {
        const h1Element = document.querySelector('.col-sm-12.page-content h1');
        if (h1Element) {
            h1Element.textContent = "By Maad - Premium Erome"; // Altera o texto do H1
        }
    }

    mudarTitulo(); // Chama a função para mudar o título
    mudarTextoH1(); // Chama a função para mudar o texto do H1
    mudarTitulo(); // Chama a função para mudar o título
    function removerDisclaimer() {

        //Bloquear Login
        var modalElement = document.getElementById("needAccount");
        if (modalElement) {
            modalElement.parentNode.removeChild(modalElement);
         } else {
        }

        // Mudar Nome
        var userNameElement = document.getElementById("user_name") || document.querySelector(".username");

        if (userNameElement) {

             userNameElement.textContent = "By Maad";
             userNameElement.innerHTML = "By Maad&nbsp;<i class='fas fa-check-circle user-verified' title='Verified'></i>"; // Atualiza o texto e adiciona o ícone

        } else {

        }

         //Bypass
        const disclaimer = document.getElementById('disclaimer');
        if (disclaimer) {
            disclaimer.remove();
            document.body.style.overflow = 'visible';
        }
    }
    removerDisclaimer();
    setTimeout(removerDisclaimer, 1000);

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('enter')) {
            removerDisclaimer();
            window.open(document.URL);
            location.href = "/o/p-1";
        }
    });

    function getFileName(url) {
        return url.split('/').pop().split('?')[0];
    }

    // Toast
    function showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: ${isError ? '#101010' : '#ffffff'};
            color: ${isError ? '#ffffff' : '#101010'};
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 14px;
            z-index: 9999;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
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
                //console.error('Erro ao fazer a requisição:', err);
            }
        });
    }


    function addLink(media) {
    let src = media.tagName === 'IMG' ? media.src || media.getAttribute('data-src') : media.querySelector('source')?.src || media.src;
    if (src) {
        const button = document.createElement('button');
        button.className = 'btn-download';
        button.style.cssText = `
            position: absolute; /* Posiciona o botão de forma absoluta */
            top: 10px; /* Distância do topo do contêiner pai */
            left: 10px; /* Distância da esquerda do contêiner pai */
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background-color: #ffffff;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            z-index: 9999; /* Garante que o botão fique acima da mídia */
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


            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                download(src);
            });

            media.parentElement.parentElement?.appendChild(button);
        }
    }

function NewBntAndHide() {
    const buttonsToToggle = document.querySelectorAll('.btn-download'); // Correção aqui: verifique se a classe está correta.

    // Cria o novo botão
    const newButton = document.createElement('button');
    newButton.className = 'btn btn-pink'; // Mantém o mesmo estilo
    newButton.style.marginLeft = '7px'; // Adiciona margem esquerda
    newButton.innerHTML = '<i class="fas fa-eye-slash"></i> Downloads'; // Texto inicial igual ao do botão de ocultar fotos

    newButton.addEventListener('click', () => {
        buttonsToToggle.forEach(button => {
            button.style.display = button.style.display === 'none' ? 'inline-block' : 'none'; // Alterna a visibilidade
        });

        // Altera o texto e ícone do botão para refletir o estado
        if (buttonsToToggle[0].style.display === 'none') {
            newButton.innerHTML = '<i class="fas fa-eye"></i> Downloads'; // Mostrar downloads
            showToast('Você ocultou os botões de Download!');
        } else {
            newButton.innerHTML = '<i class="fas fa-eye-slash"></i> Downloads'; // Ocultar downloads
            showToast('Você restaurou os botões de Download!');
        }
    });

    // Seleciona o elemento userInfo de forma mais universal
    const userInfo = document.querySelector('.user-info'); // Use uma classe comum
    if (userInfo) userInfo.appendChild(newButton); // Adiciona o botão à interface
}
    // Removendo Botão Follow
    function removerBotoes() {
    const botaoFollow = document.querySelector('button.btn.btn-pink[data-toggle="modal"][data-target="#needAccount"]');
    if (botaoFollow) {
        botaoFollow.remove(); // Remove o botão do DOM
    }
    const botaoOlho = document.querySelector('button.btn.btn-pink[data-toggle="modal"][data-target="#needAccount"] i.fas.fa-eye-slash');
    if (botaoOlho) {
        botaoOlho.closest('button').remove(); // Remove o botão do DOM
    }
}


//Ocultar Fotos e Deixar Videos
    function ocultarFotosEBotoes() {
    const fotos = document.querySelectorAll('.media-group img');
    const botoesDownload = document.querySelectorAll('.btn-download'); // Corrigir classe se necessário
    const userInfo = document.querySelector('.user-info'); // Use uma classe comum

    if (userInfo) {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'btn btn-pink';
        toggleButton.style.marginLeft = '8px'; // Adiciona margem esquerda
        toggleButton.style.padding = '5px 10px'; // Aumenta área clicável
        toggleButton.innerHTML = '<i class="fas fa-eye"></i> Fotos'; // Texto inicial
        toggleButton.style.position = 'relative'; // Garante que o pseudo-elemento posicione corretamente

        toggleButton.addEventListener('click', () => {
            const isHidden = fotos[0].style.display === 'none';

            fotos.forEach(foto => {
                foto.style.display = isHidden ? 'block' : 'none';
            });

            botoesDownload.forEach(botao => {
                const parentImage = botao.closest('.media-group').querySelector('img');
                if (parentImage) {
                    botao.style.display = isHidden ? 'inline-block' : 'none'; // Oculte o botão de download
                }
            });

            toggleButton.innerHTML = isHidden
                ? '<i class="fas fa-eye-slash"></i> Fotos' // Texto para ocultar fotos
                : '<i class="fas fa-eye"></i> Fotos'; // Texto para mostrar fotos
        });

        userInfo.appendChild(toggleButton); // Adiciona o botão à interface
    }
}


    function init() {
        const mediaElements = document.querySelectorAll('.media-group video, .media-group img');
        mediaElements.forEach(media => addLink(media));
        NewBntAndHide();
        ocultarFotosEBotoes();
    }

     // Função para baixar vídeo usando GM.xmlHttpRequest
    function downloadD(videoUrl) {
        GM.xmlHttpRequest({
            method: 'GET',
            url: videoUrl,
            responseType: 'blob',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Referer': 'https://www.erome.com/'
            },
            onload: function (response) {
                if (response.status === 200) {
                    const videoBlob = new Blob([response.response], { type: 'video/mp4' });
                    const downloadUrl = URL.createObjectURL(videoBlob);
                    const downloadLink = document.createElement('a');
                    downloadLink.href = downloadUrl;
                    downloadLink.download = videoUrl.split('/').pop().split('?')[0];
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    URL.revokeObjectURL(downloadUrl);
                    downloadLink.remove();
                    showToast('Download iniciado!');
                } else {
                    showToast('Erro ao baixar o vídeo.', true);
                }
            },
            onerror: function () {
                showToast('Erro ao conectar com o servidor.', true);
            }
        });
    }

    // Adiciona botão de controle de velocidade no player
    function addSpeedButton(playerInstance) {
        const controlBar = playerInstance.getChild('controlBar');
        const speedButton = document.createElement('button');
        speedButton.className = 'vjs-button vjs-speed-button';
        speedButton.innerText = 'Vel: 1x';
        speedButton.style.marginLeft = '10px';

        speedButton.onclick = function () {
            currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
            const newSpeed = speeds[currentSpeedIndex];
            playerInstance.playbackRate(newSpeed);
            speedButton.innerText = `Vel: ${newSpeed}x`;
        };

        controlBar.el().appendChild(speedButton);
    }

    // Adiciona botão de download no player
    function addDownloadButton(playerInstance) {
        const controlBar = playerInstance.getChild('controlBar');
        const videoElement = playerInstance.el().querySelector('video');

        const downloadButton = document.createElement('button');
        downloadButton.className = 'vjs-button vjs-download-button';
        downloadButton.innerText = 'Baixar';
        downloadButton.style.marginLeft = '10px';

        downloadButton.onclick = function () {
            const videoSrc = videoElement?.currentSrc || videoElement?.src;
            if (videoSrc) {
                downloadD(videoSrc);
            } else {
                showToast('Vídeo não encontrado!', true);
            }
        };
        controlBar.el().appendChild(downloadButton);
    }

    // Modifica cada player para adicionar as funcionalidades
    function modifyVideoPlayer(player) {
        const instance = videojs(player);

        instance.ready(function () {
            addSpeedButton(this);
            addDownloadButton(this);
            this.controls(true);
            this.userActive(true);
        });
    }
    // Modo Noite
    let overlay;

    function NewBntAndToggleNight() {
        const nightButton = document.createElement('button');
        nightButton.className = 'btn btn-pink';
        nightButton.style.marginLeft = '1px';
        nightButton.innerHTML = '<i class="fas fa-moon"></i> Modo Noite';

        let nightMode = false;

        nightButton.addEventListener('click', () => {
            nightMode = !nightMode;

            if (nightMode) {
                activateNightMode();
                nightButton.innerHTML = '<i class="fas fa-sun"></i> Modo Dia';
                showToast('Modo Noite Ativado!');
            } else {
                deactivateNightMode();
                nightButton.innerHTML = '<i class="fas fa-moon"></i> Modo Noite';
                showToast('Modo Noite Desativado!');
            }
        });

        const userInfo = document.querySelector('.user-info');
        if (userInfo) userInfo.appendChild(nightButton);
    }

    function activateNightMode() {
        document.body.style.backgroundColor = '#111';
        document.body.style.color = '#fff';

        overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '998';
        overlay.style.pointerEvents = 'none';
        document.body.appendChild(overlay);

        highlightMedia();
    }

    function deactivateNightMode() {
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
            video.style.filter = 'brightness(1)'; // Mantém brilho
            video.parentElement.style.backgroundColor = 'transparent'; // Remove fundo preto

            // Remover controles nativos e garantir o uso do Video.js
            video.removeAttribute('controls');

            const wrapper = video.closest('.video-js');
            if (wrapper) {
                wrapper.style.backgroundColor = 'transparent';
                wrapper.style.zIndex = '9999'; // Garante que o player fique visível
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
                media.removeAttribute('controls'); // Mantém controle apenas via Video.js
                media.style.backgroundColor = '#000000';
            }
        });
    }

    // Encontra todos os players de vídeo e os modifica
    function initializePlayers() {
        const players = document.querySelectorAll('video.vjs-tech');
        if (players.length > 0) {
            players.forEach(player => modifyVideoPlayer(player));
        } else {
            setTimeout(initializePlayers, 1000);
        }
    }

    removerBotoes();
    NewBntAndToggleNight();
    window.addEventListener('load', init);
    window.addEventListener('load', initializePlayers);
    document.addEventListener('DOMContentLoaded', init);
})();
