// ==UserScript==
// @name         Erome Video Hidden
// @namespace    https://github.com/maadvfx/
// @icon         https://www.erome.com/favicon.ico
// @version      1.4
// @description  Slider Button Video Hidden.
// @author       Maad
// @match        https://www.erome.com/a/*
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(function () {
    // Adiciona estilo CSS ao documento
    const style = document.createElement('style');
    style.textContent = `
        body {
            font-family: 'Arial', sans-serif;
            position: relative;
        }

        .btn-sec {
            position: fixed; /* Muda para fixed */
            bottom: 20px; /* Posiciona mais para baixo */
            left: 20px;
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
            color: #FFF; /* Define a cor do texto como branco */
        }

        .btn-sec:hover {
            width: 100px;
            border-radius: 40px;
            background-color: rgb(235, 99, 149);
        }

        .video {
            transition: transform 0.3s, opacity 0.3s;
        }

        .video.hidden {
            display: none;
            opacity: 0;
        }

        .video:not(.hidden) {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    const createSliderButton = function () {
        const button = document.createElement('button');
        button.className = 'btn-sec';
        button.setAttribute('data-count', '0'); // Atributo para o contador começando em 0

        button.innerHTML = ` 
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_iconCarrier">
                    <g id="Interface / Slider_01">
                        <path id="Vector" d="M14 15H21M3 15H5M5 15C5 16.3807 6.11929 17.5 7.5 17.5C8.88071 17.5 10 16.3807 10 15C10 13.6193 8.88071 12.5 7.5 12.5C6.11929 12.5 5 13.6193 5 15ZM20 9H21M3 9H10M16.5 11.5C15.1193 11.5 14 10.3807 14 9C14 7.61929 15.1193 6.5 16.5 6.5C17.8807 6.5 19 7.61929 19 9C19 10.3807 17.8807 11.5 16.5 11.5Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </g>
                </g>
            </svg>
        `;

        button.addEventListener('mouseenter', () => {
            let count = parseInt(button.getAttribute('data-count'));
            button.textContent = count < 100 ? (count > 0 ? `${count} Seg` : 'OFF') : 'OFF';
        });

        button.addEventListener('mouseleave', () => {
            button.innerHTML = ` 
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_iconCarrier">
                        <g id="Interface / Slider_01">
                            <path id="Vector" d="M14 15H21M3 15H5M5 15C5 16.3807 6.11929 17.5 7.5 17.5C8.88071 17.5 10 16.3807 10 15C10 13.6193 8.88071 12.5 7.5 12.5C6.11929 12.5 5 13.6193 5 15ZM20 9H21M3 9H10M16.5 11.5C15.1193 11.5 14 10.3807 14 9C14 7.61929 15.1193 6.5 16.5 6.5C17.8807 6.5 19 7.61929 19 9C19 10.3807 17.8807 11.5 16.5 11.5Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </g>
                    </g>
                </svg>
            `;
        });

        button.addEventListener('click', () => {
            let count = parseInt(button.getAttribute('data-count'));
            if (count < 100) {
                count += 5; // Incrementa o contador
                button.setAttribute('data-count', count);
                button.textContent = count > 0 ? `${count} Seg` : 'OFF';
            }
            if (count >= 100) {
                count = 0; // Reseta para 0 ao atingir 100
                button.setAttribute('data-count', count);
                button.textContent = 'OFF'; // Exibe OFF
            }

            // Ocultar vídeos baseados no contador
            document.querySelectorAll('.video').forEach((vc) => {
                const video = vc.querySelector('.video-js video');
                if (video && 'length' in video.dataset) {
                    const videoLength = parseInt(video.dataset.length);
                    if (videoLength < count) {
                        vc.classList.add('hidden');
                    } else {
                        vc.classList.remove('hidden');
                    }
                } else {
                    vc.classList.remove('hidden');
                }
            });
        });

        // Oculta o botão do slider inicialmente
        button.style.display = 'none'; 

        document.body.appendChild(button);
    };

    const createToggleSliderButton = function () {
        const navRight = document.querySelector('.navbar-nav.navbar-right');
        const li = document.createElement('li');
        const toggleButton = document.createElement('a');
        toggleButton.href = '#';
        toggleButton.innerHTML = '<i class="fa fa-eye"></i>HIDDEN';

        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            const sliderButton = document.querySelector('.btn-sec');
            if (sliderButton.style.display === 'none') {
                sliderButton.style.display = 'flex'; // Mostra o botão do slider
                toggleButton.innerHTML = '<i class="fa fa-eye-slash"></i> HIDDEN'; // Troca o texto
            } else {
                sliderButton.style.display = 'none'; // Oculta o botão do slider
                toggleButton.innerHTML = '<i class="fa fa-eye"></i> HIDDEN'; // Troca o texto
            }
        });

        li.appendChild(toggleButton);
        navRight.appendChild(li);
    };

    if (window.location.href.match(/https:\/\/www\.erome\.com\/a\//)) {
        createSliderButton();
        createToggleSliderButton(); // Adiciona o botão de ocultar/exibir o slider

        // Carrega a duração dos vídeos
        const videoSources = document.querySelectorAll('.video-js video source');
        videoSources.forEach(source => {
            const url = source.src;
            GM.xmlHttpRequest({
                url,
                method: 'GET',
                headers: {
                    Accept: 'video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5',
                    Referer: 'https://www.erome.com/',
                    Range: 'bytes=0-140',
                },
                responseType: 'blob',
                onload(response) {
                    const m = response.responseText.match(/\x03.*\xe8/);
                    if (m) {
                        const i = response.responseText.indexOf(m[0]) + m[0].length;
                        const s = response.responseText.substring(i, i + 4);
                        const ms = Array.from(s)
                            .map((c) => c.charCodeAt(0))
                            .map((value, index, values) => value * Math.pow(256, values.length - index - 1))
                            .reduce((a, b) => a + b);
                        const video = source.parentNode;
                        video.dataset.length = Math.floor(ms / 1000); // Armazena a duração em segundos
                    }
                },
            });
        });
    }
})();
