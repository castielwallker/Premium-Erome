// ==UserScript==
// @name         Erome Theme
// @namespace    @maad
// @version      1.0
// @description  Theme UI Clean Erome
// @author       Maad
// @match        https://www.erome.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
         body {
            background-color: #161616;
            color: #eb6395;
         }
         .suggested-users {
            display: none !important;
         }
         .fas.fa-user {
            display: none !important;
         }

         .navbar-inverse {
            background-color: #101010;
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
            box-shadow: 0 0 20px 5px rgba(235, 99, 149, 0.7);
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
            background-color: #101010; 
            color: white; 
            text-decoration: none; 
            transition: all 0.2s ease-in-out; 
         }
         .pagination a:hover {
            box-shadow: 0 0 10px rgba(235, 99, 149, 0.7);
         }
         .pagination .active span {
            background-color: rgba(235, 99, 149, 0.7); 
            box-shadow: 0 0 10px rgba(235, 99, 149, 0.9); 
         }
         #tabs {
            display: flex;
            justify-content: center;
            align-items: center; 
            gap: 20px;
            margin-top: 20px;
            overflow: visible;
            padding: 10px 0;
         }
         #tabs .menu-tab {
            padding: 1px 25px;
            border-radius: 10px;
            background-color: #101010;
            color: #eb6395;
            text-decoration: none;
            transition: all 0.2s ease-in-out;
            position: relative;
            z-index: 1;
         }
         #tabs .menu-tab:hover {
            box-shadow: 0 0 10px 5px rgba(235, 99, 149, 0.5);
            transform: scale(1.05);
            color : #ffffff;
         }
        .nav.navbar-nav.navbar-right li a {
            color: #eb6395;
            transition: all 0.2s ease-in-out;
        }

        .nav.navbar-nav.navbar-right li a:hover {
            color: white; 
            text-shadow: 0 0 10px rgba(235, 99, 149, 0.9);
            transform: scale(1.1); 
        }
        h1, h2 {
            text-align: center;
            margin: 30px 0;
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);

    function ocultarSuggestedUsers() {
        const suggestedUsers = document.querySelector('.col-sm-12 h2 i.fas.fa-user')?.closest('.col-sm-12');
        if (suggestedUsers) {
            suggestedUsers.style.display = 'none';
        }
    }

    window.addEventListener('load', ocultarSuggestedUsers);
})();
