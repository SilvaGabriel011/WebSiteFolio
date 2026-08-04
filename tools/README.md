# tools/ — QA e pipeline de fotos

Ferramentas usadas para verificar o portfólio e instalar fotografia real.
Nada aqui roda em produção — os sites continuam 100% estáticos.

## Preparação

```bash
# servir a raiz do repo (as ferramentas de browser esperam :8080)
python3 -m http.server 8080

# dependências (uma vez)
npm i playwright        # usa o Chromium de /opt/pw-browsers/chromium
pip install pillow      # só para o photo-pipeline
```

Variáveis opcionais: `BASE_URL` (default `http://localhost:8080`),
`CHROMIUM_PATH` (default `/opt/pw-browsers/chromium`).

## Verificação

| Comando | O que cobre |
|---|---|
| `node tools/verify-sites.js` | Todas as variantes em `sites/*/*/` (descoberta dinâmica), index + gallery, desktop 1280 e mobile 390: conteúdo, um `h1`, links, imagens íntegras, overflow horizontal zero, links para o app com `?business=`, console/requests limpos. Páginas com carrossel `.hslider` ganham teste funcional (legenda troca, loop, dot ativo único). 404 em `assets/photos/*.jpg` é tolerado — é o miss projetado do padrão drop-in com fallback SVG. |
| `node tools/verify-app.js` | O app de gestão: 4 negócios × 9 rotas, rotas de detalhe, booking end-to-end, quick actions (tecla N, Escape), pagamento de invoice, recebimento de PO com estoque conferido, tab bar/FAB mobile. |
| `node tools/linkcheck.js` | Toda referência local (`href`/`src`) de todo HTML do repo resolve para um arquivo existente. Pega exatamente a classe de bug dos `data-*.js` renomeados. |

Os três terminam com exit code ≠ 0 em falha — servem de gate antes de PR.

## Captura

```bash
node tools/capture.js <url> <out.jpg> [width=1280] [deviceScaleFactor=0.7]
```

Print de página inteira que rola a página antes (os sites revelam seções via
`IntersectionObserver` — captura ingênua sai com blocos em branco).

## Pipeline de fotos (Pexels)

Chave **só** via ambiente: `PEXELS_API_KEY` (criar grátis em pexels.com/api).
Licença Pexels: uso comercial livre, sem atribuição obrigatória — mesmo assim
a procedência de cada foto é registrada no `PHOTOS.md` da pasta de destino.

```bash
# 1. descrever slots desejados (ver docstring do script p/ formato)
PEXELS_API_KEY=... python3 tools/photo-pipeline.py search slots.json
# 2. olhar .photo-pipeline/sheet-*.jpg e escolher em picks.json
python3 tools/photo-pipeline.py install picks.json
```

Instala em `<alvo>/assets/photos/<slot>.jpg` (≤1600px, JPEG progressivo q82)
e anota a procedência. O diretório de trabalho `.photo-pipeline/` é ignorado
pelo git. Critério de curadoria: foto ruim não entra — slot sem foto boa fica
com a ilustração SVG (o `onerror` das páginas cuida do fallback).
