# Erome Downloader Premium  

## Descrição  
Este script facilita o download de vídeos e imagens diretamente do site **Erome.com**, com controle aprimorado através de botões. Ele também realiza ajustes na interface e contorna restrições do site para uma navegação mais fluida.  

### Funcionalidades  
- **Views** albuns separados por views.
- **Theme** novo desing melhorado do site.
- **NSFW** blur ocultando fotos e videos.
- **Hidden** ocultar videos por segundos.
- **Download All** baixar todas as fotos e video em um clique.
- **Download direto** de vídeos e imagens com um clique.
- **Modo Cinema**: Função modo cinema com foco em Imagens e Vídeos.  
- **Controle de velocidade** de reprodução para vídeos (0.5x a 5x).  
- **Alteração automática** do título da página e nome do usuário para "By Maad".  
- **Bypass**, removendo bloqueios de login e disclaimers.  
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
   - Cole o código do script do [Erome Downloader Premium](https://github.com/castielwallker/Premium-Erome/blob/main/running.js).
   - Script running ira carregar os restantes dos scripts.
   - Salve o script.

3. **Abra qualquer página em erome.com** e o script irá adicionar automaticamente botões de download sobre vídeos e imagens.  
4. **Use os controles** para alternar a visibilidade das mídias e botões de download.  
5. **Alterne a velocidade** dos vídeos diretamente nos players integrados.  

## Tecnologias Utilizadas  
- **GM.xmlHttpRequest**: Para download das mídias diretamente via script.  
- **JSZip**: Preparado para compressão futura de arquivos.  
- **Video.js**: Manipulação e controle avançado de players de vídeo.  

## Notas
- **Disclaimer:** Ao acessar a página, o script remove o disclaimer e permite o fluxo normal de uso.
- **Modo Cinema:** Permite uma visualização mais imersiva dos conteúdos, alterando a cor de fundo e ocultando elementos não essenciais.

## Updates
- **Download:** Novo desing de botão de download videos e fotos. [Preview](https://i.imgur.com/A1vMa50.png)
- **NSFW:** Blur NSFW foi melhorado e agora funciona em albuns, fotos e videos. [Preview](https://i.imgur.com/T5d9JsX.png)
- **Theme:** Foi adicionado um novo tema visual melhorado com remoção de alguns componentes. [Preview](https://i.imgur.com/VHmCjZ0.png)
- **Hidden:** Implementado um novo sistema de ocultar videos por segundos. ( De 5 segundos a 100.) [Preview](https://i.imgur.com/0cmHMes.png)
- **Views:** Implementado um novo sistema de separa albuns por view alternavel entre decrescente e crescente. [Preview](https://i.imgur.com/PKqgoTu.png)
- **Player:** Ajustado e foi adicionado mais recursos como Modo Cinema One, Flip Video, Picture In Picture, Velocidade e Download. [Preview](https://i.imgur.com/4fREFLl.png)
- **Download All:** Acrescentado tambem Download All Beta, Atualmente esta em fase beta faltando alguns ajuste de pré-carregamente da pagina. [Preview](https://i.imgur.com/kNzR1Qd.png)

## Autor  
**Maad** - [GitHub](https://github.com/castielwallker/) 

## Licença  
Distribuído sob a licença MIT.  
