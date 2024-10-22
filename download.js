// ==UserScript==
// @name         Erome Album Downloader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Baixa imagens e vídeos do Erome, ignorando o logo, com notificações de download.
// @author       Maad
// @match        https://www.erome.com/a/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    const LOGOS_TO_IGNORE = [
        'logo-erome-horizontal.png',
        'logo-erome.png'
    ];

    function getFileName(url) {
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1].split('?')[0].split('_v=')[0];
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.padding = '10px 20px';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toast.style.color = '#fff';
        toast.style.borderRadius = '5px';
        toast.style.fontSize = '14px';
        toast.style.zIndex = '9999';
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000); // Remove o toast após 3 segundos
    }

    function download(url) {
        if (LOGOS_TO_IGNORE.some(logo => url.includes(logo))) {
            console.warn(`Ignorando logo: ${url}`);
            return;
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
                    showToast(`Download concluído: ${getFileName(url)}`);
                } else {
                    console.error(`Erro ao baixar: ${url} (Status: ${response.status})`);
                    showToast(`Erro ao baixar: ${getFileName(url)}`);
                }
            },
            onerror: function (err) {
                console.error(`Erro de rede: ${url}`, err);
                showToast(`Erro de rede: ${getFileName(url)}`);
            }
        });
    }

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

    const downloadAllMedia = () => {
        const mediaLinks = getMediaLinks();
        if (mediaLinks.length === 0) {
            console.error('Nenhuma mídia encontrada para download.');
            showToast('Nenhuma mídia encontrada.');
            return;
        }

        mediaLinks.forEach(media => {
            download(media);
        });
    };

    const existingButton = document.querySelector('.album-flag');
    if (existingButton) {
        existingButton.remove();
    }

    const downloadButton = document.createElement('button');
    downloadButton.className = 'btn btn-grey';
    downloadButton.innerHTML = `<i class="fas fa-download fa-lg"></i>`;
    downloadButton.style.marginLeft = '2px';
    downloadButton.onclick = downloadAllMedia;

    const userInfoDiv = document.querySelector('.user-info.text-right');
    if (userInfoDiv) {
        userInfoDiv.appendChild(downloadButton);
    }
})();
