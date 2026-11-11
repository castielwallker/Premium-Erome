# 🎬 Erome Premium — All-in-One

**UserScript para Tampermonkey que transforma o Erome em uma experiência premium: tema Dark Violet, feed vertical estilo TikTok, download em massa com ZIP, player turbinado, bloqueio de popups/redirects e bypass de restrições.**

![versão](https://img.shields.io/badge/vers%C3%A3o-3.0.0-blue)
![Tampermonkey](https://img.shields.io/badge/Tampermonkey-required-green)
![Erome](https://img.shields.io/badge/Erome-compatible-8a5acc)
![licença](https://img.shields.io/badge/licen%C3%A7a-MIT-yellow)
![status](https://img.shields.io/badge/status-ativo-brightgreen)

---

## 📖 Sobre

**Erome Premium** é um UserScript que roda no **Tampermonkey** e melhora radicalmente a experiência no `erome.com`. Ele unifica dezenas de funcionalidades em um único script — é a última extensão que você vai precisar no site.

- 🎨 **Tema Dark Violet** completo (navbar reconstruída, hubs de menu, badges)
- 📱 **TikTok Mode** — feed vertical com scroll snap, autoplay, double-tap para curtir e pré-carregamento de álbuns relacionados
- ⬇️ **Bulk Download** — modal com filtros, empacotamento ZIP e concorrência controlada
- 🎮 **Player turbinado** — velocidade 0.5x–5x, flip, PiP, cinema mode, download
- 🛡️ **Bloqueio de redirects/popups** — `brightadnetwork.com`, `pemsrv.com`, `/jump/next.php`, `splash.php`
- 🔓 **Bypass** de disclaimer e remoção de `needAccount`
- 🖼️ **Tweaks visuais** — logo recolorida, favicon hue-rotate, avatares customizados, título animado
- 🏷️ **Badges** — contagem de fotos/vídeos, duração de vídeos, likes dos álbuns
- 🔀 **Ordenação** — por views, vídeos, fotos (asc/desc)
- 🌫️ **NSFW Blur** opcional + filtro de duração mínima
- ♾️ **Infinite scroll** na listagem de álbuns

> ⚠️ **Aviso:** use apenas para fins pessoais/educacionais. Respeite os Termos de Serviço do site e direitos autorais do conteúdo. O autor não se responsabiliza pelo uso indevido.

---

## ✨ Funcionalidades

| Recurso | Descrição |
|---|---|
| 🎨 **Dark Violet Theme** | Navbar reconstruída com hubs de menu (Gender, Privacy, View & Sort, Album Tools) |
| 📱 **TikTok Mode** | Feed vertical com scroll snap, autoplay, double-tap ❤️, sidebar estilo TikTok, splash animado |
| ⬇️ **Bulk Download** | Modal com filtros (All/Images/Videos), ZIP opcional, 4 downloads paralelos, retry exponencial |
| ⬇️ **Download individual** | Botão circular em cada `img`/`video` + botão no controlBar do video.js |
| 🎮 **Player enhancements** | Velocidade (0.5x–5x), flip horizontal, PiP, cinema mode, download |
| 🛡️ **Redirect Blocker** | Bloqueia popups/cliques para `brightadnetwork`, `pemsrv`, `/jump/next.php`, `splash.php` |
| 🔓 **Bypass** | Remove `#disclaimer` e `#needAccount` automaticamente |
| 🏷️ **Badges** | Contagem de mídias por álbum, duração de vídeos (via range request), likes dos álbuns |
| 🔀 **Sort** | Ordena álbuns por views / vídeos / fotos (asc/desc) |
| 🌫️ **NSFW Blur** | Blur em thumbnails/mídias (persistido em `localStorage`) |
| ⏱️ **Filtro de duração** | Esconde vídeos menores que N segundos (slider 0–100s) |
| ♾️ **Infinite scroll** | Carrega próximas páginas automaticamente na listagem |
| 🖼️ **Tweaks visuais** | Logo hue-rotate, favicon recolorido, avatares customizados, título animado |
| 🔔 **Toasts** | Notificações animadas de sucesso/erro/info |

---

## 📱 TikTok Mode (O Carro-Chefe)

Inspirado no feed do TikTok, mas com a mídia do Erome.

- **Container 9:16** com notch e sombra (fullscreen no mobile)
- **Scroll Snap** vertical com autoplay silencioso
- **Double-tap para curtir** com animação de coração
- **Sidebar de ações** nativa: Like, Favorite, Comment, Share, Download, Copy, Report
- **Pré-carregamento em background**: quando você está a 3 cards do fim, o próximo álbum já foi baixado e está pronto
- **Três modos**: Vídeos, Fotos ou Tudo
- **Splash Screen** animado com logo do Erome

---

## 🚀 Instalação

### Pré-requisitos

- **Navegador:** Chrome, Firefox, Edge ou Brave
- **Extensão:** [Tampermonkey](https://www.tampermonkey.net/) (recomendado) ou Violentmonkey
- **Conexão:** necessária para `@require` (JSZip + FileSaver) e CDN

### Opção 1 — Instalação direta (recomendada)

1. Instale o [Tampermonkey](https://www.tampermonkey.net/).
2. Abra o arquivo `erome-premium.user.js` neste repositório.
3. Clique em **Raw** → o Tampermonkey oferecerá a instalação.
4. Confirme em **Instalar**.
5. Acesse [erome.com](https://www.erome.com/) e recarregue com `Ctrl + F5`.

### Opção 2 — Manual

1. Instale o Tampermonkey.
2. Ícone da extensão → **Create a new script**.
3. Cole todo o conteúdo do script (incluindo o bloco `// ==UserScript==`).
4. Salve com `Ctrl + S`.
5. Recarregue o Erome.

> 💡 **Dica:** em **Tampermonkey → Settings**, mantenha habilitado o carregamento de `@require` externos (padrão: sim).

---

## 🎮 Como usar

### Atalhos principais

| Ação | Como acessar |
|---|---|
| 📱 **Abrir TikTok Mode** | Botão flutuante roxo com logo (canto inferior direito, acima do FAB) **ou** hub **Album Tools → TikTok Mode** |
| ⬇️ **Bulk Download** | FAB roxo (canto inferior direito) **ou** hub **Album Tools → Bulk Download…** |
| 🌫️ **NSFW Blur** | Hub **Privacy → Toggle NSFW Blur** |
| 🔀 **Ordenar álbuns** | Hub **View & Sort → Sort by…** |
| ⏱️ **Filtro de duração** | Slider no canto inferior esquerdo (página de álbum) |
| 🎬 **Cinema Mode** | Botão no player ou hub **Album Tools → Cinema Mode** |

### Atalhos de teclado (TikTok Mode)

| Tecla | Ação |
|---|---|
| `↓` / `J` | Próximo item |
| `↑` / `K` | Item anterior |
| `Espaço` | Play/Pause |
| `D` | Baixar mídia atual |
| `L` | Curtir mídia atual |
| `Esc` | Fechar TikTok Mode |

### Interações no TikTok Mode

- **Scroll** para cima/baixo → navega entre mídias (scroll snap)
- **Tap** → play/pause
- **Double-tap** → curtir (❤️ pop animation)
- **Sidebar** → like, favorite, comment, share, download, copy, report
- **Avatar** → abre o álbum original em nova aba

---

## ⚙️ Como funciona (resumo técnico)
erome-premium.user.js
├── @require JSZip + FileSaver (via CDN)
├── @grant GM_xmlhttpRequest (downloads com Referer correto)
├── @grant GM_addStyle (injeção de CSS)
│
├── CONFIG + STATE (tema, flags, persistência em localStorage)
├── Redirect Blocker (window.open + click capture + MutationObserver)
├── Toast System (notificações animadas)
├── Download Engine (pLimit 4 + retry exponencial + blob → save)
├── Inline Download Buttons (anexa em .media-group img/video e .album-image img)
├── Video Duration Detection (range request bytes=0-500 + cache em localStorage)
├── Album Count Badges (contagem de fotos/vídeos por álbum)
├── Album Likes (async) (fetch de até 30 álbuns, extrai like count)
├── Sort Albums (por views/vídeos/fotos, asc/desc)
├── Toggles (photos, videos, download buttons, NSFW, cinema, video-only)
├── Hidden Slider (filtro de duração 0–100s)
├── Video.js Enhancements (speed, download, flip, cinema, PiP)
├── Bulk Download Modal (filtros + ZIP + progresso)
├── TikTok Mode (feed vertical, IntersectionObserver, pré-carregamento)
├── FAB + Hubs (navbar reconstruída, menus popup)
├── Bypass (remove #disclaimer e #needAccount)
├── Infinite Scroll (usa $.fn.infiniteScroll se disponível)
└── Refresh Loop (MutationObserver + setInterval 2s)


---

## 🎨 Personalização

### Alterar a paleta do tema

No topo do script, edite `CONFIG`:

```javascript
const CONFIG = {
    brand: 'Erome Premium All-in-One',
    accent: '#8a5acc',       // cor principal
    accentSoft: '#b39ad6',
    dark: '#14151f',
    surface: '#1d1e2a',
    success: '#4ade80',
    danger: '#ef4444',
    warning: '#fbbf24'
};
