# Erome Downloader Premium  

## Descrição  
Este script facilita o download de vídeos e imagens diretamente do site **erome.com**, com controle aprimorado através de botões. Ele também realiza ajustes na interface e contorna restrições do site para uma navegação mais fluida.  

### Funcionalidades  
- **Download direto** de vídeos e imagens com um clique.
- **Modo Noite/Cinema**: Função modo noite/cinema com foco em Imagens e Vídeos.  
- **Controle de velocidade** de reprodução para vídeos (0.5x a 4x).  
- **Alteração automática** do título da página e nome do usuário para "By Maad".  
- **Bypass de restrições**, removendo bloqueios de login e disclaimers.  
- **Botões personalizáveis** para mostrar/ocultar mídias e downloads.  
- **Notificações rápidas** (toast) para feedback imediato ao usuário.  
- **Integração com Video.js** para adicionar controles extras nos players de vídeo.  

## Como Usar  
1. **Instale a extensão Tampermonkey**:
   - [Tampermonkey para Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmipfmgmfgmfdgohdgdg)
   - [Tampermonkey para Firefox](https://addons.mozilla.org/pt-BR/firefox/addon/tampermonkey/)
   - [Tampermonkey para Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/fmgoekdofcbbpglbclpbgmhbclgfbi)
   
2. **Adicione o script**:
   - Clique no ícone do Tampermonkey no navegador e selecione **"Criar um novo script"**.
   - Apague qualquer código que já esteja no editor.
   - Cole o código do script do Erome Downloader Premium.
   - Salve o script.

3. **Abra qualquer página em erome.com** e o script irá adicionar automaticamente botões de download sobre vídeos e imagens.  
4. **Use os controles** para alternar a visibilidade das mídias e botões de download.  
5. **Alterne a velocidade** dos vídeos diretamente nos players integrados.  

## Tecnologias Utilizadas  
- **GM.xmlHttpRequest**: Para download das mídias diretamente via script.  
- **JSZip**: Preparado para compressão futura de arquivos.  
- **Video.js**: Manipulação e controle avançado de players de vídeo.  

## Autor  
**Maad** - [GitHub](https://github.com/castielwallker/) 

## Licença  
Distribuído sob a licença MIT.  
