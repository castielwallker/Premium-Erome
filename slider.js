// ==UserScript==
// @name         Erome Slider Premium
// @namespace    https://github.com/maadvfx/
// @icon         https://www.erome.com/favicon.ico
// @version      1.0
// @description  Download videos e images de erome com controle de botões.
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
        }

        #slider-container {
            position: fixed;
            right: 20px;
            top: 150px;
            background: linear-gradient(145deg, #db467e, #ff98be);
            padding: 15px;
            border-radius: 10px;
            box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.1), 0px -2px 50px rgba(255, 255, 255, 0.8);
            z-index: 1000;
            animation: slideIn 0.5s ease;
            width: 200px;
            display: none; /* Começa escondido */
        }

        @keyframes slideIn {
            from {
                transform: translateX(50px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        #slider_min_length {
            width: 100%;
            margin-top: 10px;
            border-radius: 5px;
            background: #fff;
            height: 6px;
            -webkit-appearance: none;
            outline: none;
        }

        #slider_min_length::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #ececec;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: background 0.3s;
        }

        #slider_min_length::-webkit-slider-thumb:hover {
            background: #db467e;
        }

        #slider_min_length_output {
            display: block;
            font-size: 12px;
            color: #FFF;
            transition: color 0.3s;
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

    const onLength = function (milliseconds, video) {
        let s = milliseconds / 1000;
        const h = Math.floor(s / 3600);
        s -= h * 3600;
        const m = Math.floor(s / 60);
        s = Math.floor(s - m * 60);

        if (video && video.dataset) {
            s = parseInt(milliseconds / 1000);
            video.dataset.length = s;
            const slider = document.getElementById('slider_min_length');
            if (slider) {
                slider.max = Math.max(slider.max, s);
            }
        }
    };

    const videoLength = function (url, video) {
        const xmlHttpRequest = GM.xmlHttpRequest({
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
                    onLength(ms, video);
                }
            },
        });
    };

    const showSlider = function () {
        const div = document.createElement('div');
        div.setAttribute('id', 'slider-container');
        div.style.color = '#FFFFFF';

        const output = div.appendChild(document.createElement('output'));
        output.setAttribute('id', 'slider_min_length_output');
        output.textContent = 'SEG: OFF';
        output.style.marginTop = '0px';
        output.style.transform = 'translateY(-4px)';

        const slider = div.appendChild(document.createElement('input'));
        slider.setAttribute('id', 'slider_min_length');
        slider.setAttribute('type', 'range');
        slider.setAttribute('min', '0');
        slider.setAttribute('max', '60');
        slider.setAttribute('step', '5');
        slider.setAttribute('value', '0');

        slider.addEventListener('input', () => {
            const minS = parseInt(slider.value);
            output.textContent = minS === 0 ? 'SEG: OFF' : `SEG: ${minS} Seg`;

            document.querySelectorAll('.video').forEach((vc) => {
                const video = vc.querySelector('.video-js video');
                if (video && 'length' in video.dataset) {
                    const videoLength = parseInt(video.dataset.length);
                    if (videoLength < minS) {
                        vc.classList.add('hidden');
                    } else {
                        vc.classList.remove('hidden');
                    }
                } else {
                    vc.classList.remove('hidden');
                }
            });
        });

        div.appendChild(slider);
        document.body.appendChild(div);
    };

    const addButtonToNavbar = function () {
        const navbarRight = document.querySelector('.navbar-nav.navbar-right');

        // Botão Mostrar Slider
        const sliderButton = document.createElement('li');
        sliderButton.innerHTML = '<a href="#" id="show-slider-btn">Slider</a>';
        sliderButton.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            const sliderContainer = document.getElementById('slider-container');
            // Sempre exibe o slider na primeira vez
            if (!sliderContainer) {
                showSlider();
            } else {
                sliderContainer.style.display = sliderContainer.style.display === 'none' ? 'block' : 'none';
            }
        });
        navbarRight.appendChild(sliderButton);
    };

    // Verifica se a URL corresponde às regras para esconder o slider
    if (window.location.href.match(/https:\/\/www\.erome\.com\/(explore.*|search\?q=.*|$)/)) {
        // Se estiver nas URLs bloqueadas, não faz nada.
        return;
    } else if (window.location.href.match(/https:\/\/www\.erome\.com\/a\//)) {
        // Se estiver nas URLs permitidas, mostra o slider.
        showSlider();
        addButtonToNavbar();
        const videoSources = document.querySelectorAll('.video-js video source');
        videoSources.forEach(source => {
            const url = source.src;
            videoLength(url, source.parentNode);
        });
    }
}());
