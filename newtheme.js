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
     .vjs-control:hover {
       background: rgba(255, 255, 255, 0.2);
      }
       button:hover {
       background: rgba(255, 255, 255, 0.2);
       }
       .media-group .img-back {
        width: 100%;
        height: auto;
        filter: brightness(40%) blur(10px);
        border-radius: 15px;
        opacity: 1;
       }
       .video-js .vjs-play-progress {
        background: #8a5acc !important;
        box-shadow: 0 0 20px 5px rgba(138, 90, 204, 0.5);
       }
       .video-js .vjs-play-progress:before{
        box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.1);
       }
       body {
        background-color: #1d1e2a;
        color: #ffffff;
       }
  	   a {
        color: #8a5acc;
        }
       #suggestions {
        background-color: #161616;
        color: #fff;
        border-radius: 10px;
       }
      .modal-content {
        background-color: #14151f;
        border-radius: 10px;
      }
      .btn-pink{
  		color: #fff;
  		background-color: #8a5acc59;
        border-radius: 5px;
  	  }
  	  .btn-pink:hover{
        color: #ffffff;
        background-color: transparent;
        border-color: #666666;
        border: 1px solid #8a5acc !important;
        box-shadow: 0 0 20px 5px rgba(138, 90, 204, 0.5);
  	  }
       .modal-header {
        border-radius: 10px;
        background-color: #1d1e2a;
      }

      #searchBar #q,
      #userSearchBar #q-user {
        height: 30px;
        background-color: #1d1e2a !important;
        border: none;
        border-radius: 10px;
        color: #fff;
      }
      #suggestions p {
        border-top: 0.9px solid #8a5acc;
        margin: 1px;

      }
      #suggestions {
        background-color: #14151f;
        color: #8a5acc;
       }
      .stylish-input-group .input-group-addon {
        background: #1d1e2a !important;
        border-radius: 10px;
       }
       .suggested-users {
        display: none !important;
       }
       .fas.fa-user {
        display: none !important;
       }
       .navbar-inverse {
        background-color: #14151f;
       }
       .album .album-thumbnail {
        object-fit: cover;
        width: 100%;
        height: 100%;
       }
       .album-thumbnail-container {
        transition: all 0.2s ease-in-out;
        position: relative;
       }
       .album-title {
        display: none !important;
       }
       .album-thumbnail-container:hover {
        margin: 10px;
        overflow: visible;
        transform: scale(0.9);
        box-shadow: 0 0 20px 5px rgba(138, 90, 204, 0.5);
       }
       .page-content h1 {
        text-align: center;
        margin: 20px 0;
       }
       .pagination {
        display: flex;
        justify-content: center;
        list-style: none;
        padding: 0;
        margin: 20px 0;
       }
       .pagination li {
        margin: 0 10px;
       }
       .pagination a, .pagination span {
        padding: 10px 15px;
        border-radius: 5px;
        background-color: #14151f;
        color: white;
        text-decoration: none;
        transition: all 0.2s ease-in-out;
       }
       .pagination a:hover {
        background-color: #8a5acc;
        box-shadow: 0 0 10px rgba(138, 90, 204, 0.7);
        box-shadow: 8px 8px 16px #0a0a0a, -8px -8px 16px #2a2a2a;
       }
      .pagination > .disabled > a,
      .pagination > .disabled > a:focus,
      .pagination > .disabled > a:hover,
      .pagination > .disabled > span,
      .pagination > .disabled > span:focus,
      .pagination > .disabled > span:hover {
        background-color: #14151f;
        color: #666;
        cursor: not-allowed;
      }
      .pagination > li > a,
      .pagination > li > span {
        background-color: #14151f;
        color: #fff;
        border: none;
        transition: background-color 0.3s ease;
      }
      .pagination > li > a:focus,
      .pagination > li > a:hover,
      .pagination > li > span:focus,
      .pagination > li > span:hover {
        background-color: #a572eb;
        color: #fff;
        border: none;
      }
      .pagination > .active > a,
      .pagination > .active > a:focus,
      .pagination > .active > a:hover,
      .pagination > .active > span,
      .pagination > .active > span:focus,
      .pagination > .active > span:hover {
        background-color: #a572eb; /* Roxo */
        color: #fff;
        border: none;
      }
       .pagination .active span {
        background-color: #8a5acc;
        background-color: rgba(138, 90, 204, 0.7);
        box-shadow: 0 0 10px rgba(138, 90, 204, 0.9);
       }
       #tabs {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 30px;
        margin-top: 30px;
        overflow: visible;
        padding: 10px 0;
       }
       #tabs .menu-tab {
        padding: 1px 25px;
        border-radius: 10px;
        color: #8a5acc;
        text-decoration: none;
        transition: all 0.2s ease-in-out;
        position: relative;
        z-index: 1;
        background: linear-gradient(145deg, #00000000, #10101042);
        box-shadow: 8px 8px 15px #00000036, -5px -5px 10px #2a2a2a54;
       }
       #tabs .menu-tab:hover {
        box-shadow: 0 0 10px 5px rgba(138, 90, 204, 0.5);
        transform: scale(1.05);
        color : #ffffff;
        box-shadow: inset 8px 8px 16px #161616c9, inset -8px -8px 16px #2a2a2ab3;
       }
       .menu-tab:hover, .menu-tab:focus, .menu-tab.selected {
        color: #8a5acc;
        border-bottom: 3px solid #dbc0ff;
        cursor: pointer;
       }
      .nav.navbar-nav.navbar-right li a {
        color: #8a5acc;
        transition: all 0.2s ease-in-out;
      }
      .nav.navbar-nav.navbar-right li a:hover {
        color: white;
        text-shadow: 0 0 10px rgba(138, 90, 204, 0.9);
        transform: scale(1.1);
      }
      h1, h2 {
        text-align: center;
        margin: 30px 0;
        text-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
        animation: pulse 2s infinite;
      }
      .list-comment {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .comment {
        width: 100%;
        max-width: 600px;
        margin: 10px 0;
        text-align: center;
        animation: pulse 2s infinite;
      }
      .comment-content {
        background-color: #14151f;
        border-radius: 5px;
        padding: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .comment-content a {
        display: block;
        font-weight: bold;
        margin-bottom: 6px;
        color: #fff;
        text-decoration: none;
      }
      .comment-text {
        display: block;
        margin-top: 4px;
        color: #8a5acc;
      }
      .comment .btn-group {
        display: flex;
        margin-top: 15px;
        margin-right: -15px;
      }
      .leave-comment {
        padding: 0 580px;
        cursor: pointer;
      }
      .fa-lg{
        color: #8a5acc;
        font-size: 1.1999em;
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
      }
      .fa-eye{
        color: #8a5acc;
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
      }
      .fa-video {
        color: #8a5acc;
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
       }

      .fa-camera {
        color: #8a5acc;
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
       }
       #user .bio {
       color: #ffffff;
       }
       #user .user-info {
        color: #8a5acc;
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
       }
       #user .website {
        color: #ffffff;
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
       }
       album-website{
        color: #ffffff;
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
       }
      .fa-lg{
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
      }
      .fa-eye{
        color: #8a5acc;
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
      }
      .fa-video {
        color: #8a5acc;
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
       }
      .fa-camera {
        color: #8a5acc;
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
       }
       #user .bio {
        color: #ffffff;
       }
       #user .user-info {
        color: #8a5acc;
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
       }
       .username {
        color: #8a5acc;
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
       }
       #user .website {
        color: #ffffff;
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
       }
       album-website{
        color: #ffffff;
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
       }
       .btn-grey{
        color: #ffffff;
        border-radius: 4px;
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
       }
       .btn-grey:hover{
        color: #ffffff !important;
        background-color: transparent !important;
        border: 1px solid #8a5acc !important;
        box-shadow: 0 0 20px 5px rgba(138, 90, 204, 0.5);
        filter: drop-shadow(rgba(138, 90, 204, 0.8) 0px 0px 5px)
       }
       .btn-download{
        color: #ffffff !important;
        background-color: color: #8a5acc;
       }
       .btn:focus, .btn:hover {
        color: #fff;
       }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    `;
    document.head.appendChild(style);
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
    window.addEventListener('load', ocultarSuggestedUsers);
})();