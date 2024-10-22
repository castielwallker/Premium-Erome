// ==UserScript==
// @name         Erome Album Downloader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Baixa imagens e vídeos do Erome, ignorando o logo.
// @author       Maad
// @match        https://www.erome.com/a/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    // Lista de URLs de logotipos a serem ignoradas
    const LOGOS_TO_IGNORE = [
        'logo-erome-horizontal.png',
        'logo-erome.png' // Caso existam outras variantes.
    ];

    // Função para obter o nome do arquivo sem parâmetros de URL
    function getFileName(url) {
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1].split('?')[0].split('_v=')[0];
        return filename;
    }

    // Função de download
    function download(url) {
        // Verifica se a URL contém alguma das logos a serem ignoradas
        if (LOGOS_TO_IGNORE.some(logo => url.includes(logo))) {
            console.warn(`Ignorando logo: ${url}`);
            return; // Não faz download se for logo
        }

        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
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
                } else {
                    console.error(`Erro ao baixar: ${url} (Status: ${response.status})`);
                }
            },
            onerror: function (err) {
                console.error(`Erro de rede: ${url}`, err);
            }
        });
    }

    // Função para capturar links de mídia (imagens e vídeos)
    const getMediaLinks = () => {
        const mediaElements = document.querySelectorAll('video, img');
        const mediaLinks = new Set();

        mediaElements.forEach(element => {
            let url;
            if (element.tagName === 'VIDEO') {
                url = element.src || element.querySelector('source')?.src;
            } else if (element.tagName === 'IMG') {
                url = element.src || element.getAttribute('data-src');
            }
            if (url) {
                mediaLinks.add(url);
            }
        });

        return Array.from(mediaLinks);
    };

    // Função para baixar todas as mídias encontradas
    const downloadAllMedia = () => {
        const mediaLinks = getMediaLinks();
        if (mediaLinks.length === 0) {
            console.error('Nenhuma mídia encontrada para download.');
            return;
        }

        mediaLinks.forEach(media => {
            download(media);
        });
    };

    // Remove botão duplicado, se existir
    const existingButton = document.querySelector('.album-flag');
    if (existingButton) {
        existingButton.remove();
    }

    // Cria o botão de download
    const downloadButton = document.createElement('button');
    downloadButton.className = 'btn btn-grey';
    downloadButton.innerHTML = `<i class="fas fa-download fa-lg"></i>`;
    downloadButton.style.marginLeft = '2px';
    downloadButton.onclick = downloadAllMedia;

    // Adiciona o botão na interface
    const userInfoDiv = document.querySelector('.user-info.text-right');
    if (userInfoDiv) {
        userInfoDiv.appendChild(downloadButton);
    }
})();
