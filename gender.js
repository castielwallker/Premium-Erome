// ==UserScript==
// @name         Erome Gender
// @namespace    https://www.erome.com/
// @version      1.0
// @description  Select Gender Erome - Premium
// @author       Maad
// @match        https://www.erome.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const iconesGenero = {
        "all": 'svg-fa svg-fas-fa-mars-and-venus-burst',
        "straight": 'svg-fa svg-fas-fa-venus-mars',
        "trans": 'svg-fa svg-fas-fa-transgender',
        "gay": 'svg-fa svg-fas-fa-mars-double',
        "hentai": 'svg-fa svg-fas-fa-mercury'
    };

    let generoAtual = localStorage.getItem("generoSelecionado") || "all";

    function criarComboBox() {
        const botaoMenu = document.querySelector(".navbar-toggle");
        if (!botaoMenu) return;


        let comboContainer = document.createElement("div");
        comboContainer.id = "combo-genero";
        comboContainer.style.position = "relative";
        comboContainer.style.display = "inline-block";
        comboContainer.style.marginLeft = "20px";
        comboContainer.style.cursor = "pointer";

        let botaoGenero = document.createElement("div");
        botaoGenero.id = "botao-genero";
        botaoGenero.innerHTML = `<i class="${iconesGenero[generoAtual]}"></i>`;
        botaoGenero.style.display = "flex";
        botaoGenero.style.alignItems = "center";
        botaoGenero.style.padding = "10px";
        botaoGenero.style.background = "#1d1e2a";
        botaoGenero.style.borderRadius = "10px";
        botaoGenero.style.marginTop = "7px";

        let dropdownMenu = document.createElement("ul");
        dropdownMenu.id = "dropdown-genero";
        dropdownMenu.style.position = "absolute";
        dropdownMenu.style.top = "45px";
        dropdownMenu.style.left = "0";
        dropdownMenu.style.background = "#14151f";
        dropdownMenu.style.borderRadius = "5px";
        dropdownMenu.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.5)";
        dropdownMenu.style.padding = "10px";
        dropdownMenu.style.listStyle = "none";
        dropdownMenu.style.display = "none";
        dropdownMenu.style.minWidth = "120px";
        dropdownMenu.style.filter = "drop-shadow(0px 0px 5px rgba(255, 255, 255, 0.1))";

        Object.keys(iconesGenero).forEach(genero => {
            let item = document.createElement("li");
            item.innerHTML = `<i class="${iconesGenero[genero]}"></i> ${genero.toUpperCase()}`;
            item.style.display = "flex";
            item.style.alignItems = "center";
            item.style.gap = "5px";
            item.style.padding = "5px 10px";
            item.style.cursor = "pointer";
            item.style.color = "#fff";
            item.style.transition = "0.3s ease-in-out";

            item.addEventListener("click", () => {
                generoAtual = genero;
                localStorage.setItem("generoSelecionado", genero);
                botaoGenero.innerHTML = `<i class="${iconesGenero[genero]}"></i>`;
                dropdownMenu.style.display = "none";
                window.location.href = `https://www.erome.com/version/${genero}`;
            });


            item.addEventListener("mouseover", () => {
                item.style.transform = "scale(1.1)";
                item.style.textShadow = "0px 0px 10px #8a5acce";

                dropdownMenu.childNodes.forEach(li => {
                    if (li !== item) {
                        li.style.opacity = "0.5";
                    }
                });
            });

            item.addEventListener("mouseout", () => {
                item.style.transform = "scale(1)";
                item.style.textShadow = "none";
                dropdownMenu.childNodes.forEach(li => {
                    li.style.opacity = "1";
                });
            });

            dropdownMenu.appendChild(item);
        });

        botaoGenero.addEventListener("click", () => {
            dropdownMenu.style.display = "block";
        });

        let timeout;
        comboContainer.addEventListener("mouseleave", () => {
            timeout = setTimeout(() => dropdownMenu.style.display = "none", 500);
        });

        dropdownMenu.addEventListener("mouseenter", () => {
            clearTimeout(timeout);
        });

        dropdownMenu.addEventListener("mouseleave", () => {
            dropdownMenu.style.display = "none";
        });

        comboContainer.appendChild(botaoGenero);
        comboContainer.appendChild(dropdownMenu);
        botaoMenu.parentNode.insertBefore(comboContainer, botaoMenu.nextSibling);
    }

    window.addEventListener("load", criarComboBox);
})();
