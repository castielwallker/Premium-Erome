// ==UserScript==
// @name         Erome Album Downloader
// @version      1.6
// @description  Baixa imagens e vídeos do Erome.
// @author       Maad
// @match        https://www.erome.com/a/*
// @match        https://*.erome.com/a/*
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
		    showtoast('Download Concluido.')
                } else {
		    showtoast('Erro Ao Baixar')
                    console.error(`Erro ao baixar: ${url} (Status: ${response.status})`);
                }
            },
            onerror: function (err) {
                console.error(`Erro de rede: ${url}`, err);
            }
        });
    }

    const getMediaLinks = () => {
        const mediaElements = document.querySelectorAll('video, .media-group .img');
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
            console.error('Nenhuma mídia encontrada.');
	    showtoast('Nenhuma mídia encontrada.')
            return;
        }

        mediaLinks.forEach(media => download(media));
    };

    const downloadMediaDirectly = () => {
        const mediaLinks = getMediaLinks();
        const downloadedUrls = new Set();

        if (mediaLinks.length === 0) {
            console.error('Nenhuma mídia encontrada.');
	    showtoast('Nenhuma mídia encontrada.')
            return;
        }

        mediaLinks.forEach(url => {
            if (!downloadedUrls.has(url)) {
                downloadedUrls.add(url);
                setTimeout(() => download(url), 1000);
            }
        });
    };

    const downloadButton = document.createElement('button');
    downloadButton.className = 'btn btn-grey';
    downloadButton.innerHTML = `<i class="fas fa-download fa-lg"></i>`;
    downloadButton.style.marginLeft = '2px';
    downloadButton.onclick = downloadMediaDirectly; 
    downloadButton.setAttribute('data-toggle', 'tooltip');
    downloadButton.setAttribute('data-placement', 'top');
    downloadButton.setAttribute('title', 'Baixar tudo.');

    $(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip(); 
    });

    const userInfoDiv = document.querySelector('.user-info.text-right');
    if (userInfoDiv) userInfoDiv.appendChild(downloadButton);

})();
