// ==UserScript==
// @name         Erome Album Downloader
// @version      4.0
// @description  Baixa todas as mídias do Erome.
// @author       Maad
// @match        https://www.erome.com/a/*
// @match        https://*.erome.com/a/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// ==/UserScript==

(function () {
    'use strict';

    let downloadInProgress = false;
    let downloadType = 'all';
    let createZip = true;

    // Toast moderno
    function showToast(message, isError = false) {
        const existingToasts = document.querySelectorAll('.toast');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isError ? '#ff4444' : '#4CAF50'}">
                <path d="${isError ? 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' : 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'}"/>
            </svg>
            <span>${message}</span>
        `;
        toast.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            position: fixed;
            bottom: ${existingToasts.length * 60 + 20}px;
            right: 20px;
            background: #1e1e2d;
            color: #b39ad6;
            padding: 12px 16px;
            border-radius: 8px;
            border-left: 4px solid ${isError ? '#ff4444' : '#4CAF50'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial;
            font-size: 14px;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Coleta URLs (versão melhorada)
    function collectMediaURLs() {
        const urls = new Set();

        // Imagens
        document.querySelectorAll('img.media, .media-group .img, .album-media img').forEach(img => {
            const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-original');
            if (src && !src.includes('thumb') && !src.includes('logo') && !src.includes('avatar')) {
                urls.add(new URL(src, location.href).href);
            }
        });

        // Vídeos
        document.querySelectorAll('video, video source').forEach(video => {
            const src = video.src || video.getAttribute('src') || video.getAttribute('data-src');
            if (src) urls.add(new URL(src, location.href).href);
        });

        return Array.from(urls).filter(url => url.length > 10);
    }

    function isVideo(url) {
        return /\.(mp4|webm|mov|avi|m3u8)/i.test(url);
    }

    function isImage(url) {
        return /\.(jpe?g|png|gif|webp|bmp)/i.test(url);
    }

    function getFilteredMediaLinks() {
        const allUrls = collectMediaURLs();
        console.log(`📷 Encontradas ${allUrls.length} mídias no total`);

        const filtered = allUrls.filter(url => {
            if (downloadType === 'all') return true;
            if (downloadType === 'photos') return isImage(url);
            if (downloadType === 'videos') return isVideo(url);
            return false;
        });

        console.log(`🎯 Filtradas ${filtered.length} mídias para download`);
        return filtered;
    }

    function getPageTitle() {
        const titleEl = document.querySelector('h1, .album-title, [class*="title"], title');
        let title = 'Erome_Album';
        if (titleEl) {
            title = titleEl.textContent.trim()
                .replace(/[<>:"/\\|?*]/g, '_')
                .replace(/\s+/g, '_')
                .substring(0, 40);
        }
        return title || 'Erome_Download';
    }

    function generateZipFileName() {
        const title = getPageTitle();
        const now = new Date();
        const dateStr = now.toISOString()
            .replace(/[:.]/g, '-')
            .replace('T', '_')
            .substring(0, 16);
        return `Maad_${dateStr}_${title}.zip`;
    }

    function filenameFromUrl(url, idx) {
        try {
            const urlObj = new URL(url);
            let name = urlObj.pathname.split('/').pop() || `file_${idx}`;
            name = name.split('?')[0].split('#')[0];

            // Garante extensão
            if (!name.includes('.')) {
                if (isImage(url)) name += '.jpg';
                else if (isVideo(url)) name += '.mp4';
            }

            return `${String(idx).padStart(3, '0')}_${name}`;
        } catch (e) {
            return `${String(idx).padStart(3, '0')}_file`;
        }
    }

    // Download com GM_xmlhttpRequest (CORRETO)
    function fetchBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': window.location.href,
                    'Accept': '*/*'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.response);
                    } else {
                        reject(`HTTP ${response.status}`);
                    }
                },
                onerror: reject,
                ontimeout: () => reject('Timeout'),
                timeout: 30000
            });
        });
    }

    // Função principal CORRIGIDA
    async function startDownload() {
        if (downloadInProgress) {
            showToast('Download já em andamento!', true);
            return;
        }

        const urls = getFilteredMediaLinks();
        if (urls.length === 0) {
            showToast('Nenhuma mídia encontrada!', true);
            return;
        }

        downloadInProgress = true;
        const downloadButton = document.getElementById('startDownloadBtn');
        const progressBar = document.getElementById('downloadProgress');
        const progressText = document.getElementById('downloadProgressText');

        downloadButton.disabled = true;
        downloadButton.textContent = 'Baixando...';
        progressBar.value = 0;
        progressText.textContent = `0/${urls.length} itens`;

        console.log(`🚀 INICIANDO: ${urls.length} arquivos | ZIP: ${createZip}`);

        try {
            if (createZip) {
                await downloadWithZip(urls, progressBar, progressText);
            } else {
                await downloadIndividual(urls, progressBar, progressText);
            }
        } catch (error) {
            console.error('❌ ERRO CRÍTICO:', error);
            showToast('❌ Erro no download!', true);
        } finally {
            downloadInProgress = false;
            downloadButton.disabled = false;
            downloadButton.textContent = 'Download';
            progressText.textContent = 'Concluído!';
            setTimeout(() => {
                progressBar.value = 0;
                progressText.textContent = '0/0 itens';
            }, 2000);
        }
    }

    // Download com ZIP (USANDO ARRAYBUFFER - CORRETO)
    async function downloadWithZip(urls, progressBar, progressText) {
        const zip = new JSZip();
        const zipName = generateZipFileName();
        let successCount = 0;

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const filename = filenameFromUrl(url, i + 1);

            progressText.textContent = `📥 ${i + 1}/${urls.length}: ${filename.substring(0, 20)}...`;
            progressBar.value = (i / urls.length) * 100;

            try {
                const blob = await fetchBlob(url);
                // CONVERSÃO CORRETA PARA ARRAYBUFFER
                const arrayBuffer = await blob.arrayBuffer();
                zip.file(filename, arrayBuffer);
                successCount++;
                console.log(`✅ ${filename} (${blob.size} bytes)`);
            } catch (error) {
                console.error(`❌ ${filename}:`, error);
                zip.file(`ERRO_${String(i + 1).padStart(3, '0')}.txt`, `URL: ${url}\nErro: ${error}`);
            }
        }

        progressText.textContent = 'Gerando ZIP...';
        console.log(` ${successCount}/${urls.length} arquivos prontos para ZIP`);

        const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        }, (metadata) => {
            progressText.textContent = `Compactando: ${Math.round(metadata.percent)}%`;
        });

        progressText.textContent = 'Salvando...';
        saveAs(zipBlob, zipName);
        showToast(`ZIP criado: ${successCount}/${urls.length} arquivos`);
        console.log(` ZIP SALVO: ${zipName}`);
    }

    // Download individual
    async function downloadIndividual(urls, progressBar, progressText) {
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const filename = filenameFromUrl(url, i + 1);

            progressText.textContent = `📥 ${i + 1}/${urls.length}: ${filename}`;
            progressBar.value = (i / urls.length) * 100;

            try {
                const blob = await fetchBlob(url);
                const downloadUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = filename;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(downloadUrl);

                console.log(`✅ ${filename} baixado`);
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`❌ Falha: ${filename}`, error);
            }
        }
        showToast(`Downloads concluídos: ${urls.length} arquivos`);
    }

    // Interface moderna
    function createDownloadPopout() {
        const existing = document.getElementById('downloadPopout');
        if (existing) existing.remove();

        const popout = document.createElement('div');
        popout.id = 'downloadPopout';
        popout.innerHTML = `
            <div class="popout-overlay"></div>
            <div class="popout-content">
                <div class="popout-header">
                    <h3>Download do Álbum</h3>
                    <button class="close-btn">×</button>
                </div>
                <div class="popout-body">
                    <div class="option-group">
                        <div class="option-title"Tipo de mídia:</div>
                        <label class="option-label">
                            <input type="radio" name="downloadType" value="all" checked>
                            <span class="radio-custom"></span>
                            Todos os arquivos
                        </label>
                        <label class="option-label">
                            <input type="radio" name="downloadType" value="photos">
                            <span class="radio-custom"></span>
                            Apenas fotos
                        </label>
                        <label class="option-label">
                            <input type="radio" name="downloadType" value="videos">
                            <span class="radio-custom"></span>
                            Apenas vídeos
                        </label>
                    </div>

                    <div class="option-group">
                        <label class="option-label checkbox-label">
                            <input type="checkbox" id="zipCheckbox" checked>
                            <span class="checkbox-custom"></span>
                            Baixar como ZIP
                        </label>
                        <div class="zip-preview" id="zipPreview"></div>
                    </div>

                    <button class="download-btn" id="startDownloadBtn">
                        Iniciar Download
                    </button>

                    <div class="progress-section">
                        <progress id="downloadProgress" value="0" max="100"></progress>
                        <div class="progress-text" id="downloadProgressText">0/0 itens</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(popout);
        applyStyles();
        setupEventListeners();
        updateZipPreview();
    }

    function applyStyles() {
        const styles = `
            #downloadPopout {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                z-index: 10000; display: flex; justify-content: center; align-items: center;
                font-family: 'Segoe UI', Arial, sans-serif;
            }
            .popout-overlay {
                position: absolute; width: 100%; height: 100%;
                background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);
            }
            .popout-content {
                position: relative; background: #1e1e2d; border-radius: 12px;
                width: 400px; max-width: 90vw; z-index: 10001;
                border: 1px solid #2d2d3d; box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                overflow: hidden;
            }
            .popout-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 20px; background: #14151f; border-bottom: 1px solid #2d2d3d;
            }
            .popout-header h3 {
                margin: 0; color: #b39ad6; font-size: 18px; font-weight: 600;
            }
            .close-btn {
                background: none; border: none; color: #b39ad6; font-size: 24px;
                cursor: pointer; width: 30px; height: 30px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                transition: background 0.3s;
            }
            .close-btn:hover { background: #2d2d3d; }
            .popout-body { padding: 20px; }
            .option-group { margin-bottom: 20px; }
            .option-title {
                color: #b39ad6; font-weight: 600; margin-bottom: 10px;
                font-size: 14px;
            }
            .option-label {
                display: flex; align-items: center; gap: 10px;
                color: #e0e0e0; cursor: pointer; padding: 8px 0;
                transition: color 0.3s;
            }
            .option-label:hover { color: #b39ad6; }
            .option-label input { display: none; }
            .radio-custom, .checkbox-custom {
                width: 18px; height: 18px; border: 2px solid #555;
                border-radius: 50%; position: relative;
                transition: all 0.3s;
            }
            .checkbox-custom { border-radius: 4px; }
            .option-label input:checked + .radio-custom {
                border-color: #8a5acc; background: #8a5acc;
            }
            .option-label input:checked + .radio-custom::after {
                content: ''; position: absolute; top: 4px; left: 4px;
                width: 6px; height: 6px; background: white; border-radius: 50%;
            }
            .option-label input:checked + .checkbox-custom {
                border-color: #8a5acc; background: #8a5acc;
            }
            .option-label input:checked + .checkbox-custom::after {
                content: '✓'; position: absolute; top: -1px; left: 2px;
                color: white; font-size: 12px; font-weight: bold;
            }
            .zip-preview {
                font-size: 11px; color: #888; margin-top: 5px;
                padding: 5px; background: #2d2d3d; border-radius: 4px;
                word-break: break-all;
            }
            .download-btn {
                width: 100%; padding: 12px; background: linear-gradient(135deg, #8a5acc, #b39ad6);
                color: white; border: none; border-radius: 8px; font-size: 16px;
                font-weight: 600; cursor: pointer; transition: all 0.3s;
                margin-bottom: 15px;
            }
            .download-btn:hover:not(:disabled) {
                transform: translateY(-2px); box-shadow: 0 5px 15px rgba(138, 90, 204, 0.4);
            }
            .download-btn:disabled {
                background: #555; cursor: not-allowed; transform: none; opacity: 0.6;
            }
            .progress-section {
                text-align: center; background: #2d2d3d; padding: 15px;
                border-radius: 8px; margin-top: 10px;
            }
            #downloadProgress {
                width: 100%; height: 6px; border-radius: 3px; margin-bottom: 8px;
            }
            #downloadProgress::-webkit-progress-bar { background: #444; border-radius: 3px; }
            #downloadProgress::-webkit-progress-value {
                background: linear-gradient(135deg, #8a5acc, #b39ad6); border-radius: 3px;
            }
            .progress-text {
                color: #b39ad6; font-size: 12px; font-weight: 500;
            }
        `;

        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }

    function setupEventListeners() {
        const popout = document.getElementById('downloadPopout');

        popout.querySelector('.close-btn').onclick = () => popout.remove();
        popout.querySelector('.popout-overlay').onclick = () => popout.remove();

        document.getElementById('startDownloadBtn').onclick = startDownload;

        popout.querySelectorAll('input[name="downloadType"]').forEach(radio => {
            radio.onchange = (e) => {
                downloadType = e.target.value;
                updateZipPreview();
            };
        });

        document.getElementById('zipCheckbox').onchange = (e) => {
            createZip = e.target.checked;
            updateZipPreview();
        };
    }

    function updateZipPreview() {
        const preview = document.getElementById('zipPreview');
        if (preview) {
            const title = getPageTitle();
            const dateStr = new Date().toISOString()
                .replace(/[:.]/g, '-')
                .replace('T', '_')
                .substring(0, 16);
            preview.textContent = `Maad_${dateStr}_${title}.zip`;
        }
    }


    // Botão principal (estilo antigo)
    const downloadButton = document.createElement('button');
    downloadButton.className = 'btn btn-grey';
    downloadButton.innerHTML = `<i class="fas fa-download fa-lg"></i>`;
    downloadButton.style.marginLeft = '2px';
    downloadButton.onclick = createDownloadPopout;
    downloadButton.setAttribute('data-toggle', 'tooltip');
    downloadButton.setAttribute('data-placement', 'top');
    downloadButton.setAttribute('title', 'Baixar mídias');

    // Inicializar tooltips se jQuery estiver disponível
    if (typeof $ !== 'undefined') {
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    }

    const userInfoDiv = document.querySelector('.user-info.text-right');
    if (userInfoDiv) userInfoDiv.appendChild(downloadButton);

})();
