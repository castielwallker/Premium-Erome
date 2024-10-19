 ==UserScript==
 @name         Erome NSFW Premium
 @namespace    httpsgithub.commaadvfx
 @icon         httpswww.erome.comfavicon.ico
 @version      1.1
 @description  Blur Image
 @author       Maad
 @match        httpswww.erome.comexplore
 @match        httpswww.erome.com
 @match        httpswww.erome.comsearchq=
 @icon         dataimagegif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
 @grant        none
 ==UserScript==

(function () {
    'use strict';

     Adiciona estilo CSS para o efeito de desfoque
    const style = document.createElement('style');
    style.textContent = `
        .blur {
            filter blur(15px);  Aplica o efeito de desfoque 
        }
    `;
    document.head.appendChild(style);

    const addButtonToNavbar = function () {
        const navbarRight = document.querySelector('.navbar-nav.navbar-right');

         Verifica se o botão já existe para não duplicar
        if (!document.getElementById('nsfw-toggle-btn')) {
             Botão NSFW
            const nsfwButton = document.createElement('li');
            nsfwButton.innerHTML = 'a href=# id=nsfw-toggle-btnNSFWa';
            nsfwButton.querySelector('a').addEventListener('click', (e) = {
                e.preventDefault();
                const albumContainers = document.querySelectorAll('.album-thumbnail-container');  Obtém todos os contêineres de miniaturas
                const isBlurred = albumContainers[0].classList.toggle('blur');  Verifica o estado de desfoque

                albumContainers.forEach(albumContainer = {
                    if (isBlurred) {
                        albumContainer.classList.add('blur');  Aplica o efeito de desfoque
                    } else {
                        albumContainer.classList.remove('blur');  Remove o efeito de desfoque
                    }
                });
            });
            navbarRight.appendChild(nsfwButton);
        }
    };

     Chama a função apenas se a URL for correspondente
    if (window.location.href.match(httpswww.erome.com(explore.searchq=.$))) {
        addButtonToNavbar();
    }
})();
