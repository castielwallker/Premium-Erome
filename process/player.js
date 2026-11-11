// ==UserScript==
// @name         Player Premium Erome - By Maad
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Personaliza todos os players do site Erome com controles de velocidade, download, miniatura e modo Cinema.
// @author       Maad
// @icon         https://www.erome.com/favicon-32x32.png
// @match        https://www.erome.com/a/*
// @require      https://github.com/castielwallker/Premium-Erome/raw/refs/heads/main/nsfw.js
// @require      https://vjs.zencdn.net/7.10.2/video.min.js
// @resource     videojs https://vjs.zencdn.net/7.10.2/video-js.css
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Adiciona CSS customizado
    GM_addStyle(`
        .video-js {
            display: block;
            vertical-align: top;
            box-sizing: border-box;
            font-size: 10px;
            line-height: 1;
            font-weight: 400;
            font-family: Arial, Helvetica, sans-serif;
            word-break: initial;
            z-index: 999; /* Z-index do player */
            position: relative; /* Para garantir que o z-index funcione corretamente */
        }
        .video-js.vjs-16-9 {
            padding-top: 56.25%;
        }
        .video-js.vjs-16-9, .video-js.vjs-4-3, .video-js.vjs-fluid {
            width: 100%;
            max-width: 100%;
            height: 0;
        }
        .video-js[tabindex="-1"] {
            outline: 0;
        }
        .vjs-control {
            border-radius: 5px;
            padding: 5px;
            margin: 2px;
        }
        .vjs-control:hover {
            background: rgba(235, 99, 149, 0.8); /* Cor ao passar o mouse */
        }
        button {
            cursor: pointer;
            color: #fff;
            background: #eb6395; /* Cor dos botões */
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            margin: 0 5px;
            display: flex; /* Para centralizar o SVG */
            align-items: center; /* Centraliza o conteúdo */
            justify-content: center; /* Centraliza horizontalmente */
        }
        button:hover {
            background: #d45379; /* Cor dos botões ao passar o mouse */
        }
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 998; /* Z-index da sobreposição */
            display: none; /* Inicialmente escondida */
            pointer-events: auto; /* Permite interação */
        }
        .svg-icon {
            width: 25px; /* Define uma largura fixa para o SVG */
            height: 25px; /* Define uma altura fixa para o SVG */
            margin-right: 5px; /* Espaço entre o SVG e o texto */
        }
    `);

    // Função para download do vídeo
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


    function addCustomControls(player) {

        // Botão de inverter o vídeo
        const flipButton = document.createElement('button');
        flipButton.innerHTML = `
  <svg width="17px" height="17px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path d="M7 16V0H9V16H7Z" fill="#ffffff"></path>
      <path d="M15 12H14L10 8L14 4H15L15 12Z" fill="#ffffff"></path>
      <path d="M2 12H1L1 4H2L6 8L2 12Z" fill="#ffffff"></path>
    </g>
  </svg>
`;

        let isFlipped = false;

        flipButton.onclick = function () {
            const videoElement = player.el().querySelector('video');
            isFlipped = !isFlipped;
            videoElement.style.transform = isFlipped ? 'scaleX(-1)' : 'scaleX(1)';
            showToast('O video foi invertido.');
        };

      // Toast Mensagem
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


        // Controle de velocidade
        const speedButton = document.createElement('button');
        speedButton.innerText = '1x'; // Começa com 1x
        let speeds = [0.5, 1, 2, 3, 4, 5];
        let currentSpeedIndex = 1; // Índice inicial para 1x

        speedButton.onclick = function() {
            currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length; // Alterna o índice
            player.playbackRate(speeds[currentSpeedIndex]);
            speedButton.innerText = `${speeds[currentSpeedIndex]}x`; // Atualiza o texto do botão
            showToast('Velocidade do video foi alterada.');
        };

        //Botão de download
        const downloadButton = document.createElement('button');
        downloadButton.innerHTML = `
    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <path d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z" fill="#ffffff"></path>
            <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="#ffffff"></path>
        </g>
    </svg>
`;
        downloadButton.onclick = function() {
            const videoSrc = player.currentSrc();
            downloadD(videoSrc);
        };

        //Botão de miniatura (Picture-in-Picture)
        const pipButton = document.createElement('button');
        pipButton.innerHTML = `
     <svg fill="#ffffff" width="23px" height="23px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <path d="M216,44H40A20.02229,20.02229,0,0,0,20,64V192a20.02229,20.02229,0,0,0,20,20H216a20.02229,20.02229,0,0,0,20-20V64A20.02229,20.02229,0,0,0,216,44ZM44,68H212v48H144a20.02229,20.02229,0,0,0-20,20v52H44ZM148,188V140h64v48Z"></path>
        </g>
    </svg>
`;
        pipButton.onclick = async function() {
            const videoElement = player.el().querySelector('video');
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
                showToast('PiP Desativado.');
            } else {
                await videoElement.requestPictureInPicture();
                showToast('PiP Ativado.');
            }
        };

        // Botão Cinema
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
        const cinemaButton = document.createElement('button');
        cinemaButton.innerHTML = `
    <svg fill="#ffffff" height="17px" width="17px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" stroke="#ffffff">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <g>
                <g>
                    <path d="M504.929,323.637c-6.955-6.953-17.436-8.995-26.489-5.16c-26.922,11.403-55.471,17.185-84.859,17.185
                    c-58.032,0-112.586-22.597-153.618-63.63c-62.92-62.918-81.149-156.525-46.442-238.474c3.835-9.057,1.793-19.534-5.162-26.487
                    c-6.953-6.955-17.434-8.992-26.487-5.157c-31.495,13.343-59.788,32.433-84.093,56.74C27.616,108.815-0.006,175.506,0,246.443
                    c0.006,70.927,27.63,137.61,77.785,187.767C127.948,484.374,194.643,512,265.58,512c70.926,0,137.61-27.622,187.767-77.779
                    c24.308-24.308,43.397-52.6,56.74-84.093C513.923,341.071,511.883,330.593,504.929,323.637z"></path>
                </g>
            </g>
        </g>
    </svg>
`;
        cinemaButton.onclick = function() {
            const isActive = overlay.style.display === 'block';
            overlay.style.display = isActive ? 'none' : 'block'; // Alterna a visibilidade da sobreposição
            document.body.style.backgroundColor = isActive ? '' : '#111';
            document.body.style.color = isActive ? '' : '#fff';
            if (!isActive) {
                showToast('Modo Cinema ativado.');
                const videos = document.querySelectorAll('.media-group video');
                videos.forEach(video => {
                    video.style.filter = 'brightness(1)';
                    video.parentElement.style.backgroundColor = 'transparent';
                    video.removeAttribute('controls');
                });
            } else {
                resetMedia();
                showToast('Modo Cinema desativado.');
            }
        };

        // Adiciona os controles ao player
        const controlBar = player.controlBar.el();
        controlBar.appendChild(speedButton);
        controlBar.appendChild(downloadButton);
        controlBar.appendChild(flipButton);
        controlBar.appendChild(cinemaButton);
        controlBar.appendChild(pipButton);
    }

    // Resetar Mídia (se necessário)
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

    // Inicializa todos os players Video.js e adiciona os controles
    const videojsPlayers = document.querySelectorAll('.video-js');
     videojsPlayers.forEach(playerElement => {
        const videojsPlayer = videojs(playerElement);
        videojsPlayer.ready(function() {
            addCustomControls(videojsPlayer);
        });
    });
})();
