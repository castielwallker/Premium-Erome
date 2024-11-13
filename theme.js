// ==UserScript==
// @name         Erome Theme
// @namespace    @maad
// @version      1.0
// @description  Theme UI Clean Erome
// @author       Maad
// @match        https://www.erome.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
const style = document.createElement('style');
style.innerHTML = `
  .vjs-control:hover, button:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  .media-group .img-back {
    width: 100%;
    height: auto;
    filter: brightness(40%) blur(10px);
    border-radius: 15px;
  }
  .video-js .vjs-play-progress {
    background: #8a5acc !important;
    box-shadow: 0 0 20px 5px rgba(138, 90, 204, 0.5);
  }
  body {
    background-color: #1d1e2a;
    color: #ffffff;
  }
  a {
    color: #8a5acc;
  }
  #suggestions, .modal-content, .stylish-input-group .input-group-addon {
    background-color: #14151f;
    border-radius: 10px;
    color: #fff;
  }
  #suggestions p {
    border-top: 0.9px solid #8a5acc;
    margin: 1px;
  }
  .btn-pink {
    color: #fff;
    background-color: #8a5acc59;
    border-radius: 5px;
  }
  .btn-pink:hover, .btn-grey:hover {
    color: #ffffff !important;
    background-color: transparent !important;
    border: 1px solid #8a5acc !important;
    box-shadow: 0 0 20px 5px rgba(138, 90, 204, 0.5);
  }
  .navbar-inverse, .pagination > .active > a, .pagination > .active > span {
    background-color: #14151f;
    color: #666;
    cursor: not-allowed;
  }
  .pagination a, .pagination span {
    padding: 10px 15px;
    border-radius: 5px;
    background-color: #14151f;
    color: white;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
  }
  .pagination a:hover, .pagination > li > a:hover, .pagination > li > span:hover {
    background-color: #8a5acc;
    box-shadow: 8px 8px 16px #0a0a0a, -8px -8px 16px #2a2a2a;
  }
  #tabs .menu-tab, .nav.navbar-nav.navbar-right li a {
    padding: 1px 25px;
    border-radius: 10px;
    color: #8a5acc;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    background: linear-gradient(145deg, #00000000, #10101042);
    box-shadow: 8px 8px 15px #00000036, -5px -5px 10px #2a2a2a54;
  }
  #tabs .menu-tab:hover, .nav.navbar-nav.navbar-right li a:hover {
    color: #ffffff;
    transform: scale(1.05);
    text-shadow: 0 0 10px rgba(138, 90, 204, 0.9);
    box-shadow: inset 8px 8px 16px #161616c9, inset -8px -8px 16px #2a2a2ab3;
  }
  h1, h2, .list-comment, .comment {
    text-align: center;
    margin: 20px 0;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
    animation: pulse 2s infinite;
  }
  .comment-content, .comment-text {
    background-color: #14151f;
    border-radius: 5px;
    padding: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: #8a5acc;
  }
  .fa-lg, .fa-eye, .fa-video, .fa-camera, .user-info, .username h1 {
    color: #8a5acc;
    filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px);
  }
  .fa-lg:hover, .fa-eye:hover, .fa-video:hover, .fa-camera:hover {
    color: #fff;
    filter: drop-shadow(rgba(255, 255, 255, 0.8) 0px 0px 5px);
  }
  .user-info, .website {
    color: #8a5acc;
  }
  .btn-download, .btn:focus, .btn:hover {
    color: #fff;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;
document.head.appendChild(style);

    
    function removerElementos() {
        const elementosParaRemover = document.querySelectorAll('.sp, .sp-mob.hidden-sm.hidden-md.hidden-lg, .bubble-mobile');
        elementosParaRemover.forEach(el => el.remove());
    }
     const bubbleLink = document.getElementById('bubble');
        if (bubbleLink) {
            bubbleLink.remove();
        }

    window.addEventListener('load', () => {
        setTimeout(removerElementos, 1000)
    });
    
    const logo = document.querySelector('img[src*="logo-erome-horizontal.png"]');
    if (logo) {
        logo.style.filter = 'hue-rotate(295deg)';
        logo.style.transition = 'filter 0.5s ease';
    }

    function ocultarSuggestedUsers() {
        const suggestedUsers = document.querySelector('.col-sm-12 h2 i.fas.fa-user')?.closest('.col-sm-12');
        if (suggestedUsers) {
            suggestedUsers.style.display = 'none';
        }
        
    }

    const defaultAvatarUrl = 'https://i.imgur.com/v1vw6WB.png';

    document.querySelectorAll('.default-avatar').forEach(avatar => {
        const pai = avatar.closest('.album-infos');
        if (pai) {
            const albumTitle = pai.querySelector('.album-title')?.outerHTML || '';
            const albumUser = pai.querySelector('.album-user')?.outerHTML || '';
            pai.innerHTML = `
                <img src="${defaultAvatarUrl}" class="avatar initial loading" data-was-processed="true" alt="Avatar padrão">
                <div>
                    ${albumTitle}
                    ${albumUser}
                </div>`;
        }
    });

    document.querySelectorAll('.col-sm-5.user-info.username.mb-5').forEach(userInfo => {
        const avatarSpan = userInfo.querySelector('.default-avatar');
        if (avatarSpan) {
            const userLink = userInfo.querySelector('#user_icon')?.href || '#';
    
            userInfo.querySelector('#user_icon').innerHTML = `
                <a href="${userLink}" id="user_icon">
                    <img src="${defaultAvatarUrl}" class="avatar initial loading" alt="Default avatar" width="36" height="36" data-was-processed="true">
                </a>`;
        }
    });

    document.querySelectorAll('.col-xs-12.text-center.relative').forEach(container => {
        const avatarSpan = container.querySelector('.default-avatar');
        if (avatarSpan) {
            container.innerHTML = `
                <img src="${defaultAvatarUrl}" class="avatar initial loading" alt="Default avatar" data-was-processed="true">
            `;
        }
    });

    function updateFavicon() {
        const link = document.createElement('link');
        link.type = 'image/png';
        link.rel = 'icon';
        link.href = 'https://www.erome.com/favicon-32x32.png';
        document.head.appendChild(link);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = link.href;
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.filter = 'hue-rotate(290deg)';
            ctx.drawImage(img, 0, 0);
            link.href = canvas.toDataURL(); 
        };
    }

    updateFavicon();


    function ChangeTitleAndElements() {
        const h1Element = document.querySelector('.col-sm-12.page-content h1');
        const userNameElement = document.getElementById("user_name") || document.querySelector(".username");
        const originalTitle = document.title;

        const texts = ["By Maad", originalTitle];
        let index = 0;
    
        setInterval(() => {
            document.title = texts[index];

            if (h1Element) {
                h1Element.textContent = texts[index];
            }
            
            if (userNameElement) {
                userNameElement.innerHTML = `${texts[index]}&nbsp;<i class='fas fa-check-circle user-verified' title='Verified'></i>`;
            }
            index = (index + 1) % texts.length;
        }, 1000);
    }
    
    // Chama a função
    ChangeTitleAndElements();

    window.addEventListener('load', ChangeTitleAndElements);
    window.addEventListener('load', removerElementos);
    window.addEventListener('load', updateFavicon);
    window.addEventListener('load', ocultarSuggestedUsers);
})();
