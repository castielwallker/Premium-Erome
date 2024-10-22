// ==UserScript==
// @name         Erome Album Downloader
// @version      1.6
// @description  Baixa imagens e vídeos do Erome.
// @author       Maad
// @match        https://www.erome.com/a/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    const LOGOS_AND_THUMBS_TO_IGNORE = [
        'logo-erome-horizontal.png',
        'logo-erome.png',
        'AMgAAAAASUVORK5CYII=',
        'thumbs'
    ];

    function getFileName(url) {
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1].split('?')[0].split('_v=')[0];
    }

    function download(url) {
        const isIgnored = LOGOS_AND_THUMBS_TO_IGNORE.some(fragment => url.includes(fragment));
        if (isIgnored) {
            console.warn(`Ignorando mídia: ${url}`);
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
                } else {
                    //console.error(`Erro ao baixar: ${url} (Status: ${response.status})`);
                }
            },
            onerror: function (err) {
                //console.error(`Erro de rede: ${url}`, err);
            }
        });
    }

    const getMediaLinks = () => {
        const mediaElements = document.querySelectorAll('video, img');
        const mediaLinks = new Set();

        mediaElements.forEach(element => {
            if (element.classList.contains('album-thumbnail')) return;

            let url = element.tagName === 'VIDEO' ? element.src || element.querySelector('source')?.src
                                                  : element.src || element.getAttribute('data-src');
            if (url) mediaLinks.add(url);
        });

        return Array.from(mediaLinks);
    };

    const downloadAllMedia = () => {
        const mediaLinks = getMediaLinks();
        if (mediaLinks.length === 0) {
            //console.error('Nenhuma mídia encontrada.');
            return;
        }

        mediaLinks.forEach(media => download(media));
    };

    function scrollToEndPage(callback) {
        const interval = setInterval(() => {
            const scrollTop = window.scrollY;
            const scrollHeight = document.body.scrollHeight;
            const clientHeight = window.innerHeight;

            if (scrollTop + clientHeight >= scrollHeight - 10) {
                clearInterval(interval);
                callback();
            } else {
                window.scrollBy(0, 9999);
            }
        }, 200); 
    }

    const downloadButton = document.createElement('button');
    downloadButton.className = 'btn btn-grey';
    downloadButton.innerHTML = `<i class="fas fa-download fa-lg"></i>`;
    downloadButton.style.marginLeft = '2px';
    downloadButton.onclick = () => {
        scrollToEndPage(downloadAllMedia);
    };

    const userInfoDiv = document.querySelector('.user-info.text-right');
    if (userInfoDiv) userInfoDiv.appendChild(downloadButton);
})();
