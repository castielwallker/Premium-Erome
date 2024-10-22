// ==UserScript==
// @name         Erome Album Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Baixa imagens e vídeos do Erome.
// @author       Maad
// @match        https://www.erome.com/a/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Função para obter o nome do arquivo sem parâmetros de URL
    function getFileName(url) {
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1].split('?')[0].split('_v=')[0]; // Remove a parte "_v=...".
        return filename;
    }

    function download(url) {

        if (url.includes('logo-erome-horizontal.png')) {
            
        }

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
                } else if (response.status === 403) {
                    
                } else {
                    
                }
            },
            onerror: function (err) {
               
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
            return;
        }

        mediaLinks.forEach(media => {
            download(media); 
            showtoast(Teste);
        });
    };
  
    const existingButton = document.querySelector('.album-flag');
    if (existingButton) {
        existingButton.remove();
    }

    const downloadButton = document.createElement('button');
    downloadButton.className = 'btn btn-grey';
    downloadButton.innerHTML = `
        <i class="fas fa-download fa-lg"></i>
    `;
    downloadButton.style.marginLeft = '2px'; 
    downloadButton.onclick = () => {
        downloadAllMedia(); 
    };

    const userInfoDiv = document.querySelector('.user-info.text-right');
    if (userInfoDiv) {
        userInfoDiv.appendChild(downloadButton);
    }
})();
